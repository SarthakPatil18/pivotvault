import { ragSearch } from '../../rag/rag.service.js';
import { getConfig, getPrisma } from '../../rag/runtime.js';
import { wrapExternalContent } from './ai.js';
import { scoreIdea } from './ideaScoreModel.js';
import { log } from './logger.js';

const external = (value) => wrapExternalContent(JSON.stringify(value));
export const tools = {
  async searchWeb({ query, maxResults = 5 }) {
    const config = await getConfig();
    if (!config.TAVILY_API_KEY) throw new Error('TAVILY_API_KEY is not configured.');
    const response = await fetch('https://api.tavily.com/search', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ api_key: config.TAVILY_API_KEY, query, max_results: maxResults, search_depth: 'basic' }) });
    if (!response.ok) throw new Error(`Tavily search failed (${response.status}).`);
    const sources = (await response.json()).results ?? [];
    log.external('tavily', query, sources.length);
    return sources;
  },
  async getCompany({ name, slug }) { const prisma = await getPrisma(); return prisma.company.findFirst({ where: { OR: [{ name }, { slug }] } }); },
  async scanRisks({ features }) { return scoreIdea(features); },
  async getFiling({ companyId }) { const prisma = await getPrisma(); return prisma.filing.findMany({ where: { companyId } }); },
  async getClaims({ companyName }) { const prisma = await getPrisma(); return prisma.claim.findMany({ where: { company: { name: companyName }, verified: true } }); },
  async queryGraph({ companyId }) { const prisma = await getPrisma(); return prisma.knowledgeGraphEdge.findMany({ where: { OR: [{ sourceId: companyId }, { targetId: companyId }] } }); },
  async searchRAG({ query, ...options }) { return ragSearch(query, options); },
};
export async function dispatchTool(toolName, params) {
  const tool = tools[toolName];
  if (!tool) throw new Error(`Unknown tool: ${toolName}`);
  return external(await tool(params));
}
