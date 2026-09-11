/**
 * PivotVault Redis Connection Configuration for BullMQ
 */

const Redis = require('ioredis');
const env = require('./env');
const logger = require('../lib/logger');

const redisConfig = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null, // Required by BullMQ
  enableReadyCheck: false,
  reconnectOnError: (err) => {
    logger.warn(`Redis reconnecting on error: ${err.message}`);
    return true;
  },
  retryStrategy: (times) => {
    if (times > 10) {
      logger.error('Redis retry limit exceeded (10 attempts).');
      return null;
    }
    const delay = Math.min(times * 200, 2000);
    return delay;
  },
};

let redisClient = null;

function getRedisClient() {
  if (!redisClient) {
    redisClient = new Redis(redisConfig);

    redisClient.on('connect', () => {
      logger.info(`Connected to Redis at ${env.REDIS_HOST}:${env.REDIS_PORT}`);
    });

    redisClient.on('error', (err) => {
      logger.error(`Redis connection error: ${err.message}`);
    });
  }
  return redisClient;
}

module.exports = {
  redisConfig,
  getRedisClient,
};
