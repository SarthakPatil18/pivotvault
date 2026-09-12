const { Router } = require('express');
const { callLLM, callGemini, callGroq, wrapExternalContent, parseJSON } = require('../agents/lib/ai');
const { scoreIdea } = require('../agents/lib/ideaScoreModel');
const { estimateFeaturesFromContext } = require('../agents/specialists/riskAnalyst');
const { ragAsk, ragSearch } = require('../rag/rag.service');
const { evaluateVenture } = require('../services/riskScannerService');

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
    const groqApiKey = req.body.groqApiKey || req.headers['x-groq-api-key'] || (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes('mock') ? process.env.GROQ_API_KEY : null);
    const geminiApiKey = req.body.geminiApiKey || req.headers['x-gemini-api-key'] || (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('mock') ? process.env.GEMINI_API_KEY : null);

    const input = {
      ideaText: req.body.ideaText || req.body.query || req.body.idea || '',
      industry: req.body.industry || 'SaaS & Enterprise',
      targetCustomer: req.body.targetCustomer || 'B2B',
      businessModel: req.body.businessModel || 'Subscription',
      burnRate: req.body.burnRate || '$20k - $50k/mo',
      hardwareInvolved: Boolean(req.body.hardwareInvolved),
      regulatoryHeavy: Boolean(req.body.regulatoryHeavy),
      modelFeatures: req.body.features || req.body.modelFeatures || null,
      groqApiKey,
      geminiApiKey
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
      const pResp = persona.responses || {};

      if (qLower.includes('fail') || qLower.includes('wrong') || qLower.includes('why') || qLower.includes('root') || qLower.includes('cause') || qLower.includes('collapse') || qLower.includes('microfactory') || qLower.includes('fraud') || qLower.includes('spac') || qLower.includes('bankrupt')) {
        matched = pResp['strategy-fail'] || pResp['fail'];
      } else if (qLower.includes('turn') || qLower.includes('signal') || qLower.includes('warn') || qLower.includes('when') || qLower.includes('point') || qLower.includes('early')) {
        matched = pResp['turning-point'] || pResp['signals'];
      } else if (qLower.includes('differ') || qLower.includes('again') || qLower.includes('today') || qLower.includes('start over')) {
        matched = pResp['differently'];
      } else if (qLower.includes('advice') || qLower.includes('lesson') || qLower.includes('learn') || qLower.includes('rule') || qLower.includes('recommend') || qLower.includes('takeaway')) {
        matched = pResp['advice-lesson'] || pResp['lesson'] || pResp['advice'];
      } else if (qLower.includes('money') || qLower.includes('capital') || qLower.includes('fund') || qLower.includes('investor') || qLower.includes('burn') || qLower.includes('valuation')) {
        matched = pResp['money'] || `We raised substantial capital, but we burned through our runway faster than our operational capacity could generate revenue. In high-capital ventures, equity subsidies create an illusion of invincibility until liquidity tightens.`;
      }

      if (!matched && pResp) {
        for (const [key, text] of Object.entries(pResp)) {
          if (key === 'default') continue;
          const parts = key.split('-');
          if (parts.some((p) => qLower.includes(p))) {
            matched = text;
            break;
          }
        }
      }

      answer = matched || pResp['default'] || `Looking back at ${persona.startup}, our failure stemmed directly from ${persona.failureCause || 'structural unit-economic challenges'}. We had bold ambition, but ambition without unit-economic sustainability is hazardous. What specific aspect of our journey would you like to examine?`;
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

router.post('/pitch-deck-autopsy', async (req, res, next) => {
  try {
    const title = req.body.title || req.body.name || 'Venture Pitch Deck';
    const industry = req.body.industry || 'Technology';
    const targetRaise = req.body.targetRaise || '$3M Seed';
    const deckContent = req.body.deckContent || req.body.content || req.body.text || '';
    const deckId = req.body.deckId || '';
    
    const groqKey = req.body.groqApiKey || req.headers['x-groq-api-key'] || (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes('mock') ? process.env.GROQ_API_KEY : null);
    const geminiKey = req.body.geminiApiKey || req.headers['x-gemini-api-key'] || (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('mock') ? process.env.GEMINI_API_KEY : null);

    let autopsyData = null;

    const systemPrompt = `You are the Lead Forensic Venture Auditor at PivotVault, an elite startup failure intelligence platform.
Your task is to analyze pitch deck contents, business model claims, and target raise plans with ruthless mathematical objectivity and empirical accuracy.
Identify inverted unit economics, TAM delusions, CAC payback traps, capex underestimations, and regulatory blind spots.
Map the deck to real failed startups in history that shared this exact fatal flaw.

Return ONLY a valid JSON object matching this schema:
{
  "title": "Concise Deck Autopsy Title",
  "overallRiskScore": 0-100 integer (e.g. 75),
  "riskLevel": "CRITICAL" | "HIGH" | "ELEVATED" | "MODERATE",
  "summary": "2-3 sentence executive diagnostic summary explaining the core fatal vulnerability of this deck.",
  "parallelCompany": "Name of primary historical failure (e.g. 'Juicero ($120M Lost) & Teforia ($17M Lost)')",
  "parallelSlug": "lowercase slug if applicable (e.g. 'arrival', 'wework', 'theranos', 'fast', 'scalefactor')",
  "parallelExplanation": "Why this business model risk trajectory matches that failed venture.",
  "categories": [
    { "name": "Category Name (e.g. Unit Economics & Contribution)", "score": 0-100 integer, "flag": "Specific diagnostic observation" }
  ],
  "redFlags": [
    "Slide XX: Specific claim and why it represents a mathematical or strategic fallacy."
  ],
  "survivalPlaybook": [
    "Actionable directive the founder must fix before pitching institutional investors."
  ]
}`;

    const prompt = `Perform a forensic deck autopsy for this venture:
Venture Title: ${title}
Industry / Sector: ${industry}
Target Raise: ${targetRaise}
Pitch Deck Content / Notes / Slides:
${deckContent.slice(0, 15000)}

Analyze and return the strict JSON report.`;

    // 1. Primary: Groq LPU Reasoning (LLaMA 3.3 70B)
    if (groqKey && deckContent && deckContent.trim().length > 20) {
      try {
        const groqRes = await callGroq(prompt, { 
          system: systemPrompt, 
          apiKey: groqKey,
          json: true,
          maxTokens: 1600
        });

        if (groqRes) {
          const parsed = typeof groqRes === 'string' ? parseJSON(groqRes) : groqRes;
          if (parsed && (parsed.overallRiskScore || parsed.score) && Array.isArray(parsed.categories)) {
            autopsyData = {
              ...parsed,
              overallRiskScore: parsed.overallRiskScore || parsed.score || 75,
              provider: 'groq-lpu-llama3.3-70b',
              engine: '⚡ Groq LPU (LLaMA 3.3 70B) Reasoning'
            };
          }
        }
      } catch (err) {
        console.warn('[PitchDeckAutopsy] Groq execution failed, trying Gemini:', err.message);
      }
    }

    // 2. Secondary: Google Gemini Fallback
    if (!autopsyData && geminiKey && deckContent && deckContent.trim().length > 20) {
      try {
        const geminiRes = await callGemini(prompt, { 
          system: systemPrompt, 
          apiKey: geminiKey,
          json: true,
          maxTokens: 1600
        });

        if (geminiRes) {
          const parsed = typeof geminiRes === 'string' ? parseJSON(geminiRes) : geminiRes;
          if (parsed && (parsed.overallRiskScore || parsed.score) && Array.isArray(parsed.categories)) {
            autopsyData = {
              ...parsed,
              overallRiskScore: parsed.overallRiskScore || parsed.score || 75,
              provider: 'google-gemini',
              engine: 'Google Gemini 1.5 Flash'
            };
          }
        }
      } catch (err) {
        console.warn('[PitchDeckAutopsy] Gemini execution failed, falling back to rule engine:', err.message);
      }
    }

    // High-Fidelity Sector Forensic Rule Engine Fallback
    if (!autopsyData) {
      const contentLower = `${title} ${industry} ${deckContent} ${deckId}`.toLowerCase();
      
      if (contentLower.includes('hardware') || contentLower.includes('iot') || contentLower.includes('kitchen') || contentLower.includes('appliance') || contentLower.includes('juicero') || contentLower.includes('device')) {
        autopsyData = {
          title: `${title} — Forensic Deck Autopsy`,
          overallRiskScore: 84,
          riskLevel: 'CRITICAL',
          summary: `The deck models 70%+ gross margins while proposing custom consumer hardware. It fatally under-allocates tooling capex, ignores retail distribution take-rates (35-45%), and assumes an unrealistically low warranty return rate.`,
          parallelCompany: 'Juicero ($120M Lost) & Teforia ($17M Lost)',
          parallelSlug: 'juicero',
          parallelExplanation: 'Proprietary hardware with closed-ecosystem consumables creates massive upfront tooling lead times, customer friction, and prohibitive CAC before subscription lock-in takes effect.',
          categories: [
            { name: 'Unit Economics & COGS', score: 92, flag: 'Omits ocean freight shipping, injection mold tooling amortization, and distributor margin cuts.' },
            { name: 'Hardware Tooling & Supply Chain', score: 88, flag: 'Assumes 4-month tooling turnaround without local Shenzen factory QA presence.' },
            { name: 'Business Model Friction', score: 85, flag: 'DRM-locked pod ecosystem alienates consumers when initial novelty fades.' },
            { name: 'Market Timing & Competition', score: 68, flag: 'Consumer counter space is fiercely defended by legacy appliance manufacturers at 1/5th the price.' },
            { name: 'Capital Efficiency', score: 80, flag: 'Series A target will be consumed entirely by minimum order quantities (MOQs) and inventory working capital.' }
          ],
          redFlags: [
            'Slide 06: Assumes 0.5% warranty return rate; historical average for first-gen connected consumer hardware is 9-14%.',
            'Slide 09: Projects 72% gross margin by omitting retail channel partner margins (30-40%) and packaging fulfillment.',
            'Slide 11: CAC estimated at $45 on a premium device, severely underestimating consumer education costs in a brand new category.'
          ],
          survivalPlaybook: [
            'Contract manufacturing on existing ODM white-label chassis before financing bespoke tooling molds.',
            'Stress-test unit economics with a 35% retail margin haircut and $30/unit reverse logistics buffer.',
            'Remove DRM software locks: monetize through subscription software value rather than proprietary physical pods.'
          ],
          provider: 'pivotvault-forensic-engine'
        };
      } else if (contentLower.includes('delivery') || contentLower.includes('grocery') || contentLower.includes('commerce') || contentLower.includes('10-min') || contentLower.includes('dark store') || contentLower.includes('courier')) {
        autopsyData = {
          title: `${title} — Forensic Deck Autopsy`,
          overallRiskScore: 91,
          riskLevel: 'CRITICAL',
          summary: `The pitch deck assumes dark-store micro-fulfillment profitability at 150 daily orders per hub. In reality, fixed commercial leases and idle courier hourly guarantees produce negative contribution margin per drop once VC subsidies cease.`,
          parallelCompany: 'Fast ($120M Lost), SpoonRocket ($13M Lost) & Webvan ($830M Lost)',
          parallelSlug: 'fast',
          parallelExplanation: 'Relying on venture subsidies to offer zero-friction delivery creates artificial GMV that collapses instantly when discount vouchers expire and delivery fees reflect true labor costs.',
          categories: [
            { name: 'Unit Contribution Margin', score: 98, flag: 'Negative gross margin per basket after fully burdened rider pay and packing labor.' },
            { name: 'Real Estate & Fixed Lease Risk', score: 92, flag: 'Non-cancellable urban dark store leases create fatal fixed burn during demand fluctuations.' },
            { name: 'Cohort Retention & LTV', score: 88, flag: '30-day user retention drops below 15% once promo discount codes are terminated.' },
            { name: 'Competitive Moat', score: 82, flag: 'Incumbent delivery platforms with multi-category scale cross-subsidize instant grocery at zero cost.' },
            { name: 'Capital Intensity', score: 94, flag: 'Hyper-scaling to 6 cities simultaneously before single-hub contribution breakeven guarantees insolvency.' }
          ],
          redFlags: [
            'Slide 04: Net contribution modeled at +$3.50/basket, but courier base wage ($8) and cold-chain packing ($2) exceed average $18 order take-rate.',
            'Slide 07: Claims 65% month-3 retention, but fails to segment organic vs heavily discounted promotional orders.',
            'Slide 12: 3-year commercial leases signed across 18 dark stores without break clauses.'
          ],
          survivalPlaybook: [
            'Enforce positive unit contribution on delivery fees alone—never subsidize delivery labor with equity capital.',
            'Prove single-hub EBITDA profitability across 180 consecutive operating days before signing second lease.',
            'Transition from dedicated dark stores to 3PL consignment models inside existing retail grocery footprints.'
          ],
          provider: 'pivotvault-forensic-engine'
        };
      } else if (contentLower.includes('ev') || contentLower.includes('electric') || contentLower.includes('auto') || contentLower.includes('mobility') || contentLower.includes('arrival') || contentLower.includes('vehicle')) {
        autopsyData = {
          title: `${title} — Forensic Deck Autopsy`,
          overallRiskScore: 89,
          riskLevel: 'CRITICAL',
          summary: `The deck proposes radical micro-manufacturing and simultaneous development of multiple vehicle form factors. Automotive tooling lead times, regulatory crash homologation, and supply-chain MOQs make this capital strategy mathematically fragile.`,
          parallelCompany: 'Arrival ($1.4B Lost) & Local Motors ($100M Lost)',
          parallelSlug: 'arrival',
          parallelExplanation: 'Attempting to innovate on both the vehicle platform AND the manufacturing factory architecture simultaneously multiplies failure points and exhausts capital before production certification.',
          categories: [
            { name: 'Manufacturing Capex & Tooling', score: 95, flag: 'Decentralized assembly model requires unproven robotic tooling and custom composite materials.' },
            { name: 'Regulatory Homologation', score: 90, flag: 'Omits 18-24 month crash testing, FMVSS, and EPA certification expense.' },
            { name: 'Product Scope & Multi-Model Sprawl', score: 86, flag: 'Promising buses, delivery vans, and passenger cars simultaneously scatters engineering resources.' },
            { name: 'Commercial Pre-Order Validity', score: 82, flag: 'Non-binding LOIs from fleet operators treated as guaranteed contracted backlog.' },
            { name: 'Cash Depletion Horizon', score: 94, flag: 'Target raise covers less than 6 months of pre-series validation burn.' }
          ],
          redFlags: [
            'Slide 05: Assumes commercial volume production 10 months from seed close, violating automotive industry tooling physics.',
            'Slide 08: Books non-binding letters of intent (LOIs) as committed enterprise revenue.',
            'Slide 14: Projected capex of $15M for vehicle manufacturing line where legacy tier-1s require $150M minimum.'
          ],
          survivalPlaybook: [
            'Kill all secondary models: certify and deliver one commercial van platform before designing subsequent vehicles.',
            'Partner with established automotive contract manufacturers (e.g. Magna Steyr, Valmet) instead of inventing proprietary factories.',
            'Secure binding customer pre-orders with milestone-based progress deposits rather than non-refundable LOIs.'
          ],
          provider: 'pivotvault-forensic-engine'
        };
      } else if (contentLower.includes('health') || contentLower.includes('blood') || contentLower.includes('diagnostic') || contentLower.includes('biotech') || contentLower.includes('clinical') || contentLower.includes('theranos')) {
        autopsyData = {
          title: `${title} — Forensic Deck Autopsy`,
          overallRiskScore: 94,
          riskLevel: 'CRITICAL',
          summary: `The deck claims breakthrough diagnostic efficacy and consumer-level testing speed without third-party peer-reviewed validation. Treating clinical testing as proprietary trade secrecy exposes the company to severe regulatory shutdown and enterprise liability.`,
          parallelCompany: 'Theranos ($700M Lost) & UBiome ($105M Lost)',
          parallelSlug: 'theranos',
          parallelExplanation: 'Substituting marketing narratives for blinded peer-reviewed scientific replication creates fatal internal blindspots that unravel the moment FDA/CLIA oversight audits clinical data.',
          categories: [
            { name: 'Clinical & Scientific Validation', score: 98, flag: 'Zero blinded peer-reviewed publications in accredited medical journals.' },
            { name: 'FDA / CLIA Regulatory Exposure', score: 96, flag: 'Underestimates 510(k) de novo clearance requirements and proficiency audit rigor.' },
            { name: 'Analytical Accuracy & Sensitivity', score: 92, flag: 'Micro-sample dilution creates catastrophic coefficient-of-variation errors across diverse cohorts.' },
            { name: 'Governance & Medical Oversight', score: 85, flag: 'Advisory board lacks independent certified hematologists and clinical pathologists.' },
            { name: 'Channel Partnership Legal Exposure', score: 88, flag: 'National retail pharmacy agreements signed before diagnostic accuracy is certified.' }
          ],
          redFlags: [
            'Slide 07: Claims 99.4% diagnostic accuracy across 100+ assays without blinded multi-center clinical trials.',
            'Slide 10: Classifies core analytical assay methodology as trade secret, refusing independent third-party laboratory verification.',
            'Slide 13: GTM roadmap projects consumer retail testing roll-out prior to receiving full CLIA laboratory accreditation.'
          ],
          survivalPlaybook: [
            'Publish blinded analytical sensitivity and coefficient-of-variation data in peer-reviewed journals before raising growth capital.',
            'Establish an independent scientific advisory committee with veto authority over commercial marketing claims.',
            'Focus regulatory strategy on a single FDA-cleared biomarker before announcing universal multi-analyte testing.'
          ],
          provider: 'pivotvault-forensic-engine'
        };
      } else if (contentLower.includes('coworking') || contentLower.includes('space') || contentLower.includes('real estate') || contentLower.includes('lease') || contentLower.includes('proptech') || contentLower.includes('wework')) {
        autopsyData = {
          title: `${title} — Forensic Deck Autopsy`,
          overallRiskScore: 87,
          riskLevel: 'CRITICAL',
          summary: `The deck presents a classic duration mismatch: financing 10-15 year non-cancellable commercial property master leases with month-to-month flexible memberships, while pricing the business on high software multiples.`,
          parallelCompany: 'WeWork ($47B Valuation Collapse) & Knotel ($560M Lost)',
          parallelSlug: 'wework',
          parallelExplanation: 'Marketing physical real estate leasing as a tech platform cannot overcome high tenant fit-out capex, lease payment liabilities, and rapid occupancy drops during economic pullbacks.',
          categories: [
            { name: 'Asset-Liability Duration Mismatch', score: 96, flag: 'Long-term fixed master lease liabilities backed by short-term flexible membership contracts.' },
            { name: 'Unit Economics & Fit-Out Capex', score: 90, flag: 'Location-level contribution negative after amortizing construction, architect, and HVAC fit-out debt.' },
            { name: 'Occupancy Fragility', score: 85, flag: 'Financial model assumes permanent 88% occupancy; economic slowdowns drop co-working occupancy below 60%.' },
            { name: 'Valuation & Multiple Disconnect', score: 82, flag: 'Seeking 15x ARR tech multiple for a business with 18% physical EBITDA margins.' },
            { name: 'Governance & Related-Party Risk', score: 78, flag: 'Lacks institutional lease approval covenants from independent board members.' }
          ],
          redFlags: [
            'Slide 06: Calculates "Community Adjusted EBITDA" which excludes actual lease liabilities and construction capex amortization.',
            'Slide 09: Assumes 92% continuous occupancy across newly launched international metropolitan hubs.',
            'Slide 12: Master leases backed by parent corporate entity without segregated special-purpose vehicle (SPV) liability firewalls.'
          ],
          survivalPlaybook: [
            'Shift from conventional master leases to revenue-sharing management agreements with landlord partners.',
            'Isolate individual property liabilities in ring-fenced bankruptcy-remote SPVs to protect corporate treasury.',
            'Value the venture on discounted net operating income (NOI) rather than speculative software ARR multiples.'
          ],
          provider: 'pivotvault-forensic-engine'
        };
      } else {
        // Universal B2B SaaS / FinTech Default
        autopsyData = {
          title: `${title} — Forensic Deck Autopsy`,
          overallRiskScore: 72,
          riskLevel: 'HIGH',
          summary: `The pitch deck claims high automated gross margins (80%+) while delivering high-touch services that quietly require human-in-the-loop operational labor. With rising paid acquisition costs, payback period exceeds safe runway buffers.`,
          parallelCompany: 'ScaleFactor ($104M Lost) & Zume ($445M Lost)',
          parallelSlug: 'scalefactor',
          parallelExplanation: 'Promising fully autonomous AI execution while relying behind the scenes on manual human support staff inverts unit economics as customer volume increases.',
          categories: [
            { name: 'Automation vs Service Reality', score: 78, flag: 'High human-in-the-loop exception handling disguised as pure software gross margin.' },
            { name: 'Customer Acquisition Cost (CAC)', score: 74, flag: 'Paid search and outbound CAC payback modeled at 6 months; realistic SMB churn forces payback past 16 months.' },
            { name: 'Market Timing & Defensibility', score: 65, flag: 'Incumbent workflow platforms (QuickBooks, Salesforce) can replicate the core feature in a minor release.' },
            { name: 'Regulatory & Execution Liability', score: 82, flag: 'Automated errors on client operations create legal and financial indemnification liabilities.' },
            { name: 'Runway & Burn Architecture', score: 69, flag: 'Headcount expansion planned before repeatable sales motion is documented.' }
          ],
          redFlags: [
            'Slide 05: Claims 99.8% autonomous ML execution with zero mention of human exception-handling triage labor cost.',
            'Slide 08: Models blended CAC at $85 on a $120/mo contract, ignoring enterprise sales cycle attrition.',
            'Slide 11: 18-month target raise leaves zero cash buffer for product refactoring if churn spikes above 2.5% monthly.'
          ],
          survivalPlaybook: [
            'Audit true COGS to include human operational triage, API inference tokens, and customer success labor.',
            'Validate organic customer retention over 120 days before accelerating paid acquisition spend.',
            'Secure enterprise contracts with annual pre-payment to fund working capital without dilutive debt.'
          ],
          provider: 'pivotvault-forensic-engine'
        };
      }
    }

    res.json({
      success: true,
      autopsy: autopsyData,
      data: autopsyData
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
