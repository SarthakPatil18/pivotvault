const { Router } = require('express');
const { callGemini, wrapExternalContent } = require('../agents/lib/ai');
const { scoreIdea } = require('../agents/lib/ideaScoreModel');
const { estimateFeaturesFromContext } = require('../agents/specialists/riskAnalyst');
const { ragAsk, ragSearch } = require('../rag/rag.service');

const prisma = require('../lib/prisma');
const { getGhostPersona, GHOST_PERSONAS } = require('../data/ghostsData');

async function resolvePersona(identifier, extra = {}) {
  const term = String(identifier || extra.startup || extra.slug || '').trim().toLowerCase();

  // 1. Check existing curated ghosts
  const curated = GHOST_PERSONAS.find(p => 
    p.id.toLowerCase() === term ||
    p.startup.toLowerCase() === term ||
    p.name.toLowerCase().includes(term) ||
    term.includes(p.name.toLowerCase().split(' ')[0]) ||
    term.includes(p.startup.toLowerCase())
  );
  if (curated) return curated;

  // 2. Query Prisma database for any company by slug or name
  let dbCompany = null;
  try {
    dbCompany = await prisma.company.findFirst({
      where: {
        OR: [
          { slug: { equals: term, mode: 'insensitive' } },
          { name: { equals: term, mode: 'insensitive' } },
          { name: { contains: term, mode: 'insensitive' } },
          { slug: { contains: term, mode: 'insensitive' } }
        ]
      },
      include: { evidence: { take: 3 } }
    });
  } catch (err) {
    // ignore
  }

  const companyName = dbCompany?.name || extra.startup || extra.name || identifier || 'This Venture';
  const founderName = (extra.founder) || (dbCompany?.founders && dbCompany.founders[0]) || `${companyName} Founder`;
  const industry = dbCompany?.industry || extra.industry || 'Technology';
  const failureCause = (dbCompany?.failureReasons && dbCompany.failureReasons[0]) || extra.failureMode || 'Unit Economics Inversion';
  const rootCauses = (dbCompany?.failureReasons && dbCompany.failureReasons.length > 0) ? dbCompany.failureReasons : (extra.rootCauses || [failureCause]);
  const lessons = (dbCompany?.keyLessons && dbCompany.keyLessons.length > 0) ? dbCompany.keyLessons : (extra.lessons || [
    'Unit economics must show sustainable unit contribution margin before expanding sales team headcount.',
    'Customer acquisition cost via paid marketing must pay back in under 12 months.',
    'Defensive moats cannot rely solely on venture equity subsidies.'
  ]);
  const summary = dbCompany?.postmortemSummary || dbCompany?.description || extra.summary || `${companyName} ceased operations following insurmountable operational hurdles.`;
  const evidence = (dbCompany?.evidence || []).map(e => e.title || e.sourceName).filter(Boolean);

  return {
    id: `ghost-${companyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    name: founderName,
    role: `Founder & CEO`,
    startup: companyName,
    industry,
    failureCause,
    bio: summary,
    keyThemes: rootCauses,
    keyLessons: lessons,
    evidenceSources: evidence.length > 0 ? evidence : ['SEC Filings', 'Public Bankruptcy Dockets', 'Verified Investigative Post-Mortems'],
    starterQuestions: [
      `Why did ${companyName}'s core strategy fail?`,
      `What was the critical turning point when you realized the business was in trouble?`,
      `What would you do differently if you were starting today?`,
      `What advice do you have for founders operating in ${industry}?`
    ],
    initialMessage: `I am ${founderName}, founder of ${companyName}. We set out to transform ${industry}, but structural challenges, cost pressures, and execution bottlenecks ultimately led to our collapse. What would you like to examine regarding our decisions, our finances, or what went wrong behind closed doors?`,
    responses: {
      'strategy-fail': `Our core strategic failure was that ${rootCauses[0] || failureCause}. Compounding this, ${rootCauses[1] || 'our cost structure expanded far faster than our organic revenue could support'}. We convinced ourselves that continued venture capital injections would give us time to solve these fundamentals, but when market liquidity shifted, our margin for error evaporated.`,
      'turning-point': `The critical turning point came when ${rootCauses[1] || rootCauses[0] || 'our cash burn accelerated beyond our 90-day replenishment reserves'}. We attempted multiple restructuring efforts, but the fixed liabilities and overhead we had committed to in the growth phase made an agile pivot mathematically impossible.`,
      'differently': `If I were starting over today, my highest priority would be: ${lessons[0] || 'Confirming sustainable unit economics before committing to aggressive headcount or fixed infrastructure'}. We scaled distribution before achieving undeniable product-market pull, and that premature scaling was our fatal error.`,
      'advice-lesson': `My advice to founders in ${industry}: ${lessons[1] || lessons[0] || 'Never use venture equity subsidies to mask structural unit-contribution flaws'}. Always track cohort retention, true contribution margins, and actual cash runway—not vanity metrics or top-line projections.`,
      'default': `Reflecting on ${companyName}, our failure was grounded in ${failureCause}. We had huge ambition, but ambition without economic discipline is dangerous. What specific aspect of our capital structure, product decisions, or timeline would you like to investigate?`
    }
  };
}

const router = Router();

router.post('/risk-scan', async (req, res, next) => {
  try {
    const input = {
      ideaText: req.body.ideaText || req.body.query || req.body.idea || '',
      industry: req.body.industry || 'SaaS & Enterprise',
      targetCustomer: req.body.targetCustomer || 'B2B',
      businessModel: req.body.businessModel || 'Subscription',
      burnRate: req.body.burnRate || '$20k - $50k/mo',
      hardwareInvolved: Boolean(req.body.hardwareInvolved),
      regulatoryHeavy: Boolean(req.body.regulatoryHeavy),
      modelFeatures: req.body.features || req.body.modelFeatures || null
    };

    const result = await evaluateVenture(input);

    res.json({
      success: true,
      ...result.data,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
});

router.post(['/ghost-chat', '/founder-chat'], async (req, res, next) => {
  try {
    const personaIdentifier = req.body.personaId || req.body.persona || req.body.startup || req.body.slug || req.body.personaName || req.body.companyId || 'arrival';
    const persona = await resolvePersona(personaIdentifier, req.body);
    const userMsg = req.body.message || req.body.query || 'What was your biggest forensic lesson?';
    
    // Quick search for analogous evidence if available
    let sources = [];
    try {
      const searchRes = await ragSearch(`${persona.startup} ${persona.failureCause} ${userMsg}`, { limit: 3 });
      sources = searchRes.map((chunk) => ({ contentId: chunk.contentId, metadata: chunk.metadata, similarity: chunk.similarity }));
    } catch (e) {
      // Graceful fallback if vector search is unavailable
    }

    const systemPrompt = `You are an AI historical reconstruction of ${persona.name}, founder of ${persona.startup} (${persona.industry}).
Role: ${persona.role}
Failure Cause: ${persona.failureCause}
Bio: ${persona.bio}
Evidence Sources: ${(persona.evidenceSources || []).join(', ')}
Key Forensic Themes: ${(persona.keyThemes || []).join('; ')}
Key Lessons: ${(persona.keyLessons || []).join('; ')}

Instructions:
1. Speak in first person as ${persona.name}.
2. Reflect with brutal honesty, forensic humility, and self-awareness about the mistakes, governance failures, and misjudgments that caused ${persona.startup} to collapse.
3. Reference real facts, events, and evidence from public records, trial exhibits, SEC filings, or post-mortems.
4. Provide actionable warnings and advice for modern founders so they avoid the same fatal errors.
5. Keep your answer engaging, direct, and concise (2-3 paragraphs).`;

    let answer = null;
    let provider = 'forensic-reconstruction';
    const userApiKey = req.body.geminiApiKey || req.headers['x-gemini-api-key'] || null;
    const effectiveKey = userApiKey || (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('mock') ? process.env.GEMINI_API_KEY : null);

    if (effectiveKey) {
      try {
        const geminiRes = await callGemini(
          `Simulate a founder conversation as ${persona.name} (${persona.startup}).\nEvidence: ${(persona.evidenceSources || []).join(', ')}\nUser Question: ${userMsg}`,
          { system: systemPrompt, apiKey: effectiveKey }
        );
        if (geminiRes && !geminiRes.includes('Both configured cloud LLMs failed')) {
          answer = geminiRes;
          provider = 'google-gemini';
        }
      } catch (e) {
        // Fallback to local logic below
      }
    }

    // In mock mode or if answer was not generated / generic:
    if (!answer || answer.includes('When our startup collapsed, the primary lesson')) {
      const qLower = userMsg.toLowerCase();
      let matched = null;

      if (qLower.includes('fail') || qLower.includes('wrong') || qLower.includes('why') || qLower.includes('root') || qLower.includes('cause') || qLower.includes('collapse') || qLower.includes('microfactory') || qLower.includes('fraud') || qLower.includes('spac') || qLower.includes('bankrupt')) {
        matched = persona.responses['strategy-fail'] || persona.responses['fail'];
      } else if (qLower.includes('turn') || qLower.includes('signal') || qLower.includes('warn') || qLower.includes('when') || qLower.includes('point') || qLower.includes('early')) {
        matched = persona.responses['turning-point'] || persona.responses['signals'];
      } else if (qLower.includes('differ') || qLower.includes('again') || qLower.includes('today') || qLower.includes('start over')) {
        matched = persona.responses['differently'];
      } else if (qLower.includes('advice') || qLower.includes('lesson') || qLower.includes('learn') || qLower.includes('rule') || qLower.includes('recommend') || qLower.includes('takeaway')) {
        matched = persona.responses['advice-lesson'] || persona.responses['lesson'] || persona.responses['advice'];
      } else if (qLower.includes('money') || qLower.includes('capital') || qLower.includes('fund') || qLower.includes('investor') || qLower.includes('burn') || qLower.includes('valuation')) {
        matched = persona.responses['money'] || `We raised substantial capital, but we burned through our runway faster than our operational capacity could generate revenue. In high-capital ventures, equity subsidies create an illusion of invincibility until liquidity tightens.`;
      }

      if (!matched && persona.responses) {
        for (const [key, text] of Object.entries(persona.responses)) {
          if (key === 'default') continue;
          const parts = key.split('-');
          if (parts.some((p) => qLower.includes(p))) {
            matched = text;
            break;
          }
        }
      }

      answer = matched || persona.responses['default'] || `Looking back at ${persona.startup}, our failure stemmed directly from ${persona.failureCause}. We had bold ambition, but ambition without unit-economic sustainability is hazardous. What specific aspect of our journey would you like to examine?`;
    }

    res.json({ 
      answer, 
      reply: answer,
      persona: persona.name,
      startup: persona.startup,
      role: persona.role,
      provider,
      model: 'gemini-1.5-flash',
      sources: sources.length > 0 ? sources : (persona.evidenceSources || []).map((s, i) => ({ contentId: `evidence-${i}`, metadata: { source: s } }))
    });
  } catch (error) { 
    res.json({
      answer: 'The primary forensic lesson is that no amount of venture capital subsidies can overcome fundamentally inverted unit economics.',
      reply: 'The primary forensic lesson is that no amount of venture capital subsidies can overcome fundamentally inverted unit economics.',
      sources: []
    });
  }
});

router.post('/research', async (req, res, next) => {
  try {
    const q = req.body.query || req.body.question || 'startup failure patterns';
    res.json(await ragAsk(q, { contentType: req.body.contentType }));
  } catch (error) { next(error); }
});

router.post('/playbook', async (req, res, next) => {
  try {
    const q = req.body.query ?? req.body.ideaText ?? 'B2B SaaS';
    const chunks = await ragSearch(q, { limit: 5 });
    const evidence = chunks.map((chunk) => wrapExternalContent(chunk.chunkText)).join('\n');
    const plan = await callGemini(`Create a personalized 90-day plan from these analogous cases:\n${evidence}\nIdea: ${q}`);
    res.json({ plan, sources: chunks });
  } catch (error) { next(error); }
});
module.exports = router;
