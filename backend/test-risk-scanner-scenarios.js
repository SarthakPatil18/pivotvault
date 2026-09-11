const http = require('http');

const scenarios = [
  {
    name: '1. AI To-Do List App (Contradictory Form Inputs: Has Hardware & HealthTech checked)',
    payload: {
      ideaText: 'A lightweight AI-powered daily to-do list and task scheduler for remote software developers and designers.',
      industry: 'HealthTech & Biotech', // Form accidental mismatch
      targetCustomer: 'B2B (SMBs & Mid-Market)',
      businessModel: 'SaaS Subscription (MRR)',
      burnRate: 'Lean Bootstrapped (<$10k/mo)',
      hardwareInvolved: true, // Form accidental mismatch
      regulatoryHeavy: true   // Form accidental mismatch
    }
  },
  {
    name: '2. Consumer Hardware Startup',
    payload: {
      ideaText: 'A connected smart robotic coffee maker with proprietary single-serve nitrogen capsules and custom aluminum CNC hardware manufacturing.',
      industry: 'Hardware & Robotics',
      targetCustomer: 'B2C (Mass Consumer)',
      businessModel: 'Hardware Device + Subscription',
      burnRate: 'Series A Expansion ($50k - $150k/mo)',
      hardwareInvolved: true,
      regulatoryHeavy: false
    }
  },
  {
    name: '3. Healthcare & Biotech Platform',
    payload: {
      ideaText: 'At-home rapid micro-blood testing cartridge and diagnostic lab reader offering FDA-cleared lipid panels and hormone diagnostics with physician telehealth review.',
      industry: 'HealthTech & Biotech',
      targetCustomer: 'B2B2C / Platform',
      businessModel: 'Usage / Transactional Take-rate',
      burnRate: 'Hyper-Growth ($500k+/mo)',
      hardwareInvolved: true,
      regulatoryHeavy: true
    }
  },
  {
    name: '4. Food Delivery Marketplace',
    payload: {
      ideaText: 'Sub-10-minute hyper-local grocery delivery network with micro-fulfillment dark stores, fleet of e-bike couriers, and free delivery on orders over $15.',
      industry: 'Food & Delivery',
      targetCustomer: 'B2C (Mass Consumer)',
      businessModel: 'Two-Sided Marketplace Commission',
      burnRate: 'Hyper-Growth ($500k+/mo)',
      hardwareInvolved: false,
      regulatoryHeavy: false
    }
  },
  {
    name: '5. FinTech Protocol',
    payload: {
      ideaText: 'Cross-border non-custodial treasury management and merchant settlement rail utilizing algorithmic stablecoin liquidity pools with instant fiat on/off ramps.',
      industry: 'FinTech & Crypto',
      targetCustomer: 'B2B Enterprise ($50k+ ACV)',
      businessModel: 'Usage / Transactional Take-rate',
      burnRate: 'Series A Expansion ($50k - $150k/mo)',
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
  console.log('=== HUMAN-CENTRIC VENTURE RISK SCANNER VERIFICATION ===\n');

  for (const s of scenarios) {
    console.log(`Testing: ${s.name}...`);
    const start = Date.now();
    try {
      const res = await runScan(s);
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      const d = res.data || res;

      console.log(`  -> Elapsed: ${elapsed}s`);
      console.log(`  -> Archetype Detected: "${d.ventureProfile?.ventureType}" (Industry: "${d.ventureProfile?.industry}")`);
      console.log(`  -> PivotVault Risk Score: ${d.finalRiskScore} (${d.riskLevel})`);
      console.log(`  -> Confidence: ${d.confidence}%`);
      console.log(`  -> What We Think: "${d.diagnosis?.whatWeThink?.slice(0, 120)}..."`);
      console.log(`  -> Why It Is Risky: "${d.diagnosis?.whyItIsRisky?.[0]}"`);
      console.log(`  -> What Looks Promising: "${d.diagnosis?.whatLooksPromising?.[0]}"`);
      console.log(`  -> Top 3 Relevant Risks:`);
      d.riskDrivers?.slice(0, 3).forEach(r => {
        console.log(`     * ${r.name} (${r.score}/100): ${r.reasoning?.slice(0, 90)}...`);
      });
      console.log(`  -> Top Failure Vector: ${d.failureVectors?.[0]?.name} (${d.failureVectors?.[0]?.associationScore}%) [Applicable: ${d.failureVectors?.[0]?.isApplicable}]`);
      console.log(`  -> Matched Historical Startups: ${d.historicalMatches?.map(m => `${m.name} (${m.relevanceScore}%)`).join(', ') || 'None'}`);
      console.log(`  -> Top Founder Question: "${d.unknowns?.[0] || 'None'}"`);
      console.log(`  -> First Action: "${d.recommendations?.[0] || 'None'}"`);
      console.log('');
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
    }
  }
}

main().catch(console.error);
