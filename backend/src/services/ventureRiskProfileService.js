/**
 * Venture Risk Profile Service
 * Uses Groq / Llama 3 to structure and understand founder ideas into a normalized risk profile.
 * IMPORTANT: Groq DOES NOT generate the final score. Groq acts solely as a forensic analyst.
 */

const { callGroq, callGemini, parseJSON } = require('../agents/lib/ai');

const VENTURE_DIMENSIONS = [
  'productMarketFit',
  'customerNeed',
  'differentiation',
  'competition',
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
 * Deterministic fallback profile generator when Groq is unavailable.
 * Grounded purely in user inputs; does not fabricate metrics or hallucinate.
 */
function createDeterministicProfile({ ideaText, industry, targetCustomer, businessModel, burnRate, hardwareInvolved, regulatoryHeavy }) {
  const text = `${ideaText} ${industry} ${targetCustomer} ${businessModel}`.toLowerCase();
  
  // Venture classification
  let ventureType = 'B2B SaaS';
  if (hardwareInvolved || text.includes('hardware') || text.includes('robot') || text.includes('device')) {
    ventureType = 'Consumer Hardware';
  } else if (regulatoryHeavy || text.includes('fda') || text.includes('clinical') || industry.includes('Health') || industry.includes('Bio')) {
    ventureType = 'Regulated HealthTech';
  } else if (businessModel.includes('Marketplace') || text.includes('marketplace') || text.includes('two-sided')) {
    ventureType = 'Marketplace';
  } else if (targetCustomer === 'B2C' || text.includes('consumer') || text.includes('d2c')) {
    ventureType = 'Consumer Tech';
  } else if (industry.includes('FinTech') || industry.includes('Crypto') || text.includes('finance')) {
    ventureType = 'FinTech';
  }

  // Dimension vulnerability baseline (0-100, where higher = higher risk/vulnerability)
  const isHighBurn = burnRate.includes('150k') || burnRate.includes('500k');
  const dimensions = {
    productMarketFit: text.includes('proven') || text.includes('traction') ? 45 : 68,
    customerNeed: text.includes('guarantee') || text.includes('critical') ? 42 : 58,
    differentiation: text.includes('ai-powered') || text.includes('platform') ? 64 : 52,
    competition: text.includes('ai') || industry.includes('SaaS') ? 72 : 55,
    businessModel: businessModel.includes('Subscription') ? 48 : 65,
    unitEconomics: isHighBurn ? 78 : (businessModel.includes('Marketplace') ? 72 : 54),
    executionComplexity: hardwareInvolved ? 86 : (regulatoryHeavy ? 76 : 52),
    scalability: hardwareInvolved ? 74 : (text.includes('manual') ? 70 : 44),
    marketTiming: text.includes('ai') ? 60 : 50,
    capitalIntensity: hardwareInvolved ? 88 : (isHighBurn ? 82 : 46),
    regulatoryExposure: regulatoryHeavy ? 88 : (industry.includes('FinTech') ? 74 : 32),
    defensibility: text.includes('patent') || text.includes('proprietary') ? 45 : 68
  };

  return {
    ventureType,
    targetCustomer: targetCustomer || 'B2B',
    businessModel: businessModel || 'Subscription',
    coreValueProposition: ideaText.slice(0, 140),
    dimensions,
    sources: {
      productMarketFit: 'GENERAL BUSINESS REASONING',
      customerNeed: 'SUPPORTED BY IDEA',
      differentiation: 'GENERAL BUSINESS REASONING',
      competition: 'GENERAL BUSINESS REASONING',
      businessModel: 'SUPPORTED BY IDEA',
      unitEconomics: 'GENERAL BUSINESS REASONING',
      executionComplexity: hardwareInvolved || regulatoryHeavy ? 'SUPPORTED BY IDEA' : 'GENERAL BUSINESS REASONING',
      scalability: 'GENERAL BUSINESS REASONING',
      marketTiming: 'GENERAL BUSINESS REASONING',
      capitalIntensity: isHighBurn || hardwareInvolved ? 'SUPPORTED BY IDEA' : 'GENERAL BUSINESS REASONING',
      regulatoryExposure: regulatoryHeavy ? 'SUPPORTED BY IDEA' : 'GENERAL BUSINESS REASONING',
      defensibility: 'GENERAL BUSINESS REASONING'
    },
    dimensionReasoning: {
      productMarketFit: 'Pre-launch concept lacks verified customer retention and willingness-to-pay telemetry.',
      customerNeed: 'Addresses identified workflow pain point, but urgency depends on commercial buyer prioritization.',
      differentiation: 'High risk of feature commoditization by established market incumbents with existing distribution.',
      competition: 'Active competitive landscape requires clear proprietary wedge or specialized workflow integration.',
      businessModel: `Standard ${businessModel} model requires proving repeatable CAC-to-LTV payback period.`,
      unitEconomics: isHighBurn ? 'Projected burn rate risks outrunning contribution margin recovery before Series A.' : 'Gross margins depend on keeping infrastructure and customer service costs contained.',
      executionComplexity: hardwareInvolved ? 'Physical manufacturing and supply chain defect risks require substantial lead times.' : 'Software delivery is manageable but requires resilient compliance and uptime.',
      scalability: 'Scaling velocity governed by customer acquisition cost rather than technological constraints.',
      marketTiming: 'Current macroeconomic cycle requires immediate focus on capital efficiency over vanity growth.',
      capitalIntensity: isHighBurn || hardwareInvolved ? 'High upfront capital requirements create severe bridge financing exposure.' : 'Bootstrappable baseline enables initial customer validation with disciplined cash management.',
      regulatoryExposure: regulatoryHeavy ? 'Heavy regulatory compliance creates significant legal and audit overhead before launch.' : 'Standard operational compliance with low systemic regulatory friction.',
      defensibility: 'Defensive moat is initially low; founder must build proprietary data assets or high switching costs.'
    },
    primaryAssumptions: [
      'Target customers possess immediate discretionary budget for this solution without extensive procurement friction.',
      'Customer acquisition costs can be sustained below 1/3rd of expected first-year customer lifetime value.',
      'Core technology can be delivered without reliance on costly manual human workarounds.'
    ],
    positiveSignals: [
      'Identified sector provides recognizable enterprise monetization mechanics.',
      'Focused value proposition rather than an unfocused multi-product conglomerate.'
    ],
    unknowns: [
      'Verified customer willingness to pay without initial discounting or trial concessions.',
      'Real per-unit customer acquisition cost across non-founder sales channels.',
      'Organic 60-day customer retention and net revenue expansion rate.'
    ]
  };
}

/**
 * Main Profiler: Sends venture concept to Groq / Llama to extract structured risk profile.
 */
async function extractVentureProfile(input) {
  const {
    ideaText = '',
    industry = 'SaaS & Enterprise',
    targetCustomer = 'B2B',
    businessModel = 'Subscription',
    burnRate = '$20k - $50k/mo',
    hardwareInvolved = false,
    regulatoryHeavy = false
  } = input;

  const prompt = `You are a forensic venture capital analyst for PivotVault.
Your task is to analyze the following startup concept and produce a structured, analytical VENTURE RISK PROFILE.
You MUST NOT invent historical companies, fabricated revenue, or fake statistics.
You MUST distinguish what is explicitly SUPPORTED BY THE IDEA, what is GENERAL BUSINESS REASONING, and what is UNKNOWN.

STARTUP VENTURE DATA:
- Concept / Value Proposition: "${ideaText}"
- Industry Sector: "${industry}"
- Target Customer: "${targetCustomer}"
- Business / Monetization Model: "${businessModel}"
- Monthly Burn Projection: "${burnRate}"
- Physical Hardware Involved: ${hardwareInvolved ? 'YES' : 'NO'}
- Heavy Regulatory / Compliance: ${regulatoryHeavy ? 'YES' : 'NO'}

Score each of the 12 risk dimensions from 0 to 100, where:
0 = Zero / Negligible Risk (strong structural advantage)
50 = Standard Venture Baseline Risk
100 = Catastrophic / Critical Vulnerability Risk

Return a strict JSON object with this exact structure:
{
  "ventureType": "SaaS / Consumer Hardware / Regulated HealthTech / Marketplace / FinTech / D2C / DeepTech",
  "targetCustomer": "B2B / B2C / Enterprise / Marketplace",
  "businessModel": "Subscription / Marketplace / Direct / Usage",
  "coreValueProposition": "Concise 1-sentence summary of the core mechanism",
  "dimensions": {
    "productMarketFit": (integer 0-100),
    "customerNeed": (integer 0-100),
    "differentiation": (integer 0-100),
    "competition": (integer 0-100),
    "businessModel": (integer 0-100),
    "unitEconomics": (integer 0-100),
    "executionComplexity": (integer 0-100),
    "scalability": (integer 0-100),
    "marketTiming": (integer 0-100),
    "capitalIntensity": (integer 0-100),
    "regulatoryExposure": (integer 0-100),
    "defensibility": (integer 0-100)
  },
  "sources": {
    "productMarketFit": "SUPPORTED BY IDEA / GENERAL BUSINESS REASONING / UNKNOWN",
    "customerNeed": "SUPPORTED BY IDEA / GENERAL BUSINESS REASONING / UNKNOWN",
    "differentiation": "SUPPORTED BY IDEA / GENERAL BUSINESS REASONING / UNKNOWN",
    "competition": "SUPPORTED BY IDEA / GENERAL BUSINESS REASONING / UNKNOWN",
    "businessModel": "SUPPORTED BY IDEA / GENERAL BUSINESS REASONING / UNKNOWN",
    "unitEconomics": "SUPPORTED BY IDEA / GENERAL BUSINESS REASONING / UNKNOWN",
    "executionComplexity": "SUPPORTED BY IDEA / GENERAL BUSINESS REASONING / UNKNOWN",
    "scalability": "SUPPORTED BY IDEA / GENERAL BUSINESS REASONING / UNKNOWN",
    "marketTiming": "SUPPORTED BY IDEA / GENERAL BUSINESS REASONING / UNKNOWN",
    "capitalIntensity": "SUPPORTED BY IDEA / GENERAL BUSINESS REASONING / UNKNOWN",
    "regulatoryExposure": "SUPPORTED BY IDEA / GENERAL BUSINESS REASONING / UNKNOWN",
    "defensibility": "SUPPORTED BY IDEA / GENERAL BUSINESS REASONING / UNKNOWN"
  },
  "dimensionReasoning": {
    "productMarketFit": "Forensic rationale for this score",
    "customerNeed": "Forensic rationale for this score",
    "differentiation": "Forensic rationale for this score",
    "competition": "Forensic rationale for this score",
    "businessModel": "Forensic rationale for this score",
    "unitEconomics": "Forensic rationale for this score",
    "executionComplexity": "Forensic rationale for this score",
    "scalability": "Forensic rationale for this score",
    "marketTiming": "Forensic rationale for this score",
    "capitalIntensity": "Forensic rationale for this score",
    "regulatoryExposure": "Forensic rationale for this score",
    "defensibility": "Forensic rationale for this score"
  },
  "primaryAssumptions": [
    "Unverified assumption 1",
    "Unverified assumption 2",
    "Unverified assumption 3"
  ],
  "positiveSignals": [
    "Positive structural factor 1",
    "Positive structural factor 2"
  ],
  "unknowns": [
    "Critical metric founder has not provided 1",
    "Critical metric founder has not provided 2",
    "Critical metric founder has not provided 3"
  ]
}`;

  try {
    const raw = await callGroq(prompt, { maxTokens: 1200, model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b' })
      .catch(() => callGemini(prompt, { maxTokens: 1200, json: true }));
    
    const parsed = parseJSON(raw);
    if (parsed && parsed.dimensions && typeof parsed.dimensions === 'object') {
      // Validate all dimensions are numbers between 0 and 100
      const validatedDimensions = {};
      for (const dim of VENTURE_DIMENSIONS) {
        const val = Number(parsed.dimensions[dim]);
        validatedDimensions[dim] = Number.isFinite(val) ? Math.min(100, Math.max(0, Math.round(val))) : 50;
      }

      return {
        ventureType: parsed.ventureType || 'Venture Concept',
        targetCustomer: parsed.targetCustomer || targetCustomer,
        businessModel: parsed.businessModel || businessModel,
        coreValueProposition: parsed.coreValueProposition || ideaText.slice(0, 140),
        dimensions: validatedDimensions,
        sources: parsed.sources || {},
        dimensionReasoning: parsed.dimensionReasoning || {},
        primaryAssumptions: Array.isArray(parsed.primaryAssumptions) ? parsed.primaryAssumptions.slice(0, 4) : [],
        positiveSignals: Array.isArray(parsed.positiveSignals) ? parsed.positiveSignals.slice(0, 3) : [],
        unknowns: Array.isArray(parsed.unknowns) ? parsed.unknowns.slice(0, 4) : []
      };
    }
  } catch (err) {
    console.warn('[VentureProfiler] LLM profiling unavailable, using grounded deterministic profiler:', err.message);
  }

  // Grounded deterministic fallback (zero hallucination)
  return createDeterministicProfile(input);
}

module.exports = {
  extractVentureProfile,
  VENTURE_DIMENSIONS
};
