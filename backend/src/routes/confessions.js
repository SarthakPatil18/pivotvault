const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const rateLimit = require('express-rate-limit');

const prisma = new PrismaClient();
const router = express.Router();

const submitLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1,
  keyGenerator: (req) => req.ip,
  message: { error: 'You can only submit one confession every 10 minutes.', code: 'RATE_LIMITED' }
});

// GET /api/confessions - List confessions
router.get('/', async (req, res, next) => {
  try {
    const sort = req.query.sort === 'recent' ? 'desc' : 'desc';
    const orderBy = req.query.sort === 'top' ? { upvotes: 'desc' } : { createdAt: sort };

    const confessions = await prisma.confession.findMany({
      where: { isApproved: true },
      orderBy,
      take: 50,
      select: { id: true, text: true, upvotes: true, createdAt: true },
    });

    res.json(confessions);
  } catch (err) {
    next(err);
  }
});

// POST /api/confessions - Submit confession
router.post('/', submitLimiter, async (req, res, next) => {
  try {
    const schema = z.object({
      text: z.string().min(10).max(280),
    });
    const { text } = schema.parse(req.body);

    const confession = await prisma.confession.create({
      data: { text },
      select: { id: true, text: true, upvotes: true, createdAt: true },
    });

    res.status(201).json(confession);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid confession text', code: 'VALIDATION_ERROR', details: err.errors });
    }
    next(err);
  }
});

// POST /api/confessions/:id/upvote
router.post('/:id/upvote', async (req, res, next) => {
  try {
    const confession = await prisma.confession.update({
      where: { id: req.params.id },
      data: { upvotes: { increment: 1 } },
      select: { id: true, upvotes: true },
    });
    res.json(confession);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Confession not found', code: 'NOT_FOUND' });
    }
    next(err);
  }
});

module.exports = router;