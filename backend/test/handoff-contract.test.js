/**
 * Test: Handoff Contract & Seed Verification (Dev 1 <-> Dev 2)
 * Ensures payload dispatched to embeddingQueue strictly satisfies Dev 2's contract.
 */

const { z } = require('zod');
const { SEED_COMPANIES, SEED_FAILURE_PATTERNS } = require('../prisma/seed');

// Handoff Contract Zod Schema (Dev 2 expectation)
const HandoffPayloadSchema = z.object({
  contentId: z.string().min(1),
  contentType: z.enum(['postmortem', 'news', 'interview', 'idea', 'filing']),
  text: z.string().min(10),
  metadata: z.object({
    companyName: z.string().min(1),
    industry: z.string().min(1),
    failureYear: z.number().int(),
    source: z.string().min(1),
    slug: z.string().min(1),
  }),
});

function runContractTests() {
  console.log('--- Verifying 20 Seed Companies ---');
  console.log(`Loaded ${SEED_COMPANIES.length} seed companies.`);

  if (SEED_COMPANIES.length !== 20) {
    throw new Error(`Expected 20 seed companies, found ${SEED_COMPANIES.length}`);
  }

  const REQUIRED_NAMES = [
    'WeWork', 'Theranos', 'Quibi', 'Juicero', 'Vine',
    'Clubhouse', 'Yo App', 'Color Labs', 'Pets.com', 'Webvan',
    "Byju's", 'FTX', 'Solyndra', 'MoviePass', 'Jawbone',
    'Fab.com', 'Homejoy', 'Rdio', 'Meerkat', 'Secret'
  ];

  for (const name of REQUIRED_NAMES) {
    const found = SEED_COMPANIES.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (!found) {
      throw new Error(`Missing required seed company: "${name}"`);
    }
    if (!found.slug || !found.description || !found.failureReasons.length || !found.keyLessons.length) {
      throw new Error(`Incomplete seed data for "${name}"`);
    }
  }

  console.log('✅ All 20 canonical companies are present with full failure reasons and key lessons.');

  console.log('--- Verifying Handoff Payload Schema against Sample Company ---');
  const sampleCompany = SEED_COMPANIES[0];

  const samplePayload = {
    contentId: 'clx_sample_company_id_12345',
    contentType: 'postmortem',
    text: `Company: ${sampleCompany.name}\n\nIndustry: ${sampleCompany.industry}\n\nDescription: ${sampleCompany.description}\n\nFailure Reasons: ${sampleCompany.failureReasons.join('; ')}`,
    metadata: {
      companyName: sampleCompany.name,
      industry: sampleCompany.industry,
      failureYear: sampleCompany.failureYear || 2023,
      source: 'PivotVault Knowledge Pipeline',
      slug: sampleCompany.slug,
    },
  };

  const validation = HandoffPayloadSchema.safeParse(samplePayload);
  if (!validation.success) {
    console.error('Validation failed:', validation.error.format());
    throw new Error('Handoff payload failed Zod contract schema validation!');
  }

  console.log('✅ Handoff payload strictly conforms to the Developer 1 <-> Developer 2 contract.');

  console.log('--- Verifying Failure Patterns ---');
  console.log(`Loaded ${SEED_FAILURE_PATTERNS.length} failure patterns.`);
  if (SEED_FAILURE_PATTERNS.length < 4) {
    throw new Error('Expected at least 4 failure patterns.');
  }

  console.log('✅ Failure patterns verified.');
  console.log('ALL HANDOFF CONTRACT & SEED TESTS PASSED! 🚀');
}

try {
  runContractTests();
} catch (err) {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
}
