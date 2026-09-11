/**
 * Venture Risk Profile Service
 * Uses Groq / Gemini (with deterministic grounded fallback) to extract an intelligent,
 * context-aware, founder-friendly venture profile.
 * 
 * CORE PRINCIPLES:
 * 1. The Idea is the primary source of truth. Never let accidental form defaults override the actual concept.
 * 2. Adaptive relevance: Not every startup has regulatory, clinical, or hardware risks.
 * 3. Human advisor language: Avoid internal ML/forensic jargon.
 * 4. Zero fabrication: Never invent metrics, companies, or citations.
 */

const { callGroq, callGemini, parseJSON } = require('../agents/lib/ai');

const ALL_DIMENSIONS = [
  'customerNeed',
  'differentiation',
  'competition',
  'productMarketFit',
  'businessModel',
  'unitEconomics',
  'executionComplexity',
  'scalability',
  'marketTiming',
  'capitalIntensity',
  'regulatoryExposure',
  'defensibility'
];

/**
 * Detects if form fields contradict the text of the idea.
 * The idea text is ALWAYS the primary source of truth.
 */
function sanitizeVentureContext({ ideaText, industry, targetCustomer, businessModel, burnRate, hardwareInvolved, regulatoryHeavy }) {
  const text = (ideaText || '').toLowerCase();

  // Keyword indicators
  const hasHardwareWords = /\b(hardware|device|robot|robotics|sensor|machinery|chip|semiconductor|iot|physical product|wearable|manufactur)\b/i.test(text);
  const hasClinicalHealthWords = /\b(patient|clinical|fda|diagnost|therap|drug|medical device|biotech|telehealth|blood test|hospital)\b/i.test(text);
  const hasFintechWords = /\b(payment|banking|lending|credit|loan|crypto|wallet|fiat|custody|brokerage|insurance|fintech|securities|sec\b|fincen)\b/i.test(text);
  const hasMarketplaceWords = /\b(marketplace|two-sided|buyers and sellers|platform connecting|commission per transaction)\b/i.test(text);
  const isPureSoftware = /\b(app|saas|software|platform|copilot|dashboard|tool|extension|plugin|bot|ai-powered|productivity|crm|todo|task)\b/i.test(text) 
    && !hasHardwareWords && !hasClinicalHealthWords;

  // Resolve Contradictions: Idea text overrides checkboxes
  let cleanHardware = Boolean(hardwareInvolved);
  let cleanRegulatory = Boolean(regulatoryHeavy);
  let cleanIndustry = industry || 'SaaS & Enterprise';

  if (isPureSoftware && cleanHardware && !hasHardwareWords) {
    // User accidentally checked physical hardware for a software tool
    cleanHardware = false;
  }

  if (isPureSoftware && cleanRegulatory && !hasClinicalHealthWords && !hasFintechWords) {
    // User accidentally checked heavy regulatory compliance for a simple productivity tool
    cleanRegulatory = false;
  }

  // Determine realistic archetype from concept text
  let ventureType = 'B2B SaaS';
  if (hasClinicalHealthWords) {
    ventureType = 'Healthcare & Biotech';
    cleanIndustry = 'HealthTech & Biotech';
    cleanRegulatory = true;
  } else if (cleanHardware || hasHardwareWords) {
    ventureType = 'Consumer Hardware';
    cleanIndustry = 'Hardware & Robotics';
  } else if (hasFintechWords) {
    ventureType = 'FinTech';
    cleanIndustry = 'FinTech & Crypto';
    cleanRegulatory = true;
  } else if (hasMarketplaceWords || (businessModel && businessModel.includes('Marketplace'))) {
    ventureType = 'Marketplace';
  } else if (text.includes('consumer') || text.includes('social') || text.includes('game') || targetCustomer === 'B2C') {
    ventureType = 'Consumer Tech';
    cleanIndustry = 'Consumer Apps';
  } else {
    ventureType = 'SaaS & Software';
  }

  return {
    ideaText: ideaText.trim(),
    ventureType,
    industry: cleanIndustry,
    targetCustomer: targetCustomer || (text.includes('consumer') ? 'B2C' : 'B2B'),
    businessModel: businessModel || 'Subscription',
    burnRate: burnRate || '$20k - $50k/mo',
    hardwareInvolved: cleanHardware,
    regulatoryHeavy: cleanRegulatory
  };
}

/**
 * Determines which dimensions are genuinely relevant for a given venture type.
 * Irrelevant dimensions return 'not_applicable'.
 */
function getApplicableDimensions(ventureType, context) {
  switch (ventureType) {
    case 'Consumer Hardware':
      return [
        'capitalIntensity',
        'executionComplexity',
        'unitEconomics',
        'customerNeed',
        'differentiation',
        'competition'
      ];

    case 'Healthcare & Biotech':
      return [
        'regulatoryExposure',
        'executionComplexity',
        'customerNeed',
        'productMarketFit',
        'capitalIntensity',
        'defensibility'
      ];

    case 'FinTech':
      return [
        'regulatoryExposure',
        'unitEconomics',
        'competition',
        'customerNeed',
        'businessModel',
        'defensibility'
      ];

    case 'Marketplace':
      return [
        'unitEconomics',
        'productMarketFit',
        'competition',
        'customerNeed',
        'scalability',
        'differentiation'
      ];

    case 'Consumer Tech':
      return [
        'productMarketFit',
        'customerNeed',
        'differentiation',
        'competition',
        'marketTiming',
        'unitEconomics'
      ];

    case 'B2B SaaS':
    case 'SaaS & Software':
    default:
      return [
        'competition',
        'differentiation',
        'customerNeed',
        'productMarketFit',
        'businessModel',
        'unitEconomics'
      ];
  }
}

/**
 * Grounded deterministic fallback profiler in plain human language.
 */
function createDeterministicProfile(rawInput) {
  const ctx = sanitizeVentureContext(rawInput);
  const text = ctx.ideaText.toLowerCase();
  const applicable = getApplicableDimensions(ctx.ventureType, ctx);

  // Dimension vulnerability baseline (0-100, where higher = higher risk)
  const isHighBurn = ctx.burnRate.includes('150k') || ctx.burnRate.includes('500k');

  const dimensions = {};
  const dimensionStatus = {};
  const dimensionReasoning = {};

  for (const dim of ALL_DIMENSIONS) {
    if (!applicable.includes(dim)) {
      dimensions[dim] = 0;
      dimensionStatus[dim] = 'not_applicable';
      dimensionReasoning[dim] = 'Not applicable to this type of venture.';
      continue;
    }

    dimensionStatus[dim] = 'active';

    switch (dim) {
      case 'competition':
        dimensions[dim] = text.includes('todo') || text.includes('task') || text.includes('ai') ? 78 : 65;
        dimensionReasoning[dim] = 'Crowded category with established alternatives; getting users to switch from existing habits is challenging.';
        break;

      case 'differentiation':
        dimensions[dim] = text.includes('todo') || text.includes('simple') ? 74 : 60;
        dimensionReasoning[dim] = 'Feature additions alone rarely create lasting defensive moats without proprietary workflow locks or unique data.';
        break;

      case 'customerNeed':
        dimensions[dim] = text.includes('critical') || text.includes('must-have') ? 40 : 62;
        dimensionReasoning[dim] = 'Solves an existing friction, but you need to prove whether users view it as a must-have tool or just a nice-to-have.';
        break;

      case 'productMarketFit':
        dimensions[dim] = 68;
        dimensionReasoning[dim] = 'Pre-launch concept without verified retention or active organic customer referrals.';
        break;

      case 'businessModel':
        dimensions[dim] = ctx.businessModel.includes('Subscription') ? 48 : 62;
        dimensionReasoning[dim] = 'Subscription monetization is familiar, but conversion rates from free to paid will govern viability.';
        break;

      case 'unitEconomics':
        dimensions[dim] = isHighBurn ? 76 : 52;
        dimensionReasoning[dim] = isHighBurn
          ? 'High projected burn could exhaust cash reserves before customer acquisition costs stabilize.'
          : 'Low infrastructure overhead keeps gross margins healthy if customer acquisition costs remain modest.';
        break;

      case 'capitalIntensity':
        dimensions[dim] = ctx.hardwareInvolved ? 88 : (isHighBurn ? 78 : 34);
        dimensionReasoning[dim] = ctx.hardwareInvolved
          ? 'Requires significant capital for tooling, inventory, and supply chain commitments before revenue.'
          : 'Lightweight software architecture allows you to launch and validate with minimal upfront capital.';
        break;

      case 'executionComplexity':
        dimensions[dim] = ctx.hardwareInvolved ? 85 : (ctx.regulatoryHeavy ? 75 : 42);
        dimensionReasoning[dim] = ctx.hardwareInvolved
          ? 'Physical production, quality control, and shipping logistics introduce operational delays.'
          : 'Core software is technically feasible to build; execution will depend on distribution and design polish.';
        break;

      case 'regulatoryExposure':
        dimensions[dim] = ctx.regulatoryHeavy ? 84 : 20;
        dimensionReasoning[dim] = ctx.regulatoryHeavy
          ? 'Subject to formal regulatory compliance and legal oversight before full commercial launch.'
          : 'Standard digital software with low regulatory hurdles or compliance barriers.';
        break;

      default:
        dimensions[dim] = 50;
        dimensionReasoning[dim] = 'Moderate operational factor standard for early-stage startups.';
    }
  }

  // 4-Part Founder Diagnosis
  const whatWeThink = `This is a ${ctx.ventureType} concept aimed at ${ctx.targetCustomer} customers using a ${ctx.businessModel} model. The core value proposition centers on ${ctx.ideaText.slice(0, 100).trim()}.`;
  
  const whyItIsRisky = [
    `Competition & Differentiation: This market has many existing tools; convincing users to abandon their current habits will be the hardest hurdle.`,
    `Willingness to Pay: Users frequently expect simple productivity features for free unless directly tied to measurable revenue or time saved.`,
    isHighBurn ? `Burn Rate Pressure: Spending heavily before establishing clear user retention risks cash exhaustion.` : `Distribution Bottleneck: Without an existing audience or viral loop, acquiring new users may be slower than anticipated.`
  ];

  const whatLooksPromising = [
    ctx.hardwareInvolved ? `High physical product defensibility once manufacturing is established.` : `Low initial launch cost allows testing an MVP with minimal financial risk.`,
    `Focused single-problem proposition rather than trying to build a complex bloated tool.`
  ];

  const validateFirst = [
    `Interview 15 target users to see what tool they currently use and what would genuinely force them to switch.`,
    `Test a simple landing page or prototype with pricing to measure real willingness to pay before writing full code.`,
    `Identify at least one low-cost distribution channel (niche community, newsletter, or workflow integration) that works consistently.`
  ];

  const practicalQuestions = [
    `Will users actually pay for this, or do they expect existing free alternatives to suffice?`,
    `Can you acquire new customers affordably without relying purely on expensive paid ads?`,
    `Is the product sticky enough that users will keep using it past their first 30 days?`
  ];

  return {
    ventureType: ctx.ventureType,
    industry: ctx.industry,
    targetCustomer: ctx.targetCustomer,
    businessModel: ctx.businessModel,
    coreValueProposition: ctx.ideaText.slice(0, 140),
    dimensions,
    dimensionStatus,
    applicableDimensions: applicable,
    dimensionReasoning,
    whatWeThink,
    whyItIsRisky,
    whatLooksPromising,
    validateFirst,
    practicalQuestions,
    positiveSignals: whatLooksPromising,
    unknowns: practicalQuestions,
    primaryAssumptions: [
      'Target users feel enough friction with current options to try a new tool.',
      'Customer acquisition cost will remain low enough to support positive margins.',
      'Core user retention will remain stable beyond the initial curiosity phase.'
    ]
  };
}

/**
 * Main Profiler: Sends venture concept to Groq / Gemini with clear instructions
 * to act like an expert startup advisor writing in plain, understandable English.
 */
async function extractVentureProfile(rawInput) {
  const ctx = sanitizeVentureContext(rawInput);
  const applicableDimensions = getApplicableDimensions(ctx.ventureType, ctx);

  const prompt = `You are a veteran startup advisor and venture analyst for PivotVault.
Your goal is to give the founder honest, clear, and highly relevant feedback on their startup idea.
Speak directly to the founder in plain, natural, and friendly human language.
DO NOT use overly technical machine jargon like "structural vulnerability", "failure vector topology", or "venture architecture mechanics".
DO NOT invent competitors, fake revenue, false market numbers, or hallucinated facts.

CRITICAL INSTRUCTION ON RELEVANCE:
- Evaluate the actual idea entered by the founder: "${ctx.ideaText}"
- Startup Category: "${ctx.ventureType}" (${ctx.industry})
- Target Customer: "${ctx.targetCustomer}"
- Business Model: "${ctx.businessModel}"
- ONLY evaluate risk dimensions that ACTUALLY apply to this business.
- For non-applicable dimensions (e.g. manufacturing for pure software, or medical compliance for a to-do list), mark them "not_applicable".
- A simple software tool should NOT receive hardware or regulatory risks.

Return a STRICT JSON object with this exact structure:
{
  "ventureType": "${ctx.ventureType}",
  "whatWeThink": "1-3 plain English sentences explaining what you understand about this startup and its main premise.",
  "whyItIsRisky": [
    "2-4 concrete, idea-specific reasons why this specific business is risky in plain language."
  ],
  "whatLooksPromising": [
    "1-3 real positive aspects or advantages based on what was described."
  ],
  "validateFirst": [
    "2-4 practical, actionable steps or tests the founder should perform before investing heavily."
  ],
  "practicalQuestions": [
    "3-4 practical questions the founder has not answered yet (e.g. 'Will users pay $X?', 'Can you acquire users cheaply?')"
  ],
  "relevantDimensions": [
    ${applicableDimensions.map(d => `"${d}"`).join(', ')}
  ],
  "dimensionScores": {
    ${applicableDimensions.map(d => `"${d}": (integer 0-100, where 0=low risk, 50=normal baseline, 100=very high risk)`).join(',\n    ')}
  },
  "dimensionReasoning": {
    ${applicableDimensions.map(d => `"${d}": "1-2 sentences of idea-specific, founder-friendly explanation for why this score was given"`).join(',\n    ')}
  }
}`;

  try {
    const raw = await callGroq(prompt, { maxTokens: 1200, model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b' })
      .catch(() => callGemini(prompt, { maxTokens: 1200, json: true }));

    const parsed = parseJSON(raw);
    if (parsed && parsed.dimensionScores && typeof parsed.dimensionScores === 'object') {
      const dimensions = {};
      const dimensionStatus = {};
      const dimensionReasoning = {};

      const activeList = Array.isArray(parsed.relevantDimensions) && parsed.relevantDimensions.length > 0
        ? parsed.relevantDimensions
        : applicableDimensions;

      for (const dim of ALL_DIMENSIONS) {
        if (activeList.includes(dim) && parsed.dimensionScores[dim] !== undefined) {
          const val = Number(parsed.dimensionScores[dim]);
          dimensions[dim] = Number.isFinite(val) ? Math.min(99, Math.max(5, Math.round(val))) : 50;
          dimensionStatus[dim] = 'active';
          dimensionReasoning[dim] = parsed.dimensionReasoning?.[dim] || 'Evaluated based on current business model and competitive landscape.';
        } else {
          dimensions[dim] = 0;
          dimensionStatus[dim] = 'not_applicable';
          dimensionReasoning[dim] = 'Not applicable to this venture archetype.';
        }
      }

      return {
        ventureType: parsed.ventureType || ctx.ventureType,
        industry: ctx.industry,
        targetCustomer: ctx.targetCustomer,
        businessModel: ctx.businessModel,
        coreValueProposition: ctx.ideaText.slice(0, 140),
        dimensions,
        dimensionStatus,
        applicableDimensions: activeList,
        dimensionReasoning,
        whatWeThink: parsed.whatWeThink || `This is a ${ctx.ventureType} concept addressing ${ctx.targetCustomer} customers with a ${ctx.businessModel} model.`,
        whyItIsRisky: Array.isArray(parsed.whyItIsRisky) && parsed.whyItIsRisky.length > 0
          ? parsed.whyItIsRisky
          : ['Competition from established alternatives is your biggest hurdle.', 'Customer willingness to pay must be proven before building.'],
        whatLooksPromising: Array.isArray(parsed.whatLooksPromising) && parsed.whatLooksPromising.length > 0
          ? parsed.whatLooksPromising
          : ['Clear, focused proposition that can be prototyped quickly.'],
        validateFirst: Array.isArray(parsed.validateFirst) && parsed.validateFirst.length > 0
          ? parsed.validateFirst
          : ['Interview 10 potential users to verify active pain.', 'Test pricing with a simple landing page.'],
        practicalQuestions: Array.isArray(parsed.practicalQuestions) && parsed.practicalQuestions.length > 0
          ? parsed.practicalQuestions
          : ['Will customers pay for this solution?', 'How will you acquire users cost-effectively?'],
        positiveSignals: parsed.whatLooksPromising || ['Focused initial feature set.'],
        unknowns: parsed.practicalQuestions || ['Verified willingness to pay.'],
        primaryAssumptions: [
          'Target customers will switch from current tools.',
          'Unit economics remain positive as acquisition scales.'
        ]
      };
    }
  } catch (err) {
    console.warn('[VentureProfiler] External AI call failed or timed out, using grounded advisor profile:', err.message);
  }

  // Grounded deterministic fallback (zero hallucination, plain English)
  return createDeterministicProfile(rawInput);
}

module.exports = {
  extractVentureProfile,
  ALL_DIMENSIONS
};
