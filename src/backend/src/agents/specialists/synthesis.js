const { DecisionDossier } = require('../lib/types');

async function run({ evidence, specialistFindings, critique }) {
  const risk = specialistFindings.risk?.findings;
  if (!risk || !Number.isFinite(risk.ideaScore)) throw new Error('Synthesis requires a completed Idea Score model result.');
  const ideaScore = risk.ideaScore;
  const verdict = ideaScore >= 70 ? 'PROCEED' : ideaScore >= 40 ? 'CAUTION' : 'ABORT';
  const topRisks = [...(risk.topRisks ?? []), ...critique.warnings].slice(0, 5).map((item) => ({ risk: item, evidence: evidence[0]?.content ?? 'No supporting evidence was retrieved.', severity: ideaScore < 40 ? 'critical' : 'high' }));
  return DecisionDossier.parse({ ideaScore, verdict, topRisks, topOpportunities: [{ opportunity: 'Use evidence-led customer validation to improve the strongest uncertain assumption.', evidence: evidence[0]?.content ?? 'Evidence collection is required.' }], redTeamWarnings: critique.warnings, executionPlan: { day30: ['Validate the highest-impact assumption with customer interviews.', 'Define measurement and stop conditions.'], day60: ['Run a constrained pilot and measure retention or willingness to pay.'], day90: ['Decide whether to expand, revise, or stop using the pilot evidence.'] }, sources: evidence.map((item) => ({ sourceUrl: item.sourceUrl, companyName: item.companyName, confidence: item.confidence })) });
}
module.exports = { run };
