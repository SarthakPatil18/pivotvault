/**
 * PivotVault seedFromJson.js
 * High-performance bulk ingestion of all 433 startup failure autopsies from backend/seed.json
 * into Supabase PostgreSQL via Prisma.
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const logger = require('../src/lib/logger');

const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
const prisma = new PrismaClient({
  datasources: {
    db: { url: dbUrl }
  }
});

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseFunding(str) {
  if (!str || typeof str !== 'string') return null;
  if (/undisclosed|bootstrapped|none|unknown|n\/a|self-funded/i.test(str) && !/[$€£\d]/.test(str)) {
    return null;
  }
  const match = str.match(/[$€£]?\s*([\d,.]+)\s*([BMKbmk])\b/i);
  if (match) {
    const num = parseFloat(match[1].replace(/,/g, ''));
    const unit = match[2].toUpperCase();
    if (unit === 'B') return num * 1_000_000_000;
    if (unit === 'M') return num * 1_000_000;
    if (unit === 'K') return num * 1_000;
  }
  const match2 = str.match(/[$€£]\s*([\d,.]+)/i);
  if (match2) {
    return parseFloat(match2[1].replace(/,/g, ''));
  }
  return null;
}

function categorizeFailure(categoryStr, reasonText) {
  const combined = `${categoryStr || ''} ${reasonText || ''}`.toLowerCase();
  if (/fraud|scam|legal|regulatory|sanction|dea|doj|sec|compliance|license|permit|indictment|embezzlement|lawsuit/i.test(combined)) {
    return 'LEGAL';
  }
  if (/funding|capital|cash|unit economic|burn|debt|valuation|ipo|spac|cost|margin|insolvency|liquidity|credit/i.test(combined)) {
    return 'FINANCIAL';
  }
  if (/competition|competitive|displacement|incumbent|monopoly|cloned|crowded/i.test(combined)) {
    return 'COMPETITION';
  }
  if (/product|tech|hardware|engineering|feasibility|exploit|bug|reliability|design|overengineering/i.test(combined)) {
    return 'PRODUCT';
  }
  if (/team|founder|governance|leadership|board|culture|mismanagement|conflict|co-founder/i.test(combined)) {
    return 'TEAM';
  }
  return 'MARKET';
}

function formatList(val) {
  if (Array.isArray(val)) return val.join(', ');
  if (typeof val === 'string') return val;
  return '';
}

function formatBullets(val) {
  if (Array.isArray(val)) return val.map(m => `- ${m}`).join('\n');
  if (typeof val === 'string' && val.trim()) return `- ${val.trim()}`;
  return '';
}

function buildPostmortemSummary(item) {
  const parts = [];
  const foundersStr = formatList(item.founders);
  parts.push(
    `${item.name} was a ${item.industry || 'technology'} startup founded in ${item.yearFounded || 'an unknown year'}` +
    (item.city || item.country ? ` in ${[item.city, item.country].filter(Boolean).join(', ')}` : '') +
    (foundersStr ? ` by ${foundersStr}` : '') + '.'
  );

  if (item.businessModel) {
    parts.push(`Business Model: ${item.businessModel}.`);
  }
  if (item.targetCustomers) {
    parts.push(`Target Audience: ${item.targetCustomers}.`);
  }
  const investorsStr = formatList(item.investors);
  if (item.funding) {
    parts.push(`Total Capital Raised: ${item.funding}` + (investorsStr ? ` (backed by ${investorsStr})` : '') + '.');
  }
  if (item.productDescription) {
    parts.push(`Product Concept: ${item.productDescription}`);
  }
  if (item.failureCategory) {
    parts.push(`Primary Cause of Demise: ${item.failureCategory}.`);
  }
  if (item.timeline) {
    parts.push(`Key Chronology: ${item.timeline}`);
  }
  if (item.finalStatus) {
    parts.push(`Outcome: ${item.finalStatus}.`);
  }
  if (item.lessonsLearned) {
    parts.push(`Key Takeaway: ${item.lessonsLearned}`);
  }

  return parts.join(' ');
}

function buildEvidenceDossierMarkdown(item) {
  const investorsStr = formatList(item.investors);
  const milestonesBullets = formatBullets(item.milestones);
  const failureReasonsBullets = formatBullets(item.failureReasons);
  const mistakesBullets = formatBullets(item.keyMistakes);
  const competitorsStr = formatList(item.competitors);

  const lines = [
    `# Forensic Autopsy: ${item.name}`,
    '',
    `**Industry:** ${item.industry || 'N/A'} | **Location:** ${[item.city, item.country].filter(Boolean).join(', ') || 'N/A'}`,
    `**Lifespan:** ${item.yearFounded || '?'} – ${item.yearClosed || '?'} | **Capital Raised:** ${item.funding || 'Undisclosed'}`,
    `**Peak Employees:** ${item.employees || 'N/A'} | **Confidence Score:** ${item.confidenceScore || 90}%`,
    '',
    '## 1. Product & Business Model',
    item.productDescription ? `> ${item.productDescription}` : 'No initial product description available.',
    '',
    `- **Business Model:** ${item.businessModel || 'N/A'}`,
    `- **Target Customers:** ${item.targetCustomers || 'N/A'}`,
    `- **Core Technology:** ${item.technology || 'N/A'}`,
    investorsStr ? `- **Key Investors:** ${investorsStr}` : '',
    '',
    '## 2. Chronology & Milestones',
    item.timeline ? `**Timeline:** ${item.timeline}\n` : '',
    milestonesBullets ? `**Key Milestones:**\n${milestonesBullets}\n` : '',
    '## 3. Root Causes & Failure Analysis',
    `**Failure Category:** ${item.failureCategory || 'Uncategorized'}`,
    '',
    failureReasonsBullets || '- Undocumented failure reason.',
    '',
    '## 4. Key Mistakes & Tactical Errors',
    mistakesBullets || '- Tactical errors not specifically cataloged.',
    '',
    '## 5. Critical Lessons Learned',
    item.lessonsLearned ? `> ${item.lessonsLearned}` : 'No documented lessons learned.',
    '',
    '## 6. Competitive Landscape & Final Status',
    competitorsStr ? `- **Competitors:** ${competitorsStr}` : '',
    `- **Acquisition / Liquidation Details:** ${item.acquisitionDetails || 'None'}`,
    `- **Final Status:** ${item.finalStatus || 'Dissolved'}`,
    '',
    '## 7. Forensic Verification & Sources',
    `- **Verification Notes:** ${item.verificationNotes || 'Verified through public postmortems, investigative reports, and regulatory filings.'}`,
    item.sources?.wikipedia ? `- Wikipedia: ${item.sources.wikipedia}` : '',
    item.sources?.techcrunch ? `- TechCrunch: ${item.sources.techcrunch}` : '',
    item.sources?.crunchbase ? `- Crunchbase: ${item.sources.crunchbase}` : ''
  ];

  return lines.filter(Boolean).join('\n');
}

async function seedFromJson() {
  const seedPath = path.join(__dirname, '../seed.json');
  if (!fs.existsSync(seedPath)) {
    throw new Error(`seed.json not found at ${seedPath}`);
  }

  const rawData = fs.readFileSync(seedPath, 'utf8');
  const seedItems = JSON.parse(rawData);
  logger.info(`Loaded ${seedItems.length} startup records from ${seedPath}`);

  // 1. Fetch all existing companies
  logger.info('Fetching existing companies from database...');
  const existingCompanies = await prisma.company.findMany({
    select: { id: true, slug: true, name: true, failureReasons: true, keyLessons: true, totalFunding: true, foundedYear: true, failureYear: true, industry: true, description: true, postmortemSummary: true, founders: true }
  });

  const bySlug = new Map(existingCompanies.map(c => [c.slug.toLowerCase(), c]));
  const byName = new Map(existingCompanies.map(c => [c.name.toLowerCase().trim(), c]));
  logger.info(`Current companies in DB: ${existingCompanies.length}`);

  // 2. Separate into new vs existing
  const newCompaniesData = [];
  const existingToUpdate = [];

  for (const item of seedItems) {
    const slug = slugify(item.name);
    const nameKey = item.name.toLowerCase().trim();
    const existing = bySlug.get(slug) || byName.get(nameKey);

    const totalFunding = parseFunding(item.funding);
    const founders = Array.isArray(item.founders) ? item.founders : (item.founders ? [item.founders] : []);
    const failureReasons = Array.isArray(item.failureReasons) ? item.failureReasons : (item.failureReasons ? [item.failureReasons] : []);
    
    const keyLessons = [];
    if (item.lessonsLearned && typeof item.lessonsLearned === 'string') {
      keyLessons.push(item.lessonsLearned);
    } else if (Array.isArray(item.lessonsLearned)) {
      keyLessons.push(...item.lessonsLearned);
    }
    if (Array.isArray(item.keyMistakes)) {
      item.keyMistakes.forEach(m => {
        if (!keyLessons.includes(m)) keyLessons.push(`Mistake to avoid: ${m}`);
      });
    }

    const description = item.productDescription || `${item.name} forensic failure autopsy.`;
    const postmortemSummary = buildPostmortemSummary(item);
    const stage = totalFunding && totalFunding >= 1_000_000_000 ? 'Late Stage / Unicorn'
      : totalFunding && totalFunding >= 50_000_000 ? 'Growth / Series B+'
      : totalFunding && totalFunding > 0 ? 'Early Stage'
      : 'Bootstrapped / Seed';

    if (!existing) {
      newCompaniesData.push({
        name: item.name,
        slug,
        description,
        foundedYear: item.yearFounded || null,
        failureYear: item.yearClosed || null,
        industry: item.industry || 'Technology',
        stage,
        totalFunding,
        founders,
        failureReasons,
        keyLessons,
        postmortemSummary,
        enriched: false,
        _seedItem: item
      });
    } else {
      existingToUpdate.push({
        existing,
        item,
        totalFunding,
        founders,
        failureReasons,
        keyLessons,
        description,
        postmortemSummary
      });
    }
  }

  logger.info(`Identified ${newCompaniesData.length} new companies to insert and ${existingToUpdate.length} companies to enrich.`);

  // 3. Bulk insert new companies
  let newlyCreatedCount = 0;
  if (newCompaniesData.length > 0) {
    logger.info(`Bulk inserting ${newCompaniesData.length} new companies...`);
    const insertPayload = newCompaniesData.map(c => {
      const { _seedItem, ...rest } = c;
      return rest;
    });

    // Insert in chunks of 50 to avoid packet size limits
    const CHUNK_SIZE = 50;
    for (let i = 0; i < insertPayload.length; i += CHUNK_SIZE) {
      const chunk = insertPayload.slice(i, i + CHUNK_SIZE);
      const res = await prisma.company.createMany({
        data: chunk,
        skipDuplicates: true
      });
      newlyCreatedCount += res.count;
      logger.info(`  Inserted ${newlyCreatedCount}/${insertPayload.length} new companies...`);
    }
  }

  // 4. Update existing companies in parallel batches
  logger.info(`Updating ${existingToUpdate.length} existing companies with enriched data...`);
  let updatedCount = 0;
  const UPDATE_BATCH = 10;
  for (let i = 0; i < existingToUpdate.length; i += UPDATE_BATCH) {
    const chunk = existingToUpdate.slice(i, i + UPDATE_BATCH);
    await Promise.all(
      chunk.map(async ({ existing, item, totalFunding, founders, failureReasons, keyLessons, description, postmortemSummary }) => {
        const mergedReasons = Array.from(new Set([...(existing.failureReasons || []), ...failureReasons]));
        const mergedLessons = Array.from(new Set([...(existing.keyLessons || []), ...keyLessons]));

        await prisma.company.update({
          where: { id: existing.id },
          data: {
            description: existing.description && existing.description.length > 150 ? existing.description : description,
            foundedYear: existing.foundedYear || item.yearFounded || null,
            failureYear: existing.failureYear || item.yearClosed || null,
            totalFunding: existing.totalFunding || totalFunding,
            founders: (existing.founders && existing.founders.length) ? existing.founders : founders,
            failureReasons: mergedReasons,
            keyLessons: mergedLessons,
            postmortemSummary: existing.postmortemSummary && existing.postmortemSummary.length > 200 ? existing.postmortemSummary : postmortemSummary,
            industry: existing.industry && !existing.industry.includes('Technology / Startup') ? existing.industry : (item.industry || existing.industry)
          }
        });
        updatedCount++;
      })
    );
  }
  logger.info(`Successfully updated ${updatedCount} existing companies.`);

  // 5. Re-fetch all companies from DB to have IDs for ALL 433 seed items
  logger.info('Refreshing company index for evidence and claims association...');
  const allDbCompanies = await prisma.company.findMany({
    select: { id: true, slug: true, name: true }
  });
  const dbBySlug = new Map(allDbCompanies.map(c => [c.slug.toLowerCase(), c]));
  const dbByName = new Map(allDbCompanies.map(c => [c.name.toLowerCase().trim(), c]));

  // 6. Bulk prepare Evidence & Claims
  logger.info('Preparing Evidence and Claims records for all 433 startups...');
  const evidenceToInsert = [];
  const itemCompanyMap = [];

  for (const item of seedItems) {
    const slug = slugify(item.name);
    const nameKey = item.name.toLowerCase().trim();
    const company = dbBySlug.get(slug) || dbByName.get(nameKey);

    if (!company) continue;

    const sourceUrl = (item.sources?.wikipedia && item.sources.wikipedia.startsWith('http')) ? item.sources.wikipedia
      : (item.sources?.techcrunch && item.sources.techcrunch.startsWith('http')) ? item.sources.techcrunch
      : (item.sources?.crunchbase && item.sources.crunchbase.startsWith('http')) ? item.sources.crunchbase
      : `https://pivotvault.ai/autopsies/${company.slug}`;

    const sourceName = (item.sources?.techcrunch && item.sources.techcrunch.startsWith('http')) ? 'TechCrunch'
      : (item.sources?.wikipedia && item.sources.wikipedia.startsWith('http')) ? 'Wikipedia'
      : (item.sources?.crunchbase && item.sources.crunchbase.startsWith('http')) ? 'Crunchbase'
      : 'PivotVault Forensic Vault';

    const metadataPayload = {
      name: item.name,
      country: item.country || 'USA',
      city: item.city || null,
      investors: item.investors || [],
      employees: item.employees || null,
      businessModel: item.businessModel || null,
      targetCustomers: item.targetCustomers || null,
      milestones: item.milestones || [],
      keyMistakes: item.keyMistakes || [],
      competitors: item.competitors || [],
      technology: item.technology || null,
      acquisitionDetails: item.acquisitionDetails || null,
      finalStatus: item.finalStatus || null,
      confidenceScore: item.confidenceScore || 90,
      verificationNotes: item.verificationNotes || null,
      sources: item.sources || {},
      rawFunding: item.funding || null,
      failureCategory: item.failureCategory || null,
      timeline: item.timeline || null
    };

    evidenceToInsert.push({
      companyId: company.id,
      contentType: 'POSTMORTEM',
      title: `${item.name}: Forensic Autopsy Dossier`,
      content: buildEvidenceDossierMarkdown(item),
      sourceUrl,
      sourceName,
      author: 'PivotVault Intelligence Team',
      metadata: metadataPayload
    });

    itemCompanyMap.push({ company, item, sourceUrl });
  }

  // Fetch existing evidence URLs to avoid duplicates
  logger.info('Fetching existing evidence to filter duplicates...');
  const existingEvidences = await prisma.evidence.findMany({
    select: { id: true, companyId: true, sourceUrl: true }
  });
  const existingEvSet = new Set(existingEvidences.map(e => `${e.companyId}_${e.sourceUrl}`));

  const newEvidences = evidenceToInsert.filter(e => !existingEvSet.has(`${e.companyId}_${e.sourceUrl}`));
  logger.info(`Found ${newEvidences.length} new Evidence records to insert (already existing: ${evidenceToInsert.length - newEvidences.length}).`);

  let insertedEvidenceCount = 0;
  if (newEvidences.length > 0) {
    const CHUNK_SIZE = 50;
    for (let i = 0; i < newEvidences.length; i += CHUNK_SIZE) {
      const chunk = newEvidences.slice(i, i + CHUNK_SIZE);
      const res = await prisma.evidence.createMany({
        data: chunk,
        skipDuplicates: true
      });
      insertedEvidenceCount += res.count;
      logger.info(`  Inserted ${insertedEvidenceCount}/${newEvidences.length} evidence records...`);
    }
  }

  // 7. Prepare Claims
  logger.info('Fetching evidence mapping for Claims association...');
  const allEvidences = await prisma.evidence.findMany({
    select: { id: true, companyId: true, sourceUrl: true }
  });
  const evByCompanyUrl = new Map(allEvidences.map(e => [`${e.companyId}_${e.sourceUrl}`, e.id]));

  logger.info('Fetching existing claims to filter duplicates...');
  const existingClaims = await prisma.claim.findMany({
    select: { id: true, companyId: true, claimText: true }
  });
  const existingClaimSet = new Set(existingClaims.map(c => `${c.companyId}_${c.claimText}`));

  const claimsToInsert = [];
  for (const { company, item, sourceUrl } of itemCompanyMap) {
    const evidenceId = evByCompanyUrl.get(`${company.id}_${sourceUrl}`) || null;

    const reasons = Array.isArray(item.failureReasons) ? item.failureReasons : (item.failureReasons ? [item.failureReasons] : []);
    const mistakes = Array.isArray(item.keyMistakes) ? item.keyMistakes : [];

    const claimEntries = [
      ...reasons.map(r => ({ text: r, type: 'reason' })),
      ...mistakes.map(m => ({ text: m, type: 'mistake' }))
    ];

    for (const cl of claimEntries) {
      if (!cl.text || cl.text.length < 5) continue;
      const key = `${company.id}_${cl.text}`;
      if (existingClaimSet.has(key)) continue;

      const category = categorizeFailure(item.failureCategory, cl.text);
      const confidence = Math.min(1.0, Math.max(0.7, (item.confidenceScore ? item.confidenceScore / 100 : 0.95)));

      claimsToInsert.push({
        companyId: company.id,
        evidenceId,
        claimText: cl.text,
        category,
        verificationStatus: 'VERIFIED',
        confidenceScore: confidence,
        sources: {
          verificationNotes: item.verificationNotes,
          sourceUrls: [sourceUrl],
          failureCategory: item.failureCategory
        },
        verifiedAt: new Date()
      });
      existingClaimSet.add(key);
    }
  }

  logger.info(`Found ${claimsToInsert.length} new Claims to insert...`);
  let insertedClaimCount = 0;
  if (claimsToInsert.length > 0) {
    const CHUNK_SIZE = 100;
    for (let i = 0; i < claimsToInsert.length; i += CHUNK_SIZE) {
      const chunk = claimsToInsert.slice(i, i + CHUNK_SIZE);
      const res = await prisma.claim.createMany({
        data: chunk,
        skipDuplicates: true
      });
      insertedClaimCount += res.count;
      logger.info(`  Inserted ${insertedClaimCount}/${claimsToInsert.length} claims...`);
    }
  }

  // 8. Summary
  const finalCompanyCount = await prisma.company.count();
  const finalEvidenceCount = await prisma.evidence.count();
  const finalClaimCount = await prisma.claim.count();

  logger.info('========================================================');
  logger.info('   PivotVault seed.json Ingestion Completed Successfully ');
  logger.info('========================================================');
  logger.info(`- Total Companies in DB: ${finalCompanyCount} (+${newlyCreatedCount} created, ${updatedCount} enriched)`);
  logger.info(`- Total Evidence Records in DB: ${finalEvidenceCount} (+${insertedEvidenceCount} created)`);
  logger.info(`- Total Claims in DB: ${finalClaimCount} (+${insertedClaimCount} created)`);
  logger.info('========================================================');

  return {
    finalCompanyCount,
    finalEvidenceCount,
    finalClaimCount,
    newlyCreatedCount,
    updatedCount,
    insertedEvidenceCount,
    insertedClaimCount
  };
}

if (require.main === module) {
  seedFromJson()
    .then(() => {
      logger.info('Database seed from seed.json complete!');
      process.exit(0);
    })
    .catch((err) => {
      logger.error('Database seed failed:', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { seedFromJson };
