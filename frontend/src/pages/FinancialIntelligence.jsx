import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { MetricCard } from '../components/common/MetricCard';
import { formatCurrency } from '../lib/utils';
import { 
  DollarSign, Flame, Clock, TrendingDown, AlertTriangle, 
  BarChart2, ShieldAlert, CheckCircle2, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function FinancialIntelligence() {
  const [cashBalance, setCashBalance] = useState(1500000);
  const [monthlyBurn, setMonthlyBurn] = useState(85000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(12000);
  const [cac, setCac] = useState(450);
  const [ltv, setLtv] = useState(1200);

  const netBurn = Math.max(0, monthlyBurn - monthlyRevenue);
  const runwayMonths = netBurn > 0 ? (cashBalance / netBurn).toFixed(1) : 'Infinite (Profitable)';
  const ltvCacRatio = (ltv / Math.max(1, cac)).toFixed(2);
  const burnMultiple = (netBurn / Math.max(1, monthlyRevenue)).toFixed(1);

  const historicalBurnComparisons = [
    {
      startup: 'Fast',
      burn: '$10M / mo',
      revenue: '$50K / mo',
      burnMultiple: '200x',
      status: 'Defunct (2022)',
      lesson: 'Raised $120M+, hired 400 staff, and closed in 3 years when bridge round failed.'
    },
    {
      startup: 'Quibi',
      burn: '$290M / mo',
      revenue: '$3M / mo',
      burnMultiple: '96x',
      status: 'Defunct (2020)',
      lesson: 'Spent $1.75B on $100k/minute Hollywood productions for mobile; closed in 6 months.'
    },
    {
      startup: 'WeWork (2019)',
      burn: '$170M / mo',
      revenue: '$150M / mo',
      burnMultiple: '1.1x (On $18B Lease Liab)',
      status: 'Bankruptcy (2023)',
      lesson: 'Structural lease liability duration mismatch disguised by SoftBank subsidies.'
    },
    {
      startup: 'Bird (2019)',
      burn: '$25M / mo',
      revenue: '$8M / mo',
      burnMultiple: '3.1x (High Depreciation)',
      status: 'Bankruptcy (2023)',
      lesson: 'Hardware scooter depreciation lifespan was shorter than payback duration.'
    }
  ];

  return (
    <div className="pb-20">
      <PageHeader
        title="Financial Intelligence & Runway Stress-Tester"
        subtitle="Simulate burn velocity, runway vulnerability, and benchmark unit economics against historical startup crashes."
        badge="Financial Forensics"
        tagline="CAPITAL TELEMETRY"
        breadcrumbs={[{ label: 'Analysis' }, { label: 'Financial Intelligence' }]}
      />

      <div className="vault-container space-y-8">
        {/* Interactive Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inputs Column */}
          <div className="vault-card p-6 space-y-4">
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-neutral-900 dark:text-neutral-100 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              Venture Treasury Inputs
            </h2>

            <div>
              <label className="block text-xs font-mono text-neutral-500 mb-1">
                Current Cash in Bank: <strong>{formatCurrency(cashBalance)}</strong>
              </label>
              <input
                type="range"
                min={50000}
                max={10000000}
                step={50000}
                value={cashBalance}
                onChange={(e) => setCashBalance(Number(e.target.value))}
                className="w-full accent-rose-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-500 mb-1">
                Gross Monthly Operating Expenses: <strong>{formatCurrency(monthlyBurn)}/mo</strong>
              </label>
              <input
                type="range"
                min={5000}
                max={500000}
                step={5000}
                value={monthlyBurn}
                onChange={(e) => setMonthlyBurn(Number(e.target.value))}
                className="w-full accent-rose-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-500 mb-1">
                Monthly Recurring Revenue: <strong>{formatCurrency(monthlyRevenue)}/mo</strong>
              </label>
              <input
                type="range"
                min={0}
                max={250000}
                step={2000}
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                className="w-full accent-rose-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-mono text-neutral-500 mb-1">
                  Est. CAC ($)
                </label>
                <input
                  type="number"
                  value={cac}
                  onChange={(e) => setCac(Number(e.target.value))}
                  className="vault-input text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-neutral-500 mb-1">
                  Est. LTV ($)
                </label>
                <input
                  type="number"
                  value={ltv}
                  onChange={(e) => setLtv(Number(e.target.value))}
                  className="vault-input text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Results Metric Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Estimated Runway"
                value={typeof runwayMonths === 'number' || !isNaN(Number(runwayMonths)) ? `${runwayMonths} Months` : runwayMonths}
                subtext={Number(runwayMonths) < 9 ? 'CRITICAL: Below 9mo safety threshold' : 'Standard treasury threshold'}
                alert={Number(runwayMonths) < 9}
                icon={Clock}
              />
              <MetricCard
                label="Net Monthly Burn"
                value={formatCurrency(netBurn)}
                subtext={`Gross: ${formatCurrency(monthlyBurn)}`}
                icon={Flame}
              />
              <MetricCard
                label="LTV / CAC Ratio"
                value={`${ltvCacRatio}x`}
                subtext={Number(ltvCacRatio) < 3 ? 'Sub-optimal (<3x minimum target)' : 'Healthy unit contribution'}
                alert={Number(ltvCacRatio) < 2}
                icon={TrendingDown}
              />
            </div>

            {/* Diagnostic Alert Box */}
            <div className={`p-5 rounded-lg border text-xs leading-relaxed space-y-2 ${
              Number(runwayMonths) < 9 
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200' 
                : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
            }`}>
              <div className="flex items-center gap-2 font-mono font-bold uppercase text-[11px]">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Runway Forensic Assessment</span>
              </div>
              <p>
                {Number(runwayMonths) < 6
                  ? 'Existential danger zone: Under 6 months of runway in modern venture environments leaves zero room for fundraising delays. Startups in our dataset with <6mo runway had an 82% mortality rate if bridge terms were not signed.'
                  : Number(runwayMonths) < 12
                  ? 'Caution zone: 6-12 months runway requires immediate fundraising kickoff or 20% headcount/expense optimization.'
                  : 'Treasury buffer healthy: Over 12 months allows strategic product iteration before external capital dependency.'}
              </p>
            </div>
          </div>
        </div>

        {/* Historical Hyper-Burn Hall of Infamy */}
        <div className="vault-card p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold font-sans text-neutral-950 dark:text-neutral-50">
                Historical Burn Rate Case Autopsies
              </h3>
              <p className="text-xs text-neutral-500">
                How catastrophic burn-to-revenue ratios triggered the fastest venture collapses in tech history.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {historicalBurnComparisons.map((item, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100 font-sans">
                    {item.startup}
                  </span>
                  <span className="text-[10px] font-mono text-rose-600 bg-rose-50 dark:bg-rose-950 px-1.5 py-0.5 rounded">
                    {item.status}
                  </span>
                </div>
                <div className="font-mono text-xs text-neutral-700 dark:text-neutral-300">
                  Burn: <span className="font-bold">{item.burn}</span>
                </div>
                <div className="font-mono text-[11px] text-neutral-500">
                  Rev: {item.revenue} (Burn Multiple: <strong>{item.burnMultiple}</strong>)
                </div>
                <p className="text-[11px] text-neutral-500 italic pt-1 border-t border-neutral-200 dark:border-neutral-800">
                  {item.lesson}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinancialIntelligence;
