import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { PlaybookCard } from '../components/playbook/PlaybookCard';
import { BookOpen, ShieldCheck, CheckCircle2, ArrowRight, Layers, Lightbulb } from 'lucide-react';

export function FounderPlaybook() {
  const [selectedVector, setSelectedVector] = useState('ALL');

  const playbooks = [
    {
      id: 'pb-pmf',
      riskCategory: 'Product-Market Fit',
      historicalFailuresCount: 142,
      failureMode: 'Lack of Market Need / PMF',
      title: 'Validating Real Need Before Code & Burn',
      description: 'How to avoid building precision-engineered solutions for problems customers will not pay for (The Juicero & Quibi trap).',
      actions: [
        'Collect 5 upfront non-refundable cash deposits from pilot customers before writing backend code.',
        'Enforce manual concierge MVP testing: complete the transaction by hand before automating with software.',
        'Track daily organic unprompted retention; if day-30 retention is below 15%, do not scale customer acquisition spend.'
      ],
      examples: ['Juicero', 'Quibi', 'Zume Pizza', 'Segway']
    },
    {
      id: 'pb-unit-econ',
      riskCategory: 'Unit Economics & CAC',
      historicalFailuresCount: 118,
      failureMode: 'Unit Economics Collapse',
      title: 'Contribution Margin Defense Strategy',
      description: 'Preventing the venture subsidy death spiral where CAC exceeds LTV under the guise of "blitzscaling" (The Fast & Bird trap).',
      actions: [
        'Calculate true fully-burdened CAC including headcount, marketing overhead, and payment gateway fees.',
        'Ensure customer payback period is under 12 months before expanding sales team headcount.',
        'Model margin sensitivity for 25% inflation in server, supply chain, and ad acquisition costs.'
      ],
      examples: ['Fast', 'Bird', 'WeWork', 'Homejoy']
    },
    {
      id: 'pb-hardware',
      riskCategory: 'Hardware & Manufacturing',
      historicalFailuresCount: 64,
      failureMode: 'Hardware Execution / Manufacturing',
      title: 'Managing Working Capital & Inventory Spikes',
      description: 'Protecting hardware ventures from warranty return rates, supply chain locks, and retailer payment delays (The Jawbone & Pebble trap).',
      actions: [
        'Include a 3x buffer in initial bill-of-materials (BOM) for component shortages and tooling rework.',
        'Manufacture in small iterative batches (500-1000 units) rather than betting entire cash balances on 100,000 unit bulk orders.',
        'Retain at least 18 months of runway when commissioning custom injection molds.'
      ],
      examples: ['Jawbone', 'Pebble', 'Essential Products', 'Lily Robotics']
    },
    {
      id: 'pb-governance',
      riskCategory: 'Governance & Integrity',
      historicalFailuresCount: 38,
      failureMode: 'Fraud & Governance Failure',
      title: 'Scientific Validation & Board Oversight',
      description: 'Building transparent engineering cultures and domain-expert board oversight in high-stakes biotech and fintech (The Theranos & FTX trap).',
      actions: [
        'Mandate external third-party GAAP auditing and independent scientific validation before commercial launch.',
        'Appoint at least two independent board directors with deep technical domain expertise in your specific sector.',
        'Create confidential internal reporting channels to surface negative engineering findings early.'
      ],
      examples: ['Theranos', 'FTX', 'ScaleFactor', 'uBiome']
    },
    {
      id: 'pb-platform',
      riskCategory: 'Platform Monopoly Defense',
      historicalFailuresCount: 51,
      failureMode: 'Outcompeted by Incumbents',
      title: 'Ecosystem Independence & Moat Creation',
      description: 'Defending against platform owner commoditization when building plugins or companion apps (The Vine & Pebble trap).',
      actions: [
        'Never rely on a single third-party platform API as your sole distribution or monetization channel.',
        'Build proprietary data flywheels and cross-platform multi-tenant accounts that cannot be disabled by a single OS update.',
        'Identify strategic acquisition opportunities before platform monopolies launch copycat built-in features.'
      ],
      examples: ['Vine', 'Pebble', 'Sidecar', 'Aereo']
    }
  ];

  const filteredPlaybooks = selectedVector === 'ALL'
    ? playbooks
    : playbooks.filter(p => p.riskCategory.toLowerCase().includes(selectedVector.toLowerCase()));

  return (
    <div className="pb-20">
      <PageHeader
        title="Founder Defensive Playbook"
        subtitle="Operational defense frameworks: converting 413+ historical failure autopsies into actionable pre-launch protocols."
        badge="Defensive Protocols"
        tagline="FOUNDER ACTION MANUAL"
        breadcrumbs={[{ label: 'Intelligence' }, { label: 'Founder Playbook' }]}
      />

      <div className="vault-container">
        {/* Core Philosophy Banner */}
        <div className="vault-card p-6 sm:p-8 mb-8 bg-neutral-50/80 dark:bg-neutral-900/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="vault-badge vault-badge-red text-[11px]">
                THE PIVOTVAULT PRINCIPLE
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-sans text-neutral-950 dark:text-neutral-50">
                INTELLIGENCE → LESSON → ACTION
              </h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                Every venture vulnerability documented in our archive has a counteracting execution move. Review these defensive playbooks to stress-test your roadmap.
              </p>
            </div>

            {/* Filter by Category */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="text-neutral-400 mr-1">Filter Vector:</span>
              {['ALL', 'Product-Market Fit', 'Unit Economics', 'Hardware', 'Governance'].map((vec) => (
                <button
                  key={vec}
                  onClick={() => setSelectedVector(vec)}
                  className={`px-3 py-1.5 rounded text-xs transition-colors ${
                    selectedVector === vec
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold'
                      : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  {vec}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Playbooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaybooks.map((pb) => (
            <PlaybookCard key={pb.id} playbook={pb} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FounderPlaybook;
