import { SpecialistFinding } from '../lib/types.js';
export async function run({ agentInput, evidence }) {
  const corpus = evidence.map((item) => item.content.toLowerCase()).join(' ');
  const count = (pattern) => (corpus.match(pattern) ?? []).length;
  const saturation = Math.min(100, count(/competitor|crowded|saturated|incumbent/g) * 12);
  return SpecialistFinding.parse({ agentName: 'marketIntel', findings: { marketSize: count(/billion|million|tam|market size/g) ? 'Evidence indicates a measurable market' : 'Insufficient market-size evidence', saturationScore: saturation, timingRisk: Math.min(100, count(/downturn|regulation|headwind|slowdown/g) * 15), sectorTrend: `Evidence mentions ${agentInput.market}` }, confidence: Math.min(1, 0.25 + evidence.length / 12), sources: evidence });
}
