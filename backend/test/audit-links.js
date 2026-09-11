const axios = require('axios');
const cheerio = require('cheerio');

async function audit() {
  const headers = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' };

  // 1. startupgraveyard.io
  try {
    const res = await axios.get('https://startupgraveyard.io', { headers, timeout: 10000 });
    const $ = cheerio.load(res.data);
    const ioLinks = new Set();
    $('a').each((i, el) => {
      const h = $(el).attr('href');
      if (h && h.startsWith('https://startupgraveyard.io/') && !h.includes('/wp-') && h !== 'https://startupgraveyard.io/') {
        ioLinks.add(h);
      }
    });
    console.log('startupgraveyard.io total links:', ioLinks.size);
    console.log('Links:', Array.from(ioLinks));
  } catch (e) {
    console.log('io err:', e.message);
  }

  // 2. thestartupgraveyard.com
  try {
    const res = await axios.get('https://www.thestartupgraveyard.com/archive', { headers, timeout: 10000 });
    const $ = cheerio.load(res.data);
    const tsgLinks = new Set();
    $('a[href*="/p/"]').each((i, el) => {
      tsgLinks.add($(el).attr('href'));
    });
    console.log('thestartupgraveyard.com archive posts:', tsgLinks.size);
    console.log('TSG posts:', Array.from(tsgLinks));
  } catch (e) {
    console.log('tsg err:', e.message);
  }

  // 3. startupgraveyard.co
  try {
    const res = await axios.get('https://www.startupgraveyard.co', { headers, timeout: 10000 });
    const $ = cheerio.load(res.data);
    const coLinks = new Set();
    $('a[href*="/startups/"]').each((i, el) => {
      coLinks.add($(el).attr('href'));
    });
    console.log('startupgraveyard.co startups links on page:', coLinks.size);
    console.log('CO links:', Array.from(coLinks).slice(0, 10));
  } catch (e) {
    console.log('co err:', e.message);
  }

  // 4. failory.com
  try {
    const res = await axios.get('https://www.failory.com/cemetery', { headers, timeout: 10000 });
    const $ = cheerio.load(res.data);
    const failoryLinks = new Set();
    $('a[href^="/cemetery/"]').each((i, el) => {
      const h = $(el).attr('href');
      if (h && h !== '/cemetery' && h !== '/cemetery/') failoryLinks.add(h);
    });
    console.log('failory.com total cemetery entries:', failoryLinks.size);
  } catch (e) {
    console.log('failory err:', e.message);
  }
}

audit();
