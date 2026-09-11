import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { RiskScoreGauge } from '../components/intelligence/RiskScoreGauge';
import { FailureScoreBadge } from '../components/common/FailureScoreBadge';
import { 
  FileUp, FileText, AlertTriangle, CheckCircle, ArrowRight, 
  Sparkles, Layers, ShieldAlert, DollarSign, PieChart, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function PitchDeckAutopsy() {
  const [selectedDeck, setSelectedDeck] = useState('b2b-saas');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autopsyResult, setAutopsyResult] = useState(null);

  const sampleDecks = [
    {
      id: 'b2b-saas',
      title: 'AutoTax AI — Pitch Deck v2.4 (Sample)',
      industry: 'FinTech / SaaS',
      pages: 14,
      targetRaise: '$3.5M Seed'
    },
    {
      id: 'hardware-d2c',
      title: 'SmartKitchen Press — Seed Deck (Sample)',
      industry: 'Hardware & IoT',
      pages: 18,
      targetRaise: '$5.0M Series A'
    },
    {
      id: 'quick-commerce',
      title: 'FlashDrop 10-Min Groceries — Pitch Deck (Sample)',
      industry: 'Food & Delivery',
      pages: 12,
      targetRaise: '$8.0M Seed'
    }
  ];

  const handleRunAutopsy = (deckId) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      if (deckId === 'hardware-d2c') {
        setAutopsyResult({
          title: 'SmartKitchen Press Deck Autopsy',
          overallRiskScore: 84,
          summary: 'The deck proposes high upfront tooling capex ($1.2M) and a proprietary DRM pod model with gross margins modeled at 72%. However, unit economics fail to account for warranty return rates and retail distributor take-rates.',
          parallel: 'Juicero ($120M Lost) & Teforia ($17M Lost)',
          categories: [
            { name: 'Business Model', score: 85, flag: 'High Hardware DRM friction with high customer churn risk.' },
            { name: 'Market Timing', score: 70, flag: 'Consumer kitchen counter space is fiercely contested.' },
            { name: 'Unit Economics', score: 92, flag: 'Omits shipping, tooling amortization, and retailer margin cuts.' },
            { name: 'Competition', score: 65, flag: 'Existing commodity appliances cost 1/5th the proposed price.' },
            { name: 'Execution Roadmap', score: 88, flag: 'Assumes 4-month tooling lead time in Shenzhen without local QA presence.' }
          ],
          redFlags: [
            'Slide 06: Assumes 0.5% warranty return rate; industry average for new IoT hardware is 8-12%.',
            'Slide 09: Proposes subscription DRM for food ingredients with no lock-in contract.',
            'Slide 11: CAC estimated at $45 on a $499 device, severely underestimating customer education friction.'
          ]
        });
      } else if (deckId === 'quick-commerce') {
        setAutopsyResult({
          title: 'FlashDrop 10-Min Delivery Autopsy',
          overallRiskScore: 91,
          summary: 'The deck assumes dark store micro-fulfillment profitability at 150 daily orders per hub, with rider subsidies subsidized by VC seed capital.',
          parallel: 'SpoonRocket, Webvan & Fast',
          categories: [
            { name: 'Business Model', score: 95, flag: 'Negative gross margin per delivery basket after rider base pay.' },
            { name: 'Market', score: 75, flag: 'High churn once promo codes and discount vouchers expire.' },
            { name: 'Unit Economics', score: 98, flag: 'Fixed dark store real estate lease liabilities with high idle rider hours.' },
            { name: 'Competition', score: 90, flag: 'Incumbent food delivery giants offer cross-subsidized grocery bundles.' },
            { name: 'Execution', score: 85, flag: 'Hyper-scaling hubs in 6 cities before reaching single-hub contribution breakeven.' }
          ],
          redFlags: [
            'Slide 04: Net margin assumed at +$3.50/basket, but rider pay ($8) + packing costs ($2) exceed average $18 order take-rate.',
            'Slide 08: Relies on perpetual 20% discount vouchers to drive repeat usage.',
            'Slide 12: Real estate dark store leases signed for 3 years non-cancellable.'
          ]
        });
      } else {
        setAutopsyResult({
          title: 'AutoTax AI Pitch Deck Autopsy',
          overallRiskScore: 68,
          summary: 'The deck positions proprietary machine learning to replace human CPAs with 99.8% precision. While market demand is enormous, accuracy validation and regulatory liabilities present severe exposure.',
          parallel: 'ScaleFactor ($104M Lost)',
          categories: [
            { name: 'Business Model', score: 55, flag: 'High gross margins if automated, but high human-in-the-loop support if edge cases arise.' },
            { name: 'Market Demand', score: 40, flag: 'Strong SMB willingness to pay for automated bookkeeping.' },
            { name: 'Unit Economics', score: 62, flag: 'Customer acquisition cost via search ads ($600+) is high relative to $80/mo ACV.' },
            { name: 'Competition', score: 75, flag: 'QuickBooks and TurboTax have massive distribution advantages.' },
            { name: 'Regulatory / Execution', score: 85, flag: 'Errors on client tax filings create massive legal and financial liabilities.' }
          ],
          redFlags: [
            'Slide 05: Claims 99.8% ML accuracy with zero mention of CPA review fallback protocol.',
            'Slide 08: Payback period modeled at 18 months, which is tight for SMB SaaS with 3% monthly churn.',
            'Slide 10: Governance lacks certified public accountants on advisory board.'
          ]
        });
      }
      setIsAnalyzing(false);
    }, 500);
  };

  return (
    <div className="pb-20">
      <PageHeader
        title="Pitch Deck Forensic Autopsy"
        subtitle="Upload or select a venture deck to audit unit economics, market assumptions, and fatal historical parallels."
        badge="Pitch Deck Diagnostics"
        tagline="DECK AUDIT"
        breadcrumbs={[{ label: 'Analysis' }, { label: 'Pitch Deck Autopsy' }]}
      />

      <div className="vault-container space-y-8">
        {/* Deck Upload / Sample Picker */}
        <div className="vault-card p-6 sm:p-8">
          <h2 className="text-base font-bold font-sans text-neutral-950 dark:text-neutral-50 mb-2">
            1. Select Deck or Drop Pitch Document
          </h2>
          <p className="text-xs text-neutral-500 mb-6">
            Audit sample decks from different venture categories or test diagnostic checks.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {sampleDecks.map((deck) => (
              <div
                key={deck.id}
                onClick={() => {
                  setSelectedDeck(deck.id);
                  handleRunAutopsy(deck.id);
                }}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedDeck === deck.id
                    ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-900 ring-1 ring-neutral-900 dark:ring-neutral-100'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="vault-badge vault-badge-neutral text-[10px]">
                    {deck.industry}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {deck.pages} Slides
                  </span>
                </div>
                <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  {deck.title}
                </h4>
                <div className="mt-2 text-[11px] font-mono text-neutral-500">
                  Target: {deck.targetRaise}
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl text-center hover:border-neutral-400 transition-colors">
            <FileUp className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              Drop custom pitch deck PDF / PPTX here
            </p>
            <p className="text-[11px] text-neutral-400 mt-1">
              Supports 10-30 slide seed to series B investor presentations (Max 25MB).
            </p>
          </div>
        </div>

        {/* Diagnostic Results */}
        {isAnalyzing && (
          <div className="vault-card p-12 text-center">
            <div className="w-8 h-8 border-2 border-neutral-300 border-t-rose-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="font-mono text-xs text-neutral-500 uppercase tracking-wider">
              Auditing unit economics and cross-referencing with 413+ historical pitch decks...
            </p>
          </div>
        )}

        {!isAnalyzing && autopsyResult && (
          <div className="space-y-8 animate-fade-in">
            {/* Historical Parallel Flag */}
            <div className="p-4 rounded-lg bg-neutral-900 text-white dark:bg-neutral-950 border border-neutral-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="vault-badge vault-badge-red text-[10px]">
                  CRITICAL HISTORICAL PARALLEL IDENTIFIED
                </span>
                <h3 className="text-sm font-bold">
                  This business model & cost structure closely mirrors: <span className="text-rose-400">{autopsyResult.parallel}</span>
                </h3>
                <p className="text-xs text-neutral-300">
                  {autopsyResult.summary}
                </p>
              </div>
              <div className="shrink-0">
                <FailureScoreBadge score={autopsyResult.overallRiskScore} size="md" />
              </div>
            </div>

            {/* Category Scores */}
            <div className="vault-card p-6">
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-4">
                Slide-by-Slide Vulnerability Assessment
              </h3>

              <div className="space-y-4">
                {autopsyResult.categories.map((cat, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/70 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold font-sans text-neutral-900 dark:text-neutral-100 block sm:inline mr-2">
                        {cat.name}
                      </span>
                      <span className="text-neutral-600 dark:text-neutral-400 font-sans">
                        — {cat.flag}
                      </span>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <span className="font-mono text-xs text-neutral-400">Risk Score:</span>
                      <FailureScoreBadge score={cat.score} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Red Flag Audit Findings */}
            <div className="vault-card p-6 border-rose-200 dark:border-rose-900/40">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                  Specific Diagnostic Red Flags in Slides
                </h3>
              </div>
              <div className="space-y-2.5">
                {autopsyResult.redFlags.map((flag, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                    <span className="font-mono text-rose-600 font-bold shrink-0 mt-0.5">•</span>
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PitchDeckAutopsy;
