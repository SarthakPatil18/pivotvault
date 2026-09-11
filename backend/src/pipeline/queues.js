/**
 * PivotVault BullMQ Queues (Dev 1)
 * Defines all 10 background queues supporting the 9-stage pipeline and error retries.
 * 
 * CRITICAL HANDOFF:
 * `embeddingQueue` is written by Dev 1 (knowledgeIndexerWorker)
 * and consumed exclusively by Dev 2 (embeddingWorker).
 */

const { Queue } = require('bullmq');
const { redisConfig } = require('../config/redis');
const logger = require('../lib/logger');

const QUEUE_NAMES = {
  SOURCE_DISCOVERY: 'sourceDiscoveryQueue',
  SOURCE_READER: 'sourceReaderQueue',
  EVIDENCE_EXTRACTION: 'evidenceExtractionQueue',
  EVIDENCE_VERIFICATION: 'evidenceVerificationQueue',
  ENTITY_RESOLUTION: 'entityResolutionQueue',
  KNOWLEDGE_BUILDER: 'knowledgeBuilderQueue',
  EMBEDDING: 'embeddingQueue', // Handoff Queue for Dev 2
  PATTERN_MINER: 'patternMinerQueue',
  INTELLIGENCE_REPORTER: 'intelligenceReporterQueue',
  RETRY: 'retryQueue',
};

const defaultQueueOptions = {
  connection: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      age: 3600, // Keep completed jobs for 1 hour
      count: 1000,
    },
    removeOnFail: {
      age: 86400, // Keep failed jobs for 24 hours
    },
  },
};

// Instantiate all queues
const queues = {
  sourceDiscoveryQueue: new Queue(QUEUE_NAMES.SOURCE_DISCOVERY, defaultQueueOptions),
  sourceReaderQueue: new Queue(QUEUE_NAMES.SOURCE_READER, defaultQueueOptions),
  evidenceExtractionQueue: new Queue(QUEUE_NAMES.EVIDENCE_EXTRACTION, defaultQueueOptions),
  evidenceVerificationQueue: new Queue(QUEUE_NAMES.EVIDENCE_VERIFICATION, defaultQueueOptions),
  entityResolutionQueue: new Queue(QUEUE_NAMES.ENTITY_RESOLUTION, defaultQueueOptions),
  knowledgeBuilderQueue: new Queue(QUEUE_NAMES.KNOWLEDGE_BUILDER, defaultQueueOptions),
  embeddingQueue: new Queue(QUEUE_NAMES.EMBEDDING, defaultQueueOptions), // Handoff to Dev 2
  patternMinerQueue: new Queue(QUEUE_NAMES.PATTERN_MINER, defaultQueueOptions),
  intelligenceReporterQueue: new Queue(QUEUE_NAMES.INTELLIGENCE_REPORTER, defaultQueueOptions),
  retryQueue: new Queue(QUEUE_NAMES.RETRY, defaultQueueOptions),
};

// Monitor queue events
Object.entries(queues).forEach(([name, queue]) => {
  queue.on('error', (err) => {
    logger.error(`Queue error on [${name}]: ${err.message}`);
  });
});

/**
 * Safely closes all queues
 */
async function closeAllQueues() {
  logger.info('Closing all BullMQ queues...');
  await Promise.all(Object.values(queues).map((q) => q.close()));
  logger.info('All queues closed.');
}

module.exports = {
  QUEUE_NAMES,
  queues,
  closeAllQueues,
};
