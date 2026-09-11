export function chunkText(text, chunkSize = 512, overlap = 64) {
  if (typeof text !== 'string' || !text.trim()) return [];
  if (!Number.isInteger(chunkSize) || !Number.isInteger(overlap) || chunkSize < 1 || overlap < 0 || overlap >= chunkSize) {
    throw new Error('chunkSize must be positive and overlap must be smaller than chunkSize.');
  }
  const sentences = text.trim().match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [text.trim()];
  const chunks = [];
  let words = [];
  for (const sentence of sentences) {
    const sentenceWords = sentence.trim().split(/\s+/).filter(Boolean);
    if (words.length && words.length + sentenceWords.length > chunkSize) {
      chunks.push(words.join(' '));
      words = words.slice(Math.max(0, words.length - overlap));
    }
    while (sentenceWords.length) {
      const capacity = chunkSize - words.length;
      words.push(...sentenceWords.splice(0, capacity));
      if (words.length === chunkSize) {
        chunks.push(words.join(' '));
        words = words.slice(-overlap);
      }
    }
  }
  if (words.length) chunks.push(words.join(' '));
  return chunks;
}
