/**
 * Historical ML Benchmark Service
 * Wraps the trained 5-feature Random Forest model as a secondary capitalization benchmark.
 * Enforces strict honesty: Never fabricates missing funding numbers or returns a silent 50.
 */

const { getConfig } = require('../rag/runtime');

async function evaluateMLBenchmark(modelFeatures = null) {
  // If features were not explicitly provided or are pre-launch zeros
  if (
    !modelFeatures ||
    typeof modelFeatures !== 'object' ||
    !Number.isFinite(modelFeatures.funding_rounds) ||
    (modelFeatures.funding_rounds === 0 && modelFeatures.log_funding === 0)
  ) {
    return {
      available: false,
      score: null,
      reason: 'Pre-launch concepts lack historical venture financing rounds required by the 5-feature capitalization model.',
      signalContribution: 0
    };
  }

  // Attempt real inference via FastAPI
  try {
    const config = await getConfig();
    const serviceUrl = String(config.ML_SERVICE_URL || 'http://127.0.0.1:8001').replace(/\/$/, '');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${serviceUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ features: modelFeatures }),
      signal: controller.signal
    }).finally(() => clearTimeout(timer));

    if (res.ok) {
      const data = await res.json();
      if (Number.isFinite(data.ideaScore)) {
        return {
          available: true,
          score: Math.round(data.ideaScore),
          raw: data.raw,
          modelVersion: data.modelVersion || 'startup-model-rf',
          reason: 'Verified inference from Random Forest capitalization classifier.'
        };
      }
    }
  } catch {
    // Service offline or unreachable
  }

  // Never return a fabricated 50
  return {
    available: false,
    score: null,
    reason: 'ML service offline or connection refused. Scoring proceeded using verified venture and historical engines.',
    signalContribution: 0
  };
}

module.exports = {
  evaluateMLBenchmark
};
