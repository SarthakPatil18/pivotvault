/**
 * PivotVault Pipeline Scheduler (Dev 1)
 * Schedules recurring discovery jobs across sources.
 */

const { queues } = require('./queues');
const logger = require('../lib/logger');

let cronTimer = null;

/**
 * Dispatches a source discovery cycle into the queue
 */
async function triggerDiscoverySweep(source = 'all') {
  logger.info(`[Scheduler] Triggering discovery sweep for [${source}]...`);
  const job = await queues.sourceDiscoveryQueue.add('scheduled-discovery', { source });
  return job;
}

/**
 * Starts scheduler with periodic execution interval (default: every 6 hours)
 */
function startScheduler(intervalMs = 6 * 60 * 60 * 1000) {
  logger.info(`[Scheduler] Starting recurring pipeline scheduler (interval: ${intervalMs / 1000}s)...`);

  // Run initial trigger on boot in production/dev
  triggerDiscoverySweep('all').catch((err) => {
    logger.error(`[Scheduler] Initial discovery run failed: ${err.message}`);
  });

  cronTimer = setInterval(() => {
    logger.info('[Scheduler] Interval triggered. Dispatching scheduled discovery sweep...');
    triggerDiscoverySweep('all').catch((err) => {
      logger.error(`[Scheduler] Recurring sweep failed: ${err.message}`);
    });
  }, intervalMs);

  return cronTimer;
}

/**
 * Stops scheduler
 */
function stopScheduler() {
  if (cronTimer) {
    clearInterval(cronTimer);
    cronTimer = null;
    logger.info('[Scheduler] Stopped recurring scheduler.');
  }
}

module.exports = {
  triggerDiscoverySweep,
  startScheduler,
  stopScheduler,
};
