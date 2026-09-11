/**
 * PivotVault Founder Confessions Dataset
 * Candid, unfiltered post-mortems and raw learnings from founders across diverse failure modes.
 */

export const FOUNDER_CONFESSIONS = [
  {
    id: 'confession-1',
    founder: 'Sahil Lavingia',
    startup: 'Gumroad (Early Stage VC Failure & Pivot)',
    industry: 'Creator Economy & Payments',
    capitalRaised: '$8.1 Million',
    year: '2015',
    title: 'Reflecting on Failing to Build a Billion-Dollar Company',
    avatar: 'SL',
    category: 'Venture Capital Expectations',
    summary: 'We raised $7M Series A from premier VCs, grew headcount to 20, but growth plateaued. When we couldn\'t raise a Series B, I had to lay off 75% of the team and face my identity as a "failed" founder.',
    fullStory: `In 2011, I left Pinterest (as employee #2) to build Gumroad. Within months, we raised $8.1M from Kleiner Perkins, Max Levchin, Naval Ravikant, and others. I was 19.

The narrative was clear: build a venture-backed unicorn or fail trying. We scaled the team from 5 to 20. But our growth flattened to 20% year-over-year instead of 20% month-over-month. In late 2015, we tried to raise a $15M Series B. Every single investor passed.

I had to lay off nearly my entire team in one day. It was devastating. But what I realized in the aftermath was that a company generating $2M in annual profit is an incredible lifestyle business and a terrible VC investment. By shrinking down to a lean team, Gumroad survived, reached profitability, and eventually paid back investors.`,
    keyLessons: [
      'VC capital is fuel for hyper-growth; if you don\'t have venture-scale market dynamics, VC money turns into an existential trap.',
      'Profitable sustainability beats unicorn vanity metrics every day of the week.',
      'Your personal self-worth is not tied to your startup\'s last post-money valuation.'
    ],
    failureTag: 'Premature Scaling'
  },
  {
    id: 'confession-2',
    founder: 'Eric Migicovsky',
    startup: 'Pebble',
    industry: 'Hardware & Wearables',
    capitalRaised: '$43 Million',
    year: '2016',
    title: 'Why Pebble Failed: 3 Hard Truths About Hardware',
    avatar: 'EM',
    category: 'Hardware & Competition',
    summary: 'We defined the smartwatch category, raised $40M+, and sold 2 million watches. Yet we still ran out of money and had to sell assets to Fitbit for scrap.',
    fullStory: `Pebble was born out of love for hackable, useful hardware. When we raised $10M on Kickstarter, the demand was real. But we made critical mistakes as we tried to scale:

First, we doubled down on positioning Pebble as a general smartwatch against Apple Watch instead of doubling down on our core differentiator: a rugged, 7-day battery, hackable fitness companion. Second, we forecast huge 2015 holiday sales and manufactured a million units, only to watch inventory sit in warehouses. That inventory overhang sucked all our working capital.

Third, when Apple launched WatchOS, they began deprecating the background Bluetooth and notification APIs that Pebble relied on. You cannot win a war against the operating system vendor that hosts your companion app.`,
    keyLessons: [
      'Never engage in a feature war with platform monopolies like Apple and Google.',
      'Inventory forecasting errors kill hardware companies faster than engineering bugs.',
      'Double down on your core niche instead of trying to be everything to mainstream mass consumers.'
    ],
    failureTag: 'Outcompeted by Incumbents'
  },
  {
    id: 'confession-3',
    founder: 'Nikki Durkin',
    startup: '99dresses',
    industry: 'E-Commerce & Fashion',
    capitalRaised: '$1.2 Million',
    year: '2014',
    title: 'My Startup Failed, and This Is What It Feels Like',
    avatar: 'ND',
    category: 'Unit Economics & Logistics',
    summary: 'Built an online fashion swapping platform with millions of virtual currency transactions. We got into Y Combinator, moved to San Francisco, and then watched our unit economics disintegrate.',
    fullStory: `At 18, I launched 99dresses from my bedroom in Australia. It was an infinite shared closet where women traded clothes using an in-app currency called 'buttons'. It exploded virally.

We moved to Silicon Valley and joined Y Combinator. But as we scaled physical logistics across the US, shipping costs and fraud ballooned. Users were spending $10 to ship a $15 dress. The unit economics were inverted.

Worse, when technical co-founder disputes paralyzed our codebase rebuild, we burned through our seed round before proving positive contribution margins. Handing over the keys to creditors after dedicating your entire early 20s to a vision is an excruciating grief.`,
    keyLessons: [
      'A viral product with negative unit economics is just a faster way to burn cash.',
      'Ensure technical founder alignment before moving across the world to scale.',
      'Virtual currency economies inevitably collapse without strict sinks and sources.'
    ],
    failureTag: 'Unit Economics Collapse'
  },
  {
    id: 'confession-4',
    founder: 'Austin Hein',
    startup: 'ScaleFactor Customer & Lead Engineer',
    industry: 'FinTech & B2B SaaS',
    capitalRaised: '$104 Million',
    year: '2020',
    title: 'The AI Was a Facade: Behind the Scenes of a Fabricated Tech Mirage',
    avatar: 'AH',
    category: 'Governance & Integrity',
    summary: 'We promised customers algorithmic AI accounting. Behind the curtain, dozens of offshore bookkeepers were manually doing data entry in panic mode.',
    fullStory: `The pitch was irresistible: replace expensive human CPAs with machine learning that automatically categorizes bookkeeping and prepares balance sheets. Investors poured $100M into the vision.

Inside engineering, the truth was known early: the OCR and ML models were nowhere near production accuracy. Instead of slowing down sales, leadership doubled sales quotas and hired a massive team of manual accountants in the Philippines and Austin to do the work by hand under the guise of "AI tuning".

The data was constantly out of sync, customer tax returns were filed incorrectly, and the house of cards collapsed as soon as journalists started checking with actual customers.`,
    keyLessons: [
      'A "fake it till you make it" prototype strategy is unacceptable when customer financial and legal liabilities are at stake.',
      'Sales quotas must never outpace true software automation maturity.',
      'Transparent engineering audits prevent systemic multi-million dollar fraud.'
    ],
    failureTag: 'Fraud & Governance Failure'
  }
];
