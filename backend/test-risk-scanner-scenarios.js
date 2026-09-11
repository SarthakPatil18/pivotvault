const http = require('http');

const scenarios = [
  {
    name: '1. AI Productivity SaaS for SMBs',
    payload: {
      ideaText: 'An AI copilot that summarizes sales calls and automatically drafts personalized CRM updates for small accounting firms and SMB sales teams.',
      industry: 'SaaS & Enterprise',
      targetCustomer: 'B2B SMBs & Accountants',
      businessModel: 'Monthly SaaS Subscription',
      burnRate: '$10k - $25k/mo',
      hardwareInvolved: false,
      regulatoryHeavy: false
    }
  },
  {
    name: '2. Consumer Hardware Startup',
    payload: {
      ideaText: 'A connected smart robotic coffee maker with proprietary single-serve nitrogen capsules and custom aluminum CNC hardware manufacturing.',
      industry: 'Consumer Tech',
      targetCustomer: 'High-end coffee enthusiasts B2C',
      businessModel: 'Hardware sales plus consumable recurring capsule subscription',
      burnRate: '$80k - $150k/mo',
      hardwareInvolved: true,
      regulatoryHeavy: false
    }
  },
  {
    name: '3. Healthcare & Biotech Platform',
    payload: {
      ideaText: 'At-home rapid micro-blood testing cartridge and diagnostic lab reader offering FDA-cleared lipid panels and hormone diagnostics with physician telehealth review.',
      industry: 'Healthcare & Biotech',
      targetCustomer: 'Patients with chronic hormonal conditions and clinical partners',
      businessModel: 'Per-test kit purchase plus lab processing fee',
      burnRate: '$100k+/mo',
      hardwareInvolved: true,
      regulatoryHeavy: true
    }
  },
  {
    name: '4. Food Delivery Marketplace',
    payload: {
      ideaText: 'Sub-10-minute hyper-local grocery delivery network with proprietary micro-fulfillment dark stores, fleet of e-bike couriers, and free delivery on orders over $15.',
      industry: 'E-commerce & Logistics',
      targetCustomer: 'Urban consumers needing immediate essentials',
      businessModel: 'Retail margin markup plus convenience fee',
      burnRate: '$150k+/mo',
      hardwareInvolved: false,
      regulatoryHeavy: false
    }
  },
  {
    name: '5. FinTech Protocol',
    payload: {
      ideaText: 'Cross-border non-custodial treasury management and merchant settlement rail utilizing algorithmic stablecoin liquidity pools with instant fiat on/off ramps.',
      industry: 'FinTech & Web3',
      targetCustomer: 'Global e-commerce exporters and freelancers',
      businessModel: '0.4% transaction fee on settlement volume',
      burnRate: '$40k - $80k/mo',
      hardwareInvolved: false,
      regulatoryHeavy: true
    }
  }
];

function runScan(scenario) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(scenario.payload);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5001,
        path: '/api/ai/risk-scan',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        },
        timeout: 45000
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            resolve(parsed);
          } catch (e) {
            reject(new Error(`JSON Parse error: ${e.message}\nRaw: ${body.slice(0, 300)}`));
          }
        });
      }
    );

    req.on('error', (err) => reject(err));
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('=== MULTI-SCENARIO RISK SCANNER VERIFICATION ===\n');
  const results = [];

  for (const s of scenarios) {
    console.log(`Testing: ${s.name}...`);
    const start = Date.now();
    try {
      const res = await runScan(s);
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      const d = res.data || res;
      console.log(`  -> Completed in ${elapsed}s`);
      console.log(`  -> Final Risk Score: ${d.finalRiskScore} (${d.riskLevel})`);
      console.log(`  -> Confidence: ${d.confidence}%`);
      console.log(`  -> Venture Risk Score: ${d.scoring?.ventureRiskScore}`);
      console.log(`  -> Historical Similarity Score: ${d.scoring?.historicalSimilarityScore}`);
      console.log(`  -> ML Benchmark: ${d.scoring?.mlBenchmark?.available ? d.scoring?.mlBenchmark?.benchmarkScore : 'Not Available (honest pre-launch flag)'}`);
      console.log(`  -> Primary Risk Driver: ${d.riskDrivers?.[0]?.dimension} (${d.riskDrivers?.[0]?.score})`);
      console.log(`  -> Top Failure Vector: ${d.failureVectors?.[0]?.name} (${d.failureVectors?.[0]?.associationScore}%)`);
      console.log(`  -> Matched Historical Startups: ${d.historicalMatches?.map(m => `${m.name} (${m.relevanceScore}%)`).join(', ') || 'None'}`);
      console.log(`  -> Top Unknown: ${d.unknowns?.[0] || 'None'}`);
      console.log('');
      results.push({ name: s.name, d });
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
    }
  }

  console.log('=== SUMMARY OF DIFFERENTIATION ===');
  results.forEach(r => {
    console.log(`${r.name}: Score=${r.d.finalRiskScore}, Risk=${r.d.riskLevel}, TopVector="${r.d.failureVectors?.[0]?.name}", TopMatch="${r.d.historicalMatches?.[0]?.name}"`);
  });
}

main().catch(console.error);
