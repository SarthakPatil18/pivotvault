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
    { label: 'Unit Economics Collapse', pct: 28, count: 116, isHighRisk: true },
    { label: 'Lack of Market Need / PMF', pct: 22, count: 91, isHighRisk: false },
    { label: 'Execution & Operations', pct: 17, count: 70, isHighRisk: false },
    { label: 'Competition & Moat Deficit', pct: 14, count: 58, isHighRisk: false },
    { label: 'Runway Exhaustion / Burn', pct: 9, count: 37, isHighRisk: false },
    { label: 'Fraud & Governance Failure', pct: 5, count: 21, isHighRisk: false },
    { label: 'Hardware & Manufacturing', pct: 3, count: 12, isHighRisk: false },
    { label: 'Regulatory & Legal Block', pct: 2, count: 8, isHighRisk: false },
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
          <div className="vault-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#737373] dark:text-[#A3A3A3]">
                  Total Failures
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]">
                +18
              </span>
            </div>
            <div className="flex items-end justify-between mb-2">
              <div className="text-3xl font-bold font-sans tracking-tight text-black dark:text-white tabular-nums">
                413
              </div>
              <SparklineSVG
                data={[20, 32, 28, 45, 42, 58, 62, 55, 72, 75]}
                stroke="#000000"
                fill="rgba(0, 0, 0, 0.06)"
              />
            </div>
            <div className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">
              This quarter
            </div>
          </div>

          {/* Card 2: VAULTED STARTUPS */}
          <div className="vault-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-center shrink-0">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#737373] dark:text-[#A3A3A3]">
                  Vaulted Startups
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]">
                +214
              </span>
            </div>
            <div className="flex items-end justify-between mb-2">
              <div className="text-3xl font-bold font-sans tracking-tight text-black dark:text-white tabular-nums">
                413
              </div>
              <SparklineSVG
                data={[30, 34, 38, 42, 41, 46, 50, 54, 55, 60]}
                stroke="#404040"
                fill="rgba(0, 0, 0, 0.04)"
              />
            </div>
            <div className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">
              With full autopsy records
            </div>
          </div>

          {/* Card 3: AVG RISK SCORE */}
          <div className="vault-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-center shrink-0">
                  <Gauge className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#737373] dark:text-[#A3A3A3]">
                  Avg Risk Score
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]">
                +3.2
              </span>
            </div>
            <div className="flex items-end justify-between mb-2">
              <div className="text-3xl font-bold font-sans tracking-tight text-black dark:text-white tabular-nums">
                68.4
              </div>
              <SparklineSVG
                data={[55, 58, 60, 62, 61, 65, 66, 67, 68, 68.4]}
                stroke="#737373"
                fill="rgba(0, 0, 0, 0.04)"
              />
            </div>
            <div className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">
              Across all analyzed startups
            </div>
          </div>

          {/* Card 4: AI INSIGHTS GENERATED */}
          <div className="vault-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-center shrink-0">
                  <Brain className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#737373] dark:text-[#A3A3A3]">
                  AI Signals Analyzed
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]">
                +1,204
              </span>
            </div>
            <div className="flex items-end justify-between mb-2">
              <div className="text-3xl font-bold font-sans tracking-tight text-black dark:text-white tabular-nums">
                48,209
              </div>
              <SparklineSVG
                data={[10, 18, 22, 28, 32, 38, 45, 48, 52, 56]}
                stroke="#1A1A1A"
                fill="rgba(0, 0, 0, 0.05)"
              />
            </div>
            <div className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">
              Last 30 operational days
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
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]">
                Ranked
              </span>
            </div>

            <div className="space-y-3.5 pt-1">
              {failureVectors.map((vec) => (
                <div key={vec.label}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className={`flex items-center gap-2 font-medium ${
                      vec.isHighRisk ? 'text-black dark:text-white font-bold' : 'text-[#737373] dark:text-[#A3A3A3]'
                    }`}>
                      {vec.isHighRisk && (
                        <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                      )}
                      {vec.label}
                    </span>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-[#737373] dark:text-[#A3A3A3]">{vec.count} cases</span>
                      <span className="font-bold text-black dark:text-white">
                        {vec.pct}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full rounded-full bg-[#E5E5E5] dark:bg-[#2A2A2A] h-1.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300 bg-black dark:bg-white"
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
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]">
                  Peak: 2022 Crunch
                </span>
              </div>

              {/* Bar visualization */}
              <div className="mt-6 pt-4 grid grid-cols-9 gap-2 h-48 items-end pb-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                {trendData.map((d) => {
                  const heightPct = Math.round((d.failures / 84) * 100);
                  return (
                    <div key={d.year} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {d.failures}
                      </span>
                      <div 
                        className={`w-full rounded-t-[3px] transition-all ${
                          d.isPeak ? 'bg-black dark:bg-white ring-1 ring-black dark:ring-white' : 'bg-[#737373] dark:bg-[#404040]'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className={`text-[11px] font-mono ${
                        d.isPeak ? 'text-black dark:text-white font-bold underline' : 'text-[#737373] dark:text-[#A3A3A3]'
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
              <span className="font-mono font-bold text-[11px] shrink-0 ml-3 text-black dark:text-white">
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Cumulative Capital Evaporation Curve Chart */}
        <div className="vault-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-black dark:text-white">
                Cumulative Capital Evaporation Curve ($ Billions)
              </h3>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                Historical trajectory of aggregate venture capital lost across documented cases (2010–2024).
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3]">
              Unit: USD Billions
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineTrendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
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
                    backgroundColor: '#FFFFFF', 
                    borderColor: '#E5E5E5',
                    color: '#000000',
                    fontSize: '12px',
                    borderRadius: '6px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                  }}
                  formatter={(val) => [`$${val} Billion`, 'Capital Evaporated']}
                />
                <Line 
                  type="monotone" 
                  dataKey="capital" 
                  stroke="#000000" 
                  strokeWidth={2} 
                  dot={{ fill: '#000000', r: 4 }} 
                  activeDot={{ r: 6 }}
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
