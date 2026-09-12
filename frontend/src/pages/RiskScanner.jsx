import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { RiskScoreGauge } from '../components/intelligence/RiskScoreGauge';
import { runRiskScanner } from '../lib/api';
import { 
  ShieldAlert, CheckCircle2, RotateCcw, Building2,
  Activity, ChevronDown, ChevronUp, ArrowRight, Sparkles
} from 'lucide-react';

const SCAN_STAGES = [
  'Reading your startup idea and target market...',
  'Checking which risk factors apply to your business...',
  'Comparing against 413+ verified startup failures...',
  'Calculating calibrated PivotVault Risk Score...',
  'Preparing plain-English diagnosis and next steps...'
];

const FRIENDLY_INDUSTRIES = [
  'Software / SaaS',
  'AI / Machine Learning',
  'Healthcare & Biotech',
  'Finance / Fintech',
  'Education / EdTech',
  'Food / Delivery',
  'E-commerce & Retail',
  'Hardware & Devices',
  'Climate / CleanTech / Energy',
  'Media / Entertainment',
  'Travel & Mobility',
  'Social & Community',
  'Not sure yet / Other'
];

const TARGET_CUSTOMERS = [
  { value: 'Individual consumers', label: 'Individual consumers', desc: 'People using it for personal use' },
  { value: 'Small and medium businesses', label: 'Small and medium businesses', desc: 'Businesses with smaller teams & budgets' },
  { value: 'Large companies', label: 'Large companies', desc: 'Enterprise customers with larger contracts' },
  { value: 'Developers / technical users', label: 'Developers / technical users', desc: 'Engineers, designers, technical creators' },
  { value: 'Both consumers and businesses', label: 'Both consumers and businesses', desc: 'Platform / two-sided market' },
  { value: 'Not sure yet', label: 'Not sure yet', desc: 'The AI will infer this from your idea' }
];

const BUSINESS_MODELS = [
  { value: 'Monthly / yearly subscription', label: 'Monthly / yearly subscription', desc: 'Recurring subscription fee' },
  { value: 'One-time purchase', label: 'One-time purchase', desc: 'Pay once to own or access' },
  { value: 'Freemium', label: 'Freemium', desc: 'Free basic tier with paid upgrades' },
  { value: 'Pay per use', label: 'Pay per use', desc: 'Usage-based or transactional pricing' },
  { value: 'Marketplace commission', label: 'Marketplace commission', desc: 'Take a fee per transaction' },
  { value: 'Advertising', label: 'Advertising / sponsored', desc: 'Monetize attention or brand sponsors' },
  { value: 'Not sure yet', label: 'Not sure yet / Deciding later', desc: 'The AI will suggest a model' }
];

const MONTHLY_SPEND_OPTIONS = [
  { value: 'Bootstrapped (Under $10k/mo)', label: 'Bootstrapped (Under $10k/mo)', desc: 'Lean team, low initial overhead' },
  { value: 'Early Stage ($10k - $50k/mo)', label: 'Early Stage ($10k - $50k/mo)', desc: 'Small core team, testing MVP' },
  { value: 'Funded ($50k - $150k/mo)', label: 'Funded ($50k - $150k/mo)', desc: 'Active hiring and marketing' },
  { value: 'High Growth ($150k+/mo)', label: 'High Growth ($150k+/mo)', desc: 'Rapid expansion and scale' },
  { value: 'Not sure yet', label: 'Not sure yet', desc: 'Operating costs still being estimated' }
];

const FRIENDLY_RISK_NAMES = {
  'Competitive Pressure': 'Competition',
  'competition': 'Competition',
  'Differentiation & Moat': 'Standing Out',
  'differentiation': 'Standing Out',
  'Product-Market Fit & Retention': 'Customer Demand',
  'productMarketFit': 'Customer Demand',
  'Unit Economics & Margins': 'Making Money',
  'unitEconomics': 'Making Money',
  'Customer Urgency & Pain': 'Urgent Need',
  'customerNeed': 'Urgent Need',
  'Business Model & Monetization': 'Monetization Model',
  'businessModel': 'Monetization Model',
  'Execution & Operations': 'Building & Delivery',
  'executionComplexity': 'Building & Delivery',
  'Capital Requirements & Burn': 'Funding & Costs',
  'capitalIntensity': 'Funding & Costs',
  'Regulatory & Legal Risk': 'Regulations & Legal',
  'regulatoryExposure': 'Regulations & Legal',
  'Defensibility & Switching Barriers': 'Defensibility & Moat',
  'defensibility': 'Defensibility & Moat',
  'Scalability & Growth Limits': 'Scaling & Operations',
  'scalability': 'Scaling & Operations',
  'Market Timing & Adoption': 'Market Timing',
  'marketTiming': 'Market Timing',
};

export function RiskScanner() {
  const [formData, setFormData] = useState({
    idea: 'A lightweight AI-powered daily to-do list and task scheduler for remote software developers and designers.',
    industry: 'Software / SaaS',
    targetCustomer: 'Developers / technical users',
    businessModel: 'Monthly / yearly subscription',
    burnRate: 'Bootstrapped (Under $10k/mo)',
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
      industry: 'Software / SaaS',
      targetCustomer: 'Developers / technical users',
      businessModel: 'Monthly / yearly subscription',
      burnRate: 'Bootstrapped (Under $10k/mo)',
      hardwareInvolved: false,
      regulatoryHeavy: false,
    });
  };

  // Human-readable summary verdict sentence based on score
  const getScoreSummary = (score) => {
    if (score < 50) {
      return 'Your idea looks relatively low-risk to start, but competition and customer demand still need validation.';
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
        <div className="vault-card p-6 sm:p-8 border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-7">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
            <div>
              <h2 className="text-base font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                Tell Us About Your Startup
              </h2>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-1">
                Give us a few details so we can identify the risks that matter most to your idea.
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

          <form onSubmit={handleScan} className="space-y-7">
            {/* GROUP 1: START WITH YOUR IDEA */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3]">
                  1. Start With Your Idea
                </span>
                <span className="text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                  Primary Source of Truth
                </span>
              </div>
              <label className="block text-xs font-mono font-bold text-black dark:text-white">
                Describe Your Startup Idea *
              </label>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                Tell us what you are building, who it helps, and how it works. More detail leads to a better analysis.
              </p>
              <textarea
                value={formData.idea}
                onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                rows={3}
                required
                placeholder="e.g. A lightweight AI-powered daily to-do list and task scheduler for remote software developers, priced at $8/month..."
                className="vault-input w-full font-sans text-sm resize-y leading-relaxed mt-1"
              />
            </div>

            {/* GROUP 2: A FEW MORE DETAILS */}
            <div className="space-y-3 pt-2 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3]">
                  2. A Few More Details
                </span>
                <span className="text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                  Not sure? Choose "Not sure yet"
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                {/* Field 1: Industry */}
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-black dark:text-white">
                    What industry is your startup in?
                  </label>
                  <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                    Choose the area your startup operates in.
                  </p>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="vault-input cursor-pointer w-full text-xs"
                  >
                    {FRIENDLY_INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                {/* Field 2: Target Customer */}
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-black dark:text-white">
                    Who will use your product?
                  </label>
                  <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                    Who are you building this for?
                  </p>
                  <select
                    value={formData.targetCustomer}
                    onChange={(e) => setFormData({ ...formData, targetCustomer: e.target.value })}
                    className="vault-input cursor-pointer w-full text-xs"
                  >
                    {TARGET_CUSTOMERS.map((tc) => (
                      <option key={tc.value} value={tc.value}>
                        {tc.label} — {tc.desc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Field 3: Business Model */}
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-black dark:text-white">
                    How will you make money?
                  </label>
                  <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                    Choose your main way of earning revenue.
                  </p>
                  <select
                    value={formData.businessModel}
                    onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
                    className="vault-input cursor-pointer w-full text-xs"
                  >
                    {BUSINESS_MODELS.map((bm) => (
                      <option key={bm.value} value={bm.value}>
                        {bm.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Field 4: Monthly Cost */}
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-black dark:text-white">
                    Expected monthly spending
                  </label>
                  <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                    Roughly how much do you expect to spend each month?
                  </p>
                  <select
                    value={formData.burnRate}
                    onChange={(e) => setFormData({ ...formData, burnRate: e.target.value })}
                    className="vault-input cursor-pointer w-full text-xs"
                  >
                    {MONTHLY_SPEND_OPTIONS.map((ms) => (
                      <option key={ms.value} value={ms.value}>
                        {ms.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* GROUP 3: OPTIONAL DETAILS */}
            <div className="space-y-3 pt-2 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3]">
                  3. Optional Details
                </span>
                <span className="text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                  Only select if applicable
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Hardware Checkbox */}
                <label className="p-3.5 rounded-[6px] border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-black hover:border-black dark:hover:border-white transition-colors cursor-pointer flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.hardwareInvolved}
                    onChange={(e) => setFormData({ ...formData, hardwareInvolved: e.target.checked })}
                    className="rounded border-[#E5E5E5] dark:border-[#2A2A2A] accent-black dark:accent-white mt-0.5"
                  />
                  <div className="space-y-0.5">
                    <span className="text-xs font-mono font-bold text-black dark:text-white block">
                      Does your product require physical hardware?
                    </span>
                    <span className="text-[11px] text-[#737373] dark:text-[#A3A3A3] block">
                      Examples: devices, machines, sensors, wearables.
                    </span>
                  </div>
                </label>

                {/* Regulation Checkbox */}
                <label className="p-3.5 rounded-[6px] border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-black hover:border-black dark:hover:border-white transition-colors cursor-pointer flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.regulatoryHeavy}
                    onChange={(e) => setFormData({ ...formData, regulatoryHeavy: e.target.checked })}
                    className="rounded border-[#E5E5E5] dark:border-[#2A2A2A] accent-black dark:accent-white mt-0.5"
                  />
                  <div className="space-y-0.5">
                    <span className="text-xs font-mono font-bold text-black dark:text-white block">
                      Does your product require government approval or strict regulations?
                    </span>
                    <span className="text-[11px] text-[#737373] dark:text-[#A3A3A3] block">
                      Examples: medical products, financial services, regulated industries.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* SUBMIT BAR */}
            <div className="pt-4 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-mono text-[#737373] dark:text-[#A3A3A3]">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
                    <span className="text-black dark:text-white font-bold">{SCAN_STAGES[stageIndex]}</span>
                  </div>
                ) : (
                  <span>Ready to evaluate the risks that matter most to your idea</span>
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
                    <span>Analyze My Startup</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* DIAGNOSTIC RESULTS SECTION */}
        {result && (
          <div className="space-y-8 animate-fade-in">
            {/* 1. HOW RISKY IS MY IDEA? (Primary Result Card) */}
            <div className="vault-card p-6 sm:p-8 border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] block mb-1">
                    HOW RISKY IS MY IDEA?
                  </span>
                  <h3 className="text-base font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                    PivotVault Risk Score
                  </h3>
                </div>
                <div className="text-xs font-mono text-[#737373] dark:text-[#A3A3A3]">
                  Scale: <strong className="text-black dark:text-white">0 = Lower Risk</strong> • <strong className="text-black dark:text-white">100 = Higher Risk</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Score Circular Display */}
                <div className="md:col-span-4 flex flex-col items-center justify-center text-center pb-6 md:pb-0 md:border-r border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <RiskScoreGauge 
                    score={scoreVal}
                    label="Risk Score"
                  />
                </div>

                {/* Score Summary & Confidence */}
                <div className="md:col-span-8 space-y-4">
                  {/* One-Line Verdict */}
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

                  {/* What We Understand (Concept Summary) */}
                  {result.diagnosis?.whatWeThink && (
                    <div className="text-xs text-[#404040] dark:text-[#D4D4D4] leading-relaxed pt-1">
                      <strong className="font-mono text-black dark:text-white block mb-0.5">What We Understand:</strong>
                      {result.diagnosis.whatWeThink}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. WHAT COULD GO WRONG? (Top Relevant Risks Only) */}
            {result.riskDrivers && result.riskDrivers.length > 0 && (
              <div className="vault-card p-6 sm:p-8 border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-4">
                <div className="pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] block mb-1">
                    WHAT COULD GO WRONG?
                  </span>
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                    Top Risks For Your Startup
                  </h3>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                    We highlight the risks that matter most for your idea.
                  </p>
                </div>

                <div className="space-y-4">
                  {result.riskDrivers.map((driver, idx) => {
                    const friendlyName = FRIENDLY_RISK_NAMES[driver.name] || driver.name;
                    const isHigh = driver.score >= 75;
                    const isMedium = driver.score >= 50 && driver.score < 75;
                    const levelLabel = isHigh ? 'High Risk' : isMedium ? 'Medium Risk' : 'Low Risk';
                    
                    const barColor = isHigh 
                      ? 'bg-[#DC2626]' 
                      : isMedium 
                      ? 'bg-[#F59E0B]' 
                      : 'bg-[#10B981]';
                      
                    const badgeClass = isHigh
                      ? 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/60'
                      : isMedium
                      ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60'
                      : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60';

                    return (
                      <div 
                        key={idx} 
                        className="p-4 rounded-[8px] bg-[#F9F9F9] dark:bg-[#141414] border border-[#EAEAEA] dark:border-[#222222] space-y-2.5"
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-black dark:text-white text-sm">
                            {friendlyName}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-[4px] text-[11px] font-bold shadow-xs ${badgeClass}`}>
                            {levelLabel} — {driver.score}/100
                          </span>
                        </div>

                        <div className="w-full h-2 bg-[#EAEAEA] dark:bg-[#262626] rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                            style={{ width: `${Math.min(100, Math.max(5, driver.score))}%` }}
                          />
                        </div>

                        <p className="text-xs text-[#404040] dark:text-[#D4D4D4] leading-relaxed pt-0.5">
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

            {/* 6. HOW WE CALCULATE THIS (Collapsed Accordion For Judges) */}
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
                    How We Calculate This
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
                        <span>AI Analysis</span>
                        <span>{Math.round((result.scoring?.weightsUsed?.ventureRisk || 0.71) * 100)}%</span>
                      </div>
                      <div className="text-sm font-mono font-bold text-black dark:text-white">
                        {result.scoring?.ventureRiskScore ?? result.finalRiskScore}/100
                      </div>
                      <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                        AI analyzes the actual startup idea and identifies relevant risks.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1.5">
                      <div className="flex items-center justify-between font-mono font-bold text-black dark:text-white">
                        <span>Historical Failure Patterns</span>
                        <span>{Math.round((result.scoring?.weightsUsed?.historicalSimilarity || 0.29) * 100)}%</span>
                      </div>
                      <div className="text-sm font-mono font-bold text-black dark:text-white">
                        {result.scoring?.historicalSimilarityScore ?? 50}/100
                      </div>
                      <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                        PivotVault compares the idea with real startup failures in its evidence base.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1.5">
                      <div className="flex items-center justify-between font-mono font-bold text-black dark:text-white">
                        <span>ML Signal</span>
                        <span>{Math.round((result.scoring?.weightsUsed?.mlBenchmark || 0) * 100)}%</span>
                      </div>
                      <div className="text-sm font-mono font-bold text-black dark:text-white">
                        {result.scoring?.mlBenchmarkScore ? `${result.scoring.mlBenchmarkScore}/100` : 'Unavailable (Pre-launch)'}
                      </div>
                      <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                        Our trained model provides an additional historical signal when applicable.
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
                          const friendlyDimName = FRIENDLY_RISK_NAMES[key] || key.replace(/([A-Z])/g, ' $1');
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
                                <span className="capitalize font-bold">{friendlyDimName}</span>
                                <span className="font-bold">{isNA ? 'N/A' : `${score}/100`}</span>
                              </div>
                              <p className="text-[10px] text-[#737373] dark:text-[#A3A3A3]">
                                {isNA ? 'Not applicable to this startup type.' : result.ventureProfile.dimensionReasoning?.[key]}
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
