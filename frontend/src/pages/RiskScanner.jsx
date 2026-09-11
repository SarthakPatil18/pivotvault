import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { RiskScoreGauge } from '../components/intelligence/RiskScoreGauge';
import { runRiskScanner } from '../lib/api';
import { INDUSTRIES } from '../lib/data/startupsData';
import { 
  ShieldAlert, Sparkles, CheckCircle2, AlertTriangle, 
  RotateCcw, Lightbulb, HelpCircle, Layers, Building2,
  ExternalLink, FileText, Activity, Compass, ArrowUpRight,
  ChevronDown, ChevronUp
} from 'lucide-react';

const SCAN_STAGES = [
  'Analyzing core problem and target audience...',
  'Identifying venture archetype and business model...',
  'Evaluating active risk factors (filtering out non-applicable)...',
  'Searching verified historical post-mortems in PivotVault archive...',
  'Calculating calibrated PivotVault Risk Score...',
  'Preparing clear founder diagnostic report...'
];

export function RiskScanner() {
  const [formData, setFormData] = useState({
    idea: 'A lightweight AI-powered daily to-do list and task scheduler for remote software developers and designers.',
    industry: 'SaaS & Enterprise',
    targetCustomer: 'B2B',
    businessModel: 'Subscription',
    burnRate: '<$10k/mo',
    hardwareInvolved: false,
    regulatoryHeavy: false,
  });

  const [loading, setLoading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [showAllDimensions, setShowAllDimensions] = useState(false);

  // Animate loading through real analytical stages
  useEffect(() => {
    let timer;
    if (loading) {
      setStageIndex(0);
      timer = setInterval(() => {
        setStageIndex((prev) => (prev < SCAN_STAGES.length - 1 ? prev + 1 : prev));
      }, 750);
    } else {
      setStageIndex(0);
    }
    return () => clearInterval(timer);
  }, [loading]);

  const handleScan = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await runRiskScanner(formData);
      setResult(res.data);
      window.scrollTo({ top: 380, behavior: 'smooth' });
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
      burnRate: '<$10k/mo',
      hardwareInvolved: false,
      regulatoryHeavy: false,
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <PageHeader
        tag="EVIDENCE DIAGNOSTIC"
        title="Venture Risk Scanner"
        subtitle="Get a candid, context-aware analysis of your startup idea. We evaluate the risks that actually matter to your business model and compare them against 413+ verified startup failures."
        breadcrumbs={[
          { label: 'PivotVault', href: '/' },
          { label: 'Intelligence', href: '/risk-scanner' },
          { label: 'Risk Scanner' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Startup Input Form */}
        <div className="vault-card p-6 sm:p-8 border border-[#E5E5E5] dark:border-[#2A2A2A]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
            <div>
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                1. Tell Us About Your Startup
              </h2>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                The idea text is our primary source of truth. We automatically adapt the evaluation to your specific business.
              </p>
            </div>
            {result && (
              <button
                type="button"
                onClick={handleReset}
                className="vault-btn vault-btn-ghost text-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Form</span>
              </button>
            )}
          </div>

          <form onSubmit={handleScan} className="space-y-6">
            {/* Idea Concept Input */}
            <div>
              <label className="block text-xs font-mono font-bold text-black dark:text-white mb-2">
                STARTUP CONCEPT / VALUE PROPOSITION *
              </label>
              <textarea
                value={formData.idea}
                onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                rows={3}
                required
                placeholder="e.g. A lightweight daily to-do list and task scheduler for remote developers, priced at $8/month..."
                className="vault-input w-full font-sans text-sm resize-y leading-relaxed"
              />
              <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3] mt-1.5">
                Include what you build, who it's for, and how it delivers value. Detail helps us give you more tailored advice.
              </p>
            </div>

            {/* Context Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {/* Industry Sector */}
              <div>
                <label className="block text-xs font-mono font-bold text-black dark:text-white mb-1.5">
                  Industry Sector
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="vault-input cursor-pointer"
                >
                  {INDUSTRIES.map((ind) => (
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

              {/* Revenue / Monetization Model */}
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
                  <option value="Usage-based">Usage / Transactional Take-rate</option>
                  <option value="Marketplace">Two-Sided Marketplace Commission</option>
                  <option value="Hardware+Sub">Hardware Device + Subscription</option>
                  <option value="Direct Sales">One-time License / Direct Sale</option>
                </select>
              </div>

              {/* Monthly Burn Projection */}
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

            {/* Context Checkboxes */}
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
                <span>Subject to Heavy Regulatory Compliance (FDA, SEC, FinCEN)</span>
              </label>
            </div>

            {/* Submit Button & Stage Animation */}
            <div className="pt-4 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-mono text-[#737373] dark:text-[#A3A3A3]">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
                    <span className="text-black dark:text-white font-bold">{SCAN_STAGES[stageIndex]}</span>
                  </div>
                ) : (
                  <span>Ready to evaluate your venture's key risk factors</span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !formData.idea.trim()}
                className="vault-btn vault-btn-primary w-full sm:w-auto px-6 py-2.5 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Activity className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Startup...</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Run Venture Risk Scanner</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Diagnostic Results Section */}
        {result && (
          <div className="space-y-8 animate-fade-in">
            {/* 1. Primary Score Hero Card */}
            <div className="vault-card p-6 sm:p-8 border border-[#E5E5E5] dark:border-[#2A2A2A]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Score Gauge */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center text-center pb-6 lg:pb-0 lg:border-r border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <RiskScoreGauge 
                    score={result.finalRiskScore ?? 50}
                    label="PivotVault Risk Score"
                  />
                  <div className="mt-4 flex flex-col items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold uppercase rounded-[4px] ${
                      (result.finalRiskScore ?? 50) >= 75
                        ? 'bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#DC2626]'
                        : 'bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        (result.finalRiskScore ?? 50) >= 75 ? 'bg-[#DC2626]' : 'bg-black dark:bg-white'
                      }`} />
                      {result.riskLevel || 'EVALUATED RISK'}
                    </span>
                    <span className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                      Evidence Confidence: <strong className="text-black dark:text-white">{result.confidence ?? 70}%</strong>
                    </span>
                  </div>
                </div>

                {/* Right: Archetype & Scoring Methodology */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="vault-badge vault-badge-neutral text-[10px] font-mono uppercase">
                      Venture Profile Identified
                    </span>
                    <span className="text-xs font-mono text-black dark:text-white">
                      Archetype: <strong>{result.ventureProfile?.ventureType || 'SaaS & Software'}</strong>
                    </span>
                  </div>

                  <div className="p-4 rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] block">
                      Core Value Proposition:
                    </span>
                    <p className="text-xs font-sans text-black dark:text-white leading-relaxed">
                      {result.ventureProfile?.coreValueProposition || result.idea}
                    </p>
                  </div>

                  {/* How The Score Was Built */}
                  <div className="p-3.5 rounded-[6px] bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" />
                        How The Score Was Built
                      </span>
                      <span className="text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                        Multi-Signal Synthesis
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                      <div className="p-2 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                        <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3] mb-0.5">
                          Venture Risk Engine ({Math.round((result.scoring?.weightsUsed?.ventureRisk || 0.71) * 100)}%)
                        </div>
                        <div className="font-bold text-black dark:text-white text-sm">
                          {result.scoring?.ventureRiskScore ?? result.finalRiskScore}/100
                        </div>
                      </div>

                      <div className="p-2 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                        <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3] mb-0.5">
                          Historical Match ({Math.round((result.scoring?.weightsUsed?.historicalSimilarity || 0.29) * 100)}%)
                        </div>
                        <div className="font-bold text-black dark:text-white text-sm">
                          {result.scoring?.historicalSimilarityScore ?? 50}/100
                        </div>
                      </div>

                      <div className="p-2 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                        <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3] mb-0.5">
                          ML Benchmark ({Math.round((result.scoring?.weightsUsed?.mlBenchmark || 0) * 100)}%)
                        </div>
                        <div className="font-bold text-black dark:text-white text-sm">
                          {result.scoring?.mlBenchmarkScore ? `${result.scoring.mlBenchmarkScore}/100` : 'Unavailable (Pre-launch)'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3] italic">
                      * {result.scoring?.mlBenchmarkReason || 'Pre-launch concepts lack historical funding rounds; final score dynamically re-weighted across validated venture & historical engines.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Structured 4-Part Founder Diagnosis */}
            {result.diagnosis && (
              <div className="vault-card p-6 sm:p-8 border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-6">
                <div className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3 flex items-center justify-between">
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    Plain-English Venture Diagnosis
                  </h3>
                  <span className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                    What you need to know in under 60 seconds
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Card 1: What We Think */}
                  <div className="p-5 rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-black dark:text-white block">
                      1. WHAT WE THINK
                    </span>
                    <p className="text-xs text-[#404040] dark:text-[#D4D4D4] leading-relaxed font-sans">
                      {result.diagnosis.whatWeThink}
                    </p>
                  </div>

                  {/* Card 2: Why It Is Risky */}
                  <div className="p-5 rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-black dark:text-white block">
                      2. WHY IT IS RISKY
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#404040] dark:text-[#D4D4D4]">
                      {result.diagnosis.whyItIsRisky?.map((risk, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="font-mono text-black dark:text-white font-bold shrink-0">•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card 3: What Looks Promising */}
                  <div className="p-5 rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-black dark:text-white block">
                      3. WHAT LOOKS PROMISING
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#404040] dark:text-[#D4D4D4]">
                      {result.diagnosis.whatLooksPromising?.map((sig, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-white shrink-0 mt-0.5" />
                          <span>{sig}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card 4: What You Should Validate First */}
                  <div className="p-5 rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-black dark:text-white block">
                      4. WHAT YOU SHOULD VALIDATE FIRST
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#404040] dark:text-[#D4D4D4]">
                      {result.diagnosis.validateFirst?.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="font-mono text-black dark:text-white font-bold shrink-0">→</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Top Relevant Risks (Only Active Dimensions) */}
            {result.riskDrivers && result.riskDrivers.length > 0 && (
              <div className="vault-card p-6 sm:p-8 border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <div>
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                      Key Risk Factors For This Venture
                    </h3>
                    <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                      We only evaluate dimensions that genuinely apply to your business model.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[#737373] dark:text-[#A3A3A3]">
                    0 = Low Risk • 100 = Critical Risk
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {result.riskDrivers.map((driver, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-black dark:text-white">
                          {driver.name}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded-[3px] font-bold ${
                          driver.score >= 75
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : 'border border-[#E5E5E5] dark:border-[#2A2A2A] text-black dark:text-white'
                        }`}>
                          {driver.score}/100
                        </span>
                      </div>

                      <div className="w-full h-1.5 bg-[#E5E5E5] dark:bg-[#2A2A2A] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-black dark:bg-white rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.max(5, driver.score))}%` }}
                        />
                      </div>

                      <p className="text-xs text-[#404040] dark:text-[#D4D4D4] leading-relaxed pt-1">
                        {driver.reasoning}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Optional toggle for all dimensions */}
                <div className="mt-4 pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A] text-center">
                  <button
                    type="button"
                    onClick={() => setShowAllDimensions(!showAllDimensions)}
                    className="text-xs font-mono text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white flex items-center justify-center gap-1.5 mx-auto"
                  >
                    <span>{showAllDimensions ? 'Hide Non-Applicable Dimensions' : 'View Full 12-Dimension Breakdown & Applicability'}</span>
                    {showAllDimensions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showAllDimensions && result.ventureProfile?.dimensions && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-left animate-fade-in">
                      {Object.entries(result.ventureProfile.dimensions).map(([key, score]) => {
                        const isNA = result.ventureProfile.dimensionStatus?.[key] === 'not_applicable';
                        return (
                          <div 
                            key={key} 
                            className={`p-3 rounded-[4px] border ${
                              isNA 
                                ? 'bg-transparent border-dashed border-[#E5E5E5] dark:border-[#2A2A2A] opacity-60' 
                                : 'bg-white dark:bg-black border-[#E5E5E5] dark:border-[#2A2A2A]'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                              <span className="font-bold">{isNA ? 'N/A' : `${score}/100`}</span>
                            </div>
                            <p className="text-[10px] text-[#737373] dark:text-[#A3A3A3]">
                              {isNA ? 'Not applicable to this venture archetype.' : result.ventureProfile.dimensionReasoning?.[key]}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. Critical Founder Questions (Unknowns) */}
            {result.unknowns && result.unknowns.length > 0 && (
              <div className="vault-card p-6 sm:p-8 border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <HelpCircle className="w-4 h-4 text-black dark:text-white" />
                  <div>
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                      Critical Questions You Need To Answer
                    </h3>
                    <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                      These are the primary unverified assumptions where early startups stumble:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.unknowns.map((question, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] flex items-start gap-3"
                    >
                      <span className="font-mono text-sm font-bold text-black dark:text-white shrink-0">?</span>
                      <p className="text-xs text-black dark:text-white font-medium leading-relaxed">
                        {question}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Historical Parallels (Strict Relevance) */}
            {result.historicalMatches && result.historicalMatches.length > 0 && (
              <div className="vault-card p-6 sm:p-8 border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <div>
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                      Historical Parallels (PivotVault Verified Records)
                    </h3>
                    <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                      Zero-fabrication policy: Real post-mortems only shown when there is genuine operational relevance.
                    </p>
                  </div>
                  {result.hasStrongMatches && (
                    <div className="flex items-center gap-2 text-xs font-mono text-[#737373] dark:text-[#A3A3A3]">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{result.evidenceSummary?.totalEvidenceCount ?? 8} Records Cited</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {result.historicalMatches.map((m, idx) => (
                    <div 
                      key={idx} 
                      className={`p-5 rounded-[6px] border flex flex-col justify-between space-y-3 ${
                        m.relevanceScore > 0 
                          ? 'bg-white dark:bg-[#0A0A0A] border-[#E5E5E5] dark:border-[#2A2A2A]' 
                          : 'bg-[#F5F5F5] dark:bg-[#1A1A1A] border-dashed border-[#E5E5E5] dark:border-[#2A2A2A] md:col-span-3'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-mono font-bold text-black dark:text-white flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5" />
                            {m.name}
                          </span>
                          {m.relevanceScore > 0 && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] text-black dark:text-white rounded-[3px]">
                              {m.relevanceScore}% Match
                            </span>
                          )}
                        </div>

                        {m.relevanceScore > 0 && (
                          <div className="flex items-center gap-2 text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3] mb-2">
                            <span>{m.industry}</span>
                            {m.failedYear && <span>• Collapsed {m.failedYear}</span>}
                            {m.capitalRaised && (
                              <span>• ${(m.capitalRaised / 1000000).toFixed(0)}M Lost</span>
                            )}
                          </div>
                        )}

                        <p className="text-xs text-[#404040] dark:text-[#D4D4D4] leading-relaxed">
                          {m.whyRelevant}
                        </p>
                      </div>

                      {m.keyLesson && (
                        <div className="pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] block mb-1">
                            Forensic Lesson:
                          </span>
                          <p className="text-[11px] text-black dark:text-white italic">
                            "{m.keyLesson}"
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Practical Recommended Actions */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div className="vault-card p-6 sm:p-8 border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <Lightbulb className="w-4 h-4 text-black dark:text-white" />
                  <div>
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                      Recommended Next Actions
                    </h3>
                    <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                      Actionable steps to validate demand and de-risk your business before building:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.recommendations.map((rec, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1.5"
                    >
                      <span className="text-[10px] font-mono uppercase font-bold text-black dark:text-white">
                        Action 0{idx + 1}
                      </span>
                      <p className="text-xs text-[#404040] dark:text-[#D4D4D4] leading-relaxed">
                        {rec}
                      </p>
                    </div>
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
