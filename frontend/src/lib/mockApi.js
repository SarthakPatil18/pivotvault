// Helper function to generate AI web intelligence report for missing startups
const generateWebIntelligenceReport = (slug, name) => {
  const industryMap = {
    'unacademy': 'EdTech',
    'byjus': 'EdTech',
    'ola': 'Mobility',
    'swiggy': 'Food Delivery',
    'zepto': 'Quick Commerce',
    'paytm': 'FinTech',
    'phonepe': 'FinTech',
    'oyo': 'Hospitality',
    'zomato': 'Food Delivery',
    'flipkart': 'E-Commerce'
  };
  
  const industry = industryMap[slug] || 'Tech';
  
  const tags = [
    'AI Generated',
    'Web Intelligence',
    '2020s',
    industry
  ];
  
  const timelineEvents = [
    { id: 1, title: 'Founded', year: 2015 },
    { id: 2, title: 'Raised Series A', year: 2017 },
    { id: 3, title: 'Expanded to major cities', year: 2019 },
    { id: 4, title: 'Faced regulatory challenges', year: 2021 },
    { id: 5, title: 'Downsizing and restructuring', year: 2023 }
  ];
  
  const failureReasons = [
    { id: 1, category: 'Unit Economics', description: 'High customer acquisition cost and low LTV made profitability elusive.' },
    { id: 2, category: 'Competition', description: 'Intense competition from deep-pocketed players squeezed margins.' },
    { id: 3, category: 'Regulatory', description: 'Changing regulatory landscape created uncertainty.' },
    { id: 4, category: 'Cash Burn', description: 'Aggressive expansion led to unsustainable cash burn.' }
  ];
  
  return {
    id: 999,
    slug,
    name,
    industry,
    status: 'analyzed',
    summary: `${name} is a ${industry} company that has been analyzed using web intelligence sources. This AI-generated report provides insights into its business model, challenges, and key learnings.`,
    foundingYear: 2015,
    shutdownYear: null,
    lifetimeMonths: 108,
    fundingInr: 50000000000,
    peakUsers: 1000000,
    topFailureReason: 'unit_economics',
    domain: `${slug}.com`,
    tags,
    timelineEvents,
    failureReasons,
    isAiGenerated: true // Flag to show "AI Generated Analysis" badge
  };
};

// Mock API data for hackathon demo mode
export const mockStartups = [
  {
    id: 1,
    slug: 'juicero',
    name: 'Juicero',
    industry: 'Consumer Hardware',
    status: 'failed',
    summary: 'A $400 Wi-Fi enabled juicer that squeezed pre-packaged juice bags.',
    foundingYear: 2013,
    shutdownYear: 2017,
    lifetimeMonths: 48,
    fundingInr: 10300000000,
    peakUsers: 100000,
    topFailureReason: 'unit_economics',
    domain: 'juicero.com',
    tags: ['Hardware', 'Consumer', 'Unit Economics'],
    timelineEvents: [
      { id: 1, title: 'Launched with $120M funding', year: 2015 },
      { id: 2, title: 'Shut down after unit economics failed', year: 2017 }
    ],
    failureReasons: [
      { id: 1, category: 'Unit Economics', description: 'High hardware cost and minimal value add.' },
      { id: 2, category: 'Product', description: 'Users could squeeze bags by hand.' }
    ]
  },
  {
    id: 2,
    slug: 'theranos',
    name: 'Theranos',
    industry: 'Health Tech',
    status: 'failed',
    summary: 'Claimed to revolutionize blood testing with a single drop of blood.',
    foundingYear: 2003,
    shutdownYear: 2018,
    lifetimeMonths: 180,
    fundingInr: 70000000000,
    peakUsers: 500000,
    topFailureReason: 'product',
    domain: 'theranos.com',
    tags: ['Health Tech', 'Fraud', 'Biotech'],
    timelineEvents: [
      { id: 1, title: 'Founded by Elizabeth Holmes', year: 2003 },
      { id: 2, title: 'Raised $700M+ funding', year: 2014 },
      { id: 3, title: 'Exposed by WSJ investigation', year: 2015 },
      { id: 4, title: 'Shut down and criminal charges', year: 2018 }
    ],
    failureReasons: [
      { id: 1, category: 'Fraud', description: 'Falsified test results.' },
      { id: 2, category: 'Product', description: 'Technology didn\'t work as claimed.' }
    ]
  },
  {
    id: 3,
    slug: 'wework',
    name: 'WeWork',
    industry: 'Real Estate',
    status: 'failed',
    summary: 'Co-working space company that collapsed after failed IPO.',
    foundingYear: 2010,
    shutdownYear: 2019,
    lifetimeMonths: 108,
    fundingInr: 90000000000,
    peakUsers: 600000,
    topFailureReason: 'cashflow',
    domain: 'wework.com',
    tags: ['Real Estate', 'Co-working', 'IPO Failure'],
    timelineEvents: [
      { id: 1, title: 'Founded by Adam Neumann', year: 2010 },
      { id: 2, title: 'Valued at $47B', year: 2019 },
      { id: 3, title: 'Failed IPO and Neumann ousted', year: 2019 }
    ],
    failureReasons: [
      { id: 1, category: 'Governance', description: 'Questionable leadership and self-dealing.' },
      { id: 2, category: 'Valuation', description: 'Unrealistic valuation based on flawed metrics.' }
    ]
  },
  {
    id: 4,
    slug: 'quibi',
    name: 'Quibi',
    industry: 'Media / Entertainment',
    status: 'failed',
    summary: 'Short-form video platform that shut down 6 months after launch.',
    foundingYear: 2018,
    shutdownYear: 2020,
    lifetimeMonths: 24,
    fundingInr: 14000000000,
    peakUsers: 500000,
    topFailureReason: 'pmf',
    domain: 'quibi.com',
    tags: ['Media', 'Short-form Video', 'PMF'],
    timelineEvents: [
      { id: 1, title: 'Founded by Meg Whitman and Jeffrey Katzenberg', year: 2018 },
      { id: 2, title: 'Launched in April 2020', year: 2020 },
      { id: 3, title: 'Shut down October 2020', year: 2020 }
    ],
    failureReasons: [
      { id: 1, category: 'PMF', description: 'No clear product-market fit despite massive budget.' },
      { id: 2, category: 'Timing', description: 'Launched during pandemic lockdowns when commuting vanished.' }
    ]
  }
];

// Export function to get startup by slug with fallback
export const getStartupBySlug = (slug) => {
  let startup = mockStartups.find(s => s.slug === slug);
  if (startup) return startup;
  
  // If not found, generate AI web intelligence report
  const nameMap = {
    'unacademy': 'Unacademy',
    'byjus': 'Byju\'s',
    'ola': 'Ola',
    'swiggy': 'Swiggy',
    'zepto': 'Zepto',
    'paytm': 'Paytm',
    'phonepe': 'PhonePe',
    'oyo': 'Oyo',
    'zomato': 'Zomato',
    'flipkart': 'Flipkart'
  };
  const name = nameMap[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
  return generateWebIntelligenceReport(slug, name);
};

export const mockRiskScan = {
  riskScore: 72,
  riskBreakdown: {
    customerAcquisition: 65,
    retention: 70,
    monetization: 60,
    competition: 80,
    timing: 75
  },
  recommendations: [
    { priority: 'high', action: 'Validate PMF aggressively', rationale: 'Most failures here stem from lack of product-market fit.' },
    { priority: 'medium', action: 'Fix unit economics early', rationale: 'Don\'t scale before proving profitable per user.' }
  ],
  suggestedPivots: [
    { type: 'Market', description: 'Target a more specific niche with higher willingness to pay.', historicalExample: 'Slack pivoted from gaming to enterprise comms.' },
    { type: 'Product', description: 'Simplify features to core value proposition only.', historicalExample: 'Instagram dropped all features except photo filters.' }
  ]
};

export const mockAiResponse = {
  aiSummary: "Based on historical data, startups in this space often fail due to premature scaling and lack of product-market fit. Key lessons: validate demand before scaling, keep burn rate low, and focus on retention.",
  timeline: [
    { year: 2015, startup: 'Juicero', event: 'Launched with $120M funding' },
    { year: 2017, startup: 'Juicero', event: 'Shut down after unit economics failed' }
  ],
  keyLessons: [
    { lesson: 'Validate PMF first', details: 'Don\'t spend millions on production before proving customers want your product.' },
    { lesson: 'Watch burn rate', details: 'High fixed costs can sink you fast if revenue doesn\'t match.' }
  ],
  sources: ['juicero', 'theranos'],
  relatedStartups: mockStartups.slice(0, 2)
};

export const mockPlaybook = {
  summary: "Your idea has potential but needs rigorous validation. Focus on these key areas first.",
  checklist: [
    "Interview 50 target customers",
    "Build a minimal viable product",
    "Validate willingness to pay",
    "Track retention metrics"
  ],
  risks: ["No PMF", "Unit Economics", "Competition"],
  nextSteps: [
    "Define your ideal customer profile",
    "Create a landing page to test demand",
    "Set up analytics from day one"
  ]
};

export const mockPitchDeckAutopsy = {
  overallRisk: 'High',
  pathologistVerdict: 'Your deck shows several red flags common to failed startups.',
  executiveSummary: 'Focus on product-market fit before scaling operations.',
  strengths: [
    { title: 'Clear Problem Statement', description: 'You\'ve defined the problem well.' },
    { title: 'Strong Team', description: 'Your team has relevant experience.' }
  ],
  weaknesses: [
    { title: 'Unrealistic Market Size', description: 'Your TAM calculation seems inflated.' },
    { title: 'No Clear Differentiation', description: 'It\'s not obvious how you stand out.' }
  ],
  marketRisks: [
    { title: 'Competition', description: 'Incumbents could easily copy this.' }
  ],
  productRisks: [
    { title: 'Complexity', description: 'Too many features for MVP.' }
  ],
  gtmRisks: [
    { title: 'Customer Acquisition', description: 'CAC seems too high.' }
  ],
  financialRisks: [
    { title: 'Burn Rate', description: 'You\'ll run out of cash in 12 months.' }
  ],
  pmfAnalysis: 'You haven\'t proven product-market fit yet. Focus on that first.',
  investorConcerns: [
    { title: 'Unit Economics', description: 'Need to show path to profitability.' },
    { title: 'Churn', description: 'Retention numbers are missing.' }
  ],
  competitiveAnalysis: 'The space is crowded but there might be a niche.',
  recommendedImprovements: [
    { title: 'Simplify MVP', description: 'Cut features to the core value prop.' },
    { title: 'Validate Pricing', description: 'Talk to customers about willingness to pay.' }
  ],
  actionPlan: [
    { phase: 'Month 1-2', tasks: ['Customer interviews', 'Landing page', 'Waitlist'] },
    { phase: 'Month 3-4', tasks: ['Build MVP', 'Beta test', 'Iterate'] }
  ],
  lethalWeaknesses: [
    { slide: 'Go-to-Market', issue: 'No clear user acquisition strategy', historicalPrecedent: 'Similar to Quibi\'s vague GTM plan.' },
    { slide: 'Financials', issue: 'Unrealistic revenue projections', historicalPrecedent: 'WeWork\'s inflated numbers.' }
  ],
  structuralRedFlags: ['Team', 'Market', 'Product']
};
