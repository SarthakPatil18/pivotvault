/**
 * PivotVault Interactive Failure Quiz Dataset
 * Deep post-mortem diagnostic questions on real-world startup deaths.
 */

export const QUIZ_QUESTIONS = [
  {
    id: 'quiz-1',
    startup: 'Quibi',
    raised: '$1.75 Billion',
    industry: 'Media & Streaming',
    scenario: 'Raised $1.75B with Hollywood A-list directors producing high-budget short episodes ($100k/min) designed exclusively for mobile phones. Launched in April 2020. Six months later, it shut down. What was the fatal root cause?',
    options: [
      {
        id: 'A',
        text: 'The video player suffered from frequent buffering errors and technical crashes.',
        isCorrect: false,
        critique: 'Quibi spent heavily on top-tier engineering; video playback was technically smooth.'
      },
      {
        id: 'B',
        text: 'Crippling product friction (banned screenshots/social sharing) and misjudged mobile consumer appetite against free UGC platforms like TikTok & YouTube.',
        isCorrect: true,
        critique: 'Correct. Users refused to pay $8/month for rigid 8-minute clips they couldn\'t share, meme, or cast to TV while TikTok and YouTube dominated their screen time.'
      },
      {
        id: 'C',
        text: 'Major studios refused to license their IP to the platform.',
        isCorrect: false,
        critique: 'Every major Hollywood studio (Disney, Warner, Sony, Paramount) had invested and produced original content.'
      },
      {
        id: 'D',
        text: 'Sudden patent infringement lawsuit from Netflix.',
        isCorrect: false,
        critique: 'There was an interactive patent dispute with Eko, but that was not why consumers abandoned the product.'
      }
    ],
    historicalLesson: 'Pedigree and capital cannot dictate consumer habits. Forcing artificial consumption formats without social distribution loops is fatal.',
    evidenceSource: 'The Information Quibi Autopsy & SensorTower Analytics',
    relatedStartupId: 'quibi'
  },
  {
    id: 'quiz-2',
    startup: 'Theranos',
    raised: '$945 Million',
    industry: 'HealthTech & Biotech',
    scenario: 'Promised 200+ comprehensive diagnostic blood tests from a single painless fingerprick using proprietary "Edison" machines. Valued at $9 Billion. What was the fundamental governance blind spot that allowed the deception to persist for over a decade?',
    options: [
      {
        id: 'A',
        text: 'The board was filled with celebrated military and political figures with zero biomedical, medical device, or clinical diagnostic expertise.',
        isCorrect: true,
        critique: 'Correct. Key board members like Henry Kissinger, George Shultz, and Gen. James Mattis lacked medical training and could not audit scientific claims.'
      },
      {
        id: 'B',
        text: 'They failed to raise enough venture capital to hire clinical researchers.',
        isCorrect: false,
        critique: 'Theranos raised nearly $1 Billion, far exceeding typical biotech series A/B rounds.'
      },
      {
        id: 'C',
        text: 'Walgreens canceled their distribution partnership within 3 months.',
        isCorrect: false,
        critique: 'Walgreens actually rolled out Theranos wellness centers in dozens of Arizona stores without verifying internal machine reliability.'
      },
      {
        id: 'D',
        text: 'Competitor Quest Diagnostics bought exclusive rights to the micro-fluidic patents.',
        isCorrect: false,
        critique: 'Quest had no involvement in Theranos patents.'
      }
    ],
    historicalLesson: 'In deeptech/biotech, independent peer review and domain-expert board oversight are existential safeguards. Secrecy in medicine is a lethal red flag.',
    evidenceSource: 'US District Court Trials & Bad Blood (John Carreyrou)',
    relatedStartupId: 'theranos'
  },
  {
    id: 'quiz-3',
    startup: 'Juicero',
    raised: '$120 Million',
    industry: 'Hardware & Robotics',
    scenario: 'Engineered a precision-machined $700 countertop cold-press juicer with 400 custom parts, 4 tons of pressure, and WiFi connectivity. Why did the business collapse 16 months after launch?',
    options: [
      {
        id: 'A',
        text: 'A viral video proved that users could squeeze the proprietary produce packs with their bare hands in seconds without the $400 machine.',
        isCorrect: true,
        critique: 'Correct. Bloomberg reporters showed that squeezing by hand was faster and cleaner, destroying the hardware value proposition instantly.'
      },
      {
        id: 'B',
        text: 'A supplier shortage of organic spinach halted production for 8 months.',
        isCorrect: false,
        critique: 'Juicero had steady produce farm suppliers; the issue was hardware redundancy.'
      },
      {
        id: 'C',
        text: 'The WiFi chip overheated and created fire hazards in consumer kitchens.',
        isCorrect: false,
        critique: 'The hardware was impeccably (over-)engineered with high safety tolerances.'
      },
      {
        id: 'D',
        text: 'Amazon launched a $50 competitor product on Prime Day.',
        isCorrect: false,
        critique: 'No tech giant entered the market; the premise itself was flawed.'
      }
    ],
    historicalLesson: 'Do not use multi-million dollar venture capital to over-engineer a machine to solve a problem that human hands solve for free.',
    evidenceSource: 'Bloomberg Tech Squeeze Test & Bolt Hardware Teardown',
    relatedStartupId: 'juicero'
  },
  {
    id: 'quiz-4',
    startup: 'Fast',
    raised: '$124.5 Million',
    industry: 'FinTech & Crypto',
    scenario: 'Raised $102M in Series B led by Stripe to build universal 1-click checkout. Sponsored NASCAR teams and hired 400+ employees. Closed down in 2022. What was the critical financial disconnect?',
    options: [
      {
        id: 'A',
        text: 'Stripe revoked their payment gateway license due to chargeback rates.',
        isCorrect: false,
        critique: 'Stripe was their largest investor and supportive partner.'
      },
      {
        id: 'B',
        text: 'Burning ~$10M per month while generating under $600K in total annual revenue ($50k/mo).',
        isCorrect: true,
        critique: 'Correct. The burn-to-revenue ratio was over 160:1. Merchants were reluctant to replace native Shopify/Apple Pay checkouts.'
      },
      {
        id: 'C',
        text: 'A critical database breach compromised 20 million credit cards.',
        isCorrect: false,
        critique: 'There was no major security breach; the problem was hyper-burn with near-zero organic revenue.'
      },
      {
        id: 'D',
        text: 'European regulators banned one-click checkout across the EU.',
        isCorrect: false,
        critique: 'No regulatory ban occurred.'
      }
    ],
    historicalLesson: 'Never scale headcount, sports sponsorships, and burn rate ahead of organic, repeatable merchant adoption.',
    evidenceSource: 'The Information Revenue Leaks (2022)',
    relatedStartupId: 'fast'
  },
  {
    id: 'quiz-5',
    startup: 'WeWork',
    raised: '$14 Billion',
    industry: 'Real Estate & PropTech',
    scenario: 'Valued at $47 Billion at its peak by SoftBank. Marketed as a revolutionary tech platform. What was the fatal financial structural flaw in its business model?',
    options: [
      {
        id: 'A',
        text: 'Extreme asset-liability duration mismatch: signing 10-15 year non-cancellable lease liabilities while members paid on flexible 30-day agreements.',
        isCorrect: true,
        critique: 'Correct. When economic tides turned or vacancies rose, billions in fixed rent obligations continued to accrue while revenues evaporated.'
      },
      {
        id: 'B',
        text: 'Coffee and kombucha theft exceeded total corporate revenues.',
        isCorrect: false,
        critique: 'Amenities were expensive, but long-term lease liabilities were the existential driver.'
      },
      {
        id: 'C',
        text: 'The trademark for the word "We" was successfully claimed by Nintendo.',
        isCorrect: false,
        critique: 'Adam Neumann actually sold the "We" trademark to the company for $5.9M (and later returned it after public outcry).'
      },
      {
        id: 'D',
        text: 'Commercial landlords refused to allow subleasing across New York City.',
        isCorrect: false,
        critique: 'Landlords eagerly signed long-term leases with WeWork during the expansion era.'
      }
    ],
    historicalLesson: 'Software venture multiples cannot change the laws of commercial real estate and duration mismatches.',
    evidenceSource: 'WeWork S-1 Filing (2019) & Bankruptcy Court Filings',
    relatedStartupId: 'wework'
  }
];
