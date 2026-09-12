const logger = require('./logger');

let prisma;
try {
  const { PrismaClient } = require('@prisma/client');
  const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
  prisma = new PrismaClient({
    datasources: {
      db: { url: dbUrl }
    }
  });
} catch (error) {
  logger.warn(`Prisma client not yet compiled (${error.message}). Using fallback client.`);
  const unavailable = async () => { throw new Error('Prisma client is unavailable. Run npm run prisma:generate before starting the API.'); };
  prisma = new Proxy({}, { get: (_target, property) => property === '$disconnect' ? async () => {} : property === '$transaction' ? async (callback) => callback(prisma) : new Proxy({}, { get: () => unavailable }) });
}

module.exports = prisma;
