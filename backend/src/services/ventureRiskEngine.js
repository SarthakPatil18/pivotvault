/**
 * PivotVault Venture Risk Engine
 * Deterministic, explainable scoring engine with venture-type adaptive weighting.
 * CRITICAL RULE: The final score is calculated by this engine, NOT by an LLM prompt.
 */

const { VENTURE_DIMENSIONS } = require('./ventureRiskProfileService');

/**
 * Adaptive Weight Profiles by Venture Architecture
 * Reflects empirical failure distribution priorities per venture archetype.
 */
const WEIGHT_PROFILES = {
  'B2B SaaS': {
    productMarketFit: 0.16,
    customerNeed: 0.12,
    differentiation: 0.10,
    competition: 0.12,
    businessModel: 0.10,
    unitEconomics: 0.14,
    executionComplexity: 0.06,
    scalability: 0.08,
    marketTiming: 0.06,
    capitalIntensity: 0.04,
    regulatoryExposure: 0.02,
    defensibility: 0.10
  },
  'Consumer Hardware': {
    executionComplexity: 0.18,
    capitalIntensity: 0.16,
    unitEconomics: 0.14,
    productMarketFit: 0.12,
    customerNeed: 0.10,
    scalability: 0.08,
    differentiation: 0.06,
    marketTiming: 0.06,
    competition: 0.04,
    businessModel: 0.04,
    regulatoryExposure: 0.04,
    defensibility: 0.08
  },
  'Regulated HealthTech': {
    regulatoryExposure: 0.22,
    executionComplexity: 0.16,
    capitalIntensity: 0.14,
    customerNeed: 0.12,
    productMarketFit: 0.10,
    unitEconomics: 0.08,
    competition: 0.04,
    defensibility: 0.06,
    businessModel: 0.04,
    scalability: 0.04,
    marketTiming: 0.04,
    differentiation: 0.06
  },
  'Marketplace': {
    unitEconomics: 0.18,
    productMarketFit: 0.16,
    scalability: 0.12,
    competition: 0.12,
    customerNeed: 0.10,
    differentiation: 0.08,
    capitalIntensity: 0.08,
    marketTiming: 0.06,
    businessModel: 0.06,
    executionComplexity: 0.04,
    defensibility: 0.08,
    regulatoryExposure: 0.02
  },
  'FinTech': {
    regulatoryExposure: 0.18,
    unitEconomics: 0.16,
    competition: 0.12,
    productMarketFit: 0.12,
    executionComplexity: 0.10,
    capitalIntensity: 0.10,
    customerNeed: 0.08,
    defensibility: 0.06,
    businessModel: 0.06,
    scalability: 0.06,
    marketTiming: 0.04,
    differentiation: 0.04
  },
  'Consumer Tech': {
    productMarketFit: 0.20,
    customerNeed: 0.14,
    unitEconomics: 0.14,
    competition: 0.12,
    differentiation: 0.10,
    marketTiming: 0.08,
    scalability: 0.08,
    defensibility: 0.06,
    capitalIntensity: 0.04,
    executionComplexity: 0.04,
    businessModel: 0.04,
    regulatoryExposure: 0.02
  },
  'General': {
    productMarketFit: 0.14,
    unitEconomics: 0.14,
    customerNeed: 0.12,
    competition: 0.10,
    differentiation: 0.10,
    executionComplexity: 0.08,
    capitalIntensity: 0.08,
    scalability: 0.08,
    defensibility: 0.06,
    businessModel: 0.06,
    marketTiming: 0.06,
    regulatoryExposure: 0.04
  }
};

/**
 * Resolves appropriate weight profile for given venture classification.
 */
function getWeightProfile(ventureType = '') {
  const vLower = ventureType.toLowerCase();
  if (vLower.includes('hardware') || vLower.includes('robot')) return WEIGHT_PROFILES['Consumer Hardware'];
  if (vLower.includes('health') || vLower.includes('bio') || vLower.includes('regulated')) return WEIGHT_PROFILES['Regulated HealthTech'];
  if (vLower.includes('marketplace') || vLower.includes('platform')) return WEIGHT_PROFILES['Marketplace'];
  if (vLower.includes('fintech') || vLower.includes('crypto')) return WEIGHT_PROFILES['FinTech'];
  if (vLower.includes('consumer') || vLower.includes('d2c')) return WEIGHT_PROFILES['Consumer Tech'];
  if (vLower.includes('saas') || vLower.includes('enterprise') || vLower.includes('software')) return WEIGHT_PROFILES['B2B SaaS'];
  return WEIGHT_PROFILES['General'];
}

/**
 * Computes deterministic Venture Risk Score, risk drivers, and positive signals.
 */
function calculateVentureRisk(ventureProfile) {
  const { dimensions = {}, ventureType = 'General', dimensionReasoning = {} } = ventureProfile;
  const weights = getWeightProfile(ventureType);

  let totalWeightedScore = 0;
  let totalWeight = 0;
  const dimensionImpacts = [];

  for (const dim of VENTURE_DIMENSIONS) {
    const rawScore = Number(dimensions[dim]) || 50;
    const weight = weights[dim] || 0.08;
    const weightedContribution = rawScore * weight;

    totalWeightedScore += weightedContribution;
    totalWeight += weight;

    dimensionImpacts.push({
      dimension: dim,
      label: formatDimensionLabel(dim),
      score: rawScore,
      weight,
      weightedContribution,
      reasoning: dimensionReasoning[dim] || ''
    });
  }

  const ventureRiskScore = totalWeight > 0 
    ? Math.min(100, Math.max(0, Math.round(totalWeightedScore / totalWeight)))
    : 50;

  // Rank dimensions by risk contribution
  const sortedByRisk = [...dimensionImpacts].sort((a, b) => b.score - a.score);

  const primaryRiskDrivers = sortedByRisk
    .filter(d => d.score >= 60)
    .slice(0, 3)
    .map(d => ({
      dimension: d.dimension,
      name: d.label,
      score: d.score,
      reasoning: d.reasoning
    }));

  const secondaryRiskDrivers = sortedByRisk
    .filter(d => d.score >= 50 && !primaryRiskDrivers.some(p => p.dimension === d.dimension))
    .slice(0, 3)
    .map(d => ({
      dimension: d.dimension,
      name: d.label,
      score: d.score,
      reasoning: d.reasoning
    }));

  // Identify positive signals (dimensions with lowest risk scores <= 45)
  const positiveSignals = [...dimensionImpacts]
    .filter(d => d.score <= 45)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map(d => ({
      dimension: d.dimension,
      name: d.label,
      score: d.score,
      reasoning: d.reasoning || `Strong structural advantage in ${d.label}.`
    }));

  return {
    ventureRiskScore,
    dimensionScores: dimensions,
    weightsUsed: weights,
    primaryRiskDrivers,
    secondaryRiskDrivers,
    positiveSignals
  };
}

function formatDimensionLabel(key) {
  const map = {
    productMarketFit: 'Product-Market Fit',
    customerNeed: 'Customer Urgency & Need',
    differentiation: 'Defensive Differentiation',
    competition: 'Competitive Headwinds',
    businessModel: 'Business Model Viability',
    unitEconomics: 'Unit Economics & Margins',
    executionComplexity: 'Execution & Operational Friction',
    scalability: 'Structural Scalability',
    marketTiming: 'Market Timing & Adoption',
    capitalIntensity: 'Capital Intensity & Burn',
    regulatoryExposure: 'Regulatory & Compliance Burden',
    defensibility: 'Moat & Switching Costs'
  };
  return map[key] || key;
}

module.exports = {
  calculateVentureRisk,
  getWeightProfile
};
