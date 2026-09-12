/**
 * Update all companies in the Supabase PostgreSQL database with high-clarity, accurate domains
 * and generate the exhaustive companyDomains.js for frontend logo resolution.
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const KNOWN_OVERRIDES = {
  'lehman-brothers': 'lehmanbrothers.com',
  'lehman': 'lehmanbrothers.com',
  'worldcom': 'worldcom.com',
  'enron': 'enron.com',
  'wework': 'wework.com',
  'nokia': 'nokia.com',
  'byjus': 'byjus.com',
  'byjus-think-and-learn-pvt-ltd': 'byjus.com',
  'kodak': 'kodak.com',
  'wirecard': 'wirecard.com',
  'katerra': 'katerra.com',
  'ftx': 'ftx.com',
  'quibi': 'quibi.com',
  'theranos': 'theranos.com',
  'blackberry': 'blackberry.com',
  'jawbone': 'jawbone.com',
  'bird': 'bird.co',
  'bird-global': 'bird.co',
  'better-place': 'betterplace.com',
  'solyndra': 'solyndra.com',
  'blockbuster': 'blockbuster.com',
  'fast': 'fast.co',
  'fast--fast-co': 'fast.co',
  'juicero': 'juicero.com',
  'pebble': 'getpebble.com',
  'zume-pizza': 'zume.com',
  'zume': 'zume.com',
  'scalefactor': 'scalefactor.com',
  'vine': 'vine.co',
  'pets-com': 'pets.com',
  'webvan': 'webvan.com',
  'napster': 'napster.com',
  'clubhouse': 'clubhouse.com',
  'toys-r-us': 'toysrus.com',
  'musical-ly': 'musical.ly',
  'justin-tv': 'justin.tv',
  'netscape': 'netscape.com',
  'fab-com': 'fab.com',
  'fab': 'fab.com',
  'yo-app': 'justyo.co',
  'color-labs': 'color.com',
  'color-labs--color': 'color.com',
  'tink-labs': 'tinklabs.com',
  'meerkat': 'meerkatapp.co',
  'secret': 'secret.ly',
  'houseparty': 'houseparty.com',
  'glitch': 'glitch.com',
  'formspring': 'formspring.me',
  'digg': 'digg.com',
  'moviepass': 'moviepass.com',
  'essential-products': 'essential.com',
  'convoy': 'convoy.com',
  'airware': 'airware.com',
  'plastc': 'plastc.com',
  'jibo': 'jibo.com',
  'doppler-labs': 'dopplerlabs.com',
  'vessel': 'vessel.com',
  'powa-technologies': 'powatechnologies.com',
  'fyre-media--fyre-festival': 'fyrefestival.com',
  'everpix': 'everpix.com',
  'sunrise-calendar': 'sunrise.am',
  'aereo': 'aereo.com',
  'homepolish': 'homepolish.com',
  'loot-crate': 'lootcrate.com',
  'brandless': 'brandless.com',
  'homejoy': 'homejoy.com',
  'shyp': 'shyp.com',
  'sprig': 'sprig.com',
  'spoonrocket': 'spoonrocket.com',
  'munchery': 'munchery.com',
  'sidecar': 'sidecar.com',
  'yik-yak': 'yikyak.com',
  'rdio': 'rdio.com',
  'circa': 'circa.com',
  'beepi': 'beepi.com',
  'anker': 'anker.com',
  'nikola-corporation': 'nikolamotor.com',
  'northvolt': 'northvolt.com',
  'three-arrows-capital-3ac': 'threearrowscapital.com',
  'onecoin': 'onecoin.eu',
  'argo-ai': 'argo.ai',
  'africrypt': 'africrypt.com',
  'magic-leap': 'magicleap.com',
  'oneweb': 'oneweb.net',
  'sunedison': 'sunedison.com',
  'faraday-future': 'ff.com',
  'kabbage-fintech': 'kabbage.com',
  'bitconnect': 'bitconnect.co',
  'ofo': 'ofo.com',
  'cazoo': 'cazoo.co.uk',
  'reef-technology': 'reeftechnology.com',
  'iron-finance-titan-token': 'iron.finance',
  'plustoken': 'plustoken.com',
  'wm-motor': 'wm-motor.com'
};

function deriveDomain(name, slug, currentWebsite) {
  const cleanSlug = (slug || '').toLowerCase().trim();
  if (KNOWN_OVERRIDES[cleanSlug]) return KNOWN_OVERRIDES[cleanSlug];

  if (currentWebsite && currentWebsite.startsWith('http') && !currentWebsite.includes('wikipedia.org') && !currentWebsite.includes('crunchbase.com')) {
    try {
      const h = new URL(currentWebsite).hostname.replace(/^www\./, '');
      if (h && h.includes('.')) return h;
    } catch {}
  }

  const cleanName = (name || '').toLowerCase().trim();
  if (KNOWN_OVERRIDES[cleanName]) return KNOWN_OVERRIDES[cleanName];

  // If name has (fast.co) or (xyz.com)
  const pMatch = name.match(/\(([^)]+)\)/);
  if (pMatch) {
    const inside = pMatch[1].trim().toLowerCase();
    if (inside.includes('.')) {
      return inside.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    }
  }

  let cleaned = name
    .replace(/\([^)]+\)/g, '')
    .replace(/[,.']/g, '')
    .replace(/\b(inc|llc|ltd|pvt|corp|corporation|technologies|technology|group|co|holdings|company)\b/gi, '')
    .trim()
    .toLowerCase();

  const slugStripped = cleanSlug
    .replace(/-(inc|llc|ltd|pvt|corp|corporation|technologies|technology|group|co|holdings|company)$/g, '')
    .replace(/-(fintech|media|global|capital|token|crypto|app|solutions)$/g, '');

  if (KNOWN_OVERRIDES[slugStripped]) return KNOWN_OVERRIDES[slugStripped];

  if (cleaned.includes('.')) {
    const m = cleaned.match(/[a-z0-9-]+\.[a-z]{2,}/);
    if (m) return m[0];
  }

  const alpha = cleaned.replace(/[^a-z0-9]/g, '');
  if (alpha) return `${alpha}.com`;

  const fallback = cleanSlug.replace(/[^a-z0-9]/g, '');
  return `${fallback || 'startup'}.com`;
}

async function main() {
  console.log('Querying all companies from database...');
  const companies = await prisma.company.findMany();
  console.log(`Retrieved ${companies.length} companies.`);

  const domainDictionary = {};
  const updatesToRun = [];

  for (const c of companies) {
    const domain = deriveDomain(c.name, c.slug, c.website);
    const newWebsite = `https://${domain}`;

    domainDictionary[c.slug] = domain;
    domainDictionary[c.name.toLowerCase().trim()] = domain;
    const stripped = c.slug.replace(/[^a-z0-9]/g, '');
    if (stripped) domainDictionary[stripped] = domain;

    if (!c.website || c.website.includes('wikipedia.org') || c.website.includes('crunchbase.com') || c.website !== newWebsite) {
      updatesToRun.push({ id: c.id, website: newWebsite });
    }
  }

  console.log(`Need to update ${updatesToRun.length} companies in DB. Running in concurrent batches...`);

  const BATCH_SIZE = 20;
  for (let i = 0; i < updatesToRun.length; i += BATCH_SIZE) {
    const batch = updatesToRun.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(item => prisma.company.update({
        where: { id: item.id },
        data: { website: item.website }
      }))
    );
    process.stdout.write(`Updated ${Math.min(i + BATCH_SIZE, updatesToRun.length)} / ${updatesToRun.length}...\r`);
  }

  console.log(`\nSuccessfully updated all ${updatesToRun.length} companies in database!`);

  // Write companyDomains.js
  const frontendDomainsPath = path.join(__dirname, '../../frontend/src/lib/data/companyDomains.js');
  const fileContent = `// Complete domain dictionary for all ${companies.length}+ startup failure entities
export const COMPANY_DOMAINS = ${JSON.stringify(domainDictionary, null, 2)};

export function resolveCompanyDomain(name = '', slug = '') {
  const cleanSlug = String(slug || '').toLowerCase().trim();
  const cleanName = String(name || '').toLowerCase().trim();
  const stripped = cleanSlug.replace(/[^a-z0-9]/g, '') || cleanName.replace(/[^a-z0-9]/g, '');
  
  if (cleanSlug && COMPANY_DOMAINS[cleanSlug]) return COMPANY_DOMAINS[cleanSlug];
  if (cleanName && COMPANY_DOMAINS[cleanName]) return COMPANY_DOMAINS[cleanName];
  if (stripped && COMPANY_DOMAINS[stripped]) return COMPANY_DOMAINS[stripped];
  
  if (cleanSlug.includes('.')) return cleanSlug;
  if (cleanName.includes('.')) return cleanName;
  
  return stripped ? \`\${stripped}.com\` : null;
}
`;

  fs.writeFileSync(frontendDomainsPath, fileContent, 'utf-8');
  console.log(`Successfully generated exhaustive domain dictionary at ${frontendDomainsPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error running script:', err);
    process.exit(1);
  });
