const words = (text) => new Set(String(text).toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []);

function rerank(query, chunks = []) {
  const queryWords = words(query);
  return chunks.map((chunk) => {
    const chunkWords = words(chunk.chunkText);
    const overlap = [...queryWords].filter((word) => chunkWords.has(word)).length / Math.max(queryWords.size, 1);
    const year = Number(chunk.metadata?.failureYear ?? 0);
    const recency = year ? Math.max(0, Math.min(1, (year - 2000) / 30)) : 0;
    return { ...chunk, rerankScore: (chunk.similarity * 0.6) + (overlap * 0.3) + (recency * 0.1) };
  }).sort((a, b) => b.rerankScore - a.rerankScore).slice(0, 5);
}
module.exports = { rerank };
