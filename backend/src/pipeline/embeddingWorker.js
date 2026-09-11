import { Worker } from 'bullmq';
import { indexDocument } from '../rag/indexer.js';
import { getPrisma } from '../rag/runtime.js';
import { log } from '../agents/lib/logger.js';

async function queueConfig() {
  const queues = await import('./queues.js').catch(() => null);
  const connection = queues?.connection ?? queues?.redisConnection;
  if (!connection) throw new Error('Pipeline queue connection is unavailable. Export connection from src/pipeline/queues.js.');
  return { connection, queueName: queues.knowledgeIndexerQueue?.name ?? queues.embeddingQueue?.name ?? 'embeddingQueue', retryQueue: queues.retryQueue };
}
async function updateStatus(contentId, status, error) {
  const prisma = await getPrisma();
  await prisma.embeddingJob?.updateMany?.({ where: { contentId }, data: { status, error: error ?? null } });
}

export async function startEmbeddingWorker() {
  const { connection, queueName, retryQueue } = await queueConfig();
  return new Worker(queueName, async (job) => {
    const { contentId, contentType, text, metadata } = job.data;
    try {
      log.worker('embeddingWorker', job.id, 'processing');
      const result = await indexDocument({ contentId, contentType, text, metadata });
      await updateStatus(contentId, 'completed'); log.worker('embeddingWorker', job.id, 'completed'); return result;
    } catch (error) {
      await updateStatus(contentId, 'failed', error.message);
      if (retryQueue) await retryQueue.add('embedding-retry', job.data, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } });
      log.worker('embeddingWorker', job.id, 'failed'); throw error;
    }
  }, { connection, concurrency: 2 });
}
