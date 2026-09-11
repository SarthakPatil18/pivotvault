import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { RiskScoreGauge } from '../components/intelligence/RiskScoreGauge';
import { RiskCategoryMeter } from '../components/intelligence/RiskCategoryMeter';
import { StartupCard } from '../components/common/StartupCard';
import { runRiskScanner } from '../lib/api';
import { INDUSTRIES } from '../lib/data/startupsData';
import { 
  ShieldAlert, Sparkles, CheckCircle2, AlertTriangle, 
  ArrowRight, RotateCcw, Cpu, HelpCircle, Layers, Lightbulb
} from 'lucide-react';

export function RiskScanner() {
  const [formData, setFormData] = useState({
    idea: 'An AI-powered automated bookkeeping platform for SMBs with real-time tax filing guarantees.',
    industry: 'FinTech & Crypto',
    targetCustomer: 'B2B',
    businessModel: 'Subscription',
    monetizationStage: 'Pre-revenue',
    burnRate: '$20k - $50k/mo',
    hardwareInvolved: false,
    regulatoryHeavy: true,
    modelFeatures: {
      log_funding: '',
      funding_rounds: '',
      days_to_first_funding: '',
      funding_duration_days: '',
      is_international: 0,
    },
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await runRiskScanner(formData);
      setResult(res.data);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } catch (err) {
      console.error('Risk scanner error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFormData({
      idea: '',
      industry: 'SaaS & Enterprise',
      targetCustomer: 'B2B',
      businessModel: 'Subscription',
      monetizationStage: 'Pre-revenue',
      burnRate: '$10k - $20k/mo',
      hardwareInvolved: false,
      regulatoryHeavy: false,
      modelFeatures: {
        log_funding: '',
        funding_rounds: '',
        days_to_first_funding: '',
        funding_duration_days: '',
        is_international: 0,
      },
    });
  };

  return (
    <div className="pb-20 bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <PageHeader
        title="Evidence-Based Startup Risk Scanner"
        subtitle="Stress-test your venture model against 413+ historical startup collapses and structural failure modes."
        badge="Evidence Diagnostic"
        tagline="RISK ENGINE"
        breadcrumbs={[{ label: 'Intelligence' }, { label: 'Risk Scanner' }]}
      />

      <div className="vault-container">
        {/* Input Form */}
        <div className="vault-card p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
            <div>
              <h2 className="text-lg font-bold font-sans text-black dark:text-white">
                1. Venture Architecture Parameters
              </h2>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3] font-sans">
                Define your startup's core mechanics to map against failure taxonomies.
              </p>
            </div>
            {result && (
              <button
                onClick={handleReset}
                className="vault-btn-secondary text-xs flex items-center gap-1 font-mono cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Parameters</span>
              </button>
            )}
          </div>

          <form onSubmit={handleScan} className="space-y-6">
            {/* Startup Idea Description */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white mb-2">
                Startup Concept / Core Value Proposition
              </label>
              <textarea
                rows={3}
                required
                value={formData.idea}
                onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                placeholder="Describe your startup concept, key differentiator, and how you deliver value..."
                className="vault-input resize-none"
              />
            </div>

            {/* Grid for Sector, Customer, Business Model, Burn */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Industry */}
              <div>
                <label className="block text-xs font-mono font-bold text-black dark:text-white mb-1.5">
                  Industry Sector
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="vault-input cursor-pointer"
                >
                  {INDUSTRIES.filter(i => i !== 'All Industries').map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              {/* Target Customer */}
              <div>
                <label className="block text-xs font-mono font-bold text-black dark:text-white mb-1.5">
                  Target Customer
                </label>
                <select
                  value={formData.targetCustomer}
                  onChange={(e) => setFormData({ ...formData, targetCustomer: e.target.value })}
                  className="vault-input cursor-pointer"
                >
                  <option value="B2B">B2B (SMBs & Mid-Market)</option>
                  <option value="Enterprise">B2B Enterprise ($50k+ ACV)</option>
                  <option value="B2C">B2C (Mass Consumer)</option>
                  <option value="B2B2C">B2B2C / Platform</option>
                  <option value="D2C">D2C Physical Goods</option>
                </select>
              </div>

              {/* Business Model */}
              <div>
                <label className="block text-xs font-mono font-bold text-black dark:text-white mb-1.5">
                  Revenue / Business Model
                </label>
                <select
                  value={formData.businessModel}
                  onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
                  className="vault-input cursor-pointer"
                >
                  <option value="Subscription">SaaS Subscription (MRR)</option>
                  <option value="Usage/API">Usage / Transactional Take-rate</option>
                  <option value="Marketplace">Two-Sided Marketplace Commission</option>
                  <option value="Hardware+Sub">Hardware Device + Subscription</option>
                  <option value="Direct Sales">One-time License / Direct Sale</option>
                </select>
              </div>

              {/* Anticipated Burn Rate */}
              <div>
                <label className="block text-xs font-mono font-bold text-black dark:text-white mb-1.5">
                  Monthly Burn Projection
                </label>
                <select
                  value={formData.burnRate}
                  onChange={(e) => setFormData({ ...formData, burnRate: e.target.value })}
                  className="vault-input cursor-pointer"
                >
                  <option value="<$10k/mo">Lean Bootstrapped (&lt;$10k/mo)</option>
                  <option value="$20k - $50k/mo">Seed Stage ($20k - $50k/mo)</option>
                  <option value="$50k - $150k/mo">Series A Expansion ($50k - $150k/mo)</option>
                  <option value="$500k+/mo">Hyper-Growth ($500k+/mo)</option>
                </select>
              </div>
            </div>

            {/* Risk Checkboxes (Hardware, Regulatory) */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-black dark:text-white">
                <input
                  type="checkbox"
                  checked={formData.hardwareInvolved}
                  onChange={(e) => setFormData({ ...formData, hardwareInvolved: e.target.checked })}
                  className="rounded border-[#E5E5E5] dark:border-[#2A2A2A] accent-black dark:accent-white"
                />
                <span>Includes Physical Hardware / IoT Manufacturing</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-black dark:text-white">
                <input
                  type="checkbox"
                  checked={formData.regulatoryHeavy}
                  onChange={(e) => setFormData({ ...formData, regulatoryHeavy: e.target.checked })}
                  className="rounded border-[#E5E5E5] dark:border-[#2A2A2A] accent-black dark:accent-white"
                />
                <span>Subject to Heavy Regulatory / Financial Compliance (FDA, SEC, FinCEN)</span>
              </label>
            </div>

            <div className="pt-4 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white mb-1">
                Idea Score model inputs
              </h3>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mb-3">
                Enter the verified funding metrics used by the trained model. These values are required and are not estimated by the app.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                  ['log_funding', 'Log funding'],
                  ['funding_rounds', 'Funding rounds'],
                  ['days_to_first_funding', 'Days to first funding'],
                  ['funding_duration_days', 'Funding duration days'],
                ].map(([field, label]) => (
                  <label key={field} className="text-xs font-mono text-[#737373] dark:text-[#A3A3A3]">
                    {label}
                    <input
                      type="number"
                      min="0"
                      step="any"
                      required
                      value={formData.modelFeatures[field]}
                      onChange={(e) => setFormData({ ...formData, modelFeatures: { ...formData.modelFeatures, [field]: Number(e.target.value) } })}
                      className="vault-input mt-1"
                    />
                  </label>
                ))}
                <label className="text-xs font-mono text-[#737373] dark:text-[#A3A3A3]">
                  International
                  <select
                    value={formData.modelFeatures.is_international}
                    onChange={(e) => setFormData({ ...formData, modelFeatures: { ...formData.modelFeatures, is_international: Number(e.target.value) } })}
                    className="vault-input mt-1 cursor-pointer"
                  >
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-6 py-3 text-xs font-mono flex items-center gap-2 rounded-[6px] cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-neutral-300 border-t-white rounded-full animate-spin" />
                    <span>Scanning Historical Taxonomy...</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    <span>Run Forensic Risk Scanner</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-8 animate-fade-in">
            {/* Prominent Evidence Disclaimer Banner */}
            <div className="p-4 rounded-[6px] bg-black text-white dark:bg-[#0A0A0A] border border-[#2A2A2A] flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-white shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-white uppercase tracking-wider font-mono">
                  Idea Score model result:
                </p>
                <p className="text-[#A3A3A3]">
                  This score is generated by the trained model using the verified funding inputs above and is accompanied by relevant historical evidence.
                </p>
              </div>
            </div>

            {/* Score & Risk Factor Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Gauge Column */}
              <div className="vault-card p-6 flex flex-col items-center justify-center text-center">
                <RiskScoreGauge 
                  score={result.ideaScore ?? result.overallRiskScore}
                  label="Idea Score"
                />
                <div className="mt-4 pt-4 border-t border-[#E5E5E5] dark:border-[#2A2A2A] w-full text-center">
                  <span className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3] block">
                    Model output
                  </span>
                  <span className="text-sm font-bold text-black dark:text-white">
                    {result.scoreBreakdown?.modelVersion || result.riskLevel || 'Idea Score'}
                  </span>
                </div>
              </div>

              {/* 5-Category Risk Vector Meter */}
              {result.categoryScores && <div className="lg:col-span-2 vault-card p-6">
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-black dark:text-white mb-4">
                  5-Vector Venture Risk Spectrum
                </h3>
                <RiskCategoryMeter categoryScores={result.categoryScores} />
              </div>}
            </div>

            {/* Top Risk Factors & Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Risk Factors */}
              <div className="vault-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-black dark:text-white">
                    Identified Vulnerability Flags
                  </h3>
                </div>
                <div className="space-y-3">
                  {result.topRiskFactors?.map((factor, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-black dark:text-white">
                      <span className="font-mono text-black dark:text-white font-bold shrink-0 mt-0.5">•</span>
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prescriptive Recommendations */}
              <div className="vault-card p-6 bg-[#F5F5F5] dark:bg-[#1A1A1A]">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-4 h-4 text-black dark:text-white" />
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-black dark:text-white">
                    Defensive Pre-Launch Actions
                  </h3>
                </div>
                <div className="space-y-3">
                  {result.recommendations?.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-black dark:text-white">
                      <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Potential Pivots & Strategy Alternatives */}
            {result.potentialPivots && (
              <div className="vault-card p-6">
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-black dark:text-white mb-4">
                  Recommended Defensive Pivots
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.potentialPivots.map((pivot, idx) => (
                    <div key={idx} className="p-4 rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1.5">
                      <span className="vault-badge vault-badge-neutral text-[10px]">
                        Pivot Option 0{idx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-black dark:text-white">
                        {pivot.name}
                      </h4>
                      <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                        {pivot.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Historical Parallel Cases */}
            {result.historicalMatches && result.historicalMatches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold font-sans tracking-tight text-black dark:text-white">
                      Historical Parallels in Dataset
                    </h3>
                    <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                      Examining past startups that shared these operational or market dynamics.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {result.historicalMatches.map((startup) => (
                    <StartupCard key={startup.id} startup={startup} compact={true} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RiskScanner;
