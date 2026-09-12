/**
 * PivotVault Centralized Environment Configuration
 * RULE: Only file permitted to access process.env directly.
 * Validates all environment variables with Zod schemas.
 */

const path = require('path');
const dotenv = require('dotenv');
const { z } = require('zod');

// Load environment variables from backend root .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  // Database (PostgreSQL with pgvector)
  DATABASE_URL: z.string().url().default('postgresql://postgres:postgres@localhost:5432/pivotvault?schema=public'),
  DIRECT_URL: z.string().optional(),

  // Redis (BullMQ Queues)
  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional().default(''),

  // AI & External APIs
  GEMINI_API_KEY: z.string().default(''),
  GEMINI_MODEL: z.string().default('gemini-1.5-flash'),
  GROQ_API_KEY: z.string().default(''),
  TAVILY_API_KEY: z.string().default(''),
  ML_SERVICE_URL: z.string().url().default('http://127.0.0.1:8001'),

  // Auth & Security
  JWT_SECRET: z.string().default('pivotvault_default_secret_key_change_me'),

  // Server
  PORT: z.coerce.number().default(5001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Environment validation failed:', parsedEnv.error.format());
  throw new Error('Invalid environment variables. Check backend/.env');
}

module.exports = parsedEnv.data;
