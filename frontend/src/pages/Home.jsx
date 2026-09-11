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
import { CompanyLogo } from '../components/common/CompanyLogo';
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
    <div className="space-y-16 lg:space-y-24 pb-20 bg-[#f6f5f3]">
      {/* 1. Live System Telemetry Ticker */}
      <div 
        className="py-2.5"
        style={{
          backgroundColor: '#f6f5f3',
          borderBottom: '1px solid #dcdbda',
        }}
      >
        <div 
          className="site-container flex items-center justify-between overflow-x-auto gap-6 whitespace-nowrap"
          style={{ color: '#5e5c5a', fontSize: '12px' }}
        >
          <div className="flex items-center gap-2">
            <span 
              className="w-2 h-2 rounded-full shrink-0 animate-pulse" 
              style={{ backgroundColor: '#e16540' }}
            />
            <span style={{ fontWeight: 600, color: '#111111' }}>SYSTEM TELEMETRY:</span>
            <span>413+ startup autopsies indexed across 14 failure vectors</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span>Capital Evaporated: <strong style={{ color: '#2d72f0', fontWeight: 600, fontFeatureSettings: '"tnum"' }}>$26.8B+</strong></span>
            <span style={{ color: '#dcdbda' }}>•</span>
            <span>Top Failure Vector: <strong style={{ color: '#e16540', fontWeight: 600 }}>Unit Economics (28%)</strong></span>
            <span style={{ color: '#dcdbda' }}>•</span>
            <span>AI Reasoning: <strong style={{ color: '#328efa', fontWeight: 600 }}>Active Dual-Layer</strong></span>
          </div>
          <Link 
            to="/insights" 
            className="hover:underline flex items-center gap-1 font-medium"
            style={{ color: '#2d72f0' }}
          >
            <span>Macro Dashboard</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* 2. Hero Section: 90-95vh Viewport Fill, 60/40 Split, 48px Top Padding */}
      <section className="site-container pt-4 sm:pt-8 min-h-[85vh] lg:min-h-[88vh] flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column (60%): Editorial Headline, Search, CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <div 
              className="inline-flex items-center gap-2 mb-4 w-fit"
              style={{
                backgroundColor: 'rgba(45, 114, 240, 0.10)',
                color: '#2d72f0',
                border: '1px solid rgba(45, 114, 240, 0.20)',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 12px',
                letterSpacing: '0.3px'
              }}
            >
              <span>STARTUP INTELLIGENCE PLATFORM</span>
            </div>

            <h1 
              className="text-4xl sm:text-6xl xl:text-[72px] tracking-tight leading-[1.06]"
              style={{
                color: '#111111',
                fontWeight: 700,
              }}
            >
              Learn from startup failures. <br />
              <span style={{ color: '#787673', fontWeight: 700 }}>
                Make better decisions before you build.
              </span>
            </h1>

            <p 
              className="mt-5 max-w-2xl leading-relaxed"
              style={{
                color: '#5e5c5a',
                fontSize: '16px',
              }}
            >
              PivotVault synthesizes 413+ historical startup autopsies, forensic post-mortems, and knowledge graphs into defensive intelligence for founders and investors.
            </p>

            {/* 72px Search Bar */}
            <div className="mt-8 max-w-2xl">
              <form 
                onSubmit={handleHeroSearch} 
                className="relative flex items-center overflow-hidden h-[68px]"
                style={{
                  backgroundColor: '#fbfaf9',
                  border: '1px solid #dcdbda',
                  borderRadius: '12px',
                  boxShadow: 'rgba(0, 0, 0, 0.04) 0px 4px 16px',
                }}
              >
                <div className="pl-5" style={{ color: '#787673' }}>
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by startup (Theranos, WeWork), industry, or failure mode..."
                  className="w-full px-4 text-[15px] sm:text-[16px] bg-transparent focus:outline-none font-medium"
                  style={{
                    color: '#111111',
                  }}
                />
                <button
                  type="submit"
                  className="mr-2.5 shrink-0 transition-colors shadow-xs"
                  style={{
                    backgroundColor: '#2d72f0',
                    color: '#ffffff',
                    borderRadius: '9999px',
                    padding: '10px 22px',
                    fontSize: '14px',
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d5ec9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2d72f0'}
                >
                  Analyze
                </button>
              </form>

              {/* Popular Search Chips */}
              <div 
                className="mt-3.5 flex items-center gap-2 flex-wrap text-[13px]"
                style={{ color: '#787673' }}
              >
                <span style={{ color: '#111111', fontWeight: 600 }}>Popular:</span>
                {['Unit Economics', 'Theranos', 'WeWork', 'Quibi', 'Fast', 'Hardware Defect'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => navigate(`/explore?q=${encodeURIComponent(tag)}`)}
                    className="hover:underline transition-colors font-medium"
                    style={{ color: '#5e5c5a' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#2d72f0'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#5e5c5a'}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Dual Action CTAs */}
              <div className="mt-7 flex items-center gap-4 flex-wrap">
                <Link 
                  to="/explore" 
                  className="transition-colors inline-flex items-center justify-center text-[15px] shadow-xs"
                  style={{
                    backgroundColor: '#2d72f0',
                    color: '#ffffff',
                    borderRadius: '9999px',
                    padding: '12px 28px',
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d5ec9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2d72f0'}
                >
                  Explore 413+ Failures →
                </Link>
                <Link 
                  to="/risk-scanner" 
                  className="inline-flex items-center justify-center text-[15px] transition-colors"
                  style={{
                    border: '1px solid #dcdbda',
                    backgroundColor: '#fbfaf9',
                    color: '#111111',
                    borderRadius: '9999px',
                    padding: '12px 26px',
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f6f5f3'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fbfaf9'}
                >
                  Scan Startup Risk
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column (40%): Live Failure Intelligence Panel */}
          <div className="lg:col-span-5">
            <div 
              className="space-y-5"
              style={{
                backgroundColor: '#fbfaf9',
                border: '1px solid #dcdbda',
                borderRadius: '16px',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 8px 24px',
                padding: '24px',
              }}
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#ecebea]">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: '#e16540' }}
                  />
                  <h3 
                    style={{
                      color: '#787673',
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    FAILURE INTELLIGENCE PANEL
                  </h3>
                </div>
                <span 
                  style={{
                    backgroundColor: 'rgba(225, 101, 64, 0.12)',
                    color: '#e16540',
                    borderRadius: '9999px',
                    fontSize: '10px',
                    fontWeight: 600,
                    padding: '3px 8px',
                  }}
                >
                  LIVE FEED
                </span>
              </div>

              {/* 3 Metric Stat Blocks */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div 
                  className="p-3"
                  style={{
                    backgroundColor: '#f6f5f3',
                    border: '1px solid #ecebea',
                    borderRadius: '10px',
                  }}
                >
                  <div 
                    className="text-[22px] leading-tight"
                    style={{
                      color: '#111111',
                      fontWeight: 700,
                      fontFeatureSettings: '"tnum"',
                    }}
                  >
                    413+
                  </div>
                  <div 
                    className="mt-0.5 uppercase"
                    style={{
                      color: '#787673',
                      fontSize: '11px',
                    }}
                  >
                    Startups
                  </div>
                </div>

                <div 
                  className="p-3"
                  style={{
                    backgroundColor: '#f6f5f3',
                    border: '1px solid #ecebea',
                    borderRadius: '10px',
                  }}
                >
                  <div 
                    className="text-[22px] leading-tight"
                    style={{
                      color: '#111111',
                      fontWeight: 700,
                      fontFeatureSettings: '"tnum"',
                    }}
                  >
                    14
                  </div>
                  <div 
                    className="mt-0.5 uppercase"
                    style={{
                      color: '#787673',
                      fontSize: '11px',
                    }}
                  >
                    Vectors
                  </div>
                </div>

                {/* Highlighted Stat Card ($26.8B+ EVAPORATED) with Amplemarket Leadgen Coral */}
                <div 
                  className="p-3"
                  style={{
                    backgroundColor: 'rgba(225, 101, 64, 0.12)',
                    border: '1px solid rgba(225, 101, 64, 0.25)',
                    borderRadius: '10px',
                  }}
                >
                  <div 
                    className="text-[22px] leading-tight"
                    style={{
                      color: '#e16540',
                      fontWeight: 700,
                      fontFeatureSettings: '"tnum"',
                    }}
                  >
                    $26.8B+
                  </div>
                  <div 
                    className="mt-0.5 uppercase"
                    style={{
                      color: '#e16540',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    Evaporated
                  </div>
                </div>
              </div>

              {/* TOP FAILURE VECTORS section with Amplemarket Pillars */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span 
                    style={{
                      color: '#787673',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}
                  >
                    TOP FAILURE VECTORS
                  </span>
                  <span style={{ color: '#a7a6a4', fontSize: '11px' }}>
                    413 Sample Size
                  </span>
                </div>

                <div className="space-y-2.5">
                  {/* Active Unit Economics Collapse */}
                  <div>
                    <div className="flex items-center justify-between text-[13px] mb-1">
                      <span 
                        className="flex items-center gap-1.5"
                        style={{ color: '#111111', fontSize: '14px', fontWeight: 600 }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#e16540' }} />
                        Unit Economics Collapse
                      </span>
                      <span 
                        style={{
                          color: '#e16540',
                          fontWeight: 600,
                          fontFeatureSettings: '"tnum"',
                        }}
                      >
                        28%
                      </span>
                    </div>
                    <div 
                      className="w-full rounded-full overflow-hidden"
                      style={{ backgroundColor: '#ecebea', height: '6px' }}
                    >
                      <div 
                        className="h-full rounded-full" 
                        style={{ width: '28%', backgroundColor: '#e16540' }} 
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span style={{ color: '#5e5c5a' }}>Product-Market Fit Deficit</span>
                      <span style={{ color: '#328efa', fontWeight: 600, fontFeatureSettings: '"tnum"' }}>22%</span>
                    </div>
                    <div 
                      className="w-full rounded-full overflow-hidden"
                      style={{ backgroundColor: '#ecebea', height: '6px' }}
                    >
                      <div 
                        className="h-full rounded-full" 
                        style={{ width: '22%', backgroundColor: '#328efa' }} 
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span style={{ color: '#5e5c5a' }}>Execution Void</span>
                      <span style={{ color: '#fbc768', fontWeight: 600, fontFeatureSettings: '"tnum"' }}>17%</span>
                    </div>
                    <div 
                      className="w-full rounded-full overflow-hidden"
                      style={{ backgroundColor: '#ecebea', height: '6px' }}
                    >
                      <div 
                        className="h-full rounded-full" 
                        style={{ width: '17%', backgroundColor: '#fbc768' }} 
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span style={{ color: '#5e5c5a' }}>Competition & Platform Moat</span>
                      <span style={{ color: '#47d096', fontWeight: 600, fontFeatureSettings: '"tnum"' }}>14%</span>
                    </div>
                    <div 
                      className="w-full rounded-full overflow-hidden"
                      style={{ backgroundColor: '#ecebea', height: '6px' }}
                    >
                      <div 
                        className="h-full rounded-full" 
                        style={{ width: '14%', backgroundColor: '#47d096' }} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* KNOWLEDGE GRAPH CONNECTOR */}
              <div 
                className="p-3.5"
                style={{
                  backgroundColor: '#f6f5f3',
                  border: '1px solid #ecebea',
                  borderRadius: '10px',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span 
                    className="flex items-center gap-1.5"
                    style={{
                      color: '#787673',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}
                  >
                    <Network className="w-3.5 h-3.5 text-[#2d72f0]" />
                    KNOWLEDGE GRAPH CONNECTOR
                  </span>
                  <Link 
                    to="/startup-graph" 
                    className="hover:underline flex items-center font-medium"
                    style={{ color: '#2d72f0', fontSize: '11px' }}
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
                        className="px-2.5 py-1 text-[11px] font-medium capitalize transition-colors"
                        style={{
                          backgroundColor: isActive ? '#111111' : 'transparent',
                          color: isActive ? '#ffffff' : '#787673',
                          borderRadius: '6px',
                        }}
                      >
                        {key}
                      </button>
                    );
                  })}
                </div>

                <div 
                  className="mt-2 p-2.5"
                  style={{
                    backgroundColor: '#fbfaf9',
                    border: '1px solid #dcdbda',
                    borderRadius: '8px',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CompanyLogo name={graphEntities[activeGraphNode].name} size="xs" />
                      <span style={{ color: '#111111', fontWeight: 600, fontSize: '13px' }}>
                        {graphEntities[activeGraphNode].name}
                      </span>
                    </div>
                    <span 
                      style={{
                        color: '#e16540',
                        fontWeight: 500,
                        fontSize: '11px',
                      }}
                    >
                      {graphEntities[activeGraphNode].type}
                    </span>
                  </div>
                  <p 
                    className="mt-1 line-clamp-1"
                    style={{
                      color: '#5e5c5a',
                      fontSize: '13px',
                    }}
                  >
                    {graphEntities[activeGraphNode].description}
                  </p>
                </div>
              </div>

              {/* AI Signal Banner */}
              <div 
                className="flex items-start gap-2.5 p-3 text-[12px]"
                style={{
                  backgroundColor: '#f6f5f3',
                  border: '1px solid #ecebea',
                  borderRadius: '10px',
                  color: '#5e5c5a',
                }}
              >
                <Cpu className="w-4 h-4 text-[#2d72f0] shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <strong style={{ color: '#111111' }}>AI SIGNAL:</strong> Unit economics deterioration correlates with 84% of consumer hardware casualties.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section: Live Failure Intelligence (Charts & Distributions) */}
      <section className="site-container pt-8 border-t border-[#dcdbda]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div 
              className="inline-flex items-center gap-2 mb-2 w-fit"
              style={{
                backgroundColor: 'rgba(50, 142, 250, 0.12)',
                color: '#328efa',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 12px',
              }}
            >
              <Activity className="w-3 h-3 text-[#328efa]" />
              <span>FORENSIC DATASET</span>
            </div>
            <h2 
              className="text-2xl sm:text-4xl tracking-tight"
              style={{
                color: '#111111',
                fontWeight: 700,
              }}
            >
              Failure Intelligence & Distribution
            </h2>
            <p 
              className="text-[14px] sm:text-[15px] mt-1 max-w-2xl"
              style={{ color: '#787673' }}
            >
              Patterns extracted across 413+ documented startup failures. Editorial analytics derived from verified corporate post-mortems and SEC filings.
            </p>
          </div>
          <Link 
            to="/insights" 
            className="shrink-0 font-medium hover:underline"
            style={{ color: '#2d72f0' }}
          >
            <span>Macro Dashboard</span>
            <span>→</span>
          </Link>
        </div>

        {/* 4 Analytics Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: TOTAL FAILURES */}
          <div
            style={{
              backgroundColor: '#fbfaf9',
              border: '1px solid #dcdbda',
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              padding: '24px',
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'rgba(225, 101, 64, 0.12)', color: '#e16540' }}
                >
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span
                  style={{
                    color: '#787673',
                    letterSpacing: '0.5px',
                    fontSize: '10px',
                    fontWeight: 600,
                  }}
                  className="uppercase"
                >
                  TOTAL FAILURES
                </span>
              </div>
              <span
                style={{
                  backgroundColor: 'rgba(225, 101, 64, 0.12)',
                  color: '#e16540',
                  borderRadius: '9999px',
                  padding: '3px 8px',
                  fontSize: '10px',
                  fontWeight: 700,
                }}
              >
                +18
              </span>
            </div>
            <div className="flex items-end justify-between mb-3">
              <div
                style={{
                  color: '#111111',
                  fontSize: '34px',
                  fontWeight: 700,
                  fontFeatureSettings: '"tnum"',
                  letterSpacing: '-0.42px',
                  lineHeight: 1,
                }}
              >
                413
              </div>
              <MiniSparkline
                data={[20, 32, 28, 45, 42, 58, 62, 55, 72, 75]}
                stroke="#e16540"
                fill="rgba(225, 101, 64, 0.12)"
              />
            </div>
            <div style={{ color: '#787673', fontSize: '11px' }}>
              This quarter
            </div>
          </div>

          {/* Card 2: VAULTED STARTUPS */}
          <div
            style={{
              backgroundColor: '#fbfaf9',
              border: '1px solid #dcdbda',
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              padding: '24px',
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'rgba(50, 142, 250, 0.12)', color: '#328efa' }}
                >
                  <BookOpen className="w-4 h-4" />
                </div>
                <span
                  style={{
                    color: '#787673',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.5px'
                  }}
                  className="uppercase"
                >
                  VAULTED STARTUPS
                </span>
              </div>
              <span
                style={{
                  backgroundColor: 'rgba(50, 142, 250, 0.12)',
                  color: '#328efa',
                  borderRadius: '9999px',
                  padding: '3px 8px',
                  fontSize: '10px',
                  fontWeight: 700,
                }}
              >
                +214
              </span>
            </div>
            <div className="flex items-end justify-between mb-3">
              <div
                style={{
                  color: '#111111',
                  fontSize: '34px',
                  fontWeight: 700,
                  fontFeatureSettings: '"tnum"',
                  letterSpacing: '-0.42px',
                  lineHeight: 1,
                }}
              >
                413
              </div>
              <MiniSparkline
                data={[30, 34, 38, 42, 41, 46, 50, 54, 55, 60]}
                stroke="#328efa"
                fill="rgba(50, 142, 250, 0.12)"
              />
            </div>
            <div style={{ color: '#787673', fontSize: '11px' }}>
              With postmortems
            </div>
          </div>

          {/* Card 3: AVG RISK SCORE */}
          <div
            style={{
              backgroundColor: '#fbfaf9',
              border: '1px solid #dcdbda',
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              padding: '24px',
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'rgba(251, 199, 104, 0.2)', color: '#9b6829' }}
                >
                  <Gauge className="w-4 h-4" />
                </div>
                <span
                  style={{
                    color: '#787673',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.5px'
                  }}
                  className="uppercase"
                >
                  AVG RISK SCORE
                </span>
              </div>
              <span
                style={{
                  backgroundColor: 'rgba(251, 199, 104, 0.2)',
                  color: '#9b6829',
                  borderRadius: '9999px',
                  padding: '3px 8px',
                  fontSize: '10px',
                  fontWeight: 700,
                }}
              >
                +3.2
              </span>
            </div>
            <div className="flex items-end justify-between mb-3">
              <div
                style={{
                  color: '#111111',
                  fontSize: '34px',
                  fontWeight: 700,
                  fontFeatureSettings: '"tnum"',
                  letterSpacing: '-0.42px',
                  lineHeight: 1,
                }}
              >
                68.4
              </div>
              <MiniSparkline
                data={[55, 58, 60, 62, 61, 65, 66, 67, 68, 68.4]}
                stroke="#fbc768"
                fill="rgba(251, 199, 104, 0.15)"
              />
            </div>
            <div style={{ color: '#787673', fontSize: '11px' }}>
              All analyzed startups
            </div>
          </div>

          {/* Card 4: AI INSIGHTS GENERATED */}
          <div
            style={{
              backgroundColor: '#fbfaf9',
              border: '1px solid #dcdbda',
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              padding: '24px',
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'rgba(71, 208, 150, 0.18)', color: '#2e7d32' }}
                >
                  <Brain className="w-4 h-4" />
                </div>
                <span
                  style={{
                    color: '#787673',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.5px'
                  }}
                  className="uppercase"
                >
                  AI INSIGHTS GENERATED
                </span>
              </div>
              <span
                style={{
                  backgroundColor: 'rgba(71, 208, 150, 0.18)',
                  color: '#2e7d32',
                  borderRadius: '9999px',
                  padding: '3px 8px',
                  fontSize: '10px',
                  fontWeight: 700,
                }}
              >
                +1204
              </span>
            </div>
            <div className="flex items-end justify-between mb-3">
              <div
                style={{
                  color: '#111111',
                  fontSize: '34px',
                  fontWeight: 700,
                  fontFeatureSettings: '"tnum"',
                  letterSpacing: '-0.42px',
                  lineHeight: 1,
                }}
              >
                48,209
              </div>
              <MiniSparkline
                data={[10, 18, 22, 28, 32, 38, 45, 48, 52, 56]}
                stroke="#47d096"
                fill="rgba(71, 208, 150, 0.15)"
              />
            </div>
            <div style={{ color: '#787673', fontSize: '11px' }}>
              Last 30 days
            </div>
          </div>
        </div>

        {/* 2-Column Dashboard: Left = Failure Vector Distribution, Right = Trend Line */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: FAILURE VECTOR DISTRIBUTION Card */}
          <div 
            className="lg:col-span-6 p-6 space-y-4"
            style={{
              backgroundColor: '#fbfaf9',
              border: '1px solid #dcdbda',
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#dcdbda]">
              <div>
                <h3 
                  style={{
                    color: '#111111',
                    fontWeight: 700,
                    fontSize: '16px'
                  }}
                >
                  FAILURE VECTOR DISTRIBUTION
                </h3>
                <p style={{ color: '#787673', fontSize: '12px' }}>
                  Primary root causes across 413 autopsies
                </p>
              </div>
              <span 
                style={{
                  backgroundColor: 'rgba(45, 114, 240, 0.12)',
                  color: '#2d72f0',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 10px'
                }}
              >
                Ranked
              </span>
            </div>

            <div className="space-y-4 pt-2">
              {failureVectors.map((vec) => (
                <div key={vec.label}>
                  <div className="flex items-center justify-between text-[13px] mb-1.5">
                    <span 
                      className="flex items-center gap-2"
                      style={{
                        color: vec.isHighRisk ? '#111111' : '#373634',
                        fontWeight: vec.isHighRisk ? 600 : 500
                      }}
                    >
                      {vec.isHighRisk && (
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: '#e16540' }}
                        />
                      )}
                      {vec.label}
                    </span>
                    <div className="flex items-center gap-3 text-[12px]">
                      <span style={{ color: '#787673' }}>{vec.count} cases</span>
                      <span 
                        style={{
                          color: vec.isHighRisk ? '#e16540' : '#787673',
                          fontWeight: vec.isHighRisk ? 600 : 500,
                          fontFeatureSettings: '"tnum"'
                        }}
                      >
                        {vec.pct}%
                      </span>
                    </div>
                  </div>
                  <div 
                    className="w-full rounded-full overflow-hidden"
                    style={{ backgroundColor: '#ecebea', height: '4px' }}
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ 
                        width: `${vec.pct * 3}%`,
                        backgroundColor: vec.isHighRisk ? '#e16540' : '#373634'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: FAILURE EVENT TIMELINE Chart */}
          <div 
            className="lg:col-span-6 p-6 flex flex-col justify-between"
            style={{
              backgroundColor: '#fbfaf9',
              border: '1px solid #dcdbda',
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            }}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#dcdbda]">
                <div>
                  <h3 
                    style={{
                      color: '#111111',
                      fontWeight: 700,
                      fontSize: '16px'
                    }}
                  >
                    FAILURE EVENT TIMELINE
                  </h3>
                  <p style={{ color: '#787673', fontSize: '12px' }}>
                    Annual collapse concentration (2016–2024)
                  </p>
                </div>
                <span 
                  style={{
                    backgroundColor: 'rgba(225, 101, 64, 0.12)',
                    color: '#e16540',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 10px'
                  }}
                >
                  Peak: 2022 Crunch
                </span>
              </div>

              {/* Bar visualization of annual failures */}
              <div className="mt-6 pt-4 grid grid-cols-9 gap-2 h-44 items-end pb-2 border-b border-[#dcdbda]">
                {trendData.map((d) => {
                  const heightPct = Math.round((d.failures / 84) * 100);
                  return (
                    <div key={d.year} className="flex flex-col items-center gap-2 group h-full justify-end">
                      <span 
                        className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                        style={{ color: '#787673', fontFeatureSettings: '"tnum"' }}
                      >
                        {d.failures}
                      </span>
                      <div 
                        className="w-full rounded-t-[4px] transition-all"
                        style={{ 
                          height: `${heightPct}%`,
                          backgroundColor: d.isPeak ? '#e16540' : '#373634'
                        }}
                      />
                      <span 
                        style={{
                          color: d.isPeak ? '#e16540' : '#787673',
                          fontSize: '11px',
                          fontWeight: d.isPeak ? 700 : 500
                        }}
                      >
                        {d.year.slice(2)}'
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div 
              className="mt-4 p-3.5 rounded-[10px] flex items-center justify-between text-[12px]"
              style={{
                backgroundColor: '#f6f5f3',
                border: '1px solid #dcdbda'
              }}
            >
              <div style={{ color: '#373634' }}>
                <strong style={{ color: '#111111' }}>Trend Insight:</strong> Zero-interest-rate policy (ZIRP) hangover drove record mortality spikes in 2022–2023.
              </div>
              <Link to="/insights" className="font-semibold hover:underline shrink-0 ml-3" style={{ color: '#2d72f0' }}>
                Details →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section: Capital Evaporated Metric & Breakdown */}
      <section className="site-container">
        <div 
          className="p-8 lg:p-10"
          style={{
            backgroundColor: '#272625',
            borderRadius: '16px',
            color: '#ffffff',
            border: '1px solid rgba(73, 72, 70, 0.85)',
            boxShadow: 'rgba(0, 0, 0, 0.2) 0px 8px 32px',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-3">
              <span 
                style={{
                  color: '#e16540',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                DATASET-DERIVED METRIC
              </span>
              <div 
                className="text-5xl sm:text-7xl tracking-tight"
                style={{
                  color: '#ffffff',
                  fontWeight: 700,
                  fontFeatureSettings: '"tnum"',
                  letterSpacing: '-0.42px',
                }}
              >
                $26.8B+
              </div>
              <h3 className="text-xl font-bold text-white">CAPITAL EVAPORATED</h3>
              <p className="text-[14px] text-[#dcdbda] leading-relaxed max-w-md">
                Total aggregate equity, debt, and venture capital associated with verified failure post-mortems in the PivotVault database.
              </p>
              <div className="pt-2">
                <Link 
                  to="/explore" 
                  className="inline-flex items-center justify-center !px-6 !py-3 text-[14px] transition-colors"
                  style={{
                    backgroundColor: '#373634',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.051)',
                    borderRadius: '9999px',
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#494846'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#373634'}
                >
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
                <div 
                  key={item.name} 
                  className="p-3.5 transition-colors"
                  style={{
                    backgroundColor: '#373634',
                    border: '1px solid rgba(73, 72, 70, 0.85)',
                    borderRadius: '10px'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CompanyLogo name={item.name} size="xs" />
                      <span className="font-bold text-white text-[15px]">{item.name}</span>
                    </div>
                    <span 
                      className="font-bold text-[14px]"
                      style={{ color: '#e16540', fontFeatureSettings: '"tnum"', letterSpacing: '-0.42px' }}
                    >
                      {item.lost}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#a7a6a4] uppercase mt-0.5">{item.sector}</div>
                  <div className="text-[12px] text-[#dcdbda] mt-1 line-clamp-1">{item.cause}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 5. Section: Failure Pattern Matrix (Heatmap) */}
      <section className="site-container">
        <div className="mb-6">
          <div 
            className="inline-flex items-center gap-2 mb-2 w-fit"
            style={{
              backgroundColor: 'rgba(50, 142, 250, 0.12)',
              color: '#328efa',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 600,
              padding: '4px 12px',
            }}
          >
            <Compass className="w-3 h-3 text-[#328efa]" />
            <span>CROSS-INDUSTRY MATRIX</span>
          </div>
          <h2 
            className="text-2xl sm:text-3xl tracking-tight"
            style={{ color: '#111111', fontWeight: 700 }}
          >
            Failure Pattern Matrix
          </h2>
          <p className="text-[14px] mt-1" style={{ color: '#787673' }}>
            Intensity indicates failure concentration across industries and root cause vectors. Click any cell to inspect.
          </p>
        </div>

        <div 
          className="p-6 overflow-x-auto"
          style={{
            backgroundColor: '#fbfaf9',
            border: '1px solid #dcdbda',
            borderRadius: '16px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
          }}
        >
          <table className="w-full min-w-[700px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#dcdbda]">
                <th className="py-3 px-4 font-bold w-44" style={{ color: '#111111' }}>Failure Vector</th>
                {heatmapIndustries.map((ind) => (
                  <th key={ind} className="py-3 px-3 font-bold text-center" style={{ color: '#111111' }}>
                    {ind}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapVectors.map((row) => (
                <tr key={row.name} className="border-b border-[#ecebea] hover:bg-[#f6f5f3]">
                  <td className="py-3.5 px-4 font-semibold" style={{ color: '#111111' }}>
                    {row.name}
                  </td>
                  {row.values.map((intensity, idx) => {
                    const industry = heatmapIndustries[idx];
                    const isSelected = activeHeatmapCell.vector === row.name && activeHeatmapCell.industry === industry;
                    const isHighestRisk = intensity === 5;
                    
                    let bgStyle = { backgroundColor: '#f6f5f3', color: '#787673', border: '1px solid #dcdbda' };
                    if (isHighestRisk) {
                      bgStyle = { backgroundColor: 'rgba(225, 101, 64, 0.12)', color: '#e16540', border: '1px solid rgba(225, 101, 64, 0.3)' };
                    } else if (intensity === 4) {
                      bgStyle = { backgroundColor: '#111111', color: '#ffffff', border: 'none' };
                    } else if (intensity === 3) {
                      bgStyle = { backgroundColor: '#2d72f0', color: '#ffffff', border: 'none' };
                    } else if (intensity === 2) {
                      bgStyle = { backgroundColor: 'rgba(45, 114, 240, 0.15)', color: '#2d72f0', border: 'none' };
                    }

                    return (
                      <td key={industry} className="py-2.5 px-2 text-center">
                        <button
                          onClick={() => setActiveHeatmapCell({ vector: row.name, industry, detail: row.detail })}
                          className={`w-10 h-8 rounded-[6px] text-[11px] font-semibold transition-transform hover:scale-105 inline-flex items-center justify-center ${
                            isSelected ? 'ring-2 ring-[#e16540] scale-105' : ''
                          }`}
                          style={bgStyle}
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
          <div 
            className="mt-4 p-4 rounded-[10px] flex items-center justify-between text-[13px]"
            style={{
              backgroundColor: '#f6f5f3',
              border: '1px solid #dcdbda'
            }}
          >
            <div>
              <span className="font-bold" style={{ color: '#111111' }}>Selected Intersection: </span>
              <strong style={{ color: '#e16540' }}>{activeHeatmapCell.vector}</strong> × <strong style={{ color: '#111111' }}>{activeHeatmapCell.industry}</strong>
              <span className="ml-2" style={{ color: '#5e5c5a' }}>
                — {activeHeatmapCell.detail || 'High structural vulnerability observed in capital-intensive rollout models.'}
              </span>
            </div>
            <Link 
              to={`/explore?q=${encodeURIComponent(activeHeatmapCell.vector)}`} 
              className="shrink-0 ml-4 font-medium text-[12px] hover:underline"
              style={{ color: '#2d72f0' }}
            >
              Explore Cases →
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Section: The Startup Failure Network */}
      <section className="site-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div 
              className="inline-flex items-center gap-2 mb-2 w-fit"
              style={{
                backgroundColor: 'rgba(50, 142, 250, 0.12)',
                color: '#328efa',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 12px',
              }}
            >
              <Network className="w-3 h-3 text-[#328efa]" />
              <span>RELATIONAL TOPOLOGY</span>
            </div>
            <h2 
              className="text-2xl sm:text-3xl tracking-tight"
              style={{ color: '#111111', fontWeight: 700 }}
            >
              The Startup Failure Network
            </h2>
            <p className="text-[14px] mt-1" style={{ color: '#787673' }}>
              Connect startups, founders, investors, markets, and failure causes. Explore cross-entity contagion.
            </p>
          </div>
          <Link 
            to="/startup-graph" 
            className="shrink-0 font-medium hover:underline"
            style={{ color: '#2d72f0' }}
          >
            <span>Launch Full Graph Engine</span>
            <span>→</span>
          </Link>
        </div>

        <div 
          className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
          style={{
            backgroundColor: '#fbfaf9',
            border: '1px solid #dcdbda',
            borderRadius: '16px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
          }}
        >
          {/* Node Canvas Simulation */}
          <div 
            className="lg:col-span-7 p-6 relative min-h-[340px] flex flex-col justify-between"
            style={{
              backgroundColor: '#f6f5f3',
              border: '1px solid #dcdbda',
              borderRadius: '12px'
            }}
          >
            <div className="flex items-center justify-between text-[11px] pb-2 border-b border-[#dcdbda]" style={{ color: '#787673' }}>
              <span>INTERACTIVE CLUSTER VIEW</span>
              <span>413 NODES • 890 EDGES</span>
            </div>

            <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="flex items-center gap-3 flex-wrap justify-center">
                {Object.keys(graphEntities).map((key) => {
                  const isSelected = activeGraphNode === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveGraphNode(key)}
                      className={`px-4 py-2 rounded-[8px] text-[13px] font-bold uppercase transition-all ${
                        isSelected 
                          ? 'bg-[#111111] text-white scale-105 ring-2 ring-[#2d72f0]' 
                          : 'bg-[#ffffff] text-[#373634] border border-[#dcdbda] hover:bg-[#f6f5f3]'
                      }`}
                    >
                      {graphEntities[key].name}
                    </button>
                  );
                })}
              </div>

              <div className="w-full max-w-md pt-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#787673' }}>
                  DIRECTLY LINKED EDGES:
                </div>
                <div className="grid grid-cols-2 gap-2 text-left">
                  {graphEntities[activeGraphNode].connections.map((c, i) => (
                    <div 
                      key={i} 
                      className="p-2.5 text-[11px]"
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #dcdbda',
                        borderRadius: '8px'
                      }}
                    >
                      <div className="font-bold line-clamp-1" style={{ color: '#111111' }}>{c.name}</div>
                      <div style={{ color: '#787673', fontSize: '10px' }}>{c.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-[11px] flex items-center justify-between pt-2 border-t border-[#dcdbda]" style={{ color: '#787673' }}>
              <span>Click node to reveal relationship mapping</span>
              <span className="font-semibold" style={{ color: '#2d72f0' }}>Selected: {graphEntities[activeGraphNode].name}</span>
            </div>
          </div>

          {/* Node Inspector Detail Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div 
              className="p-4"
              style={{
                backgroundColor: '#f6f5f3',
                border: '1px solid #dcdbda',
                borderRadius: '12px'
              }}
            >
              <span 
                className="mb-2 inline-block"
                style={{
                  backgroundColor: 'rgba(225, 101, 64, 0.12)',
                  color: '#e16540',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px'
                }}
              >
                Entity Dossier
              </span>
              <h3 className="text-[20px] font-bold" style={{ color: '#111111' }}>
                {graphEntities[activeGraphNode].name}
              </h3>
              <div 
                className="text-[12px] font-semibold mb-2"
                style={{ color: '#e16540' }}
              >
                {graphEntities[activeGraphNode].type}
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: '#5e5c5a' }}>
                {graphEntities[activeGraphNode].description}
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-[12px] font-bold uppercase tracking-wider" style={{ color: '#111111' }}>
                Network Contagion Analysis
              </h4>
              <p className="text-[12px] leading-relaxed" style={{ color: '#787673' }}>
                Founders and lead investors who repeat high-burn strategies across portfolio companies carry a 2.4x higher repeat failure correlation.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Link 
                to="/startup-graph" 
                className="transition-colors text-[13px]"
                style={{
                  backgroundColor: '#2d72f0',
                  color: '#ffffff',
                  borderRadius: '9999px',
                  padding: '10px 20px',
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d5ec9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2d72f0'}
              >
                Explore in 3D Graph →
              </Link>
              <Link 
                to={`/startup/${activeGraphNode}`} 
                className="text-[13px] transition-colors"
                style={{
                  border: '1px solid #dcdbda',
                  backgroundColor: '#ffffff',
                  color: '#111111',
                  borderRadius: '9999px',
                  padding: '10px 18px',
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f6f5f3'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                Read Autopsy
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Section: Process Flow */}
      <section className="site-container">
        <div 
          className="p-8"
          style={{
            backgroundColor: '#fbfaf9',
            border: '1px solid #dcdbda',
            borderRadius: '16px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
          }}
        >
          <div className="text-center mb-8">
            <span 
              className="block mb-1 font-bold uppercase tracking-wider"
              style={{ color: '#2d72f0', fontSize: '11px' }}
            >
              PLATFORM ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#111111' }}>
              From Failure Evidence to Founder Action
            </h2>
            <p className="text-[14px] mt-1 max-w-xl mx-auto" style={{ color: '#787673' }}>
              How PivotVault transforms raw corporate wreckage into defensible strategic foresight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
            {[
              { num: '01. COLLECT', title: 'Public Evidence', desc: 'SEC filings, court dockets, post-mortems & liquidation reports.' },
              { num: '02. ENRICH', title: 'AI Extraction', desc: 'Dual-engine extraction of cash burn velocity & fatal pivots.' },
              { num: '03. CONNECT', title: 'Knowledge Graph', desc: 'Map cross-entity founder, investor, and failure vector relationships.' },
              { num: '04. ANALYZE', title: 'Failure Patterns', desc: 'Calculate Failure Scores (0–100) and multi-factor risk meters.' },
              { num: '05. ACT', title: 'Founder Action', desc: 'Audit pitch decks, scan business models, and pivot safely.', highlight: true },
            ].map((step, idx) => (
              <div 
                key={idx}
                className="p-4 flex flex-col justify-between"
                style={{
                  backgroundColor: step.highlight ? '#272625' : '#f6f5f3',
                  color: step.highlight ? '#ffffff' : '#373634',
                  border: `1px solid ${step.highlight ? '#373634' : '#dcdbda'}`,
                  borderRadius: '12px'
                }}
              >
                <div>
                  <span 
                    className="block mb-1 text-[11px] font-mono font-bold"
                    style={{ color: step.highlight ? '#47d096' : '#787673' }}
                  >
                    {step.num}
                  </span>
                  <h4 
                    className="text-[15px] font-bold"
                    style={{ color: step.highlight ? '#ffffff' : '#111111' }}
                  >
                    {step.title}
                  </h4>
                  <p 
                    className="text-[12px] mt-2 leading-relaxed"
                    style={{ color: step.highlight ? '#ecebea' : '#5e5c5a' }}
                  >
                    {step.desc}
                  </p>
                </div>
                <div 
                  className="mt-3 text-[16px]"
                  style={{ color: step.highlight ? '#47d096' : '#787673' }}
                >
                  {step.highlight ? '★' : '↓'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Section: Core Platform Modules */}
      <section className="site-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div 
              className="inline-flex items-center gap-2 mb-2 w-fit"
              style={{
                backgroundColor: 'rgba(50, 142, 250, 0.12)',
                color: '#328efa',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 12px',
              }}
            >
              <Layers className="w-3 h-3 text-[#328efa]" />
              <span>CORE PLATFORM MODULES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#111111' }}>
              Intelligence Feature Suite
            </h2>
            <p className="text-[14px] mt-1" style={{ color: '#787673' }}>
              Every tool is engineered with distinct diagnostic capabilities to deconstruct risk.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Failure Archive */}
          <Link 
            to="/explore" 
            className="p-6 group flex flex-col justify-between transition-all"
            style={{
              backgroundColor: '#fbfaf9',
              border: '1px solid #dcdbda',
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span 
                  style={{
                    backgroundColor: '#f6f5f3',
                    color: '#5e5c5a',
                    border: '1px solid #dcdbda',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px'
                  }}
                >
                  413+ Dossiers
                </span>
                <Database className="w-5 h-5 text-[#2d72f0]" />
              </div>
              <h3 className="text-[18px] font-bold group-hover:text-[#2d72f0] transition-colors" style={{ color: '#111111' }}>
                Failure Archive
              </h3>
              <p className="text-[13px] mt-1" style={{ color: '#787673' }}>
                Forensic post-mortems with capital loss figures, timelines, and root cause tags.
              </p>

              <div 
                className="mt-4 p-3 rounded-[8px] text-[11px] space-y-1.5"
                style={{ backgroundColor: '#f6f5f3', border: '1px solid #dcdbda' }}
              >
                <div className="flex justify-between font-bold border-b border-[#dcdbda] pb-1" style={{ color: '#111111' }}>
                  <span>STARTUP</span>
                  <span>FS SCORE</span>
                  <span>CAPITAL</span>
                </div>
                <div className="flex justify-between items-center" style={{ color: '#373634' }}>
                  <div className="flex items-center gap-1.5">
                    <CompanyLogo name="Theranos" size="xs" />
                    <span>Theranos</span>
                  </div>
                  <span style={{ color: '#e16540', fontWeight: 600 }}>98</span>
                  <span style={{ fontFeatureSettings: '"tnum"' }}>$1.4B</span>
                </div>
                <div className="flex justify-between items-center" style={{ color: '#373634' }}>
                  <div className="flex items-center gap-1.5">
                    <CompanyLogo name="WeWork" size="xs" />
                    <span>WeWork</span>
                  </div>
                  <span style={{ color: '#e16540', fontWeight: 600 }}>92</span>
                  <span style={{ fontFeatureSettings: '"tnum"' }}>$12.8B</span>
                </div>
                <div className="flex justify-between items-center" style={{ color: '#373634' }}>
                  <div className="flex items-center gap-1.5">
                    <CompanyLogo name="Fast" size="xs" />
                    <span>Fast</span>
                  </div>
                  <span style={{ color: '#e16540', fontWeight: 600 }}>88</span>
                  <span style={{ fontFeatureSettings: '"tnum"' }}>$125M</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#dcdbda] flex items-center justify-between text-[12px] font-medium" style={{ color: '#2d72f0' }}>
              <span>Explore Archive</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 2: Founder Playbook */}
          <Link 
            to="/founder-playbook" 
            className="p-6 group flex flex-col justify-between transition-all"
            style={{
              backgroundColor: '#fbfaf9',
              border: '1px solid #dcdbda',
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span 
                  style={{
                    backgroundColor: 'rgba(225, 101, 64, 0.12)',
                    color: '#e16540',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px'
                  }}
                >
                  Tactical Plays
                </span>
                <BookOpen className="w-5 h-5 text-[#2d72f0]" />
              </div>
              <h3 className="text-[18px] font-bold group-hover:text-[#2d72f0] transition-colors" style={{ color: '#111111' }}>
                Founder Playbook
              </h3>
              <p className="text-[13px] mt-1" style={{ color: '#787673' }}>
                Defensive rules and counter-measures extracted from 413+ historical collapse post-mortems.
              </p>

              <div 
                className="mt-4 p-3 rounded-[8px] text-[11px] space-y-1"
                style={{ backgroundColor: '#f6f5f3', border: '1px solid #dcdbda' }}
              >
                <div className="font-bold flex items-center gap-1" style={{ color: '#111111' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#e16540' }} />
                  <span>Rule: Validate Margin Before Scale</span>
                </div>
                <p className="line-clamp-2" style={{ color: '#787673' }}>
                  "Never subsidize gross unit economics with venture equity under the assumption of future operational scale."
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#dcdbda] flex items-center justify-between text-[12px] font-medium" style={{ color: '#2d72f0' }}>
              <span>Explore Playbook</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 3: Risk Scanner */}
          <Link 
            to="/risk-scanner" 
            className="p-6 group flex flex-col justify-between transition-all"
            style={{
              backgroundColor: '#fbfaf9',
              border: '1px solid #dcdbda',
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span 
                  style={{
                    backgroundColor: '#f6f5f3',
                    color: '#5e5c5a',
                    border: '1px solid #dcdbda',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px'
                  }}
                >
                  Defensive Tool
                </span>
                <ShieldAlert className="w-5 h-5 text-[#2d72f0]" />
              </div>
              <h3 className="text-[18px] font-bold group-hover:text-[#2d72f0] transition-colors" style={{ color: '#111111' }}>
                Risk Scanner
              </h3>
              <p className="text-[13px] mt-1" style={{ color: '#787673' }}>
                Stress-test your startup idea against historical failure distributions.
              </p>

              <div 
                className="mt-4 p-3 rounded-[8px] text-[11px] space-y-1.5"
                style={{ backgroundColor: '#f6f5f3', border: '1px solid #dcdbda' }}
              >
                <div className="flex justify-between items-center font-bold">
                  <span style={{ color: '#111111' }}>CALCULATED RISK SCORE</span>
                  <span style={{ color: '#e16540', fontFeatureSettings: '"tnum"' }}>72 / 100</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#ecebea' }}>
                  <div className="h-full rounded-full" style={{ width: '72%', backgroundColor: '#e16540' }} />
                </div>
                <div className="flex justify-between text-[10px]" style={{ color: '#787673' }}>
                  <span>Unit Economics: HIGH</span>
                  <span>Competition: HIGH</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#dcdbda] flex items-center justify-between text-[12px] font-medium" style={{ color: '#2d72f0' }}>
              <span>Run Risk Scan</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 4: Pitch Deck Autopsy */}
          <Link 
            to="/pitch-deck-autopsy" 
            className="p-6 group flex flex-col justify-between transition-all"
            style={{
              backgroundColor: '#fbfaf9',
              border: '1px solid #dcdbda',
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span 
                  style={{
                    backgroundColor: '#f6f5f3',
                    color: '#5e5c5a',
                    border: '1px solid #dcdbda',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px'
                  }}
                >
                  Pre-Seed / Seed
                </span>
                <FileText className="w-5 h-5 text-[#2d72f0]" />
              </div>
              <h3 className="text-[18px] font-bold group-hover:text-[#2d72f0] transition-colors" style={{ color: '#111111' }}>
                Pitch Deck Autopsy
              </h3>
              <p className="text-[13px] mt-1" style={{ color: '#787673' }}>
                Audit pitch decks against historical failure traps and valuation fallacies.
              </p>

              <div 
                className="mt-4 p-3 rounded-[8px] text-[11px] space-y-1.5"
                style={{ backgroundColor: '#f6f5f3', border: '1px solid #dcdbda' }}
              >
                <div className="flex items-center gap-1.5 font-bold" style={{ color: '#e16540' }}>
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Slide 4: Unit Economics Trap</span>
                </div>
                <p className="text-[11px]" style={{ color: '#787673' }}>
                  CAC calculation omits sales overhead, creating false margin projections.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#dcdbda] flex items-center justify-between text-[12px] font-medium" style={{ color: '#2d72f0' }}>
              <span>Audit Pitch Deck</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 5: Knowledge Graph */}
          <Link 
            to="/startup-graph" 
            className="p-6 group flex flex-col justify-between transition-all"
            style={{
              backgroundColor: '#fbfaf9',
              border: '1px solid #dcdbda',
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span 
                  style={{
                    backgroundColor: '#f6f5f3',
                    color: '#5e5c5a',
                    border: '1px solid #dcdbda',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px'
                  }}
                >
                  Relational Graph
                </span>
                <Network className="w-5 h-5 text-[#2d72f0]" />
              </div>
              <h3 className="text-[18px] font-bold group-hover:text-[#2d72f0] transition-colors" style={{ color: '#111111' }}>
                Knowledge Graph
              </h3>
              <p className="text-[13px] mt-1" style={{ color: '#787673' }}>
                Explore relational topologies between investors, founders, and root causes.
              </p>

              <div 
                className="mt-4 p-3 rounded-[8px] text-[11px] flex items-center justify-center gap-2"
                style={{ backgroundColor: '#f6f5f3', border: '1px solid #dcdbda' }}
              >
                <span className="p-1 px-2 rounded font-bold" style={{ backgroundColor: '#111111', color: '#ffffff' }}>Startup</span>
                <span style={{ color: '#dcdbda' }}>───</span>
                <span className="p-1 px-2 rounded font-bold" style={{ backgroundColor: 'rgba(225, 101, 64, 0.12)', color: '#e16540' }}>Cause</span>
                <span style={{ color: '#dcdbda' }}>───</span>
                <span className="p-1 px-2 rounded" style={{ backgroundColor: '#ffffff', color: '#373634', border: '1px solid #dcdbda' }}>Investor</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#dcdbda] flex items-center justify-between text-[12px] font-medium" style={{ color: '#2d72f0' }}>
              <span>Launch Graph</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 6: Hall of Ghosts */}
          <Link 
            to="/hall-of-ghosts" 
            className="p-6 group flex flex-col justify-between transition-all"
            style={{
              backgroundColor: '#fbfaf9',
              border: '1px solid #dcdbda',
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span 
                  style={{
                    backgroundColor: 'rgba(225, 101, 64, 0.12)',
                    color: '#e16540',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px'
                  }}
                >
                  AI Debrief
                </span>
                <Users className="w-5 h-5 text-[#2d72f0]" />
              </div>
              <h3 className="text-[18px] font-bold group-hover:text-[#2d72f0] transition-colors" style={{ color: '#111111' }}>
                Hall of Ghosts
              </h3>
              <p className="text-[13px] mt-1" style={{ color: '#787673' }}>
                Interview AI personas reconstructed from court records and post-mortem testimonies.
              </p>

              <div 
                className="mt-4 p-3 rounded-[8px] text-[11px] space-y-1"
                style={{ backgroundColor: '#f6f5f3', border: '1px solid #dcdbda' }}
              >
                <div className="font-bold" style={{ color: '#111111' }}>
                  Ghost: Adam Neumann (WeWork)
                </div>
                <p className="italic line-clamp-1" style={{ color: '#787673' }}>
                  "We mistook access to unlimited venture capital for structural market validation."
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#dcdbda] flex items-center justify-between text-[12px] font-medium" style={{ color: '#2d72f0' }}>
              <span>Enter Hall of Ghosts</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 9. Section: Risk Scanner Live Interactive Preview */}
      <section className="site-container">
        <div 
          className="p-8 lg:p-10"
          style={{
            backgroundColor: '#fbfaf9',
            border: '1px solid #dcdbda',
            borderRadius: '16px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column */}
            <div className="lg:col-span-6 space-y-4">
              <div 
                className="inline-flex items-center gap-2 mb-1 w-fit"
                style={{
                  backgroundColor: 'rgba(225, 101, 64, 0.12)',
                  color: '#e16540',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 10px'
                }}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>RISK SCANNER DEMO</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: '#111111' }}>
                Scan Your Startup Idea
              </h2>
              
              <p className="text-[15px] leading-relaxed" style={{ color: '#787673' }}>
                How does your business model compare with historical failures? Stress-test your assumptions against 413+ autopsy distributions.
              </p>

              <div className="space-y-3 pt-2">
                <label className="text-[12px] font-bold uppercase tracking-wider block" style={{ color: '#111111' }}>
                  Describe Your Startup Model:
                </label>
                <textarea
                  value={demoIdea}
                  onChange={(e) => setDemoIdea(e.target.value)}
                  rows={3}
                  className="w-full p-3.5 text-[14px] focus:outline-none"
                  style={{
                    backgroundColor: '#f6f5f3',
                    border: '1px solid #dcdbda',
                    borderRadius: '8px',
                    color: '#111111'
                  }}
                />

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRunDemoScan}
                    disabled={isScanning}
                    className="transition-colors"
                    style={{
                      backgroundColor: '#2d72f0',
                      color: '#ffffff',
                      borderRadius: '9999px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: 500,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d5ec9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2d72f0'}
                  >
                    {isScanning ? 'Analyzing Patterns...' : 'RUN RISK SCAN →'}
                  </button>
                  <Link to="/risk-scanner" className="text-[13px] font-semibold hover:underline" style={{ color: '#2d72f0' }}>
                    Full Scanner Suite →
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div 
              className="lg:col-span-6 p-6 space-y-5"
              style={{
                backgroundColor: '#f6f5f3',
                border: '1px solid #dcdbda',
                borderRadius: '12px'
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#dcdbda]">
                <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: '#111111' }}>
                  DIAGNOSTIC RISK RESULT
                </span>
                <span 
                  style={{
                    backgroundColor: 'rgba(225, 101, 64, 0.12)',
                    color: '#e16540',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px'
                  }}
                >
                  {scanResult.rating}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-bold" style={{ color: '#787673' }}>
                    FAILURE RISK INDEX
                  </div>
                  <div 
                    className="text-4xl font-bold"
                    style={{ color: '#e16540', fontFeatureSettings: '"tnum"' }}
                  >
                    {scanResult.score} <span className="text-xl" style={{ color: '#787673' }}>/ 100</span>
                  </div>
                </div>
                <div className="text-right text-[12px]" style={{ color: '#787673' }}>
                  <span>Confidence: <strong style={{ color: '#111111' }}>94%</strong></span> <br />
                  <span>Autopsy Correlates: <strong style={{ color: '#111111' }}>3 Matches</strong></span>
                </div>
              </div>

              {/* Category Risk Meters */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {scanResult.breakdown.map((item) => (
                  <div 
                    key={item.label} 
                    className="p-2.5 text-[12px]"
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #dcdbda',
                      borderRadius: '8px'
                    }}
                  >
                    <div className="flex justify-between font-medium mb-1" style={{ color: '#111111' }}>
                      <span>{item.label}</span>
                      <span style={{ color: item.level === 'HIGH' ? '#e16540' : '#111111', fontWeight: 600 }}>
                        {item.level}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#ecebea' }}>
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${item.val}%`,
                          backgroundColor: item.level === 'HIGH' ? '#e16540' : '#373634'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Historical Matches */}
              <div className="pt-2 border-t border-[#dcdbda]">
                <div className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: '#787673' }}>
                  TOP 3 HISTORICAL AUTOPSY MATCHES:
                </div>
                <div className="space-y-1.5">
                  {scanResult.matches.map((m) => (
                    <div 
                      key={m.name} 
                      className="flex items-center justify-between text-[12px] p-2"
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #dcdbda',
                        borderRadius: '6px'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold" style={{ color: '#111111' }}>{m.name}</span>
                        <span style={{ color: '#787673', fontSize: '11px' }}>— {m.cause}</span>
                      </div>
                      <span 
                        className="font-bold text-[11px]"
                        style={{ color: '#e16540', fontFeatureSettings: '"tnum"' }}
                      >
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
      <section className="site-container">
        <div 
          className="p-8 lg:p-10"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e3e8ee',
            borderRadius: '16px',
            boxShadow: 'rgba(0, 55, 112, 0.06) 0px 2px 8px'
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div 
                className="inline-flex items-center gap-2 mb-2 w-fit"
                style={{
                  backgroundColor: '#b9b9f9',
                  color: '#4434d4',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 500,
                  padding: '4px 12px',
                }}
              >
                <Users className="w-3 h-3 text-[#533afd]" />
                <span>FORENSIC AI PERSONAS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: '#0d253d' }}>
                LEARN FROM THE PEOPLE WHO LIVED IT.
              </h2>
              <p className="text-[14px] mt-1" style={{ color: '#64748d' }}>
                AI-reconstructed founder personas built exclusively from public testimonies, SEC depositions, and post-mortem postmortems.
              </p>
            </div>

            <div className="text-right">
              <span className="badge-neutral text-[10px]">
                AI-RECONSTRUCTED PERSONA • BASED ON PUBLIC EVIDENCE
              </span>
            </div>
          </div>

          {/* Persona Switcher Tabs */}
          <div className="flex items-center gap-2 border-b border-[#e3e8ee] pb-3 mb-6 overflow-x-auto">
            {Object.keys(ghostProfiles).map((key) => {
              const p = ghostProfiles[key];
              const isSelected = activeGhost === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveGhost(key)}
                  className="px-4 py-2 rounded-full text-[13px] font-medium transition-colors whitespace-nowrap flex items-center gap-2"
                  style={{
                    backgroundColor: isSelected ? '#0d253d' : '#f6f9fc',
                    color: isSelected ? '#ffffff' : '#64748d',
                    border: isSelected ? 'none' : '1px solid #e3e8ee',
                  }}
                >
                  <span>{p.name}</span>
                  <span className="text-[11px] opacity-70">({p.startup})</span>
                </button>
              );
            })}
          </div>

          {/* Dialogue Conversation Card */}
          <div 
            className="p-6 space-y-4"
            style={{
              backgroundColor: '#f6f9fc',
              border: '1px solid #e3e8ee',
              borderRadius: '12px'
            }}
          >
            {/* User Query */}
            <div className="flex items-start gap-3">
              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0"
                style={{ backgroundColor: '#0d253d', color: '#ffffff' }}
              >
                YOU
              </div>
              <div 
                className="p-3 text-[13px] font-medium"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e3e8ee',
                  borderRadius: '8px',
                  color: '#0d253d'
                }}
              >
                "What warning signs did you miss before the collapse became irreversible?"
              </div>
            </div>

            {/* Ghost Response */}
            <div className="flex items-start gap-3">
              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0"
                style={{
                  backgroundColor: 'rgba(234, 34, 97, 0.10)',
                  color: '#ea2261',
                  border: '1px solid rgba(234, 34, 97, 0.20)'
                }}
              >
                AI
              </div>
              <div 
                className="p-4 text-[14px] leading-relaxed space-y-2"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e3e8ee',
                  borderRadius: '8px',
                  color: '#273951'
                }}
              >
                <div className="text-[11px] font-semibold uppercase" style={{ color: '#64748d' }}>
                  {ghostProfiles[activeGhost].name} ({ghostProfiles[activeGhost].startup} — {ghostProfiles[activeGhost].stat})
                </div>
                <p className="italic">
                  "{ghostProfiles[activeGhost].quote}"
                </p>
                <div className="pt-2 text-[12px] font-bold" style={{ color: '#ea2261' }}>
                  Core Lesson: {ghostProfiles[activeGhost].lesson}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#e3e8ee] text-[12px]">
              <span style={{ color: '#64748d' }}>
                Persona generated from public evidence. Does not imply living founder participation.
              </span>
              <Link 
                to="/hall-of-ghosts" 
                className="transition-colors text-[12px]"
                style={{
                  backgroundColor: '#533afd',
                  color: '#ffffff',
                  borderRadius: '9999px',
                  padding: '8px 18px',
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4434d4'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#533afd'}
              >
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
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: '#0d253d' }}>
              Recently Vaulted Startups
            </h2>
            <p className="text-[14px] mt-1" style={{ color: '#64748d' }}>
              Examining the most instructive multi-million and multi-billion dollar startup collapses.
            </p>
          </div>

          <Link
            to="/explore"
            className="shrink-0 font-medium hover:underline"
            style={{ color: '#533afd' }}
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
      <section className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: AI Signals */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xl font-bold" style={{ color: '#0d253d' }}>AI SIGNALS FEED</h3>
                <p className="text-[13px]" style={{ color: '#64748d' }}>Live heuristic alerts generated across the archive</p>
              </div>
              <span className="badge-neutral text-[11px]">Real-Time Rules</span>
            </div>

            <div className="space-y-3">
              <div 
                className="p-4 transition-colors"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e3e8ee',
                  borderRadius: '12px'
                }}
              >
                <div className="flex items-center justify-between text-[11px] font-bold uppercase mb-1">
                  <span className="flex items-center gap-1.5" style={{ color: '#ea2261' }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ea2261' }} />
                    PATTERN DETECTED
                  </span>
                  <span style={{ color: '#64748d' }}>10m ago</span>
                </div>
                <h4 className="text-[14px] font-bold" style={{ color: '#0d253d' }}>
                  Hardware Unit Economics Threshold
                </h4>
                <p className="text-[12px] mt-1 leading-relaxed" style={{ color: '#64748d' }}>
                  Unit economics deterioration appears repeatedly across documented consumer hardware failures (Juicero, Pebble, Lily Robotics).
                </p>
              </div>

              <div 
                className="p-4 transition-colors"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e3e8ee',
                  borderRadius: '12px'
                }}
              >
                <div className="flex items-center justify-between text-[11px] font-bold uppercase mb-1">
                  <span className="flex items-center gap-1.5" style={{ color: '#533afd' }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#533afd' }} />
                    HISTORICAL PARALLEL
                  </span>
                  <span style={{ color: '#64748d' }}>1h ago</span>
                </div>
                <h4 className="text-[14px] font-bold" style={{ color: '#0d253d' }}>
                  On-Demand Delivery Margin Compression
                </h4>
                <p className="text-[12px] mt-1 leading-relaxed" style={{ color: '#64748d' }}>
                  Current quick-commerce subsidies mirror 1999–2001 dot-com logistics collapses (Webvan, Kozmo).
                </p>
              </div>

              <div 
                className="p-4 transition-colors"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e3e8ee',
                  borderRadius: '12px'
                }}
              >
                <div className="flex items-center justify-between text-[11px] font-bold uppercase mb-1">
                  <span className="flex items-center gap-1.5" style={{ color: '#ea2261' }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ea2261' }} />
                    RISK SIGNAL
                  </span>
                  <span style={{ color: '#64748d' }}>3h ago</span>
                </div>
                <h4 className="text-[14px] font-bold" style={{ color: '#0d253d' }}>
                  Extreme Customer Acquisition Burn
                </h4>
                <p className="text-[12px] mt-1 leading-relaxed" style={{ color: '#64748d' }}>
                  Startups spending &gt;80% of venture equity on paid marketing without organic retention suffer 92% mortality when funding dries up.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Global Footprint */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xl font-bold" style={{ color: '#0d253d' }}>GLOBAL FAILURE INTELLIGENCE</h3>
                <p className="text-[13px]" style={{ color: '#64748d' }}>Geographic footprint of 413+ startup post-mortems</p>
              </div>
              <Globe className="w-5 h-5 text-[#533afd]" />
            </div>

            <div 
              className="p-6 space-y-5"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e3e8ee',
                borderRadius: '16px',
                boxShadow: 'rgba(0, 55, 112, 0.06) 0px 2px 8px'
              }}
            >
              <div className="grid grid-cols-3 gap-3 text-center">
                <div 
                  className="p-3"
                  style={{
                    backgroundColor: '#f6f9fc',
                    border: '1px solid #e3e8ee',
                    borderRadius: '8px'
                  }}
                >
                  <div className="text-2xl font-bold" style={{ color: '#0d253d', fontFeatureSettings: '"tnum"' }}>413+</div>
                  <div className="text-[10px] font-semibold uppercase" style={{ color: '#64748d' }}>Startups</div>
                </div>
                <div 
                  className="p-3"
                  style={{
                    backgroundColor: '#f6f9fc',
                    border: '1px solid #e3e8ee',
                    borderRadius: '8px'
                  }}
                >
                  <div className="text-2xl font-bold" style={{ color: '#0d253d', fontFeatureSettings: '"tnum"' }}>40+</div>
                  <div className="text-[10px] font-semibold uppercase" style={{ color: '#64748d' }}>Countries</div>
                </div>
                <div 
                  className="p-3"
                  style={{
                    backgroundColor: 'rgba(234, 34, 97, 0.10)',
                    border: '1px solid rgba(234, 34, 97, 0.20)',
                    borderRadius: '8px'
                  }}
                >
                  <div className="text-2xl font-bold" style={{ color: '#ea2261', fontFeatureSettings: '"tnum"' }}>14</div>
                  <div className="text-[10px] font-semibold uppercase" style={{ color: '#ea2261' }}>Vectors</div>
                </div>
              </div>

              {/* Regional Concentration Bars */}
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between text-[12px] font-medium mb-1" style={{ color: '#0d253d' }}>
                    <span>North America (Silicon Valley, NY, Austin)</span>
                    <span style={{ fontFeatureSettings: '"tnum"', fontWeight: 600 }}>68%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#f6f9fc' }}>
                    <div className="h-full rounded-full" style={{ width: '68%', backgroundColor: '#0d253d' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[12px] font-medium mb-1" style={{ color: '#0d253d' }}>
                    <span>Europe (London, Berlin, Paris)</span>
                    <span style={{ fontFeatureSettings: '"tnum"', fontWeight: 600 }}>18%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#f6f9fc' }}>
                    <div className="h-full rounded-full" style={{ width: '18%', backgroundColor: '#533afd' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[12px] font-medium mb-1" style={{ color: '#0d253d' }}>
                    <span>Asia-Pacific (Bengaluru, Singapore, Sydney)</span>
                    <span style={{ fontFeatureSettings: '"tnum"', fontWeight: 600 }}>11%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#f6f9fc' }}>
                    <div className="h-full rounded-full" style={{ width: '11%', backgroundColor: '#64748d' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[12px] font-medium mb-1" style={{ color: '#0d253d' }}>
                    <span>Latin America & Rest of World</span>
                    <span style={{ fontFeatureSettings: '"tnum"', fontWeight: 600 }}>3%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#f6f9fc' }}>
                    <div className="h-full rounded-full" style={{ width: '3%', backgroundColor: '#a8c3de' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. Section: Built on Public Evidence */}
      <section className="site-container">
        <div 
          className="p-8"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e3e8ee',
            borderRadius: '16px',
            boxShadow: 'rgba(0, 55, 112, 0.06) 0px 2px 8px'
          }}
        >
          <div className="text-center mb-8">
            <span 
              className="block mb-1 font-bold uppercase tracking-wider"
              style={{ color: '#533afd', fontSize: '11px' }}
            >
              TRUST & VERIFIABILITY
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#0d253d' }}>
              BUILT ON PUBLIC EVIDENCE
            </h2>
            <p className="text-[14px] mt-1 max-w-xl mx-auto" style={{ color: '#64748d' }}>
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
                className="p-3.5"
                style={{
                  backgroundColor: '#f6f9fc',
                  border: '1px solid #e3e8ee',
                  borderRadius: '10px'
                }}
              >
                <CheckCircle2 className="w-4 h-4 text-[#533afd] mx-auto mb-2" />
                <h4 className="text-[11px] font-bold uppercase" style={{ color: '#0d253d' }}>{source.label}</h4>
                <p className="text-[10px] mt-1" style={{ color: '#64748d' }}>{source.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. Section: FAQ Section */}
      <section className="site-container pt-8 border-t border-[#e3e8ee]">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#0d253d' }}>
              Frequently Asked Questions
            </h2>
            <p className="mt-1 text-[14px]" style={{ color: '#64748d' }}>
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
              <div 
                key={idx} 
                className="p-5"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e3e8ee',
                  borderRadius: '12px',
                  boxShadow: 'rgba(0, 55, 112, 0.04) 0px 1px 3px'
                }}
              >
                <h4 className="text-[16px] font-bold flex items-center gap-2" style={{ color: '#0d253d' }}>
                  <span style={{ color: '#ea2261' }}>Q:</span>
                  <span>{faq.q}</span>
                </h4>
                <p className="mt-2 text-[14px] leading-relaxed pl-5" style={{ color: '#273951' }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. Section: Final CTA */}
      <section className="site-container">
        <div 
          className="p-10 lg:p-14 text-center"
          style={{
            backgroundColor: '#1c1e54',
            borderRadius: '16px',
            color: '#ffffff',
            border: '1px solid #273951'
          }}
        >
          <span 
            className="block mb-2 text-[11px] font-mono font-bold uppercase tracking-widest"
            style={{ color: '#b9b9f9' }}
          >
            THE SURVIVAL MANDATE
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white max-w-3xl mx-auto leading-tight">
            DON'T REPEAT HISTORY.
          </h2>
          <p className="mt-4 text-[16px] sm:text-[18px] text-white/70 max-w-2xl mx-auto leading-relaxed">
            Explore the failures. Understand the patterns. Make the next decision better before writing code or raising capital.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            <Link 
              to="/explore" 
              className="text-[15px] transition-colors"
              style={{
                backgroundColor: '#533afd',
                color: '#ffffff',
                borderRadius: '9999px',
                padding: '14px 32px',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4434d4'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#533afd'}
            >
              EXPLORE FAILURE ARCHIVE →
            </Link>
            <Link 
              to="/risk-scanner" 
              className="inline-flex items-center justify-center text-[15px] transition-colors"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                borderRadius: '9999px',
                padding: '14px 32px',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
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
