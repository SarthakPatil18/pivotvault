const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const logger = require('./lib/logger');
const prisma = require('./lib/prisma');
const ragRoutes = require('./routes/rag.routes');
const agentRoutes = require('./routes/agent.routes');
const aiRoutes = require('./routes/ai');
const startupsRoutes = require('./routes/startups.routes');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'PivotVault API', timestamp: new Date().toISOString() }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'PivotVault API', timestamp: new Date().toISOString() }));
app.use('/api', startupsRoutes);
app.use('/api/rag', ragRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/ai', aiRoutes);
app.use((err, _req, res, _next) => { logger.error(`[API] ${err.message}`); res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' }); });

if (require.main === module) {
  const server = app.listen(env.PORT, () => logger.info(`PivotVault API listening on port ${env.PORT}`));
  const shutdown = async () => { server.close(); await prisma.$disconnect(); };
  process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown);
}
module.exports = app;
