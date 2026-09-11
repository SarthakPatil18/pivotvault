/**
 * PivotVault Founder Confessions Dataset
 * Candid, unfiltered post-mortems and raw learnings from founders across diverse failure modes.
 */

export const FOUNDER_CONFESSIONS = [
  {
    id: 'confession-1',
    founder: 'Sahil Lavingia',
    startup: 'Gumroad',
    role: 'Founder & CEO',
    industry: 'Creator Economy & Payments',
    capitalRaised: '$8.1 Million',
    year: '2015',
    title: 'Reflecting on Failing to Build a Billion-Dollar Company',
    avatar: 'SL',
    category: 'Venture Capital Expectations',
    summary: 'We raised $8M from Kleiner Perkins and top angels, grew headcount to 20, but growth plateaued. When we couldn\'t raise a Series B, I had to lay off 75% of the team and face my identity as a "failed" founder.',
    openingPrompt: 'I spent years equating my personal self-worth with Gumroad\'s valuation. When we missed unicorn velocity, I had to fire my closest friends. Ask me about layoffs, VC pressure, or downsizing to survive.',
    starterQuestions: [
      'What did it feel like laying off 75% of your team in one day?',
      'Why didn\'t Gumroad qualify for a $15M Series B?',
      'How did you separate your self-worth from startup valuation?',
      'What is the difference between a great business and a venture business?'
    ],
    answers: {
      'layoff': 'Laying off 75% of my team was the single most gut-wrenching day of my life. These were friends who took pay cuts, moved across the country, and trusted my vision. Walking into that room knowing I was taking away their livelihoods because I misjudged venture growth metrics made me feel physically sick. The hardest part is realizing nobody else is to blame—it was my strategic error in scaling expenses ahead of recurring revenue.',
      'series-b': 'In late 2015, we were growing at 20% year-over-year. For normal small businesses, that is healthy. But for tier-1 venture capital expecting a 100x return, 20% is dead. Every single VC passed on our Series B. VC math demands a 10x return every 3 years; if you can\'t demonstrate a path to $100M ARR, you are un-investable in Silicon Valley.',
      'worth': 'When you start a company at 19 and get profiled on TechCrunch, you drink your own Kool-Aid. You think your worth is your valuation. It took hitting rock bottom—working alone from my apartment for months after the layoffs—to realize that a startup is merely a legal and financial vehicle, not my human soul.',
      'venture': 'A company doing $3M in annual revenue with 70% margins and 5 people is a magnificent, life-changing lifestyle business. But as a VC investment with $10M in preferred liquidation preferences, it is considered a total write-off. Founders must decide early: do you want a durable, profitable company, or do you want to play unicorn roulette?',
      'default': 'The biggest confession is that survival required letting go of Silicon Valley prestige. By shrinking down to a skeleton crew and focusing exclusively on our core creators, Gumroad eventually became profitable and paid back our initial investors.'
    },
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
    role: 'Founder & CEO',
    industry: 'Hardware & Wearables',
    capitalRaised: '$43 Million',
    year: '2016',
    title: 'Why Pebble Failed: 3 Hard Truths About Hardware',
    avatar: 'EM',
    industry: 'Hardware',
    category: 'Hardware & Competition',
    summary: 'We defined the smartwatch category, raised $40M+, and sold 2 million watches. Yet we still ran out of money and had to sell assets to Fitbit for scrap.',
    openingPrompt: 'We pioneered smartwatches before Apple or Google entered the market. But inventory forecasting errors and platform lock-in destroyed our working capital. Ask me about hardware cash traps, fighting Apple, or inventory debt.',
    starterQuestions: [
      'Why did Pebble run out of cash despite selling 2 million watches?',
      'What was the fatal error in your 2015 holiday inventory forecast?',
      'Can any hardware startup survive against Apple or Google?',
      'What is your advice for hardware founders raising capital today?'
    ],
    answers: {
      'cash': 'People think selling 2 million devices means you are printing money. In consumer hardware, gross margins get crushed by tooling amortization, retailer concessions (Best Buy taking 30%), warranty reserves, and air freight costs. We sold $40M of hardware, but our net cash flow was negative because of continuous R&D burn.',
      'inventory': 'In 2015, we forecasted massive holiday demand for Pebble Time and manufactured hundreds of thousands of units. Demand fell short. Sitting on $15M worth of unsold inventory in Asian warehouses isn\'t just an accounting entry—it is cash you spent that you will never recover. Unsold physical goods are concrete blocks tied to your startup’s feet.',
      'apple': 'When Apple launched Apple Watch, they didn\'t just outspend us on billboards; they controlled the operating system. Over time, Apple throttled background Bluetooth synchronization, SMS notification reply APIs, and health data permissions for non-Apple devices. You cannot win a sustained war against the OS monopoly hosting your companion app.',
      'advice': 'If you are building consumer hardware: stay in a hyper-focused, defensible niche. We tried to be everything to everybody (general smartwatch) instead of dominating the rugged, 7-day battery, hackable hacker niche. The moment you enter the general consumer mass market, big tech will crush you.',
      'default': 'Hardware is unforgiving. Unlike software, you cannot push a midnight hotfix to a container ship full of smartwatches with battery defects.'
    },
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
    role: 'Founder & CEO',
    industry: 'E-Commerce & Fashion',
    capitalRaised: '$1.2 Million',
    year: '2014',
    title: 'My Startup Failed, and This Is What It Feels Like',
    avatar: 'ND',
    category: 'Unit Economics & Logistics',
    summary: 'Built an online fashion swapping platform with millions of transactions. We got into YC, moved to SF, and watched our unit economics disintegrate as shipping costs and co-founder disputes drained our runway.',
    openingPrompt: 'I dedicated my entire early 20s to building an infinite shared closet. We were YC darlings, but inverted shipping economics and technical co-founder disputes broke us. Ask me about unit economics, co-founder conflict, or shutting down.',
    starterQuestions: [
      'How did 99dresses unit economics break despite viral user growth?',
      'How did technical co-founder friction accelerate the collapse?',
      'What was the mental toll of shutting down your YC startup at 22?',
      'What warning signs should founders watch for in virtual currency models?'
    ],
    answers: {
      'economics': 'We had thousands of girls trading dresses using our in-app currency called "buttons". It felt like hyper-growth. But when we looked at physical logistics, users were spending $12 in shipping and returns on items worth $15. We were subsidizing transaction friction out of venture capital. Virality without positive contribution margins is just a faster furnace to burn cash.',
      'cofounder': 'Our technical co-founder and I had fundamentally mismatched expectations on equity, speed, and dedication. When the relationship fractured, our codebase rebuild halted for four crucial months in the middle of fundraising. Co-founder disputes are the silent cancer of early-stage startups.',
      'toll': 'When you shut down a startup in your early 20s, you feel like a public fraud. All your peers are raising Series A, getting TechCrunch features, and you are sitting in an empty apartment signing liquidation dissolution forms with creditors. The emotional grief took years to process.',
      'virtual': 'In-game or in-app currencies almost always experience hyper-inflation or hoarding unless you employ professional game economists. Users hoarded buttons, goods dried up, and liquidity stalled.',
      'default': 'The lesson: never confuse enthusiastic user activity with economic solvency. If each transaction loses $1.50, scaling 10x just accelerates your bankruptcy date.'
    },
    keyLessons: [
      'A viral product with negative unit economics is just a faster way to burn cash.',
      'Ensure technical founder alignment and vesting cliffs before scaling internationally.',
      'Virtual currency economies inevitably collapse without strict sinks and sources.'
    ],
    failureTag: 'Unit Economics Collapse'
  },
  {
    id: 'confession-4',
    founder: 'Justin Kan',
    startup: 'Atrium',
    role: 'Co-Founder & CEO',
    industry: 'LegalTech & Professional Services',
    capitalRaised: '$75.5 Million',
    year: '2020',
    title: 'Why My $75M LegalTech Startup Crashed: Misaligned Incentives',
    avatar: 'JK',
    category: 'Incentives & Business Model',
    summary: 'Twitch co-founder raised $75M from Andreessen Horowitz to revolutionize corporate law with software. Burned $75M in 3 years because lawyers and software engineers had opposite incentives.',
    openingPrompt: 'After selling Twitch for $970M, I raised $75M in weeks for Atrium. I thought software could easily automate legal services. I was dead wrong. Ask me about founder hubris, billing hour incentives, or burning $75M.',
    starterQuestions: [
      'Why did combining a law firm with a software startup fail?',
      'How did second-time founder hubris cloud your judgment?',
      'Why didn\'t top lawyers want software to make them more efficient?',
      'What would you tell successful founders starting their second venture?'
    ],
    answers: {
      'incentives': 'Lawyers bill by the hour. Their entire economic model is predicated on billable time. We hired 50 engineers to build software that automated legal drafting to save time. But the law firm partners looked at us and thought: "If this tool makes a 4-hour task take 30 minutes, I just lost 3.5 hours of billable revenue." The incentives were structurally opposed.',
      'hubris': 'Because I had co-founded Justin.tv and Twitch, investors threw $75M at me without asking hard unit-economics questions. I thought my entrepreneurial superpower could muscle through cultural and regulatory barriers in corporate law. Experience in consumer video streaming did not transfer to managing 100 enterprise corporate attorneys.',
      'culture': 'We tried to merge two alien cultures under one roof: Silicon Valley engineers who wear hoodies and want to move fast, and partner-track corporate attorneys who bill $800/hour and require perfection. The friction and attrition were catastrophic.',
      'second-time': 'Second-time founders often raise too much money too fast because VCs are eager to back them. That capital abundance prevents you from discovering true product-market fit through organic scarcity. Scarcity forces focus; capital excess breeds sloppy execution.',
      'default': 'Never attempt to automate an industry whose core participants have an economic incentive to remain inefficient.'
    },
    keyLessons: [
      'Structural incentive misalignment between service providers and software cannot be solved with capital.',
      'Second-time founder capital abundance often delays product-market fit discovery.',
      'Culture clash between licensed professionals and software engineers creates immense organizational drag.'
    ],
    failureTag: 'Incentive Misalignment'
  },
  {
    id: 'confession-5',
    founder: 'Austin Hein',
    startup: 'ScaleFactor Engineering Lead',
    role: 'Lead Engineer',
    industry: 'FinTech & B2B SaaS',
    capitalRaised: '$104 Million',
    year: '2020',
    title: 'The AI Was a Facade: Fabricating an Accounting Mirage',
    avatar: 'AH',
    category: 'Governance & Ethics',
    summary: 'Raised $100M+ promising automated AI accounting. Behind the scenes, dozens of manual bookkeepers in the Philippines and Austin were typing entries by hand to maintain the illusion.',
    openingPrompt: 'We sold small businesses on the magic of AI bookkeeping. But our machine learning models couldn\'t handle messy real-world bank statements, so leadership hired humans to do it secretly. Ask me about fake AI, sales pressure, or whistleblower ethics.',
    starterQuestions: [
      'Why was the AI replaced with offshore manual data entry?',
      'How did leadership hide the truth from investors like Bessemer?',
      'What happened when real small business customers received incorrect tax filings?',
      'What red flags should engineers look for in AI startups?'
    ],
    answers: {
      'fake-ai': 'Our marketing claimed proprietary neural networks categorized 90% of transactions automatically. In reality, the OCR model struggled with basic restaurant receipts and multi-line invoices. Instead of admitting the technology was immature, executives hired a 50-person back-office in the Philippines to manually reconcile QuickBooks files overnight.',
      'investors': 'During investor demos, engineering was instructed to preload specific sanitized company accounts that had been manually scrubbed and hardcoded. In venture capital, when ARR is growing 200% year-over-year, investors rarely look under the algorithmic hood.',
      'fallout': 'Real small business owners trusted us with their federal tax returns and payroll filings. When our offshore teams made data entry errors, customers received $50,000 IRS penalty notices. That\'s when the human cost of "fake it till you make it" becomes unforgivable.',
      'redflags': 'If a startup is scaling sales headcount 5x faster than engineering, and leadership refuses to publish automated accuracy benchmarks or error-rate telemetry, you are likely looking at a mechanical turk posing as AI.',
      'default': 'Faking software automation with hidden human labor is a ticking time bomb. The moment you scale, your gross margins collapse and your reputation is destroyed forever.'
    },
    keyLessons: [
      'A "fake it till you make it" prototype strategy is unacceptable when customer financial and legal liabilities are at stake.',
      'Sales quotas must never outpace true software automation maturity.',
      'Transparent engineering audits prevent systemic multi-million dollar fraud.'
    ],
    failureTag: 'Fraud & Governance Failure'
  },
  {
    id: 'confession-6',
    founder: 'Anonymous YC Alum',
    startup: 'Stealth Health Diagnostics',
    role: 'Co-Founder & CEO',
    industry: 'Digital Health & B2B',
    capitalRaised: '$3.5 Million',
    year: '2022',
    title: 'Burnout, Panic Attacks, and the Silence of the Shutdown',
    avatar: 'AY',
    category: 'Founder Psychology & Mental Health',
    summary: 'Raised $3.5M post-YC, worked 90-hour weeks for 3 years, developed severe panic disorder, and closed down when hospital pilot conversions took 18 months instead of 3.',
    openingPrompt: 'Silicon Valley celebrates hustle culture, but nobody talks about the physical panic attacks, hospital pilot delays, and the paralyzing guilt of losing investor money. Ask me about founder burnout, enterprise sales cycles, or moving on.',
    starterQuestions: [
      'What were the physical symptoms of extreme founder burnout?',
      'Why did hospital B2B enterprise sales cycles kill your runway?',
      'How did you communicate the shutdown to your angel investors?',
      'What advice would you give founders working 90-hour weeks right now?'
    ],
    answers: {
      'burnout': 'By Year 2, I was waking up at 3:00 AM every night drenched in sweat with heart palpitations. I thought I was having heart attacks; doctors told me they were severe panic attacks brought on by chronic cortisol spikes. I was terrified of letting down my team, my investors, and my family.',
      'enterprise': 'We budgeted for 6-month enterprise health system sales cycles. In reality, HIPAA compliance reviews, hospital IT security boards, and institutional budget committees took 18 to 24 months per deal. We burned through $2.5M before our first two enterprise pilots even completed validation.',
      'investors': 'Writing the final shutdown email to 15 angel investors was agonizing. I expected rage and lawsuits. In reality, most angels responded with kindness: "We know you gave it everything. Take care of your mental health." The monsters in our heads are almost always worse than reality.',
      'advice': 'Working 90-hour weeks does not make you a hero; it makes you sleep-deprived and prone to catastrophic strategic decisions. If your business model requires you to destroy your physical body to stay alive, your business model is broken.',
      'default': 'Your startup is something you do. It is not who you are. Prioritize your mental sanity and physical health, because if you break yourself, nothing you build matters.'
    },
    keyLessons: [
      'Enterprise sales cycles in healthcare and government are structural realities that cannot be shortened with founder hustle.',
      'Chronic sleep deprivation and burnout degrade cognitive decision-making when founders need clarity most.',
      'Investors respect honest, transparent wind-downs far more than delayed, defensive evasion.'
    ],
    failureTag: 'Burnout & Enterprise Sales Drag'
  }
];
