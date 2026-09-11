/**
 * Failure Taxonomy Service
 * Maps venture dimensions and operational inputs to PivotVault's 11 canonical failure vectors.
 */

const { FAILURE_TAXONOMY } = require('../data/startupsCorpus');

/**
 * Maps venture profile to PivotVault failure vectors with association strength (0-100).
 */
function mapToFailureTaxonomy(ventureProfile, userInput = {}) {
  const { dimensions = {} } = ventureProfile;
  const { hardwareInvolved = false, regulatoryHeavy = false, burnRate = '' } = userInput;

  const vectorAssociations = FAILURE_TAXONOMY.map(tax => {
    let score = 0;
    const rationaleParts = [];

    switch (tax.id) {
      case 'unit_economics':
        score = Math.round((dimensions.unitEconomics * 0.6) + (dimensions.businessModel * 0.4));
        if (dimensions.unitEconomics > 60) rationaleParts.push('High projected customer acquisition and fulfillment costs.');
        if (burnRate.includes('150k') || burnRate.includes('500k')) rationaleParts.push('Elevated burn rate ahead of unit profitability.');
        break;

      case 'market_need':
        score = Math.round((dimensions.productMarketFit * 0.55) + (dimensions.customerNeed * 0.45));
        if (dimensions.customerNeed > 55) rationaleParts.push('Customer problem may represent a vitamin rather than a mission-critical pain point.');
        if (dimensions.productMarketFit > 60) rationaleParts.push('Unvalidated commercial willingness to pay without discounts.');
        break;

      case 'burn_runway':
        score = Math.round((dimensions.capitalIntensity * 0.6) + (dimensions.unitEconomics * 0.4));
        if (burnRate.includes('500k')) score = Math.max(score, 88);
        if (dimensions.capitalIntensity > 65) rationaleParts.push('Venture requires substantial capital cushion to navigate development cycle.');
        break;

      case 'competition':
        score = Math.round((dimensions.competition * 0.55) + (dimensions.differentiation * 0.45));
        if (dimensions.competition > 65) rationaleParts.push('Heavy incumbent concentration with established distribution flywheels.');
        if (dimensions.defensibility > 65) rationaleParts.push('Low structural switching barriers make features vulnerable to cloning.');
        break;

      case 'hardware_manufacturing':
        score = hardwareInvolved 
          ? Math.round(Math.max(75, (dimensions.executionComplexity * 0.5) + (dimensions.capitalIntensity * 0.5)))
          : Math.min(25, Math.round(dimensions.executionComplexity * 0.3));
        if (hardwareInvolved) rationaleParts.push('Physical supply chain, tooling lead times, and factory yield defect risk.');
        break;

      case 'regulatory_legal':
        score = regulatoryHeavy
          ? Math.round(Math.max(75, (dimensions.regulatoryExposure * 0.7) + (dimensions.executionComplexity * 0.3)))
          : Math.min(30, Math.round(dimensions.regulatoryExposure * 0.4));
        if (regulatoryHeavy) rationaleParts.push('Compliance scrutiny, licensing hurdles, and legal enforcement exposure.');
        break;

      case 'premature_scaling':
        score = Math.round((dimensions.scalability * 0.4) + (dimensions.capitalIntensity * 0.3) + (dimensions.productMarketFit * 0.3));
        if (dimensions.productMarketFit > 60 && dimensions.capitalIntensity > 60) {
          rationaleParts.push('Risk of deploying marketing capital before locking down customer retention.');
        }
        break;

      case 'pricing_mismatch':
        score = Math.round((dimensions.businessModel * 0.6) + (dimensions.customerNeed * 0.4));
        if (dimensions.businessModel > 60) rationaleParts.push('Misaligned pricing mechanics relative to customer perceived value.');
        break;

      case 'fraud_governance':
        // Pre-launch idea typically has low fraud risk unless extreme black-box claims
        score = Math.min(45, Math.round(dimensions.defensibility * 0.35 + dimensions.regulatoryExposure * 0.2));
        rationaleParts.push('Baseline governance risk; requires transparent independent audit and oversight.');
        break;

      case 'pivot_failure':
        score = Math.round((dimensions.differentiation * 0.5) + (dimensions.marketTiming * 0.5));
        if (dimensions.differentiation > 65) rationaleParts.push('Unfocused positioning risks diluting core development velocity.');
        break;

      case 'founder_conflict':
        score = 35; // Standard organizational baseline
        rationaleParts.push('Organizational baseline; requires clear equity vesting and founder decision frameworks.');
        break;

      default:
        score = 50;
    }

    // Clamp score
    const clampedScore = Math.min(99, Math.max(10, score));
    const associationLevel = clampedScore >= 75 ? 'HIGH' : clampedScore >= 55 ? 'MEDIUM' : 'LOW';

    return {
      id: tax.id,
      name: tax.name,
      associationScore: clampedScore,
      associationLevel,
      description: tax.description,
      rationale: rationaleParts.join(' ') || tax.description
    };
  });

  // Sort descending by association
  const sorted = vectorAssociations.sort((a, b) => b.associationScore - a.associationScore);

  return {
    primaryVectors: sorted.slice(0, 3),
    secondaryVectors: sorted.slice(3, 6),
    allVectors: sorted
  };
}

module.exports = {
  mapToFailureTaxonomy
};
