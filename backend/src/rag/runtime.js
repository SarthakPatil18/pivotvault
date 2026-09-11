let prismaOverride;
let configOverride;

export function configureRagRuntime({ prisma, config } = {}) {
  prismaOverride = prisma ?? prismaOverride;
  configOverride = config ?? configOverride;
}

export async function getPrisma() {
  if (prismaOverride) return prismaOverride;
  const module = await import('../../lib/prisma.js').catch(() => null);
  const client = module?.default ?? module?.prisma;
  if (!client) throw new Error('Prisma client is unavailable. Configure the RAG runtime or provide src/lib/prisma.js.');
  return client;
}

export async function getConfig() {
  if (configOverride) return configOverride;
  const module = await import('../../config/env.js').catch(() => null);
  const config = module?.default ?? module?.env ?? module;
  if (!config) throw new Error('Application configuration is unavailable. Provide src/config/env.js.');
  return config;
}
