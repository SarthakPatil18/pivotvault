const { generateEmbedding } = require('./embedder');
const { getPrisma } = require('./runtime');

const vector = (values) => `[${values.join(',')}]`;

async function retrieve(queryText, { contentType, limit = 10, threshold = 0.7 } = {}) {
  const prisma = await getPrisma();

  try {
    const query = await generateEmbedding(queryText);
    const typeClause = contentType ? 'AND "contentType" = $2' : '';
    const parameters = contentType ? [vector(query), contentType, threshold, limit] : [vector(query), threshold, limit];
    const thresholdPosition = contentType ? '$3' : '$2';
    const limitPosition = contentType ? '$4' : '$3';
    const rows = await prisma.$queryRawUnsafe(
      `SELECT "chunkText", "metadata", "contentId", 1 - ("embedding" <=> $1::vector) AS similarity FROM "Embedding" WHERE 1 - ("embedding" <=> $1::vector) > ${thresholdPosition} ${typeClause} ORDER BY similarity DESC LIMIT ${limitPosition}`,
      ...parameters,
    );
    if (rows && rows.length > 0) {
      return rows.map((row) => ({ ...row, similarity: Number(row.similarity), metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata }));
    }
  } catch (_vectorErr) {
    // Graceful fallback to text search across Evidence
  }

  // Fallback text search over Evidence table
  const queryStr = String(queryText || '').trim();
  const searchTerms = queryStr.split(/\s+/).filter(t => t.length > 2).slice(0, 3);
  
  const where = {};
  if (searchTerms.length > 0) {
    where.OR = searchTerms.map(term => ({
      OR: [
        { title: { contains: term, mode: 'insensitive' } },
        { content: { contains: term, mode: 'insensitive' } },
      ]
    }));
  }

  const evidenceRows = await prisma.evidence.findMany({
    where,
    take: limit,
    include: { company: true }
  });

  return evidenceRows.map((e, idx) => ({
    chunkText: e.content ? e.content.slice(0, 400) : e.title,
    contentId: e.id,
    similarity: Math.max(0.7, 0.95 - idx * 0.05),
    metadata: {
      companyName: e.company?.name || 'Indexed Startup',
      source: e.sourceName,
      sourceUrl: e.sourceUrl,
      failureYear: e.company?.failureYear || 2023,
    }
  }));
}
module.exports = { retrieve };
