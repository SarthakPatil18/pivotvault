const { scoreIdea } = require('../lib/ideaScoreModel');
const { SpecialistFinding } = require('../lib/types');
const { callGroq, callGemini, parseJSON } = require('../lib/ai');

const required = ['log_funding', 'funding_rounds', 'days_to_first_funding', 'funding_duration_days', 'is_international'];

async function estimateFeaturesFromContext({ ideaText = '', industry = '', targetCustomer = '', businessModel = '', burnRate = '' } = {}) {
  // Sensible defaults for pre-launch startup idea
  const isHealthOrBio = typeof industry === 'string' && (industry.includes('Health') || industry.includes('Bio'));
  const isHardware = typeof industry === 'string' && (industry.includes('Hardware') || (businessModel && businessModel.includes('Hardware')));
  const isFintech = typeof industry === 'string' && (industry.includes('FinTech') || industry.includes('Crypto'));
  
  const defaultDays = isHealthOrBio ? 400 : (isHardware || isFintech ? 320 : 240);
  const combinedText = `${ideaText} ${targetCustomer} ${industry}`.toLowerCase();
  const defaultIntl = (combinedText.includes('international') || combinedText.includes('global') || combinedText.includes('cross-border') || combinedText.includes('worldwide')) ? 1 : 0;

  const defaults = {
    log_funding: 0,
    funding_rounds: 0,
    days_to_first_funding: defaultDays,
    funding_duration_days: 0,
    is_international: defaultIntl
  };

  try {
    const prompt = `You are a venture capital quantitative analyst. Estimate 5 numerical model features for a pre-launch/early-stage startup idea:
- Startup Concept: "${ideaText}"
- Industry Sector: "${industry}"
- Target Customer: "${targetCustomer}"
- Business/Revenue Model: "${businessModel}"
- Monthly Burn Projection: "${burnRate}"

Output ONLY a JSON object with these 5 keys:
{
  "log_funding": (float, natural log of total funding raised in USD. For pre-launch/unfunded venture use 0),
  "funding_rounds": (float, count of funding rounds closed. For pre-launch use 0),
  "days_to_first_funding": (float, typical days to first funding for this sector/stage, e.g. 180 to 450),
  "funding_duration_days": (float, days spanning funding lifecycle. For pre-launch use 0),
  "is_international": (integer, 1 if international/cross-border market, 0 if domestic)
}`;

    const raw = await callGroq(prompt, { maxTokens: 150 }).catch(() => callGemini(prompt, { maxTokens: 150, json: true }));
    const parsed = parseJSON(raw);
    if (parsed && typeof parsed === 'object') {
      return {
        log_funding: Number.isFinite(Number(parsed.log_funding)) ? Math.max(0, Number(parsed.log_funding)) : defaults.log_funding,
        funding_rounds: Number.isFinite(Number(parsed.funding_rounds)) ? Math.max(0, Number(parsed.funding_rounds)) : defaults.funding_rounds,
        days_to_first_funding: Number.isFinite(Number(parsed.days_to_first_funding)) ? Math.max(30, Number(parsed.days_to_first_funding)) : defaults.days_to_first_funding,
        funding_duration_days: Number.isFinite(Number(parsed.funding_duration_days)) ? Math.max(0, Number(parsed.funding_duration_days)) : defaults.funding_duration_days,
        is_international: (parsed.is_international === 1 || parsed.is_international === true) ? 1 : defaults.is_international
      };
    }
  } catch {
    // Fall back to sensible defaults
  }
  return defaults;
}

async function extractFeatures(evidence, context = {}) {
  const values = {};
  if (Array.isArray(evidence)) {
    for (const item of evidence) {
      const text = item.content || item.chunkText || '';
      for (const field of required) {
        const match = text.match(new RegExp(`\\b${field}\\s*[:=]\\s*(-?\\d+(?:\\.\\d+)?)`, 'i'));
        if (match && !Number.isFinite(values[field])) values[field] = Number(match[1]);
      }
    }
  }

  // Estimate any missing fields automatically
  const missing = required.filter((field) => !Number.isFinite(values[field]));
  if (missing.length > 0) {
    const estimated = await estimateFeaturesFromContext({
      ideaText: context.ideaText || context.idea || context.query || (Array.isArray(evidence) ? evidence[0]?.content || '' : ''),
      industry: context.industry,
      targetCustomer: context.targetCustomer,
      businessModel: context.businessModel,
      burnRate: context.burnRate
    });

    for (const field of missing) {
      values[field] = estimated[field];
    }
  }

  return values;
}

async function run({ evidence, agentInput, marketFinding, historicalFinding }) {
  const features = await extractFeatures(evidence, agentInput || {});
  const scored = await scoreIdea(features);
  const signals = [
    marketFinding?.findings?.saturationScore >= 60 && 'Market saturation may make customer acquisition costly.',
    historicalFinding?.findings?.historicalRiskSignal >= 0.6 && 'Historical evidence contains several comparable failure patterns.'
  ].filter(Boolean);
  return SpecialistFinding.parse({
    agentName: 'riskAnalyst',
    findings: { ideaScore: scored.ideaScore, scoreBreakdown: scored.breakdown, topRisks: signals },
    confidence: 0.85,
    sources: evidence
  });
}

module.exports = { run, extractFeatures, estimateFeaturesFromContext };
