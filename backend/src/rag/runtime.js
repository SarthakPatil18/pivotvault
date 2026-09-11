let prismaOverride;
let configOverride;

function configureRagRuntime({ prisma, config } = {}) {
  prismaOverride = prisma ?? prismaOverride;
  configOverride = config ?? configOverride;
}

async function getPrisma() {
  if (prismaOverride) return prismaOverride;
  let module; try { module = require('../lib/prisma'); } catch { module = null; }
  const client = module?.default ?? module?.prisma ?? module;
  if (!client || typeof client.$queryRawUnsafe !== 'function') throw new Error('Prisma client is unavailable. Configure the RAG runtime or provide src/lib/prisma.js.');
  return client;
}

async function getConfig() {
  if (configOverride) return configOverride;
  let module; try { module = require('../config/env'); } catch { module = null; }
  const config = module?.default ?? module?.env ?? module;
  if (!config) throw new Error('Application configuration is unavailable. Provide src/config/env.js.');
  return config;
}
module.exports = { configureRagRuntime, getPrisma, getConfig };
