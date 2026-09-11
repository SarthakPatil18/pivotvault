import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, ShieldAlert, Sparkles, TrendingDown, ArrowRight, 
  Activity, Database, Flame, HelpCircle, Layers, Users, 
  FileText, BarChart3, Scale, Globe, CheckCircle2, ChevronRight,
  AlertTriangle, Network, Cpu, ArrowUpRight, Lock, Eye, Compass,
  BookOpen, Gauge, Brain
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
  const [activeGraphNode, setActiveGraphNode] = useState('wework');
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
    setTimeout(() => {
      setIsScanning(false);
    }, 600);
  };

  // Failure vectors for horizontal bar visualization
  const failureVectors = [
    { label: 'Unit Economics Collapse', pct: 28, count: 116, isHighRisk: true },
    { label: 'Lack of Market Need / PMF', pct: 22, count: 91, isHighRisk: false },
    { label: 'Execution & Operations', pct: 17, count: 70, isHighRisk: false },
    { label: 'Competition & Moat Deficit', pct: 14, count: 58, isHighRisk: false },
    { label: 'Runway Exhaustion / Burn', pct: 9, count: 37, isHighRisk: false },
    { label: 'Fraud & Governance Failure', pct: 5, count: 21, isHighRisk: false },
    { label: 'Hardware & Manufacturing', pct: 3, count: 12, isHighRisk: false },
    { label: 'Regulatory & Legal Block', pct: 2, count: 8, isHighRisk: false },
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

  // Knowledge graph nodes for preview
  const graphEntities = {
    wework: {
      name: 'WeWork',
      type: 'Startup ($12.8B Vaporized)',
      description: 'Arbitraging long-term commercial leases with short-term subleases disguised as tech platform.',
      connections: [
        { name: 'Adam Neumann', role: 'Founder / CEO' },
        { name: 'SoftBank Vision Fund', role: 'Lead Investor ($10B+)' },
        { name: 'Real Estate / PropTech', role: 'Core Sector' },
        { name: 'Unit Economics Collapse', role: 'Fatal Vector' },
        { name: 'Governance Void', role: 'Contributing Factor' }
      ]
    },
    theranos: {
      name: 'Theranos',
      type: 'Startup ($1.4B Vaporized)',
      description: 'Claimed automated micro-blood testing without peer-reviewed validation or working hardware.',
      connections: [
        { name: 'Elizabeth Holmes', role: 'Founder / CEO' },
        { name: 'Walgreens / Safeway', role: 'Commercial Partners' },
        { name: 'HealthTech & Biotech', role: 'Sector' },
        { name: 'Fraud & Regulatory Shutdown', role: 'Fatal Vector' },
        { name: 'Board Secrecy', role: 'Governance Failure' }
      ]
    },
    fast: {
      name: 'Fast',
      type: 'Startup ($125M Vaporized)',
      description: '1-click checkout platform spending $10M/month to generate $50k in ARR.',
      connections: [
        { name: 'Domm Holland', role: 'Founder / CEO' },
        { name: 'Stripe', role: 'Lead Investor ($102M)' },
        { name: 'FinTech & E-Commerce', role: 'Sector' },
        { name: 'Burn Rate Exhaustion', role: 'Fatal Vector' },
        { name: 'Extreme CAC vs LTV', role: 'Model Trap' }
      ]
    },
    quibi: {
      name: 'Quibi',
      type: 'Startup ($1.75B Vaporized)',
      description: 'Short-form Hollywood streaming mobile app launched against free TikTok & YouTube ecosystems.',
      connections: [
        { name: 'Jeffrey Katzenberg', role: 'Founder' },
        { name: 'Meg Whitman', role: 'CEO' },
        { name: 'Disney & WarnerMedia', role: 'Media Investors' },
        { name: 'Lack of Market Need', role: 'Fatal Vector' },
        { name: 'No Social Sharing Moat', role: 'Product Trap' }
      ]
    }
  };

  // Ghost dialogues
  const ghostProfiles = {
    adam: {
      name: 'Adam Neumann',
      startup: 'WeWork',
      stat: '$12.8B Evaporated',
      quote: "The biggest signal wasn't the competition. It was our assumption that massive capital could bend unit economics into a tech multiple. We built 15-year lease obligations on 30-day member commitments.",
      lesson: 'Never disguise real estate arbitrage as software recurring revenue.'
    },
    elizabeth: {
      name: 'Elizabeth Holmes',
      startup: 'Theranos',
      stat: '$1.4B Evaporated',
      quote: "We convinced ourselves that protecting the vision justified obfuscating the engineering timeline. The board had stellar political prestige but zero biomedical diagnostic forensic capability.",
      lesson: 'Engineering truth always surfaces before clinical scale.'
    },
    domm: {
      name: 'Domm Holland',
      startup: 'Fast',
      stat: '$125M Evaporated',
      quote: "We hired 400+ people before we proved merchants actually generated sustainable transaction volume. PR and hockey-stick headcount masked an 80:1 burn-to-revenue ratio.",
      lesson: 'Headcount is a cost multiplier, not a traction metric.'
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
            <span>Capital Evaporated: <strong className="text-black dark:text-white font-extrabold tabular-nums">$26.8B+</strong></span>
            <span className="text-[#D4D4D4] dark:text-[#404040]">•</span>
            <span>Top Failure Vector: <strong className="text-black dark:text-white font-bold">Unit Economics (28%)</strong></span>
            <span className="text-[#D4D4D4] dark:text-[#404040]">•</span>
            <span>AI Reasoning: <strong className="text-black dark:text-white font-bold">Active Dual-Layer</strong></span>
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
              PivotVault synthesizes 413+ historical startup autopsies, forensic post-mortems, and knowledge graphs into defensive intelligence for founders and investors.
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
                <div className="p-3 bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px]">
                  <div className="text-[22px] leading-tight font-extrabold text-black dark:text-white tabular-nums">
                    413+
                  </div>
                  <div className="mt-0.5 uppercase text-[#737373] dark:text-[#A3A3A3] text-[11px] font-semibold">
                    Startups
                  </div>
                </div>

                <div className="p-3 bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px]">
                  <div className="text-[22px] leading-tight font-extrabold text-black dark:text-white tabular-nums">
                    14
                  </div>
                  <div className="mt-0.5 uppercase text-[#737373] dark:text-[#A3A3A3] text-[11px] font-semibold">
                    Vectors
                  </div>
                </div>

                {/* Highlighted Stat Card ($26.8B+ EVAPORATED) */}
                <div className="p-3 bg-black dark:bg-white border border-black dark:border-white rounded-[8px] text-white dark:text-black">
                  <div className="text-[22px] leading-tight font-extrabold tabular-nums">
                    $26.8B+
                  </div>
                  <div className="mt-0.5 uppercase text-[11px] font-bold tracking-wider opacity-80">
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
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                        Unit Economics Collapse
                      </span>
                      <span className="text-black dark:text-white font-extrabold tabular-nums">
                        28%
                      </span>
                    </div>
                    <div className="w-full rounded-full overflow-hidden bg-[#E5E5E5] dark:bg-[#2A2A2A] h-1.5">
                      <div className="h-full rounded-full bg-black dark:bg-white" style={{ width: '28%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span className="text-[#737373] dark:text-[#A3A3A3]">Product-Market Fit Deficit</span>
                      <span className="text-black dark:text-white font-bold tabular-nums">22%</span>
                    </div>
                    <div className="w-full rounded-full overflow-hidden bg-[#E5E5E5] dark:bg-[#2A2A2A] h-1.5">
                      <div className="h-full rounded-full bg-[#404040] dark:bg-[#D4D4D4]" style={{ width: '22%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span className="text-[#737373] dark:text-[#A3A3A3]">Execution Void</span>
                      <span className="text-black dark:text-white font-bold tabular-nums">17%</span>
                    </div>
                    <div className="w-full rounded-full overflow-hidden bg-[#E5E5E5] dark:bg-[#2A2A2A] h-1.5">
                      <div className="h-full rounded-full bg-[#737373] dark:bg-[#A3A3A3]" style={{ width: '17%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span className="text-[#737373] dark:text-[#A3A3A3]">Competition & Platform Moat</span>
                      <span className="text-black dark:text-white font-bold tabular-nums">14%</span>
                    </div>
                    <div className="w-full rounded-full overflow-hidden bg-[#E5E5E5] dark:bg-[#2A2A2A] h-1.5">
                      <div className="h-full rounded-full bg-[#A3A3A3] dark:bg-[#737373]" style={{ width: '14%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* KNOWLEDGE GRAPH CONNECTOR */}
              <div className="p-3.5 bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-[#737373] dark:text-[#A3A3A3] text-[11px] uppercase font-bold tracking-wider">
                    <Network className="w-3.5 h-3.5 text-black dark:text-white" />
                    KNOWLEDGE GRAPH CONNECTOR
                  </span>
                  <Link 
                    to="/startup-graph" 
                    className="hover:underline flex items-center font-bold text-black dark:text-white text-[11px]"
                  >
                    Full Graph →
                  </Link>
                </div>
                
                <div className="flex items-center justify-between gap-1 py-1">
                  {['wework', 'theranos', 'fast', 'quibi'].map((key) => {
                    const isActive = activeGraphNode === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveGraphNode(key)}
                        className={`px-2.5 py-1 text-[11px] font-bold capitalize transition-colors rounded-[4px] cursor-pointer ${
                          isActive 
                            ? 'bg-black text-white dark:bg-white dark:text-black' 
                            : 'text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white'
                        }`}
                      >
                        {key}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 p-2.5 bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[6px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CompanyLogo name={graphEntities[activeGraphNode].name} size="xs" />
                      <span className="font-bold text-[13px] text-black dark:text-white">
                        {graphEntities[activeGraphNode].name}
                      </span>
                    </div>
                    <span className="font-bold text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                      {graphEntities[activeGraphNode].type}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-[13px] text-[#737373] dark:text-[#A3A3A3]">
                    {graphEntities[activeGraphNode].description}
                  </p>
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

        {/* 4 Analytics Metric Cards - Strict B&W */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: TOTAL FAILURES */}
          <div className="bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] p-6 shadow-sm hover:border-black dark:hover:border-white transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className="text-[#737373] dark:text-[#A3A3A3] text-[11px] font-bold uppercase tracking-wider">
                  TOTAL FAILURES
                </span>
              </div>
              <span className="bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                +18
              </span>
            </div>
            <div className="flex items-end justify-between mb-3">
              <div className="text-3xl sm:text-4xl font-extrabold text-black dark:text-white tabular-nums tracking-tight leading-none">
                413
              </div>
              <MiniSparkline
                data={[20, 32, 28, 45, 42, 58, 62, 55, 72, 75]}
                stroke="#000000"
                fill="rgba(0, 0, 0, 0.08)"
              />
            </div>
            <div className="text-[#737373] dark:text-[#A3A3A3] text-[12px] font-medium">
              This quarter
            </div>
          </div>

          {/* Card 2: VAULTED STARTUPS */}
          <div className="bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] p-6 shadow-sm hover:border-black dark:hover:border-white transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-[#737373] dark:text-[#A3A3A3] text-[11px] font-bold uppercase tracking-wider">
                  VAULTED STARTUPS
                </span>
              </div>
              <span className="bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                +214
              </span>
            </div>
            <div className="flex items-end justify-between mb-3">
              <div className="text-3xl sm:text-4xl font-extrabold text-black dark:text-white tabular-nums tracking-tight leading-none">
                413
              </div>
              <MiniSparkline
                data={[30, 34, 38, 42, 41, 46, 50, 54, 55, 60]}
                stroke="#404040"
                fill="rgba(0, 0, 0, 0.05)"
              />
            </div>
            <div className="text-[#737373] dark:text-[#A3A3A3] text-[12px] font-medium">
              With postmortems
            </div>
          </div>

          {/* Card 3: AVG RISK SCORE */}
          <div className="bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] p-6 shadow-sm hover:border-black dark:hover:border-white transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <Gauge className="w-4 h-4" />
                </div>
                <span className="text-[#737373] dark:text-[#A3A3A3] text-[11px] font-bold uppercase tracking-wider">
                  AVG RISK SCORE
                </span>
              </div>
              <span className="bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                +3.2
              </span>
            </div>
            <div className="flex items-end justify-between mb-3">
              <div className="text-3xl sm:text-4xl font-extrabold text-black dark:text-white tabular-nums tracking-tight leading-none">
                68.4
              </div>
              <MiniSparkline
                data={[55, 58, 60, 62, 61, 65, 66, 67, 68, 68.4]}
                stroke="#737373"
                fill="rgba(0, 0, 0, 0.04)"
              />
            </div>
            <div className="text-[#737373] dark:text-[#A3A3A3] text-[12px] font-medium">
              All analyzed startups
            </div>
          </div>

          {/* Card 4: AI INSIGHTS GENERATED */}
          <div className="bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] p-6 shadow-sm hover:border-black dark:hover:border-white transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <Brain className="w-4 h-4" />
                </div>
                <span className="text-[#737373] dark:text-[#A3A3A3] text-[11px] font-bold uppercase tracking-wider">
                  AI INSIGHTS
                </span>
              </div>
              <span className="bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                +1,204
              </span>
            </div>
            <div className="flex items-end justify-between mb-3">
              <div className="text-3xl sm:text-4xl font-extrabold text-black dark:text-white tabular-nums tracking-tight leading-none">
                48,209
              </div>
              <MiniSparkline
                data={[10, 18, 22, 28, 32, 38, 45, 48, 52, 56]}
                stroke="#1A1A1A"
                fill="rgba(0, 0, 0, 0.05)"
              />
            </div>
            <div className="text-[#737373] dark:text-[#A3A3A3] text-[12px] font-medium">
              Last 30 days
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
                    <span className={`flex items-center gap-2 ${vec.isHighRisk ? 'text-black dark:text-white font-bold' : 'text-[#737373] dark:text-[#A3A3A3] font-medium'}`}>
                      {vec.isHighRisk && (
                        <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                      )}
                      {vec.label}
                    </span>
                    <div className="flex items-center gap-3 text-[12px]">
                      <span className="text-[#737373] dark:text-[#A3A3A3]">{vec.count} cases</span>
                      <span className="font-bold tabular-nums text-black dark:text-white">
                        {vec.pct}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full rounded-full bg-[#E5E5E5] dark:bg-[#2A2A2A] h-1.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300 bg-black dark:bg-white"
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
                <span className="bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[4px] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                  Peak: 2022 Crunch
                </span>
              </div>

              {/* Bar visualization of annual failures - Grayscale */}
              <div className="mt-6 pt-4 grid grid-cols-9 gap-2 h-44 items-end pb-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                {trendData.map((d) => {
                  const heightPct = Math.round((d.failures / 84) * 100);
                  return (
                    <div key={d.year} className="flex flex-col items-center gap-2 group h-full justify-end">
                      <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[#737373] dark:text-[#A3A3A3] tabular-nums">
                        {d.failures}
                      </span>
                      <div 
                        className={`w-full rounded-t-[3px] transition-all ${d.isPeak ? 'bg-black dark:bg-white ring-1 ring-black dark:ring-white' : 'bg-[#737373] dark:bg-[#404040] hover:bg-black dark:hover:bg-white'}`}
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className={`text-[11px] font-bold ${d.isPeak ? 'text-black dark:text-white underline' : 'text-[#737373] dark:text-[#A3A3A3]'}`}>
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
              <span className="inline-block px-2 py-0.5 rounded-[4px] bg-white/10 text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider">
                DATASET-DERIVED METRIC
              </span>
              <div className="text-5xl sm:text-6xl font-extrabold text-white tabular-nums tracking-tight">
                $26.8B+
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">CAPITAL EVAPORATED</h3>
              <p className="text-[13px] sm:text-[14px] text-[#A3A3A3] leading-relaxed max-w-md">
                Total aggregate equity, debt, and venture capital associated with verified failure post-mortems in the PivotVault database.
              </p>
              <div className="pt-2">
                <Link 
                  to="/explore" 
                  className="inline-flex items-center justify-center px-5 py-2.5 text-[13px] font-bold rounded-[6px] bg-white text-black hover:bg-[#E5E5E5] transition-colors"
                >
                  Audit Financial Sinks →
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { name: 'WeWork', lost: '$12.8B', sector: 'PropTech', cause: 'Lease arbitrage vs 30-day flex' },
                { name: 'Quibi', lost: '$1.75B', sector: 'Streaming', cause: 'Hardware-agnostic mobile lock-in' },
                { name: 'Theranos', lost: '$1.4B', sector: 'HealthTech', cause: 'Unverified medical diagnostics' },
                { name: 'Better Place', lost: '$900M', sector: 'CleanTech', cause: 'EV battery-swap capex trap' },
                { name: 'Fast', lost: '$125M', sector: 'FinTech', cause: '$10M/mo burn with $50k ARR' },
                { name: 'Juicero', lost: '$120M', sector: 'Hardware', cause: '$400 press with hand-squeezable bag' }
              ].map((item) => (
                <div 
                  key={item.name} 
                  className="p-3.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-[6px] hover:border-white/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CompanyLogo name={item.name} size="xs" />
                      <span className="font-bold text-white text-[14px]">{item.name}</span>
                    </div>
                    <span className="font-extrabold text-white text-[14px] tabular-nums">
                      {item.lost}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#A3A3A3] font-bold uppercase tracking-wider mt-1">{item.sector}</div>
                  <div className="text-[12px] text-[#D4D4D4] mt-1 line-clamp-1">{item.cause}</div>
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
                    
                    // Grayscale intensity ramp
                    let cellBg = 'bg-[#F5F5F5] text-black dark:bg-[#1A1A1A] dark:text-[#A3A3A3]';
                    if (intensity === 5) {
                      cellBg = 'bg-black text-white dark:bg-white dark:text-black';
                    } else if (intensity === 4) {
                      cellBg = 'bg-[#404040] text-white';
                    } else if (intensity === 3) {
                      cellBg = 'bg-[#737373] text-white';
                    } else if (intensity === 2) {
                      cellBg = 'bg-[#D4D4D4] text-black';
                    }

                    return (
                      <td key={industry} className="py-2.5 px-2 text-center">
                        <button
                          onClick={() => setActiveHeatmapCell({ vector: row.name, industry, detail: row.detail })}
                          className={`w-10 h-8 rounded-[4px] text-[11px] font-bold transition-transform hover:scale-105 inline-flex items-center justify-center cursor-pointer ${cellBg} ${
                            isSelected ? 'ring-2 ring-black dark:ring-white scale-105' : ''
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

      {/* 6. Section: The Startup Failure Network */}
      <section className="site-container py-12 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] text-[11px] font-bold tracking-wider uppercase">
              <Network className="w-3.5 h-3.5" />
              <span>Relational Topology</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
              The Startup Failure Network
            </h2>
            <p className="text-[14px] text-[#737373] dark:text-[#A3A3A3] mt-1">
              Connect startups, founders, investors, markets, and failure causes. Explore cross-entity contagion.
            </p>
          </div>
          <Link 
            to="/startup-graph" 
            className="shrink-0 font-bold text-[13px] text-black dark:text-white hover:underline flex items-center gap-1"
          >
            <span>Launch Full Graph Engine</span>
            <span>→</span>
          </Link>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] shadow-sm">
          {/* Node Canvas Simulation */}
          <div className="lg:col-span-7 p-6 relative min-h-[340px] flex flex-col justify-between bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[6px]">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider pb-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] text-[#737373] dark:text-[#A3A3A3]">
              <span>INTERACTIVE CLUSTER VIEW</span>
              <span>413 NODES • 890 EDGES</span>
            </div>

            <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="flex items-center gap-2.5 flex-wrap justify-center">
                {Object.keys(graphEntities).map((key) => {
                  const isSelected = activeGraphNode === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveGraphNode(key)}
                      className={`px-3.5 py-1.5 rounded-[4px] text-[12px] font-bold uppercase transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm ring-1 ring-black dark:ring-white' 
                          : 'bg-white dark:bg-black text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-black dark:hover:border-white'
                      }`}
                    >
                      {graphEntities[key].name}
                    </button>
                  );
                })}
              </div>

              <div className="w-full max-w-md pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider mb-2 text-[#737373] dark:text-[#A3A3A3]">
                  DIRECTLY LINKED EDGES:
                </div>
                <div className="grid grid-cols-2 gap-2 text-left">
                  {graphEntities[activeGraphNode].connections.map((c, i) => (
                    <div 
                      key={i} 
                      className="p-2.5 text-[11px] bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[4px]"
                    >
                      <div className="font-bold line-clamp-1 text-black dark:text-white">{c.name}</div>
                      <div className="text-[#737373] dark:text-[#A3A3A3] text-[10px] mt-0.5">{c.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-[11px] flex items-center justify-between pt-2 border-t border-[#E5E5E5] dark:border-[#2A2A2A] text-[#737373] dark:text-[#A3A3A3]">
              <span>Click node to reveal relationship mapping</span>
              <span className="font-bold text-black dark:text-white">Selected: {graphEntities[activeGraphNode].name}</span>
            </div>
          </div>

          {/* Node Inspector Detail Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[6px]">
              <span className="mb-2 inline-block bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] text-black dark:text-white rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                Entity Dossier
              </span>
              <h3 className="text-xl font-bold text-black dark:text-white">
                {graphEntities[activeGraphNode].name}
              </h3>
              <div className="text-[12px] font-bold text-[#737373] dark:text-[#A3A3A3] mb-2 font-mono">
                {graphEntities[activeGraphNode].type}
              </div>
              <p className="text-[13px] text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
                {graphEntities[activeGraphNode].description}
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-black dark:text-white">
                Network Contagion Analysis
              </h4>
              <p className="text-[12px] text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
                Founders and lead investors who repeat high-burn strategies across portfolio companies carry a 2.4x higher repeat failure correlation.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Link 
                to="/startup-graph" 
                className="btn-primary px-4 py-2 text-[13px] font-bold rounded-[6px]"
              >
                Explore in 3D Graph →
              </Link>
              <Link 
                to={`/startup/${activeGraphNode}`} 
                className="vault-btn-secondary px-4 py-2 text-[13px] font-bold rounded-[6px]"
              >
                Read Autopsy
              </Link>
            </div>
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
              { num: '03. CONNECT', title: 'Knowledge Graph', desc: 'Map cross-entity founder, investor, and failure vector relationships.' },
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

          {/* Card 5: Knowledge Graph */}
          <Link 
            to="/startup-graph" 
            className="p-6 group flex flex-col justify-between transition-all bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] shadow-sm hover:border-black dark:hover:border-white"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#737373] dark:text-[#A3A3A3] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Relational Graph
                </span>
                <Network className="w-5 h-5 text-black dark:text-white" />
              </div>
              <h3 className="text-[17px] font-bold text-black dark:text-white group-hover:underline transition-colors">
                Knowledge Graph
              </h3>
              <p className="text-[13px] text-[#737373] dark:text-[#A3A3A3] mt-1 leading-relaxed">
                Explore relational topologies between investors, founders, and root causes.
              </p>

              <div className="mt-4 p-3 rounded-[6px] text-[11px] flex items-center justify-center gap-2 bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="p-1 px-2 rounded-[4px] font-bold bg-black dark:bg-white text-white dark:text-black">Startup</span>
                <span className="text-[#A3A3A3]">───</span>
                <span className="p-1 px-2 rounded-[4px] font-bold bg-[#404040] text-white">Cause</span>
                <span className="text-[#A3A3A3]">───</span>
                <span className="p-1 px-2 rounded-[4px] font-medium bg-white dark:bg-black text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]">Investor</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between text-[12px] font-bold text-black dark:text-white">
              <span>Launch Graph</span>
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
        <div className="p-8 lg:p-10 rounded-[8px] bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] text-[11px] font-bold tracking-wider uppercase">
                <Users className="w-3.5 h-3.5" />
                <span>Forensic AI Personas</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
                LEARN FROM THE PEOPLE WHO LIVED IT.
              </h2>
              <p className="text-[14px] text-[#737373] dark:text-[#A3A3A3] mt-1">
                AI-reconstructed founder personas built exclusively from public testimonies, SEC depositions, and post-mortem postmortems.
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-[4px] text-[10px] font-bold uppercase tracking-wider bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#737373] dark:text-[#A3A3A3] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                AI-RECONSTRUCTED PERSONA • BASED ON PUBLIC EVIDENCE
              </span>
            </div>
          </div>

          {/* Persona Switcher Tabs */}
          <div className="flex items-center gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3 mb-6 overflow-x-auto">
            {Object.keys(ghostProfiles).map((key) => {
              const p = ghostProfiles[key];
              const isSelected = activeGhost === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveGhost(key)}
                  className={`px-3.5 py-2 rounded-[6px] text-[13px] font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    isSelected 
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm' 
                      : 'bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#737373] dark:text-[#A3A3A3] border border-[#E5E5E5] dark:border-[#2A2A2A] hover:text-black dark:hover:text-white'
                  }`}
                >
                  <span>{p.name}</span>
                  <span className="text-[11px] opacity-70">({p.startup})</span>
                </button>
              );
            })}
          </div>

          {/* Dialogue Conversation Card */}
          <div className="p-6 space-y-4 bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px]">
            {/* User Query */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-[4px] flex items-center justify-center font-bold text-[11px] shrink-0 bg-black text-white dark:bg-white dark:text-black">
                YOU
              </div>
              <div className="p-3.5 text-[13px] font-medium bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[6px] text-black dark:text-white">
                "What warning signs did you miss before the collapse became irreversible?"
              </div>
            </div>

            {/* Ghost Response */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-[4px] flex items-center justify-center font-bold text-[11px] shrink-0 bg-white dark:bg-black text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]">
                AI
              </div>
              <div className="p-4 text-[14px] leading-relaxed space-y-2 bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[6px] text-black dark:text-white">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3]">
                  {ghostProfiles[activeGhost].name} ({ghostProfiles[activeGhost].startup} — {ghostProfiles[activeGhost].stat})
                </div>
                <p className="italic text-black dark:text-white">
                  "{ghostProfiles[activeGhost].quote}"
                </p>
                <div className="pt-2 text-[12px] font-bold text-black dark:text-white">
                  Core Lesson: {ghostProfiles[activeGhost].lesson}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A] text-[12px]">
              <span className="text-[#737373] dark:text-[#A3A3A3]">
                Persona generated from public evidence. Does not imply living founder participation.
              </span>
              <Link 
                to="/hall-of-ghosts" 
                className="btn-primary px-4 py-2 text-[12px] font-bold rounded-[6px] uppercase tracking-wider transition-all"
              >
                Interview All Personas →
              </Link>
            </div>
          </div>
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
                <div className="p-3 bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[6px]">
                  <div className="text-2xl font-extrabold text-black dark:text-white tabular-nums">413+</div>
                  <div className="text-[10px] font-bold uppercase text-[#737373] dark:text-[#A3A3A3] tracking-wider mt-0.5">Startups</div>
                </div>
                <div className="p-3 bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[6px]">
                  <div className="text-2xl font-extrabold text-black dark:text-white tabular-nums">40+</div>
                  <div className="text-[10px] font-bold uppercase text-[#737373] dark:text-[#A3A3A3] tracking-wider mt-0.5">Countries</div>
                </div>
                <div className="p-3 bg-black dark:bg-white text-white dark:text-black rounded-[6px]">
                  <div className="text-2xl font-extrabold tabular-nums">14</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider mt-0.5 opacity-80">Vectors</div>
                </div>
              </div>

              {/* Regional Concentration Bars - Grayscale */}
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between text-[12px] font-medium mb-1 text-black dark:text-white">
                    <span>North America (Silicon Valley, NY, Austin)</span>
                    <span className="font-bold tabular-nums">68%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden bg-[#E5E5E5] dark:bg-[#2A2A2A]">
                    <div className="h-full rounded-full bg-black dark:bg-white" style={{ width: '68%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[12px] font-medium mb-1 text-black dark:text-white">
                    <span>Europe (London, Berlin, Paris)</span>
                    <span className="font-bold tabular-nums">18%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden bg-[#E5E5E5] dark:bg-[#2A2A2A]">
                    <div className="h-full rounded-full bg-[#525252] dark:bg-[#A3A3A3]" style={{ width: '18%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[12px] font-medium mb-1 text-black dark:text-white">
                    <span>Asia-Pacific (Bengaluru, Singapore, Sydney)</span>
                    <span className="font-bold tabular-nums">11%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden bg-[#E5E5E5] dark:bg-[#2A2A2A]">
                    <div className="h-full rounded-full bg-[#737373] dark:bg-[#737373]" style={{ width: '11%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[12px] font-medium mb-1 text-black dark:text-white">
                    <span>Latin America & Rest of World</span>
                    <span className="font-bold tabular-nums">3%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden bg-[#E5E5E5] dark:bg-[#2A2A2A]">
                    <div className="h-full rounded-full bg-[#A3A3A3] dark:bg-[#525252]" style={{ width: '3%' }} />
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
