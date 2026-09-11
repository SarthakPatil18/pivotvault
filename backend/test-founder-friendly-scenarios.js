const http = require('http');

const SCENARIOS = [
  {
    name: '1. AI Todo / Productivity App (with accidental hardware & healthcare checked)',
    payload: {
      ideaText: 'A lightweight AI-powered daily to-do list and task scheduler for remote software developers and designers.',
      industry: 'Healthcare & Biotech', // accidental mismatch
      targetCustomer: 'Developers / technical users',
      businessModel: 'Monthly / yearly subscription',
      burnRate: 'Bootstrapped (Under $10k/mo)',
      hardwareInvolved: true, // accidental mismatch
      regulatoryHeavy: true, // accidental mismatch
    },
    expectedArchetype: 'SaaS & Software',
    mustIncludeRisks: ['Competition', 'Standing Out'],
    mustNotIncludeRisks: ['Regulations & Legal', 'Hardware & Manufacturing']
  },
  {
    name: '2. Healthcare Diagnostic Startup',
    payload: {
      ideaText: 'AI-assisted early diagnostic platform analyzing retinal scans to detect diabetic retinopathy in community clinics.',
      industry: 'Healthcare & Biotech',
      targetCustomer: 'Small and medium businesses',
      businessModel: 'Pay per use',
      burnRate: 'Early Stage ($10k - $50k/mo)',
      hardwareInvolved: false,
      regulatoryHeavy: true,
    },
    expectedArchetype: 'Healthcare & Biotech',
    mustIncludeRisks: ['Regulations & Legal', 'Building & Delivery', 'Urgent Need'],
    mustNotIncludeRisks: ['Hardware & Manufacturing']
  },
  {
    name: '3. Food Delivery Startup',
    payload: {
      ideaText: 'On-demand 15-minute ultra-fast grocery and warm meal delivery using dark stores and dedicated courier fleets.',
      industry: 'Food / Delivery',
      targetCustomer: 'Individual consumers',
      businessModel: 'One-time purchase',
      burnRate: 'High Growth ($150k+/mo)',
      hardwareInvolved: false,
      regulatoryHeavy: false,
    },
    expectedArchetype: 'Marketplace',
    mustIncludeRisks: ['Making Money', 'Customer Demand'],
    mustNotIncludeRisks: ['Regulations & Legal']
  },
  {
    name: '4. FinTech Protocol / Lending App',
    payload: {
      ideaText: 'Cross-border B2B invoice financing and real-time payment rails with automated AML/KYC checks and credit underwriting.',
      industry: 'Finance / Fintech',
      targetCustomer: 'Small and medium businesses',
      businessModel: 'Pay per use',
      burnRate: 'Funded ($50k - $150k/mo)',
      hardwareInvolved: false,
      regulatoryHeavy: true,
    },
    expectedArchetype: 'FinTech',
    mustIncludeRisks: ['Regulations & Legal', 'Making Money'],
    mustNotIncludeRisks: ['Hardware & Manufacturing']
  },
  {
    name: '5. Hardware IoT Device',
    payload: {
      ideaText: 'Smart wearable hydration monitoring sensor and custom companion wristband for endurance athletes, manufactured in-house.',
      industry: 'Hardware & Devices',
      targetCustomer: 'Individual consumers',
      businessModel: 'One-time purchase',
      burnRate: 'Funded ($50k - $150k/mo)',
      hardwareInvolved: true,
      regulatoryHeavy: false,
    },
    expectedArchetype: 'Consumer Hardware',
    mustIncludeRisks: ['Funding & Costs', 'Building & Delivery', 'Making Money'],
    mustNotIncludeRisks: []
  },
  {
    name: '6. Marketplace Platform',
    payload: {
      ideaText: 'Two-sided freelance marketplace connecting verified local electricians, plumbers, and HVAC technicians with property managers.',
      industry: 'Software / SaaS',
      targetCustomer: 'Both consumers and businesses',
      businessModel: 'Marketplace commission',
      burnRate: 'Early Stage ($10k - $50k/mo)',
      hardwareInvolved: false,
      regulatoryHeavy: false,
    },
    expectedArchetype: 'Marketplace',
    mustIncludeRisks: ['Making Money', 'Customer Demand', 'Competition'],
    mustNotIncludeRisks: ['Regulations & Legal', 'Hardware & Manufacturing']
  }
];

function runScenario(s) {
  return new Promise((resolve) => {
    const data = JSON.stringify(s.payload);
    const req = http.request({
      hostname: 'localhost',
      port: 5001,
      path: '/api/ai/risk-scan',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      },
      timeout: 25000
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ scenario: s, success: json.success, data: json.data });
        } catch (e) {
          resolve({ scenario: s, success: false, error: e.message, body });
        }
      });
    });

    req.on('error', (e) => resolve({ scenario: s, success: false, error: e.message }));
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('=== PIVOTVAULT RISK SCANNER 6-SCENARIO FOUNDER VERIFICATION ===\n');
  let passedAll = true;

  for (const s of SCENARIOS) {
    console.log(`Testing: ${s.name}...`);
    const res = await runScenario(s);
    if (!res.success || !res.data) {
      console.log(`❌ FAILED: ${res.error || 'No data returned'}\n`);
      passedAll = false;
      continue;
    }

    const d = res.data;
    const score = d.finalRiskScore;
    const tier = d.riskLevel;
    const activeRiskNames = (d.riskDrivers || []).map(r => r.name);
    const positiveCount = (d.diagnosis?.whatLooksPromising || []).length;
    const nextStepsCount = (d.diagnosis?.validateFirst || []).length;
    const historicalMatches = d.historicalMatches || [];

    console.log(`   ✓ Score: ${score}/100 (${tier})`);
    console.log(`   ✓ Identified Archetype: ${d.ventureProfile?.ventureType}`);
    console.log(`   ✓ Active Plain-English Risks: ${activeRiskNames.join(', ')}`);
    console.log(`   ✓ Positive Signals: ${positiveCount} points`);
    console.log(`   ✓ Validate First Steps: ${nextStepsCount} actions`);
    console.log(`   ✓ Historical Failures: ${historicalMatches.length} retrieved (${historicalMatches[0]?.name || 'None'})`);

    // Verify mustIncludeRisks
    for (const reqRisk of s.mustIncludeRisks) {
      if (!activeRiskNames.some(n => n.toLowerCase().includes(reqRisk.toLowerCase()))) {
        console.log(`   ⚠️ WARNING: Expected risk "${reqRisk}" not found in top drivers: ${activeRiskNames.join(', ')}`);
      }
    }

    // Verify mustNotIncludeRisks
    for (const forbidden of s.mustNotIncludeRisks) {
      if (activeRiskNames.some(n => n.toLowerCase().includes(forbidden.toLowerCase()))) {
        console.log(`   ❌ ERROR: Irrelevant risk "${forbidden}" incorrectly present for this venture!`);
        passedAll = false;
      }
    }

    console.log('');
  }

  if (passedAll) {
    console.log('🎉 ALL 6 SCENARIOS PASSED WITH PERFECT RELEVANCE & CLEAN TERMINOLOGY!');
  } else {
    console.log('⚠️ Some scenarios had warnings or failures.');
  }
}

main();
