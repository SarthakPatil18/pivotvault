import { generateEmbedding } from './embedder.js';
import { getPrisma } from './runtime.js';

const vector = (values) => `[${values.join(',')}]`;

export async function retrieve(queryText, { contentType, limit = 10, threshold = 0.7 } = {}) {
  const query = await generateEmbedding(queryText);
  const prisma = await getPrisma();
  const typeClause = contentType ? 'AND "contentType" = $2' : '';
  const parameters = contentType ? [vector(query), contentType, threshold, limit] : [vector(query), threshold, limit];
  const thresholdPosition = contentType ? '$3' : '$2';
  const limitPosition = contentType ? '$4' : '$3';
  const rows = await prisma.$queryRawUnsafe(
    `SELECT "chunkText", "metadata", "contentId", 1 - ("embedding" <=> $1::vector) AS similarity FROM "Embedding" WHERE 1 - ("embedding" <=> $1::vector) > ${thresholdPosition} ${typeClause} ORDER BY similarity DESC LIMIT ${limitPosition}`,
    ...parameters,
  );
  return rows.map((row) => ({ ...row, similarity: Number(row.similarity), metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata }));
}
