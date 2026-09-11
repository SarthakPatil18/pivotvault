/**
 * PivotVault Risk Scanner Orchestrator Service
 * Master coordinator for the Venture Risk Intelligence Engine.
 * Integrates:
 * 1. Groq Venture Risk Profiler (Understanding & Structuring)
 * 2. PivotVault Venture Risk Engine (Deterministic Adaptive Scoring)
 * 3. Canonical 11-Vector Failure Taxonomy Mapping
 * 4. Zero-Fabrication Historical Failure Retrieval & Similarity
 * 5. Transparent ML Benchmark
 * 6. Multi-Factor Independent Confidence Calculation
 * 7. Executive Forensic Diagnosis & Pre-Launch Actions
 */

const { extractVentureProfile } = require('./ventureRiskProfileService');
const { calculateVentureRisk } = require('./ventureRiskEngine');
const { mapToFailureTaxonomy } = require('./failureTaxonomyService');
const { retrieveHistoricalFailures } = require('./historicalSimilarityService');
const { evaluateMLBenchmark } = require('./mlBenchmark');

/**
 * Computes an independent confidence score (0-100%) reflecting evidence depth,
 * input completeness, and signal agreement.
 */
function calculateConfidence({ input, ventureProfile, historicalResult, mlResult }) {
  let confidence = 50; // Neutral starting confidence

  // 1. Input completeness (up to +15)
  const ideaLen = (input.ideaText || '').trim().length;
  if (ideaLen > 80) confidence += 10;
  if (ideaLen > 200) confidence += 5;

  // 2. Evidence coverage & match strength (up to +25)
  const matchCount = historicalResult.evidenceSummary?.matchedCompaniesCount || 0;
  if (matchCount >= 2) confidence += 15;
  if (matchCount >= 3) confidence += 10;

  // 3. Signal congruence between Venture Engine and Historical Similarity (up to +15)
  const vScore = ventureProfile.ventureRiskScore || 50;
  const hScore = historicalResult.historicalSimilarityScore || 50;
  const delta = Math.abs(vScore - hScore);
  if (delta <= 15) confidence += 15;
  else if (delta <= 25) confidence += 8;
  else confidence -= 10; // Significant disagreement lowers confidence

  // 4. Unknowns penalty (up to -15)
  const unknownCount = ventureProfile.unknowns?.length || 0;
  if (unknownCount >= 4) confidence -= 10;
  else if (unknownCount <= 2) confidence += 5;

  // 5. ML Benchmark availability (+5)
  if (mlResult.available) confidence += 5;

  return Math.min(95, Math.max(35, Math.round(confidence)));
}

/**
 * Generates concise executive diagnosis explaining WHY the score exists.
 */
function generateExecutiveExplanation({ ventureProfile, ventureEngine, failureTaxonomy, historicalResult, finalScore }) {
  const primaryVector = failureTaxonomy.primaryVectors?.[0];
  const secondaryVector = failureTaxonomy.primaryVectors?.[1];
  const primaryDriver = ventureEngine.primaryRiskDrivers?.[0];
  const topMatch = historicalResult.historicalMatches?.[0];

  const lines = [];

  lines.push(`Evaluated as a ${ventureProfile.ventureType} model.`);

  if (primaryVector) {
    lines.push(`Primary structural vulnerability maps to ${primaryVector.name} (${primaryVector.associationScore}% association), driven by ${primaryDriver ? primaryDriver.name.toLowerCase() : 'operational friction'}.`);
  }

  if (secondaryVector) {
    lines.push(`Secondary exposure identified in ${secondaryVector.name}.`);
  }

  if (topMatch && topMatch.name !== 'No sufficiently relevant historical failure found') {
    lines.push(`Historical parallels in PivotVault's verified records (e.g. ${topMatch.name}) demonstrate that ventures sharing this unit architecture experienced distress when ${topMatch.keyLesson.toLowerCase()}`);
  }

  return lines.join(' ');
}

/**
 * Generates actionable pre-launch defensive recommendations.
 */
function generateRecommendations({ ventureProfile, failureTaxonomy }) {
  const recs = [];
  const primaryId = failureTaxonomy.primaryVectors?.[0]?.id;

  switch (primaryId) {
    case 'unit_economics':
      recs.push('Enforce positive per-unit gross contribution margin from day one before investing into paid customer acquisition.');
      recs.push('Calculate fully loaded Customer Acquisition Cost (CAC) including founder time, third-party APIs, and payment processing take-rates.');
      recs.push('Secure 3–5 upfront non-refundable pilot deposits or prepayments to prove commercial willingness to pay without subsidization.');
      break;

    case 'market_need':
      recs.push('Conduct 15 customer discovery interviews focused strictly on frequency of pain rather than feature enthusiasm.');
      recs.push('Verify that target buyers have active line-item budget allocated to solve this problem today.');
      recs.push('Test value proposition with a manual concierge prototype before building custom engineering features.');
      break;

    case 'burn_runway':
      recs.push('Establish a strict 18-month cash runway covenant: freeze non-core headcount until organic retention exceeds 30%.');
      recs.push('Stress-test monthly operating burn against a scenario with zero revenue and zero follow-on venture rounds for 12 months.');
      break;

    case 'hardware_manufacturing':
      recs.push('Verify manufacturing bill of materials (BOM) with multiple contract suppliers to identify single-source component bottlenecks.');
      recs.push('Budget for a 20% initial warranty/defect reserve before committing to high-volume injection tooling.');
      recs.push('Test whether a software-only or off-the-shelf hardware partnership can validate customer demand faster.');
      break;

    case 'regulatory_legal':
      recs.push('Engage regulatory counsel early to draft clear compliance protocols and terms before commercial launch.');
      recs.push('Construct operational firewalls around customer fund handling or sensitive clinical data.');
      break;

    default:
      recs.push('Secure non-refundable customer pre-commitments to validate pricing power before expanding development scope.');
      recs.push('Cap monthly burn at under 1/24th of verified liquid capital to guarantee minimum 24-month survival window.');
      recs.push('Build defensible proprietary workflow locks or data assets rather than competing solely on feature breadth.');
  }

  return recs;
}

/**
 * Master Evaluation Function
 */
async function evaluateVenture(inputData) {
  // 1. Structured Venture Profiling (Groq / Llama 3)
  const ventureProfile = await extractVentureProfile(inputData);

  // 2. PivotVault Deterministic Venture Risk Engine
  const ventureEngine = calculateVentureRisk(ventureProfile);

  // 3. Mapping to 11 Canonical Failure Vectors
  const failureTaxonomy = mapToFailureTaxonomy(ventureProfile, inputData);

  // 4. Historical Failure Retrieval & Similarity Engine
  const historicalResult = await retrieveHistoricalFailures({
    ...ventureProfile,
    primaryVectors: failureTaxonomy.primaryVectors
  }, inputData);

  // 5. Historical ML Benchmark
  const mlResult = await evaluateMLBenchmark(inputData.modelFeatures);

  // 6. Dynamic Multi-Signal Score Calculation
  const vScore = ventureEngine.ventureRiskScore;
  const hScore = historicalResult.historicalSimilarityScore;

  let finalRiskScore = 0;
  let weightsUsed = {};

  if (mlResult.available && typeof mlResult.score === 'number') {
    // 3-Signal Synthesis: 60% Venture Engine + 25% Historical Similarity + 15% ML Benchmark
    weightsUsed = {
      ventureRisk: 0.60,
      historicalSimilarity: 0.25,
      mlBenchmark: 0.15
    };
    finalRiskScore = Math.round(
      (vScore * 0.60) + (hScore * 0.25) + (mlResult.score * 0.15)
    );
  } else {
    // 2-Signal Re-normalized Synthesis: 71% Venture Engine + 29% Historical Similarity
    weightsUsed = {
      ventureRisk: 0.71,
      historicalSimilarity: 0.29,
      mlBenchmark: 0.00
    };
    finalRiskScore = Math.round(
      (vScore * 0.71) + (hScore * 0.29)
    );
  }

  // Clamp 0-100
  finalRiskScore = Math.min(99, Math.max(5, finalRiskScore));

  // Determine Risk Level
  const riskLevel = finalRiskScore >= 75
    ? 'CRITICAL / HIGH RISK'
    : finalRiskScore >= 50
      ? 'MODERATE RISK'
      : 'LOW / CONTROLLED RISK';

  // 7. Multi-Factor Confidence Score
  const confidence = calculateConfidence({
    input: inputData,
    ventureProfile: { ...ventureProfile, ventureRiskScore: vScore },
    historicalResult,
    mlResult
  });

  // 8. Executive Explanation & Recommendations
  const explanation = generateExecutiveExplanation({
    ventureProfile,
    ventureEngine,
    failureTaxonomy,
    historicalResult,
    finalScore: finalRiskScore
  });

  const recommendations = generateRecommendations({
    ventureProfile,
    failureTaxonomy
  });

  return {
    success: true,
    data: {
      idea: inputData.ideaText || inputData.query || '',
      finalRiskScore,
      riskLevel,
      confidence,

      ventureProfile: {
        ventureType: ventureProfile.ventureType,
        businessModel: ventureProfile.businessModel,
        targetCustomer: ventureProfile.targetCustomer,
        coreValueProposition: ventureProfile.coreValueProposition,
        dimensions: ventureProfile.dimensions,
        sources: ventureProfile.sources,
        dimensionReasoning: ventureProfile.dimensionReasoning
      },

      scoring: {
        ventureRiskScore: vScore,
        historicalSimilarityScore: hScore,
        mlBenchmarkScore: mlResult.available ? mlResult.score : null,
        mlBenchmarkStatus: mlResult.available ? 'Active' : 'Unavailable (Pre-launch)',
        mlBenchmarkReason: mlResult.reason,
        weightsUsed
      },

      failureVectors: failureTaxonomy.allVectors,
      primaryFailureVectors: failureTaxonomy.primaryVectors,

      riskDrivers: ventureEngine.primaryRiskDrivers,
      secondaryRiskDrivers: ventureEngine.secondaryRiskDrivers,
      positiveSignals: ventureProfile.positiveSignals,
      assumptions: ventureProfile.primaryAssumptions,
      unknowns: ventureProfile.unknowns,

      historicalMatches: historicalResult.historicalMatches,
      evidenceSummary: historicalResult.evidenceSummary,

      explanation,
      recommendations
    }
  };
}

module.exports = {
  evaluateVenture
};
