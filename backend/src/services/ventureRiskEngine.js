/**
 * PivotVault Venture Risk Engine
 * Deterministic, explainable scoring engine with venture-type adaptive weighting.
 * CRITICAL RULE: The final score is calculated by this engine, NOT by an LLM prompt.
 * 
 * UPGRADED:
 * - Only evaluates genuinely applicable dimensions for the venture.
 * - Non-applicable dimensions (e.g. manufacturing/regulatory for simple software) are excluded from scoring.
 * - Normalizes weights so sum(weights) = 1.0 across active dimensions.
 */

const { ALL_DIMENSIONS } = require('./ventureRiskProfileService');

/**
 * Base Weight Profiles by Venture Architecture
 */
const BASE_WEIGHTS = {
  'B2B SaaS': {
    competition: 0.20,
    differentiation: 0.18,
    customerNeed: 0.18,
    productMarketFit: 0.16,
    businessModel: 0.14,
    unitEconomics: 0.14
  },
  'SaaS & Software': {
    competition: 0.22,
    differentiation: 0.20,
    customerNeed: 0.18,
    productMarketFit: 0.16,
    businessModel: 0.12,
    unitEconomics: 0.12
  },
  'Consumer Hardware': {
    capitalIntensity: 0.24,
    executionComplexity: 0.22,
    unitEconomics: 0.18,
    customerNeed: 0.14,
    differentiation: 0.12,
    competition: 0.10
  },
  'Healthcare & Biotech': {
    regulatoryExposure: 0.28,
    executionComplexity: 0.20,
    customerNeed: 0.16,
    productMarketFit: 0.14,
    capitalIntensity: 0.12,
    defensibility: 0.10
  },
  'FinTech': {
    regulatoryExposure: 0.24,
    unitEconomics: 0.20,
    competition: 0.16,
    customerNeed: 0.14,
    businessModel: 0.14,
    defensibility: 0.12
  },
  'Marketplace': {
    unitEconomics: 0.22,
    productMarketFit: 0.20,
    competition: 0.18,
    customerNeed: 0.16,
    scalability: 0.12,
    differentiation: 0.12
  },
  'Consumer Tech': {
    productMarketFit: 0.24,
    customerNeed: 0.20,
    differentiation: 0.18,
    competition: 0.16,
    marketTiming: 0.12,
    unitEconomics: 0.10
  },
  'General': {
    competition: 0.20,
    customerNeed: 0.20,
    differentiation: 0.18,
    productMarketFit: 0.16,
    unitEconomics: 0.14,
    businessModel: 0.12
  }
};

function getWeightProfile(ventureType = '') {
  const v = ventureType.toLowerCase();
  if (v.includes('hardware') || v.includes('robot')) return BASE_WEIGHTS['Consumer Hardware'];
  if (v.includes('health') || v.includes('bio')) return BASE_WEIGHTS['Healthcare & Biotech'];
  if (v.includes('fintech') || v.includes('crypto')) return BASE_WEIGHTS['FinTech'];
  if (v.includes('marketplace')) return BASE_WEIGHTS['Marketplace'];
  if (v.includes('consumer')) return BASE_WEIGHTS['Consumer Tech'];
  if (v.includes('saas') || v.includes('software')) return BASE_WEIGHTS['SaaS & Software'];
  return BASE_WEIGHTS['General'];
}

function formatDimensionLabel(key) {
  const map = {
    productMarketFit: 'Product-Market Fit & Retention',
    customerNeed: 'Customer Urgency & Pain',
    differentiation: 'Differentiation & Moat',
    competition: 'Competitive Pressure',
    businessModel: 'Business Model & Monetization',
    unitEconomics: 'Unit Economics & Margins',
    executionComplexity: 'Execution & Operations',
    scalability: 'Scalability & Growth Limits',
    marketTiming: 'Market Timing & Adoption',
    capitalIntensity: 'Capital Requirements & Burn',
    regulatoryExposure: 'Regulatory & Legal Risk',
    defensibility: 'Defensibility & Switching Barriers'
  };
  return map[key] || key;
}

/**
 * Computes deterministic Venture Risk Score across only active, applicable dimensions.
 */
function calculateVentureRisk(ventureProfile) {
  const {
    dimensions = {},
    dimensionStatus = {},
    applicableDimensions = [],
    ventureType = 'General',
    dimensionReasoning = {}
  } = ventureProfile;

  const baseWeights = getWeightProfile(ventureType);

  // Identify applicable dimensions
  const activeDims = applicableDimensions.length > 0
    ? applicableDimensions
    : Object.keys(dimensions).filter(k => dimensionStatus[k] !== 'not_applicable' && dimensions[k] > 0);

  // Sum weights for active dimensions to normalize
  let sumActiveWeights = 0;
  for (const dim of activeDims) {
    sumActiveWeights += (baseWeights[dim] || 0.15);
  }
  if (sumActiveWeights === 0) sumActiveWeights = 1.0;

  let totalWeightedScore = 0;
  const activeDimensionList = [];

  for (const dim of activeDims) {
    const rawScore = Number(dimensions[dim]) || 50;
    const rawWeight = baseWeights[dim] || 0.15;
    const normalizedWeight = rawWeight / sumActiveWeights;

    totalWeightedScore += rawScore * normalizedWeight;

    activeDimensionList.push({
      dimension: dim,
      label: formatDimensionLabel(dim),
      score: rawScore,
      weight: normalizedWeight,
      reasoning: dimensionReasoning[dim] || ''
    });
  }

  const ventureRiskScore = Math.min(99, Math.max(5, Math.round(totalWeightedScore)));

  // Sort active dimensions by risk score descending
  activeDimensionList.sort((a, b) => b.score - a.score);

  // Top 3-5 primary risk drivers
  const primaryRiskDrivers = activeDimensionList
    .filter(d => d.score >= 50)
    .slice(0, 4)
    .map(d => ({
      dimension: d.dimension,
      name: d.label,
      score: d.score,
      reasoning: d.reasoning
    }));

  // Fallback if all scores are low
  if (primaryRiskDrivers.length === 0 && activeDimensionList.length > 0) {
    primaryRiskDrivers.push({
      dimension: activeDimensionList[0].dimension,
      name: activeDimensionList[0].label,
      score: activeDimensionList[0].score,
      reasoning: activeDimensionList[0].reasoning
    });
  }

  // Positive signals: active dimensions with lowest risk (score <= 45)
  const positiveSignals = activeDimensionList
    .filter(d => d.score <= 45)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map(d => ({
      dimension: d.dimension,
      name: d.label,
      score: d.score,
      reasoning: d.reasoning || `Low structural risk in ${d.label}.`
    }));

  return {
    ventureRiskScore,
    dimensionScores: dimensions,
    activeDimensions: activeDimensionList,
    primaryRiskDrivers,
    positiveSignals
  };
}

module.exports = {
  calculateVentureRisk,
  getWeightProfile,
  formatDimensionLabel
};
