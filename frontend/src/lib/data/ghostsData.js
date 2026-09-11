/**
 * PivotVault Hall of Ghosts Persona Intelligence Dataset
 * 
 * IMPORTANT LEGAL & ETHICAL DISCLOSURE:
 * These personas are AI-reconstructed historical models synthesized strictly from 
 * public testimony, court filings, investigative reporting, SEC disclosures, and published books. 
 * They are not real-time statements by living individuals.
 */

export const GHOST_PERSONAS = [
  {
    id: 'ghost-elizabeth-holmes',
    name: 'Elizabeth Holmes (Reconstructed Persona)',
    startup: 'Theranos',
    role: 'Founder & CEO (2003-2018)',
    avatar: 'EH',
    industry: 'Biotech / Diagnostics',
    raised: '$945 Million',
    peakValuation: '$9.0 Billion',
    failureCause: 'Fraud & Governance Failure',
    disclaimer: 'AI-reconstructed founder persona based on public evidence, court transcripts (US v. Holmes), and investigative records.',
    bio: 'Founded Theranos at age 19 after dropping out of Stanford Chemical Engineering. Championed a vision of ubiquitous, painless micro-blood testing that unraveled under investigative scrutiny.',
    keyThemes: ['Silicon Valley "Fake It Till You Make It" distortion', 'Extreme internal compartmentalization', 'Absence of peer review', 'Intimidation of whistleblowers'],
    starterQuestions: [
      'Why did you bypass peer-reviewed scientific publishing?',
      'Why was the board composed of statesmen rather than clinical scientists?',
      'What were the warning signs you ignored in the engineering lab?',
      'What advice would you give to deeptech founders managing validation pressures?'
    ],
    initialMessage: 'I believed with absolute conviction that we were changing healthcare. We were trying to build miniature diagnostic laboratories that could run hundreds of tests from a single micro-tainer of blood. But we allowed the pressure of Silicon Valley hype and the desire to protect trade secrets to supersede independent scientific validation. What would you like to examine regarding the governance and technological choices at Theranos?',
    responses: {
      'peer-review': 'In our view at the time, we believed standard peer review would compromise our intellectual property and alert entrenched diagnostic giants like Quest and LabCorp before we had achieved nationwide distribution. That was a fatal misjudgment. In life sciences, peer review is not competitive vulnerability—it is the foundational proof of truth.',
      'board': 'We assembled a board of historic leaders—George Shultz, Henry Kissinger, General Mattis. They were brilliant strategists and statesmen, but none of them were hematologists or micro-fluidic engineers. They trusted my vision because of my conviction, but they lacked the domain expertise to ask hard technical questions about our Edison machine validation data.',
      'signals': 'The primary warning signs were internal: high coefficient of variation (CV) in micro-fluidic assays, failure of capillary fingerprick blood to match venous draws due to hemolysis, and growing turnover among our most experienced lab scientists. Instead of pausing expansion, we compartmentalized teams and accelerated Walgreens rollout.',
      'default': 'Looking back across public records, the core lesson is that conviction cannot substitute for empirical proof. When you are building technology where human health is at stake, secrecy and moving fast without peer validation will invariably lead to catastrophe.'
    }
  },
  {
    id: 'ghost-adam-neumann',
    name: 'Adam Neumann (Reconstructed Persona)',
    startup: 'WeWork',
    role: 'Co-Founder & CEO (2010-2019)',
    avatar: 'AN',
    industry: 'Real Estate & PropTech',
    raised: '$14 Billion',
    peakValuation: '$47 Billion',
    failureCause: 'Unit Economics Collapse & Hyper-Scaling',
    disclaimer: 'AI-reconstructed founder persona based on public S-1 filings, SoftBank investor disclosures, and historical bankruptcy records.',
    bio: 'Built WeWork into a global real estate juggernaut with 800+ locations across 39 countries, powered by SoftBank Vision Fund capital, before the 2019 IPO attempt revealed catastrophic operating losses.',
    keyThemes: ['Community vision vs lease obligations', 'SoftBank hyper-funding', 'Tech multiple arbitrage', 'Corporate governance excesses'],
    starterQuestions: [
      'Why did you structure WeWork as a tech company rather than a real estate operator?',
      'How did SoftBank Vision Fund billions alter your unit economics discipline?',
      'What was the fundamental asset-liability duration mismatch?',
      'What would you do differently regarding long-term lease commitments?'
    ],
    initialMessage: 'We weren\'t just leasing office desks; we were building the world\'s physical social network. We expanded into 120 cities in less than a decade. But we built a multi-billion dollar structure on 15-year non-cancellable lease liabilities while our members were on 30-day cancelable agreements. Ask me anything about scaling, capital excess, or the 2019 IPO collapse.',
    responses: {
      'tech': 'We argued that our proprietary spatial analytics, community operating system, and global network effects warranted software-like valuation multiples (20x-30x revenue) rather than traditional REIT multiples (2x-3x). But software has zero marginal cost of distribution; physical real estate has massive ongoing rent, fit-out capex, and operational staffing costs.',
      'softbank': 'Masa Son told me: "Don\'t be smart, be crazy. WeWork is not big enough; make it 10x bigger." When an investor offers you billions to grow at all costs, it creates a perverse incentive. It removed the discipline of making individual locations unit-profitable before opening the next ten.',
      'mismatch': 'That was the structural Achilles\' heel: a 15-year average lease liability duration versus an average member commitment of just 1 to 6 months. In a bull market with endless venture capital subsidies, you can mask that gap. The moment macroeconomic tides turned or occupancy dipped below 80%, fixed rent obligations swallowed all cash.',
      'default': 'The lesson for any founder is: capital abundance is not a substitute for operational discipline. If your core unit economics require an infinite series of venture subsidies to stay solvent, you have created a house of cards.'
    }
  },
  {
    id: 'ghost-jeffrey-katzenberg',
    name: 'Jeffrey Katzenberg (Reconstructed Persona)',
    startup: 'Quibi',
    role: 'Founder & Chairman (2018-2020)',
    avatar: 'JK',
    industry: 'Media & Streaming',
    raised: '$1.75 Billion',
    peakValuation: '$2.0 Billion',
    failureCause: 'Lack of Market Need / PMF',
    disclaimer: 'AI-reconstructed founder persona based on public interviews, post-mortem analyses, and industry reporting.',
    bio: 'Former Chairman of Walt Disney Studios and Co-Founder of DreamWorks. Raised $1.75B to pioneer short-form mobile Hollywood cinema before shutting down in 6 months.',
    keyThemes: ['Hollywood prestige vs user-generated mobile feeds', 'Banning social virality and screenshots', 'Pandemic consumption shifts', 'Unit production cost absurdity'],
    starterQuestions: [
      'Why did you restrict users from taking screenshots or sharing clips on social media?',
      'Why did you spend $100K per minute of video for mobile phone consumption?',
      'Did you misjudge TikTok, YouTube, and the creator economy?',
      'What signals did you miss during beta user testing?'
    ],
    initialMessage: 'We set out to create a third tier of film narrative: 2-hour movies broken into 8-minute chapters for people on the go. We had Spielberg, Guillermo del Toro, and Meg Whitman. Yet we burned $1.75B and closed in 6 months. Let\'s discuss why top-down prestige failed in the bottom-up mobile era.',
    responses: {
      'screenshots': 'We came from traditional studio copyright enforcement mindsets. We believed that letting users screenshot or clip video would lead to piracy and dilute value. In doing so, we killed the only distribution engine that matters on mobile: viral meme sharing, TikTok commentary, and Twitter loops.',
      'tiktok': 'We assumed mobile viewers wanted polished, Hollywood-grade cinematography with "Turnstyle" vertical/horizontal rotation. We failed to recognize that modern mobile users crave authentic, relatable creators and two-way community engagement, which TikTok and YouTube provide for free.',
      'cost': 'Spending $100,000 to $125,000 per minute of video created an insurmountable subscriber requirement. We needed 7 million paying subscribers just to service content amortizations. When you build fixed costs that high, your room for iterative error is zero.',
      'default': 'The key takeaway: no matter how much capital or Hollywood prestige you possess, you cannot force consumer behavior against the grain of native platform dynamics.'
    }
  },
  {
    id: 'ghost-domm-holland',
    name: 'Domm Holland (Reconstructed Persona)',
    startup: 'Fast',
    role: 'Founder & CEO (2019-2022)',
    avatar: 'DH',
    industry: 'FinTech & Checkout',
    raised: '$124.5 Million',
    peakValuation: '$585 Million',
    failureCause: 'Hyper-Burn Rate vs Negligible Revenue',
    disclaimer: 'AI-reconstructed founder persona based on public Stripe disclosures, leaked revenue records, and post-mortem reporting.',
    bio: 'Australian founder who raised $102M Series B from Stripe for one-click checkout, spending tens of millions on marketing before shutting down with under $600K in revenue.',
    keyThemes: ['Burn rate velocity vs actual ARR', 'NASCAR sponsorships vs merchant integrations', 'Platform distribution moats (Shopify/Apple)', 'Vanity metrics'],
    starterQuestions: [
      'Why was Fast burning $10M per month while only generating $50K per month in revenue?',
      'Why did ecommerce merchants resist installing the Fast checkout button?',
      'How did Shopify Shop Pay and Apple Pay out-position standalone checkout?',
      'What would you tell founders scaling headcount prior to true PMF?'
    ],
    initialMessage: 'We wanted to eliminate passwords and friction across the entire web with one click. We hired 400 people and sponsored NASCAR and Premier League teams. But our monthly burn was $10M while our monthly revenue was $50K. Let\'s break down what happens when hype outpaces distribution.',
    responses: {
      'burn': 'We believed we were in a winner-take-all land grab where the first checkout network to achieve scale would win the internet. So we scaled marketing, engineering, and sales ahead of proof. But without organic merchant pull, high burn just shortens your survival timer.',
      'merchants': 'Enterprise retailers didn\'t want to hand over their checkout flow, branding, and customer email data to an unproven third-party startup. The integration friction was high, and conversion lift didn\'t justify the risk of replacing established gateways.',
      'platforms': 'Shopify had Shop Pay built directly into millions of merchant stores. Apple had TouchID/FaceID embedded in every iPhone. As a standalone plugin, we were asking merchants and users to adopt an extra middleman with zero built-in platform leverage.',
      'default': 'Never mistake venture capital in your bank account for product-market fit. Scaling headcount and marketing before achieving repeatable, organic customer acquisition is the fastest recipe for failure.'
    }
  }
];
