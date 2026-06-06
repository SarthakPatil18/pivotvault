const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/graph/edges - Knowledge graph data for D3
router.get('/edges', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 100, 200);

    const edges = await prisma.graphEdge.findMany({
      take: limit,
      orderBy: { edgeWeight: 'desc' },
      include: {
        sourceStartup: { select: { id: true, name: true, slug: true, industry: true, status: true } },
        targetStartup: { select: { id: true, name: true, slug: true, industry: true, status: true } },
      },
    });

    const nodeMap = new Map();
    const links = [];

    edges.forEach(edge => {
      // Source node (startup)
      if (!nodeMap.has(edge.sourceStartup.id)) {
        nodeMap.set(edge.sourceStartup.id, {
          id: edge.sourceStartup.id,
          name: edge.sourceStartup.name,
          slug: edge.sourceStartup.slug,
          type: 'startup',
          industry: edge.sourceStartup.industry,
          status: edge.sourceStartup.status,
        });
      }

      // Mistake node
      const mistakeId = `mistake:${edge.mistakeCategory}`;
      if (!nodeMap.has(mistakeId)) {
        nodeMap.set(mistakeId, {
          id: mistakeId,
          name: edge.mistakeCategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          type: 'mistake',
          category: edge.mistakeCategory,
        });
      }

      // Link: startup -> mistake
      links.push({ source: edge.sourceStartup.id, target: mistakeId, weight: parseFloat(edge.edgeWeight) });

      // Target node (outcome)
      if (edge.targetStartup) {
        if (!nodeMap.has(edge.targetStartup.id)) {
          nodeMap.set(edge.targetStartup.id, {
            id: edge.targetStartup.id,
            name: edge.targetStartup.name,
            slug: edge.targetStartup.slug,
            type: 'startup',
            industry: edge.targetStartup.industry,
            status: edge.targetStartup.status,
          });
        }
        links.push({ source: mistakeId, target: edge.targetStartup.id, weight: parseFloat(edge.edgeWeight) });
      }

      // Outcome node if no target
      const outcomeId = `outcome:${edge.outcome}`;
      if (!nodeMap.has(outcomeId)) {
        nodeMap.set(outcomeId, {
          id: outcomeId,
          name: edge.outcome.charAt(0).toUpperCase() + edge.outcome.slice(1),
          type: 'outcome',
        });
      }
      if (!edge.targetStartup) {
        links.push({ source: mistakeId, target: outcomeId, weight: parseFloat(edge.edgeWeight) });
      }
    });

    res.json({
      nodes: Array.from(nodeMap.values()),
      links,
      total: edges.length,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;