import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { RiskScoreGauge } from '../components/intelligence/RiskScoreGauge';
import { runRiskScanner } from '../lib/api';
import { INDUSTRIES } from '../lib/data/startupsData';
import { 
  ShieldAlert, CheckCircle2, RotateCcw, Building2,
  Activity, ChevronDown, ChevronUp, Layers, HelpCircle
} from 'lucide-react';

const SCAN_STAGES = [
  'Analyzing core problem and target audience...',
  'Identifying venture category and business model...',
  'Evaluating key risk factors for this business...',
  'Searching verified historical failures in PivotVault archive...',
  'Calculating calibrated PivotVault Risk Score...',
  'Preparing founder-friendly diagnostic summary...'
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
  const [showMethodology, setShowMethodology] = useState(false);
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

  // Human-readable summary sentence based on score
  const getScoreSummary = (score) => {
    if (score < 50) {
      return 'Your idea looks relatively low-risk to start, but standing out from existing tools and confirming customer demand still need validation.';
    }
    if (score >= 75) {
      return 'Your idea carries significant execution and capital risks that should be thoroughly validated before committing heavy resources.';
    }
    return 'Your idea has moderate risk with a viable foundation, but key questions around competition and customer willingness to pay will be decisive.';
  };

  // Human-readable confidence description
  const getConfidenceDetails = (conf) => {
    const val = conf || 50;
    if (val >= 75) {
      return {
        label: 'High',
        text: 'Based on detailed concept inputs and verified historical failure patterns in our database.'
      };
    }
    if (val >= 50) {
      return {
        label: 'Moderate',
        text: 'Based on the information provided, but customer demand and willingness to pay are still unknown.'
      };
    }
    return {
      label: 'Early Estimate',
      text: 'Based on a brief concept description; deeper customer and pricing details are needed for a firmer assessment.'
    };
  };

  const scoreVal = result ? (result.finalRiskScore ?? 50) : 50;
  const confDetails = result ? getConfidenceDetails(result.confidence) : null;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <PageHeader
        tag="STARTUP RISK INTELLIGENCE"
        title="Risk Scanner"
        subtitle="Get a clear, founder-friendly analysis of your startup idea. We evaluate the risks that actually matter to your business and check them against 413+ verified startup failures."
        breadcrumbs={[
          { label: 'PivotVault', href: '/' },
          { label: 'Intelligence', href: '/risk-scanner' },
          { label: 'Risk Scanner' },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Startup Input Form */}
        <div className="vault-card p-6 sm:p-8 border border-[#E5E5E5] dark:border-[#2A2A2A]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
            <div>
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                Enter Your Startup Idea
              </h2>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                Describe what you build, who it's for, and how it works.
              </p>
            </div>
            {result && (
              <button
                type="button"
                onClick={handleReset}
                className="vault-btn vault-btn-ghost text-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <form onSubmit={handleScan} className="space-y-6">
            {/* Idea Concept Input */}
            <div>
              <label className="block text-xs font-mono font-bold text-black dark:text-white mb-2">
                YOUR STARTUP CONCEPT *
              </label>
              <textarea
                value={formData.idea}
                onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                rows={3}
                required
                placeholder="e.g. A lightweight daily to-do list and task scheduler for remote developers, priced at $8/month..."
                className="vault-input w-full font-sans text-sm resize-y leading-relaxed"
              />
            </div>

            {/* Context Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
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
                  <option value="B2C">B2C (Consumers)</option>
                  <option value="B2B2C">B2B2C / Platform</option>
                  <option value="D2C">D2C Physical Goods</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-black dark:text-white mb-1.5">
                  Business Model
                </label>
                <select
                  value={formData.businessModel}
                  onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
                  className="vault-input cursor-pointer"
                >
                  <option value="Subscription">SaaS Subscription (MRR)</option>
                  <option value="Usage-based">Usage / Transactional</option>
                  <option value="Marketplace">Marketplace Commission</option>
                  <option value="Hardware+Sub">Hardware + Subscription</option>
                  <option value="Direct Sales">One-time / Direct Sale</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-black dark:text-white mb-1.5">
                  Estimated Monthly Burn
                </label>
                <select
                  value={formData.burnRate}
                  onChange={(e) => setFormData({ ...formData, burnRate: e.target.value })}
                  className="vault-input cursor-pointer"
                >
                  <option value="<$10k/mo">Bootstrapped (&lt;$10k/mo)</option>
                  <option value="$20k - $50k/mo">Early Stage ($20k - $50k/mo)</option>
                  <option value="$50k - $150k/mo">Funded ($50k - $150k/mo)</option>
                  <option value="$500k+/mo">High Growth ($500k+/mo)</option>
                </select>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap items-center gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-black dark:text-white">
                <input
                  type="checkbox"
                  checked={formData.hardwareInvolved}
                  onChange={(e) => setFormData({ ...formData, hardwareInvolved: e.target.checked })}
                  className="rounded border-[#E5E5E5] dark:border-[#2A2A2A] accent-black dark:accent-white"
                />
                <span>Includes Physical Hardware Manufacturing</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-black dark:text-white">
                <input
                  type="checkbox"
                  checked={formData.regulatoryHeavy}
                  onChange={(e) => setFormData({ ...formData, regulatoryHeavy: e.target.checked })}
                  className="rounded border-[#E5E5E5] dark:border-[#2A2A2A] accent-black dark:accent-white"
                />
                <span>Subject to Heavy Legal / Medical Regulation (FDA, SEC, FinCEN)</span>
              </label>
            </div>

            {/* Submit Bar */}
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
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Run Risk Scanner</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Diagnostic Results Section */}
        {result && (
          <div className="space-y-8 animate-fade-in">
            {/* 1. HOW RISKY IS MY IDEA? (Primary Result Card) */}
            <div className="vault-card p-6 sm:p-8 border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] block mb-1">
                    HOW RISKY IS MY IDEA?
                  </span>
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                    PivotVault Risk Score
                  </h3>
                </div>
                <div className="text-xs font-mono text-[#737373] dark:text-[#A3A3A3]">
                  Scale: <strong className="text-black dark:text-white">0 = Low Risk</strong> • <strong className="text-black dark:text-white">100 = Very High Risk</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Score Circular Display */}
                <div className="md:col-span-4 flex flex-col items-center justify-center text-center pb-6 md:pb-0 md:border-r border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <RiskScoreGauge 
                    score={scoreVal}
                    label="Risk Score"
                  />
                  <div className="mt-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold uppercase rounded-[4px] ${
                      scoreVal >= 75
                        ? 'bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#DC2626]'
                        : 'bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        scoreVal >= 75 ? 'bg-[#DC2626]' : 'bg-black dark:bg-white'
                      }`} />
                      {result.riskLevel || 'EVALUATED RISK'}
                    </span>
                  </div>
                </div>

                {/* Score Summary & Confidence */}
                <div className="md:col-span-8 space-y-4">
                  <div className="p-4 rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                    <p className="text-sm font-sans text-black dark:text-white font-medium leading-relaxed">
                      "{getScoreSummary(scoreVal)}"
                    </p>
                  </div>

                  {/* Confidence In This Assessment */}
                  {confDetails && (
                    <div className="p-3.5 rounded-[6px] border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-black space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#737373] dark:text-[#A3A3A3]">
                          Confidence in this assessment:
                        </span>
                        <span className="font-bold text-black dark:text-white">
                          {confDetails.label} ({result.confidence ?? 50}%)
                        </span>
                      </div>
                      <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                        {confDetails.text}
                      </p>
                    </div>
                  )}

                  {/* What We Think (Concept Summary) */}
                  {result.diagnosis?.whatWeThink && (
                    <div className="text-xs text-[#404040] dark:text-[#D4D4D4] leading-relaxed pt-1">
                      <strong className="font-mono text-black dark:text-white block mb-0.5">What We Understand:</strong>
                      {result.diagnosis.whatWeThink}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. WHY IS IT RISKY? (Top Relevant Risks Only) */}
            {result.riskDrivers && result.riskDrivers.length > 0 && (
              <div className="vault-card p-6 sm:p-8 border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-4">
                <div className="pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] block mb-1">
                    WHY IS IT RISKY?
                  </span>
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                    Top Risks For This Venture
                  </h3>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                    We only highlight the risks that genuinely apply to your business model.
                  </p>
                </div>

                <div className="space-y-4">
                  {result.riskDrivers.map((driver, idx) => {
                    const levelLabel = driver.score >= 75 ? 'High Risk' : driver.score >= 55 ? 'Medium Risk' : 'Low Risk';
                    return (
                      <div 
                        key={idx} 
                        className="p-4 rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-black dark:text-white text-sm">
                            {driver.name}
                          </span>
                          <span className={`px-2 py-0.5 rounded-[3px] text-[11px] font-bold ${
                            driver.score >= 75
                              ? 'bg-black text-white dark:bg-white dark:text-black'
                              : 'border border-[#E5E5E5] dark:border-[#2A2A2A] text-black dark:text-white'
                          }`}>
                            {levelLabel} ({driver.score}/100)
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
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. WHAT LOOKS PROMISING? */}
            {result.diagnosis?.whatLooksPromising && result.diagnosis.whatLooksPromising.length > 0 && (
              <div className="vault-card p-6 sm:p-8 border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-4">
                <div className="pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] block mb-1">
                    POSITIVE SIGNALS
                  </span>
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                    What Looks Promising
                  </h3>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                    Real positive aspects and structural advantages based on what you described.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.diagnosis.whatLooksPromising.map((point, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                      <p className="text-xs text-[#404040] dark:text-[#D4D4D4] leading-relaxed">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. WHAT SHOULD I VALIDATE FIRST? */}
            {result.diagnosis?.validateFirst && result.diagnosis.validateFirst.length > 0 && (
              <div className="vault-card p-6 sm:p-8 border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-4">
                <div className="pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] block mb-1">
                    NEXT STEPS
                  </span>
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                    What You Should Validate First
                  </h3>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                    Specific, practical actions to test demand and de-risk your startup before building.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.diagnosis.validateFirst.map((action, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1.5"
                    >
                      <span className="text-[10px] font-mono font-bold uppercase text-black dark:text-white">
                        Step 0{idx + 1}
                      </span>
                      <p className="text-xs text-[#404040] dark:text-[#D4D4D4] leading-relaxed font-medium">
                        {action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. SIMILAR HISTORICAL FAILURES */}
            {result.historicalMatches && result.historicalMatches.length > 0 && (
              <div className="vault-card p-6 sm:p-8 border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-4">
                <div className="pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] block mb-1">
                    LESSONS FROM THE PAST
                  </span>
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                    Similar Historical Failures
                  </h3>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                    Real companies from PivotVault's verified archive that shared comparable challenges.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {result.historicalMatches.map((m, idx) => {
                    const isRealMatch = m.relevanceScore > 0;
                    return (
                      <div 
                        key={idx} 
                        className={`p-5 rounded-[6px] border flex flex-col justify-between space-y-3 ${
                          isRealMatch 
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
                            {isRealMatch && m.failedYear && (
                              <span className="text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                                Failed {m.failedYear}
                              </span>
                            )}
                          </div>

                          {isRealMatch && m.failureMode && (
                            <div className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3] mb-2">
                              Primary Issue: <strong className="text-black dark:text-white">{m.failureMode}</strong>
                            </div>
                          )}

                          <p className="text-xs text-[#404040] dark:text-[#D4D4D4] leading-relaxed">
                            {m.whyRelevant}
                          </p>
                        </div>

                        {isRealMatch && m.keyLesson && (
                          <div className="pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] block mb-1">
                              Key Lesson:
                            </span>
                            <p className="text-[11px] text-black dark:text-white italic">
                              "{m.keyLesson}"
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6. HOW DID WE CALCULATE THIS? (Collapsed Accordion For Judges) */}
            <div className="vault-card p-6 border border-[#E5E5E5] dark:border-[#2A2A2A]">
              <button
                type="button"
                onClick={() => setShowMethodology(!showMethodology)}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] block">
                    FOR JUDGES & ANALYSTS
                  </span>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white mt-0.5">
                    How Did We Calculate This Score?
                  </h4>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#737373] dark:text-[#A3A3A3]">
                  <span>{showMethodology ? 'Hide Methodology' : 'Show Methodology'}</span>
                  {showMethodology ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </div>
              </button>

              {showMethodology && (
                <div className="mt-5 pt-4 border-t border-[#E5E5E5] dark:border-[#2A2A2A] space-y-5 animate-fade-in text-xs">
                  <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
                    The final risk score combines multiple analytical layers. The weights adapt automatically based on which signals are available and applicable:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-3.5 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1.5">
                      <div className="flex items-center justify-between font-mono font-bold text-black dark:text-white">
                        <span>Idea Analysis</span>
                        <span>{Math.round((result.scoring?.weightsUsed?.ventureRisk || 0.71) * 100)}%</span>
                      </div>
                      <div className="text-sm font-mono font-bold text-black dark:text-white">
                        {result.scoring?.ventureRiskScore ?? result.finalRiskScore}/100
                      </div>
                      <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                        AI evaluates the business idea and identifies the risks that actually apply.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1.5">
                      <div className="flex items-center justify-between font-mono font-bold text-black dark:text-white">
                        <span>Historical Patterns</span>
                        <span>{Math.round((result.scoring?.weightsUsed?.historicalSimilarity || 0.29) * 100)}%</span>
                      </div>
                      <div className="text-sm font-mono font-bold text-black dark:text-white">
                        {result.scoring?.historicalSimilarityScore ?? 50}/100
                      </div>
                      <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                        Compares your concept with real startup failure records in PivotVault's database.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1.5">
                      <div className="flex items-center justify-between font-mono font-bold text-black dark:text-white">
                        <span>ML Benchmark</span>
                        <span>{Math.round((result.scoring?.weightsUsed?.mlBenchmark || 0) * 100)}%</span>
                      </div>
                      <div className="text-sm font-mono font-bold text-black dark:text-white">
                        {result.scoring?.mlBenchmarkScore ? `${result.scoring.mlBenchmarkScore}/100` : 'Unavailable (Pre-launch)'}
                      </div>
                      <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                        Adds a secondary signal from our trained capitalization model when funding history exists.
                      </p>
                    </div>
                  </div>

                  {/* Toggle all 12 dimensions */}
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setShowAllDimensions(!showAllDimensions)}
                      className="text-xs font-mono text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white inline-flex items-center gap-1.5"
                    >
                      <span>{showAllDimensions ? 'Hide All 12 Dimensions' : 'Inspect All 12 Risk Dimensions & Applicability'}</span>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RiskScanner;
