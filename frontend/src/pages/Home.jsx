import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, ShieldAlert, Sparkles, TrendingDown, ArrowRight, 
  Activity, Database, Flame, HelpCircle, Layers, Users, 
  FileText, BarChart3, Scale, Globe, CheckCircle2, ChevronRight,
  AlertTriangle, Network, Cpu, ArrowUpRight, Lock, Eye, Compass,
  BookOpen, Gauge, Brain
} from 'lucide-react';
import { getInsights, getStartups } from '../lib/api';
import { CURATED_STARTUPS } from '../lib/data/startupsData';
import { StartupCard } from '../components/common/StartupCard';
import { MetricCard } from '../components/common/MetricCard';
import { InsightCard } from '../components/common/InsightCard';
import { FailureScoreBadge } from '../components/common/FailureScoreBadge';
import { formatCurrency, formatNumber } from '../lib/utils';
import { useBookmarks } from '../hooks/useBookmarks';

function MiniSparkline({ data, stroke, fill, height = 30 }) {
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
        strokeWidth="1.75"
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
    <div className="space-y-16 lg:space-y-24 pb-20">
      {/* 1. Live System Telemetry Ticker */}
      <div className="border-b border-[#EFEFEF] dark:border-[#202020] bg-[#FAFAFA] dark:bg-[#0E0E0E] py-2.5">
        <div className="site-container flex items-center justify-between text-[12px] text-[#555555] dark:text-white/60 overflow-x-auto gap-6 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6173] animate-pulse" />
            <span className="font-bold text-black dark:text-white">SYSTEM TELEMETRY:</span>
            <span>413+ startup autopsies indexed across 14 failure vectors</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span>Capital Evaporated: <strong className="text-black dark:text-white">$26.8B+</strong></span>
            <span>•</span>
            <span>Top Failure Vector: <strong className="text-[#FF6173]">Unit Economics (28%)</strong></span>
            <span>•</span>
            <span>AI Reasoning: <strong className="text-black dark:text-white">Active Dual-Layer</strong></span>
          </div>
          <Link to="/insights" className="font-bold text-black dark:text-white hover:underline flex items-center gap-1">
            <span>Macro Dashboard</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* 2. Hero Section: 90-95vh Viewport Fill, 60/40 Split, 48px Top Padding */}
      <section className="site-container pt-4 sm:pt-8 min-h-[85vh] lg:min-h-[88vh] flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column (60%): Editorial Headline, 72px Search, CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[5px] text-[12px] font-bold bg-[#FAFAFA] dark:bg-[#1A1A1A] border border-[#EFEFEF] dark:border-[#2D2D2D] text-black dark:text-white mb-4 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#FF6173]" />
              <span>STARTUP INTELLIGENCE PLATFORM</span>
            </div>

            <h1 className="text-4xl sm:text-6xl xl:text-[76px] font-extrabold tracking-tight text-black dark:text-white leading-[1.04]">
              Learn from startup failures. <br />
              <span className="text-[#555555] dark:text-white/60">Make better decisions before you build.</span>
            </h1>

            <p className="mt-5 text-[16px] sm:text-[19px] text-[#555555] dark:text-white/70 max-w-2xl leading-relaxed">
              PivotVault synthesizes 413+ historical startup autopsies, forensic post-mortems, and knowledge graphs into defensive intelligence for founders and investors.
            </p>

            {/* 72px Search Bar */}
            <div className="mt-8 max-w-2xl">
              <form onSubmit={handleHeroSearch} className="relative flex items-center rounded-[5px] overflow-hidden border-2 border-black dark:border-white bg-white dark:bg-[#1A1A1A] h-[70px] shadow-sm">
                <div className="pl-5 text-[#555555] dark:text-white/60">
                  <Search className="w-6 h-6" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by startup (Theranos, WeWork), industry, or failure mode..."
                  className="w-full px-4 text-[16px] sm:text-[17px] text-black dark:text-white bg-transparent placeholder-[#888888] focus:outline-none font-medium"
                />
                <button
                  type="submit"
                  className="mr-2.5 btn-primary !py-3 !px-6 text-[15px] font-bold shrink-0"
                >
                  Analyze
                </button>
              </form>

              {/* Popular Search Chips */}
              <div className="mt-3.5 flex items-center gap-2 flex-wrap text-[13px] text-[#555555] dark:text-white/60">
                <span className="font-bold text-black dark:text-white">Popular:</span>
                {['Unit Economics', 'Theranos', 'WeWork', 'Quibi', 'Fast', 'Hardware Defect'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => navigate(`/explore?q=${encodeURIComponent(tag)}`)}
                    className="hover:text-black dark:hover:text-white hover:underline transition-colors font-medium"
                  >
                    {tag},
                  </button>
                ))}
              </div>

              {/* Dual Action CTAs */}
              <div className="mt-7 flex items-center gap-4 flex-wrap">
                <Link to="/explore" className="btn-primary !px-8 !py-4 text-[16px]">
                  Explore 413+ Failures →
                </Link>
                <Link 
                  to="/risk-scanner" 
                  className="inline-flex items-center justify-center px-7 py-4 rounded-[5px] text-[16px] font-bold border-2 border-black dark:border-white text-black dark:text-white hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] transition-colors"
                >
                  Scan Startup Risk
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column (40%): Live Failure Intelligence Interactive Panel */}
          <div className="lg:col-span-5">
            <div className="card-editorial !p-6 bg-white dark:bg-[#111111] border border-[#EFEFEF] dark:border-[#202020] shadow-md space-y-5">
              {/* Panel Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#EFEFEF] dark:border-[#202020]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6173] animate-ping" />
                  <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-black dark:text-white">
                    FAILURE INTELLIGENCE PANEL
                  </h3>
                </div>
                <span className="badge-neutral text-[11px] font-mono">LIVE FEED</span>
              </div>

              {/* 3 Metric Stat Blocks */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-[5px] bg-[#FAFAFA] dark:bg-[#181818] border border-[#EFEFEF] dark:border-[#242424]">
                  <div className="text-[22px] font-extrabold text-black dark:text-white leading-tight">413+</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#777777] dark:text-white/50 mt-0.5">Startups</div>
                </div>
                <div className="p-3 rounded-[5px] bg-[#FAFAFA] dark:bg-[#181818] border border-[#EFEFEF] dark:border-[#242424]">
                  <div className="text-[22px] font-extrabold text-black dark:text-white leading-tight">14</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#777777] dark:text-white/50 mt-0.5">Vectors</div>
                </div>
                <div className="p-3 rounded-[5px] bg-[#FFE8EB] dark:bg-[#2A1115] border border-[#FF6173]/30">
                  <div className="text-[22px] font-extrabold text-[#FF6173] leading-tight">$26.8B+</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF6173] mt-0.5">Evaporated</div>
                </div>
              </div>

              {/* Horizontal Bar Breakdown */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-bold text-black dark:text-white">TOP FAILURE VECTORS</span>
                  <span className="text-[#777777] dark:text-white/50 text-[11px]">413 Sample Size</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span className="font-semibold text-black dark:text-white flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6173]" />
                        Unit Economics Collapse
                      </span>
                      <span className="font-mono font-bold text-[#FF6173]">28%</span>
                    </div>
                    <div className="w-full h-2 bg-[#EFEFEF] dark:bg-[#202020] rounded-full overflow-hidden">
                      <div className="h-full bg-[#FF6173] rounded-full" style={{ width: '28%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span className="font-semibold text-black dark:text-white">Product-Market Fit Deficit</span>
                      <span className="font-mono font-bold text-black dark:text-white">22%</span>
                    </div>
                    <div className="w-full h-2 bg-[#EFEFEF] dark:bg-[#202020] rounded-full overflow-hidden">
                      <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: '22%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span className="font-semibold text-black dark:text-white">Execution Void</span>
                      <span className="font-mono font-bold text-black dark:text-white">17%</span>
                    </div>
                    <div className="w-full h-2 bg-[#EFEFEF] dark:bg-[#202020] rounded-full overflow-hidden">
                      <div className="h-full bg-[#555555] dark:bg-[#888888] rounded-full" style={{ width: '17%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span className="font-semibold text-black dark:text-white">Competition & Platform Moat</span>
                      <span className="font-mono font-bold text-black dark:text-white">14%</span>
                    </div>
                    <div className="w-full h-2 bg-[#EFEFEF] dark:bg-[#202020] rounded-full overflow-hidden">
                      <div className="h-full bg-[#888888] dark:bg-[#555555] rounded-full" style={{ width: '14%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini Knowledge Graph Interactive Node Preview */}
              <div className="p-3.5 rounded-[5px] bg-[#FAFAFA] dark:bg-[#181818] border border-[#EFEFEF] dark:border-[#242424]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777] dark:text-white/50 flex items-center gap-1.5">
                    <Network className="w-3.5 h-3.5" />
                    KNOWLEDGE GRAPH CONNECTOR
                  </span>
                  <Link to="/startup-graph" className="text-[11px] font-bold text-black dark:text-white hover:underline flex items-center">
                    Full Graph →
                  </Link>
                </div>
                
                <div className="flex items-center justify-between gap-1 py-1">
                  {['wework', 'theranos', 'fast', 'quibi'].map((key) => (
                    <button
                      key={key}
                      onClick={() => setActiveGraphNode(key)}
                      className={`px-2.5 py-1 rounded-[4px] text-[11px] font-bold capitalize transition-colors ${
                        activeGraphNode === key 
                          ? 'bg-black text-white dark:bg-white dark:text-black' 
                          : 'bg-white dark:bg-[#222222] text-[#555555] dark:text-white/70 border border-[#EFEFEF] dark:border-[#333333]'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>

                <div className="mt-2 text-[12px] text-black dark:text-white bg-white dark:bg-[#111111] p-2.5 rounded border border-[#EFEFEF] dark:border-[#282828]">
                  <div className="flex items-center justify-between font-bold">
                    <span>{graphEntities[activeGraphNode].name}</span>
                    <span className="text-[#FF6173] text-[11px]">{graphEntities[activeGraphNode].type}</span>
                  </div>
                  <p className="text-[11px] text-[#666666] dark:text-white/60 mt-1 line-clamp-1">
                    {graphEntities[activeGraphNode].description}
                  </p>
                </div>
              </div>

              {/* AI Signal Banner */}
              <div className="flex items-start gap-2.5 p-3 rounded-[5px] bg-[#FAFAFA] dark:bg-[#161616] border border-[#EFEFEF] dark:border-[#262626] text-[12px]">
                <Cpu className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                <div className="text-[#555555] dark:text-white/70 leading-snug">
                  <strong className="text-black dark:text-white">AI SIGNAL:</strong> Unit economics deterioration correlates with 84% of consumer hardware casualties.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section: Live Failure Intelligence (Charts & Distributions) */}
      <section className="site-container pt-8 border-t border-[#EFEFEF] dark:border-[#202020]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#FAFAFA] dark:bg-[#1A1A1A] border border-[#EFEFEF] dark:border-[#2D2D2D] text-black dark:text-white mb-2">
              <Activity className="w-3 h-3 text-[#FF6173]" />
              <span>FORENSIC DATASET</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-white">
              Failure Intelligence & Distribution
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#555555] dark:text-white/60 mt-1 max-w-2xl">
              Patterns extracted across 413+ documented startup failures. Editorial analytics derived from verified corporate post-mortems and SEC filings.
            </p>
          </div>
          <Link to="/insights" className="btn-link-cta shrink-0 font-bold">
            <span>Macro Dashboard</span>
            <span>→</span>
          </Link>
        </div>

        {/* 4 Analytics Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'TOTAL FAILURES',
              value: '413',
              sub: 'This quarter',
              badge: '+18',
              badgeBg: 'rgba(234,34,97,0.10)',
              badgeColor: '#ea2261',
              iconBg: 'rgba(234,34,97,0.10)',
              iconColor: '#ea2261',
              stroke: '#ea2261',
              fill: 'rgba(234,34,97,0.12)',
              spark: [20, 32, 28, 45, 42, 58, 62, 55, 72, 75],
              icon: AlertTriangle,
            },
            {
              label: 'VAULTED STARTUPS',
              value: '413',
              sub: 'With postmortems',
              badge: '+214',
              badgeBg: '#b9b9f9',
              badgeColor: '#4434d4',
              iconBg: '#b9b9f9',
              iconColor: '#533afd',
              stroke: '#533afd',
              fill: 'rgba(83,58,253,0.12)',
              spark: [30, 34, 38, 42, 41, 46, 50, 54, 55, 60],
              icon: BookOpen,
            },
            {
              label: 'AVG RISK SCORE',
              value: '68.4',
              sub: 'All analyzed startups',
              badge: '+3.2',
              badgeBg: '#f5e9d4',
              badgeColor: '#9b6829',
              iconBg: 'rgba(155,104,41,0.12)',
              iconColor: '#9b6829',
              stroke: '#9b6829',
              fill: 'rgba(155,104,41,0.12)',
              spark: [55, 58, 60, 62, 61, 65, 66, 67, 68, 68.4],
              icon: Gauge,
            },
            {
              label: 'AI INSIGHTS GENERATED',
              value: '48,209',
              sub: 'Last 30 days',
              badge: '+1204',
              badgeBg: '#b9b9f9',
              badgeColor: '#4434d4',
              iconBg: '#b9b9f9',
              iconColor: '#533afd',
              stroke: '#533afd',
              fill: 'rgba(83,58,253,0.12)',
              spark: [10, 18, 22, 28, 32, 38, 45, 48, 52, 56],
              icon: Brain,
            },
          ].map((k, i) => {
            const Icon = k.icon;
            return (
              <div
                key={i}
                className="p-5 md:p-6 relative overflow-hidden"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e3e8ee',
                  borderRadius: '18px',
                  boxShadow: 'rgba(0, 55, 112, 0.08) 0px 1px 3px',
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: k.iconBg, color: k.iconColor }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      style={{
                        color: '#64748d',
                        letterSpacing: '0.1px',
                        fontSize: '10px',
                        fontWeight: 400,
                      }}
                      className="uppercase"
                    >
                      {k.label}
                    </span>
                  </div>
                  <span
                    style={{
                      backgroundColor: k.badgeBg,
                      color: k.badgeColor,
                      borderRadius: '9999px',
                      fontSize: '10px',
                      fontWeight: 400,
                      padding: '4px 8px',
                      lineHeight: 1,
                    }}
                    className="inline-flex items-center justify-center font-normal"
                  >
                    {k.badge}
                  </span>
                </div>

                <div className="flex items-end justify-between mb-3">
                  <div
                    style={{
                      color: '#0d253d',
                      fontSize: '34px',
                      fontWeight: 'bold',
                      fontFeatureSettings: '"tnum"',
                      letterSpacing: '-0.42px',
                      lineHeight: 1,
                    }}
                  >
                    {k.value}
                  </div>
                  <MiniSparkline data={k.spark} stroke={k.stroke} fill={k.fill} height={30} />
                </div>

                <div
                  className="pt-2"
                  style={{
                    color: '#64748d',
                    fontSize: '12px',
                  }}
                >
                  {k.sub}
                </div>
              </div>
            );
          })}
        </div>

        {/* 2-Column Dashboard: Left = Failure Vector Distribution, Right = Trend Line */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left (6 cols): Horizontal Bar Chart */}
          <div className="lg:col-span-6 card-editorial !p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFEFEF] dark:border-[#202020]">
              <div>
                <h3 className="text-[16px] font-bold text-black dark:text-white">FAILURE VECTOR DISTRIBUTION</h3>
                <p className="text-[12px] text-[#555555] dark:text-white/60">Primary root causes across 413 autopsies</p>
              </div>
              <span className="badge-neutral text-[11px]">Ranked</span>
            </div>

            <div className="space-y-3 pt-2">
              {failureVectors.map((vec) => (
                <div key={vec.label} className="group">
                  <div className="flex items-center justify-between text-[13px] mb-1">
                    <span className="font-semibold text-black dark:text-white flex items-center gap-2">
                      {vec.isHighRisk && <span className="w-2 h-2 rounded-full bg-[#FF6173]" />}
                      {vec.label}
                    </span>
                    <div className="flex items-center gap-3 font-mono text-[12px]">
                      <span className="text-[#888888] dark:text-white/50">{vec.count} cases</span>
                      <span className={`font-bold ${vec.isHighRisk ? 'text-[#FF6173]' : 'text-black dark:text-white'}`}>
                        {vec.pct}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-[#EFEFEF] dark:bg-[#202020] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        vec.isHighRisk 
                          ? 'bg-[#FF6173]' 
                          : 'bg-black dark:bg-white group-hover:bg-[#555555] dark:group-hover:bg-[#CCCCCC]'
                      }`}
                      style={{ width: `${vec.pct * 3}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right (6 cols): Chronological Failure Trend */}
          <div className="lg:col-span-6 card-editorial !p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#EFEFEF] dark:border-[#202020]">
                <div>
                  <h3 className="text-[16px] font-bold text-black dark:text-white">FAILURE EVENT TIMELINE & VOLUME</h3>
                  <p className="text-[12px] text-[#555555] dark:text-white/60">Annual collapse concentration (2016–2024)</p>
                </div>
                <span className="badge-soft-red text-[11px]">Peak: 2022 Crunch</span>
              </div>

              {/* Bar visualization of annual failures */}
              <div className="mt-6 pt-4 grid grid-cols-9 gap-2 h-44 items-end pb-2 border-b border-[#EFEFEF] dark:border-[#202020]">
                {trendData.map((d) => {
                  const heightPct = Math.round((d.failures / 84) * 100);
                  return (
                    <div key={d.year} className="flex flex-col items-center gap-2 group h-full justify-end">
                      <span className="text-[10px] font-mono text-[#888888] dark:text-white/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {d.failures}
                      </span>
                      <div 
                        className={`w-full rounded-t-[3px] transition-all ${
                          d.isPeak 
                            ? 'bg-[#FF6173]' 
                            : 'bg-black dark:bg-white group-hover:bg-[#555555] dark:group-hover:bg-[#CCCCCC]'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className={`text-[11px] font-mono ${d.isPeak ? 'font-bold text-[#FF6173]' : 'text-[#777777] dark:text-white/60'}`}>
                        {d.year.slice(2)}'
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 p-3.5 rounded-[5px] bg-[#FAFAFA] dark:bg-[#181818] border border-[#EFEFEF] dark:border-[#242424] flex items-center justify-between text-[12px]">
              <div className="text-[#555555] dark:text-white/70">
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
      <section className="site-container">
        <div className="card-editorial !p-8 lg:!p-10 bg-black text-white dark:bg-[#0E0E0E] dark:border-[#202020]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6173]">
                DATASET-DERIVED METRIC
              </span>
              <div className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white">
                $26.8B+
              </div>
              <h3 className="text-xl font-bold text-white">CAPITAL EVAPORATED</h3>
              <p className="text-[14px] text-white/70 leading-relaxed max-w-md">
                Total aggregate equity, debt, and venture capital associated with verified failure post-mortems in the PivotVault database.
              </p>
              <div className="pt-2">
                <Link to="/explore" className="btn-inverted !px-6 !py-3 text-[14px]">
                  Audit Financial Sinks →
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'WeWork', lost: '$12.8B', sector: 'PropTech', cause: 'Lease arbitrage vs 30-day flex' },
                { name: 'Quibi', lost: '$1.75B', sector: 'Streaming', cause: 'Hardware-agnostic mobile lock-in' },
                { name: 'Theranos', lost: '$1.4B', sector: 'HealthTech', cause: 'Unverified medical diagnostics' },
                { name: 'Better Place', lost: '$900M', sector: 'CleanTech', cause: 'EV battery-swap capex trap' },
                { name: 'Fast', lost: '$125M', sector: 'FinTech', cause: '$10M/mo burn with $50k ARR' },
                { name: 'Juicero', lost: '$120M', sector: 'Hardware', cause: '$400 press with hand-squeezable bag' }
              ].map((item) => (
                <div key={item.name} className="p-3.5 rounded-[5px] bg-[#161616] border border-[#2D2D2D] hover:border-white/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-[15px]">{item.name}</span>
                    <span className="font-mono font-bold text-[#FF6173] text-[14px]">{item.lost}</span>
                  </div>
                  <div className="text-[11px] text-white/50 uppercase mt-0.5">{item.sector}</div>
                  <div className="text-[12px] text-white/70 mt-1 line-clamp-1">{item.cause}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 5. Section: Failure Pattern Matrix (Heatmap) */}
      <section className="site-container">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#FAFAFA] dark:bg-[#1A1A1A] border border-[#EFEFEF] dark:border-[#2D2D2D] text-black dark:text-white mb-2">
            <Compass className="w-3 h-3 text-[#FF6173]" />
            <span>CROSS-INDUSTRY MATRIX</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
            Failure Pattern Matrix
          </h2>
          <p className="text-[14px] text-[#555555] dark:text-white/60 mt-1">
            Grayscale intensity indicates failure concentration across industries and root cause vectors. Click any cell to inspect.
          </p>
        </div>

        <div className="card-editorial !p-6 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#EFEFEF] dark:border-[#202020]">
                <th className="py-3 px-4 font-bold text-black dark:text-white w-44">Failure Vector</th>
                {heatmapIndustries.map((ind) => (
                  <th key={ind} className="py-3 px-3 font-bold text-center text-black dark:text-white">
                    {ind}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapVectors.map((row) => (
                <tr key={row.name} className="border-b border-[#EFEFEF]/60 dark:border-[#202020]/60 hover:bg-[#FAFAFA] dark:hover:bg-[#161616]">
                  <td className="py-3.5 px-4 font-semibold text-black dark:text-white">
                    {row.name}
                  </td>
                  {row.values.map((intensity, idx) => {
                    const industry = heatmapIndustries[idx];
                    const isSelected = activeHeatmapCell.vector === row.name && activeHeatmapCell.industry === industry;
                    const isHighestRisk = intensity === 5;
                    
                    // Monochrome intensity styles
                    const bgClass = isHighestRisk
                      ? 'bg-[#FFE8EB] text-[#FF6173] font-bold border border-[#FF6173]/40'
                      : intensity === 4
                      ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                      : intensity === 3
                      ? 'bg-[#888888] text-white dark:bg-[#555555] dark:text-white'
                      : intensity === 2
                      ? 'bg-[#DCDCDC] text-black dark:bg-[#333333] dark:text-white/80'
                      : 'bg-[#F2F2F2] text-[#888888] dark:bg-[#202020] dark:text-white/40';

                    return (
                      <td key={industry} className="py-2.5 px-2 text-center">
                        <button
                          onClick={() => setActiveHeatmapCell({ vector: row.name, industry, detail: row.detail })}
                          className={`w-10 h-8 rounded-[4px] text-[11px] transition-transform hover:scale-105 inline-flex items-center justify-center ${bgClass} ${
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
          <div className="mt-4 p-4 rounded-[5px] bg-[#FAFAFA] dark:bg-[#161616] border border-[#EFEFEF] dark:border-[#242424] flex items-center justify-between text-[13px]">
            <div>
              <span className="font-bold text-black dark:text-white">Selected Intersection: </span>
              <strong className="text-[#FF6173]">{activeHeatmapCell.vector}</strong> × <strong>{activeHeatmapCell.industry}</strong>
              <span className="text-[#666666] dark:text-white/60 ml-2">
                — {activeHeatmapCell.detail || 'High structural vulnerability observed in capital-intensive rollout models.'}
              </span>
            </div>
            <Link to={`/explore?q=${encodeURIComponent(activeHeatmapCell.vector)}`} className="btn-link-cta shrink-0 ml-4 font-bold text-[12px]">
              Explore Cases →
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Section: The Startup Failure Network (Knowledge Graph Preview) */}
      <section className="site-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#FAFAFA] dark:bg-[#1A1A1A] border border-[#EFEFEF] dark:border-[#2D2D2D] text-black dark:text-white mb-2">
              <Network className="w-3 h-3 text-[#FF6173]" />
              <span>RELATIONAL TOPOLOGY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
              The Startup Failure Network
            </h2>
            <p className="text-[14px] text-[#555555] dark:text-white/60 mt-1">
              Connect startups, founders, investors, markets, and failure causes. Explore cross-entity contagion.
            </p>
          </div>
          <Link to="/startup-graph" className="btn-link-cta shrink-0 font-bold">
            <span>Launch Full Graph Engine</span>
            <span>→</span>
          </Link>
        </div>

        <div className="card-editorial !p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Interactive Graph Node Canvas Simulation (Left 7 cols) */}
          <div className="lg:col-span-7 bg-[#FAFAFA] dark:bg-[#141414] border border-[#EFEFEF] dark:border-[#222222] rounded-[5px] p-6 relative min-h-[340px] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#777777] dark:text-white/50 pb-2 border-b border-[#EFEFEF] dark:border-[#222222]">
              <span>INTERACTIVE CLUSTER VIEW</span>
              <span>413 NODES • 890 EDGES</span>
            </div>

            {/* Central Node Display */}
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="flex items-center gap-4 flex-wrap justify-center">
                {Object.keys(graphEntities).map((key) => {
                  const isSelected = activeGraphNode === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveGraphNode(key)}
                      className={`px-4 py-2 rounded-[5px] text-[13px] font-extrabold uppercase transition-all shadow-sm ${
                        isSelected 
                          ? 'bg-black text-white dark:bg-white dark:text-black scale-105 ring-2 ring-[#FF6173]' 
                          : 'bg-white dark:bg-[#202020] text-black dark:text-white border border-[#EFEFEF] dark:border-[#333333] hover:bg-[#F0F0F0]'
                      }`}
                    >
                      {graphEntities[key].name}
                    </button>
                  );
                })}
              </div>

              {/* Connected Visual Links */}
              <div className="w-full max-w-md pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#777777] dark:text-white/50 mb-2">
                  DIRECTLY LINKED EDGES:
                </div>
                <div className="grid grid-cols-2 gap-2 text-left">
                  {graphEntities[activeGraphNode].connections.map((c, i) => (
                    <div key={i} className="p-2 rounded bg-white dark:bg-[#1C1C1C] border border-[#EFEFEF] dark:border-[#2A2A2A] text-[11px]">
                      <div className="font-bold text-black dark:text-white line-clamp-1">{c.name}</div>
                      <div className="text-[#777777] dark:text-white/50 text-[10px]">{c.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#777777] dark:text-white/50 flex items-center justify-between pt-2 border-t border-[#EFEFEF] dark:border-[#222222]">
              <span>Click node to reveal relationship mapping</span>
              <span className="font-mono text-[#FF6173]">Selected: {graphEntities[activeGraphNode].name}</span>
            </div>
          </div>

          {/* Node Inspector Detail Panel (Right 5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-3 rounded-[5px] bg-[#FAFAFA] dark:bg-[#161616] border border-[#EFEFEF] dark:border-[#242424]">
              <span className="badge-soft-red text-[11px] mb-2 inline-block">Entity Dossier</span>
              <h3 className="text-[20px] font-extrabold text-black dark:text-white">
                {graphEntities[activeGraphNode].name}
              </h3>
              <div className="text-[12px] font-mono text-[#FF6173] font-bold mb-2">
                {graphEntities[activeGraphNode].type}
              </div>
              <p className="text-[13px] text-[#555555] dark:text-white/70 leading-relaxed">
                {graphEntities[activeGraphNode].description}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-black dark:text-white">
                Network Contagion Analysis
              </h4>
              <p className="text-[12px] text-[#666666] dark:text-white/60 leading-relaxed">
                Founders and lead investors who repeat high-burn strategies across portfolio companies carry a 2.4x higher repeat failure correlation.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Link to="/startup-graph" className="btn-primary !py-2.5 !px-5 text-[13px]">
                Explore in 3D Graph →
              </Link>
              <Link to={`/startup/${activeGraphNode}`} className="btn-secondary !py-2.5 !px-4 text-[13px]">
                Read Autopsy
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 7. Section: "From Failure to Insight" Horizontal Process Flow */}
      <section className="site-container">
        <div className="card-editorial !p-8 bg-[#FAFAFA] dark:bg-[#0E0E0E] border border-[#EFEFEF] dark:border-[#202020]">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6173] block mb-1">
              PLATFORM ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white">
              From Failure Evidence to Founder Action
            </h2>
            <p className="text-[14px] text-[#555555] dark:text-white/60 mt-1 max-w-xl mx-auto">
              How PivotVault transforms raw corporate wreckage into defensible strategic foresight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
            
            <div className="p-4 rounded-[5px] bg-white dark:bg-[#161616] border border-[#EFEFEF] dark:border-[#222222] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#888888] dark:text-white/40 block mb-1">01. COLLECT</span>
                <h4 className="text-[15px] font-extrabold text-black dark:text-white">Public Evidence</h4>
                <p className="text-[12px] text-[#555555] dark:text-white/60 mt-2 leading-relaxed">
                  SEC filings, court dockets, post-mortems & liquidation reports.
                </p>
              </div>
              <div className="mt-3 text-black dark:text-white text-[16px]">↓</div>
            </div>

            <div className="p-4 rounded-[5px] bg-white dark:bg-[#161616] border border-[#EFEFEF] dark:border-[#222222] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#888888] dark:text-white/40 block mb-1">02. ENRICH</span>
                <h4 className="text-[15px] font-extrabold text-black dark:text-white">AI Extraction</h4>
                <p className="text-[12px] text-[#555555] dark:text-white/60 mt-2 leading-relaxed">
                  Dual-engine extraction of cash burn velocity & fatal pivots.
                </p>
              </div>
              <div className="mt-3 text-black dark:text-white text-[16px]">↓</div>
            </div>

            <div className="p-4 rounded-[5px] bg-white dark:bg-[#161616] border border-[#EFEFEF] dark:border-[#222222] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#888888] dark:text-white/40 block mb-1">03. CONNECT</span>
                <h4 className="text-[15px] font-extrabold text-black dark:text-white">Knowledge Graph</h4>
                <p className="text-[12px] text-[#555555] dark:text-white/60 mt-2 leading-relaxed">
                  Map cross-entity founder, investor, and failure vector relationships.
                </p>
              </div>
              <div className="mt-3 text-black dark:text-white text-[16px]">↓</div>
            </div>

            <div className="p-4 rounded-[5px] bg-white dark:bg-[#161616] border border-[#EFEFEF] dark:border-[#222222] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#888888] dark:text-white/40 block mb-1">04. ANALYZE</span>
                <h4 className="text-[15px] font-extrabold text-black dark:text-white">Failure Patterns</h4>
                <p className="text-[12px] text-[#555555] dark:text-white/60 mt-2 leading-relaxed">
                  Calculate Failure Scores (0–100) and multi-factor risk meters.
                </p>
              </div>
              <div className="mt-3 text-black dark:text-white text-[16px]">↓</div>
            </div>

            <div className="p-4 rounded-[5px] bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#FF6173] block mb-1">05. ACT</span>
                <h4 className="text-[15px] font-extrabold">Founder Action</h4>
                <p className="text-[12px] text-white/70 dark:text-black/70 mt-2 leading-relaxed">
                  Audit pitch decks, scan business models, and pivot safely.
                </p>
              </div>
              <div className="mt-3 text-[#FF6173] text-[16px]">★</div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Section: 6-Feature Asymmetric Grid with Distinct Visual Treatments */}
      <section className="site-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#FAFAFA] dark:bg-[#1A1A1A] border border-[#EFEFEF] dark:border-[#2D2D2D] text-black dark:text-white mb-2">
              <Layers className="w-3 h-3 text-[#FF6173]" />
              <span>CORE PLATFORM MODULES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
              Intelligence Feature Suite
            </h2>
            <p className="text-[14px] text-[#555555] dark:text-white/60 mt-1">
              Every tool is engineered with distinct diagnostic capabilities to deconstruct risk.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Failure Archive with Mini Table Preview */}
          <Link to="/explore" className="card-editorial !p-6 group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="badge-neutral text-[11px]">413+ Dossiers</span>
                <Database className="w-5 h-5 text-black dark:text-white" />
              </div>
              <h3 className="text-[18px] font-bold text-black dark:text-white group-hover:underline">
                Failure Archive
              </h3>
              <p className="text-[13px] text-[#555555] dark:text-white/60 mt-1">
                Forensic post-mortems with capital loss figures, timelines, and root cause tags.
              </p>

              {/* Mini Table UI Preview */}
              <div className="mt-4 p-2.5 rounded bg-[#FAFAFA] dark:bg-[#161616] border border-[#EFEFEF] dark:border-[#242424] text-[11px] space-y-1.5 font-mono">
                <div className="flex justify-between font-bold text-black dark:text-white border-b border-[#EFEFEF] dark:border-[#262626] pb-1">
                  <span>STARTUP</span>
                  <span>FS SCORE</span>
                  <span>CAPITAL</span>
                </div>
                <div className="flex justify-between text-[#555555] dark:text-white/70">
                  <span>Theranos</span>
                  <span className="text-[#FF6173]">98</span>
                  <span>$1.4B</span>
                </div>
                <div className="flex justify-between text-[#555555] dark:text-white/70">
                  <span>WeWork</span>
                  <span className="text-[#FF6173]">92</span>
                  <span>$12.8B</span>
                </div>
                <div className="flex justify-between text-[#555555] dark:text-white/70">
                  <span>Fast</span>
                  <span className="text-[#FF6173]">88</span>
                  <span>$125M</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#EFEFEF] dark:border-[#202020] flex items-center justify-between text-[12px] font-bold text-black dark:text-white">
              <span>Explore Archive</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 2: Founder Playbook with Tactical Prescriptions */}
          <Link to="/founder-playbook" className="card-editorial !p-6 group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="badge-soft-red text-[11px]">Tactical Plays</span>
                <BookOpen className="w-5 h-5 text-black dark:text-white" />
              </div>
              <h3 className="text-[18px] font-bold text-black dark:text-white group-hover:underline">
                Founder Playbook
              </h3>
              <p className="text-[13px] text-[#555555] dark:text-white/60 mt-1">
                Defensive rules and counter-measures extracted from 413+ historical collapse post-mortems.
              </p>

              {/* Mini Playbook UI Preview */}
              <div className="mt-4 p-2.5 rounded bg-[#FAFAFA] dark:bg-[#161616] border border-[#EFEFEF] dark:border-[#242424] text-[11px] space-y-1">
                <div className="font-bold text-black dark:text-white flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6173]" />
                  <span>Rule: Validate Margin Before Scale</span>
                </div>
                <p className="text-[#555555] dark:text-white/70 line-clamp-2">
                  "Never subsidize gross unit economics with venture equity under the assumption of future operational scale."
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#EFEFEF] dark:border-[#202020] flex items-center justify-between text-[12px] font-bold text-black dark:text-white">
              <span>Explore Playbook</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 3: Risk Scanner with Gauge & Risk Meters */}
          <Link to="/risk-scanner" className="card-editorial !p-6 group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="badge-neutral text-[11px]">Defensive Tool</span>
                <ShieldAlert className="w-5 h-5 text-black dark:text-white" />
              </div>
              <h3 className="text-[18px] font-bold text-black dark:text-white group-hover:underline">
                Risk Scanner
              </h3>
              <p className="text-[13px] text-[#555555] dark:text-white/60 mt-1">
                Stress-test your startup idea against historical failure distributions.
              </p>

              {/* Mini Risk Gauge UI */}
              <div className="mt-4 p-2.5 rounded bg-[#FAFAFA] dark:bg-[#161616] border border-[#EFEFEF] dark:border-[#242424] text-[11px] space-y-1.5">
                <div className="flex justify-between items-center font-bold">
                  <span>CALCULATED RISK SCORE</span>
                  <span className="text-[#FF6173] font-mono">72 / 100</span>
                </div>
                <div className="w-full h-1.5 bg-[#EFEFEF] dark:bg-[#282828] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF6173] rounded-full" style={{ width: '72%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-[#777777] dark:text-white/50">
                  <span>Unit Economics: HIGH</span>
                  <span>Competition: HIGH</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#EFEFEF] dark:border-[#202020] flex items-center justify-between text-[12px] font-bold text-black dark:text-white">
              <span>Run Risk Scan</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 4: Pitch Deck Autopsy with Diagnostic Slide Audit */}
          <Link to="/pitch-deck-autopsy" className="card-editorial !p-6 group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="badge-neutral text-[11px]">Pre-Seed / Seed</span>
                <FileText className="w-5 h-5 text-black dark:text-white" />
              </div>
              <h3 className="text-[18px] font-bold text-black dark:text-white group-hover:underline">
                Pitch Deck Autopsy
              </h3>
              <p className="text-[13px] text-[#555555] dark:text-white/60 mt-1">
                Audit pitch decks against historical failure traps and valuation fallacies.
              </p>

              {/* Mini Slide Diagnostic UI */}
              <div className="mt-4 p-2.5 rounded bg-[#FAFAFA] dark:bg-[#161616] border border-[#EFEFEF] dark:border-[#242424] text-[11px] space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#FF6173] font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Slide 4: Unit Economics Trap</span>
                </div>
                <p className="text-[10px] text-[#666666] dark:text-white/60">
                  CAC calculation omits sales overhead, creating false margin projections.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#EFEFEF] dark:border-[#202020] flex items-center justify-between text-[12px] font-bold text-black dark:text-white">
              <span>Audit Pitch Deck</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 5: Knowledge Graph with Mini Network View */}
          <Link to="/startup-graph" className="card-editorial !p-6 group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="badge-neutral text-[11px]">Relational Graph</span>
                <Network className="w-5 h-5 text-black dark:text-white" />
              </div>
              <h3 className="text-[18px] font-bold text-black dark:text-white group-hover:underline">
                Knowledge Graph
              </h3>
              <p className="text-[13px] text-[#555555] dark:text-white/60 mt-1">
                Explore relational topologies between investors, founders, and root causes.
              </p>

              {/* Mini Network Visual Preview */}
              <div className="mt-4 p-2.5 rounded bg-[#FAFAFA] dark:bg-[#161616] border border-[#EFEFEF] dark:border-[#242424] text-[11px] flex items-center justify-center gap-2 font-mono">
                <span className="p-1 px-1.5 rounded bg-black text-white dark:bg-white dark:text-black font-bold">Startup</span>
                <span className="text-[#888888]">───</span>
                <span className="p-1 px-1.5 rounded bg-[#FFE8EB] text-[#FF6173] font-bold">Cause</span>
                <span className="text-[#888888]">───</span>
                <span className="p-1 px-1.5 rounded bg-white dark:bg-[#202020] border border-[#CCCCCC] dark:border-[#333333]">Investor</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#EFEFEF] dark:border-[#202020] flex items-center justify-between text-[12px] font-bold text-black dark:text-white">
              <span>Launch Graph</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 6: Hall of Ghosts with Reconstructed Dialogues */}
          <Link to="/hall-of-ghosts" className="card-editorial !p-6 group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="badge-soft-red text-[11px]">AI Debrief</span>
                <Users className="w-5 h-5 text-black dark:text-white" />
              </div>
              <h3 className="text-[18px] font-bold text-black dark:text-white group-hover:underline">
                Hall of Ghosts
              </h3>
              <p className="text-[13px] text-[#555555] dark:text-white/60 mt-1">
                Interview AI personas reconstructed from court records and post-mortem testimonies.
              </p>

              {/* Mini Dialogue Preview */}
              <div className="mt-4 p-2.5 rounded bg-[#FAFAFA] dark:bg-[#161616] border border-[#EFEFEF] dark:border-[#242424] text-[11px] space-y-1">
                <div className="font-bold text-black dark:text-white">
                  Ghost: Adam Neumann (WeWork)
                </div>
                <p className="text-[#555555] dark:text-white/70 italic line-clamp-1">
                  "We mistook access to unlimited venture capital for structural market validation."
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#EFEFEF] dark:border-[#202020] flex items-center justify-between text-[12px] font-bold text-black dark:text-white">
              <span>Enter Hall of Ghosts</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

        </div>
      </section>

      {/* 9. Section: Risk Scanner Live Interactive Preview (Split Section) */}
      <section className="site-container">
        <div className="card-editorial !p-8 lg:!p-10 border-2 border-black dark:border-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Interactive Input */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#FFE8EB] text-[#FF6173] border border-[#FF6173]/30">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>RISK SCANNER DEMO</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-white">
                Scan Your Startup Idea
              </h2>
              
              <p className="text-[15px] text-[#555555] dark:text-white/70 leading-relaxed">
                How does your business model compare with historical failures? Stress-test your assumptions against 413+ autopsy distributions.
              </p>

              <div className="space-y-3 pt-2">
                <label className="text-[12px] font-bold uppercase tracking-wider text-black dark:text-white block">
                  Describe Your Startup Model:
                </label>
                <textarea
                  value={demoIdea}
                  onChange={(e) => setDemoIdea(e.target.value)}
                  rows={3}
                  className="w-full p-3.5 text-[14px] text-black dark:text-white bg-[#FAFAFA] dark:bg-[#161616] border border-[#EFEFEF] dark:border-[#2D2D2D] rounded-[5px] focus:outline-none focus:border-black dark:focus:border-white"
                />

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRunDemoScan}
                    disabled={isScanning}
                    className="btn-primary !py-3 !px-6 text-[14px] font-bold"
                  >
                    {isScanning ? 'Analyzing Patterns...' : 'RUN RISK SCAN →'}
                  </button>
                  <Link to="/risk-scanner" className="text-[13px] font-bold text-black dark:text-white hover:underline">
                    Full Scanner Suite →
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Calculated Diagnostic Result Panel */}
            <div className="lg:col-span-6 bg-[#FAFAFA] dark:bg-[#141414] border border-[#EFEFEF] dark:border-[#242424] rounded-[5px] p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#EFEFEF] dark:border-[#222222]">
                <span className="text-[12px] font-bold uppercase tracking-wider text-black dark:text-white">
                  DIAGNOSTIC RISK RESULT
                </span>
                <span className="badge-soft-red text-[11px] font-mono font-bold">
                  {scanResult.rating}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#777777] dark:text-white/50 font-bold">
                    FAILURE RISK INDEX
                  </div>
                  <div className="text-4xl font-extrabold text-[#FF6173]">
                    {scanResult.score} <span className="text-xl text-[#777777] dark:text-white/50">/ 100</span>
                  </div>
                </div>
                <div className="text-right text-[12px] text-[#555555] dark:text-white/60">
                  <span>Confidence: <strong>94%</strong></span> <br />
                  <span>Autopsy Correlates: <strong>3 Matches</strong></span>
                </div>
              </div>

              {/* 4 Category Risk Meters */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {scanResult.breakdown.map((item) => (
                  <div key={item.label} className="p-2.5 rounded bg-white dark:bg-[#1A1A1A] border border-[#EFEFEF] dark:border-[#282828] text-[12px]">
                    <div className="flex justify-between font-bold text-black dark:text-white mb-1">
                      <span>{item.label}</span>
                      <span className={item.level === 'HIGH' ? 'text-[#FF6173]' : 'text-black dark:text-white'}>
                        {item.level}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#EFEFEF] dark:bg-[#282828] rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${item.level === 'HIGH' ? 'bg-[#FF6173]' : 'bg-black dark:bg-white'}`}
                        style={{ width: `${item.val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 3 Historical Matches */}
              <div className="pt-2 border-t border-[#EFEFEF] dark:border-[#222222]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#777777] dark:text-white/50 mb-2">
                  TOP 3 HISTORICAL AUTOPSY MATCHES:
                </div>
                <div className="space-y-1.5">
                  {scanResult.matches.map((m) => (
                    <div key={m.name} className="flex items-center justify-between text-[12px] p-2 rounded bg-white dark:bg-[#1A1A1A] border border-[#EFEFEF] dark:border-[#282828]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-black dark:text-white">{m.name}</span>
                        <span className="text-[#777777] dark:text-white/50 text-[11px]">— {m.cause}</span>
                      </div>
                      <span className="font-mono font-bold text-[#FF6173] text-[11px]">{m.similarity} Match</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 10. Section: Hall of Ghosts Preview */}
      <section className="site-container">
        <div className="card-editorial !p-8 lg:!p-10 bg-white dark:bg-[#0E0E0E] border border-[#EFEFEF] dark:border-[#202020]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#FAFAFA] dark:bg-[#1A1A1A] border border-[#EFEFEF] dark:border-[#2D2D2D] text-black dark:text-white mb-2">
                <Users className="w-3 h-3 text-[#FF6173]" />
                <span>FORENSIC AI PERSONAS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
                LEARN FROM THE PEOPLE WHO LIVED IT.
              </h2>
              <p className="text-[14px] text-[#555555] dark:text-white/60 mt-1">
                AI-reconstructed founder personas built exclusively from public testimonies, SEC depositions, and post-mortem postmortems.
              </p>
            </div>

            <div className="text-right">
              <span className="badge-neutral text-[10px] font-mono">
                AI-RECONSTRUCTED PERSONA • BASED ON PUBLIC EVIDENCE
              </span>
            </div>
          </div>

          {/* Persona Switcher Tabs */}
          <div className="flex items-center gap-2 border-b border-[#EFEFEF] dark:border-[#202020] pb-3 mb-6 overflow-x-auto">
            {Object.keys(ghostProfiles).map((key) => {
              const p = ghostProfiles[key];
              const isSelected = activeGhost === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveGhost(key)}
                  className={`px-4 py-2 rounded-[5px] text-[13px] font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${
                    isSelected
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-[#FAFAFA] dark:bg-[#1A1A1A] text-[#555555] dark:text-white/70 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <span>{p.name}</span>
                  <span className="text-[11px] opacity-70">({p.startup})</span>
                </button>
              );
            })}
          </div>

          {/* Dialogue Conversation Card */}
          <div className="p-6 rounded-[5px] bg-[#FAFAFA] dark:bg-[#141414] border border-[#EFEFEF] dark:border-[#242424] space-y-4">
            
            {/* User Query */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-[4px] bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-[11px] shrink-0">
                YOU
              </div>
              <div className="p-3 rounded-[5px] bg-white dark:bg-[#1C1C1C] border border-[#EFEFEF] dark:border-[#2A2A2A] text-[13px] font-medium text-black dark:text-white">
                "What warning signs did you miss before the collapse became irreversible?"
              </div>
            </div>

            {/* Ghost Response */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-[4px] bg-[#FFE8EB] text-[#FF6173] border border-[#FF6173]/30 flex items-center justify-center font-bold text-[11px] shrink-0">
                AI
              </div>
              <div className="p-4 rounded-[5px] bg-white dark:bg-[#1C1C1C] border border-[#EFEFEF] dark:border-[#2A2A2A] text-[14px] text-[#333333] dark:text-white/90 leading-relaxed space-y-2">
                <div className="text-[11px] font-mono text-[#777777] dark:text-white/50 font-bold uppercase">
                  {ghostProfiles[activeGhost].name} ({ghostProfiles[activeGhost].startup} — {ghostProfiles[activeGhost].stat})
                </div>
                <p className="italic">
                  "{ghostProfiles[activeGhost].quote}"
                </p>
                <div className="pt-2 text-[12px] font-bold text-[#FF6173]">
                  Core Lesson: {ghostProfiles[activeGhost].lesson}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#EFEFEF] dark:border-[#222222] text-[12px]">
              <span className="text-[#777777] dark:text-white/50">
                Persona generated from public evidence. Does not imply living founder participation.
              </span>
              <Link to="/hall-of-ghosts" className="btn-primary !py-2 !px-4 text-[12px]">
                Interview All Personas →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Section: Recently Vaulted / Curated Startup Post-Mortems */}
      <section className="site-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-neutral text-[11px]">Recent Autopsies</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
              Recently Vaulted Startups
            </h2>
            <p className="text-[14px] text-[#555555] dark:text-white/60 mt-1">
              Examining the most instructive multi-million and multi-billion dollar startup collapses.
            </p>
          </div>

          <Link
            to="/explore"
            className="btn-link-cta shrink-0 font-bold"
          >
            <span>Explore All 413+ Records</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredStartups.map((startup) => (
            <StartupCard key={startup.id} startup={startup} />
          ))}
        </div>
      </section>

      {/* 12. Section: AI Signals & Global Failure Intelligence */}
      <section className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (6 cols): AI Signals Live Feed */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xl font-extrabold text-black dark:text-white">AI SIGNALS FEED</h3>
                <p className="text-[13px] text-[#555555] dark:text-white/60">Live heuristic alerts generated across the archive</p>
              </div>
              <span className="badge-neutral text-[11px]">Real-Time Rules</span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-[5px] bg-white dark:bg-[#141414] border border-[#EFEFEF] dark:border-[#222222] hover:border-black dark:hover:border-white transition-colors">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase mb-1">
                  <span className="text-[#FF6173] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF6173]" />
                    PATTERN DETECTED
                  </span>
                  <span className="text-[#777777] dark:text-white/40 font-mono">10m ago</span>
                </div>
                <h4 className="text-[14px] font-bold text-black dark:text-white">
                  Hardware Unit Economics Threshold
                </h4>
                <p className="text-[12px] text-[#555555] dark:text-white/70 mt-1 leading-relaxed">
                  Unit economics deterioration appears repeatedly across documented consumer hardware failures (Juicero, Pebble, Lily Robotics).
                </p>
              </div>

              <div className="p-4 rounded-[5px] bg-white dark:bg-[#141414] border border-[#EFEFEF] dark:border-[#222222] hover:border-black dark:hover:border-white transition-colors">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase mb-1">
                  <span className="text-black dark:text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-black dark:bg-white" />
                    HISTORICAL PARALLEL
                  </span>
                  <span className="text-[#777777] dark:text-white/40 font-mono">1h ago</span>
                </div>
                <h4 className="text-[14px] font-bold text-black dark:text-white">
                  On-Demand Delivery Margin Compression
                </h4>
                <p className="text-[12px] text-[#555555] dark:text-white/70 mt-1 leading-relaxed">
                  Current quick-commerce subsidies mirror 1999–2001 dot-com logistics collapses (Webvan, Kozmo).
                </p>
              </div>

              <div className="p-4 rounded-[5px] bg-white dark:bg-[#141414] border border-[#EFEFEF] dark:border-[#222222] hover:border-black dark:hover:border-white transition-colors">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase mb-1">
                  <span className="text-[#FF6173] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF6173]" />
                    RISK SIGNAL
                  </span>
                  <span className="text-[#777777] dark:text-white/40 font-mono">3h ago</span>
                </div>
                <h4 className="text-[14px] font-bold text-black dark:text-white">
                  Extreme Customer Acquisition Burn
                </h4>
                <p className="text-[12px] text-[#555555] dark:text-white/70 mt-1 leading-relaxed">
                  Startups spending &gt;80% of venture equity on paid marketing without organic retention suffer 92% mortality when funding dries up.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (6 cols): Global Failure Intelligence */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xl font-extrabold text-black dark:text-white">GLOBAL FAILURE INTELLIGENCE</h3>
                <p className="text-[13px] text-[#555555] dark:text-white/60">Geographic footprint of 413+ startup post-mortems</p>
              </div>
              <Globe className="w-5 h-5 text-black dark:text-white" />
            </div>

            <div className="card-editorial !p-6 bg-[#FAFAFA] dark:bg-[#141414] border border-[#EFEFEF] dark:border-[#222222] space-y-5">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-white dark:bg-[#1C1C1C] rounded border border-[#EFEFEF] dark:border-[#282828]">
                  <div className="text-2xl font-extrabold text-black dark:text-white">413+</div>
                  <div className="text-[10px] font-bold text-[#777777] dark:text-white/50 uppercase">Startups</div>
                </div>
                <div className="p-3 bg-white dark:bg-[#1C1C1C] rounded border border-[#EFEFEF] dark:border-[#282828]">
                  <div className="text-2xl font-extrabold text-black dark:text-white">40+</div>
                  <div className="text-[10px] font-bold text-[#777777] dark:text-white/50 uppercase">Countries</div>
                </div>
                <div className="p-3 bg-white dark:bg-[#1C1C1C] rounded border border-[#EFEFEF] dark:border-[#282828]">
                  <div className="text-2xl font-extrabold text-[#FF6173]">14</div>
                  <div className="text-[10px] font-bold text-[#FF6173] uppercase">Vectors</div>
                </div>
              </div>

              {/* Regional Concentration Bars */}
              <div className="space-y-2.5 pt-1">
                <div>
                  <div className="flex justify-between text-[12px] font-semibold text-black dark:text-white mb-1">
                    <span>North America (Silicon Valley, NY, Austin)</span>
                    <span className="font-mono font-bold">68%</span>
                  </div>
                  <div className="w-full h-2 bg-[#EFEFEF] dark:bg-[#282828] rounded-full overflow-hidden">
                    <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[12px] font-semibold text-black dark:text-white mb-1">
                    <span>Europe (London, Berlin, Paris)</span>
                    <span className="font-mono font-bold">18%</span>
                  </div>
                  <div className="w-full h-2 bg-[#EFEFEF] dark:bg-[#282828] rounded-full overflow-hidden">
                    <div className="h-full bg-[#666666] dark:bg-[#888888] rounded-full" style={{ width: '18%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[12px] font-semibold text-black dark:text-white mb-1">
                    <span>Asia-Pacific (Bengaluru, Singapore, Sydney)</span>
                    <span className="font-mono font-bold">11%</span>
                  </div>
                  <div className="w-full h-2 bg-[#EFEFEF] dark:bg-[#282828] rounded-full overflow-hidden">
                    <div className="h-full bg-[#999999] dark:bg-[#666666] rounded-full" style={{ width: '11%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[12px] font-semibold text-black dark:text-white mb-1">
                    <span>Latin America & Rest of World</span>
                    <span className="font-mono font-bold">3%</span>
                  </div>
                  <div className="w-full h-2 bg-[#EFEFEF] dark:bg-[#282828] rounded-full overflow-hidden">
                    <div className="h-full bg-[#CCCCCC] dark:bg-[#444444] rounded-full" style={{ width: '3%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 13. Section: Built on Public Evidence (Data Trust Grid) */}
      <section className="site-container">
        <div className="card-editorial !p-8 bg-[#FAFAFA] dark:bg-[#0E0E0E] border border-[#EFEFEF] dark:border-[#202020]">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6173] block mb-1">
              TRUST & VERIFIABILITY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white">
              BUILT ON PUBLIC EVIDENCE
            </h2>
            <p className="text-[14px] text-[#555555] dark:text-white/60 mt-1 max-w-xl mx-auto">
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
              <div key={source.label} className="p-3.5 rounded-[5px] bg-white dark:bg-[#161616] border border-[#EFEFEF] dark:border-[#222222]">
                <CheckCircle2 className="w-4 h-4 text-black dark:text-white mx-auto mb-2" />
                <h4 className="text-[12px] font-extrabold text-black dark:text-white uppercase">{source.label}</h4>
                <p className="text-[10px] text-[#777777] dark:text-white/50 mt-1">{source.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. Section: FAQ Section */}
      <section className="site-container pt-8 border-t border-[#EFEFEF] dark:border-[#202020]">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-1 text-[14px] text-[#555555] dark:text-white/60">
              Understanding PivotVault's failure taxonomy and research methodology
            </p>
          </div>

          <div className="space-y-4">
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
              <div key={idx} className="card-editorial !p-5">
                <h4 className="text-[16px] font-bold text-black dark:text-white flex items-center gap-2">
                  <span className="text-[#FF6173]">Q:</span>
                  <span>{faq.q}</span>
                </h4>
                <p className="mt-2 text-[14px] text-[#555555] dark:text-white/70 leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. Section: Final CTA (Inverted Black Section) */}
      <section className="site-container">
        <div className="card-editorial !p-10 lg:!p-14 bg-black text-white dark:bg-[#0E0E0E] text-center dark:border-[#202020]">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#FF6173] block mb-2">
            THE SURVIVAL MANDATE
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white max-w-3xl mx-auto leading-tight">
            DON'T REPEAT HISTORY.
          </h2>
          <p className="mt-4 text-[16px] sm:text-[18px] text-white/70 max-w-2xl mx-auto leading-relaxed">
            Explore the failures. Understand the patterns. Make the next decision better before writing code or raising capital.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            <Link to="/explore" className="btn-inverted !px-8 !py-4 text-[16px]">
              EXPLORE FAILURE ARCHIVE →
            </Link>
            <Link to="/risk-scanner" className="inline-flex items-center justify-center px-8 py-4 rounded-[5px] text-[16px] font-bold border-2 border-white text-white hover:bg-white/10 transition-colors">
              SCAN YOUR STARTUP →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
