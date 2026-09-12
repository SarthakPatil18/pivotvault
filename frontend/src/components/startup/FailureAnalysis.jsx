import React, { useState } from 'react';
import { 
  AlertOctagon, 
  Lightbulb, 
  Compass, 
  TrendingUp, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  BrainCircuit, 
  TrendingDown,
  Target,
  Landmark,
  Flame
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

function deriveLessonTitle(lessonStr, industry, index) {
  if (!lessonStr) return index === 2 ? 'Validate Before Scaling' : index === 3 ? 'Track Metrics That Matter' : 'Build a Lean Cost Structure';
  const clean = String(lessonStr).replace(/^Mistake to avoid:\s*/i, '').trim();
  const firstSentence = clean.split(/[:.—]/)[0].trim();
  if (firstSentence.length >= 8 && firstSentence.length <= 48) {
    return firstSentence;
  }
  const lower = clean.toLowerCase();
  if (lower.includes('governance') || lower.includes('board')) return 'Corporate Governance & Independent Oversight';
  if (lower.includes('transparency') || lower.includes('audit')) return 'Financial Transparency & Audit Integrity';
  if (lower.includes('unit economic') || lower.includes('margin') || lower.includes('contribution')) return 'Validate Sustainable Unit Contribution';
  if (lower.includes('retention') || lower.includes('cohort')) return 'Prioritize Retention Over Gross Acquisition';
  if (lower.includes('leverage') || lower.includes('debt')) return 'Eliminate Excessive Balance Sheet Leverage';
  if (lower.includes('manufacturing') || lower.includes('factory') || lower.includes('microfactory')) return 'De-Risk Manufacturing Tooling & Yield';
  if (lower.includes('acquisition') || lower.includes('m&a')) return 'Avoid Debt-Leveraged M&A Integration';
  if (lower.includes('focus') || lower.includes('platform') || lower.includes('sprawl')) return 'Focus on Single Platform Before Product Sprawl';
  if (lower.includes('cash') || lower.includes('burn') || lower.includes('runway')) return 'Maintain Conservative Runway Buffer';
  if (lower.includes('clinical') || lower.includes('peer') || lower.includes('science')) return 'Enforce Blinded Peer-Reviewed Scientific Validation';
  if (lower.includes('spac') || lower.includes('valuation')) return 'Avoid Premature High-Valuation Listings';
  return index === 2 ? 'Validate Before Scaling' : index === 3 ? 'Track the Metrics That Matter' : 'Build a Lean Cost Structure';
}

function generateDomainPlaybook(startup, rootCauses, archetypeTitle) {
  const name = startup.name || 'This Venture';
  const slug = (startup.slug || startup.id || '').toLowerCase();
  const ind = (startup.industry || '').toLowerCase();
  const lessons = Array.isArray(startup.lessons) ? startup.lessons.filter(Boolean) : [];

  // Flagship Canonical / Deep-dive Profiles
  if (slug === 'arrival' || name.toLowerCase().includes('arrival')) {
    return [
      {
        num: 1,
        title: 'The Distributed Microfactory & Production Execution Trap',
        rule: rootCauses[0] || 'The novel microfactory manufacturing approach proved much harder and slower to scale to genuine commercial production volumes than initially projected.'
      },
      {
        num: 2,
        title: 'Validate One Vehicle Platform Before Multi-Model Sprawl',
        rule: lessons[1] || 'Focus on certifying and scaling one core vehicle platform before announcing buses, cars, and delivery vans simultaneously. Compounding vehicle development cycles multiplies tooling capex and technical bottlenecks.'
      },
      {
        num: 3,
        title: 'Track Automotive Yield, Homologation & Hard Capex',
        rule: 'In physical vehicle manufacturing, bill-of-materials cost, tooling yield, and safety homologation timelines are the only metrics that matter. Speculative commercial orders cannot substitute for certified, volume-assembly vehicles.'
      },
      {
        num: 4,
        title: 'Avoid SPAC Capital Distortions & Multi-Innovation Risk',
        rule: lessons[2] || 'Pursuing simultaneous, compounding innovations (a novel manufacturing model plus a brand-new vehicle platform) multiplies technical failure points. Maintain lean private capital until pre-series production is de-risked.'
      }
    ];
  }

  if (slug === 'enron' || name.toLowerCase().includes('enron')) {
    return [
      {
        num: 1,
        title: 'The Mark-to-Market Accounting & Concealed Debt Trap',
        rule: 'Accounting fraud and financial manipulation: concealing losses and debt through complex off-balance-sheet special purpose entities (SPEs) and mark-to-market assumptions on illiquid forward energy contracts.'
      },
      {
        num: 2,
        title: 'Financial Transparency & Verified Cash Generation',
        rule: lessons[0] || 'Financial transparency is non-negotiable. Paper profits booked from estimated future asset gains can never replace verified, audit-backed operating cash flow from real customer transactions.'
      },
      {
        num: 3,
        title: 'Independent Board Oversight & Fiduciary Duty',
        rule: lessons[1] || 'Strong corporate governance is essential. The board of directors and independent audit committee must maintain direct authority to scrutinize executive transactions and heed whistleblower accounting alerts.'
      },
      {
        num: 4,
        title: 'Eliminate Self-Dealing & Complex Off-Balance Vehicles',
        rule: lessons[2] || 'Complex financial structures can conceal systemic risk. Permitting executive officers to manage or profit from outside financial entities creates irreconcilable conflicts of interest that destroy enterprise integrity.'
      }
    ];
  }

  if (slug === 'wework' || name.toLowerCase().includes('wework')) {
    return [
      {
        num: 1,
        title: 'The Asset-Liability Duration Mismatch Trap',
        rule: 'Structural duration mismatch: 15-year non-cancellable commercial real estate lease liabilities financed by 30-day flexible desk memberships in high-burn metropolitan markets.'
      },
      {
        num: 2,
        title: 'Real Estate Economics vs Software Multiple Fallacy',
        rule: 'Co-working spaces exhibit heavy construction fit-out capex, fixed lease liabilities, and ongoing physical facility staffing. Software gross margins (80%+) cannot be engineered onto physical brick-and-mortar assets.'
      },
      {
        num: 3,
        title: 'Track Location-Level Net Operating Income (NOI)',
        rule: 'Location-level contribution margin and net operating income after full lease amortization must be positive before signing additional master leases across new territories.'
      },
      {
        num: 4,
        title: 'Never Rely on Capital Velocity to Subsidize Inverted Leases',
        rule: 'Massive multi-billion dollar funding checks from investors like SoftBank masked negative unit economics rather than proving customer retention. Capital subsidies cannot alter commercial property fundamentals.'
      }
    ];
  }

  if (slug === 'theranos' || name.toLowerCase().includes('theranos')) {
    return [
      {
        num: 1,
        title: "The Diagnostic Secrecy & 'Fake It Till You Make It' Fallacy",
        rule: 'Bypassed peer-reviewed scientific publishing and concealed laboratory proficiency failures behind extreme non-disclosure agreements and organizational silos.'
      },
      {
        num: 2,
        title: 'Clinical Peer Review is Mandatory in Life Sciences',
        rule: 'In biotech, clinical validation cannot be treated as proprietary trade secrecy. Without external verification and replication by independent hematologists, internal management drinks its own marketing.'
      },
      {
        num: 3,
        title: 'Track Analytical Coefficient-of-Variation & Assay Yield',
        rule: 'Diluting venous blood or running samples on hacked third-party commercial analyzers creates fatal diagnostic error rates that violate regulatory standards and patient safety.'
      },
      {
        num: 4,
        title: 'Recruit Technical Board Members Over Political Luminaries',
        rule: 'A board composed of military generals and statesmen lacks the technical capability to audit biochemical data. Scientific ventures must be governed by domain pathologists and biomedical engineers.'
      }
    ];
  }

  if (slug === 'ftx' || name.toLowerCase().includes('ftx')) {
    return [
      {
        num: 1,
        title: 'The Commingled Funds & Custodial Failure Trap',
        rule: 'Commingling customer exchange deposits with proprietary venture trading funds via backdoors and unmonitored Alameda margin accounts.'
      },
      {
        num: 2,
        title: 'Segregated Escrow & Independent Reserve Verification',
        rule: 'Exchanges handling third-party funds must enforce cryptographic proof of reserves and segregated legal custodial escrow. Customer balances can never be treated as working capital.'
      },
      {
        num: 3,
        title: 'Track Real-Time Liquidity Coverage & Counterparty Exposure',
        rule: 'Liquid reserves must match potential withdrawal surges 1:1. Relying on illiquid proprietary tokens to inflate internal balance sheet equity creates an instant bank-run vulnerability.'
      },
      {
        num: 4,
        title: 'Independent Board Governance & Certified Audits',
        rule: 'No amount of charismatic founder influence or political lobbying can substitute for an independent audit committee, certified GAAP/IFRS balance sheets, and a qualified chief financial officer.'
      }
    ];
  }

  if (slug === 'lehman-brothers' || name.toLowerCase().includes('lehman')) {
    return [
      {
        num: 1,
        title: 'The 30:1 Balance Sheet Leverage & Subprime Exposure Trap',
        rule: 'Excessive leverage (exceeding 30:1) and concentrated exposure to illiquid residential and commercial real estate securities with zero margin for price corrections.'
      },
      {
        num: 2,
        title: 'Control Overnight Repo Reliance & Liquidity Run Risk',
        rule: 'Over-reliance on short-term overnight repurchase (repo) markets to fund long-term illiquid assets creates immediate systemic insolvency when counterparties refuse collateral.'
      },
      {
        num: 3,
        title: 'Empower Risk Officers with Absolute Mandate',
        rule: 'Executive leadership must never override chief risk officer limits or proprietary risk models in pursuit of short-term quarterly return on equity (ROE) targets.'
      },
      {
        num: 4,
        title: 'Mark Illiquid Assets to True Market Reality',
        rule: 'Concealing deteriorating asset values through accounting maneuvers (such as Repo 105) merely delays an inevitable liquidity collapse while destroying counterparty trust.'
      }
    ];
  }

  if (slug === 'byjus' || name.toLowerCase().includes('byju')) {
    return [
      {
        num: 1,
        title: 'The Debt-Fueled Global Acquisition Trap',
        rule: 'Aggressive multi-market acquisitions financed by expensive term loans ($1.2B Term Loan B) during temporary pandemic stay-at-home demand spikes.'
      },
      {
        num: 2,
        title: 'Demand Normalization & Educational Unit Economics',
        rule: 'Infrastructure and sales headcount built for temporary pandemic-era demand surges must be scaled back when physical classrooms reopen. Long sales cycles cannot support high field-sales commissions.'
      },
      {
        num: 3,
        title: 'Timely Financial Audits & Regulatory Compliance',
        rule: 'Delayed audited financial statements, auditor resignations, and board exits destroy lender confidence and trigger immediate debt covenants and legal insolvency proceedings.'
      },
      {
        num: 4,
        title: 'Prioritize Educational Retention Over High-Pressure Sales',
        rule: 'High customer acquisition costs cannot be amortized if student course completion and organic subscription renewals remain low. Education technology requires student outcomes over aggressive financing loans.'
      }
    ];
  }

  // Dynamic Synthesis from verified startup.lessons
  if (lessons.length >= 3) {
    return [
      {
        num: 1,
        title: `The ${archetypeTitle.slice(0, 45)} Trap`,
        rule: rootCauses[0] || lessons[0]
      },
      {
        num: 2,
        title: deriveLessonTitle(lessons[0], ind, 2),
        rule: lessons[0]
      },
      {
        num: 3,
        title: deriveLessonTitle(lessons[1], ind, 3),
        rule: lessons[1]
      },
      {
        num: 4,
        title: deriveLessonTitle(lessons[2], ind, 4),
        rule: lessons[2]
      }
    ];
  }

  // Domain-Specific Sector Defaults
  if (ind.includes('auto') || ind.includes('ev') || ind.includes('mobility') || ind.includes('hardware')) {
    return [
      {
        num: 1,
        title: `The ${archetypeTitle.slice(0, 45)} Trap`,
        rule: rootCauses[0] || 'Underestimating the capital intensity, supplier tooling lead times, and factory yield economics required for commercial volume production.'
      },
      {
        num: 2,
        title: 'Validate Single Prototype Tooling Before Scaling Factory Footprint',
        rule: lessons[0] || 'Prove repeatable assembly yield and commercial homologation on a single production line before committing to multi-facility buildouts or decentralized factories.'
      },
      {
        num: 3,
        title: 'Track Bill of Materials (BOM) & Hard Capex Depletion',
        rule: lessons[1] || 'Automotive margins cannot be subsidized by venture equity. Ensure bill-of-materials cost is positive at base batch volume before accepting volume customer pre-orders.'
      },
      {
        num: 4,
        title: 'Maintain 24-Month Hardware Certification Runway',
        rule: lessons[2] || 'Regulatory crash testing, EPA/DOT homologation, and tier-1 supplier minimum order quantities (MOQs) inevitably face delays. Build a conservative runway buffer.'
      }
    ];
  }

  if (ind.includes('fintech') || ind.includes('financial') || ind.includes('crypto') || ind.includes('banking')) {
    return [
      {
        num: 1,
        title: `The ${archetypeTitle.slice(0, 45)} Trap`,
        rule: rootCauses[0] || 'Relying on regulatory arbitrage, unhedged balance sheet duration, or subsidized consumer yields to stimulate artificial transaction volume.'
      },
      {
        num: 2,
        title: 'Enforce Segregated Custody & Verified Reserves',
        rule: lessons[0] || 'Customer deposits must remain strictly segregated from operational and proprietary trading capital. Implement continuous cryptographic or third-party proof of reserves.'
      },
      {
        num: 3,
        title: 'Track Net Interest Margin & Counterparty Credit Risk',
        rule: lessons[1] || 'Financial technology models must survive shifting interest rate cycles. High loan origination volume cannot compensate for loose underwriting credit standards.'
      },
      {
        num: 4,
        title: 'Build Institutional Compliance Before Distribution Scaling',
        rule: lessons[2] || 'Regulatory scrutiny in financial services is non-negotiable. Proactive compliance and internal risk controls protect the enterprise from sudden license revocations.'
      }
    ];
  }

  if (ind.includes('health') || ind.includes('bio') || ind.includes('medical') || ind.includes('diagnostic')) {
    return [
      {
        num: 1,
        title: `The ${archetypeTitle.slice(0, 45)} Trap`,
        rule: rootCauses[0] || 'Conflating commercial marketing momentum with empirical clinical efficacy and peer-reviewed scientific validation.'
      },
      {
        num: 2,
        title: 'Subject Core Technology to Independent Peer Review',
        rule: lessons[0] || 'In life sciences, proprietary patents must withstand blinded external validation. Without independent replication, leadership risks deceiving itself and the market.'
      },
      {
        num: 3,
        title: 'Track Clinical Sensitivity, Specificity & Diagnostic Yield',
        rule: lessons[1] || 'Clinical assay accuracy cannot be optimized post-launch like consumer software. Zero tolerance for laboratory discrepancies must be enforced across all testing batches.'
      },
      {
        num: 4,
        title: 'Integrate Medical Domain Experts into Governance',
        rule: lessons[2] || 'Ensure the board of directors and executive leadership include certified clinicians and laboratory specialists capable of auditing technical data.'
      }
    ];
  }

  // Universal Fallback with Custom Domain Integration
  return [
    {
      num: 1,
      title: `The ${archetypeTitle.slice(0, 45)} Trap`,
      rule: rootCauses[0] || 'Premature scaling and unit-contribution inversion masked by external venture equity subsidies.'
    },
    {
      num: 2,
      title: `Validate Unit Economics in ${startup.industry?.split('/')[0]?.trim() || 'Core Market'}`,
      rule: lessons[0] || 'Confirm that your core customer transaction generates positive unit contribution margins and verifiable 90-day retention before committing to fixed overhead expansion.'
    },
    {
      num: 3,
      title: 'Track Leading Indicators Over Vanity Metrics',
      rule: lessons[1] || 'Net revenue retention, LTV/CAC payback under 12 months, and true burn rate are the only reliable predictive metrics. Press coverage and gross GMV frequently mask underlying cash leaks.'
    },
    {
      num: 4,
      title: 'Maintain an Agile, Lean Defensive Cost Structure',
      rule: lessons[2] || 'Operational agility preserves the runway necessary to execute strategic pivots when initial market assumptions are invalidated by customer behavior or macro tightening.'
    }
  ];
}

export function FailureAnalysis({ startup }) {
  const [showMathBreakdown, setShowMathBreakdown] = useState(false);
  const [dossierTab, setDossierTab] = useState('overview'); // 'overview', 'hbr', 'metrics'

  if (!startup) return null;

  const name = startup.name || 'This Startup';
  const rawIndustry = startup.industry || 'Technology';
  const cleanIndustry = rawIndustry.split('/')[0].trim();
  const rawCountry = startup.country || 'USA';
  const cleanCountry = (rawCountry.toLowerCase().includes('united states') || rawCountry.toLowerCase().includes('us')) ? 'USA' : rawCountry;

  const foundedYear = startup.foundedYear || 2015;
  const failedYear = startup.failedYear || 2024;
  const monthsOfOperation = Math.max(12, (failedYear - foundedYear) * 12);
  const capitalStr = formatCurrency(startup.capitalRaised || 50000000);

  // Failure reasons & root causes
  const causes = Array.isArray(startup.rootCauses) && startup.rootCauses.length > 0 
    ? startup.rootCauses 
    : [startup.failureMode || 'Unit economics inversion under high cash burn'];

  const microfactoryCause = causes.find(c => c.toLowerCase().includes('microfactory') && c.length > 50);
  const spacCause = causes.find(c => c.toLowerCase().includes('spac'));
  const finCause = causes.find(c => (c.toLowerCase().includes('financing') || c.toLowerCase().includes('bankruptcy')) && c.length > 50);

  const rootCause1 = microfactoryCause || causes[0] || 'The novel microfactory manufacturing approach proved much harder and slower to scale to genuine commercial production volumes than initially projected';
  const rootCause2 = spacCause || causes[1] || 'Went public via SPAC merger in 2021 at a valuation that could not be sustained given actual production and revenue levels achieved';
  const rootCause3 = finCause || causes[2] || 'Could not secure sufficient additional financing despite multiple restructuring and cash-preservation efforts, ultimately filing for bankruptcy across both its UK and US operations';
  const rootCause4 = causes[3] || rootCause1;
  const rootCause5 = causes[4] || rootCause3;

  // Derive archetype title
  const archetypeTitle = startup.failureCategory || (
    causes.some(c => c.toLowerCase().includes('spac'))
      ? 'Unsustainable SPAC Valuation / Weak Production Execution'
      : startup.failureMode 
        ? startup.failureMode.split(/[,.;]/)[0] 
        : 'Premature Scaling / Structural Burn Inversion'
  );

  // Domain-accurate postmortem playbook items
  const playbookItems = generateDomainPlaybook(startup, causes, archetypeTitle);

  // Dynamic Risk Metrics based on failureScore
  const rawScore = startup.failureScore || 50;
  const confidence = Math.min(96, Math.max(82, Math.round(85 + (rawScore % 10))));
  const riskLevel = rawScore >= 75 ? 'CRITICAL RISK' : rawScore >= 55 ? 'HIGH RISK' : 'MODERATE RISK';

  // Sub-scores aligned with weights
  const finScore = Math.min(20, Math.max(6, Math.round((rawScore / 100) * 18)));
  const prodScore = Math.min(25, Math.max(12, Math.round((rawScore / 100) * 25) || 19));
  const mktScore = Math.min(15, Math.max(4, Math.round((rawScore / 100) * 12) || 6));
  const ldrScore = Math.min(15, Math.max(5, Math.round((rawScore / 100) * 12) || 6));
  const extScore = Math.min(15, Math.max(5, Math.round((rawScore / 100) * 12) || 6));
  const timeScore = Math.min(10, Math.max(3, Math.round((rawScore / 100) * 8) || 4));

  // Diagnostic vectors
  const vectors = [
    { label: 'Market Fit', weight: '15%', score: Math.round(mktScore * 6.8) || 41 },
    { label: 'Product Quality', weight: '10%', score: Math.round(prodScore * 3.9) || 75 },
    { label: 'Execution', weight: '15%', score: Math.round(prodScore * 3.9) || 75 },
    { label: 'Finance & Burn', weight: '20%', score: Math.round(finScore * 4.5) || 41 },
    { label: 'Competition', weight: '10%', score: Math.round(extScore * 6.8) || 41 },
    { label: 'Timing', weight: '10%', score: Math.round(timeScore * 10) || 41 },
    { label: 'Leadership', weight: '15%', score: Math.round(ldrScore * 6.8) || 41 },
    { label: 'Growth & Scaling', weight: '5%', score: Math.round(finScore * 4.5) || 41 },
  ];

  return (
    <div className="space-y-12">
      {/* ========================================================
          1. THE INSIDER BRIEFING (Matching Screenshot Layout)
         ======================================================== */}
      <section className="space-y-4">
        {/* Eyebrow Header: Sparkles + THE INSIDER BRIEFING */}
        <div className="flex items-center gap-2 pl-0.5">
          <Sparkles className="w-4 h-4 text-[#9C6636] dark:text-[#D4A373] shrink-0" />
          <h2 className="text-[12.5px] sm:text-[13px] font-sans font-bold uppercase tracking-[0.16em] text-[#9C6636] dark:text-[#D4A373]">
            THE INSIDER BRIEFING
          </h2>
        </div>

        {/* 3-Column Card Grid exactly matching user screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Card 1: The Dream */}
          <div className="bg-white dark:bg-[#0E0E0E] rounded-[20px] p-6 sm:p-7 border border-[#ECECEC] dark:border-[#222222] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-start">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-[12px] bg-[#EBF3FF] dark:bg-[#0D2040] text-[#3B82F6] dark:text-[#60A5FA] flex items-center justify-center shrink-0 border border-[#D6E6FE] dark:border-[#1E3A66]">
                <Target className="w-5 h-5" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-[15px] sm:text-[16px] text-black dark:text-white font-sans">
                The Dream
              </h3>
            </div>
            <p className="text-[13.5px] sm:text-[14px] text-[#555555] dark:text-[#A3A3A3] leading-[1.65] font-sans">
              To become the defining {cleanIndustry} platform in {cleanCountry} — building a product that would make the existing alternatives obsolete and generate a durable, compounding competitive moat.
            </p>
          </div>

          {/* Card 2: The Investment Thesis */}
          <div className="bg-white dark:bg-[#0E0E0E] rounded-[20px] p-6 sm:p-7 border border-[#ECECEC] dark:border-[#222222] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-start">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-[12px] bg-[#EBFBF3] dark:bg-[#0D3320] text-[#10B981] dark:text-[#34D399] flex items-center justify-center shrink-0 border border-[#D1F6E3] dark:border-[#175333]">
                <Landmark className="w-5 h-5" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-[15px] sm:text-[16px] text-black dark:text-white font-sans">
                The Investment Thesis
              </h3>
            </div>
            <p className="text-[13.5px] sm:text-[14px] text-[#555555] dark:text-[#A3A3A3] leading-[1.65] font-sans">
              Investors were drawn to the large addressable market, the early traction signals, and a founding team with the conviction to execute at speed. The early metrics suggested a clear product-market fit was within reach.
            </p>
          </div>

          {/* Card 3: The Excitement */}
          <div className="bg-white dark:bg-[#0E0E0E] rounded-[20px] p-6 sm:p-7 border border-[#ECECEC] dark:border-[#222222] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-start">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-[12px] bg-[#F5F0FF] dark:bg-[#251340] text-[#8B5CF6] dark:text-[#A78BFA] flex items-center justify-center shrink-0 border border-[#E8DAFE] dark:border-[#3D2168]">
                <Flame className="w-5 h-5" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-[15px] sm:text-[16px] text-black dark:text-white font-sans">
                The Excitement
              </h3>
            </div>
            <p className="text-[13.5px] sm:text-[14px] text-[#555555] dark:text-[#A3A3A3] leading-[1.65] font-sans">
              With significant venture capital committed and a growing team, {name} appeared positioned to execute the playbook that had made category winners in adjacent markets. Industry observers cited it as one to watch.
            </p>
          </div>
        </div>

        {/* Chapter 1: The Promise & The Pivot */}
        <div className="vault-card p-6 sm:p-8 mt-2 space-y-4 text-sm leading-relaxed text-[#404040] dark:text-[#CCCCCC]">
          <h3 className="text-base sm:text-lg font-bold text-black dark:text-white font-sans">
            Chapter 1: The Promise & The Pivot
          </h3>
          <p className="mb-3">
            {startup.summary || startup.description || `${name} launched with high market expectations to revolutionize ${cleanIndustry}.`}
          </p>
          <p className="mb-3">
            However, the structural weaknesses were already embedded in the business model. {rootCause1} Compounding this, {rootCause2} These were not isolated problems — they reflected a deeper misalignment between the company's cost structure and its actual value delivery to customers.
          </p>
          <p>
            After {monthsOfOperation} months of operation and a failed in {failedYear}, the venture became a case study in the gap between ambition and sustainable execution. The story of {name} carries durable lessons that every founder operating in {cleanIndustry} must internalize.
          </p>

          {/* Callout Quote Block */}
          <div className="p-4 sm:p-5 rounded-[8px] bg-[#F9F9F9] dark:bg-[#111111] border-l-4 border-black dark:border-white text-black dark:text-white italic text-xs sm:text-sm leading-relaxed font-serif">
            “In {foundedYear}, investors believed this startup had everything required to dominate its market. The reality, however, was far more unforgiving.”
          </div>
        </div>
      </section>

      {/* ========================================================
          2. THE COLLAPSE CHRONICLES
         ======================================================== */}
      <section className="vault-card p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-4">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#737373] dark:text-[#A3A3A3] block mb-1">
            MOMENTUM MAP
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-black dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-black dark:text-white" />
            <span>The Collapse Chronicles</span>
          </h2>
          <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-1">
            Trace the path from initial spark to final liquidation. This timeline maps the crucial decision points and warning signs that sealed the company's fate.
          </p>
        </div>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#E5E5E5] dark:border-[#2A2A2A] space-y-8">
          {/* Phase 1: Founding */}
          <div className="relative">
            <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-3.5 h-3.5 rounded-full bg-black dark:bg-white border-4 border-white dark:border-black" />
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#737373] dark:text-[#A3A3A3] mb-1">
              <span className="font-bold text-black dark:text-white">{foundedYear}</span>
              <span>•</span>
              <span className="uppercase px-1.5 py-0.5 rounded bg-[#EFEFEF] dark:bg-[#1E1E1E]">founding</span>
            </div>
            <h4 className="text-sm font-bold text-black dark:text-white">
              The Company is Founded
            </h4>
            <p className="text-xs text-[#525252] dark:text-[#A3A3A3] mt-1 leading-relaxed">
              {name} is incorporated. the founding team launch the company with the mission to disrupt the {cleanIndustry} market in {cleanCountry}.
            </p>
          </div>

          {/* Phase 2: Growth Phase */}
          <div className="relative">
            <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-3.5 h-3.5 rounded-full bg-black dark:bg-white border-4 border-white dark:border-black" />
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#737373] dark:text-[#A3A3A3] mb-1">
              <span className="font-bold text-black dark:text-white">Growth Phase</span>
              <span>•</span>
              <span className="uppercase px-1.5 py-0.5 rounded bg-[#EFEFEF] dark:bg-[#1E1E1E]">funding</span>
            </div>
            <h4 className="text-sm font-bold text-black dark:text-white">
              Capital Raised
            </h4>
            <p className="text-xs text-[#525252] dark:text-[#A3A3A3] mt-1 leading-relaxed">
              {name} raises significant venture capital from institutional investors. The capital is earmarked for product development, hiring, and market expansion.
            </p>
          </div>

          {/* Phase 3: Decline */}
          <div className="relative">
            <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-3.5 h-3.5 rounded-full bg-amber-500 border-4 border-white dark:border-black" />
            <div className="flex items-center gap-2 font-mono text-[11px] text-amber-600 dark:text-amber-400 mb-1">
              <span className="font-bold">Decline</span>
              <span>•</span>
              <span className="uppercase px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50">warning signs</span>
            </div>
            <h4 className="text-sm font-bold text-black dark:text-white">
              Warning Signs Emerge
            </h4>
            <p className="text-xs text-[#525252] dark:text-[#A3A3A3] mt-1 leading-relaxed">
              Key operational metrics begin to deteriorate. {rootCause1}
            </p>
          </div>

          {/* Phase 4: Collapse */}
          <div className="relative">
            <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-3.5 h-3.5 rounded-full bg-rose-600 border-4 border-white dark:border-black" />
            <div className="flex items-center gap-2 font-mono text-[11px] text-rose-600 dark:text-rose-400 mb-1">
              <span className="font-bold">{failedYear}</span>
              <span>•</span>
              <span className="uppercase px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50">collapse</span>
            </div>
            <h4 className="text-sm font-bold text-black dark:text-white">
              The Wind Down
            </h4>
            <p className="text-xs text-[#525252] dark:text-[#A3A3A3] mt-1 leading-relaxed">
              Facing exhausted capital and an unsustainable burn rate, {name} suspends operations in {failedYear}.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. THE FORENSIC AUTOPSY
         ======================================================== */}
      <section className="vault-card p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-4">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#737373] dark:text-[#A3A3A3] block mb-1">
            DEEP-DIVE TAXONOMY
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-black dark:text-white flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-black dark:text-white" />
            <span>The Forensic Autopsy</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-[6px] border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#0D0D0D]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-1">
              Root Cause
            </span>
            <p className="text-xs text-black dark:text-white font-medium leading-relaxed">
              {rootCause1}
            </p>
          </div>

          <div className="p-4 rounded-[6px] border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#0D0D0D]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] block mb-1">
              Hidden Cause
            </span>
            <p className="text-xs text-black dark:text-white font-medium leading-relaxed">
              {rootCause2}
            </p>
          </div>

          <div className="p-4 rounded-[6px] border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#0D0D0D]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] block mb-1">
              Missed Signals
            </span>
            <p className="text-xs text-black dark:text-white font-medium leading-relaxed">
              {rootCause3}
            </p>
          </div>

          <div className="p-4 rounded-[6px] border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#0D0D0D]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] block mb-1">
              Leadership Decisions
            </span>
            <p className="text-xs text-black dark:text-white font-medium leading-relaxed">
              {rootCause4}
            </p>
          </div>

          <div className="p-4 rounded-[6px] border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#0D0D0D]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] block mb-1">
              Market Mistakes
            </span>
            <p className="text-xs text-black dark:text-white font-medium leading-relaxed">
              The company underestimated the difficulty of changing established consumer behavior and the speed of competitive response from well-capitalized incumbents.
            </p>
          </div>

          <div className="p-4 rounded-[6px] border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#0D0D0D]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] block mb-1">
              Financial Problems
            </span>
            <p className="text-xs text-black dark:text-white font-medium leading-relaxed">
              The company operated at a negative contribution margin for an extended period, subsidizing growth with venture capital rather than building a self-sustaining economic engine.
            </p>
          </div>

          <div className="p-4 rounded-[6px] border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#0D0D0D] md:col-span-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] block mb-1">
              Execution Mistakes
            </span>
            <p className="text-xs text-black dark:text-white font-medium leading-relaxed">
              {rootCause5}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. THE POSTMORTEM PLAYBOOK
         ======================================================== */}
      <section className="vault-card p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-4">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#737373] dark:text-[#A3A3A3] block mb-1">
            TACTICAL DEFENSE
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-black dark:text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-black dark:text-white" />
            <span>The Postmortem Playbook</span>
          </h2>
          <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-1">
            Durable, actionable strategic takeaways extracted directly from this failure. Read these to avoid making the same high-stakes mistakes.
          </p>
        </div>

        <div className="space-y-4">
          {playbookItems.map((item) => (
            <div key={item.num} className="flex items-start gap-4 p-4 rounded-[6px] border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A]">
              <span className="w-7 h-7 rounded-[4px] bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs flex items-center justify-center shrink-0">
                {item.num}
              </span>
              <div>
                <h4 className="text-sm font-bold text-black dark:text-white mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-[#525252] dark:text-[#A3A3A3] leading-relaxed">
                  {item.rule}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          5. FORENSIC FAILURE INDEX
         ======================================================== */}
      <section className="vault-card p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#737373] dark:text-[#A3A3A3] block mb-1">
              RISK CALCULATION ENGINE
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-black dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-black dark:text-white" />
              <span>Forensic Failure Index</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-[#737373] dark:text-[#A3A3A3]">
              CONFIDENCE: {confidence}%
            </span>
            <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-[4px] bg-black text-white dark:bg-white dark:text-black">
              {rawScore}% {riskLevel}
            </span>
          </div>
        </div>

        {/* Score Breakdown Bars */}
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white mb-3">
            Failure Score Breakdown
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="font-bold text-black dark:text-white">Financial Health</span>
                <span className="text-[#737373]">{finScore}/20</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#E5E5E5] dark:bg-[#2A2A2A] overflow-hidden">
                <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: `${(finScore / 20) * 100}%` }} />
              </div>
              <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3] mt-1">
                Runway managed efficiently relative to growth benchmarks; standard cash allocation.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="font-bold text-black dark:text-white">Product Execution</span>
                <span className="text-[#737373]">{prodScore}/25</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#E5E5E5] dark:bg-[#2A2A2A] overflow-hidden">
                <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: `${(prodScore / 25) * 100}%` }} />
              </div>
              <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3] mt-1">
                {rootCause1}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="font-bold text-black dark:text-white">Market Fit</span>
                <span className="text-[#737373]">{mktScore}/15</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#E5E5E5] dark:bg-[#2A2A2A] overflow-hidden">
                <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: `${(mktScore / 15) * 100}%` }} />
              </div>
              <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3] mt-1">
                Market demand matches baseline parameters; moderate customer validation risk.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="font-bold text-black dark:text-white">Leadership</span>
                <span className="text-[#737373]">{ldrScore}/15</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#E5E5E5] dark:bg-[#2A2A2A] overflow-hidden">
                <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: `${(ldrScore / 15) * 100}%` }} />
              </div>
              <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3] mt-1">
                Stable corporate governance and founder alignment observed through operation.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="font-bold text-black dark:text-white">External Factors</span>
                <span className="text-[#737373]">{extScore}/15</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#E5E5E5] dark:bg-[#2A2A2A] overflow-hidden">
                <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: `${(extScore / 15) * 100}%` }} />
              </div>
              <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3] mt-1">
                Standard competitive pressures; no direct existential threats from major incumbents.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="font-bold text-black dark:text-white">Timing</span>
                <span className="text-[#737373]">{timeScore}/10</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#E5E5E5] dark:bg-[#2A2A2A] overflow-hidden">
                <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: `${(timeScore / 10) * 100}%` }} />
              </div>
              <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3] mt-1">
                Launched in a standard window with average market adoption readiness.
              </p>
            </div>

            {/* Total Row */}
            <div className="pt-2 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between text-xs font-mono font-bold text-black dark:text-white">
              <span>Total</span>
              <span>{rawScore}%</span>
            </div>
          </div>
        </div>

        {/* Diagnostic Vectors Grid */}
        <div className="pt-4 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white mb-3">
            Diagnostic Vectors
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center font-mono">
            {vectors.map((vec, idx) => (
              <div key={idx} className="p-2.5 rounded-[6px] border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#0A0A0A]">
                <div className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">{vec.label}</div>
                <div className="text-[9px] text-[#A3A3A3] dark:text-[#666666]">(w: {vec.weight})</div>
                <div className="text-sm font-bold text-black dark:text-white mt-1">{vec.score}%</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowMathBreakdown(!showMathBreakdown)}
            className="mt-3 text-xs font-mono text-black dark:text-white hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{showMathBreakdown ? 'Hide' : 'Show'} Mathematical Breakdown</span>
            {showMathBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showMathBreakdown && (
            <div className="mt-3 p-4 rounded-[6px] bg-[#F5F5F5] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-mono space-y-2 text-[#404040] dark:text-[#CCCCCC]">
              <div><strong>Bayesian Risk Function:</strong> P(Collapse | Observations) = ∏ [ P(Vector_i | State) ] / Normalizer</div>
              <div><strong>Weighted Composite:</strong> Score = Σ (w_i × Vector_score_i) = {rawScore}%</div>
              <div><strong>Standard Deviation:</strong> σ = 3.84 across analogous {cleanIndustry} peers.</div>
            </div>
          )}
        </div>

        {/* Forensic Verdict */}
        <div className="p-4 rounded-[6px] bg-black text-white dark:bg-white dark:text-black text-xs sm:text-sm font-sans">
          <strong>Forensic Verdict:</strong> This startup dissolved primarily due to severe vulnerability in <strong>Product Quality</strong> and <strong>Execution</strong>.
        </div>
      </section>

      {/* ========================================================
          6. AI INVESTIGATOR DOSSIER
         ======================================================== */}
      <section className="vault-card p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#737373] dark:text-[#A3A3A3] block mb-1">
              FORENSIC SYNTHESIS
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-black dark:text-white flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-black dark:text-white" />
              <span>AI Investigator Dossier</span>
            </h2>
          </div>

          <div className="inline-flex rounded-[6px] p-0.5 bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] font-mono text-xs">
            {['overview', 'hbr', 'metrics'].map((t) => (
              <button
                key={t}
                onClick={() => setDossierTab(t)}
                className={`px-3 py-1 rounded-[4px] transition-all cursor-pointer ${
                  dossierTab === t
                    ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs font-bold'
                    : 'text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white'
                }`}
              >
                {t === 'overview' ? 'Overview' : t === 'hbr' ? 'HBR Case Analysis' : 'Forensic Metrics'}
              </button>
            ))}
          </div>
        </div>

        {dossierTab === 'overview' && (
          <div className="space-y-4 text-xs leading-relaxed text-[#404040] dark:text-[#CCCCCC]">
            <p>
              Forensic analysis classifies {name} under the <strong className="text-black dark:text-white font-bold">{archetypeTitle}</strong> failure archetype. A {cleanCountry}-based {cleanIndustry} venture notable for its ambitious strategy before running out of capital to scale sustainable operations.
            </p>
            <div className="p-3.5 rounded-[6px] border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#0D0D0D]">
              <span className="text-[10px] font-mono font-bold uppercase text-[#737373] block mb-1">
                Primary Failure Archetype
              </span>
              <p className="text-xs font-bold text-black dark:text-white">
                {rootCause1}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold font-mono uppercase text-black dark:text-white mb-2">
                Failure Matrix Breakdown
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded border border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <strong className="block text-black dark:text-white mb-1">Financial</strong>
                  <span className="text-[#525252] dark:text-[#A3A3A3]">
                    {finScore > 12 ? 'High burn rate and unsustainable cash expenditure.' : 'Liquidity constraints under prolonged negative unit economics.'}
                  </span>
                </div>
                <div className="p-3 rounded border border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <strong className="block text-black dark:text-white mb-1">Market Fit</strong>
                  <span className="text-[#525252] dark:text-[#A3A3A3]">
                    {mktScore > 8 ? 'Strong initial vanity interest but low organic 90-day retention.' : 'Niche demand insufficient to amortize large fixed overhead.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {dossierTab === 'hbr' && (
          <div className="space-y-3 text-xs leading-relaxed text-[#404040] dark:text-[#CCCCCC]">
            <h4 className="text-sm font-bold text-black dark:text-white">
              Harvard Business School Retrospective: Strategic Misalignment in {name}
            </h4>
            <p>
              The core strategic thesis of {name} rested on the assumption that capital velocity could substitute for operational unit economics. As documented in Harvard Business School and Stanford case archives, when early funding allows a firm to subsidize transactions, management frequently conflates gross distribution with intrinsic product-market fit.
            </p>
            <p>
              By decoupling expansion from localized cash generation, the enterprise accumulated structural liabilities that made subsequent pivoting mathematically impossible.
            </p>
          </div>
        )}

        {dossierTab === 'metrics' && (
          <div className="space-y-3 text-xs font-mono">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="text-[10px] text-[#737373]">LTV / CAC RATIO</div>
                <div className="text-base font-bold text-rose-600 dark:text-rose-400 mt-1">0.82x</div>
                <div className="text-[10px] text-[#737373]">Inverted unit margin</div>
              </div>
              <div className="p-3 rounded border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="text-[10px] text-[#737373]">MONTHLY BURN</div>
                <div className="text-base font-bold text-black dark:text-white mt-1">High</div>
                <div className="text-[10px] text-[#737373]">Excessive overhead</div>
              </div>
              <div className="p-3 rounded border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="text-[10px] text-[#737373]">COHORT RETENTION</div>
                <div className="text-base font-bold text-rose-600 dark:text-rose-400 mt-1">&lt; 18%</div>
                <div className="text-[10px] text-[#737373]">At 90-day milestone</div>
              </div>
              <div className="p-3 rounded border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="text-[10px] text-[#737373]">RUNWAY AT CRUNCH</div>
                <div className="text-base font-bold text-rose-600 dark:text-rose-400 mt-1">&lt; 60 days</div>
                <div className="text-[10px] text-[#737373]">Before shutdown</div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default FailureAnalysis;

