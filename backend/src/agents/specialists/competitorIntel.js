import { SpecialistFinding } from '../lib/types.js';
export async function run({ evidence }) {
  const incumbents = [...new Set(evidence.flatMap((item) => item.content.match(/\b[A-Z][A-Za-z0-9&.-]{2,}\b/g) ?? []))].slice(0, 10);
  const corpus = evidence.map((item) => item.content.toLowerCase()).join(' ');
  return SpecialistFinding.parse({ agentName: 'competitorIntel', findings: { incumbents, moatStrength: Math.min(100, (corpus.match(/network effect|switching cost|brand|patent/g) ?? []).length * 20), alternativeSolutions: [...new Set((corpus.match(/(?:alternative|manual|spreadsheet|in-house)/g) ?? []))] }, confidence: Math.min(1, 0.25 + evidence.length / 12), sources: evidence });
}
