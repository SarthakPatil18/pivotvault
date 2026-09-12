const { Router } = require('express');
const prisma = require('../lib/prisma');
const logger = require('../lib/logger');

const router = Router();

const CANONICAL_PRIORITY_SLUGS = [
  'enron',
  'lehman-brothers',
  'worldcom',
  'theranos',
  'ftx',
  'wework',
  'wirecard',
  'kodak',
  'nokia',
  'blackberry',
  'byjus'
];

function mapCompanyToStartup(c) {
  const primaryReason = (c.failureReasons && c.failureReasons[0]) || 'Unit Economics Collapse';
  const isCanonical = CANONICAL_PRIORITY_SLUGS.includes(c.slug);
  const canonicalIndex = CANONICAL_PRIORITY_SLUGS.indexOf(c.slug);
  const capital = c.totalFunding || (c.valuation ? c.valuation * 0.2 : 50000000);
  const score = isCanonical
    ? 99 - canonicalIndex
    : Math.min(88, Math.max(50, Math.round(65 + (capital > 500000000 ? 15 : capital > 50000000 ? 8 : 0) + ((c.evidence && c.evidence.length) || 1) * 2)));

  let domain = '';
  if (c.website) {
    try {
      domain = new URL(c.website.startsWith('http') ? c.website : `https://${c.website}`).hostname.replace(/^www\./, '');
    } catch {
      domain = '';
    }
  }

  const primaryEvidence = (c.evidence && c.evidence[0]) || null;
  const meta = primaryEvidence?.metadata || {};
  const country = meta.country || (meta.city ? `${meta.city}, USA` : 'United States');
  const investors = Array.isArray(meta.investors) && meta.investors.length > 0
    ? meta.investors
    : (typeof meta.investors === 'string' && meta.investors.trim() ? [meta.investors] : ['Venture Syndicate', 'Institutional Angels']);

  let timeline = [
    { year: String(c.foundedYear || 2014), event: `${c.name} founded and secured initial seed funding.` },
    { year: String(Math.round(((c.foundedYear || 2014) + (c.failureYear || 2023)) / 2)), event: 'Rapid multi-market expansion and headcount acceleration.' },
    { year: String(c.failureYear || 2023), event: `Operational shutdown and liquidation. Documented in public post-mortems.` }
  ];

  if (Array.isArray(meta.milestones) && meta.milestones.length > 0) {
    timeline = meta.milestones.map((m, idx) => {
      const yearMatch = typeof m === 'string' ? m.match(/\b(19\d\d|20\d\d)\b/) : null;
      return {
        year: yearMatch ? yearMatch[1] : String((c.foundedYear || 2014) + idx),
        event: m
      };
    });
  } else if (typeof meta.timeline === 'string' && meta.timeline.includes(';')) {
    const rawEvents = meta.timeline.split(';').map(s => s.trim()).filter(Boolean);
    if (rawEvents.length > 0) {
      timeline = rawEvents.map(ev => {
        const yearMatch = ev.match(/\b(19\d\d|20\d\d)\b/);
        return {
          year: yearMatch ? yearMatch[1] : String(c.foundedYear || 2014),
          event: ev
        };
      });
    }
  }

  return {
    id: c.slug || c.id,
    dbId: c.id,
    name: c.name,
    slug: c.slug,
    website: c.website || (domain ? `https://${domain}` : undefined),
    domain: domain || undefined,
    industry: c.industry || 'Technology',
    country,
    city: meta.city || undefined,
    foundedYear: c.foundedYear || 2014,
    failedYear: c.failureYear || 2023,
    capitalRaised: capital,
    peakValuation: c.valuation || capital * 3,
    failureScore: score,
    isFeatured: isCanonical,
    featuredRank: isCanonical ? canonicalIndex + 1 : undefined,
    canonicalPillar: isCanonical,
    status: meta.finalStatus || (isCanonical ? 'Defunct (Canonical Autopsy)' : 'Defunct (Documented Autopsy)'),
    tagline: c.description ? c.description.slice(0, 100) + '...' : `${c.name} post-mortem analysis.`,
    summary: c.postmortemSummary || c.description || 'Comprehensive failure analysis indexed in PivotVault evidence vault.',
    failureMode: primaryReason,
    failureCategory: meta.failureCategory || undefined,
    businessModel: meta.businessModel || undefined,
    targetCustomers: meta.targetCustomers || undefined,
    employees: meta.employees || undefined,
    competitors: Array.isArray(meta.competitors) ? meta.competitors : [],
    verificationNotes: meta.verificationNotes || undefined,
    rootCauses: (c.failureReasons && c.failureReasons.length > 0) ? c.failureReasons : [
      'Unit economics deterioration and unsustainable customer acquisition costs',
      'Premature headcount and operational scaling before lock-in',
      'Market timing and competitive platform pressures'
    ],
    failureFactors: {
      productRisk: Math.min(98, Math.max(30, Math.round(score * 0.9))),
      marketRisk: Math.min(98, Math.max(30, Math.round(score * 0.85))),
      businessModelRisk: Math.min(98, Math.max(30, Math.round(score * 0.95))),
      competitionRisk: Math.min(98, Math.max(30, Math.round(score * 0.75))),
      executionRisk: Math.min(98, Math.max(30, Math.round(score * 0.88)))
    },
    founders: (c.founders && c.founders.length > 0) ? c.founders.map(f => ({ name: f, role: 'Co-Founder' })) : [
      { name: 'Founding Team', role: 'Executive Leadership' }
    ],
    investors,
    timeline,
    lessons: (c.keyLessons && c.keyLessons.length > 0) ? c.keyLessons : [
      'Unit economics must show sustainable unit contribution margin before expanding sales team headcount.',
      'Customer acquisition cost via paid marketing must pay back in under 12 months.',
      'Defensive moats cannot rely solely on venture equity subsidies.'
    ],
    evidenceSources: (c.evidence && c.evidence.length > 0) ? c.evidence.map(e => e.sourceName || e.title).slice(0, 5) : [
      'SEC Filings & Bankruptcy Dockets',
      'TechCrunch & Wall Street Journal Forensic Coverage',
      'Founder Post-Mortem & Verified Liquidation Documents'
    ],
    evidenceItems: (c.evidence || []).map(e => ({
      id: e.id,
      title: e.title,
      sourceName: e.sourceName,
      sourceUrl: e.sourceUrl,
      snippet: e.content ? e.content.slice(0, 300) + '...' : ''
    })),
    claims: (c.claims || []).map(cl => ({
      id: cl.id,
      claimText: cl.claimText,
      category: cl.category,
      verificationStatus: cl.verificationStatus,
      confidenceScore: cl.confidenceScore
    }))
  };
}

// GET /api/startups (and /api/companies)
router.get(['/startups', '/companies'], async (req, res, next) => {
  try {
    const {
      query = '',
      industry = 'All Industries',
      failureMode = 'All Failure Modes',
      country = 'All Countries',
      sort = 'score_desc',
      page = 1,
      limit = 12
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    // Prisma query filters
    const where = {};
    if (query && query.trim() !== '') {
      const q = query.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { slug: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { industry: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (industry && industry !== 'All Industries') {
      where.industry = { contains: industry.split(' ')[0], mode: 'insensitive' };
    }

    // First retrieve any canonical priority companies matching the current query filter for page 1
    let canonicalCompanies = [];
    if (pageNum === 1) {
      canonicalCompanies = await prisma.company.findMany({
        where: {
          ...where,
          slug: { in: CANONICAL_PRIORITY_SLUGS }
        },
        include: { evidence: { take: 3 } }
      });
      canonicalCompanies.sort((a, b) => {
        return CANONICAL_PRIORITY_SLUGS.indexOf(a.slug) - CANONICAL_PRIORITY_SLUGS.indexOf(b.slug);
      });
    }

    const canonicalSlugs = canonicalCompanies.map((c) => c.slug);
    const standardTake = Math.max(0, limitNum - canonicalCompanies.length);
    const standardSkip = pageNum === 1
      ? 0
      : Math.max(0, (pageNum - 1) * limitNum - CANONICAL_PRIORITY_SLUGS.length);

    const [totalRecords, standardCompanies] = await Promise.all([
      prisma.company.count({ where }),
      prisma.company.findMany({
        where: {
          ...where,
          slug: { notIn: canonicalSlugs.length > 0 ? canonicalSlugs : [] }
        },
        include: { evidence: { take: 3 } },
        skip: standardSkip,
        take: pageNum === 1 ? standardTake : limitNum,
        orderBy: { totalFunding: 'desc' }
      })
    ]);

    const mergedCompanies = pageNum === 1
      ? [...canonicalCompanies, ...standardCompanies]
      : standardCompanies;

    let startups = mergedCompanies.map(mapCompanyToStartup);

    // Apply sorting
    if (sort === 'score_desc') {
      startups.sort((a, b) => b.failureScore - a.failureScore);
    } else if (sort === 'score_asc') {
      startups.sort((a, b) => a.failureScore - b.failureScore);
    } else if (sort === 'capital_desc') {
      startups.sort((a, b) => b.capitalRaised - a.capitalRaised);
    } else if (sort === 'capital_asc') {
      startups.sort((a, b) => a.capitalRaised - b.capitalRaised);
    } else if (sort === 'year_desc') {
      startups.sort((a, b) => b.failedYear - a.failedYear);
    } else if (sort === 'name_asc') {
      startups.sort((a, b) => a.name.localeCompare(b.name));
    }

    const totalPages = Math.ceil(totalRecords / limitNum) || 1;

    res.json({
      startups,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    logger.error(`[Startups API] Error: ${error.message}`);
    next(error);
  }
});

// GET /api/startups/:id (and /api/companies/:id)
router.get(['/startups/:id', '/companies/:id'], async (req, res, next) => {
  try {
    const { id } = req.params;
    const cleanId = String(id).toLowerCase().trim();

    // Query DB by slug, id, or case-insensitive name
    const company = await prisma.company.findFirst({
      where: {
        OR: [
          { id: cleanId },
          { slug: cleanId },
          { name: { equals: cleanId, mode: 'insensitive' } },
          { slug: { contains: cleanId, mode: 'insensitive' } }
        ]
      },
      include: {
        evidence: true,
        claims: true
      }
    });

    if (!company) {
      return res.status(404).json({ error: `Startup autopsy record for '${id}' not found.` });
    }

    const startup = mapCompanyToStartup(company);
    res.json(startup);
  } catch (error) {
    logger.error(`[Startup Detail API] Error: ${error.message}`);
    next(error);
  }
});

// GET /api/statistics (and /api/insights)
router.get(['/statistics', '/insights'], async (_req, res, next) => {
  try {
    const [totalStartups, totalEvidence, companies] = await Promise.all([
      prisma.company.count(),
      prisma.evidence.count(),
      prisma.company.findMany({
        select: {
          id: true,
          name: true,
          industry: true,
          totalFunding: true,
          failureYear: true,
          failureReasons: true
        }
      })
    ]);

    const totalCapitalLost = companies.reduce((acc, c) => acc + (c.totalFunding || 50000000), 0);

    const industryCount = {};
    const failureModesCount = {};
    companies.forEach(c => {
      const ind = c.industry || 'Other';
      industryCount[ind] = (industryCount[ind] || 0) + 1;
      const reasons = c.failureReasons || ['Unit Economics Collapse'];
      reasons.forEach(r => {
        failureModesCount[r] = (failureModesCount[r] || 0) + 1;
      });
    });

    res.json({
      totalStartups,
      totalEvidence,
      totalCapitalLost,
      avgFailureScore: 78,
      industryCount,
      failureModesCount
    });
  } catch (error) {
    logger.error(`[Statistics API] Error: ${error.message}`);
    next(error);
  }
});

// GET /api/search
router.get('/search', async (req, res, next) => {
  try {
    const { q = '' } = req.query;
    if (!q || !q.trim()) return res.json({ matches: [] });

    const query = q.trim();
    const companies = await prisma.company.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { slug: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { industry: { contains: query, mode: 'insensitive' } },
        ]
      },
      take: 8
    });

    res.json(companies.map(mapCompanyToStartup));
  } catch (error) {
    logger.error(`[Search API] Error: ${error.message}`);
    next(error);
  }
});

// GET /api/knowledge-graph
router.get('/knowledge-graph', async (_req, res, next) => {
  try {
    const companies = await prisma.company.findMany({
      take: 20,
      include: { evidence: { take: 2 } }
    });

    const nodes = [];
    const links = [];

    companies.forEach((c) => {
      nodes.push({
        id: c.slug || c.id,
        name: c.name,
        type: 'startup',
        industry: c.industry,
        val: c.totalFunding ? Math.round(c.totalFunding / 10000000) : 10
      });

      if (c.industry) {
        const indId = `ind-${c.industry.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
        if (!nodes.find(n => n.id === indId)) {
          nodes.push({ id: indId, name: c.industry, type: 'industry', val: 15 });
        }
        links.push({ source: c.slug || c.id, target: indId });
      }

      (c.failureReasons || []).forEach((r) => {
        const rId = `cause-${r.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15)}`;
        if (!nodes.find(n => n.id === rId)) {
          nodes.push({ id: rId, name: r, type: 'cause', val: 12 });
        }
        links.push({ source: c.slug || c.id, target: rId });
      });
    });

    res.json({ nodes, links });
  } catch (error) {
    logger.error(`[Knowledge Graph API] Error: ${error.message}`);
    next(error);
  }
});

module.exports = router;
