/**
 * PivotVault Data Pipeline Entrypoint (Dev 1)
 * Initializes queues, starts pipeline workers, and manages lifecycle.
 */

const { startWorkers, stopWorkers } = require('./workers');
const { startScheduler, stopScheduler } = require('./scheduler');
const { closeAllQueues } = require('./queues');
const logger = require('../lib/logger');

function initPipeline() {
  logger.info('==========================================');
  logger.info('  PivotVault Background Data Pipeline     ');
  logger.info('  Developer 1: Database & Pipeline Layer  ');
  logger.info('==========================================');

  const workers = startWorkers();
  startScheduler();

  const shutdown = async () => {
    logger.info('Received shutdown signal. Stopping pipeline gracefully...');
    stopScheduler();
    await stopWorkers();
    await closeAllQueues();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  return { workers };
}

if (require.main === module) {
  initPipeline();
}

module.exports = { initPipeline };
