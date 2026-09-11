import { tools } from '../lib/tools.js';
import { Evidence } from '../lib/types.js';

const confidence = (source) => source.score ?? source.similarity ?? 0.6;
export async function run(agentInput) {
  const query = `${agentInput.query}\n${agentInput.ideaText}\nMarket: ${agentInput.market}`;
  const [chunks, web, claims] = await Promise.allSettled([tools.searchRAG({ query }), tools.searchWeb({ query }), tools.getClaims({ companyName: agentInput.market })]);
  const candidates = [
    ...(chunks.status === 'fulfilled' ? chunks.value.map((item) => ({ sourceUrl: item.metadata?.source ?? '', content: item.chunkText, confidence: item.similarity, companyName: item.metadata?.companyName ?? '' })) : []),
    ...(web.status === 'fulfilled' ? web.value.map((item) => ({ sourceUrl: item.url ?? '', content: item.content ?? item.title ?? '', confidence: confidence(item), companyName: item.title ?? '' })) : []),
    ...(claims.status === 'fulfilled' ? claims.value.map((item) => ({ sourceUrl: item.sourceUrl ?? '', content: item.content ?? item.claim ?? JSON.stringify(item), confidence: item.confidence ?? 0.8, companyName: item.companyName ?? '' })) : []),
  ].filter((item) => item.content);
  const seen = new Set();
  return candidates.filter((item) => { const key = `${item.sourceUrl}|${item.content.slice(0, 160)}`; if (seen.has(key)) return false; seen.add(key); return true; })
    .sort((a, b) => b.confidence - a.confidence).map((item) => Evidence.parse(item));
}
