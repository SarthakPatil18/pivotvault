/**
 * PivotVault Structured Logger
 * Provides consistent logging for scrapers, pipeline workers, and DB operations.
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const currentLevel = process.env.NODE_ENV === 'test' ? LOG_LEVELS.WARN : LOG_LEVELS.DEBUG;

function formatTimestamp() {
  return new Date().toISOString();
}

function logMessage(level, message, meta = {}) {
  if (LOG_LEVELS[level] < currentLevel) return;

  const payload = {
    timestamp: formatTimestamp(),
    level,
    message,
    ...(Object.keys(meta).length > 0 ? { meta } : {}),
  };

  const colorMap = {
    DEBUG: '\x1b[34m', // Blue
    INFO: '\x1b[32m',  // Green
    WARN: '\x1b[33m',  // Yellow
    ERROR: '\x1b[31m', // Red
  };

  const resetColor = '\x1b[0m';
  const prefix = `${colorMap[level] || ''}[${level}]${resetColor} [${payload.timestamp}]`;

  if (level === 'ERROR') {
    console.error(`${prefix} ${message}`, Object.keys(meta).length ? meta : '');
  } else if (level === 'WARN') {
    console.warn(`${prefix} ${message}`, Object.keys(meta).length ? meta : '');
  } else {
    console.log(`${prefix} ${message}`, Object.keys(meta).length ? meta : '');
  }
}

const logger = {
  debug: (message, meta) => logMessage('DEBUG', message, meta),
  info: (message, meta) => logMessage('INFO', message, meta),
  warn: (message, meta) => logMessage('WARN', message, meta),
  error: (message, meta) => logMessage('ERROR', message, meta),
};

module.exports = logger;
