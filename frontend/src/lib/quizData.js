// Quiz Question Bank
export const quizQuestions = [
  // CATEGORY 1: Startup Failure Patterns
  {
    category: "Startup Failure Patterns",
    difficulty: "Easy",
    xp: 10,
    question: "Why did Webvan fail?",
    summary: "A famous dot-com bubble grocery delivery failure.",
    options: ["Logistics costs", "Marketing", "Hiring", "Branding"],
    answer: "Logistics costs",
    explanation: "Webvan burned through over $800M due to unsustainable logistics costs.",
    slug: "webvan"
  },
  {
    category: "Startup Failure Patterns",
    difficulty: "Easy",
    xp: 10,
    question: "What was Juicero's biggest mistake?",
    summary: "A $400 Wi-Fi juicer for pre-packaged bags.",
    options: ["Poor unit economics", "Bad marketing", "Legal issues", "Team conflict"],
    answer: "Poor unit economics",
    explanation: "Users realized they could squeeze the bags by hand, making the expensive device unnecessary.",
    slug: "juicero"
  },
  {
    category: "Startup Failure Patterns",
    difficulty: "Medium",
    xp: 20,
    question: "Which company's downfall involved fraud about blood testing technology?",
    summary: "One of the most infamous startup fraud cases.",
    options: ["Theranos", "Juicero", "WeWork", "Quibi"],
    answer: "Theranos",
    explanation: "Theranos claimed to revolutionize blood testing but falsified results.",
    slug: "theranos"
  },
  {
    category: "Startup Failure Patterns",
    difficulty: "Easy",
    xp: 10,
    question: "Why did Quibi fail despite $1.75B in funding?",
    summary: "Short-form video platform that died in 6 months.",
    options: ["No product-market fit", "Technical bugs", "Bad branding", "Legal issues"],
    answer: "No product-market fit",
    explanation: "Quibi launched during COVID when its target market (commuters) wasn't commuting.",
    slug: "quibi"
  },
  {
    category: "Startup Failure Patterns",
    difficulty: "Medium",
    xp: 20,
    question: "What was a major issue with WeWork?",
    summary: "Co-working giant that collapsed before IPO.",
    options: ["Questionable governance", "No customers", "Bad technology", "No funding"],
    answer: "Questionable governance",
    explanation: "WeWork had serious leadership issues and self-dealing by founder Adam Neumann.",
    slug: "wework"
  },
  {
    category: "Startup Failure Patterns",
    difficulty: "Hard",
    xp: 30,
    question: "What killed Pets.com?",
    summary: "Iconic dot-com bubble pet supplies failure.",
    options: ["Unsustainable customer acquisition costs", "No inventory", "Bad website", "Legal issues"],
    answer: "Unsustainable customer acquisition costs",
    explanation: "Pets.com spent millions on Super Bowl ads but lost money on every sale.",
    slug: "petscom"
  },
  {
    category: "Startup Failure Patterns",
    difficulty: "Easy",
    xp: 10,
    question: "What does 'burn rate' measure?",
    summary: "Key startup survival metric.",
    options: ["Monthly cash spent", "Revenue growth", "User churn", "Customer satisfaction"],
    answer: "Monthly cash spent",
    explanation: "Burn rate is how much cash a startup loses each month.",
    slug: "metrics"
  },
  {
    category: "Startup Failure Patterns",
    difficulty: "Medium",
    xp: 20,
    question: "Which of these is a common startup failure reason?",
    summary: "Most startups fail.",
    options: ["No product-market fit", "Too much funding", "Too many users", "Great product"],
    answer: "No product-market fit",
    explanation: "PMF is the number one reason startups succeed or fail.",
    slug: "pmf"
  },

  // CATEGORY 2: Product-Market Fit
  {
    category: "Product-Market Fit",
    difficulty: "Easy",
    xp: 10,
    question: "Which metric best indicates PMF?",
    summary: "The holy grail of startups.",
    options: ["Office size", "Repeat customer usage", "Number of employees", "Founder age"],
    answer: "Repeat customer usage",
    explanation: "If users keep coming back and paying, you might have PMF.",
    slug: "pmf"
  },
  {
    category: "Product-Market Fit",
    difficulty: "Medium",
    xp: 20,
    question: "What is 'the treadmill of no'?",
    summary: "Common PMF challenge.",
    options: ["Getting constant 'no's from customers", "Running on a literal treadmill", "Burnout", "Too many features"],
    answer: "Getting constant 'no's from customers",
    explanation: "If every customer says 'no', you need to pivot or iterate.",
    slug: "pmf"
  },
  {
    category: "Product-Market Fit",
    difficulty: "Easy",
    xp: 10,
    question: "Who is credited with the term 'product-market fit'?",
    summary: "Famous venture capitalist.",
    options: ["Marc Andreessen", "Peter Thiel", "Paul Graham", "Steve Jobs"],
    answer: "Marc Andreessen",
    explanation: "Marc Andreessen coined the term in a famous 2011 blog post.",
    slug: "founders"
  },
  {
    category: "Product-Market Fit",
    difficulty: "Medium",
    xp: 20,
    question: "What's a good PMF indicator?",
    summary: "Signs you're onto something.",
    options: ["Users spontaneously recommending your product", "Lots of signups", "Good press", "Nice logo"],
    answer: "Users spontaneously recommending your product",
    explanation: "Word-of-mouth is one of the strongest PMF signals.",
    slug: "pmf"
  },
  {
    category: "Product-Market Fit",
    difficulty: "Hard",
    xp: 30,
    question: "What is 'the 40% rule' for PMF?",
    summary: "Famous PMF metric from Superhuman.",
    options: ["40% of users would be very disappointed if your product went away", "40% revenue growth", "40% churn", "40% profit margin"],
    answer: "40% of users would be very disappointed if your product went away",
    explanation: "Superhuman popularized this survey question as a PMF metric.",
    slug: "pmf"
  },

  // CATEGORY 3: Fundraising
  {
    category: "Fundraising",
    difficulty: "Easy",
    xp: 10,
    question: "What is a startup runway?",
    summary: "How long you can survive.",
    options: ["Revenue", "Team size", "Months before cash runs out", "Valuation"],
    answer: "Months before cash runs out",
    explanation: "Runway = current cash / monthly burn rate.",
    slug: "fundraising"
  },
  {
    category: "Fundraising",
    difficulty: "Easy",
    xp: 10,
    question: "What is a seed round?",
    summary: "Typically first institutional capital.",
    options: ["First major funding round", "Final funding before exit", "Debt financing", "Government grant"],
    answer: "First major funding round",
    explanation: "Seed round is usually for product development and initial market fit.",
    slug: "fundraising"
  },
  {
    category: "Fundraising",
    difficulty: "Medium",
    xp: 20,
    question: "What is dilution?",
    summary: "Every founder needs to understand this.",
    options: ["When your ownership percentage decreases", "Company losing money", "Watering down a drink", "Employee churn"],
    answer: "When your ownership percentage decreases",
    explanation: "Dilution happens when new shares are issued in funding rounds.",
    slug: "vc"
  },
  {
    category: "Fundraising",
    difficulty: "Medium",
    xp: 20,
    question: "What is a cap table?",
    summary: "Tracks ownership.",
    options: ["Table showing all company shareholders", "Table of top customers", "Table of employees", "Table of product features"],
    answer: "Table showing all company shareholders",
    explanation: "Cap tables track who owns what percentage of the company.",
    slug: "vc"
  },
  {
    category: "Fundraising",
    difficulty: "Hard",
    xp: 30,
    question: "What is a 'down round'?",
    summary: "Bad news for founders.",
    options: ["Raising money at a lower valuation than before", "Company going downhill", "Employee firing round", "Marketing budget reduction"],
    answer: "Raising money at a lower valuation than before",
    explanation: "Down rounds are painful because they dilute shareholders heavily.",
    slug: "vc"
  },

  // CATEGORY 4: Unit Economics
  {
    category: "Unit Economics",
    difficulty: "Easy",
    xp: 10,
    question: "What does CAC stand for?",
    summary: "Critical metric.",
    options: ["Customer Acquisition Cost", "Capital Allocation Cycle", "Customer Activity Curve", "Company Asset Capital"],
    answer: "Customer Acquisition Cost",
    explanation: "CAC is how much it costs to acquire a new customer.",
    slug: "metrics"
  },
  {
    category: "Unit Economics",
    difficulty: "Easy",
    xp: 10,
    question: "What does LTV stand for?",
    summary: "Critical metric paired with CAC.",
    options: ["Lifetime Value", "Long Term Vision", "Low Traffic Volume", "Local Team Value"],
    answer: "Lifetime Value",
    explanation: "LTV is the total revenue you expect from one customer.",
    slug: "metrics"
  },
  {
    category: "Unit Economics",
    difficulty: "Medium",
    xp: 20,
    question: "What LTV:CAC ratio is generally considered healthy?",
    summary: "Rule of thumb.",
    options: ["3:1 or higher", "1:1", "10:1", "0.5:1"],
    answer: "3:1 or higher",
    explanation: "You want to make at least 3x what you spend acquiring customers.",
    slug: "metrics"
  },
  {
    category: "Unit Economics",
    difficulty: "Medium",
    xp: 20,
    question: "What is gross margin?",
    summary: "Revenue minus cost of goods sold.",
    options: ["Revenue minus COGS", "Total profit", "Revenue only", "Burn rate"],
    answer: "Revenue minus COGS",
    explanation: "Gross margin shows profitability on individual sales before overhead.",
    slug: "metrics"
  },

  // CATEGORY 5: Growth
  {
    category: "Growth",
    difficulty: "Easy",
    xp: 10,
    question: "Which growth strategy is usually most sustainable?",
    summary: "Growth that lasts.",
    options: ["Viral loops", "Paid acquisition only", "Discounts forever", "Hiring more salespeople"],
    answer: "Viral loops",
    explanation: "Product-led growth and viral loops scale well without infinite spend.",
    slug: "growth"
  },
  {
    category: "Growth",
    difficulty: "Medium",
    xp: 20,
    question: "What is 'churn'?",
    summary: "Opposite of retention.",
    options: ["Customers leaving your product", "Revenue growth", "New customers", "Employee turnover"],
    answer: "Customers leaving your product",
    explanation: "High churn kills growth faster than almost anything.",
    slug: "metrics"
  },
  {
    category: "Growth",
    difficulty: "Hard",
    xp: 30,
    question: "What does ARR stand for?",
    summary: "SaaS revenue metric.",
    options: ["Annual Recurring Revenue", "Average Revenue Ratio", "Annual Revenue Rate", "Average Run Rate"],
    answer: "Annual Recurring Revenue",
    explanation: "ARR is standard for measuring SaaS businesses.",
    slug: "metrics"
  },

  // CATEGORY 6: Famous Founders
  {
    category: "Famous Founders",
    difficulty: "Easy",
    xp: 10,
    question: "Who co-founded Apple?",
    summary: "Iconic founder.",
    options: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Larry Page"],
    answer: "Steve Jobs",
    explanation: "Steve Jobs and Steve Wozniak co-founded Apple in a garage.",
    slug: "founders"
  },
  { name: "Famous Founders", difficulty: "Medium", xp: 20, question: "Who founded Amazon?", summary: "Everything store founder.", options: ["Jeff Bezos", "Elon Musk", "Bill Gates", "Larry Ellison"], answer: "Jeff Bezos", explanation: "Jeff Bezos founded Amazon in Seattle in 1994.", slug: "founders" },
  { category: "Famous Founders", difficulty: "Easy", xp: 10, question: "Who founded Airbnb?", summary: "Air mattress to billion dollar business.", options: ["Brian Chesky", "Mark Zuckerberg", "Steve Jobs", "Jack Dorsey"], answer: "Brian Chesky", explanation: "Brian Chesky, Joe Gebbia, and Nathan Blecharczyk founded Airbnb.", slug: "founders" },
  { category: "Famous Founders", difficulty: "Medium", xp: 20, question: "Who founded PayPal?", summary: "PayPal mafia leader.", options: ["Elon Musk", "Peter Thiel", "Both of these", "Neither"], answer: "Both of these", explanation: "Peter Thiel was first CEO; Elon Musk's X.com merged with PayPal.", slug: "founders" },

  // CATEGORY 7: Startup History
  { category: "Startup History", difficulty: "Easy", xp: 10, question: "What was Airbnb's original idea?", summary: "From humble beginnings.", options: ["Air mattresses for conference attendees", "Luxury hotels", "Car sharing", "Food delivery"], answer: "Air mattresses for conference attendees", explanation: "Airbnb started with three air mattresses in a living room.", slug: "history" },
  { category: "Startup History", difficulty: "Easy", xp: 10, question: "What was Amazon's original product?", summary: "Not everything at first.", options: ["Books", "Electronics", "Cloud services", "Grocery"], answer: "Books", explanation: "Amazon started as an online bookstore in 1994.", slug: "history" },

  // CATEGORY 8: Startup Metrics
  { category: "Startup Metrics", difficulty: "Easy", xp: 10, question: "What is MRR?", summary: "Monthly SaaS metric.", options: ["Monthly Recurring Revenue", "Maximum Revenue Rate", "Mean Return Ratio", "Monthly Retail Revenue"], answer: "Monthly Recurring Revenue", explanation: "MRR is standard for measuring subscription businesses.", slug: "metrics" },
  { category: "Startup Metrics", difficulty: "Medium", xp: 20, question: "What is 'churn rate'?", summary: "Critical for subscription businesses.", options: ["Percentage of customers who stop using your product each month", "Revenue growth", "New customers", "Employee turnover"], answer: "Percentage of customers who stop using your product each month", explanation: "SaaS businesses live or die by their churn rate.", slug: "metrics" },

  // CATEGORY 9: Founder Psychology
  { category: "Founder Psychology", difficulty: "Easy", xp: 10, question: "What is founder-market fit?", summary: "Founder-background fit.", options: ["Founder's experience matching the market they're in", "How much money a founder makes", "Founder's office location", "Founder's age"], answer: "Founder's experience matching the market they're in", explanation: "Founders with domain expertise in their market often have an edge.", slug: "psychology" },
  { category: "Founder Psychology", difficulty: "Medium", xp: 20, question: "What is survivorship bias?", summary: "Common logical fallacy.", options: ["Only studying successes, not failures", "Surviving a startup", "Living long enough to retire", "Keeping a company alive"], answer: "Only studying successes, not failures", explanation: "Don't just copy what successful founders did—learn from failures too.", slug: "psychology" },
  { category: "Founder Psychology", difficulty: "Easy", xp: 10, question: "What is confirmation bias?", summary: "We see what we want to see.", options: ["Seeking out information that confirms existing beliefs", "Being confirmed in your role", "Confirming customer orders", "Confirming funding"], answer: "Seeking out information that confirms existing beliefs", explanation: "Founders need to constantly fight confirmation bias.", slug: "psychology" },

  // CATEGORY 10: VC Knowledge
  { category: "VC Knowledge", difficulty: "Easy", xp: 10, question: "What is a term sheet?", summary: "First step after funding handshake.", options: ["Document outlining investment terms", "Loan agreement", "Employment contract", "Marketing plan"], answer: "Document outlining investment terms", explanation: "Term sheets spell out valuation, dilution, governance, etc.", slug: "vc" },

  // CATEGORY 11: Pivot Decisions
  { category: "Pivot Decisions", difficulty: "Medium", xp: 20, question: "What did Instagram pivot from?", summary: "Before it was Instagram.", options: ["Burbn - a check-in app", "A dating app", "A music app", "A gaming app"], answer: "Burbn - a check-in app", explanation: "Kevin Systrom pivoted from the cluttered Burbn to the focused Instagram.", slug: "pivots" },

  // CATEGORY 12: Startup Red Flags
  { category: "Startup Red Flags", difficulty: "Easy", xp: 10, question: "Which is a major startup red flag?", summary: "Signs to watch for.", options: ["Unsustainable burn rate", "Great office space", "Happy employees", "Big office"], answer: "Unsustainable burn rate", explanation: "If your burn rate is too high, you'll run out of money quickly.", slug: "redflags" },

  // CATEGORY 13: Risk Scanner Knowledge
  { category: "Risk Scanner Knowledge", difficulty: "Easy", xp: 10, question: "What is a high risk score in PivotVault Risk Scanner?", summary: "Built-in feature.", options: ["Above 70", "Below 30", "Exactly 50", "Risk score doesn't matter"], answer: "Above 70", explanation: "Higher risk scores indicate higher failure probability.", slug: "riskscanner" },

  // CATEGORY 14: Competitive Strategy
  { category: "Competitive Strategy", difficulty: "Medium", xp: 20, question: "What is a 'moat' in business?", summary: "Warren Buffett concept.", options: ["Sustainable competitive advantage", "Water around a castle", "High revenue", "Many employees"], answer: "Sustainable competitive advantage", explanation: "Moats protect your business from competition.", slug: "strategy" },

  // CATEGORY 15: AI Startup Knowledge
  { category: "AI Startup Knowledge", difficulty: "Easy", xp: 10, question: "What does LLM stand for?", summary: "Core of modern AI.", options: ["Large Language Model", "Long Life Machine", "Low Latency Memory", "Local Learning Module"], answer: "Large Language Model", explanation: "LLMs like GPT power most modern AI products.", slug: "ai" }
];

// Helper to shuffle an array
export const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Get random questions
export const getRandomQuestions = (count = 5, difficulty = "mixed") => {
  let pool = [...quizQuestions];
  if (difficulty !== "mixed") {
    pool = pool.filter(q => q.difficulty === difficulty);
  }
  const shuffled = shuffleArray(pool);
  return shuffled.slice(0, count);
};

// Founder ranks
export const founderRanks = [
  { rank: "Founder Intern", minXP: 0, maxXP: 100 },
  { rank: "Startup Builder", minXP: 100, maxXP: 300 },
  { rank: "Growth Hacker", minXP: 300, maxXP: 600 },
  { rank: "Product Wizard", minXP: 600, maxXP: 1000 },
  { rank: "Venture Architect", minXP: 1000, maxXP: 1500 },
  { rank: "Unicorn Founder", minXP: 1500, maxXP: Infinity }
];

// Get rank from XP
export const getFounderRank = (xp) => {
  return founderRanks.find(r => xp >= r.minXP && xp < r.maxXP) || founderRanks[founderRanks.length - 1];
};
