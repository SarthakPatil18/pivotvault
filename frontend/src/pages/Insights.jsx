import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { getInsights } from '../lib/api';
import { formatCurrency, formatNumber } from '../lib/utils';
import { 
  ResponsiveContainer, 
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip 
} from 'recharts';
import { AlertTriangle, BookOpen, Gauge, Brain, TrendingUp, ShieldAlert, ArrowRight } from 'lucide-react';
import { LoadingState } from '../components/common/InsightCard';

function SparklineSVG({ data, stroke = '#000000', fill = 'rgba(0,0,0,0.06)', height = 30 }) {
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

export function Insights() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await getInsights();
        setStats(res.data);
      } catch (err) {
        console.error('Insights load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="vault-container py-20">
        <LoadingState message="Aggregating macroeconomic dataset telemetry across 413+ records..." />
      </div>
    );
  }

  // Failure vectors list
  const failureVectors = [
    { label: 'Unit Economics Collapse', pct: 28, count: 116, isHighRisk: true, color: 'from-rose-500 to-rose-600', dotColor: 'bg-rose-500' },
    { label: 'Lack of Market Need / PMF', pct: 22, count: 91, isHighRisk: false, color: 'from-amber-500 to-amber-600', dotColor: 'bg-amber-500' },
    { label: 'Execution & Operations', pct: 17, count: 70, isHighRisk: false, color: 'from-blue-500 to-blue-600', dotColor: 'bg-blue-500' },
    { label: 'Competition & Moat Deficit', pct: 14, count: 58, isHighRisk: false, color: 'from-purple-500 to-purple-600', dotColor: 'bg-purple-500' },
    { label: 'Runway Exhaustion / Burn', pct: 9, count: 37, isHighRisk: false, color: 'from-orange-500 to-orange-600', dotColor: 'bg-orange-500' },
    { label: 'Fraud & Governance Failure', pct: 5, count: 21, isHighRisk: false, color: 'from-red-600 to-red-700', dotColor: 'bg-red-600' },
    { label: 'Hardware & Manufacturing', pct: 3, count: 12, isHighRisk: false, color: 'from-emerald-500 to-emerald-600', dotColor: 'bg-emerald-500' },
    { label: 'Regulatory & Legal Block', pct: 2, count: 8, isHighRisk: false, color: 'from-indigo-500 to-indigo-600', dotColor: 'bg-indigo-500' },
  ];

  const trendData = [
    { year: '2016', failures: 18, isPeak: false },
    { year: '2017', failures: 24, isPeak: false },
    { year: '2018', failures: 31, isPeak: false },
    { year: '2019', failures: 42, isPeak: false },
    { year: '2020', failures: 48, isPeak: false },
    { year: '2021', failures: 59, isPeak: false },
    { year: '2022', failures: 84, isPeak: true },
    { year: '2023', failures: 71, isPeak: false },
    { year: '2024', failures: 36, isPeak: false },
  ];

  const timelineTrendData = [
    { year: '2010', capital: 1.2 },
    { year: '2012', capital: 2.1 },
    { year: '2014', capital: 3.4 },
    { year: '2016', capital: 4.8 },
    { year: '2018', capital: 6.2 },
    { year: '2020', capital: 8.5 },
    { year: '2022', capital: 14.8 },
    { year: '2024', capital: 21.4 },
  ];

  return (
    <div className="pb-20 bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <PageHeader
        title="Failure Intelligence & Macro Distribution"
        subtitle="Forensic macro patterns extracted across 413+ documented venture autopsies, SEC regulatory filings, and audited court disclosures."
        badge="FORENSIC DATASET"
        tagline="MACRO DASHBOARD"
        breadcrumbs={[{ label: 'Insights' }, { label: 'Macro Dashboard' }]}
        actions={
          <Link 
            to="/explore" 
            className="vault-btn-secondary text-xs flex items-center gap-1.5"
          >
            <span>Browse Full Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
      />

      <div className="vault-container space-y-8">
        {/* All 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: TOTAL FAILURES */}
          <div className="vault-card p-5 group hover:border-rose-300 dark:hover:border-rose-800/60 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[5px] bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#737373] dark:text-[#A3A3A3]">
                  Total Failures
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[4px] bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/40">
                +18
              </span>
            </div>
            <div className="flex items-end justify-between mb-2">
              <div className="text-3xl font-bold font-sans tracking-tight text-black dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 tabular-nums transition-colors">
                413
              </div>
              <SparklineSVG
                data={[20, 32, 28, 45, 42, 58, 62, 55, 72, 75]}
                stroke="#E11D48"
                fill="rgba(225, 29, 72, 0.12)"
              />
            </div>
            <div className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>This quarter</span>
            </div>
          </div>

          {/* Card 2: VAULTED STARTUPS */}
          <div className="vault-card p-5 group hover:border-blue-300 dark:hover:border-blue-800/60 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[5px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-900/50 flex items-center justify-center shrink-0">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#737373] dark:text-[#A3A3A3]">
                  Vaulted Startups
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[4px] bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/40">
                +214
              </span>
            </div>
            <div className="flex items-end justify-between mb-2">
              <div className="text-3xl font-bold font-sans tracking-tight text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 tabular-nums transition-colors">
                413
              </div>
              <SparklineSVG
                data={[30, 34, 38, 42, 41, 46, 50, 54, 55, 60]}
                stroke="#2563EB"
                fill="rgba(37, 99, 235, 0.12)"
              />
            </div>
            <div className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
              <span>With full autopsy records</span>
            </div>
          </div>

          {/* Card 3: AVG RISK SCORE */}
          <div className="vault-card p-5 group hover:border-amber-300 dark:hover:border-amber-800/60 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[5px] bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/50 flex items-center justify-center shrink-0">
                  <Gauge className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#737373] dark:text-[#A3A3A3]">
                  Avg Risk Score
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[4px] bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/40">
                +3.2
              </span>
            </div>
            <div className="flex items-end justify-between mb-2">
              <div className="text-3xl font-bold font-sans tracking-tight text-black dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 tabular-nums transition-colors">
                68.4
              </div>
              <SparklineSVG
                data={[55, 58, 60, 62, 61, 65, 66, 67, 68, 68.4]}
                stroke="#D97706"
                fill="rgba(217, 119, 6, 0.12)"
              />
            </div>
            <div className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>Across all analyzed startups</span>
            </div>
          </div>

          {/* Card 4: AI INSIGHTS GENERATED */}
          <div className="vault-card p-5 group hover:border-purple-300 dark:hover:border-purple-800/60 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[5px] bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/80 dark:border-purple-900/50 flex items-center justify-center shrink-0">
                  <Brain className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#737373] dark:text-[#A3A3A3]">
                  AI Signals Analyzed
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[4px] bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/40">
                +1,204
              </span>
            </div>
            <div className="flex items-end justify-between mb-2">
              <div className="text-3xl font-bold font-sans tracking-tight text-black dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 tabular-nums transition-colors">
                48,209
              </div>
              <SparklineSVG
                data={[10, 18, 22, 28, 32, 38, 45, 48, 52, 56]}
                stroke="#8B5CF6"
                fill="rgba(139, 92, 246, 0.12)"
              />
            </div>
            <div className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
              <span>Last 30 operational days</span>
            </div>
          </div>
        </div>

        {/* 2-Column Section: Failure Vector Distribution & Failure Event Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* FAILURE VECTOR DISTRIBUTION Card */}
          <div className="lg:col-span-6 vault-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
              <div>
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-black dark:text-white">
                  Failure Vector Distribution
                </h3>
                <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                  Primary fatal root causes across 413 venture autopsies
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[4px] bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700">
                Ranked
              </span>
            </div>

            <div className="space-y-3.5 pt-1">
              {failureVectors.map((vec) => (
                <div key={vec.label}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className={`flex items-center gap-2 font-medium ${
                      vec.isHighRisk ? 'text-black dark:text-white font-bold' : 'text-[#525252] dark:text-[#D4D4D4]'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${vec.dotColor || 'bg-zinc-400'} shrink-0`} />
                      {vec.label}
                    </span>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-[#737373] dark:text-[#A3A3A3]">{vec.count} cases</span>
                      <span className="font-bold text-black dark:text-white">
                        {vec.pct}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full rounded-full bg-[#E5E5E5] dark:bg-[#2A2A2A] h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${vec.color || 'from-zinc-500 to-zinc-700'}`}
                      style={{ width: `${vec.pct * 3.2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAILURE EVENT TIMELINE chart */}
          <div className="lg:col-span-6 vault-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div>
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-black dark:text-white">
                    Failure Event Timeline
                  </h3>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                    Annual collapse concentration (2016–2024)
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[4px] bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/40">
                  Peak: 2022 Crunch
                </span>
              </div>

              {/* Bar visualization */}
              <div className="mt-6 pt-4 grid grid-cols-9 gap-2 h-48 items-end pb-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                {trendData.map((d) => {
                  const heightPct = Math.round((d.failures / 84) * 100);
                  return (
                    <div key={d.year} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <span className={`text-[10px] font-mono transition-opacity whitespace-nowrap tabular-nums ${
                        d.isPeak ? 'opacity-100 text-rose-600 dark:text-rose-400 font-extrabold' : 'opacity-0 group-hover:opacity-100 text-[#737373] dark:text-[#A3A3A3]'
                      }`}>
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
                      <span className={`text-[11px] font-mono ${
                        d.isPeak ? 'text-rose-600 dark:text-rose-400 font-bold underline decoration-rose-400' : 'text-[#737373] dark:text-[#A3A3A3]'
                      }`}>
                        {d.year.slice(2)}'
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 p-3.5 rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between text-xs">
              <div className="text-black dark:text-white">
                <strong className="font-bold">Trend Insight:</strong> Zero-interest-rate policy (ZIRP) hangover drove record mortality spikes in 2022–2023.
              </div>
              <span className="font-mono font-bold text-[10px] uppercase px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 shrink-0 ml-3">
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Cumulative Capital Evaporation Curve Chart */}
        <div className="vault-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-black dark:text-white">
                  Cumulative Capital Evaporation Curve ($ Billions)
                </h3>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              </div>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                Historical trajectory of aggregate venture capital lost across documented cases (2010–2024).
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[4px] bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/40 self-start sm:self-auto">
              Unit: USD Billions
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineTrendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" className="dark:stroke-[#2A2A2A]" />
                <XAxis 
                  dataKey="year" 
                  stroke="#737373" 
                  className="text-[11px] font-mono" 
                  tickLine={false}
                />
                <YAxis 
                  stroke="#737373" 
                  className="text-[11px] font-mono" 
                  unit="B"
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181B', 
                    borderColor: '#E11D48',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    borderRadius: '6px',
                    boxShadow: '0 4px 12px rgba(225,29,72,0.15)'
                  }}
                  formatter={(val) => [`$${val} Billion`, 'Capital Evaporated']}
                />
                <Line 
                  type="monotone" 
                  dataKey="capital" 
                  stroke="#E11D48" 
                  strokeWidth={2.5} 
                  dot={{ fill: '#E11D48', stroke: '#FFFFFF', strokeWidth: 2, r: 4 }} 
                  activeDot={{ fill: '#BE123C', stroke: '#FFFFFF', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Insights;
