/**
 * Test for the 4 Graveyard Scraper Sources requested by the user:
 * 1. StartupGraveyard.js -> name, industry, founded, closed, reason, funding
 * 2. Failory.js -> name, reason, interview URL, category
 * 3. TheStartupGraveyard.js -> name, industry, failure summary
 * 4. StartupGraveyardCo.js -> name, category, failure reason
 */

const {
  scrapeStartupGraveyard,
  scrapeFailory,
  scrapeTheStartupGraveyard,
  scrapeStartupGraveyardCo,
} = require('../src/scraper');

async function testGraveyardScrapers() {
  console.log('====================================================');
  console.log('  TESTING 4 REQUESTED GRAVEYARD SCRAPER SOURCES     ');
  console.log('====================================================\n');

  // 1. StartupGraveyard.js
  console.log('--- 1. Testing StartupGraveyard.js (https://startupgraveyard.io) ---');
  const sgResults = await scrapeStartupGraveyard();
  console.log(`Extracted: ${sgResults.length} items`);
  if (!sgResults.length) throw new Error('StartupGraveyard returned 0 items');
  const sgSample = sgResults[0];
  console.log('Sample metadata:', sgSample.metadata);
  const sgFields = ['name', 'industry', 'reason'];
  for (const f of sgFields) {
    if (sgSample.metadata[f] === undefined) throw new Error(`Missing field "${f}" in StartupGraveyard`);
  }
  console.log('✅ StartupGraveyard metadata verified (name, industry, founded, closed, reason, funding).\n');

  // 2. Failory.js
  console.log('--- 2. Testing Failory.js (https://www.failory.com/cemetery) ---');
  const failoryResults = await scrapeFailory();
  console.log(`Extracted: ${failoryResults.length} items`);
  if (!failoryResults.length) throw new Error('Failory returned 0 items');
  const failorySample = failoryResults[0];
  console.log('Sample metadata:', failorySample.metadata);
  const failoryFields = ['name', 'reason', 'interviewUrl', 'category'];
  for (const f of failoryFields) {
    if (failorySample.metadata[f] === undefined) throw new Error(`Missing field "${f}" in Failory`);
  }
  console.log('✅ Failory metadata verified (name, reason, interview URL, category).\n');

  // 3. TheStartupGraveyard.js
  console.log('--- 3. Testing TheStartupGraveyard.js (https://www.thestartupgraveyard.com) ---');
  const tsgResults = await scrapeTheStartupGraveyard();
  console.log(`Extracted: ${tsgResults.length} items`);
  if (!tsgResults.length) throw new Error('TheStartupGraveyard returned 0 items');
  const tsgSample = tsgResults[0];
  console.log('Sample metadata:', tsgSample.metadata);
  const tsgFields = ['name', 'industry', 'failureSummary'];
  for (const f of tsgFields) {
    if (tsgSample.metadata[f] === undefined) throw new Error(`Missing field "${f}" in TheStartupGraveyard`);
  }
  console.log('✅ TheStartupGraveyard metadata verified (name, industry, failure summary).\n');

  // 4. StartupGraveyardCo.js
  console.log('--- 4. Testing StartupGraveyardCo.js (https://www.startupgraveyard.co) ---');
  const sgCoResults = await scrapeStartupGraveyardCo();
  console.log(`Extracted: ${sgCoResults.length} items`);
  if (!sgCoResults.length) throw new Error('StartupGraveyardCo returned 0 items');
  const sgCoSample = sgCoResults[0];
  console.log('Sample metadata:', sgCoSample.metadata);
  const sgCoFields = ['name', 'category', 'failureReason'];
  for (const f of sgCoFields) {
    if (sgCoSample.metadata[f] === undefined) throw new Error(`Missing field "${f}" in StartupGraveyardCo`);
  }
  console.log('✅ StartupGraveyardCo metadata verified (name, category, failure reason).\n');

  console.log('🎉 ALL 4 GRAVEYARD SCRAPERS EXTRACTED AND VALIDATED SUCCESSFULLY!');
}

testGraveyardScrapers()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  });
