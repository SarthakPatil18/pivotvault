/**
 * Test script for scrapers
 */

const { runAllScrapers } = require('../src/scraper');

async function test() {
  console.log('--- Testing Web Scrapers ---');
  const results = await runAllScrapers();
  console.log(`Total items retrieved: ${results.length}`);

  if (results.length === 0) {
    console.error('FAIL: No items returned by scrapers!');
    process.exit(1);
  }

  // Validate uniform schema on sample item
  const sample = results[0];
  console.log('Sample item:', JSON.stringify(sample, null, 2));

  const requiredFields = ['source', 'title', 'url', 'content', 'contentType'];
  for (const field of requiredFields) {
    if (!sample[field]) {
      console.error(`FAIL: Missing required field "${field}" on scraped item!`);
      process.exit(1);
    }
  }

  console.log('SUCCESS: Scrapers validated successfully against uniform schema!');
}

test().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
