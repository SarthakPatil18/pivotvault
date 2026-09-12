/**
 * Risk Scanner Regression Test
 * Validates that different startup ideas produce meaningfully different risk scores,
 * and the same idea produces stable (identical) scores.
 *
 * Usage: node test-idea-diversity.js
 */

// Directly test the service layer to bypass needing a running server
const { extractVentureProfile } = require('./src/services/ventureRiskProfileService');
const { calculateVentureRisk } = require('./src/services/ventureRiskEngine');
const { mapToFailureTaxonomy } = require('./src/services/failureTaxonomyService');
const { retrieveHistoricalFailures } = require('./src/services/historicalSimilarityService');
const { evaluateMLBenchmark } = require('./src/services/mlBenchmark');

// Stub getConfig and getPrisma so they don't crash in test
const runtime = require('./src/rag/runtime');
runtime.configureRagRuntime({
  prisma: { company: { findMany: async () => [] }, $queryRawUnsafe: async () => [] },
  config: {
    DATABASE_URL: 'test',
    GEMINI_API_KEY: '', // Empty = will fall back to deterministic
    GROQ_API_KEY: '',   // Empty = will fall back to deterministic
    ML_SERVICE_URL: 'http://127.0.0.1:99999' // Non-existent = ML benchmark unavailable
  }
});

const TEST_IDEAS = [
  {
    label: 'A: AI Accounting Software',
    ideaText: 'AI accounting software for small businesses that automates invoicing, expense tracking, and tax preparation',
    industry: 'Software / SaaS',
    targetCustomer: 'Small and medium businesses',
    businessModel: 'Monthly / yearly subscription',
    burnRate: 'Bootstrapped (Under $10k/mo)',
    hardwareInvolved: false,
    regulatoryHeavy: false
  },
  {
    label: 'B: Food Delivery Marketplace',
    ideaText: 'Food delivery marketplace for college students that connects local restaurants with campus dorms using student couriers',
    industry: 'Food / Delivery',
    targetCustomer: 'Individual consumers',
    businessModel: 'Marketplace commission',
    burnRate: 'Early Stage ($10k - $50k/mo)',
    hardwareInvolved: false,
    regulatoryHeavy: false
  },
  {
    label: 'C: Smart Agriculture IoT',
    ideaText: 'Smart agriculture IoT device for farmers that monitors soil moisture, temperature, and crop health using embedded sensors and real-time dashboards',
    industry: 'Hardware & Devices',
    targetCustomer: 'Small and medium businesses',
    businessModel: 'One-time purchase',
    burnRate: 'Funded ($50k - $150k/mo)',
    hardwareInvolved: true,
    regulatoryHeavy: false
  },
  {
    label: 'D: Social Network for Teenagers',
    ideaText: 'Social networking app for teenagers focused on sharing short creative videos and collaborative art projects with friends',
    industry: 'Social & Community',
    targetCustomer: 'Individual consumers',
    businessModel: 'Advertising',
    burnRate: 'Early Stage ($10k - $50k/mo)',
    hardwareInvolved: false,
    regulatoryHeavy: false
  },
  {
    label: 'E: Enterprise Cybersecurity',
    ideaText: 'Enterprise cybersecurity platform that uses machine learning to detect insider threats and anomalous network behavior in real-time for large companies',
    industry: 'Software / SaaS',
    targetCustomer: 'Large companies',
    businessModel: 'Monthly / yearly subscription',
    burnRate: 'Funded ($50k - $150k/mo)',
    hardwareInvolved: false,
    regulatoryHeavy: false
  }
];

async function runFullPipeline(input) {
  const ventureProfile = await extractVentureProfile(input);
  const ventureEngine = calculateVentureRisk(ventureProfile);
  const failureTaxonomy = mapToFailureTaxonomy(ventureProfile, input);
  const historicalResult = await retrieveHistoricalFailures(ventureProfile, input);
  const mlResult = await evaluateMLBenchmark(input.modelFeatures || null);

  const vScore = ventureEngine.ventureRiskScore;
  const hScore = historicalResult.historicalSimilarityScore;
  let finalRiskScore;

  if (mlResult.available && typeof mlResult.score === 'number') {
    finalRiskScore = Math.round((vScore * 0.60) + (hScore * 0.25) + (mlResult.score * 0.15));
  } else {
    finalRiskScore = Math.round((vScore * 0.71) + (hScore * 0.29));
  }
  finalRiskScore = Math.min(99, Math.max(5, finalRiskScore));

  return {
    finalRiskScore,
    ventureRiskScore: vScore,
    historicalScore: hScore,
    mlAvailable: mlResult.available,
    ventureType: ventureProfile.ventureType,
    topDimensions: ventureEngine.activeDimensions.slice(0, 3).map(d => `${d.label}:${d.score}`),
    whatWeThink: ventureProfile.whatWeThink?.slice(0, 100) + '...',
    whyItIsRisky: ventureProfile.whyItIsRisky?.length || 0,
    validateFirst: ventureProfile.validateFirst?.length || 0
  };
}

async function main() {
  console.log('=======================================================');
  console.log('  PIVOTVAULT RISK SCANNER - DIVERSITY REGRESSION TEST');
  console.log('=======================================================\n');

  const results = [];

  for (const idea of TEST_IDEAS) {
    const result = await runFullPipeline(idea);
    results.push({ label: idea.label, ...result });
    console.log(`\n--- ${idea.label} ---`);
    console.log(`  Final Risk Score:    ${result.finalRiskScore}/100`);
    console.log(`  Venture Risk Score:  ${result.ventureRiskScore}`);
    console.log(`  Historical Score:    ${result.historicalScore}`);
    console.log(`  ML Available:        ${result.mlAvailable}`);
    console.log(`  Venture Type:        ${result.ventureType}`);
    console.log(`  Top Dimensions:      ${result.topDimensions.join(', ')}`);
    console.log(`  Diagnosis Present:   whatWeThink=Y  whyRisky=${result.whyItIsRisky}  validate=${result.validateFirst}`);
  }

  // DIVERSITY CHECK
  console.log('\n=======================================================');
  console.log('  DIVERSITY VERIFICATION');
  console.log('=======================================================\n');

  const finalScores = results.map(r => r.finalRiskScore);
  const uniqueFinalScores = new Set(finalScores);
  const ventureScores = results.map(r => r.ventureRiskScore);
  const uniqueVentureScores = new Set(ventureScores);

  console.log(`Final Scores:          ${finalScores.join(', ')}`);
  console.log(`Unique Final Scores:   ${uniqueFinalScores.size} / ${finalScores.length}`);
  console.log(`Venture Risk Scores:   ${ventureScores.join(', ')}`);
  console.log(`Unique Venture Scores: ${uniqueVentureScores.size} / ${ventureScores.length}`);

  let passed = true;
  if (uniqueFinalScores.size < 3) {
    console.log('\nFAIL: Less than 3 unique final scores across 5 different ideas!');
    passed = false;
  } else {
    console.log('\nPASS: Different ideas produce different final scores.');
  }

  if (uniqueVentureScores.size < 3) {
    console.log('FAIL: Less than 3 unique venture risk scores across 5 different ideas!');
    passed = false;
  } else {
    console.log('PASS: Different ideas produce different venture risk scores.');
  }

  // STABILITY CHECK
  console.log('\n=======================================================');
  console.log('  STABILITY VERIFICATION (Same idea twice)');
  console.log('=======================================================\n');

  const run1 = await runFullPipeline(TEST_IDEAS[0]);
  const run2 = await runFullPipeline(TEST_IDEAS[0]);

  console.log(`Run 1: Final=${run1.finalRiskScore}  Venture=${run1.ventureRiskScore}`);
  console.log(`Run 2: Final=${run2.finalRiskScore}  Venture=${run2.ventureRiskScore}`);

  if (run1.finalRiskScore === run2.finalRiskScore && run1.ventureRiskScore === run2.ventureRiskScore) {
    console.log('PASS: Same idea produces identical scores (stable/deterministic).');
  } else {
    console.log('FAIL: Same idea produced different scores!');
    passed = false;
  }

  // SUMMARY
  console.log('\n=======================================================');
  if (passed) {
    console.log('  ALL TESTS PASSED');
  } else {
    console.log('  SOME TESTS FAILED');
  }
  console.log('=======================================================\n');

  process.exit(passed ? 0 : 1);
}

main().catch(err => {
  console.error('Test script failed:', err);
  process.exit(1);
});
