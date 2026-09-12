import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, ShieldAlert, Sparkles, TrendingDown, ArrowRight, 
  Activity, Database, Flame, HelpCircle, Layers, Users, 
  FileText, BarChart3, Scale, Globe, CheckCircle2, ChevronRight,
  AlertTriangle, Network, Cpu, ArrowUpRight, Lock, Eye, Compass,
  BookOpen, Gauge, Brain, MessageSquare
} from 'lucide-react';
import { getInsights } from '../lib/api';
import { CURATED_STARTUPS } from '../lib/data/startupsData';
import { StartupCard } from '../components/common/StartupCard';
import { CompanyLogo } from '../components/common/CompanyLogo';
import { formatCurrency, formatNumber } from '../lib/utils';
import { useBookmarks } from '../hooks/useBookmarks';

function MiniSparkline({ data, stroke = '#000000', fill = 'rgba(0,0,0,0.06)', height = 30 }) {
  if (!data || data.length < 2) return null;
  const width = 80;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `${points} ${width},${height} 0,${height}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      {fill && <polygon points={areaPoints} fill={fill} />}
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState(null);
  const [featuredStartups, setFeaturedStartups] = useState([]);
  const [activeGhost, setActiveGhost] = useState('adam');
  const [activeGhostQuestion, setActiveGhostQuestion] = useState('warning');
  const [activeHeatmapCell, setActiveHeatmapCell] = useState({ vector: 'Unit Economics', industry: 'Hardware' });
  const [demoIdea, setDemoIdea] = useState('On-demand grocery delivery with 10-minute guarantee and subsidized courier fleet');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState({
    score: 72,
    rating: 'HIGH RISK',
    breakdown: [
      { label: 'Market Risk', level: 'HIGH', val: 78 },
      { label: 'Model Risk', level: 'HIGH', val: 85 },
      { label: 'Execution', level: 'MEDIUM', val: 54 },
      { label: 'Competition', level: 'HIGH', val: 88 }
    ],
    matches: [
      { name: 'Kozmo.com', similarity: '89%', cause: 'Per-delivery negative gross margins' },
      { name: 'Fast', similarity: '78%', cause: 'Burn rate exceeded revenue by 100x' },
      { name: 'Shyp', similarity: '74%', cause: 'Unscalable operational subsidy' }
    ]
  });

  const navigate = useNavigate();
  const { bookmarks } = useBookmarks();

  useEffect(() => {
    async function loadHomeData() {
      try {
        const insightsRes = await getInsights();
        setStats(insightsRes.data);
        setFeaturedStartups(CURATED_STARTUPS.slice(0, 6));
      } catch (err) {
        console.error('Failed loading home stats:', err);
        setFeaturedStartups(CURATED_STARTUPS.slice(0, 6));
      }
    }
    loadHomeData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  const handleRunDemoScan = () => {
    setIsScanning(true);
    if (demoIdea && demoIdea.trim()) {
      navigate(`/risk-scanner?idea=${encodeURIComponent(demoIdea.trim())}`);
    } else {
      navigate('/risk-scanner');
    }
  };

  // Failure vectors for horizontal bar visualization
  const failureVectors = [
    { label: 'Unit Economics Collapse', pct: 28, count: 116, isHighRisk: true, color: 'from-rose-500 to-rose-600', dotColor: 'bg-rose-500', barBg: 'bg-rose-500' },
    { label: 'Lack of Market Need / PMF', pct: 22, count: 91, isHighRisk: false, color: 'from-amber-500 to-amber-600', dotColor: 'bg-amber-500', barBg: 'bg-amber-500' },
    { label: 'Execution & Operations', pct: 17, count: 70, isHighRisk: false, color: 'from-blue-500 to-blue-600', dotColor: 'bg-blue-500', barBg: 'bg-blue-500' },
    { label: 'Competition & Moat Deficit', pct: 14, count: 58, isHighRisk: false, color: 'from-purple-500 to-purple-600', dotColor: 'bg-purple-500', barBg: 'bg-purple-500' },
    { label: 'Runway Exhaustion / Burn', pct: 9, count: 37, isHighRisk: false, color: 'from-orange-500 to-orange-600', dotColor: 'bg-orange-500', barBg: 'bg-orange-500' },
    { label: 'Fraud & Governance Failure', pct: 5, count: 21, isHighRisk: false, color: 'from-red-600 to-red-700', dotColor: 'bg-red-600', barBg: 'bg-red-600' },
    { label: 'Hardware & Manufacturing', pct: 3, count: 12, isHighRisk: false, color: 'from-emerald-500 to-emerald-600', dotColor: 'bg-emerald-500', barBg: 'bg-emerald-500' },
    { label: 'Regulatory & Legal Block', pct: 2, count: 8, isHighRisk: false, color: 'from-indigo-500 to-indigo-600', dotColor: 'bg-indigo-500', barBg: 'bg-indigo-500' },
  ];

  // Failure trend data by year
  const trendData = [
    { year: '2016', failures: 18, capital: '$1.2B' },
    { year: '2017', failures: 24, capital: '$1.8B' },
    { year: '2018', failures: 31, capital: '$2.9B' },
    { year: '2019', failures: 42, capital: '$4.1B' },
    { year: '2020', failures: 48, capital: '$3.5B' },
    { year: '2021', failures: 59, capital: '$6.2B' },
    { year: '2022', failures: 84, capital: '$7.4B', isPeak: true },
    { year: '2023', failures: 71, capital: '$5.8B' },
    { year: '2024', failures: 36, capital: '$2.9B' },
  ];

  // Heatmap matrix
  const heatmapIndustries = ['SaaS', 'FinTech', 'HealthTech', 'Hardware', 'E-Commerce', 'PropTech', 'Media'];
  const heatmapVectors = [
    { name: 'Unit Economics', values: [3, 4, 2, 5, 5, 4, 3], detail: 'Most lethal in Hardware & E-Commerce delivery models' },
    { name: 'Lack of PMF', values: [5, 3, 4, 3, 4, 3, 5], detail: 'Dominates consumer Media & early SaaS' },
    { name: 'Execution Void', values: [2, 3, 3, 5, 4, 3, 2], detail: 'Extreme failure density in complex hardware supply chains' },
    { name: 'Competition', values: [4, 4, 2, 3, 4, 3, 4], detail: 'Incumbent fast-followers crush single-feature startups' },
    { name: 'Timing Mismatch', values: [3, 2, 3, 4, 2, 2, 4], detail: 'Too early for VR/hardware infrastructure' },
    { name: 'Governance Void', values: [1, 5, 5, 2, 2, 4, 1], detail: 'Concentrated in Crypto/Fintech and Biotech clinical claims' },
  ];

  // Reconstructed Ghost Persona Dialogues
  const ghostProfiles = {
    adam: {
      name: 'Adam Neumann',
      startup: 'WeWork',
      avatar: 'AN',
      industry: 'PropTech',
      stat: '$14.0B Raised • $40B+ Lost',
      dialogues: {
        warning: {
          q: 'What warning signs did you miss before the collapse became irreversible?',
          a: "The biggest warning wasn't the competition—it was our structural duration mismatch. We built multi-billion dollar, 15-year non-cancellable lease obligations on 30-day cancelable member desks. In a zero-interest-rate bull market with infinite venture subsidies, you can mask that gap. The instant market liquidity tightened, fixed rent engulfed all operational cash.",
          lesson: 'Never disguise commercial real estate lease liabilities as high-margin recurring SaaS revenue.'
        },
        governance: {
          q: 'Why did corporate governance and board oversight fail?',
          a: 'Masa Son told me: "Don\'t be smart, be crazy. WeWork isn\'t big enough; make it 10x bigger." When lead investors offer billions to capture territory at all costs, it eliminates internal fiscal restraint. We granted 20-vote super shares and leased personal trademarks back to the company—liberties tolerated privately that public markets immediately rejected.',
          lesson: 'When you take public or institutional capital, governance cannot be treated as founder theater.'
        },
        lesson: {
          q: 'What is your core defensive takeaway for founders scaling today?',
          a: 'Capital abundance is not a competitive moat; it is an accelerant that magnifies whatever flaws exist in your unit economics. If your business model requires continuous venture capital subsidies to avoid insolvency, you are running a financial treadmill.',
          lesson: 'Achieve positive unit cash flows on early locations before expanding into the next ten.'
        }
      }
    },
    elizabeth: {
      name: 'Elizabeth Holmes',
      startup: 'Theranos',
      avatar: 'EH',
      industry: 'Biotech',
      stat: '$945M Raised • $9.0B Lost',
      dialogues: {
        warning: {
          q: 'What warning signs did you miss before the collapse became irreversible?',
          a: 'The primary warning signs were internal biochemical signals: high hemolyzed blood rates from capillary fingerpricks, micro-fluidic clogs inside our Edison machines, and persistent failure to meet quality control standards. Rather than halting expansion, we diluted samples and ran them on third-party commercial analyzers in secret.',
          lesson: 'Engineering and biological truth always surfaces before clinical scale.'
        },
        governance: {
          q: 'Why did corporate governance and board oversight fail?',
          a: 'We built a board of legendary statesmen—George Shultz, Henry Kissinger, General Mattis. They brought immense political prestige, but not a single one was a hematologist or biomedical engineer. They trusted my moral crusade, but lacked the domain expertise to audit our validation data.',
          lesson: 'A prestigious board without relevant technical domain expertise provides dangerous false comfort.'
        },
        lesson: {
          q: 'What is your core defensive takeaway for founders scaling today?',
          a: 'In deeptech and life sciences, peer review is not competitive vulnerability—it is the only objective baseline of reality. If you must hide your operational benchmarks behind non-disclosure agreements and team compartmentalization, your technology does not work.',
          lesson: 'Empirical peer validation must always precede commercial distribution.'
        }
      }
    },
    jeffrey: {
      name: 'Jeffrey Katzenberg',
      startup: 'Quibi',
      avatar: 'JK',
      industry: 'Streaming',
      stat: '$1.75B Raised • $1.75B Lost',
      dialogues: {
        warning: {
          q: 'What warning signs did you miss before the collapse became irreversible?',
          a: 'Our content cost structure required seven million paying subscribers in Year 1 simply to amortize our $100K-per-minute Hollywood productions. In beta testing, users abandoned shows after two episodes, but we convinced ourselves that a $100M marketing blitz would manufacture product-market fit.',
          lesson: 'Heavy advertising spend can buy app installs; it can never buy customer retention.'
        },
        governance: {
          q: 'Why did corporate governance and board oversight fail?',
          a: 'We approached mobile distribution through traditional Hollywood studio copyright instincts. We banned screenshots and clips to prevent piracy, inadvertently killing the only organic distribution engines on mobile: viral memes, TikTok loops, and social sharing.',
          lesson: 'Imposing legacy industry habits against native platform mechanics guarantees distribution failure.'
        },
        lesson: {
          q: 'What is your core defensive takeaway for founders scaling today?',
          a: 'No matter your industry reputation, past box-office triumphs, or capital stockpile, you cannot force consumer behavior. A teenager on TikTok with a ring light generated 100x our engagement for zero production cost.',
          lesson: 'Respect native user behavior over top-down prestige production.'
        }
      }
    },
    domm: {
      name: 'Domm Holland',
      startup: 'Fast',
      avatar: 'DH',
      industry: 'FinTech',
      stat: '$124.5M Raised • $120M+ Lost',
      dialogues: {
        warning: {
          q: 'What warning signs did you miss before the collapse became irreversible?',
          a: 'We believed we were in a winner-take-all land grab, so we hired 400 people and sponsored NASCAR while generating only $50K per month in gross revenue. An 80:1 burn-to-revenue ratio left zero margin for error when the macro fundraising environment tightened.',
          lesson: 'Headcount and vanity marketing are expense multipliers, not validation of traction.'
        },
        governance: {
          q: 'Why did corporate governance and board oversight fail?',
          a: 'Enterprise ecommerce merchants guard their checkout funnel with religious intensity. They refused to hand over order routing to an unproven plugin, while Shopify had Shop Pay and Apple had TouchID built directly into the operating system.',
          lesson: 'Standalone point solutions cannot survive against integrated platform distribution moats.'
        },
        lesson: {
          q: 'What is your core defensive takeaway for founders scaling today?',
          a: 'Never mistake venture capital in your bank account for product-market fit. High valuations and prestigious lead investors can subsidize an uneconomic business model, but they can never substitute for real paying customers.',
          lesson: 'Prioritize merchant adoption economics over hyper-scaling headcount.'
        }
      }
    },
    doug: {
      name: 'Doug Evans',
      startup: 'Juicero',
      avatar: 'DE',
      industry: 'Hardware',
      stat: '$118.5M Raised • $118.5M Lost',
      dialogues: {
        warning: {
          q: 'What warning signs did you miss before the collapse became irreversible?',
          a: 'We designed our press like an aerospace component with 400 custom parts, an aluminum gearbox, and four tons of pressure. That drove the retail price to $699. We completely ignored consumer willingness to pay until Bloomberg proved hands could squeeze the packs just as easily.',
          lesson: 'Never engineer complex, expensive hardware where human simplicity already works.'
        },
        governance: {
          q: 'Why did corporate governance and board oversight fail?',
          a: 'Top venture firms poured over $100M into our vision of the "Tesla of Juicing" without ever testing whether consumers would accept DRM software locks and mandatory Wi-Fi just to drink raw fruit juice.',
          lesson: 'Investor groupthink funding founder mythology is not a substitute for customer usability.'
        },
        lesson: {
          q: 'What is your core defensive takeaway for founders scaling today?',
          a: 'Build the simplest possible MVP that validates the core customer benefit. If your hardware does not provide a 10x cost reduction or 10x speed improvement over a manual alternative, you are engineering a monument to your own ego.',
          lesson: 'Frugal simplicity beats over-engineered complexity every time.'
        }
      }
    },
    sam: {
      name: 'Sam Bankman-Fried',
      startup: 'FTX',
      avatar: 'SBF',
      industry: 'Crypto',
      stat: '$1.8B Raised • $32.0B+ Lost',
      dialogues: {
        warning: {
          q: 'What warning signs did you miss before the collapse became irreversible?',
          a: 'Behind the trading dashboards, Alameda had a secret codebase flag ("allow_negative = true") exempting it from automated liquidations. It drew from customer deposits to fund illiquid venture bets, leaving an $8 billion hole when the market retreated and customers withdrew.',
          lesson: 'Code exemptions and unhedged balance-sheet leverage will always trigger catastrophic bank runs.'
        },
        governance: {
          q: 'Why did corporate governance and board oversight fail?',
          a: 'We operated without an independent board of directors, a chief financial officer, or audited financials. Top venture funds invested hundreds of millions during Zoom calls while bypassing basic treasury verification out of fear of missing the round.',
          lesson: 'FOMO-driven due diligence without independent board oversight enables unchecked disaster.'
        },
        lesson: {
          q: 'What is your core defensive takeaway for founders scaling today?',
          a: 'If your company stewards customer funds, risk management and segregated custody are not administrative burdens—they are the foundational premise of your business. Charisma can never replace audited ledgers.',
          lesson: 'Segregate operational treasury and submit to independent, verifiable audits.'
        }
      }
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-20 bg-white dark:bg-black text-black dark:text-white">
      {/* 1. Live System Telemetry Ticker */}
      <div className="py-2.5 bg-[#F5F5F5] dark:bg-[#0A0A0A] border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="site-container flex items-center justify-between overflow-x-auto gap-6 whitespace-nowrap text-[12px] text-[#737373] dark:text-[#A3A3A3]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0 bg-[#DC2626] animate-pulse" />
            <span className="font-extrabold text-black dark:text-white tracking-wider">SYSTEM TELEMETRY:</span>
            <span className="font-medium">413+ startup autopsies indexed across 14 failure vectors</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span>Capital Evaporated: <strong className="text-rose-600 dark:text-rose-400 font-extrabold tabular-nums">$26.8B+</strong></span>
            <span className="text-[#D4D4D4] dark:text-[#404040]">•</span>
            <span>Top Failure Vector: <strong className="text-amber-600 dark:text-amber-400 font-bold">Unit Economics (28%)</strong></span>
            <span className="text-[#D4D4D4] dark:text-[#404040]">•</span>
            <span>AI Reasoning: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">Active Dual-Layer</strong></span>
          </div>
          <Link 
            to="/insights" 
            className="hover:underline flex items-center gap-1 font-bold text-black dark:text-white"
          >
            <span>Macro Dashboard</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* 2. Hero Section: 90-95vh Viewport Fill, 60/40 Split */}
      <section className="site-container pt-4 sm:pt-8 min-h-[85vh] lg:min-h-[88vh] flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column (60%): Editorial Headline, Search, CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <div className="inline-flex items-center gap-2 mb-4 w-fit bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[4px] text-[11px] font-extrabold px-2.5 py-1 tracking-wider uppercase">
              <span>STARTUP INTELLIGENCE PLATFORM</span>
            </div>

            <h1 className="text-4xl sm:text-6xl xl:text-[70px] tracking-tight leading-[1.05] font-extrabold text-black dark:text-white">
              Learn from startup failures. <br />
              <span className="text-[#737373] dark:text-[#A3A3A3] font-bold">
                Make better decisions before you build.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-[#737373] dark:text-[#A3A3A3]">
              PivotVault synthesizes 413+ historical startup autopsies, forensic post-mortems, and case studies into defensive intelligence for founders and investors.
            </p>

            {/* 2px Solid Ink Border Search Bar */}
            <div className="mt-8 max-w-2xl">
              <form 
                onSubmit={handleHeroSearch} 
                className="relative flex items-center overflow-hidden h-[64px] bg-white dark:bg-black border-2 border-black dark:border-white rounded-[6px] shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
              >
                <div className="pl-5 text-black dark:text-white">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by startup (Theranos, WeWork), industry, or failure mode..."
                  className="w-full px-4 text-[15px] sm:text-[16px] bg-transparent focus:outline-none font-medium text-black dark:text-white placeholder-[#737373] dark:placeholder-[#A3A3A3]"
                />
                <button
                  type="submit"
                  className="mr-2 shrink-0 cursor-pointer btn-primary px-6 py-3 rounded-[4px] text-[14px] font-bold tracking-wide"
                >
                  Analyze →
                </button>
              </form>

              {/* Popular Search Chips */}
              <div className="mt-3.5 flex items-center gap-2 flex-wrap text-[13px] text-[#737373] dark:text-[#A3A3A3]">
                <span className="text-black dark:text-white font-extrabold">Popular:</span>
                {['Unit Economics', 'Theranos', 'WeWork', 'Quibi', 'Fast', 'Hardware Defect'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => navigate(`/explore?q=${encodeURIComponent(tag)}`)}
                    className="hover:underline hover:text-black dark:hover:text-white transition-colors font-medium cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Dual Action CTAs - Strict Black & White */}
              <div className="mt-7 flex items-center gap-4 flex-wrap">
                <Link 
                  to="/explore" 
                  className="btn-primary inline-flex items-center justify-center text-[15px] font-bold px-6 py-3 rounded-[6px]"
                >
                  Explore 413+ Failures →
                </Link>
                <Link 
                  to="/risk-scanner" 
                  className="vault-btn-secondary inline-flex items-center justify-center text-[15px] font-bold px-5 py-3 rounded-[6px]"
                >
                  Scan Startup Risk
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column (40%): Live Failure Intelligence Panel */}
          <div className="lg:col-span-5">
            <div className="space-y-5 bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[10px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              {/* Panel Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                  <h3 className="text-[#737373] dark:text-[#A3A3A3] text-[11px] font-extrabold uppercase tracking-wider">
                    FAILURE INTELLIGENCE PANEL
                  </h3>
                </div>
                <span className="bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[4px] text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                  LIVE FEED
                </span>
              </div>

              {/* 3 Metric Stat Blocks */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 rounded-[8px] transition-all hover:scale-[1.02]">
                  <div className="text-[22px] leading-tight font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
                    413+
                  </div>
                  <div className="mt-0.5 uppercase text-blue-700/80 dark:text-blue-300/80 text-[11px] font-bold tracking-wider">
                    Startups
                  </div>
                </div>

                <div className="p-3 bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-900/50 rounded-[8px] transition-all hover:scale-[1.02]">
                  <div className="text-[22px] leading-tight font-extrabold text-purple-600 dark:text-purple-400 tabular-nums">
                    14
                  </div>
                  <div className="mt-0.5 uppercase text-purple-700/80 dark:text-purple-300/80 text-[11px] font-bold tracking-wider">
                    Vectors
                  </div>
                </div>

                {/* Highlighted Stat Card ($26.8B+ EVAPORATED) */}
                <div className="p-3 bg-gradient-to-br from-rose-600 to-rose-700 border border-rose-500 rounded-[8px] text-white shadow-sm transition-all hover:scale-[1.02]">
                  <div className="text-[22px] leading-tight font-extrabold tabular-nums tracking-tight">
                    $26.8B+
                  </div>
                  <div className="mt-0.5 uppercase text-[11px] font-bold tracking-wider text-rose-100">
                    Evaporated
                  </div>
                </div>
              </div>

              {/* TOP FAILURE VECTORS section */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#737373] dark:text-[#A3A3A3] text-[11px] uppercase font-bold tracking-wider">
                    TOP FAILURE VECTORS
                  </span>
                  <span className="text-[#737373] dark:text-[#A3A3A3] text-[11px]">
                    413 Sample Size
                  </span>
                </div>

                <div className="space-y-2.5">
                  {/* Active Unit Economics Collapse */}
                  <div>
                    <div className="flex items-center justify-between text-[13px] mb-1">
                      <span className="flex items-center gap-1.5 text-black dark:text-white text-[14px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        Unit Economics Collapse
                      </span>
                      <span className="text-rose-600 dark:text-rose-400 font-extrabold tabular-nums">
                        28%
                      </span>
                    </div>
                    <div className="w-full rounded-full overflow-hidden bg-[#E5E5E5] dark:bg-[#2A2A2A] h-1.5">
                      <div className="h-full rounded-full bg-rose-500 dark:bg-rose-400" style={{ width: '28%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span className="flex items-center gap-1.5 text-[#737373] dark:text-[#A3A3A3]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Product-Market Fit Deficit
                      </span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold tabular-nums">22%</span>
                    </div>
                    <div className="w-full rounded-full overflow-hidden bg-[#E5E5E5] dark:bg-[#2A2A2A] h-1.5">
                      <div className="h-full rounded-full bg-amber-500 dark:bg-amber-400" style={{ width: '22%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span className="flex items-center gap-1.5 text-[#737373] dark:text-[#A3A3A3]">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        Execution Void
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold tabular-nums">17%</span>
                    </div>
                    <div className="w-full rounded-full overflow-hidden bg-[#E5E5E5] dark:bg-[#2A2A2A] h-1.5">
                      <div className="h-full rounded-full bg-blue-500 dark:bg-blue-400" style={{ width: '17%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span className="flex items-center gap-1.5 text-[#737373] dark:text-[#A3A3A3]">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        Competition & Platform Moat
                      </span>
                      <span className="text-purple-600 dark:text-purple-400 font-bold tabular-nums">14%</span>
                    </div>
                    <div className="w-full rounded-full overflow-hidden bg-[#E5E5E5] dark:bg-[#2A2A2A] h-1.5">
                      <div className="h-full rounded-full bg-purple-500 dark:bg-purple-400" style={{ width: '14%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Signal Banner */}
              <div className="flex items-start gap-2.5 p-3 text-[12px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] text-[#737373] dark:text-[#A3A3A3]">
                <Cpu className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <strong className="text-black dark:text-white">AI SIGNAL:</strong> Unit economics deterioration correlates with 84% of consumer hardware casualties.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section: Live Failure Intelligence (Charts & Distributions) */}
      <section className="site-container pt-12 pb-6 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] text-[11px] font-bold tracking-wider uppercase">
              <Activity className="w-3.5 h-3.5" />
              <span>Forensic Dataset</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
              Failure Intelligence & Distribution
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#737373] dark:text-[#A3A3A3] mt-1 max-w-2xl leading-relaxed">
              Patterns extracted across 413+ documented startup failures. Editorial analytics derived from verified corporate post-mortems and SEC filings.
            </p>
          </div>
          <Link 
            to="/insights" 
            className="shrink-0 font-bold text-[13px] text-black dark:text-white hover:underline flex items-center gap-1"
          >
            <span>Macro Dashboard</span>
            <span>→</span>
          </Link>
        </div>

        {/* 4 Analytics Metric Cards - Colored Accent System */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: TOTAL FAILURES */}
          <div className="group bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-rose-300 dark:hover:border-rose-800/60 rounded-[8px] p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/50">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className="text-[#737373] dark:text-[#A3A3A3] text-[11px] font-bold uppercase tracking-wider">
                  TOTAL FAILURES
                </span>
              </div>
              <span className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/40 rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                +18
              </span>
            </div>
            <div className="flex items-end justify-between mb-3">
              <div className="text-3xl sm:text-4xl font-extrabold text-black dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 tabular-nums tracking-tight leading-none transition-colors">
                413
              </div>
              <MiniSparkline
                data={[20, 32, 28, 45, 42, 58, 62, 55, 72, 75]}
                stroke="#E11D48"
                fill="rgba(225, 29, 72, 0.12)"
              />
            </div>
            <div className="text-[#737373] dark:text-[#A3A3A3] text-[12px] font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
              <span>This quarter</span>
            </div>
          </div>

          {/* Card 2: VAULTED STARTUPS */}
          <div className="group bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-blue-300 dark:hover:border-blue-800/60 rounded-[8px] p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-900/50">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-[#737373] dark:text-[#A3A3A3] text-[11px] font-bold uppercase tracking-wider">
                  VAULTED STARTUPS
                </span>
              </div>
              <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/40 rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                +214
              </span>
            </div>
            <div className="flex items-end justify-between mb-3">
              <div className="text-3xl sm:text-4xl font-extrabold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 tabular-nums tracking-tight leading-none transition-colors">
                413
              </div>
              <MiniSparkline
                data={[30, 34, 38, 42, 41, 46, 50, 54, 55, 60]}
                stroke="#2563EB"
                fill="rgba(37, 99, 235, 0.12)"
              />
            </div>
            <div className="text-[#737373] dark:text-[#A3A3A3] text-[12px] font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
              <span>With verified postmortems</span>
            </div>
          </div>

          {/* Card 3: AVG RISK SCORE */}
          <div className="group bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-amber-300 dark:hover:border-amber-800/60 rounded-[8px] p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/50">
                  <Gauge className="w-4 h-4" />
                </div>
                <span className="text-[#737373] dark:text-[#A3A3A3] text-[11px] font-bold uppercase tracking-wider">
                  AVG RISK SCORE
                </span>
              </div>
              <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/40 rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                +3.2
              </span>
            </div>
            <div className="flex items-end justify-between mb-3">
              <div className="text-3xl sm:text-4xl font-extrabold text-black dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 tabular-nums tracking-tight leading-none transition-colors">
                68.4
              </div>
              <MiniSparkline
                data={[55, 58, 60, 62, 61, 65, 66, 67, 68, 68.4]}
                stroke="#D97706"
                fill="rgba(217, 119, 6, 0.12)"
              />
            </div>
            <div className="text-[#737373] dark:text-[#A3A3A3] text-[12px] font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
              <span>All analyzed startups</span>
            </div>
          </div>

          {/* Card 4: AI INSIGHTS GENERATED */}
          <div className="group bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-purple-300 dark:hover:border-purple-800/60 rounded-[8px] p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/80 dark:border-purple-900/50">
                  <Brain className="w-4 h-4" />
                </div>
                <span className="text-[#737373] dark:text-[#A3A3A3] text-[11px] font-bold uppercase tracking-wider">
                  AI INSIGHTS
                </span>
              </div>
              <span className="bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/40 rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                +1,204
              </span>
            </div>
            <div className="flex items-end justify-between mb-3">
              <div className="text-3xl sm:text-4xl font-extrabold text-black dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 tabular-nums tracking-tight leading-none transition-colors">
                48,209
              </div>
              <MiniSparkline
                data={[10, 18, 22, 28, 32, 38, 45, 48, 52, 56]}
                stroke="#8B5CF6"
                fill="rgba(139, 92, 246, 0.12)"
              />
            </div>
            <div className="text-[#737373] dark:text-[#A3A3A3] text-[12px] font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block" />
              <span>Last 30 days</span>
            </div>
          </div>
        </div>

        {/* 2-Column Dashboard: Left = Failure Vector Distribution, Right = Trend Line */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: FAILURE VECTOR DISTRIBUTION Card */}
          <div className="lg:col-span-6 p-6 space-y-4 bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
              <div>
                <h3 className="text-black dark:text-white font-bold text-[15px] tracking-tight">
                  FAILURE VECTOR DISTRIBUTION
                </h3>
                <p className="text-[#737373] dark:text-[#A3A3A3] text-[12px]">
                  Primary root causes across 413 autopsies
                </p>
              </div>
              <span className="bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[4px] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                Ranked
              </span>
            </div>

            <div className="space-y-4 pt-2">
              {failureVectors.map((vec) => (
                <div key={vec.label}>
                  <div className="flex items-center justify-between text-[13px] mb-1.5">
                    <span className={`flex items-center gap-2 ${vec.isHighRisk ? 'text-black dark:text-white font-bold' : 'text-[#525252] dark:text-[#D4D4D4] font-medium'}`}>
                      <span className={`w-2 h-2 rounded-full ${vec.dotColor || 'bg-zinc-400'} shrink-0`} />
                      {vec.label}
                    </span>
                    <div className="flex items-center gap-3 text-[12px]">
                      <span className="text-[#737373] dark:text-[#A3A3A3]">{vec.count} cases</span>
                      <span className="font-bold tabular-nums text-black dark:text-white">
                        {vec.pct}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full rounded-full bg-[#E5E5E5] dark:bg-[#2A2A2A] h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${vec.color || 'from-zinc-500 to-zinc-700'}`}
                      style={{ width: `${vec.pct * 3}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: FAILURE EVENT TIMELINE Chart */}
          <div className="lg:col-span-6 p-6 flex flex-col justify-between bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] shadow-sm">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div>
                  <h3 className="text-black dark:text-white font-bold text-[15px] tracking-tight">
                    FAILURE EVENT TIMELINE
                  </h3>
                  <p className="text-[#737373] dark:text-[#A3A3A3] text-[12px]">
                    Annual collapse concentration (2016–2024)
                  </p>
                </div>
                <span className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/40 rounded-[4px] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                  Peak: 2022 Crunch
                </span>
              </div>

              {/* Bar visualization of annual failures */}
              <div className="mt-6 pt-4 grid grid-cols-9 gap-2 h-44 items-end pb-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                {trendData.map((d) => {
                  const heightPct = Math.round((d.failures / 84) * 100);
                  return (
                    <div key={d.year} className="flex flex-col items-center gap-2 group h-full justify-end">
                      <span className={`text-[10px] transition-opacity whitespace-nowrap tabular-nums ${d.isPeak ? 'opacity-100 text-rose-600 dark:text-rose-400 font-extrabold' : 'opacity-0 group-hover:opacity-100 text-[#737373] dark:text-[#A3A3A3]'}`}>
                        {d.failures}
                      </span>
                      <div 
                        className={`w-full rounded-t-[4px] transition-all duration-300 ${
                          d.isPeak 
                            ? 'bg-gradient-to-t from-rose-600 to-rose-500 shadow-sm shadow-rose-500/30 ring-1 ring-rose-400' 
                            : 'bg-blue-500/40 hover:bg-blue-600 dark:bg-blue-600/30 dark:hover:bg-blue-500'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className={`text-[11px] font-bold ${d.isPeak ? 'text-rose-600 dark:text-rose-400 underline decoration-rose-400 font-extrabold' : 'text-[#737373] dark:text-[#A3A3A3]'}`}>
                        {d.year.slice(2)}'
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 p-3.5 rounded-[6px] flex items-center justify-between text-[12px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A]">
              <div className="text-[#737373] dark:text-[#A3A3A3]">
                <strong className="text-black dark:text-white">Trend Insight:</strong> Zero-interest-rate policy (ZIRP) hangover drove record mortality spikes in 2022–2023.
              </div>
              <Link to="/insights" className="font-bold text-black dark:text-white hover:underline shrink-0 ml-3">
                Details →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section: Capital Evaporated Metric & Breakdown */}
      <section className="site-container py-6">
        <div className="p-8 lg:p-10 rounded-[8px] bg-black dark:bg-[#0A0A0A] text-white border border-[#2A2A2A] shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-rose-500/10 text-rose-300 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                DATASET-DERIVED METRIC
              </span>
              <div className="text-5xl sm:text-6xl font-black tabular-nums tracking-tight bg-gradient-to-r from-rose-500 via-rose-400 to-amber-300 bg-clip-text text-transparent">
                $26.8B+
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">CAPITAL EVAPORATED</h3>
              <p className="text-[13px] sm:text-[14px] text-[#A3A3A3] leading-relaxed max-w-md">
                Total aggregate equity, debt, and venture capital associated with verified failure post-mortems in the PivotVault database.
              </p>
              <div className="pt-2">
                <Link 
                  to="/explore" 
                  className="inline-flex items-center justify-center px-5 py-2.5 text-[13px] font-bold rounded-[6px] bg-white text-black hover:bg-rose-50 hover:text-rose-600 transition-colors shadow-sm"
                >
                  Audit Financial Sinks →
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { name: 'WeWork', lost: '$12.8B', sector: 'PropTech', sectorColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30', cause: 'Lease arbitrage vs 30-day flex' },
                { name: 'Quibi', lost: '$1.75B', sector: 'Streaming', sectorColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30', cause: 'Hardware-agnostic mobile lock-in' },
                { name: 'Theranos', lost: '$1.4B', sector: 'HealthTech', sectorColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', cause: 'Unverified medical diagnostics' },
                { name: 'Better Place', lost: '$900M', sector: 'CleanTech', sectorColor: 'bg-teal-500/15 text-teal-300 border-teal-500/30', cause: 'EV battery-swap capex trap' },
                { name: 'Fast', lost: '$125M', sector: 'FinTech', sectorColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30', cause: '$10M/mo burn with $50k ARR' },
                { name: 'Juicero', lost: '$120M', sector: 'Hardware', sectorColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30', cause: '$400 press with hand-squeezable bag' }
              ].map((item) => (
                <div 
                  key={item.name} 
                  className="p-3.5 bg-[#141414] border border-[#2A2A2A] rounded-[6px] hover:border-rose-500/40 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CompanyLogo name={item.name} size="xs" />
                      <span className="font-bold text-white text-[14px]">{item.name}</span>
                    </div>
                    <span className="font-extrabold text-rose-400 text-[14px] tabular-nums group-hover:text-rose-300 transition-colors">
                      {item.lost}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className={`inline-block px-1.5 py-0.5 rounded-[3px] text-[10px] font-bold uppercase tracking-wider border ${item.sectorColor}`}>
                      {item.sector}
                    </span>
                  </div>
                  <div className="text-[12px] text-[#A3A3A3] mt-1.5 line-clamp-1">{item.cause}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 5. Section: Failure Pattern Matrix (Heatmap) */}
      <section className="site-container py-12 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] text-[11px] font-bold tracking-wider uppercase">
            <Compass className="w-3.5 h-3.5" />
            <span>Cross-Industry Matrix</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
            Failure Pattern Matrix
          </h2>
          <p className="text-[14px] text-[#737373] dark:text-[#A3A3A3] mt-1">
            Intensity indicates failure concentration across industries and root cause vectors. Click any cell to inspect.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] shadow-sm overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                <th className="py-3 px-4 font-bold w-44 text-black dark:text-white">Failure Vector</th>
                {heatmapIndustries.map((ind) => (
                  <th key={ind} className="py-3 px-3 font-bold text-center text-black dark:text-white">
                    {ind}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapVectors.map((row) => (
                <tr key={row.name} className="border-b border-[#E5E5E5]/60 dark:border-[#2A2A2A]/60 hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-black dark:text-white">
                    {row.name}
                  </td>
                  {row.values.map((intensity, idx) => {
                    const industry = heatmapIndustries[idx];
                    const isSelected = activeHeatmapCell.vector === row.name && activeHeatmapCell.industry === industry;
                    
                    // Color intensity risk ramp
                    let cellBg = 'bg-slate-100 text-slate-700 dark:bg-zinc-800/80 dark:text-zinc-300';
                    if (intensity === 5) {
                      cellBg = 'bg-rose-600 text-white shadow-sm shadow-rose-600/30 font-extrabold';
                    } else if (intensity === 4) {
                      cellBg = 'bg-rose-500/85 text-white font-bold';
                    } else if (intensity === 3) {
                      cellBg = 'bg-amber-500 text-white font-bold';
                    } else if (intensity === 2) {
                      cellBg = 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 font-medium';
                    }

                    return (
                      <td key={industry} className="py-2.5 px-2 text-center">
                        <button
                          onClick={() => setActiveHeatmapCell({ vector: row.name, industry, detail: row.detail })}
                          className={`w-10 h-8 rounded-[4px] text-[11px] transition-all hover:scale-105 inline-flex items-center justify-center cursor-pointer ${cellBg} ${
                            isSelected ? 'ring-2 ring-rose-500 shadow-md scale-105' : ''
                          }`}
                          title={`${row.name} × ${industry}: Risk Level ${intensity}/5`}
                        >
                          {intensity}★
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Active Cell Inspector */}
          <div className="mt-4 p-4 rounded-[6px] flex items-center justify-between text-[13px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <div>
              <span className="font-bold text-black dark:text-white">Selected Intersection: </span>
              <strong className="text-black dark:text-white underline">{activeHeatmapCell.vector}</strong> × <strong className="text-black dark:text-white">{activeHeatmapCell.industry}</strong>
              <span className="ml-2 text-[#737373] dark:text-[#A3A3A3]">
                — {activeHeatmapCell.detail || 'High structural vulnerability observed in capital-intensive rollout models.'}
              </span>
            </div>
            <Link 
              to={`/explore?q=${encodeURIComponent(activeHeatmapCell.vector)}`} 
              className="shrink-0 ml-4 font-bold text-[12px] text-black dark:text-white hover:underline"
            >
              Explore Cases →
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Section: Process Flow */}
      <section className="site-container py-12 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="p-8 rounded-[8px] bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-sm">
          <div className="text-center mb-8">
            <span className="inline-block mb-1.5 font-bold uppercase tracking-wider text-black dark:text-white text-[11px]">
              PLATFORM ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
              From Failure Evidence to Founder Action
            </h2>
            <p className="text-[14px] text-[#737373] dark:text-[#A3A3A3] mt-1 max-w-xl mx-auto">
              How PivotVault transforms raw corporate wreckage into defensible strategic foresight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { num: '01. COLLECT', title: 'Public Evidence', desc: 'SEC filings, court dockets, post-mortems & liquidation reports.' },
              { num: '02. ENRICH', title: 'AI Extraction', desc: 'Dual-engine extraction of cash burn velocity & fatal pivots.' },
              { num: '03. AUDIT', title: 'Pitch Deck Autopsy', desc: 'Stress-test pitch decks against historical failure models and valuation traps.' },
              { num: '04. ANALYZE', title: 'Failure Patterns', desc: 'Calculate Failure Scores (0–100) and multi-factor risk meters.' },
              { num: '05. ACT', title: 'Founder Action', desc: 'Audit pitch decks, scan business models, and pivot safely.', highlight: true },
            ].map((step, idx) => (
              <div 
                key={idx}
                className={`p-4 flex flex-col justify-between rounded-[6px] text-left transition-all ${
                  step.highlight 
                    ? 'bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white shadow-sm' 
                    : 'bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]'
                }`}
              >
                <div>
                  <span className={`block mb-1 text-[11px] font-mono font-bold tracking-wider ${step.highlight ? 'opacity-70' : 'text-[#737373] dark:text-[#A3A3A3]'}`}>
                    {step.num}
                  </span>
                  <h4 className="text-[14px] font-bold">
                    {step.title}
                  </h4>
                  <p className={`text-[12px] mt-1.5 leading-relaxed ${step.highlight ? 'opacity-80' : 'text-[#737373] dark:text-[#A3A3A3]'}`}>
                    {step.desc}
                  </p>
                </div>
                <div className="mt-3 text-[14px] font-bold">
                  {step.highlight ? '★ Actionable' : '↓'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Section: Core Platform Modules */}
      <section className="site-container py-12 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] text-[11px] font-bold tracking-wider uppercase">
              <Layers className="w-3.5 h-3.5" />
              <span>Core Platform Modules</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
              Intelligence Feature Suite
            </h2>
            <p className="text-[14px] text-[#737373] dark:text-[#A3A3A3] mt-1">
              Every tool is engineered with distinct diagnostic capabilities to deconstruct risk.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Failure Archive */}
          <Link 
            to="/explore" 
            className="p-6 group flex flex-col justify-between transition-all bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] shadow-sm hover:border-black dark:hover:border-white"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#737373] dark:text-[#A3A3A3] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  413+ Dossiers
                </span>
                <Database className="w-5 h-5 text-black dark:text-white" />
              </div>
              <h3 className="text-[17px] font-bold text-black dark:text-white group-hover:underline transition-colors">
                Failure Archive
              </h3>
              <p className="text-[13px] text-[#737373] dark:text-[#A3A3A3] mt-1 leading-relaxed">
                Forensic post-mortems with capital loss figures, timelines, and root cause tags.
              </p>

              <div className="mt-4 p-3 rounded-[6px] text-[11px] space-y-1.5 bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="flex justify-between font-bold border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-1 text-black dark:text-white">
                  <span>STARTUP</span>
                  <span>FS SCORE</span>
                  <span>CAPITAL</span>
                </div>
                <div className="flex justify-between items-center text-[#737373] dark:text-[#A3A3A3]">
                  <div className="flex items-center gap-1.5 text-black dark:text-white font-medium">
                    <CompanyLogo name="Theranos" size="xs" />
                    <span>Theranos</span>
                  </div>
                  <span className="text-black dark:text-white font-bold">98</span>
                  <span className="tabular-nums font-semibold text-black dark:text-white">$1.4B</span>
                </div>
                <div className="flex justify-between items-center text-[#737373] dark:text-[#A3A3A3]">
                  <div className="flex items-center gap-1.5 text-black dark:text-white font-medium">
                    <CompanyLogo name="WeWork" size="xs" />
                    <span>WeWork</span>
                  </div>
                  <span className="text-black dark:text-white font-bold">92</span>
                  <span className="tabular-nums font-semibold text-black dark:text-white">$12.8B</span>
                </div>
                <div className="flex justify-between items-center text-[#737373] dark:text-[#A3A3A3]">
                  <div className="flex items-center gap-1.5 text-black dark:text-white font-medium">
                    <CompanyLogo name="Fast" size="xs" />
                    <span>Fast</span>
                  </div>
                  <span className="text-black dark:text-white font-bold">88</span>
                  <span className="tabular-nums font-semibold text-black dark:text-white">$125M</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between text-[12px] font-bold text-black dark:text-white">
              <span>Explore Archive</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 2: Founder Playbook */}
          <Link 
            to="/founder-playbook" 
            className="p-6 group flex flex-col justify-between transition-all bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] shadow-sm hover:border-black dark:hover:border-white"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#737373] dark:text-[#A3A3A3] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Tactical Plays
                </span>
                <BookOpen className="w-5 h-5 text-black dark:text-white" />
              </div>
              <h3 className="text-[17px] font-bold text-black dark:text-white group-hover:underline transition-colors">
                Founder Playbook
              </h3>
              <p className="text-[13px] text-[#737373] dark:text-[#A3A3A3] mt-1 leading-relaxed">
                Defensive rules and counter-measures extracted from 413+ historical collapse post-mortems.
              </p>

              <div className="mt-4 p-3 rounded-[6px] text-[11px] space-y-1 bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="font-bold flex items-center gap-1.5 text-black dark:text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                  <span>Rule: Validate Margin Before Scale</span>
                </div>
                <p className="line-clamp-2 text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
                  "Never subsidize gross unit economics with venture equity under the assumption of future operational scale."
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between text-[12px] font-bold text-black dark:text-white">
              <span>Explore Playbook</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 3: Risk Scanner */}
          <Link 
            to="/risk-scanner" 
            className="p-6 group flex flex-col justify-between transition-all bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] shadow-sm hover:border-black dark:hover:border-white"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#737373] dark:text-[#A3A3A3] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Defensive Tool
                </span>
                <ShieldAlert className="w-5 h-5 text-black dark:text-white" />
              </div>
              <h3 className="text-[17px] font-bold text-black dark:text-white group-hover:underline transition-colors">
                Risk Scanner
              </h3>
              <p className="text-[13px] text-[#737373] dark:text-[#A3A3A3] mt-1 leading-relaxed">
                Stress-test your startup idea against historical failure distributions.
              </p>

              <div className="mt-4 p-3 rounded-[6px] text-[11px] space-y-1.5 bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-black dark:text-white">CALCULATED RISK SCORE</span>
                  <span className="text-black dark:text-white font-extrabold tabular-nums">72 / 100</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden bg-[#E5E5E5] dark:bg-[#2A2A2A]">
                  <div className="h-full rounded-full bg-black dark:bg-white" style={{ width: '72%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-[#737373] dark:text-[#A3A3A3] font-semibold">
                  <span>Unit Economics: HIGH</span>
                  <span>Competition: HIGH</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between text-[12px] font-bold text-black dark:text-white">
              <span>Run Risk Scan</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 4: Pitch Deck Autopsy */}
          <Link 
            to="/pitch-deck-autopsy" 
            className="p-6 group flex flex-col justify-between transition-all bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] shadow-sm hover:border-black dark:hover:border-white"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#737373] dark:text-[#A3A3A3] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Pre-Seed / Seed
                </span>
                <FileText className="w-5 h-5 text-black dark:text-white" />
              </div>
              <h3 className="text-[17px] font-bold text-black dark:text-white group-hover:underline transition-colors">
                Pitch Deck Autopsy
              </h3>
              <p className="text-[13px] text-[#737373] dark:text-[#A3A3A3] mt-1 leading-relaxed">
                Audit pitch decks against historical failure traps and valuation fallacies.
              </p>

              <div className="mt-4 p-3 rounded-[6px] text-[11px] space-y-1 bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="flex items-center gap-1.5 font-bold text-black dark:text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                  <span>Slide 4: Unit Economics Trap</span>
                </div>
                <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
                  CAC calculation omits sales overhead, creating false margin projections.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between text-[12px] font-bold text-black dark:text-white">
              <span>Audit Pitch Deck</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 5: Founder Confessions */}
          <Link 
            to="/founder-confessions" 
            className="p-6 group flex flex-col justify-between transition-all bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] shadow-sm hover:border-black dark:hover:border-white"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#737373] dark:text-[#A3A3A3] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Social Debriefs
                </span>
                <MessageSquare className="w-5 h-5 text-black dark:text-white" />
              </div>
              <h3 className="text-[17px] font-bold text-black dark:text-white group-hover:underline transition-colors">
                Founder Confessions
              </h3>
              <p className="text-[13px] text-[#737373] dark:text-[#A3A3A3] mt-1 leading-relaxed">
                Raw failure debriefs and candid post-mortems from real founders on 𝕏 and Reddit.
              </p>

              <div className="mt-4 p-3 rounded-[6px] text-[11px] space-y-1 bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="font-bold text-black dark:text-white">
                  r/startups & 𝕏 Convos
                </div>
                <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                  “Burned $2.1M before realizing CAC exceeded cohort LTV.”
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between text-[12px] font-bold text-black dark:text-white">
              <span>Read Confessions</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 6: Hall of Ghosts */}
          <Link 
            to="/hall-of-ghosts" 
            className="p-6 group flex flex-col justify-between transition-all bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] shadow-sm hover:border-black dark:hover:border-white"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#737373] dark:text-[#A3A3A3] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  AI Debrief
                </span>
                <Users className="w-5 h-5 text-black dark:text-white" />
              </div>
              <h3 className="text-[17px] font-bold text-black dark:text-white group-hover:underline transition-colors">
                Hall of Ghosts
              </h3>
              <p className="text-[13px] text-[#737373] dark:text-[#A3A3A3] mt-1 leading-relaxed">
                Interview AI personas reconstructed from court records and post-mortem testimonies.
              </p>

              <div className="mt-4 p-3 rounded-[6px] text-[11px] space-y-1 bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="font-bold text-black dark:text-white">
                  Ghost: Adam Neumann (WeWork)
                </div>
                <p className="italic line-clamp-1 text-[#737373] dark:text-[#A3A3A3]">
                  "We mistook access to unlimited venture capital for structural market validation."
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between text-[12px] font-bold text-black dark:text-white">
              <span>Enter Hall of Ghosts</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 9. Section: Risk Scanner Live Interactive Preview */}
      <section className="site-container py-12 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="p-8 lg:p-10 rounded-[8px] bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 mb-1 px-2.5 py-1 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] text-[11px] font-bold uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Risk Scanner Demo</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-white">
                Scan Your Startup Idea
              </h2>
              
              <p className="text-[15px] text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
                How does your business model compare with historical failures? Stress-test your assumptions against 413+ autopsy distributions.
              </p>

              <div className="space-y-3 pt-2">
                <label className="text-[12px] font-bold uppercase tracking-wider block text-black dark:text-white">
                  Describe Your Startup Model:
                </label>
                <textarea
                  value={demoIdea}
                  onChange={(e) => setDemoIdea(e.target.value)}
                  rows={3}
                  className="w-full p-3.5 text-[14px] rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                />

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRunDemoScan}
                    disabled={isScanning}
                    className="btn-primary px-6 py-3 rounded-[6px] text-[13px] font-bold uppercase tracking-wide cursor-pointer transition-all disabled:opacity-50"
                  >
                    {isScanning ? 'Analyzing Patterns...' : 'RUN RISK SCAN →'}
                  </button>
                  <Link to="/risk-scanner" className="text-[13px] font-bold text-black dark:text-white hover:underline">
                    Full Scanner Suite →
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-6 p-6 space-y-5 bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px]">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="text-[12px] font-bold uppercase tracking-wider text-black dark:text-white">
                  DIAGNOSTIC RISK RESULT
                </span>
                <span className="flex items-center gap-1.5 bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] text-black dark:text-white rounded-[4px] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                  {scanResult.rating}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-bold text-[#737373] dark:text-[#A3A3A3]">
                    FAILURE RISK INDEX
                  </div>
                  <div className="text-4xl font-extrabold text-black dark:text-white tabular-nums">
                    {scanResult.score} <span className="text-xl text-[#737373] dark:text-[#A3A3A3]">/ 100</span>
                  </div>
                </div>
                <div className="text-right text-[12px] text-[#737373] dark:text-[#A3A3A3]">
                  <span>Confidence: <strong className="text-black dark:text-white">94%</strong></span> <br />
                  <span>Autopsy Correlates: <strong className="text-black dark:text-white">3 Matches</strong></span>
                </div>
              </div>

              {/* Category Risk Meters */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {scanResult.breakdown.map((item) => (
                  <div 
                    key={item.label} 
                    className="p-2.5 text-[12px] bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[6px]"
                  >
                    <div className="flex justify-between font-medium mb-1 text-black dark:text-white">
                      <span>{item.label}</span>
                      <span className={`font-bold ${item.level === 'HIGH' ? 'text-[#DC2626]' : 'text-black dark:text-white'}`}>
                        {item.level}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden bg-[#E5E5E5] dark:bg-[#2A2A2A]">
                      <div 
                        className="h-full rounded-full bg-black dark:bg-white"
                        style={{ width: `${item.val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Historical Matches */}
              <div className="pt-2 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="text-[11px] font-bold uppercase tracking-wider mb-2 text-[#737373] dark:text-[#A3A3A3]">
                  TOP 3 HISTORICAL AUTOPSY MATCHES:
                </div>
                <div className="space-y-1.5">
                  {scanResult.matches.map((m) => (
                    <div 
                      key={m.name} 
                      className="flex items-center justify-between text-[12px] p-2.5 bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[6px]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-black dark:text-white">{m.name}</span>
                        <span className="text-[#737373] dark:text-[#A3A3A3] text-[11px]">— {m.cause}</span>
                      </div>
                      <span className="font-bold text-[11px] text-black dark:text-white tabular-nums">
                        {m.similarity} Match
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 10. Section: Hall of Ghosts Preview */}
      <section className="site-container py-12 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="p-6 sm:p-8 lg:p-10 rounded-[8px] bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-xs">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] text-[11px] font-bold tracking-wider uppercase font-mono">
                <Users className="w-3.5 h-3.5" />
                <span>Forensic AI Personas</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
                HALL OF GHOSTS
              </h2>
              <p className="text-[14px] text-[#737373] dark:text-[#A3A3A3] mt-1 max-w-2xl">
                Interactive dialogue with reconstructed founders synthesized exclusively from sworn court depositions, SEC enforcement dockets, and verified investigative post-mortems.
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FAFAFA] dark:bg-[#111111] text-[#737373] dark:text-[#A3A3A3] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <ShieldAlert className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Court & SEC Filings Compliant</span>
              </span>
            </div>
          </div>

          {/* Persona Switcher Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
            {Object.keys(ghostProfiles).map((key) => {
              const p = ghostProfiles[key];
              const isSelected = activeGhost === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveGhost(key)}
                  className={`p-3 rounded-[6px] text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected 
                      ? 'border-black dark:border-white bg-[#F5F5F5] dark:bg-[#181818] shadow-xs ring-1 ring-black dark:ring-white' 
                      : 'border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-black hover:border-[#A3A3A3] dark:hover:border-[#525252]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`w-7 h-7 rounded-[4px] font-mono font-bold text-[11px] flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                        : 'bg-[#F0F0F0] dark:bg-[#1C1C1C] text-black dark:text-white border-[#E5E5E5] dark:border-[#2A2A2A]'
                    }`}>
                      {p.avatar}
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-[3px] bg-[#F5F5F5] dark:bg-[#202020] text-[#737373] dark:text-[#A3A3A3]">
                      {p.industry}
                    </span>
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-black dark:text-white leading-tight">
                      {p.name.split(' ')[0]}
                    </div>
                    <div className="text-[11px] text-[#737373] dark:text-[#A3A3A3] font-mono">
                      {p.startup}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Dialogue Console */}
          {(() => {
            const currentProfile = ghostProfiles[activeGhost] || ghostProfiles.adam;
            const currentDialogue = currentProfile.dialogues[activeGhostQuestion] || currentProfile.dialogues.warning;

            return (
              <div className="rounded-[8px] border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#0D0D0D] overflow-hidden">
                {/* Simulation Control Bar */}
                <div className="px-4 py-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-black flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-xs font-bold text-black dark:text-white tracking-tight">
                      Active Debrief: {currentProfile.name} ({currentProfile.startup})
                    </span>
                    <span className="text-[#D4D4D4] dark:text-[#404040] hidden sm:inline">•</span>
                    <span className="text-[11px] font-mono text-rose-600 dark:text-rose-400 font-semibold hidden sm:inline">
                      {currentProfile.stat}
                    </span>
                  </div>

                  {/* Interactive Question Pill Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                    <span className="text-[10px] font-mono uppercase text-[#737373] mr-1 hidden md:inline">
                      Probe Vector:
                    </span>
                    <button
                      onClick={() => setActiveGhostQuestion('warning')}
                      className={`px-2.5 py-1 text-[11px] font-mono font-medium rounded-[4px] border transition-colors shrink-0 cursor-pointer ${
                        activeGhostQuestion === 'warning'
                          ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white font-bold'
                          : 'bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#737373] dark:text-[#A3A3A3] border-[#E5E5E5] dark:border-[#2A2A2A] hover:text-black dark:hover:text-white'
                      }`}
                    >
                      Warning Signs
                    </button>
                    <button
                      onClick={() => setActiveGhostQuestion('governance')}
                      className={`px-2.5 py-1 text-[11px] font-mono font-medium rounded-[4px] border transition-colors shrink-0 cursor-pointer ${
                        activeGhostQuestion === 'governance'
                          ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white font-bold'
                          : 'bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#737373] dark:text-[#A3A3A3] border-[#E5E5E5] dark:border-[#2A2A2A] hover:text-black dark:hover:text-white'
                      }`}
                    >
                      Governance Breakdown
                    </button>
                    <button
                      onClick={() => setActiveGhostQuestion('lesson')}
                      className={`px-2.5 py-1 text-[11px] font-mono font-medium rounded-[4px] border transition-colors shrink-0 cursor-pointer ${
                        activeGhostQuestion === 'lesson'
                          ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white font-bold'
                          : 'bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#737373] dark:text-[#A3A3A3] border-[#E5E5E5] dark:border-[#2A2A2A] hover:text-black dark:hover:text-white'
                      }`}
                    >
                      Core Takeaway
                    </button>
                  </div>
                </div>

                {/* Conversation Body */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* User Question */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-[6px] flex items-center justify-center font-mono font-bold text-[11px] shrink-0 bg-black text-white dark:bg-white dark:text-black">
                      YOU
                    </div>
                    <div className="p-3.5 text-[13px] font-medium bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] text-black dark:text-white shadow-xs max-w-2xl">
                      "{currentDialogue.q}"
                    </div>
                  </div>

                  {/* Reconstructed Ghost Response */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-[6px] flex items-center justify-center font-mono font-bold text-[11px] shrink-0 bg-white dark:bg-black text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]">
                      {currentProfile.avatar}
                    </div>
                    <div className="p-4 sm:p-5 text-[14px] leading-relaxed space-y-3 bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] text-black dark:text-white shadow-xs flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#F0F0F0] dark:border-[#1F1F1F]">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3]">
                          {currentProfile.name} • {currentProfile.startup} Testimony
                        </span>
                        <span className="text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                          Synthesized from Public Evidence
                        </span>
                      </div>

                      <p className="text-[13px] sm:text-[14px] text-[#262626] dark:text-[#E5E5E5] leading-relaxed">
                        "{currentDialogue.a}"
                      </p>

                      {/* Forensic Lesson Callout Box */}
                      <div className="p-3 rounded-[6px] bg-[#FAFAFA] dark:bg-[#121212] border-l-2 border-black dark:border-white text-[12px]">
                        <span className="font-bold text-black dark:text-white font-mono uppercase text-[11px] tracking-wider block mb-0.5">
                          Core Forensic Lesson:
                        </span>
                        <span className="text-[#525252] dark:text-[#CCCCCC]">
                          {currentDialogue.lesson}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="px-5 py-3.5 bg-white dark:bg-black border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <span className="text-[#737373] dark:text-[#A3A3A3] text-[11px]">
                    Reconstructed models derived from public trial records. Does not represent live statements by living founders.
                  </span>
                  <Link 
                    to="/hall-of-ghosts" 
                    className="inline-flex items-center gap-2 px-4 py-2 text-[12px] font-bold rounded-[6px] bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity uppercase tracking-wider shrink-0"
                  >
                    <span>Enter Hall of Ghosts (6 Personas)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* 11. Section: Recently Vaulted / Curated Startup Post-Mortems */}
      <section className="site-container py-12 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] text-[11px] font-bold uppercase tracking-wider">
              <span>Recent Autopsies</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
              Recently Vaulted Startups
            </h2>
            <p className="text-[14px] text-[#737373] dark:text-[#A3A3A3] mt-1">
              Examining the most instructive multi-million and multi-billion dollar startup collapses.
            </p>
          </div>

          <Link
            to="/explore"
            className="shrink-0 font-bold text-[13px] text-black dark:text-white hover:underline flex items-center gap-1"
          >
            <span>Explore All 413+ Records</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredStartups.map((startup) => (
            <StartupCard key={startup.id} startup={startup} />
          ))}
        </div>
      </section>

      {/* 12. Section: AI Signals & Global Failure Intelligence */}
      <section className="site-container py-12 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: AI Signals */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xl font-extrabold text-black dark:text-white tracking-tight">AI SIGNALS FEED</h3>
                <p className="text-[13px] text-[#737373] dark:text-[#A3A3A3]">Live heuristic alerts generated across the archive</p>
              </div>
              <span className="px-2.5 py-1 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] text-[10px] font-bold uppercase tracking-wider">
                Real-Time Rules
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] hover:border-black dark:hover:border-white transition-all shadow-sm">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase mb-1">
                  <span className="flex items-center gap-1.5 text-black dark:text-white">
                    <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                    PATTERN DETECTED
                  </span>
                  <span className="text-[#737373] dark:text-[#A3A3A3]">10m ago</span>
                </div>
                <h4 className="text-[14px] font-bold text-black dark:text-white">
                  Hardware Unit Economics Threshold
                </h4>
                <p className="text-[12px] text-[#737373] dark:text-[#A3A3A3] mt-1 leading-relaxed">
                  Unit economics deterioration appears repeatedly across documented consumer hardware failures (Juicero, Pebble, Lily Robotics).
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] hover:border-black dark:hover:border-white transition-all shadow-sm">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase mb-1">
                  <span className="flex items-center gap-1.5 text-black dark:text-white">
                    <span className="w-2 h-2 rounded-full bg-black dark:bg-white" />
                    HISTORICAL PARALLEL
                  </span>
                  <span className="text-[#737373] dark:text-[#A3A3A3]">1h ago</span>
                </div>
                <h4 className="text-[14px] font-bold text-black dark:text-white">
                  On-Demand Delivery Margin Compression
                </h4>
                <p className="text-[12px] text-[#737373] dark:text-[#A3A3A3] mt-1 leading-relaxed">
                  Current quick-commerce subsidies mirror 1999–2001 dot-com logistics collapses (Webvan, Kozmo).
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] hover:border-black dark:hover:border-white transition-all shadow-sm">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase mb-1">
                  <span className="flex items-center gap-1.5 text-black dark:text-white">
                    <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                    RISK SIGNAL
                  </span>
                  <span className="text-[#737373] dark:text-[#A3A3A3]">3h ago</span>
                </div>
                <h4 className="text-[14px] font-bold text-black dark:text-white">
                  Extreme Customer Acquisition Burn
                </h4>
                <p className="text-[12px] text-[#737373] dark:text-[#A3A3A3] mt-1 leading-relaxed">
                  Startups spending &gt;80% of venture equity on paid marketing without organic retention suffer 92% mortality when funding dries up.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Global Footprint */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xl font-extrabold text-black dark:text-white tracking-tight">GLOBAL FAILURE INTELLIGENCE</h3>
                <p className="text-[13px] text-[#737373] dark:text-[#A3A3A3]">Geographic footprint of 413+ startup post-mortems</p>
              </div>
              <Globe className="w-5 h-5 text-black dark:text-white" />
            </div>

            <div className="p-6 space-y-5 bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] shadow-sm">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 rounded-[6px]">
                  <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">413+</div>
                  <div className="text-[10px] font-bold uppercase text-blue-700 dark:text-blue-300 tracking-wider mt-0.5">Startups</div>
                </div>
                <div className="p-3 bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-900/40 rounded-[6px]">
                  <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 tabular-nums">40+</div>
                  <div className="text-[10px] font-bold uppercase text-purple-700 dark:text-purple-300 tracking-wider mt-0.5">Countries</div>
                </div>
                <div className="p-3 bg-gradient-to-br from-rose-600 to-rose-700 text-white rounded-[6px] shadow-sm">
                  <div className="text-2xl font-extrabold tabular-nums">14</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider mt-0.5 text-rose-100">Vectors</div>
                </div>
              </div>

              {/* Regional Concentration Bars */}
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between text-[12px] font-medium mb-1 text-black dark:text-white">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      North America (Silicon Valley, NY, Austin)
                    </span>
                    <span className="font-bold tabular-nums text-blue-600 dark:text-blue-400">68%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden bg-[#E5E5E5] dark:bg-[#2A2A2A]">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: '68%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[12px] font-medium mb-1 text-black dark:text-white">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                      Europe (London, Berlin, Paris)
                    </span>
                    <span className="font-bold tabular-nums text-purple-600 dark:text-purple-400">18%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden bg-[#E5E5E5] dark:bg-[#2A2A2A]">
                    <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-600" style={{ width: '18%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[12px] font-medium mb-1 text-black dark:text-white">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      Asia-Pacific (Bengaluru, Singapore, Sydney)
                    </span>
                    <span className="font-bold tabular-nums text-emerald-600 dark:text-emerald-400">11%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden bg-[#E5E5E5] dark:bg-[#2A2A2A]">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600" style={{ width: '11%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[12px] font-medium mb-1 text-black dark:text-white">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      Latin America & Rest of World
                    </span>
                    <span className="font-bold tabular-nums text-amber-600 dark:text-amber-400">3%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden bg-[#E5E5E5] dark:bg-[#2A2A2A]">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600" style={{ width: '3%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. Section: Built on Public Evidence */}
      <section className="site-container py-12 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="p-8 rounded-[8px] bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-sm">
          <div className="text-center mb-8">
            <span className="inline-block mb-1.5 font-bold uppercase tracking-wider text-black dark:text-white text-[11px]">
              TRUST & VERIFIABILITY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
              BUILT ON PUBLIC EVIDENCE
            </h2>
            <p className="text-[14px] text-[#737373] dark:text-[#A3A3A3] mt-1 max-w-xl mx-auto">
              PivotVault does not rely on anonymous gossip. Every failure score, timeline, and metric is anchored in verifiable records.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            {[
              { label: 'SEC FILINGS', desc: '10-K, S-1 & Bankruptcy petitions' },
              { label: 'INVESTIGATIVE NEWS', desc: 'Verified WSJ, FT & Bloomberg reporting' },
              { label: 'FOUNDER INTERVIEWS', desc: 'On-record post-mortem debriefs' },
              { label: 'POST-MORTEMS', desc: 'Official company shutdown letters' },
              { label: 'COMPANY HISTORY', desc: 'Incorporation & cap table filings' },
              { label: 'MARKET DATA', desc: 'Public trading & macro benchmark data' }
            ].map((source) => (
              <div 
                key={source.label} 
                className="p-3.5 bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[6px]"
              >
                <CheckCircle2 className="w-4 h-4 text-black dark:text-white mx-auto mb-2" />
                <h4 className="text-[11px] font-bold uppercase text-black dark:text-white tracking-wider">{source.label}</h4>
                <p className="text-[10px] text-[#737373] dark:text-[#A3A3A3] mt-1">{source.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. Section: FAQ Section */}
      <section className="site-container py-12 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-1 text-[14px] text-[#737373] dark:text-[#A3A3A3]">
              Understanding PivotVault's failure taxonomy and research methodology
            </p>
          </div>

          <div className="space-y-3.5">
            {[
              {
                q: 'What is PivotVault?',
                a: 'PivotVault is a Bloomberg-style Startup Intelligence Platform. We systematically index, analyze, and map 413+ verified startup collapses to help founders and investors make evidence-backed survival decisions.'
              },
              {
                q: 'How is the Failure Score (FS) calculated?',
                a: 'The Failure Score (0-100) quantifies capital vaporization efficiency, governance breakdown severity, root cause irreversibility, and defect-to-scale ratios derived from SEC filings and forensic post-mortems.'
              },
              {
                q: 'Can PivotVault work offline or connect to a custom backend?',
                a: 'Yes. PivotVault features a robust dual-layer data architecture with seamless offline intelligence fallbacks alongside real-time REST API integration.'
              },
              {
                q: 'What makes the Hall of Ghosts unique?',
                a: 'Hall of Ghosts reconstructs historical founder personas exclusively from verified public testimonies, regulatory filings, and post-mortems, enabling interactive diagnostic debriefs.'
              }
            ].map((faq, idx) => (
              <div 
                key={idx} 
                className="p-5 bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] shadow-sm"
              >
                <h4 className="text-[15px] font-bold flex items-center gap-2 text-black dark:text-white">
                  <span className="font-bold text-black dark:text-white">Q:</span>
                  <span>{faq.q}</span>
                </h4>
                <p className="mt-2 text-[13px] sm:text-[14px] leading-relaxed pl-5 text-[#737373] dark:text-[#A3A3A3]">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. Section: Final CTA */}
      <section className="site-container py-12">
        <div className="p-10 lg:p-14 text-center rounded-[8px] bg-black text-white border border-[#2A2A2A] shadow-lg">
          <span className="block mb-2 text-[11px] font-mono font-bold uppercase tracking-widest text-[#A3A3A3]">
            THE SURVIVAL MANDATE
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white max-w-3xl mx-auto leading-tight tracking-tight">
            DON'T REPEAT HISTORY.
          </h2>
          <p className="mt-4 text-[15px] sm:text-[17px] text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed">
            Explore the failures. Understand the patterns. Make the next decision better before writing code or raising capital.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            <Link 
              to="/explore" 
              className="px-6 py-3.5 text-[14px] font-bold rounded-[6px] bg-white text-black hover:bg-[#E5E5E5] transition-colors cursor-pointer"
            >
              EXPLORE FAILURE ARCHIVE →
            </Link>
            <Link 
              to="/risk-scanner" 
              className="px-6 py-3.5 text-[14px] font-bold rounded-[6px] border border-white bg-transparent text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
            >
              SCAN YOUR STARTUP →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
