import { SpecialistFinding } from '../lib/types.js';
const matched = (evidence, terms) => evidence.filter((item) => terms.some((term) => item.content.toLowerCase().includes(term)));
export async function run({ agentInput, evidence }) {
  const terms = agentInput.market.toLowerCase().split(/\W+/).filter(Boolean);
  const matches = matched(evidence, terms);
  return SpecialistFinding.parse({ agentName: 'historicalIntel', findings: { similarCompanies: matches.slice(0, 5).map((item) => item.companyName || 'Unnamed company'), failurePatterns: [...new Set(matches.flatMap((item) => (item.content.match(/(?:failed|shutdown|burn|competition|demand)/gi) ?? []).map((word) => word.toLowerCase())))], historicalRiskSignal: Math.min(1, matches.length / 5) }, confidence: Math.min(1, 0.3 + matches.length / 10), sources: matches });
}
