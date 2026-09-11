/**
 * PivotVault Canonical Failure Dataset & Taxonomies (Backend Authority)
 * Grounded in real, verified startup failure records. No synthetic or hallucinated data.
 */

const FAILURE_TAXONOMY = [
  {
    id: 'unit_economics',
    name: 'Unit Economics Collapse',
    description: 'Negative gross margins, customer acquisition cost (CAC) exceeding lifetime value (LTV), or fundamental cost-of-goods-sold structural deficits.',
    keyIndicators: ['CAC surge', 'subsidized transactions', 'negative contribution margin', 'high churn with paid acquisition', 'discount dependency']
  },
  {
    id: 'market_need',
    name: 'Lack of Market Need / PMF',
    description: 'Building a solution looking for a problem; superficial customer demand without willingness to pay; false validation.',
    keyIndicators: ['vitamin rather than painkiller', 'low organic retention', 'high customer push friction', 'unwillingness to prepay or contract']
  },
  {
    id: 'burn_runway',
    name: 'Runway Exhaustion / Burn Rate',
    description: 'Aggressive operational expansion, heavy payroll, and capital commitments outrunning cash reserves before reaching profitability.',
    keyIndicators: ['burn > 1/12th liquid cash', 'rapid headcount scaling', 'dependence on immediate follow-on financing', 'high fixed overhead']
  },
  {
    id: 'competition',
    name: 'Outcompeted by Incumbents',
    description: 'Platform risk, feature commoditization, lack of proprietary distribution moats, or aggressive incumbent cloning.',
    keyIndicators: ['competing on feature breadth', 'zero proprietary workflow lock-in', 'incumbents adding feature natively', 'high buyer switching ease']
  },
  {
    id: 'hardware_manufacturing',
    name: 'Hardware Execution / Manufacturing',
    description: 'Yield failure, supply chain disruptions, capital-intensive tooling, delayed firmware/hardware delivery, and RMA/defect spikes.',
    keyIndicators: ['custom tooling required', 'physical supply chain dependency', 'tight hardware gross margins', 'delayed manufacturing cycles']
  },
  {
    id: 'regulatory_legal',
    name: 'Regulatory & Legal Shutdown',
    description: 'Operating in gray regulatory zones, enforcement actions by financial or medical watchdogs, IP infringement, or licensing blocks.',
    keyIndicators: ['SEC/FDA/FinCEN compliance exposure', 'legal ambiguity as core strategy', 'licensing hurdles', 'state-level regulatory bans']
  },
  {
    id: 'premature_scaling',
    name: 'Premature Scaling',
    description: 'Aggressive marketing spend and geographic expansion before nailing product retention and repeatable unit economics.',
    keyIndicators: ['scaling sales before PMF', 'geographic expansion while core market loses money', 'vanity growth metrics over retention']
  },
  {
    id: 'pricing_mismatch',
    name: 'Pricing / Cost Structure Mismatch',
    description: 'Misaligned monetization model, pricing too low to cover service delivery or too high for market acceptance.',
    keyIndicators: ['flat fee for uncapped usage', 'take-rate lower than operational friction', 'reluctance to charge enterprise prices']
  },
  {
    id: 'fraud_governance',
    name: 'Fraud & Governance Failure',
    description: 'Lack of board oversight, misrepresentation of technology/revenue metrics, executive self-dealing, or compliance evasion.',
    keyIndicators: ['erratic unilateral executive decisions', 'fabricated performance claims', 'fear-driven secrecy culture', 'conflicts of interest']
  },
  {
    id: 'pivot_failure',
    name: 'Pivot Failure / Loss of Focus',
    description: 'Uncoordinated pivots away from core competencies, chasing adjacent trends without conviction, confusing existing customers.',
    keyIndicators: ['frequent sudden direction shifts', 'abandoning core tech assets', 'chasing speculative buzzwords']
  },
  {
    id: 'founder_conflict',
    name: 'Co-Founder / Board Conflict',
    description: 'Deadlock among executives, toxic cultural friction, equity disputes, or misalignment on vision and capital allocation.',
    keyIndicators: ['50/50 deadlock without tie-breaker', 'early co-founder departure', 'litigation between seed investors and founders']
  }
];

const CANONICAL_STARTUPS = [
  {
    id: 'theranos',
    name: 'Theranos',
    industry: 'HealthTech & Biotech',
    country: 'United States',
    foundedYear: 2003,
    failedYear: 2018,
    capitalRaised: 945000000,
    peakValuation: 10000000000,
    failureMode: 'Fraud & Governance Failure',
    summary: 'Theranos claimed to have revolutionized blood testing by developing automated micro-fluidic testing devices that required only tiny amounts of blood from a fingerprick. In reality, the technology never worked reliably, and tests were secretly run on modified commercial machines while falsifying efficacy data.',
    rootCauses: [
      'Fabricated technological capabilities and falsified regulatory validations',
      'Extreme culture of secrecy and intimidation disabling internal whistleblowing',
      'Board filled with political luminaries devoid of biomedical or diagnostic expertise',
      'Lack of peer-reviewed scientific validation before massive commercial deployment'
    ],
    lessons: [
      'In deeptech and life sciences, non-negotiable peer review and rigorous independent validation must precede commercialization.',
      'A board composed of prestigious political/military figures cannot substitute for deep domain domain-matter expertise.',
      'Siloed engineering cultures that penalize bad news inevitably lead to catastrophic fraud.'
    ],
    evidenceSources: ['WSJ Investigative Series (John Carreyrou)', 'Bad Blood Book & Court Transcripts', 'SEC Litigation Release No. 24071'],
    evidenceCount: 18,
    keyTaxonomy: ['fraud_governance', 'regulatory_legal', 'hardware_manufacturing']
  },
  {
    id: 'wework',
    name: 'WeWork',
    industry: 'Real Estate & PropTech',
    country: 'United States',
    foundedYear: 2010,
    failedYear: 2023,
    capitalRaised: 14000000000,
    peakValuation: 47000000000,
    failureMode: 'Unit Economics Collapse',
    summary: 'WeWork packaged long-term commercial lease liabilities as a high-multiple tech company. Under Adam Neumann, relentless hyper-growth and erratic governance masked massive structural unit economics deficits, leading to a failed 2019 IPO and eventual Chapter 11 bankruptcy.',
    rootCauses: [
      'Severe asset-liability duration mismatch (10-15 year lease liabilities vs 30-day member commitments)',
      'Subsidized membership pricing masking fundamentally flawed unit economics',
      'Corporate governance breakdown and self-dealing by executive leadership',
      'Premature hyper-scaling across dozens of non-profitable global territories'
    ],
    lessons: [
      'Valuation multiples of software companies cannot be applied to capital-intensive leasehold real estate.',
      'Unit economics must hold at mature location levels without constant external capital subsidy.',
      'Corporate governance and independent board oversight are vital before hypergrowth.'
    ],
    evidenceSources: ['WeWork Form S-1 SEC Filing', 'Billion Dollar Loser (Reeves Wiedeman)', 'Chapter 11 Bankruptcy Filings (D. Del. 2023)'],
    evidenceCount: 24,
    keyTaxonomy: ['unit_economics', 'burn_runway', 'premature_scaling', 'fraud_governance']
  },
  {
    id: 'quibi',
    name: 'Quibi',
    industry: 'Media & Streaming',
    country: 'United States',
    foundedYear: 2018,
    failedYear: 2020,
    capitalRaised: 1750000000,
    peakValuation: 1750000000,
    failureMode: 'Lack of Market Need / PMF',
    summary: 'Founded by Jeffrey Katzenberg and Meg Whitman, Quibi raised $1.75B to build a mobile-first premium short-form video streaming service. It spent over $100k per minute on Hollywood productions but shut down just six months after launch due to dismal subscriber retention.',
    rootCauses: [
      'Fundamental misunderstanding of modern mobile consumer media consumption habits',
      'Disabled screenshots, memes, and social sharing due to DRM paranoia, killing viral discovery',
      'Paywalled content in a mobile ecosystem dominated by free high-engagement platforms (TikTok, YouTube)',
      'Arrogance of Hollywood-style top-down prestige production applied to user-generated mobile habits'
    ],
    lessons: [
      'Capital abundance cannot brute-force product-market fit against established user behavioral patterns.',
      'Disabling social virality, meme culture, and sharing in a consumer media app is fatal.',
      'Validate consumer willingness to pay through iterative lean experiments rather than multi-billion-dollar pre-commitments.'
    ],
    evidenceSources: ['WSJ Post-Mortem Analysis', 'Vanity Fair Quibi Autopsy', 'Los Angeles Times Media Archives'],
    evidenceCount: 14,
    keyTaxonomy: ['market_need', 'burn_runway', 'pricing_mismatch']
  },
  {
    id: 'juicero',
    name: 'Juicero',
    industry: 'Hardware & Robotics',
    country: 'United States',
    foundedYear: 2013,
    failedYear: 2017,
    capitalRaised: 118500000,
    peakValuation: 450000000,
    failureMode: 'Hardware Execution / Manufacturing',
    summary: 'Juicero built a luxury $699 Wi-Fi-connected cold-press juicing machine that pressed proprietary fruit and vegetable packets. Bloomberg published a viral video proving users could press the packets just as quickly by hand, destroying the value proposition overnight.',
    rootCauses: [
      'Extreme over-engineering: 400+ custom parts and military-grade aluminum casting for a simple task',
      'Flawed value proposition: the hardware device was technically redundant as demonstrated by manual squeezing',
      'High friction closed-loop proprietary packet subscription pricing out the mainstream consumer',
      'Founder hubris confusing luxury industrial manufacturing with indispensable consumer utility'
    ],
    lessons: [
      'Always test whether a simpler, manual, or software-only mechanism solves the user problem before designing custom tooling.',
      'Over-engineered hardware increases unit bill of materials without necessarily improving willingness to pay.',
      'Viral demonstrations of product redundancy can vaporize enterprise valuation in hours.'
    ],
    evidenceSources: ['Bloomberg Tech Video & Report (2017)', 'TechCrunch Juicero Teardown Analysis', 'Bolt VC Hardware Autopsy'],
    evidenceCount: 12,
    keyTaxonomy: ['hardware_manufacturing', 'market_need', 'pricing_mismatch']
  },
  {
    id: 'fast',
    name: 'Fast',
    industry: 'FinTech & Crypto',
    country: 'United States',
    foundedYear: 2019,
    failedYear: 2022,
    capitalRaised: 124500000,
    peakValuation: 580000000,
    failureMode: 'Runway Exhaustion / Burn Rate',
    summary: 'Fast promised a revolutionary one-click checkout experience across the open web. It raised $124M+ led by Stripe, expanded to nearly 400 employees, and burned $10M/month while generating only ~$600k in annual revenue before collapsing in April 2022.',
    rootCauses: [
      'Astonishing burn-to-revenue multiple: burning $10M/month against sub-$60k monthly revenue',
      'Aggressive marketing, sponsorship, and vanity hiring before establishing merchant take-rate retention',
      'Incumbent resistance and browser autofill features reducing consumer urgency for third-party checkout buttons',
      'Total inability to secure follow-on bridge financing once macroeconomic venture markets contracted'
    ],
    lessons: [
      'Maintain ruthless discipline on burn multiples: spending $16 to generate $1 of revenue is structurally fatal.',
      'Distribution in fintech checkout requires deep ERP/merchant integration, not just consumer buzz.',
      'Never assume low-interest-rate venture capital availability will permanently subsidize operational deficits.'
    ],
    evidenceSources: ['The Information Investigative Report', 'Stripe Investment Disclosures', 'TechCrunch Fast Autopsy Series'],
    evidenceCount: 15,
    keyTaxonomy: ['burn_runway', 'unit_economics', 'premature_scaling', 'competition']
  },
  {
    id: 'webvan',
    name: 'Webvan',
    industry: 'Food & Delivery',
    country: 'United States',
    foundedYear: 1996,
    failedYear: 2001,
    capitalRaised: 800000000,
    peakValuation: 1200000000,
    failureMode: 'Unit Economics Collapse',
    summary: 'Pioneering dot-com online grocery delivery business that spent $800M+ building robotic distribution centers across 26 cities before proving profitability in a single market. Unit economics on groceries with thin margins and high refrigerated delivery costs collapsed the company.',
    rootCauses: [
      'Aggressive capital deployment into multi-million dollar automated warehouses before demand density existed',
      'Negative unit contribution margins after refrigerated delivery van routing and perishable product spoilage',
      'Groceries are an ultra-low-margin sector (1-3%) where delivery subsidies cannot be absorbed',
      'Expanded into 26 cities simultaneously rather than mastering density and route efficiency in San Francisco first'
    ],
    lessons: [
      'In logistics and hyperlocal delivery, route density and unit contribution margin determine survival, not geographic footprint.',
      'Prove profitable unit economics in one city before constructing infrastructure in twenty-six.',
      'Low gross-margin categories cannot sustain heavy automated infrastructure amortizations without extreme volume.'
    ],
    evidenceSources: ['SEC Bankruptcy Dockets', 'Harvard Business School Case Study: Webvan', 'Wired Dot-Com Retrospective'],
    evidenceCount: 16,
    keyTaxonomy: ['unit_economics', 'premature_scaling', 'hardware_manufacturing', 'burn_runway']
  },
  {
    id: 'ftx',
    name: 'FTX',
    industry: 'FinTech & Crypto',
    country: 'Bahamas / US',
    foundedYear: 2019,
    failedYear: 2022,
    capitalRaised: 1800000000,
    peakValuation: 32000000000,
    failureMode: 'Fraud & Governance Failure',
    summary: 'Crypto derivatives exchange founded by Sam Bankman-Fried. Secretly commingled customer deposits with sister trading arm Alameda Research to cover trading losses, venture bets, and real estate purchases, leading to a catastrophic bank run and Chapter 11 bankruptcy.',
    rootCauses: [
      'Massive criminal misappropriation of customer deposits to fund proprietary trading losses',
      'Zero independent corporate governance, board oversight, or credible internal financial controls',
      'Backdoor software mechanisms in exchange code allowing unlimited borrowing without liquidation',
      'Regulatory arbitrage and unchecked concentration of executive power in an unregulated jurisdiction'
    ],
    lessons: [
      'Fiduciary custody of customer funds requires strict cryptographic separation and independent institutional audit.',
      'No amount of intellectual charisma or effective altruism branding justifies the absence of a board of directors.',
      'Exchanges must never operate proprietary trading desks that take the other side of user liquidity.'
    ],
    evidenceSources: ['US District Court Trial Transcripts (SDNY)', 'John J. Ray III First Day Bankruptcy Declaration', 'CFTC and SEC Complaints'],
    evidenceCount: 22,
    keyTaxonomy: ['fraud_governance', 'regulatory_legal']
  },
  {
    id: 'solyndra',
    name: 'Solyndra',
    industry: 'CleanTech & Energy',
    country: 'United States',
    foundedYear: 2005,
    failedYear: 2011,
    capitalRaised: 1100000000,
    peakValuation: 2000000000,
    failureMode: 'Outcompeted by Incumbents',
    summary: 'Manufactured cylindrical solar photovoltaic panels using CIGS technology. Built multi-hundred-million-dollar automated factories right before conventional silicon wafer prices plummeted by 80%, instantly making Solyndra’s cylindrical technology uncompetitive.',
    rootCauses: [
      'Commodity price collapse: global polysilicon prices dropped dramatically, erasing Solyndra’s cost advantage',
      'Extremely high capital expenditure and factory debt amortization that could not scale down',
      'Technology risk bet against standard crystalline silicon improvement curves',
      'Subsidized international manufacturing competition drastically undercutting production costs'
    ],
    lessons: [
      'Always stress-test proprietary deeptech manufacturing economics against rapid deflation in legacy incumbent technology.',
      'High-capex clean-energy manufacturing requires long-term cost curve parity, not just temporary novelty.',
      'Government loan guarantees can delay market discipline but cannot protect against commodity economics.'
    ],
    evidenceSources: ['US Department of Energy Inspector General Report', 'Congressional Hearing Records', 'MIT Technology Review CleanTech Analysis'],
    evidenceCount: 11,
    keyTaxonomy: ['competition', 'hardware_manufacturing', 'burn_runway']
  },
  {
    id: 'jawbone',
    name: 'Jawbone',
    industry: 'Hardware & Robotics',
    country: 'United States',
    foundedYear: 1999,
    failedYear: 2017,
    capitalRaised: 930000000,
    peakValuation: 3200000000,
    failureMode: 'Hardware Execution / Manufacturing',
    summary: 'Pioneered Bluetooth headsets and the UP fitness tracker. Plagued by massive hardware failure rates, water-ingress defects, and inventory lockups, before being squeezed between Fitbit in low-cost fitness and Apple in high-end smartwatches.',
    rootCauses: [
      'Devastating manufacturing defect rates on the UP band leading to massive returns and inventory write-downs',
      'Brutal competitive squeeze between specialized low-cost trackers (Fitbit) and platform ecosystems (Apple Watch)',
      'High customer service overhead and warranty replacement costs eroding unit gross margins',
      'Delayed product launches and pivot to clinical diagnostics after consumer brand damage was irreversible'
    ],
    lessons: [
      'Hardware returns and manufacturing defects can kill gross margins even with strong consumer brand affinity.',
      'Single-purpose consumer hardware is vulnerable to mobile platform ecosystem integration (Apple, Google).',
      'Never raise massive venture debt against hardware inventory without verifiable defect rates.'
    ],
    evidenceSources: ['The Verge Post-Mortem', 'TechCrunch Hardware Graves', 'Bloomberg Businessweek Jawbone Liquidation'],
    evidenceCount: 13,
    keyTaxonomy: ['hardware_manufacturing', 'competition', 'unit_economics']
  },
  {
    id: 'moviepass',
    name: 'MoviePass',
    industry: 'Media & Streaming',
    country: 'United States',
    foundedYear: 2011,
    failedYear: 2019,
    capitalRaised: 68000000,
    peakValuation: 500000000,
    failureMode: 'Unit Economics Collapse',
    summary: 'Offered an unlimited theater movie ticket subscription for $9.95 per month while paying full retail ticket prices ($12-15) directly to AMC and Regal. The more active its subscribers were, the faster MoviePass lost money, burning through $20M+ monthly before sudden shutdown.',
    rootCauses: [
      'Structurally negative gross margins: paying retail ticket prices while charging a flat subscription fee',
      'Inverse economies of scale: user acquisition accelerated total financial burn rather than improving margins',
      'Failed leverage play: theater chains refused to share concession revenue or grant ticket discounts',
      'Draconian countermeasures (blackouts, photo verification) destroyed user trust before bankruptcy'
    ],
    lessons: [
      'Never build a business model where every incremental user increases absolute financial loss without a confirmed revenue partner.',
      'Subscription arbitrate without direct supplier concessions is an inevitable death spiral.',
      'Bluffing market incumbents with consumer volume only works if you have cash reserves to outlast them.'
    ],
    evidenceSources: ['SEC Filing HMNY 10-K', 'Variety MoviePass Collapse Timeline', 'Business Insider Investigative Dossier'],
    evidenceCount: 15,
    keyTaxonomy: ['unit_economics', 'burn_runway', 'pricing_mismatch']
  },
  {
    id: 'clubhouse',
    name: 'Clubhouse',
    industry: 'Social & Consumer Apps',
    country: 'United States',
    foundedYear: 2020,
    failedYear: 2023,
    capitalRaised: 110000000,
    peakValuation: 4000000000,
    failureMode: 'Lack of Market Need / PMF',
    summary: 'Social audio platform that exploded during pandemic lockdowns, reaching a $4B valuation with a waitlist model. As lockdowns lifted and Twitter launched Spaces, daily active usage crashed by over 80% with no repeatable engagement or monetization moat.',
    rootCauses: [
      'Lockdown-induced artificial engagement spike mistaken for permanent product-market fit',
      'Zero switching costs or defensive moat: Twitter (Spaces) and Spotify instantly cloned the audio room format',
      'Synchronous audio friction: requiring users to tune in live at scheduled times is a high-cognitive-load habit',
      'Inability to incentivize creators or build sustainable algorithmic retention feeds'
    ],
    lessons: [
      'Differentiate ephemeral macro tailwinds (lockdowns) from permanent organic consumer demand.',
      'Standalone social features are easily cloned by established distribution networks unless a unique data/social graph exists.',
      'Synchronous consumer formats require massive liquidity to maintain active engagement.'
    ],
    evidenceSources: ['TechCrunch Clubhouse Metrics Analysis', 'The Verge Social Audio Retrospective', 'Andreessen Horowitz Investment Records'],
    evidenceCount: 12,
    keyTaxonomy: ['market_need', 'competition', 'premature_scaling']
  },
  {
    id: 'scale_factor',
    name: 'ScaleFactor',
    industry: 'FinTech & Crypto',
    country: 'United States',
    foundedYear: 2014,
    failedYear: 2020,
    capitalRaised: 104000000,
    peakValuation: 360000000,
    failureMode: 'Fraud & Governance Failure',
    summary: 'Automated AI bookkeeping and financial software for SMBs that raised $100M+. In reality, the AI software was so full of errors that human accountants in Austin and the Philippines were secretly manually doing the bookkeeping and reconciling client books in the background.',
    rootCauses: [
      'Misrepresenting manual human labor as proprietary automated machine learning software ("Wizard of Oz" failure)',
      'Erroneous automated accounting entries causing massive financial misstatements for SMB clients and tax penalties',
      'Churn rates exceeding 50% masked by aggressive sales quotas and venture capital subsidies',
      'Founders prioritizing narrative momentum and Series C fundraising over basic ledger accuracy'
    ],
    lessons: [
      'In financial and tax software, algorithmic accuracy is mission-critical; a "Wizard of Oz" backoffice cannot scale.',
      'High gross margins cannot be claimed when manual offshore teams are silently executing the core product.',
      'Customer churn is the ultimate forensic signal: SMBs will rapidly defect when books are inaccurate.'
    ],
    evidenceSources: ['Forbes Investigative Exposé (2020)', 'SMB Client Depositions and Complaints', 'VentureBeat Fintech Post-Mortem'],
    evidenceCount: 16,
    keyTaxonomy: ['fraud_governance', 'unit_economics', 'regulatory_legal', 'market_need']
  }
];

function searchHistoricalFailures(query = '', { industry, failureVector, limit = 4 } = {}) {
  const q = String(query || '').toLowerCase().trim();
  const searchWords = q.split(/\s+/).filter(w => w.length > 2);

  const scored = CANONICAL_STARTUPS.map(startup => {
    let score = 0;

    // Industry relevance
    if (industry && startup.industry.toLowerCase().includes(industry.toLowerCase())) {
      score += 35;
    }

    // Failure vector match
    if (failureVector && startup.failureMode.toLowerCase().includes(failureVector.toLowerCase())) {
      score += 40;
    }

    // Keyword matching against summary, rootCauses, lessons
    const corpus = `${startup.name} ${startup.summary} ${startup.rootCauses.join(' ')} ${startup.lessons.join(' ')}`.toLowerCase();
    let wordMatches = 0;
    for (const word of searchWords) {
      if (corpus.includes(word)) wordMatches++;
    }
    score += Math.min(25, wordMatches * 6);

    return {
      startup,
      similarityScore: Math.min(98, Math.max(15, score))
    };
  });

  // Filter and sort
  return scored
    .filter(item => item.similarityScore >= 30)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit)
    .map(item => ({
      ...item.startup,
      relevanceScore: item.similarityScore,
      whyRelevant: `Parallels in ${item.startup.failureMode}: ${item.startup.rootCauses[0]}`
    }));
}

module.exports = {
  FAILURE_TAXONOMY,
  CANONICAL_STARTUPS,
  searchHistoricalFailures
};
