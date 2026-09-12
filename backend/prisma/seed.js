/**
 * PivotVault Database Seed Script
 * Pre-seeds the 20 canonical startup failures with rich postmortem intelligence,
 * initial evidence records, verified atomic claims, and cross-company failure patterns.
 * 
 * Target Startups:
 * 1. WeWork, 2. Theranos, 3. Quibi, 4. Juicero, 5. Vine,
 * 6. Clubhouse, 7. Yo App, 8. Color Labs, 9. Pets.com, 10. Webvan,
 * 11. Byju's, 12. FTX, 13. Solyndra, 14. MoviePass, 15. Jawbone,
 * 16. Fab.com, 17. Homejoy, 18. Rdio, 19. Meerkat, 20. Secret
 */

const { PrismaClient } = require('@prisma/client');
const logger = require('../src/lib/logger');

const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
const prisma = new PrismaClient({
  datasources: {
    db: { url: dbUrl }
  }
});

const SEED_COMPANIES = [
  {
    name: 'Enron',
    slug: 'enron',
    description: 'Enron Corporation was an American energy, commodities, and services company that perpetrated one of the largest accounting frauds and corporate governance collapses in financial history.',
    foundedYear: 1985,
    failureYear: 2001,
    industry: 'Energy',
    stage: 'Public Enterprise',
    totalFunding: 63400000000,
    valuation: 70000000000,
    website: 'https://enron.com',
    founders: ['Kenneth Lay', 'Jeffrey Skilling'],
    failureReasons: [
      'Accounting fraud and financial manipulation',
      'Corporate Governance Failure',
      'Financial Mismanagement',
      'Excessive Leverage'
    ],
    keyLessons: [
      'Financial transparency is critical',
      'Strong corporate governance is essential',
      'Complex financial structures can conceal systemic risk',
      'Aggressive growth without risk controls can become destructive'
    ],
    postmortemSummary: 'Enron concealed losses and debt through complex accounting structures and off-balance-sheet entities, while weak governance and excessive risk-taking contributed to its collapse.',
    evidence: [
      {
        contentType: 'FILING',
        title: 'SEC Enforcement & DOJ Bankruptcy Docket: Enron Special Purpose Entities',
        sourceName: 'SEC Edgar',
        sourceUrl: 'https://www.sec.gov/news/press/2001-enron',
        content: 'Enron utilized Fastow-controlled Chewco, LJM, and Raptors special purpose entities to remove billions in toxic liabilities from financial statements while recording fictional mark-to-market earnings.',
        metadata: { country: 'United States', city: 'Houston' }
      }
    ],
    claims: [
      {
        claimText: 'Enron concealed over $60 billion in liabilities through off-balance-sheet entities while inflating market valuations through aggressive mark-to-market accounting.',
        category: 'FINANCIAL',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.99
      }
    ]
  },
  {
    name: 'Lehman Brothers',
    slug: 'lehman-brothers',
    description: 'Fourth-largest US investment bank whose September 2008 collapse triggered the climax of the global subprime financial crisis.',
    foundedYear: 1850,
    failureYear: 2008,
    industry: 'Financial Services',
    stage: 'Public Enterprise',
    totalFunding: 639000000000,
    valuation: 60000000000,
    website: 'https://lehman.com',
    founders: ['Henry Lehman', 'Emanuel Lehman', 'Mayer Lehman'],
    failureReasons: [
      'Excessive leverage and inadequate risk management',
      'Risk Management Failure',
      'Liquidity Crisis',
      'Real Estate Exposure'
    ],
    keyLessons: [
      'Leverage amplifies both returns and losses',
      'Liquidity risk can destroy otherwise large institutions',
      'Risk models can fail during systemic shocks',
      'Concentration in one market can become catastrophic'
    ],
    postmortemSummary: 'Lehman Brothers accumulated significant exposure to the US housing and mortgage markets while operating with extremely high leverage and relying heavily on short-term funding.',
    evidence: [
      {
        contentType: 'POSTMORTEM',
        title: 'Bankruptcy Examiner Anton Valukas Report: Lehman Insolvency',
        sourceName: 'US Bankruptcy Court',
        sourceUrl: 'https://jenner.com/lehman-examiner',
        content: 'Lehman operated at net leverage ratios exceeding 30:1, with over $600 billion in assets funded by volatile short-term repo markets and undisclosed Repo 105 balance-sheet maneuvers.',
        metadata: { country: 'United States', city: 'New York' }
      }
    ],
    claims: [
      {
        claimText: 'Lehman Brothers carried $639 billion in assets against $619 billion in debt when its overnight repo counter-parties pulled liquidity, precipitating bankruptcy.',
        category: 'FINANCIAL',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.99
      }
    ]
  },
  {
    name: 'WorldCom',
    slug: 'worldcom',
    description: 'American telecommunications titan that imploded after an internal audit revealed over $11 billion in fraudulent accounting entries to artificially inflate earnings.',
    foundedYear: 1983,
    failureYear: 2002,
    industry: 'Telecommunications',
    stage: 'Public Enterprise',
    totalFunding: 107000000000,
    valuation: 175000000000,
    website: 'https://worldcom.com',
    founders: ['Bernard Ebbers'],
    failureReasons: [
      'Accounting fraud and aggressive financial manipulation',
      'Financial Manipulation',
      'Corporate Governance Failure'
    ],
    keyLessons: [
      'Financial reporting must reflect economic reality',
      'Internal controls must be independent',
      'Pressure to meet financial targets can encourage manipulation',
      'Governance failures can allow fraud to persist'
    ],
    postmortemSummary: 'WorldCom improperly classified operating expenses as capital expenditures to inflate profits and present a stronger financial position than the company actually had.',
    evidence: [
      {
        contentType: 'FILING',
        title: 'SEC Litigation Release No. 17588: SEC v. WorldCom Inc.',
        sourceName: 'SEC Edgar',
        sourceUrl: 'https://sec.gov/litigation/litreleases/lr17588.htm',
        content: 'WorldCom fraudulently capitalized standard operating line costs as capital expenditures to fabricate profit and meet Wall Street earnings expectations.',
        metadata: { country: 'United States', city: 'Clinton' }
      }
    ],
    claims: [
      {
        claimText: 'WorldCom executives reclassified over $3.8 billion in ordinary line expenses into capital asset accounts to mask collapsing margins during the telecom crash.',
        category: 'LEGAL',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.99
      }
    ]
  },
  {
    name: 'Theranos',
    slug: 'theranos',
    description: 'Healthcare technology company claiming to revolutionize laboratory blood diagnostics using miniaturized fingerprick technology.',
    foundedYear: 2003,
    failureYear: 2018,
    industry: 'Healthcare Technology',
    stage: 'Unicorn / Growth',
    totalFunding: 1400000000,
    valuation: 9000000000,
    website: 'https://theranos.com',
    founders: ['Elizabeth Holmes', 'Ramesh Sunny Balwani'],
    failureReasons: [
      'Failure to deliver the claimed technology combined with misleading investors and stakeholders',
      'Technology Validation Failure',
      'Fraud',
      'Corporate Governance Failure',
      'Regulatory Failure'
    ],
    keyLessons: [
      'Technology claims must be independently validated',
      'Scientific evidence must precede aggressive commercialization',
      'Strong governance and technical oversight are essential',
      'Investor storytelling cannot replace product validation'
    ],
    postmortemSummary: "Theranos claimed its technology could perform extensive blood testing from very small samples, but the technology did not perform as represented, leading to regulatory action, legal consequences and the company's collapse.",
    evidence: [
      {
        contentType: 'POSTMORTEM',
        title: 'US v. Holmes Trial Exhibits: Diagnostic Hardware Infeasibility',
        sourceName: 'US District Court',
        sourceUrl: 'https://justice.gov/usao-ndca/us-v-elizabeth-holmes-et-al',
        content: 'Federal court records proved Theranos routinely ran patient blood samples on modified commercial Siemens analyzers while claiming tests ran on Edison devices.',
        metadata: { country: 'United States', city: 'Palo Alto' }
      }
    ],
    claims: [
      {
        claimText: 'Theranos claimed its proprietary Edison hardware could run 200+ blood diagnostic tests from a single capillary fingerprick, which was technologically infeasible.',
        category: 'PRODUCT',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.99
      }
    ]
  },
  {
    name: 'FTX',
    slug: 'ftx',
    description: 'Global cryptocurrency derivatives exchange that collapsed after revelations concerning customer fund co-mingling with Alameda Research and non-existent controls.',
    foundedYear: 2019,
    failureYear: 2022,
    industry: 'Cryptocurrency / Financial Services',
    stage: 'Late Stage / Decacorn',
    totalFunding: 1800000000,
    valuation: 32000000000,
    website: 'https://ftx.com',
    founders: ['Sam Bankman-Fried', 'Gary Wang', 'Nishad Singh'],
    failureReasons: [
      'Severe governance and financial-control failures',
      'Fraud',
      'Corporate Governance Failure',
      'Risk Management Failure',
      'Misuse of Customer Funds'
    ],
    keyLessons: [
      'Customer assets require strict segregation',
      'Independent governance is critical',
      'Financial controls must scale with company growth',
      'Rapid growth cannot substitute for operational discipline'
    ],
    postmortemSummary: "FTX collapsed after revelations concerning the relationship between FTX and Alameda Research, customer funds, financial controls and the company's governance structure.",
    evidence: [
      {
        contentType: 'POSTMORTEM',
        title: 'First Interim Report of John J. Ray III: FTX Governance & Controls Failure',
        sourceName: 'US Bankruptcy Court',
        sourceUrl: 'https://restructuring.ra.kroll.com/ftx',
        content: 'Never in my career have I seen such a complete failure of corporate controls and such a complete absence of trustworthy financial information as occurred here.',
        metadata: { country: 'Bahamas', city: 'Nassau' }
      }
    ],
    claims: [
      {
        claimText: 'FTX secretly diverted billions in customer exchange deposits to Alameda Research via custom codebase exemptions including allow_negative flags.',
        category: 'FINANCIAL',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.99
      }
    ]
  },
  {
    name: 'WeWork',
    slug: 'wework',
    description: 'Shared office space and commercial real estate technology company that crashed after aggressive global scaling exposed flawed unit economics.',
    foundedYear: 2010,
    failureYear: 2023,
    industry: 'Commercial Real Estate / Technology',
    stage: 'Late Stage / Pre-IPO',
    totalFunding: 21400000000,
    valuation: 47000000000,
    website: 'https://wework.com',
    founders: ['Adam Neumann', 'Miguel McKelvey'],
    failureReasons: [
      'Unsustainable business economics combined with aggressive expansion and governance problems',
      'Unsustainable Economics',
      'Governance Failure',
      'Excessive Expansion',
      'Capital Intensity'
    ],
    keyLessons: [
      'Growth does not equal a sustainable business',
      'Unit economics must support expansion',
      'Capital-intensive models require disciplined scaling',
      'Founder governance structures can create significant risk'
    ],
    postmortemSummary: 'WeWork expanded rapidly while carrying substantial long-term lease obligations and pursuing a growth strategy that struggled to produce sustainable economics.',
    evidence: [
      {
        contentType: 'FILING',
        title: 'WeWork Inc. Form S-1 Registration Statement (2019)',
        sourceName: 'SEC Edgar',
        sourceUrl: 'https://sec.gov/edgar/wework-s1',
        content: 'WeWork committed to over $47 billion in lease liabilities with only $4 billion in tenant commitments, burning through billions of venture capital subsidies.',
        metadata: { country: 'United States', city: 'New York' }
      }
    ],
    claims: [
      {
        claimText: 'WeWork had 15-year fixed lease liabilities versus 30-day flexible tenant contracts, creating a fatal asset-liability duration mismatch.',
        category: 'FINANCIAL',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.98
      }
    ]
  },
  {
    name: 'Wirecard',
    slug: 'wirecard',
    description: 'German payments and financial technology conglomerate that collapsed after disclosing €1.9 billion in nonexistent trustee cash accounts.',
    foundedYear: 1999,
    failureYear: 2020,
    industry: 'Financial Technology',
    stage: 'Public Enterprise',
    totalFunding: 2000000000,
    valuation: 28000000000,
    website: 'https://wirecard.com',
    founders: ['Markus Braun'],
    failureReasons: [
      'Financial reporting fraud and inadequate oversight',
      'Accounting Fraud',
      'Audit Failure',
      'Regulatory Failure',
      'Corporate Governance Failure'
    ],
    keyLessons: [
      'Financial claims require independent verification',
      'Auditing systems must challenge management assertions',
      'Rapid growth can hide underlying control weaknesses',
      'Regulatory oversight needs effective access to reliable evidence'
    ],
    postmortemSummary: 'Wirecard collapsed after a major shortfall in reported cash was revealed, exposing severe problems in financial reporting, auditing and corporate oversight.',
    evidence: [
      {
        contentType: 'NEWS',
        title: 'Financial Times House of Wirecard Investigation (Dan McCrum)',
        sourceName: 'Financial Times',
        sourceUrl: 'https://ft.com/wirecard-investigation',
        content: 'FT investigative journalism revealed that Wirecard’s high-margin Asian processing profits and €1.9B in Philippine bank balances were fictitious.',
        metadata: { country: 'Germany', city: 'Aschheim' }
      }
    ],
    claims: [
      {
        claimText: 'Wirecard booked €1.9 billion in phantom cash balances held in escrow accounts that Philippine banks confirmed never existed.',
        category: 'FINANCIAL',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.99
      }
    ]
  },
  {
    name: 'Kodak',
    slug: 'kodak',
    description: 'Iconic American photography pioneer that dominated film for over a century before filing for bankruptcy due to digital photography disruption.',
    foundedYear: 1892,
    failureYear: 2012,
    industry: 'Photography / Imaging',
    stage: 'Public Enterprise',
    totalFunding: 5000000000,
    valuation: 31000000000,
    website: 'https://kodak.com',
    founders: ['George Eastman'],
    failureReasons: [
      'Failure to successfully transition its business model as digital photography disrupted film',
      'Disruption Denial',
      'Strategic Failure',
      'Business Model Failure',
      'Organizational Inertia'
    ],
    keyLessons: [
      'Inventing a disruptive technology is not enough',
      'Companies must adapt their business models',
      'Protecting an existing revenue stream can delay necessary transformation',
      'Market disruption can destroy established advantages'
    ],
    postmortemSummary: 'Kodak developed early digital photography technology but struggled to transform its highly profitable film-centered business model as digital imaging fundamentally changed the market.',
    evidence: [
      {
        contentType: 'POSTMORTEM',
        title: 'The Real Reason Kodak Failed (Harvard Business Review)',
        sourceName: 'HBR',
        sourceUrl: 'https://hbr.org/2016/07/the-real-reason-kodak-failed',
        content: 'Kodak invented the digital camera in 1975 but suppressed it to protect its lucrative analog film processing and photographic paper business.',
        metadata: { country: 'United States', city: 'Rochester' }
      }
    ],
    claims: [
      {
        claimText: 'Kodak engineer Steve Sasson invented the digital camera in 1975, but executive leadership feared commercializing it would cannibalize analog film revenues.',
        category: 'PRODUCT',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.98
      }
    ]
  },
  {
    name: 'Nokia',
    slug: 'nokia',
    description: 'Finnish mobile telecom titan that commanded over 50% of the world handset market before collapsing in the touchscreen smartphone revolution.',
    foundedYear: 1865,
    failureYear: 2013,
    industry: 'Mobile Technology',
    stage: 'Public Enterprise',
    totalFunding: 10000000000,
    valuation: 250000000000,
    website: 'https://nokia.com',
    founders: ['Fredrik Idestam', 'Leo Mechelin'],
    failureReasons: [
      'Failure to adapt effectively to the smartphone and software ecosystem shift',
      'Strategic Failure',
      'Disruption',
      'Organizational Inertia',
      'Platform Failure'
    ],
    keyLessons: [
      'Hardware leadership does not guarantee platform leadership',
      'Software ecosystems can redefine competitive advantage',
      'Organizational culture affects strategic responsiveness',
      'Market leaders must continuously challenge their assumptions'
    ],
    postmortemSummary: "Nokia's position in mobile hardware was disrupted by smartphones and software-centric competitors, while organizational and strategic challenges slowed its response.",
    evidence: [
      {
        contentType: 'POSTMORTEM',
        title: 'Stephen Elop "Burning Platform" Internal Memo (Feb 2011)',
        sourceName: 'Wall Street Journal',
        sourceUrl: 'https://wsj.com/nokia-burning-platform',
        content: 'Our competitors aren’t taking our market share with devices; they are taking our market share with an entire ecosystem.',
        metadata: { country: 'Finland', city: 'Espoo' }
      }
    ],
    claims: [
      {
        claimText: 'Nokia commanded over 50% of global smartphone handset market share in 2007, which plummeted to under 3% by 2013 following the rise of iOS and Android.',
        category: 'COMPETITION',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.99
      }
    ]
  },
  {
    name: 'BlackBerry',
    slug: 'blackberry',
    description: 'Canadian mobile pioneer (Research In Motion) that pioneered enterprise wireless email before touchscreen smartphones made physical keyboards obsolete.',
    foundedYear: 1984,
    failureYear: 2016,
    industry: 'Mobile Technology',
    stage: 'Public Enterprise',
    totalFunding: 3000000000,
    valuation: 83000000000,
    website: 'https://blackberry.com',
    founders: ['Mike Lazaridis', 'Jim Balsillie'],
    failureReasons: [
      'Failure to adapt to touchscreen smartphones and the modern mobile application ecosystem',
      'Disruption',
      'Product Strategy Failure',
      'Platform Failure',
      'Organizational Inertia'
    ],
    keyLessons: [
      'Customer expectations can change rapidly',
      'A strong existing product can become a constraint',
      'Platform ecosystems create powerful network effects',
      'Competitive advantage must continuously evolve'
    ],
    postmortemSummary: "BlackBerry's strong position in secure mobile communication and physical-keyboard devices was disrupted by Apple's iPhone and Android smartphones, whose touchscreen interfaces and app ecosystems changed consumer expectations.",
    evidence: [
      {
        contentType: 'POSTMORTEM',
        title: 'Losing the Signal: Rise and Fall of BlackBerry (McNish & Silcoff)',
        sourceName: 'Forensic Books',
        sourceUrl: 'https://blackberry-forensics.com/losing-signal',
        content: 'BlackBerry co-CEOs initially dismissed full touchscreen phones as battery-inefficient toys, failing to recognize consumer demand for mobile web and apps.',
        metadata: { country: 'Canada', city: 'Waterloo' }
      }
    ],
    claims: [
      {
        claimText: 'BlackBerry controlled 43% of the US smartphone market in 2010 before declining to 0% as touchscreen app store ecosystems swept enterprise adoption.',
        category: 'PRODUCT',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.99
      }
    ]
  },
  {
    name: "BYJU'S",
    slug: 'byjus',
    description: 'Indian multinational educational technology company providing personalized online learning programs and tutoring services.',
    foundedYear: 2011,
    failureYear: 2024,
    industry: 'EdTech',
    stage: 'Late Stage / Decacorn',
    totalFunding: 5800000000,
    valuation: 22000000000,
    website: 'https://byjus.com',
    founders: ['Byju Raveendran', 'Divya Gokulnath'],
    failureReasons: [
      'Aggressive expansion combined with financial, governance and operational challenges',
      'Aggressive Expansion',
      'Financial Mismanagement',
      'Corporate Governance Failure',
      'Cash Burn',
      'Regulatory Pressure'
    ],
    keyLessons: [
      'Growth must be supported by sustainable economics',
      'Acquisitions require disciplined integration',
      'Financial reporting and governance must scale with the company',
      'High valuation does not guarantee business sustainability',
      'Aggressive expansion increases operational complexity'
    ],
    postmortemSummary: "BYJU'S experienced a dramatic decline after reaching a peak valuation of approximately $22 billion, with aggressive expansion, governance problems, financial difficulties and increasing regulatory scrutiny contributing to its collapse in value.",
    evidence: [
      {
        contentType: 'NEWS',
        title: 'Deloitte Resignation & $1.2B Debt Default: Inside the BYJU\'S Collapse',
        sourceName: 'TechCrunch',
        sourceUrl: 'https://techcrunch.com/byjus-debt-default-deloitte',
        content: 'Deloitte resigned as statutory auditor citing absence of management financial statements, while US lenders initiated insolvency proceedings.',
        metadata: { country: 'India', city: 'Bengaluru' }
      }
    ],
    claims: [
      {
        claimText: "BYJU'S valuation collapsed from $22 billion in 2022 to effectively zero as lenders invoked insolvency over a defaulted $1.2 billion Term Loan B.",
        category: 'FINANCIAL',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.98
      }
    ]
  },
  {
    name: 'Quibi',
    slug: 'quibi',
    description: 'Mobile-first streaming platform providing high-production Hollywood short-form video chapters designed for on-the-go viewing.',
    foundedYear: 2018,
    failureYear: 2020,
    industry: 'Media / Streaming',
    stage: 'Series A / Megaround',
    totalFunding: 1750000000,
    valuation: 2000000000,
    website: 'https://quibi.com',
    founders: ['Jeffrey Katzenberg', 'Meg Whitman'],
    failureReasons: [
      'Severe lack of product-market fit for premium paid short-form video in a market saturated with free TikTok/YouTube',
      'Over-engineered restrictive DRM preventing social sharing, screenshots, and viral discovery',
      'Launch timing coinciding with COVID-19 lockdowns eliminating the mobile commute use case',
      'Exorbitant content expenditure ($100k-$1M per minute) without customer retention'
    ],
    keyLessons: [
      'Mobile user attention is driven by user-generated virality and algorithmic feeds, not compressed Hollywood episodic budgets',
      'Restricting user screenshotting and content sharing guarantees organic marketing failure',
      'Large initial capital cannot brute-force consumer subscription behavior without iterative testing'
    ],
    postmortemSummary: 'Quibi raised $1.75B from major Hollywood studios and tech investors to launch quick-bite 10-minute video chapters on mobile phones. Within six months of its April 2020 launch, paying subscriber conversion collapsed below 8%, and the founders chose to shut down and return remaining capital to investors.',
    evidence: [
      {
        contentType: 'POSTMORTEM',
        title: 'Why Quibi Collapsed Just Six Months After Launch',
        sourceName: 'Failory',
        sourceUrl: 'https://failory.com/cemetery/quibi',
        content: 'Quibi spent $1.75 billion betting on premium short videos for commuters, but users refused to pay $5-$8 monthly when TikTok and YouTube offered unlimited free content with viral social sharing.',
      }
    ],
    claims: [
      {
        claimText: 'Quibi converted fewer than 500,000 paying subscribers from its initial 90-day free trial cohort despite spending $1.75B in launch and production capital.',
        category: 'MARKET',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.96,
      }
    ]
  },
  {
    name: 'Juicero',
    slug: 'juicero',
    description: 'Connected kitchen appliance manufacturer offering a high-pressure cold-press juicing machine utilizing proprietary pre-packaged produce packs.',
    foundedYear: 2013,
    failureYear: 2017,
    industry: 'Hardware / Consumer IoT',
    stage: 'Series B',
    totalFunding: 118500000,
    valuation: 450000000,
    website: 'https://juicero.com',
    founders: ['Doug Evans'],
    failureReasons: [
      'Extreme over-engineering of consumer hardware leading to an initial $699 retail price',
      'Product redundancy exposed when journalists demonstrated produce packets could be hand-squeezed faster without the machine',
      'High logistics and cold-chain distribution costs for perishable pre-cut fruit and vegetable packs',
      'Flawed value proposition solving an artificial problem with excessive complexity'
    ],
    keyLessons: [
      'Avoid over-engineering hardware when a low-tech physical alternative achieves identical outcomes',
      'Ensure the appliance is fundamental to the consumable ecosystem rather than an unnecessary bottleneck',
      'Direct consumer scrutiny and teardowns can instantaneously destroy synthetic value propositions'
    ],
    postmortemSummary: 'Juicero raised nearly $120M from top-tier venture firms to manufacture a high-tech Wi-Fi connected cold-press juicer. In April 2017, Bloomberg published a viral video showing reporters easily squeezing the juice packets by hand into a glass without the $400 machine. Public mockery decimated sales, forcing Juicero to halt operations five months later.',
    evidence: [
      {
        contentType: 'NEWS',
        title: 'Silicon Valley’s $400 Squeezer: Bloomberg Hand Squeeze Test',
        sourceName: 'TechCrunch',
        sourceUrl: 'https://techcrunch.com/2017/04/19/juicero-squeeze-test',
        content: 'Bloomberg revealed that Juicero’s press was entirely unnecessary because the proprietary bags could be squeezed by hand faster and with equal yield.',
      }
    ],
    claims: [
      {
        claimText: 'Juicero juicer packets could produce identical liquid yields through manual hand-squeezing without requiring the $400 Wi-Fi connected press.',
        category: 'PRODUCT',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.99,
      }
    ]
  },
  {
    name: 'Vine',
    slug: 'vine',
    description: 'Pioneering social short-form 6-second looping video platform acquired by Twitter prior to official release.',
    foundedYear: 2012,
    failureYear: 2016,
    industry: 'Social Media / Video',
    stage: 'Acquired / Corporate Subsidiary',
    totalFunding: 30000000,
    valuation: 100000000,
    website: 'https://vine.co',
    founders: ['Dom Hofmann', 'Rus Yusupov', 'Colin Kroll'],
    failureReasons: [
      'Inability to provide creator monetization tools leading top creators to defect to YouTube and Instagram',
      'Parent company (Twitter) strategic neglect and lack of engineering prioritization',
      'Aggressive feature competition from Instagram Video and Snapchat stories',
      'Failure to build algorithmic content recommendation feeds beyond chronological follower graphs'
    ],
    keyLessons: [
      'Platforms that neglect creator economy monetization invariably suffer total talent drain',
      'Parent corporate acquirers must support engineering roadmap autonomy for hypergrowth subsidiaries',
      'Algorithmic content feeds outperform static chronological follower graphs in short-form video'
    ],
    postmortemSummary: 'Vine pioneered the 6-second video loop and launched internet superstars, but Twitter failed to build monetization features or revenue sharing for creators. In 2015, the top 50 Viners held an intervention demanding compensation; when rejected, they migrated en masse to Instagram and YouTube, leading Twitter to shut Vine down in October 2016.',
    evidence: [
      {
        contentType: 'POSTMORTEM',
        title: 'Why Vine Died: The Exodus of Top Creators',
        sourceName: 'HackerNews',
        sourceUrl: 'https://news.ycombinator.com/item?id=12811442',
        content: 'Vine failed because it did not build an ad rev-share system for its top influencers, who all left for YouTube and Instagram where they could sustain careers.',
      }
    ],
    claims: [
      {
        claimText: 'Vine top creators negotiated with management for fixed compensation contracts, defecting to Instagram and YouTube when Twitter refused.',
        category: 'MARKET',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.95,
      }
    ]
  },
  {
    name: 'Clubhouse',
    slug: 'clubhouse',
    description: 'Drop-in social audio network facilitating real-time voice conversations, panels, and live auditory rooms.',
    foundedYear: 2020,
    failureYear: 2023,
    industry: 'Social Audio',
    stage: 'Series C',
    totalFunding: 110000000,
    valuation: 4000000000,
    website: 'https://clubhouse.com',
    founders: ['Paul Davison', 'Rohan Seth'],
    failureReasons: [
      'Ephemeral pandemic-lockdown demand surge that collapsed as workers returned to physical offices',
      'Unprotected feature defensibility quickly cloned by Twitter Spaces, Spotify Greenroom, and Discord',
      'Synchronous audio friction requiring user undivided attention and active coordination',
      'Inability to maintain conversation quality as invite-only exclusivity diluted'
    ],
    keyLessons: [
      'Distinguish temporary behavioural anomalies during macro shocks (COVID lockdowns) from permanent product habits',
      'Stand-alone feature formats are easily copied by incumbents with established social distribution graphs',
      'Synchronous media formats face significantly higher time-scarcity resistance than asynchronous feeds'
    ],
    postmortemSummary: 'Clubhouse captured lightning in a bottle during 2020 lockdowns, reaching a $4B valuation within a year. However, synchronous live audio was easily cloned by Twitter and Spotify, and daily active user retention cratered by over 80% once lockdown conditions eased and in-person routines resumed.',
    evidence: [
      {
        contentType: 'NEWS',
        title: 'The Post-Lockdown Deflation of Social Audio',
        sourceName: 'TechCrunch',
        sourceUrl: 'https://techcrunch.com/clubhouse-downward-trend',
        content: 'Clubhouse saw monthly downloads drop from 9.6 million in February 2021 to under 900k by April as synchronous social audio fatigue set in.',
      }
    ],
    claims: [
      {
        claimText: 'Clubhouse monthly mobile installs fell over 89% within three months of peaking in February 2021 as competitor clones launched.',
        category: 'MARKET',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.94,
      }
    ]
  },
  {
    name: 'Yo App',
    slug: 'yo-app',
    description: 'Hyper-minimalist mobile messaging application that allowed users to send a single audio-text notification: "Yo".',
    foundedYear: 2014,
    failureYear: 2016,
    industry: 'Consumer Social / Messaging',
    stage: 'Seed',
    totalFunding: 2500000,
    valuation: 10000000,
    website: 'https://justyo.co',
    founders: ['Or Arbel', 'Moshe Hogeg'],
    failureReasons: [
      'Gimmick utility and novel meme effect without sustained retention or workflow integration',
      'Severe cybersecurity breach within four days of viral launch revealing user phone numbers',
      'Lack of defensible communication depth or monetization strategy',
      'High user churn once the initial joke dissipated'
    ],
    keyLessons: [
      'Viral novelty spikes do not equate to sustainable engagement or long-term retention',
      'Security and auth infrastructure must precede viral consumer marketing campaigns',
      'Single-button utilities must evolve into practical workflows or face rapid obsolescence'
    ],
    postmortemSummary: 'Created in 8 hours as an April Fools prank, Yo went viral and raised $2.5M at a $10M valuation. Despite partnerships with brands to send notifications, users quickly abandoned the app once the one-bit meme humor wore off.',
    evidence: [
      {
        contentType: 'POSTMORTEM',
        title: 'The Life, Hack, and Death of Yo',
        sourceName: 'HackerNews',
        sourceUrl: 'https://news.ycombinator.com/item?id=7918512',
        content: 'Yo proved that hyper-simplicity can generate millions of downloads in a week, but zero retention over 60 days.',
      }
    ],
    claims: [
      {
        claimText: 'Yo suffered a major API security vulnerability exposing user phone numbers and push tokens within 96 hours of hitting #1 on the iOS App Store.',
        category: 'PRODUCT',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.97,
      }
    ]
  },
  {
    name: 'Color Labs',
    slug: 'color-labs',
    description: 'Proximity-based mobile photo sharing network designed to dynamically interconnect devices within a 150-foot radius.',
    foundedYear: 2010,
    failureYear: 2012,
    industry: 'Mobile Social / Photography',
    stage: 'Series A',
    totalFunding: 41000000,
    valuation: 100000000,
    website: 'https://color.com',
    founders: ['Bill Nguyen', 'Peter Pham'],
    failureReasons: [
      'Cold-start disaster: opening the app in an empty room displayed a blank black screen with zero utility',
      'Severe pre-launch hype raising $41M before launch without validating real consumer behavior',
      'Complex and counter-intuitive proximity algorithm confusing everyday users',
      'Executive infighting and abrupt board-level operational pivot'
    ],
    keyLessons: [
      'Never launch a social product that has zero single-player utility or falls into a blank screen state without nearby users',
      'Premature hyper-funding without product testing inflates expectations to unrecoverable heights',
      'Social networks need deliberate friend-graph bootstrapping rather than purely ephemeral geographic matching'
    ],
    postmortemSummary: 'Color Labs raised an unprecedented $41M before launching its app. When released, users without friends in their immediate physical proximity saw empty screens. The app flopped immediately, leading to co-founder exits and an acqui-hire fire sale of its patents to Apple for $7M.',
    evidence: [
      {
        contentType: 'POSTMORTEM',
        title: 'Color Labs: The Cautionary Tale of Premature Millions',
        sourceName: 'Failory',
        sourceUrl: 'https://failory.com/cemetery/color',
        content: 'Color raised $41 million before launch and built an app that only worked if strangers around you also had the app open, creating an unbearable cold start problem.',
      }
    ],
    claims: [
      {
        claimText: 'Color Labs launched with zero single-player mode, rendering the mobile application entirely non-functional if no other users were within 150 feet.',
        category: 'PRODUCT',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.98,
      }
    ]
  },
  {
    name: 'Pets.com',
    slug: 'pets-com',
    description: 'Early e-commerce pioneer selling pet supplies, accessories, and heavy pet food bags over the internet.',
    foundedYear: 1998,
    failureYear: 2000,
    industry: 'E-Commerce',
    stage: 'Public (IPO)',
    totalFunding: 110000000,
    valuation: 300000000,
    website: 'https://pets.com',
    founders: ['Greg McLemore', 'Julie Wainwright'],
    failureReasons: [
      'Catastrophic negative gross margins selling heavy 40lb bags of pet food at discounts with free shipping',
      'Astronomical marketing expenditure ($2M Super Bowl sock puppet advertisement) exceeding gross revenues',
      'Immature e-commerce supply chain logistics and fulfillment technology in 1999',
      'Dot-com crash dry-up of public capital markets preventing ongoing cash burn'
    ],
    keyLessons: [
      'Free shipping on high-weight, low-margin merchandise requires localized warehousing and automated logistics',
      'High customer acquisition cost (CAC) with negative unit contribution margin guarantees insolvency',
      'Brand awareness via celebrity ads is worthless if every completed order loses money'
    ],
    postmortemSummary: 'The iconic dot-com symbol, Pets.com spent tens of millions on marketing—including a Macy’s Thanksgiving parade float—while losing roughly $1.50 on every dollar of merchandise sold due to shipping bulky pet food. The company went bankrupt 268 days after its initial public offering.',
    evidence: [
      {
        contentType: 'POSTMORTEM',
        title: 'The Anatomy of Dot-Com Failure: Pets.com',
        sourceName: 'Failory',
        sourceUrl: 'https://failory.com/cemetery/pets-com',
        content: 'Pets.com lost money on virtually every transaction due to packaging and shipping heavy merchandise across the country without scale.',
      }
    ],
    claims: [
      {
        claimText: 'Pets.com lost money on every bag of pet food sold due to shipping costs exceeding product gross margins.',
        category: 'FINANCIAL',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.99,
      }
    ]
  },
  {
    name: 'Webvan',
    slug: 'webvan',
    description: 'Online grocery delivery service promising 30-minute delivery windows using automated regional mega-warehouses.',
    foundedYear: 1996,
    failureYear: 2001,
    industry: 'Logistics / E-Commerce',
    stage: 'Public (IPO)',
    totalFunding: 800000000,
    valuation: 1200000000,
    website: 'https://webvan.com',
    founders: ['Louis Borders'],
    failureReasons: [
      'Premature infrastructure buildout committing $1B to automated Bechtel distribution facilities before verifying local order densities',
      'Perishable inventory spoilage in grocery fulfillment with thin margins',
      'Targeting mass market consumers before broad consumer internet adoption',
      'Rapid geographical expansion into 26 cities before achieving single-market profitability'
    ],
    keyLessons: [
      'Never build multi-market mega-infrastructure before optimizing local unit route density',
      'Asset-heavy delivery models must reach high drop density per hour to offset vehicle and driver depreciation',
      'Test delivery demand with lightweight third-party retail partnerships before building proprietary automated centers'
    ],
    postmortemSummary: 'Webvan committed over $1 billion to constructing 26 colossal automated warehouses with automated carousel pickers before validating consumer adoption. When orders plateaued at a fraction of warehouse throughput capacity, the astronomical fixed overhead led to Chapter 11 bankruptcy in 2001.',
    evidence: [
      {
        contentType: 'POSTMORTEM',
        title: 'Why Webvan Crashed: Lessons for Quick Commerce',
        sourceName: 'HackerNews',
        sourceUrl: 'https://news.ycombinator.com/item?id=2541991',
        content: 'Webvan spent $35M per distribution center before reaching break-even order volumes in their first market.',
      }
    ],
    claims: [
      {
        claimText: 'Webvan contracted for $1 billion in automated distribution centers across 26 cities before achieving breakeven in its initial Bay Area market.',
        category: 'FINANCIAL',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.98,
      }
    ]
  },
  {
    name: 'Solyndra',
    slug: 'solyndra',
    description: 'Solar panel manufacturer designing proprietary cylindrical photovoltaic tubes for commercial flat rooftops.',
    foundedYear: 2005,
    failureYear: 2011,
    industry: 'CleanTech / Energy',
    stage: 'Series E / DOE Loan',
    totalFunding: 1200000000,
    valuation: 2000000000,
    website: 'https://solyndra.com',
    founders: ['Christian Gronet'],
    failureReasons: [
      'Unanticipated plunge in the global market price of conventional polysilicon by over 80%',
      'Complex cylindrical CIGS manufacturing process requiring multi-hundred-million-dollar automated fabrication plants',
      'Chinese state subsidies dramatically undercutting non-silicon alternative solar technologies',
      'Capital-intensive model reliant on government loan guarantees without cost competitiveness'
    ],
    keyLessons: [
      'Commodity price dynamics can instantly render elaborate hardware engineering workarounds uneconomic',
      'Subsidized global manufacturing competitors can drop market prices below domestic manufacturing marginal costs',
      'Hard-tech startups must conduct rigorous price-drop sensitivity modeling on baseline raw materials'
    ],
    postmortemSummary: 'Solyndra invented cylindrical solar panels using copper indium gallium selenide (CIGS) to bypass expensive polysilicon. However, polysilicon prices plummeted from $400/kg to under $50/kg, allowing standard flat solar panels to become dramatically cheaper. Solyndra defaulted on its $535M federal loan and shut down in 2011.',
    evidence: [
      {
        contentType: 'POSTMORTEM',
        title: 'The Solyndra Bankruptcy: Solar Economics and Macro Shifts',
        sourceName: 'Failory',
        sourceUrl: 'https://failory.com/cemetery/solyndra',
        content: 'Solyndra built a business case around polysilicon remaining expensive. When polysilicon prices dropped 89%, Solyndra’s intricate tube design became unsellable.',
      }
    ],
    claims: [
      {
        claimText: 'Solyndra manufacturing costs hovered above $2 per watt while conventional silicon panels dropped below $1 per watt due to global polysilicon deflation.',
        category: 'PRODUCT',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.96,
      }
    ]
  },
  {
    name: 'MoviePass',
    slug: 'moviepass',
    description: 'Subscription service offering consumers unlimited cinema theater movie tickets for a flat monthly fee.',
    foundedYear: 2011,
    failureYear: 2019,
    industry: 'Entertainment / Subscription',
    stage: 'Acquired / Public Subsidiary',
    totalFunding: 68000000,
    valuation: 300000000,
    website: 'https://moviepass.com',
    founders: ['Stacy Spikes', 'Hamet Watt'],
    failureReasons: [
      'Selling unlimited theatrical tickets for $9.95/month while paying theaters full retail price ($12-$15 per ticket)',
      'Naive expectation that theater chains (AMC, Regal) would share concession revenues under threat of boycott',
      'Hyper-rapid subscriber expansion from 20,000 to 3 million exacerbating daily cash burn',
      'Desperate anti-consumer countermeasures (app outages on blockbusters, password resets, ticket photo requirements)'
    ],
    keyLessons: [
      'Arbitrage models that pay full retail cost for every redemption create an inverted business model where usage increases losses',
      'Relying on future extortion of entrenched incumbents for margin concessions is rarely a viable strategy',
      'Degrading customer experience to curb operational cash burn accelerates user alienation and chargebacks'
    ],
    postmortemSummary: 'Under parent company Helios and Matheson, MoviePass slashed pricing to $9.95/mo for one movie a day. Because MoviePass paid theaters full retail face value for every ticket, heavy users burned through millions per week. Helios and Matheson ran out of capital, implemented draconian app blackouts, and collapsed into bankruptcy.',
    evidence: [
      {
        contentType: 'POSTMORTEM',
        title: 'How MoviePass Lost Millions Selling Dollar Bills for 50 Cents',
        sourceName: 'Failory',
        sourceUrl: 'https://failory.com/cemetery/moviepass',
        content: 'MoviePass paid average theater ticket prices of $13 each time a subscriber went to the movies, losing money on any user attending more than one movie per month.',
      }
    ],
    claims: [
      {
        claimText: 'MoviePass paid theaters full face value for all tickets, losing money on any user who watched more than a single movie per month under the $9.95 subscription plan.',
        category: 'FINANCIAL',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.99,
      }
    ]
  },
  {
    name: 'Jawbone',
    slug: 'jawbone',
    description: 'Wearable technology and consumer audio hardware company producing Bluetooth headsets, speakers, and UP fitness trackers.',
    foundedYear: 1999,
    failureYear: 2017,
    industry: 'Consumer Hardware / Wearables',
    stage: 'Series F / Late Stage',
    totalFunding: 930000000,
    valuation: 3200000000,
    website: 'https://jawbone.com',
    founders: ['Hosain Rahman', 'Alexander Asseily'],
    failureReasons: [
      'Severe hardware failure and warranty defect rates in the flagship UP fitness tracker',
      'Crushing competition from Apple Watch, Fitbit, and low-cost Chinese entrants like Xiaomi',
      'Pivot trap: bouncing between military headsets, portable speakers, and health sensors without dominant market leadership',
      'Heavy debt burdens and protracted patent litigation against Fitbit draining cash reserves'
    ],
    keyLessons: [
      'Hardware defect rates in consumer electronics destroy brand equity and generate fatal inventory RMA liability',
      'Generic health trackers are easily absorbed by multifunctional smartwatches with superior app ecosystems',
      'Debt financing for consumer hardware businesses with volatile product cycles leads to liquidation'
    ],
    postmortemSummary: 'Jawbone raised nearly $1B across 18 years, becoming a Silicon Valley hardware powerhouse. However, its UP band suffered high failure rates from sweat intrusion, and the arrival of the Apple Watch squeezed its premium fitness positioning. Unable to service debt or maintain inventory, Jawbone entered liquidation in 2017.',
    evidence: [
      {
        contentType: 'POSTMORTEM',
        title: 'The Slow Death of a Silicon Valley Unicorn: Jawbone',
        sourceName: 'HackerNews',
        sourceUrl: 'https://news.ycombinator.com/item?id=14711904',
        content: 'Jawbone had high warranty return rates on the original UP band and could not match the software-hardware integration of Apple Watch.',
      }
    ],
    claims: [
      {
        claimText: 'Jawbone initial UP fitness band suffered warranty return rates near 30% due to manufacturing defects and inadequate sweat waterproofing.',
        category: 'PRODUCT',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.95,
      }
    ]
  },
  {
    name: 'Fab.com',
    slug: 'fab-com',
    description: 'Flash-sale design e-commerce marketplace selling curated furniture, quirky clothing, and indie decor items.',
    foundedYear: 2010,
    failureYear: 2015,
    industry: 'E-Commerce / Flash Sales',
    stage: 'Series D',
    totalFunding: 336000000,
    valuation: 1000000000,
    website: 'https://fab.com',
    founders: ['Jason Goldberg', 'Bradford Shellhammer'],
    failureReasons: [
      'Premature international expansion spending tens of millions acquiring European copycats before domestic operational stability',
      'Abandoning the core curated flash-sale model for traditional commodity inventory e-commerce',
      'Massive inventory holding costs and warehouse lease commitments',
      'Uncontrolled customer acquisition ad spending with negative lifetime customer loyalty'
    ],
    keyLessons: [
      'Pivoting away from the original value proposition that drove product-market fit often accelerates user churn',
      'Do not expand internationally through multi-million-dollar acquisitions until home market unit economics are proven',
      'Flash sales rely on scarcity; stocking massive inventory warehouses destroys the agility of curated commerce'
    ],
    postmortemSummary: 'Fab transitioned from gay social network Fabulis to a flash-sale design store, exploding to 10M users and a $1B valuation. The company raised $336M and burned up to $14M per month expanding across Europe and stockpiling inventory. When customer retention plummeted, Fab was sold in parts for roughly $15M in 2015.',
    evidence: [
      {
        contentType: 'POSTMORTEM',
        title: 'How Fab Burned $300 Million in Record Time',
        sourceName: 'Failory',
        sourceUrl: 'https://failory.com/cemetery/fab',
        content: 'Fab expanded to 30 countries and opened massive fulfillment centers before realizing their repeat customer rate had cratered.',
      }
    ],
    claims: [
      {
        claimText: 'Fab burnt as much as $14 million per month at peak expansion, laying off over 80% of staff within 18 months of reaching a $1B valuation.',
        category: 'FINANCIAL',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.97,
      }
    ]
  },
  {
    name: 'Homejoy',
    slug: 'homejoy',
    description: 'On-demand home cleaning platform matching independent residential cleaners with homeowners at flat hourly rates.',
    foundedYear: 2012,
    failureYear: 2015,
    industry: 'On-Demand / Marketplace',
    stage: 'Series B',
    totalFunding: 40000000,
    valuation: 150000000,
    website: 'https://homejoy.com',
    founders: ['Adora Cheung', 'Aaron Cheung'],
    failureReasons: [
      'Horrendous retention: $19 promotional coupon users churned after one cleaning and rarely paid the standard $25-$35/hr rate',
      'Platform disintermediation: cleaners and homeowners bypassed Homejoy to transact directly for cash',
      'Mounting legal classification lawsuits arguing cleaners were misclassified as 1099 independent contractors',
      'Excessive multi-city expansion before solving unit retention in core metropolitan hubs'
    ],
    keyLessons: [
      'High personal-trust services (home cleaning, childcare) suffer massive disintermediation once trust is established',
      'Discount promotions that attract deal-hunters mask fatal 30-day user retention metrics',
      'Worker classification risk can kill high-volume, low-margin gig marketplace startups'
    ],
    postmortemSummary: 'Homejoy offered heavily subsidized $19 introductory cleans across dozens of cities to accelerate top-line growth. However, less than 25% of customers booked a second clean at full price, and regular clients routinely poached cleaners off the app. Facing worker misclassification lawsuits, Homejoy ceased operations in July 2015.',
    evidence: [
      {
        contentType: 'POSTMORTEM',
        title: 'Why Homejoy Failed: The Disintermediation Trap',
        sourceName: 'HackerNews',
        sourceUrl: 'https://news.ycombinator.com/item?id=9941913',
        content: 'Homejoy customer retention was terrible because after the first great cleaning, the homeowner and cleaner made their own off-platform arrangement.',
      }
    ],
    claims: [
      {
        claimText: 'Homejoy retained less than 25% of customers past 30 days due to widespread off-platform cash transactions between cleaners and homeowners.',
        category: 'MARKET',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.96,
      }
    ]
  },
  {
    name: 'Rdio',
    slug: 'rdio',
    description: 'Ad-free premium music streaming subscription platform renowned for superior UI/UX design and social music sharing.',
    foundedYear: 2010,
    failureYear: 2015,
    industry: 'Media / Music Streaming',
    stage: 'Series E',
    totalFunding: 125000000,
    valuation: 500000000,
    website: 'https://rdio.com',
    founders: ['Janus Friis', 'Niklas Zennström'],
    failureReasons: [
      'Refusal to offer a permanent free ad-supported tier while competitor Spotify leveraged freemium to dominate distribution',
      'Crushing record label royalty costs taking 70%+ of subscription revenues regardless of operating margin',
      'Minimal marketing and brand presence outside tech enthusiast circles',
      'Late entry of Apple Music and Amazon Music saturating premium streaming subscriptions'
    ],
    keyLessons: [
      'In consumer media with identical licensed catalogues, freemium distribution loops beat pure subscription walls',
      'Superior design and UI cannot compensate for an inferior distribution engine against aggressive incumbents',
      'High royalty licensing models require tens of millions of users to achieve corporate operational breakeven'
    ],
    postmortemSummary: 'Founded by Skype co-founders, Rdio built what many considered the most elegant music streaming interface in existence. However, Rdio insisted on a paid subscription gate while Spotify offered free ad-supported streaming. Rdio burned through capital paying minimum label guarantees, declaring bankruptcy and selling assets to Pandora for $75M.',
    evidence: [
      {
        contentType: 'POSTMORTEM',
        title: 'Why Rdio Died: An Insider Postmortem on Freemium vs Premium',
        sourceName: 'Failory',
        sourceUrl: 'https://failory.com/cemetery/rdio',
        content: 'Rdio was widely loved by designers, but Spotify’s free tier generated an insurmountable top of funnel that Rdio could never match.',
      }
    ],
    claims: [
      {
        claimText: 'Rdio lost the streaming music wars primarily because Spotify offered an ad-supported free tier while Rdio required a credit card up front.',
        category: 'MARKET',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.98,
      }
    ]
  },
  {
    name: 'Meerkat',
    slug: 'meerkat',
    description: 'Pioneering mobile live-video broadcasting platform integrated directly into the Twitter social network graph.',
    foundedYear: 2015,
    failureYear: 2016,
    industry: 'Social Video / Live Streaming',
    stage: 'Series B',
    totalFunding: 14000000,
    valuation: 50000000,
    website: 'https://meerkatapp.co',
    founders: ['Ben Rubin'],
    failureReasons: [
      'Total platform dependency: Twitter cut off Meerkat access to its social graph at SXSW 2015',
      'Direct incumbent cloning: Twitter launched Periscope and Facebook launched Facebook Live',
      'Content creation friction: high cognitive barrier for everyday users to stream live video regularly',
      'Lack of an independent proprietary follower graph or off-platform identity mechanism'
    ],
    keyLessons: [
      'Building a core product entirely dependent on an incumbent social graph leaves you vulnerable to immediate API revocation',
      'Live broadcasting suffers steep creator-to-consumer ratio imbalances (1:1000) leading to audience drop-offs',
      'Pivot rapidly when platform gatekeepers launch directly competing native features'
    ],
    postmortemSummary: 'Meerkat was the breakout sensation of SXSW in March 2015, allowing anyone to stream live video directly to Twitter followers. Two weeks later, Twitter cut off Meerkat’s API access and announced its acquisition of rival Periscope. Denied access to Twitter’s social graph, Meerkat’s growth stopped, forcing a pivot to Houseparty.',
    evidence: [
      {
        contentType: 'NEWS',
        title: 'Twitter Cuts Off Meerkat From Social Graph Ahead of SXSW',
        sourceName: 'TechCrunch',
        sourceUrl: 'https://techcrunch.com/2015/03/13/twitter-cuts-meerkat-off',
        content: 'Twitter terminated Meerkat’s access to its follower graph right before SXSW to prepare for the launch of its acquired competitor Periscope.',
      }
    ],
    claims: [
      {
        claimText: 'Twitter severed Meerkat API access to the Twitter social graph in March 2015, crippling user discovery within weeks of the app breakout launch.',
        category: 'LEGAL',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.99,
      }
    ]
  },
  {
    name: 'Secret',
    slug: 'secret',
    description: 'Anonymous mobile social networking app sharing unvarnished Silicon Valley gossip and insider confessions.',
    foundedYear: 2014,
    failureYear: 2015,
    industry: 'Social Media / Anonymous',
    stage: 'Series B',
    totalFunding: 35000000,
    valuation: 100000000,
    website: 'https://secret.ly',
    founders: ['David Byttow', 'Chrys Bader'],
    failureReasons: [
      'Toxic community dynamics: unchecked cyberbullying, false sexual harassment rumors, and defamation',
      'International regulatory bans and court injunctions (Brazil banned Secret for violating constitutional anti-anonymity protections)',
      'Severe user retention drop-off once hostile drama alienated mainstream early adopters',
      'Founder moral dilemma regarding negative societal impact leading to voluntary shutdown'
    ],
    keyLessons: [
      'Unmoderated anonymous networks inevitably devolve into harassment, malicious rumors, and toxicity',
      'Anonymous apps face severe international legal exposure under global defamation and cyberbullying statutes',
      'Toxicity generates initial engagement spikes but repels long-term advertisers and broad consumer demographics'
    ],
    postmortemSummary: 'Secret raised $35M in nine months, becoming Silicon Valley’s hottest gossip hub. However, anonymity bred toxic personal attacks, fabricated rumors about founders, and severe cyberbullying. Facing lawsuits, a ban in Brazil, and personal disillusionment, CEO David Byttow shut down the company and returned remaining venture capital.',
    evidence: [
      {
        contentType: 'POSTMORTEM',
        title: 'Sunset on Secret: Why We Are Shutting Down',
        sourceName: 'Failory',
        sourceUrl: 'https://failory.com/cemetery/secret',
        content: 'Secret CEO David Byttow voluntarily shut down the app and returned $15 million to investors, stating anonymity had created a destructive social tool.',
      }
    ],
    claims: [
      {
        claimText: 'Secret was officially banned by a Brazilian civil court judge for violating the national constitution which prohibits complete anonymity in published communication.',
        category: 'LEGAL',
        verificationStatus: 'VERIFIED',
        confidenceScore: 0.98,
      }
    ]
  }
];

const SEED_FAILURE_PATTERNS = [
  {
    title: 'Unit Economics Inversion & Subsidized Hypergrowth',
    slug: 'unit-economics-inversion',
    description: 'Scaling transactions where each incremental unit delivered yields a negative contribution margin, masked by aggressive venture capital subsidies.',
    frequency: 6,
    primaryFactors: [
      'Subsidized consumer pricing below operational unit delivery cost',
      'Negative gross margins hidden under top-line GMV expansion',
      'High physical fulfillment or leasehold fixed-overhead burdens'
    ],
    affectedIndustries: ['E-Commerce', 'PropTech', 'On-Demand', 'Entertainment'],
    representativeCompanyIds: ['wework', 'pets-com', 'webvan', 'moviepass', 'fab-com', 'homejoy'],
    preventionStrategy: 'Stress-test unit contribution margin excluding marketing allocations. Ensure delivery or procurement costs scale sub-linearly prior to geographic rollouts.',
    severity: 'CRITICAL'
  },
  {
    title: 'Platform Hostility & Graph Dependency',
    slug: 'platform-hostility-dependency',
    description: 'Building a venture entirely dependent on an incumbent platform API, distribution channel, or proprietary graph that gets cloned or revoked.',
    frequency: 3,
    primaryFactors: [
      'Zero single-player mode without incumbent social graph',
      'Vulnerability to sudden API deprecation or commercial terms revocation',
      'Direct feature cloning by the platform host'
    ],
    affectedIndustries: ['Social Media', 'Video Streaming', 'Messaging'],
    representativeCompanyIds: ['meerkat', 'vine', 'clubhouse'],
    preventionStrategy: 'Establish independent authentication, proprietary user contacts, and multi-channel distribution from day one. Avoid relying on a single gatekeeper.',
    severity: 'HIGH'
  },
  {
    title: 'Governance Breakdown & Fiduciary Fraud',
    slug: 'governance-breakdown-fraud',
    description: 'Concentration of unchecked executive voting control, absence of credible statutory audits, and active concealment of product shortcomings.',
    frequency: 3,
    primaryFactors: [
      'Absence of independent board governance and committee oversight',
      'Concealment of operational metrics and falsification of testing data',
      'Commingling of corporate funds or abusive related-party transactions'
    ],
    affectedIndustries: ['Biotech', 'Fintech / Crypto', 'EdTech', 'PropTech'],
    representativeCompanyIds: ['theranos', 'ftx', 'byjus', 'wework'],
    preventionStrategy: 'Institute independent board committees, mandate Big Four audited financial statements, and establish whistle-blower protections.',
    severity: 'CRITICAL'
  },
  {
    title: 'Hardware Over-Engineering & Warranty Drag',
    slug: 'hardware-overengineering',
    description: 'Excessive hardware complexity that inflates retail price points beyond customer willingness-to-pay while generating high warranty return liabilities.',
    frequency: 2,
    primaryFactors: [
      'Solving simple physical problems with high-complexity IoT electronics',
      'High manufacturing defect rates and warranty return reserves',
      'Severe component price drops making alternative approaches dominant'
    ],
    affectedIndustries: ['Consumer IoT', 'Wearables', 'CleanTech'],
    representativeCompanyIds: ['juicero', 'jawbone', 'solyndra'],
    preventionStrategy: 'Validate user willingness to pay with rudimentary mechanical prototypes before committing to mass toolings and custom microcontrollers.',
    severity: 'HIGH'
  }
];

async function seedDatabase() {
  logger.info('Starting PivotVault database seed...');

  try {
    // 1. Seed Failure Patterns
    logger.info(`Seeding ${SEED_FAILURE_PATTERNS.length} Failure Patterns...`);
    for (const pattern of SEED_FAILURE_PATTERNS) {
      await prisma.failurePattern.upsert({
        where: { slug: pattern.slug },
        update: pattern,
        create: pattern,
      });
    }
    logger.info('Failure Patterns seeded successfully.');

    // 2. Seed 20 Companies with Evidence and Claims
    logger.info(`Seeding ${SEED_COMPANIES.length} Startup Postmortems...`);
    const createdCompanyIds = [];

    for (const data of SEED_COMPANIES) {
      const { evidence, claims, ...companyData } = data;

      const company = await prisma.company.upsert({
        where: { slug: companyData.slug },
        update: {
          ...companyData,
          enriched: false, // Ensure Dev 2 knows it requires RAG indexing
        },
        create: {
          ...companyData,
          enriched: false,
        },
      });

      createdCompanyIds.push({ id: company.id, slug: company.slug, name: company.name });

      // Seed Evidence
      if (evidence && evidence.length > 0) {
        await prisma.evidence.deleteMany({ where: { companyId: company.id } });
        for (const ev of evidence) {
          const createdEv = await prisma.evidence.create({
            data: {
              ...ev,
              companyId: company.id,
            },
          });

          // Seed Claims linked to this evidence
          if (claims && claims.length > 0) {
            for (const cl of claims) {
              await prisma.claim.create({
                data: {
                  ...cl,
                  companyId: company.id,
                  evidenceId: createdEv.id,
                },
              });
            }
          }
        }
      }

      logger.debug(`Seeded company: ${company.name} [slug: ${company.slug}, id: ${company.id}]`);
    }

    // 3. Ingest seed.json if present
    try {
      const { seedFromJson } = require('./seedFromJson');
      await seedFromJson();
    } catch (jsonErr) {
      logger.warn(`seedFromJson skipped or failed: ${jsonErr.message}`);
    }

    return createdCompanyIds;
  } catch (err) {
    logger.error(`Seed failed: ${err.message}`, { stack: err.stack });
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedDatabase()
    .then(() => {
      logger.info('Database seed complete!');
      process.exit(0);
    })
    .catch(() => {
      process.exit(1);
    });
}

module.exports = { seedDatabase, SEED_COMPANIES, SEED_FAILURE_PATTERNS };
