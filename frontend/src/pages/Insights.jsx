import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { MetricCard } from '../components/common/MetricCard';
import { getInsights } from '../lib/api';
import { formatCurrency, formatNumber } from '../lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid 
} from 'recharts';
import { Database, Flame, Activity, Layers, Download, BarChart2 } from 'lucide-react';
import { LoadingState } from '../components/common/InsightCard';

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

  // Transform stats for Recharts
  const failureModeChartData = Object.entries(stats.failureModesCount || {})
    .map(([mode, count]) => ({
      name: mode.length > 20 ? mode.substring(0, 18) + '...' : mode,
      fullName: mode,
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  const industryChartData = Object.entries(stats.industryCount || {})
    .map(([industry, count]) => ({
      name: industry.length > 18 ? industry.substring(0, 16) + '...' : industry,
      fullName: industry,
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const timelineTrendData = [
    { year: '2010', capital: 1.2, count: 8 },
    { year: '2012', capital: 2.1, count: 14 },
    { year: '2014', capital: 3.4, count: 22 },
    { year: '2016', capital: 4.8, count: 35 },
    { year: '2018', capital: 6.2, count: 48 },
    { year: '2020', capital: 8.5, count: 72 },
    { year: '2022', capital: 14.8, count: 96 },
    { year: '2024', capital: 21.4, count: 118 },
  ];

  const BARS_COLORS = ['#e11d48', '#d97706', '#3f3f46', '#71717a', '#a1a1aa', '#52525b', '#27272a'];

  return (
    <div className="pb-20">
      <PageHeader
        title="Dataset Intelligence & Macro Analytics"
        subtitle="Aggregated statistical insights, capital destruction curves, and failure distributions across 413+ startup post-mortems."
        badge="413+ Records Indexed"
        tagline="MACRO DATA TELEMETRY"
        breadcrumbs={[{ label: 'Insights' }, { label: 'Insights Dashboard' }]}
      />

      <div className="vault-container space-y-8">
        {/* Metric Cards Top Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Documented Records"
            value={formatNumber(stats.totalStartups)}
            subtext="Forensic cases"
            icon={Database}
          />
          <MetricCard
            label="Total Capital Evaporated"
            value={formatCurrency(stats.totalCapitalLost)}
            subtext="Venture & debt lost"
            alert={true}
            icon={Flame}
          />
          <MetricCard
            label="Average Failure Score"
            value={`${stats.avgFailureScore} / 100`}
            subtext="Severe risk benchmark"
            icon={Activity}
          />
          <MetricCard
            label="Monitored Sectors"
            value="15 Industries"
            subtext="12 Primary Failure Modes"
            icon={Layers}
          />
        </div>

        {/* Charts Grid 1: Failure Modes & Industry Distributions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Failure Vectors Chart */}
          <div className="vault-card p-6">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-1">
              Top Fatal Failure Vectors
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Distribution of primary root causes across documented failures.
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={failureModeChartData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                  <XAxis type="number" stroke="#71717a" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="#71717a" fontSize={10} width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#18181b', 
                      borderColor: '#27272a',
                      color: '#fafafa',
                      fontSize: '12px',
                      borderRadius: '6px'
                    }}
                    formatter={(val, name, item) => [`${val} Startups`, item.payload.fullName]}
                  />
                  <Bar dataKey="count" fill="#e11d48" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Industry Distribution Chart */}
          <div className="vault-card p-6">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-1">
              Sector Vulnerability Breakdown
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Failure count concentration by vertical.
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={industryChartData} margin={{ top: 5, right: 20, left: 10, bottom: 25 }}>
                  <XAxis dataKey="name" stroke="#71717a" fontSize={10} angle={-30} textAnchor="end" />
                  <YAxis stroke="#71717a" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#18181b', 
                      borderColor: '#27272a',
                      color: '#fafafa',
                      fontSize: '12px',
                      borderRadius: '6px'
                    }}
                    formatter={(val, name, item) => [`${val} Startups`, item.payload.fullName]}
                  />
                  <Bar dataKey="count" fill="#52525b" radius={[4, 4, 0, 0]}>
                    {industryChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#e11d48' : '#3f3f46'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Grid 2: Cumulative Capital Loss Timeline */}
        <div className="vault-card p-6">
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-1">
            Cumulative Capital Evaporation Curve ($ Billions)
          </h3>
          <p className="text-xs text-neutral-500 mb-6">
            Historical trajectory of venture capital lost across documented cases (2010–2024).
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineTrendData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.2} />
                <XAxis dataKey="year" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} unit="B" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    borderColor: '#27272a',
                    color: '#fafafa',
                    fontSize: '12px',
                    borderRadius: '6px'
                  }}
                  formatter={(val) => [`$${val} Billion`, 'Capital Evaporated']}
                />
                <Line 
                  type="monotone" 
                  dataKey="capital" 
                  stroke="#e11d48" 
                  strokeWidth={2.5} 
                  dot={{ fill: '#e11d48', r: 4 }} 
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
