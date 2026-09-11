const { scoreIdea } = require('../lib/ideaScoreModel');
const { SpecialistFinding } = require('../lib/types');

const required = ['log_funding', 'funding_rounds', 'days_to_first_funding', 'funding_duration_days', 'is_international'];
function extractFeatures(evidence) {
  const values = {};
  for (const item of evidence) {
    for (const field of required) {
      const match = item.content.match(new RegExp(`\\b${field}\\s*[:=]\\s*(-?\\d+(?:\\.\\d+)?)`, 'i'));
      if (match) values[field] = Number(match[1]);
    }
  }
  const missing = required.filter((field) => !Number.isFinite(values[field]));
  if (missing.length) throw new Error(`Idea Score model features are absent from evidence: ${missing.join(', ')}. Provide verified feature values; they cannot be inferred or defaulted.`);
  return values;
}
async function run({ evidence, marketFinding, historicalFinding }) {
  const features = extractFeatures(evidence);
  const scored = await scoreIdea(features);
  const signals = [marketFinding?.findings?.saturationScore >= 60 && 'Market saturation may make customer acquisition costly.', historicalFinding?.findings?.historicalRiskSignal >= 0.6 && 'Historical evidence contains several comparable failure patterns.'].filter(Boolean);
  return SpecialistFinding.parse({ agentName: 'riskAnalyst', findings: { ideaScore: scored.ideaScore, scoreBreakdown: scored.breakdown, topRisks: signals }, confidence: 0.85, sources: evidence });
}
module.exports = { run };
