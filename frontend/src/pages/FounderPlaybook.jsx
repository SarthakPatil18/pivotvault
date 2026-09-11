import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { PlaybookCard } from '../components/playbook/PlaybookCard';
import { generateDefensePlaybook } from '../lib/api';
import { BookOpen, ShieldCheck, CheckCircle2, ArrowRight, Layers, Lightbulb, Sparkles, Send, Copy, Check } from 'lucide-react';

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

  const [ideaPrompt, setIdeaPrompt] = useState('B2B SaaS for automated sales outreach and lead scoring');
  const [generating, setGenerating] = useState(false);
  const [customPlan, setCustomPlan] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e?.preventDefault?.();
    if (!ideaPrompt.trim()) return;
    setGenerating(true);
    try {
      const res = await generateDefensePlaybook(ideaPrompt.trim());
      setCustomPlan(res.data);
    } catch (err) {
      console.error('Defense playbook generation error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (customPlan?.plan && navigator.clipboard) {
      navigator.clipboard.writeText(customPlan.plan);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
        {/* Interactive Custom 90-Day Defense Protocol Generator */}
        <div className="vault-card p-6 sm:p-8 mb-8 border-[#533afd]/30 bg-gradient-to-br from-white to-[#533afd]/5 dark:from-[#272625] dark:to-[#1c1e54]/20 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#533afd]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#533afd]">
              LIVE AI DEFENSE SYNTHESIS
            </span>
          </div>
          <h2 className="text-xl font-bold font-sans text-neutral-950 dark:text-neutral-50 mb-2">
            Synthesize a Custom 90-Day Evidence-Based Defense Plan
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-5 max-w-3xl leading-relaxed">
            Enter your startup model, target industry, or distribution strategy. Our RAG engine extracts relevant historical failure evidence and constructs an execution defense protocol to safeguard your unit economics and cash runway.
          </p>

          <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={ideaPrompt}
              onChange={(e) => setIdeaPrompt(e.target.value)}
              placeholder="e.g. AI-powered veterinary telemedicine with physical clinic partner network..."
              className="vault-input flex-1 text-xs"
              required
            />
            <button
              type="submit"
              disabled={generating}
              className="vault-btn-primary shrink-0 text-xs flex items-center justify-center gap-2 px-5 py-2.5"
            >
              {generating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Protocol...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Defense Plan</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Idea Presets */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px] font-mono text-neutral-500">
            <span className="text-neutral-400">Quick Test:</span>
            {[
              'B2B AI cold outreach tool',
              'D2C connected fitness hardware',
              'Quick commerce 15-min delivery',
              'Crypto treasury management'
            ].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setIdeaPrompt(preset);
                }}
                className="px-2 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Custom Plan Output Modal/Card */}
          {customPlan && (
            <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800 animate-fade-in space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold font-sans text-neutral-900 dark:text-neutral-100">
                    Generated Defense Protocol for: "{ideaPrompt}"
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="vault-btn-secondary text-xs flex items-center gap-1.5 py-1 px-3"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Protocol</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-5 rounded-lg bg-neutral-50 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 text-xs font-sans text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed space-y-2">
                {customPlan.plan}
              </div>

              {customPlan.sources && customPlan.sources.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-2">
                    Evidence Sources Cross-Referenced from Supabase Archive:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {customPlan.sources.map((src, idx) => (
                      <div key={idx} className="p-2.5 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[11px]">
                        <span className="font-bold text-rose-600 dark:text-rose-400 block">
                          {src.metadata?.companyName || 'Archive Case'} ({src.metadata?.source || 'Public Docket'})
                        </span>
                        <p className="text-neutral-500 line-clamp-2 mt-0.5">{src.chunkText}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

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
