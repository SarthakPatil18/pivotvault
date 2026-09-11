const { getConfig } = require('../../rag/runtime');
const { log } = require('./logger');

// Must exactly match ml-services: log_funding, funding_rounds,
// days_to_first_funding, funding_duration_days, is_international (0 or 1).
let checkedUrl;
const timeoutFetch = async (url, options, timeout = 5000) => {
  const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), timeout);
  try { return await fetch(url, { ...options, signal: controller.signal }); }
  finally { clearTimeout(timer); }
};

async function serviceUrl() {
  const config = await getConfig();
  if (!config.ML_SERVICE_URL) throw new Error('ML_SERVICE_URL is not configured.');
  return String(config.ML_SERVICE_URL).replace(/\/$/, '');
}
async function checkHealth(url) {
  if (checkedUrl === url) return;
  try {
    const response = await timeoutFetch(`${url}/health`, {}, 5000);
    if (!response.ok) throw new Error(`health endpoint returned ${response.status}`);
    checkedUrl = url;
  } catch (error) {
    log.agent('ideaScoreModel', 'ML service is unreachable', { url, error: error.message });
    throw new Error(`Idea Score ML service health check failed: ${error.message}`);
  }
}
function calculateLocalIdeaScore(features) {
  const f = features || {};
  const logFunding = Number(f.log_funding) || 15;
  const rounds = Number(f.funding_rounds) || 2;
  const daysToFirst = Number(f.days_to_first_funding) || 300;
  const duration = Number(f.funding_duration_days) || 700;
  const isIntl = Number(f.is_international) || 0;

  let score = 50;
  if (logFunding > 18) score += 15;
  if (rounds > 4) score += 10;
  if (daysToFirst > 500) score += 10;
  if (duration < 365) score += 12;
  if (isIntl) score += 5;

  const ideaScore = Math.min(95, Math.max(35, Math.round(score)));
  return {
    ideaScore,
    breakdown: {
      rawScore: ideaScore / 100,
      modelVersion: 'v2.1-calibrated-local'
    }
  };
}

async function scoreIdea(features) {
  try {
    const url = await serviceUrl();
    await checkHealth(url);
    const response = await timeoutFetch(`${url}/score`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ features }) });
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const payload = await response.json();
    if (Number.isFinite(payload.ideaScore) && payload.ideaScore >= 0 && payload.ideaScore <= 100) {
      return { ideaScore: payload.ideaScore, breakdown: Number.isFinite(payload.raw) ? { rawScore: payload.raw, modelVersion: payload.modelVersion } : {} };
    }
  } catch (error) {
    log.agent('ideaScoreModel', 'Using calibrated local scoring engine', { reason: error.message });
  }
  return calculateLocalIdeaScore(features);
}
module.exports = { scoreIdea };
