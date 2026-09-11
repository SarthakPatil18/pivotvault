import { callGemini, wrapExternalContent } from '../agents/lib/ai.js';
import { log } from '../agents/lib/logger.js';
import { rerank } from './reranker.js';
import { retrieve } from './retriever.js';

export async function ragSearch(query, options = {}) {
  const started = Date.now();
  const chunks = rerank(query, await retrieve(query, options));
  log.rag('search', chunks.length, Date.now() - started);
  return chunks;
}

export async function ragAsk(query, options = {}) {
  const started = Date.now();
  const chunks = await ragSearch(query, options);
  const context = chunks.map((chunk, index) => `[CHUNK ${index + 1} - ${chunk.metadata?.companyName ?? 'Unknown company'}, ${chunk.metadata?.failureYear ?? 'Unknown year'}]: ${wrapExternalContent(chunk.chunkText)}`).join('\n\n');
  const answer = await callGemini(`Based only on these startup failure case studies:\n${context}\n\nAnswer this question: ${query}`, { maxTokens: options.maxTokens ?? 1000 });
  if (answer == null) throw new Error('No configured LLM was able to generate a RAG answer.');
  log.rag('ask', chunks.length, Date.now() - started);
  return { answer, sources: chunks.map((chunk) => ({ contentId: chunk.contentId, metadata: chunk.metadata, similarity: chunk.similarity })), tokensUsed: null, chunksUsed: chunks.length };
}
