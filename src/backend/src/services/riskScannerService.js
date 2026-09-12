/**
 * PivotVault Risk Scanner Orchestrator Service
 * Master coordinator for the Venture Risk Intelligence Engine.
 * 
 * CORE RESPONSIBILITY:
 * Integrates profiling, deterministic scoring, failure taxonomy, historical evidence,
 * and produces a founder-friendly, human-readable diagnostic report.
 */

const { extractVentureProfile } = require('./ventureRiskProfileService');
const { calculateVentureRisk } = require('./ventureRiskEngine');
const { mapToFailureTaxonomy } = require('./failureTaxonomyService');
const { retrieveHistoricalFailures } = require('./historicalSimilarityService');
const { evaluateMLBenchmark } = require('./mlBenchmark');

/**
 * Computes an honest confidence score (0-100%) reflecting evidence depth,
 * input detail, and whether relevant historical post-mortems were found.
 */
function calculateConfidence({ input, ventureProfile, historicalResult, mlResult }) {
  const ideaText = (input.ideaText || '').trim();
  const ideaLength = ideaText.length;

  let base = 50;

  // Detail depth of input
  if (ideaLength < 40) {
    base = 40; // Very brief description yields lower confidence
  } else if (ideaLength > 120) {
    base += 15;
  } else {
    base += 5;
  }

  // Historical evidence availability
  if (historicalResult.hasStrongMatches && historicalResult.historicalMatches?.[0]?.relevanceScore >= 50) {
    base += 20;
  } else {
    base -= 10; // Honest lower confidence when no strong parallels exist in archive
  }

  // Unknown count
  const unknownsCount = ventureProfile.unknowns?.length || 0;
  if (unknownsCount >= 4) {
    base -= 5;
  }

  // Benchmark available
  if (mlResult.available) {
    base += 5;
  }

  return Math.min(92, Math.max(35, Math.round(base)));
}

/**
 * Generates actionable pre-launch defensive recommendations.
 */
function generateRecommendations({ ventureProfile, failureTaxonomy }) {
  if (Array.isArray(ventureProfile.validateFirst) && ventureProfile.validateFirst.length > 0) {
    return ventureProfile.validateFirst;
  }

  const primaryId = failureTaxonomy.primaryVectors?.[0]?.id;
  const recs = [];

  switch (primaryId) {
    case 'competition':
      recs.push('Interview 10 target users to uncover what they dislike most about existing tools and what would genuinely force them to switch.');
      recs.push('Define a tight, narrow beachhead niche (e.g. freelance writers, boutique agencies) rather than attempting to serve everyone initially.');
      recs.push('Test your positioning with a simple landing page and see if users click a "Pre-order" or "Request Access" button.');
      break;

    case 'market_need':
      recs.push('Run 15 customer discovery calls focused on how frequently they experience this problem today and what they currently pay to solve it.');
      recs.push('Offer to solve the problem manually for 3 customers before writing custom software to verify actual demand.');
      recs.push('Test whether users would recommend the tool to a peer after trying an early wireframe or prototype.');
      break;

    case 'unit_economics':
      recs.push('Calculate your estimated cost to acquire a single customer (CAC) and compare it against your expected 6-month gross margin.');
      recs.push('Avoid relying solely on paid ads; identify at least one organic or community distribution loop.');
      recs.push('Validate upfront pricing with paid pilot commitments before building automated self-serve billing.');
      break;

    case 'hardware_manufacturing':
      recs.push('Build a functional off-the-shelf prototype before ordering custom tooling or molds.');
      recs.push('Get quotes from at least 3 contract manufacturers to estimate realistic minimum order quantities and defect rates.');
      recs.push('Collect pre-orders with refundable deposits to confirm strong demand before committing inventory capital.');
      break;

    case 'regulatory_legal':
      recs.push('Consult an industry attorney to verify licensing requirements, data privacy compliance, and terms of service.');
      recs.push('Map out compliance milestones required before accepting paying customers or handling sensitive data.');
      break;

    default:
      recs.push('Speak directly to 10 potential customers about their existing workflow before writing code.');
      recs.push('Validate willingness to pay with a pre-launch landing page or paid pilot agreement.');
      recs.push('Focus on one core killer feature that solves a clear pain point better than existing options.');
  }

  return recs;
}

/**
 * Master Evaluation Function
 */
async function evaluateVenture(inputData) {
  // 1. Structured Venture Profiling (Idea-First, Contradiction-Aware)
  const ventureProfile = await extractVentureProfile(inputData);

  // 2. PivotVault Deterministic Venture Risk Engine (Adaptive Dimensions)
  const ventureEngine = calculateVentureRisk(ventureProfile);

  // 3. Mapping to 11 Canonical Failure Vectors (Guarded against false alarms)
  const failureTaxonomy = mapToFailureTaxonomy(ventureProfile, inputData);

  // 4. Historical Failure Retrieval & Similarity Engine (Strict Relevance)
  const historicalResult = await retrieveHistoricalFailures(ventureProfile, inputData);

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
    ? 'HIGH RISK'
    : finalRiskScore >= 50
      ? 'MODERATE RISK'
      : 'LOW RISK';

  // 7. Multi-Factor Confidence Score
  const confidence = calculateConfidence({
    input: inputData,
    ventureProfile: { ...ventureProfile, ventureRiskScore: vScore },
    historicalResult,
    mlResult
  });

  // 8. Plain-English Executive Diagnosis & Actions
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

      // Structured 4-Part Diagnosis
      diagnosis: {
        whatWeThink: ventureProfile.whatWeThink,
        whyItIsRisky: ventureProfile.whyItIsRisky,
        whatLooksPromising: ventureProfile.whatLooksPromising,
        validateFirst: ventureProfile.validateFirst,
        practicalQuestions: ventureProfile.practicalQuestions
      },

      ventureProfile: {
        ventureType: ventureProfile.ventureType,
        industry: ventureProfile.industry,
        businessModel: ventureProfile.businessModel,
        targetCustomer: ventureProfile.targetCustomer,
        coreValueProposition: ventureProfile.coreValueProposition,
        dimensions: ventureProfile.dimensions,
        dimensionStatus: ventureProfile.dimensionStatus,
        applicableDimensions: ventureProfile.applicableDimensions,
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

      // Relevant failure vectors
      failureVectors: failureTaxonomy.allVectors,
      primaryFailureVectors: failureTaxonomy.primaryVectors,

      // Top active risk drivers
      riskDrivers: ventureEngine.primaryRiskDrivers,
      activeDimensions: ventureEngine.activeDimensions,
      positiveSignals: ventureProfile.positiveSignals,
      assumptions: ventureProfile.primaryAssumptions,
      unknowns: ventureProfile.unknowns,

      // Strictly relevant historical matches
      historicalMatches: historicalResult.historicalMatches,
      hasStrongMatches: historicalResult.hasStrongMatches,
      evidenceSummary: historicalResult.evidenceSummary,

      recommendations
    }
  };
}

module.exports = {
  evaluateVenture
};
