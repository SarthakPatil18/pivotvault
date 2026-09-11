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
async function scoreIdea(features) {
  const url = await serviceUrl();
  await checkHealth(url);
  let response;
  try { response = await timeoutFetch(`${url}/score`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ features }) }); }
  catch (error) { throw new Error(`Idea Score ML service request failed: ${error.name === 'AbortError' ? 'timed out after 5 seconds' : error.message}`); }
  if (!response.ok) throw new Error(`Idea Score ML service rejected features (${response.status}): ${await response.text()}`);
  const payload = await response.json();
  if (!Number.isFinite(payload.ideaScore) || payload.ideaScore < 0 || payload.ideaScore > 100) throw new Error('Idea Score ML service returned an invalid score.');
  return { ideaScore: payload.ideaScore, breakdown: Number.isFinite(payload.raw) ? { rawScore: payload.raw, modelVersion: payload.modelVersion } : {} };
}
module.exports = { scoreIdea };
