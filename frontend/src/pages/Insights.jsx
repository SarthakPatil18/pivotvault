import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { getInsights } from '../lib/api';
import { formatCurrency, formatNumber } from '../lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid, Cell
} from 'recharts';
import { Database, Flame, Activity, Layers, AlertTriangle, BookOpen, Gauge, Brain } from 'lucide-react';
import { LoadingState } from '../components/common/InsightCard';

function SparklineSVG({ data, stroke, fill, height = 30 }) {
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
    <div className="pb-20 bg-[#f6f5f3] min-h-screen">
      <PageHeader
        title="Failure Intelligence & Distribution"
        subtitle="Patterns extracted across 413+ documented startup failures. Editorial analytics derived from verified corporate post-mortems and SEC filings."
        badge="FORENSIC DATASET"
        tagline="MACRO DASHBOARD"
        breadcrumbs={[{ label: 'Insights' }, { label: 'Insights Dashboard' }]}
        actions={
          <Link 
            to="/insights" 
            className="font-medium text-sm hover:underline"
            style={{ color: '#2d72f0' }}
          >
            Macro Dashboard →
          </Link>
        }
      />

      <div className="vault-container space-y-8">
        {/* All 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: TOTAL FAILURES (Coral Leadgen Pillar) */}
          <div
            style={{
              backgroundColor: '#fbfaf9',
              border: '1px solid #dcdbda',
              borderRadius: '16px',
              boxShadow: 'rgba(0, 0, 0, 0.04) 0px 2px 12px',
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
              <SparklineSVG
                data={[20, 32, 28, 45, 42, 58, 62, 55, 72, 75]}
                stroke="#e16540"
                fill="rgba(225, 101, 64, 0.12)"
              />
            </div>
            <div style={{ color: '#787673', fontSize: '11px' }}>
              This quarter
            </div>
          </div>

          {/* Card 2: VAULTED STARTUPS (Blue Intelligence Pillar) */}
          <div
            style={{
              backgroundColor: '#fbfaf9',
              border: '1px solid #dcdbda',
              borderRadius: '16px',
              boxShadow: 'rgba(0, 0, 0, 0.04) 0px 2px 12px',
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
              <SparklineSVG
                data={[30, 34, 38, 42, 41, 46, 50, 54, 55, 60]}
                stroke="#328efa"
                fill="rgba(50, 142, 250, 0.12)"
              />
            </div>
            <div style={{ color: '#787673', fontSize: '11px' }}>
              With postmortems
            </div>
          </div>

          {/* Card 3: AVG RISK SCORE (Warm Gold Engagement Pillar) */}
          <div
            style={{
              backgroundColor: '#fbfaf9',
              border: '1px solid #dcdbda',
              borderRadius: '16px',
              boxShadow: 'rgba(0, 0, 0, 0.04) 0px 2px 12px',
              padding: '24px',
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'rgba(251, 199, 104, 0.18)', color: '#9b6829' }}
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
                  backgroundColor: 'rgba(251, 199, 104, 0.18)',
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
              <SparklineSVG
                data={[55, 58, 60, 62, 61, 65, 66, 67, 68, 68.4]}
                stroke="#fbc768"
                fill="rgba(251, 199, 104, 0.14)"
              />
            </div>
            <div style={{ color: '#787673', fontSize: '11px' }}>
              All analyzed startups
            </div>
          </div>

          {/* Card 4: AI INSIGHTS (Mint Deliver Pillar) */}
          <div
            style={{
              backgroundColor: '#fbfaf9',
              border: '1px solid #dcdbda',
              borderRadius: '16px',
              boxShadow: 'rgba(0, 0, 0, 0.04) 0px 2px 12px',
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
              <SparklineSVG
                data={[10, 18, 22, 28, 32, 38, 45, 48, 52, 56]}
                stroke="#47d096"
                fill="rgba(71, 208, 150, 0.14)"
              />
            </div>
            <div style={{ color: '#787673', fontSize: '11px' }}>
              Last 30 days
            </div>
          </div>
        </div>

        {/* 2-Column Section: Failure Vector Distribution & Failure Event Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* FAILURE VECTOR DISTRIBUTION Card */}
          <div 
            className="lg:col-span-6 p-6 space-y-4"
            style={{
              backgroundColor: '#fbfaf9',
              border: '1px solid #dcdbda',
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
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

          {/* FAILURE EVENT TIMELINE chart */}
          <div 
            className="lg:col-span-6 p-6 flex flex-col justify-between"
            style={{
              backgroundColor: '#fbfaf9',
              border: '1px solid #dcdbda',
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
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

              {/* Bar visualization */}
              <div className="mt-6 pt-4 grid grid-cols-9 gap-2 h-48 items-end pb-2 border-b border-[#dcdbda]">
                {trendData.map((d) => {
                  const heightPct = Math.round((d.failures / 84) * 100);
                  return (
                    <div key={d.year} className="flex flex-col items-center gap-2 h-full justify-end group">
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
              className="mt-6 p-3.5 rounded-[10px] flex items-center justify-between text-[12px]"
              style={{
                backgroundColor: '#f6f5f3',
                border: '1px solid #dcdbda'
              }}
            >
              <div style={{ color: '#373634' }}>
                <strong style={{ color: '#111111' }}>Trend Insight:</strong> Zero-interest-rate policy (ZIRP) hangover drove record mortality spikes in 2022–2023.
              </div>
              <span style={{ color: '#2d72f0', fontWeight: 600 }} className="shrink-0 ml-3">
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Cumulative Capital Evaporation Curve Chart */}
        <div 
          className="p-6"
          style={{
            backgroundColor: '#fbfaf9',
            border: '1px solid #dcdbda',
            borderRadius: '16px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
          }}
        >
          <h3 
            style={{
              color: '#111111',
              fontWeight: 700,
              fontSize: '16px',
              marginBottom: '4px'
            }}
          >
            Cumulative Capital Evaporation Curve ($ Billions)
          </h3>
          <p style={{ color: '#787673', fontSize: '12px', marginBottom: '24px' }}>
            Historical trajectory of venture capital lost across documented cases (2010–2024).
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineTrendData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dcdbda" />
                <XAxis dataKey="year" stroke="#787673" fontSize={11} />
                <YAxis stroke="#787673" fontSize={11} unit="B" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fbfaf9', 
                    borderColor: '#dcdbda',
                    color: '#111111',
                    fontSize: '12px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                  }}
                  formatter={(val) => [`$${val} Billion`, 'Capital Evaporated']}
                />
                <Line 
                  type="monotone" 
                  dataKey="capital" 
                  stroke="#2d72f0" 
                  strokeWidth={2.5} 
                  dot={{ fill: '#2d72f0', r: 4 }} 
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
