const { chunkText } = require('./chunker');
const { generateEmbeddings } = require('./embedder');
const { getPrisma } = require('./runtime');

const vector = (values) => `[${values.join(',')}]`;

async function indexDocument({ contentId, contentType, text, metadata = {} }) {
  if (!contentId || !contentType || !text) throw new Error('contentId, contentType, and text are required for indexing.');
  const prisma = await getPrisma();
  const chunks = chunkText(text);
  const embeddings = await generateEmbeddings(chunks);
  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe('DELETE FROM "Embedding" WHERE "contentId" = $1 AND "contentType" = $2', contentId, contentType);
    for (let index = 0; index < chunks.length; index += 1) {
      await tx.$executeRawUnsafe(
        'INSERT INTO "Embedding" ("contentId", "contentType", "chunkText", "metadata", "embedding") VALUES ($1, $2, $3, $4::jsonb, $5::vector)',
        contentId, contentType, chunks[index], JSON.stringify({ ...metadata, chunkIndex: index }), vector(embeddings[index]),
      );
    }
  });
  if (metadata.companyName) await prisma.company.updateMany({ where: { name: metadata.companyName }, data: { enriched: true } });
  console.info('[RAG][INDEX] indexed document', { contentId, contentType, chunks: chunks.length });
  return { contentId, contentType, chunksIndexed: chunks.length };
}
module.exports = { indexDocument };
