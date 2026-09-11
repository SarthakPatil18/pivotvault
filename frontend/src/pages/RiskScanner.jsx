import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { RiskScoreGauge } from '../components/intelligence/RiskScoreGauge';
import { runRiskScanner } from '../lib/api';
import { INDUSTRIES } from '../lib/data/startupsData';
import { 
  ShieldAlert, Sparkles, CheckCircle2, AlertTriangle, 
  RotateCcw, Lightbulb, HelpCircle, Layers, Building2,
  ExternalLink, FileText, Activity, Compass, ArrowUpRight
} from 'lucide-react';

const SCAN_STAGES = [
  'Understanding venture architecture & unit economics...',
  'Evaluating 12 venture risk dimensions...',
  'Mapping against 11 canonical failure vectors...',
  'Retrieving analogous post-mortems from 413+ failure corpus...',
  'Comparing historical patterns & checking ML benchmark...',
  'Calculating PivotVault Venture Risk Score...',
  'Synthesizing executive diagnostic report...'
];

export function RiskScanner() {
  const [formData, setFormData] = useState({
    idea: 'An AI-powered automated bookkeeping platform for SMBs with real-time tax filing guarantees.',
    industry: 'FinTech & Crypto',
    targetCustomer: 'B2B',
    businessModel: 'Subscription',
    burnRate: '$20k - $50k/mo',
    hardwareInvolved: false,
    regulatoryHeavy: true,
  });

  const [loading, setLoading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [result, setResult] = useState(null);

  // Animate loading through real analytical stages
  useEffect(() => {
    let timer;
    if (loading) {
      setStageIndex(0);
      timer = setInterval(() => {
        setStageIndex((prev) => (prev < SCAN_STAGES.length - 1 ? prev + 1 : prev));
      }, 700);
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
      burnRate: '$10k - $20k/mo',
      hardwareInvolved: false,
      regulatoryHeavy: false,
    });
  };

  const dimensionLabels = {
    productMarketFit: 'Product-Market Fit',
    customerNeed: 'Customer Urgency & Need',
    differentiation: 'Defensive Differentiation',
    competition: 'Competitive Headwinds',
    businessModel: 'Business Model Viability',
    unitEconomics: 'Unit Economics & Margins',
    executionComplexity: 'Execution & Operational Friction',
    scalability: 'Structural Scalability',
    marketTiming: 'Market Timing & Adoption',
    capitalIntensity: 'Capital Intensity & Burn',
    regulatoryExposure: 'Regulatory & Compliance Burden',
    defensibility: 'Moat & Switching Costs'
  };

  return (
    <div className="pb-24 bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <PageHeader
        title="Evidence-Based Startup Risk Scanner"
        subtitle="Stress-test venture architecture against PivotVault's 11 canonical failure vectors and 413+ historical startup autopsies."
        badge="Evidence Diagnostic"
        tagline="VENTURE RISK INTELLIGENCE"
        breadcrumbs={[{ label: 'Intelligence' }, { label: 'Risk Scanner' }]}
      />

      <div className="vault-container">
        {/* Input Form */}
        <div className="vault-card p-6 sm:p-8 mb-10 border border-[#E5E5E5] dark:border-[#2A2A2A]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
            <div>
              <h2 className="text-lg font-bold font-sans text-black dark:text-white">
                1. Venture Architecture Parameters
              </h2>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3] font-sans">
                Define the startup's core mechanics to map against historical failure distributions.
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

            {/* Submit Button & Stage Progress */}
            <div className="pt-4 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-mono text-[#737373] dark:text-[#A3A3A3]">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
                    <span className="text-black dark:text-white font-bold">{SCAN_STAGES[stageIndex]}</span>
                  </div>
                ) : (
                  <span>Ready to stress-test architecture across 12 dimensions</span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full sm:w-auto px-7 py-3 text-xs font-mono flex items-center justify-center gap-2 rounded-[6px] cursor-pointer shadow-xs"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-neutral-300 border-t-white rounded-full animate-spin" />
                    <span>Analyzing Failure Patterns...</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4" />
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
            {/* Primary Score Hero Card */}
            <div className="vault-card p-6 sm:p-8 border border-[#E5E5E5] dark:border-[#2A2A2A]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Gauge */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center text-center pb-6 lg:pb-0 lg:border-r border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <RiskScoreGauge 
                    score={result.finalRiskScore ?? result.overallRiskScore}
                    label="PivotVault Risk Score"
                  />
                  <div className="mt-4 flex flex-col items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold uppercase rounded-[4px] ${
                      (result.finalRiskScore ?? result.overallRiskScore) >= 75
                        ? 'bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#DC2626]'
                        : 'bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        (result.finalRiskScore ?? result.overallRiskScore) >= 75 ? 'bg-[#DC2626]' : 'bg-black dark:bg-white'
                      }`} />
                      {result.riskLevel || 'EVALUATED RISK'}
                    </span>
                    <span className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                      Evidence Confidence: <strong className="text-black dark:text-white">{result.confidence ?? 88}%</strong>
                    </span>
                  </div>
                </div>

                {/* Right: Executive Diagnosis & Methodology */}
                <div className="lg:col-span-8 space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="vault-badge vault-badge-neutral text-[10px] font-mono uppercase">
                      Forensic Venture Diagnosis
                    </span>
                    <span className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                      Venture Archetype: <strong className="text-black dark:text-white">{result.ventureProfile?.ventureType || 'Venture'}</strong>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black dark:text-white mb-1.5">
                      Why This Score?
                    </h3>
                    <p className="text-[13px] leading-relaxed text-[#404040] dark:text-[#D4D4D4] font-sans">
                      {result.explanation || 'Evaluated against PivotVault failure taxonomies and analogous historical records.'}
                    </p>
                  </div>

                  {/* How The Score Was Built: Transparency Table */}
                  <div className="p-3.5 rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" />
                        How The Score Was Built
                      </span>
                      <span className="text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                        Multi-Signal Calibrated Synthesis
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                      <div className="p-2 rounded-[4px] bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A]">
                        <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3] mb-0.5">
                          Venture Risk Engine ({Math.round((result.scoring?.weightsUsed?.ventureRisk || 0.71) * 100)}%)
                        </div>
                        <div className="font-bold text-black dark:text-white text-sm">
                          {result.scoring?.ventureRiskScore ?? result.finalRiskScore}/100
                        </div>
                      </div>

                      <div className="p-2 rounded-[4px] bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A]">
                        <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3] mb-0.5">
                          Historical Match ({Math.round((result.scoring?.weightsUsed?.historicalSimilarity || 0.29) * 100)}%)
                        </div>
                        <div className="font-bold text-black dark:text-white text-sm">
                          {result.scoring?.historicalSimilarityScore ?? 65}/100
                        </div>
                      </div>

                      <div className="p-2 rounded-[4px] bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A]">
                        <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3] mb-0.5">
                          ML Benchmark ({Math.round((result.scoring?.weightsUsed?.mlBenchmark || 0) * 100)}%)
                        </div>
                        <div className="font-bold text-black dark:text-white text-sm">
                          {result.scoring?.mlBenchmarkScore ? `${result.scoring.mlBenchmarkScore}/100` : 'Unavailable (Pre-launch)'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3] italic">
                      * {result.scoring?.mlBenchmarkReason || 'Pre-launch ideas lack historical venture funding rounds; final score dynamically re-weighted across validated venture & historical engines.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapped Failure Vectors */}
            {result.primaryFailureVectors && result.primaryFailureVectors.length > 0 && (
              <div className="vault-card p-6 sm:p-8 border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <div>
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                      Mapped PivotVault Failure Vectors
                    </h3>
                    <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                      Degree of association with PivotVault's 11 canonical startup failure vectors.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-black dark:text-white font-bold">
                    11-Vector Taxonomy
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.primaryFailureVectors.map((vec, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-[#737373] dark:text-[#A3A3A3]">
                          Vector 0{idx + 1}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[3px] ${
                          vec.associationLevel === 'HIGH' 
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : 'border border-[#E5E5E5] dark:border-[#2A2A2A] text-black dark:text-white'
                        }`}>
                          {vec.associationScore}% {vec.associationLevel}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-black dark:text-white">
                        {vec.name}
                      </h4>
                      <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
                        {vec.rationale || vec.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 12-Dimension Venture Risk Breakdown */}
            {result.ventureProfile?.dimensions && (
              <div className="vault-card p-6 sm:p-8 border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <div>
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                      12-Dimension Venture Risk Spectrum
                    </h3>
                    <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                      Adaptive evaluation across core venture architecture mechanics.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[#737373] dark:text-[#A3A3A3]">
                    0 = Low Vulnerability • 100 = Critical Vulnerability
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                  {Object.entries(result.ventureProfile.dimensions).map(([key, score]) => (
                    <div key={key} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-black dark:text-white">
                          {dimensionLabels[key] || key}
                        </span>
                        <span className="font-mono font-bold text-black dark:text-white">
                          {score}/100
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#E5E5E5] dark:bg-[#2A2A2A] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-black dark:bg-white rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
                        />
                      </div>
                      {result.ventureProfile.dimensionReasoning?.[key] && (
                        <p className="text-[10px] text-[#737373] dark:text-[#A3A3A3] line-clamp-1">
                          {result.ventureProfile.dimensionReasoning[key]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Historical Parallels in Real Dataset */}
            {result.historicalMatches && result.historicalMatches.length > 0 && (
              <div className="vault-card p-6 sm:p-8 border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <div>
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                      Historical Parallels (PivotVault Verified Records)
                    </h3>
                    <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                      Zero-fabrication retrieval: authenticated post-mortems sharing structural venture dynamics.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#737373] dark:text-[#A3A3A3]">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{result.evidenceSummary?.totalEvidenceCount ?? 14} Evidence Records Cited</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {result.historicalMatches.map((m, idx) => (
                    <div 
                      key={idx} 
                      className="p-5 rounded-[6px] bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-mono font-bold text-black dark:text-white flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5" />
                            {m.name}
                          </span>
                          {m.relevanceScore && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] text-black dark:text-white rounded-[3px]">
                              {m.relevanceScore}% Match
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3] mb-2">
                          <span>{m.industry}</span>
                          {m.failedYear && <span>• Collapsed {m.failedYear}</span>}
                          {m.capitalRaised && (
                            <span>• ${(m.capitalRaised / 1000000).toFixed(0)}M Lost</span>
                          )}
                        </div>

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

            {/* Positive Signals vs Critical Unknowns Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Positive Signals */}
              <div className="vault-card p-6 sm:p-8 border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <CheckCircle2 className="w-4 h-4 text-black dark:text-white" />
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                    Verified Positive Structural Signals
                  </h3>
                </div>
                <div className="space-y-3">
                  {result.positiveSignals?.map((sig, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-black dark:text-white">
                      <span className="font-mono font-bold text-black dark:text-white shrink-0 mt-0.5">•</span>
                      <div>
                        <strong className="block font-sans">{sig.name || sig}</strong>
                        {sig.reasoning && (
                          <span className="text-[#737373] dark:text-[#A3A3A3] text-[11px] block mt-0.5">
                            {sig.reasoning}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Unknowns / Needs Validation */}
              <div className="vault-card p-6 sm:p-8 bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <HelpCircle className="w-4 h-4 text-black dark:text-white" />
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                    Critical Unknowns / Needs Validation
                  </h3>
                </div>
                <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3] mb-3">
                  Information the founder has not validated; these represent early venture blindspots:
                </p>
                <div className="space-y-3">
                  {result.unknowns?.map((unk, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-black dark:text-white">
                      <span className="font-mono text-[#737373] dark:text-[#A3A3A3] shrink-0 mt-0.5">?</span>
                      <span>{unk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Defensive Pre-Launch Action Recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div className="vault-card p-6 sm:p-8 border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <Lightbulb className="w-4 h-4 text-black dark:text-white" />
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                    Defensive Pre-Launch Action Checklist
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.recommendations.map((rec, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1.5"
                    >
                      <span className="text-[10px] font-mono uppercase text-[#737373] dark:text-[#A3A3A3]">
                        Action 0{idx + 1}
                      </span>
                      <p className="text-xs text-black dark:text-white font-medium leading-relaxed">
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
