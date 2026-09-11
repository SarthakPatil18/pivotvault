/**
 * Failure Taxonomy Service
 * Maps venture dimensions and operational characteristics to PivotVault's 11 canonical failure vectors.
 * Uses the sanitized, idea-first venture profile so irrelevant categories (like hardware or clinical regulation
 * for pure software) never produce false alarms.
 */

const { FAILURE_TAXONOMY } = require('../data/startupsCorpus');

/**
 * Maps venture profile to PivotVault failure vectors with association strength (0-100).
 */
function mapToFailureTaxonomy(ventureProfile, userInput = {}) {
  const { dimensions = {}, dimensionStatus = {} } = ventureProfile;

  // Use sanitized profile flags as the primary authority, with userInput as fallback
  const hardwareInvolved = ventureProfile.hardwareInvolved ?? userInput.hardwareInvolved ?? false;
  const regulatoryHeavy = ventureProfile.regulatoryHeavy ?? userInput.regulatoryHeavy ?? false;
  const burnRate = ventureProfile.burnRate || userInput.burnRate || '';

  const vectorAssociations = FAILURE_TAXONOMY.map(tax => {
    let score = 0;
    const rationaleParts = [];

    switch (tax.id) {
      case 'competition':
        score = Math.round(((dimensions.competition || 50) * 0.55) + ((dimensions.differentiation || 50) * 0.45));
        if ((dimensions.competition || 0) > 60) {
          rationaleParts.push('Many established alternatives already exist. Getting users to switch will require clear, noticeable benefits.');
        } else {
          rationaleParts.push('Moderate competitive landscape; maintaining unique value will be important.');
        }
        break;

      case 'market_need':
        score = Math.round(((dimensions.productMarketFit || 50) * 0.55) + ((dimensions.customerNeed || 50) * 0.45));
        if ((dimensions.customerNeed || 0) > 55) {
          rationaleParts.push('Users may view this tool as a helpful convenience rather than an urgent, indispensable problem they must pay for.');
        } else {
          rationaleParts.push('Early demand needs validation through real user retention and willingness to pay.');
        }
        break;

      case 'unit_economics':
        score = Math.round(((dimensions.unitEconomics || 50) * 0.6) + ((dimensions.businessModel || 50) * 0.4));
        if ((dimensions.unitEconomics || 0) > 60) {
          rationaleParts.push('Customer acquisition cost could easily outpace customer lifetime value if you rely on paid marketing.');
        } else {
          rationaleParts.push('Sustainable unit economics depend on keeping user acquisition and support costs low.');
        }
        break;

      case 'burn_runway':
        score = Math.round(((dimensions.capitalIntensity || 50) * 0.6) + ((dimensions.unitEconomics || 50) * 0.4));
        if (burnRate.includes('500k')) score = Math.max(score, 85);
        if ((dimensions.capitalIntensity || 0) > 65) {
          rationaleParts.push('High capital requirements could exhaust cash reserves before the product reaches self-sustaining revenue.');
        } else {
          rationaleParts.push('Controlled operational spending provides a longer runway to test and iterate on the idea.');
        }
        break;

      case 'pricing_mismatch':
        score = Math.round(((dimensions.businessModel || 50) * 0.6) + ((dimensions.customerNeed || 50) * 0.4));
        if ((dimensions.businessModel || 0) > 55) {
          rationaleParts.push('Pricing model may encounter friction if users compare it against free or bundled alternatives.');
        } else {
          rationaleParts.push('Pricing structure needs testing to find the sweet spot between user volume and revenue.');
        }
        break;

      case 'hardware_manufacturing':
        if (hardwareInvolved) {
          score = Math.round(Math.max(75, ((dimensions.executionComplexity || 50) * 0.5) + ((dimensions.capitalIntensity || 50) * 0.5)));
          rationaleParts.push('Physical manufacturing, tooling delays, and supplier lead times create major operational hurdles.');
        } else {
          score = 10; // Not applicable for pure software
          rationaleParts.push('Not applicable: No physical hardware or manufacturing involved in this software concept.');
        }
        break;

      case 'regulatory_legal':
        if (regulatoryHeavy) {
          score = Math.round(Math.max(75, ((dimensions.regulatoryExposure || 50) * 0.7) + ((dimensions.executionComplexity || 50) * 0.3)));
          rationaleParts.push('Subject to formal compliance, licensing, or legal oversight that could delay your launch.');
        } else {
          score = 15; // Low/not applicable for standard tools
          rationaleParts.push('Not applicable: Standard digital application with low regulatory or compliance friction.');
        }
        break;

      case 'premature_scaling':
        score = Math.round(((dimensions.scalability || 50) * 0.4) + ((dimensions.capitalIntensity || 50) * 0.3) + ((dimensions.productMarketFit || 50) * 0.3));
        if ((dimensions.productMarketFit || 0) > 60) {
          rationaleParts.push('Risk of spending heavily on marketing and growth before confirming that early users actually stick around.');
        } else {
          rationaleParts.push('Focus on nailing retention with early users before investing in aggressive acquisition channels.');
        }
        break;

      case 'pivot_failure':
        score = Math.round(((dimensions.differentiation || 50) * 0.5) + ((dimensions.marketTiming || 50) * 0.5));
        rationaleParts.push('Stay focused on your primary value proposition rather than diluting effort across too many features.');
        break;

      case 'fraud_governance':
        score = 25;
        rationaleParts.push('Standard early-stage baseline; transparent communication and clear team alignment are essential.');
        break;

      case 'founder_conflict':
        score = 30;
        rationaleParts.push('Founding team alignment and clear decision-making boundaries will be vital as the project grows.');
        break;

      default:
        score = 40;
        rationaleParts.push('Standard venture risk factor to monitor.');
    }

    const clampedScore = Math.min(99, Math.max(10, score));
    const isNA = (!hardwareInvolved && tax.id === 'hardware_manufacturing') || (!regulatoryHeavy && tax.id === 'regulatory_legal');
    const associationLevel = isNA ? 'N/A' : clampedScore >= 70 ? 'HIGH' : clampedScore >= 50 ? 'MEDIUM' : 'LOW';

    return {
      id: tax.id,
      name: tax.name,
      associationScore: clampedScore,
      associationLevel,
      description: tax.description,
      rationale: rationaleParts.join(' ') || tax.description,
      isApplicable: !isNA
    };
  });

  // Sort descending by association score among applicable vectors first
  const applicableList = vectorAssociations.filter(v => v.isApplicable).sort((a, b) => b.associationScore - a.associationScore);
  const naList = vectorAssociations.filter(v => !v.isApplicable);
  const sorted = [...applicableList, ...naList];

  return {
    primaryVectors: applicableList.slice(0, 3),
    secondaryVectors: applicableList.slice(3, 6),
    allVectors: sorted
  };
}

module.exports = {
  mapToFailureTaxonomy
};
