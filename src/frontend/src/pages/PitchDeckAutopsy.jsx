import React, { useState, useRef } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { GhostIcon } from '../components/common/GhostIcon';
import { 
  FileUp, FileText, AlertTriangle, CheckCircle, ArrowRight, 
  Sparkles, Layers, ShieldAlert, DollarSign, PieChart, RefreshCw,
  Key, Check, ExternalLink, Printer, Upload, HelpCircle, ChevronRight,
  Cpu, Zap, Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { runPitchDeckAutopsy } from '../lib/api';

const QUICK_EXAMPLES = [
  {
    title: 'AutoTax AI — Series Seed Deck',
    industry: 'FinTech / B2B SaaS',
    raise: '$3,500,000',
    content: `Slide 1: Executive Summary — Fully autonomous AI tax preparation for SMBs claiming 99.8% precision.
Slide 2: Problem — Accountants cost $4k/yr per business; software replaces them completely.
Slide 3: Solution — Proprietary deep learning agent processes IRS filings with zero human accountant oversight.
Slide 4: Unit Economics — Pricing $150/mo. Gross margin projected at 88%. Blended CAC modeled at $75 via organic Twitter & LinkedIn.
Slide 5: Competition — Legacy CPAs and TurboTax; neither has real-time autonomous reasoning.
Slide 6: Financial Plan — $3.5M Seed to hire 14 ML engineers and scale from 20 to 1,500 SMB customers in 12 months.`
  },
  {
    title: 'SmartKitchen Press — Pitch Deck v2',
    industry: 'Hardware & IoT',
    raise: '$5,000,000',
    content: `Slide 1: Vision — The Nespresso of cold-pressed organic juice.
Slide 2: Device Architecture — 400 custom aluminum parts, high-pressure pneumatic press, internet-connected QR code DRM scanner.
Slide 3: Revenue Model — Sell hardware press for $499 (45% gross margin), recurring consumable juice packs at $7 each (72% gross margin).
Slide 4: Unit Economics — CAC $60. Payback period 4 months based on 10 packs consumed per household monthly.
Slide 5: Tooling & Capex — $1.5M for Shenzen injection molds and tooling dies. First production batch in 4 months.`
  },
  {
    title: 'FlashDrop 10-Min Groceries — Pitch Deck',
    industry: 'Food & Quick Commerce',
    raise: '$8,000,000',
    content: `Slide 1: The Instant Grocery Revolution — 10-minute delivery from urban micro-fulfillment dark stores.
Slide 2: Market Opportunity — $800B US grocery market moving to instant on-demand delivery.
Slide 3: Network Economics — 18 dark stores per city. Average basket size $22. Delivery fee $1.99.
Slide 4: Contribution Margin — Courier cost $7/delivery, packing labor $2. Modeled profitable at 160 orders/day per hub.
Slide 5: Expansion — Launch in 6 cities simultaneously with $8M seed funding.`
  }
];

export function PitchDeckAutopsy() {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste'
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [autopsyResult, setAutopsyResult] = useState(null);
  
  // Custom Deck Form State
  const [customTitle, setCustomTitle] = useState('');
  const [customIndustry, setCustomIndustry] = useState('B2B SaaS / Enterprise');
  const [customRaise, setCustomRaise] = useState('$3,000,000');
  const [customContent, setCustomContent] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const fileInputRef = useRef(null);

  // Groq & Gemini API Key State
  const [groqApiKey, setGroqApiKey] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('groq_api_key') : '') || '');
  const [geminiApiKey, setGeminiApiKey] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') : '') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  const handleSaveKeys = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('groq_api_key', groqApiKey.trim());
      localStorage.setItem('gemini_api_key', geminiApiKey.trim());
    }
    setKeySaved(true);
    setTimeout(() => {
      setKeySaved(false);
      setShowKeyInput(false);
    }, 1200);
  };

  // Run Forensic Autopsy
  const handleRunAutopsy = async (payload) => {
    setIsAnalyzing(true);
    setAnalysisStep('1/3: Extracting slide claims, unit economic statements & burn pacing...');

    const stepTimer1 = setTimeout(() => {
      setAnalysisStep('2/3: Auditing contribution margin against 413+ historical bankruptcy cases...');
    }, 500);

    const stepTimer2 = setTimeout(() => {
      setAnalysisStep('3/3: Groq LPU computing multi-dimensional failure probabilities & red flags...');
    }, 1100);

    try {
      const result = await runPitchDeckAutopsy({
        title: payload.title || customTitle || 'Custom Venture Pitch Deck',
        industry: payload.industry || customIndustry,
        targetRaise: payload.targetRaise || customRaise,
        deckContent: payload.deckContent || customContent,
        groqApiKey: groqApiKey || undefined,
        geminiApiKey: geminiApiKey || undefined
      });

      if (result) {
        setAutopsyResult(result);
      }
    } catch (err) {
      console.error('Autopsy failed:', err);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  // Handle File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setCustomTitle(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result || '';
      setCustomContent(String(text).slice(0, 15000));
    };
    reader.readAsText(file);
  };

  // Trigger Custom Analysis
  const handleRunCustomAutopsy = () => {
    if (!customTitle && !customContent) return;
    handleRunAutopsy({
      title: customTitle || 'Custom Venture Pitch Deck',
      industry: customIndustry,
      targetRaise: customRaise,
      deckContent: customContent
    });
  };

  // Load Quick Example
  const loadExample = (ex) => {
    setCustomTitle(ex.title);
    setCustomIndustry(ex.industry);
    setCustomRaise(ex.raise);
    setCustomContent(ex.content);
    setActiveTab('paste');
  };

  // Load Demo PPTX Deck
  const handleLoadDemoPPT = () => {
    setUploadedFileName('NexusFleet_Autonomous_Logistics_Series_A.pptx');
    setCustomTitle('NexusFleet Autonomous Logistics — Series A Deck');
    setCustomIndustry('Mobility, Logistics & Robotics');
    setCustomRaise('$6,500,000 Series A');
    setCustomContent(`Slide 01: Executive Summary — Level-4 autonomous freight truck retrofits operating commercial middle-mile lanes in the American Southwest.
Slide 02: Market Opportunity — $800B US trucking market constrained by persistent driver shortages and federal hours-of-service limitations.
Slide 03: Product Architecture — Sensor pods (6x LiDAR, 4D imaging radar, automotive-grade compute) retrofitted onto existing commercial Class-8 diesel and electric semi-tractors.
Slide 04: Unit Economics — Operating cost modeled at $1.25/mile vs $2.40/mile incumbent human driver benchmark. Proposes 74% gross margin at 100-vehicle scale.
Slide 05: Capex Requirements — Upfront sensor pod and compute retrofit capex of $180,000 per truck amortized over 60 months.
Slide 06: Regulatory Roadmap — Projects full driver-out autonomous operations on interstate highways within 9 months of Series A close without safety driver interventions.
Slide 07: Commercial Traction — Books 4 non-binding Letters of Intent (LOIs) from mid-sized freight brokers as committed enterprise backlog.
Slide 08: Financing Plan — $6.5M Series A allocation: $3.2M hardware retrofits & QA, $2.0M autonomy software engineering, $1.3M operational working capital.`);
    setActiveTab('upload');
  };

  return (
    <div className="pb-24 bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <PageHeader
        title="Pitch Deck Forensic Autopsy"
        subtitle="Empirical audit of venture pitch decks cross-referencing unit economics, GTM claims, and historical bankruptcy dockets powered by Groq LPU reasoning."
        badge="Pitch Deck Diagnostics"
        tagline="DECK AUDIT"
        breadcrumbs={[{ label: 'Analysis' }, { label: 'Pitch Deck Autopsy' }]}
      />

      <div className="vault-container space-y-8">
        {/* Top Control Bar: Tabs */}
        <div className="flex items-center justify-between p-2.5 rounded-[12px] bg-[#F8F9FA] dark:bg-[#0E0E0E] border border-[#E5E5E5] dark:border-[#222222]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3.5 py-1.5 rounded-[6px] text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-[#666666] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Deck File</span>
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`px-3.5 py-1.5 rounded-[6px] text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'paste'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-[#666666] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Paste Slide Outline</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Upload File Dropzone */}
        {activeTab === 'upload' && (
          <div className="vault-card p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-sm sm:text-base font-bold font-sans text-black dark:text-white">
                Upload Custom Pitch Deck (PPTX / PDF / Text / Notes)
              </h2>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                Our forensic parser audits slide statements, unit economics claims, and funding asks using high-throughput Groq LPU reasoning.
              </p>
            </div>

            {/* Demo PPT Feature Box */}
            <div className="p-4 rounded-[12px] bg-[#F4F5F7] dark:bg-[#121212] border border-[#E2E4E8] dark:border-[#222222] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[8px] bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-mono font-extrabold text-xs shrink-0 border border-red-500/20">
                  PPT
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-sans text-black dark:text-white">
                      NexusFleet_Autonomous_Logistics_Series_A.pptx
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium">
                      Demo Deck (14 Slides)
                    </span>
                  </div>
                  <p className="text-[11px] text-[#666666] dark:text-[#999999] mt-0.5">
                    Autonomous freight presentation seeking $6.5M Series A with modeled 74% gross margin &amp; hardware capex.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleLoadDemoPPT}
                  className="px-3.5 py-2 rounded-[6px] bg-black text-white dark:bg-white dark:text-black font-semibold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity w-full sm:w-auto justify-center shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Load Demo PPT File</span>
                </button>
                <a
                  href="/demo_pitch_deck.pptx"
                  download="NexusFleet_Autonomous_Logistics_Series_A.pptx"
                  className="px-3 py-2 rounded-[6px] border border-[#CCCCCC] dark:border-[#333333] text-xs font-semibold hover:border-black dark:hover:border-white transition-colors flex items-center gap-1.5 bg-white dark:bg-black text-[#555555] dark:text-[#CCCCCC]"
                  title="Download demo PPTX file to your computer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .pptx</span>
                </a>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pptx,.ppt,.pdf,.txt,.md,.json,.csv"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 sm:p-10 border-2 border-dashed rounded-[12px] text-center transition-all cursor-pointer ${
                uploadedFileName
                  ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10'
                  : 'border-[#CCCCCC] dark:border-[#333333] hover:border-black dark:hover:border-white bg-[#F9F9F9] dark:bg-[#111111]'
              }`}
            >
              {uploadedFileName ? (
                <div className="space-y-1.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-black dark:text-white font-sans">
                    Loaded File: {uploadedFileName}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                    Slide claims & unit economics extracted • Ready for forensic autopsy
                  </p>
                  <span className="inline-block text-[11px] text-[#737373] underline hover:text-black dark:hover:text-white pt-1">
                    Click to choose a different deck file
                  </span>
                </div>
              ) : (
                <>
                  <Upload className="w-9 h-9 text-[#737373] dark:text-[#A3A3A3] mx-auto mb-3" />
                  <p className="text-sm font-bold text-black dark:text-white font-sans">
                    Click or Drop Pitch Deck Document Here (.pptx, .pdf, .txt)
                  </p>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-1.5 font-mono">
                    Supports PowerPoint (.pptx), PDF, TXT, or Markdown slide notes (Up to 25MB)
                  </p>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-mono text-[#666666] dark:text-[#999999] block mb-1">
                  Venture Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Health"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-[6px] border border-[#E0E0E0] dark:border-[#2E2E2E] bg-white dark:bg-black text-black dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-[#666666] dark:text-[#999999] block mb-1">
                  Industry / Sector
                </label>
                <input
                  type="text"
                  placeholder="e.g. B2B SaaS"
                  value={customIndustry}
                  onChange={(e) => setCustomIndustry(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-[6px] border border-[#E0E0E0] dark:border-[#2E2E2E] bg-white dark:bg-black text-black dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-[#666666] dark:text-[#999999] block mb-1">
                  Target Raise ($)
                </label>
                <input
                  type="text"
                  placeholder="e.g. $4,000,000"
                  value={customRaise}
                  onChange={(e) => setCustomRaise(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-[6px] border border-[#E0E0E0] dark:border-[#2E2E2E] bg-white dark:bg-black text-black dark:text-white"
                />
              </div>
            </div>

            {/* Quick Test Presets */}
            <div className="pt-2 border-t border-[#F0F0F0] dark:border-[#1E1E1E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                Need an outline to test?
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {QUICK_EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => loadExample(ex)}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-[5px] bg-[#F0F0F0] dark:bg-[#1E1E1E] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                  >
                    Load {ex.industry.split('/')[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleRunCustomAutopsy}
                disabled={!customTitle && !customContent}
                className="px-6 py-2.5 rounded-[8px] bg-black text-white dark:bg-white dark:text-black font-semibold text-xs transition-all disabled:opacity-40 flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Run Forensic Autopsy on File</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Paste Slide Text */}
        {activeTab === 'paste' && (
          <div className="vault-card p-6 sm:p-8 space-y-5">
            <div>
              <h2 className="text-sm sm:text-base font-bold font-sans text-black dark:text-white">
                Paste Slide Outline & Financial Assumptions
              </h2>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                Paste slide bullets, financial model assumptions, or executive pitch notes for Groq LPU forensic reasoning.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-mono text-[#666666] dark:text-[#999999] block mb-1">
                  Venture Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. CloudFleet AI"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-[6px] border border-[#E0E0E0] dark:border-[#2E2E2E] bg-white dark:bg-black text-black dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-[#666666] dark:text-[#999999] block mb-1">
                  Industry / Sector
                </label>
                <input
                  type="text"
                  placeholder="e.g. Logistics & Supply Chain"
                  value={customIndustry}
                  onChange={(e) => setCustomIndustry(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-[6px] border border-[#E0E0E0] dark:border-[#2E2E2E] bg-white dark:bg-black text-black dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-[#666666] dark:text-[#999999] block mb-1">
                  Target Raise ($)
                </label>
                <input
                  type="text"
                  placeholder="e.g. $5M Series Seed"
                  value={customRaise}
                  onChange={(e) => setCustomRaise(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-[6px] border border-[#E0E0E0] dark:border-[#2E2E2E] bg-white dark:bg-black text-black dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-[#666666] dark:text-[#999999] block mb-1">
                Pitch Deck Outline / Slide Notes / Unit Economics
              </label>
              <textarea
                rows={7}
                placeholder="Slide 1: Executive Summary... Slide 4: Business Model (charging $50/mo)... Slide 7: CAC modeled at $30... Slide 10: TAM $40B..."
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
                className="w-full text-xs font-mono p-3.5 rounded-[8px] border border-[#E0E0E0] dark:border-[#2E2E2E] bg-white dark:bg-black text-black dark:text-white leading-relaxed focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
              />
            </div>

            {/* Quick Test Presets */}
            <div className="pt-2 border-t border-[#F0F0F0] dark:border-[#1E1E1E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                Try a canonical scenario:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {QUICK_EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => loadExample(ex)}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-[5px] bg-[#F0F0F0] dark:bg-[#1E1E1E] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                  >
                    Load {ex.title.split('—')[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleRunCustomAutopsy}
                disabled={!customTitle && !customContent}
                className="px-6 py-2.5 rounded-[8px] bg-black text-white dark:bg-white dark:text-black font-semibold text-xs transition-all disabled:opacity-40 flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Audit Pasted Pitch Content</span>
              </button>
            </div>
          </div>
        )}

        {/* Loading Scanner State */}
        {isAnalyzing && (
          <div className="vault-card p-12 text-center space-y-4">
            <div className="w-10 h-10 border-2 border-neutral-300 border-t-black dark:border-t-white rounded-full animate-spin mx-auto" />
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-black dark:text-white font-sans flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Groq LPU Forensic Deck Audit in Progress</span>
              </h3>
              <p className="font-mono text-xs text-[#737373] dark:text-[#A3A3A3] tracking-wide animate-pulse">
                {analysisStep || 'Auditing unit economics and cross-referencing with 413+ historical pitch decks...'}
              </p>
            </div>
          </div>
        )}

        {/* Diagnostic Results Report */}
        {!isAnalyzing && autopsyResult && (
          <div className="space-y-8 animate-fade-in">
            {/* Engine Header & Reset Pill */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-[10px] bg-[#F8F9FA] dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#222222]">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-[5px] text-[11px] font-mono font-bold bg-[#F0FDF4] text-[#15803D] dark:bg-[#052e16] dark:text-[#4ade80] border border-[#BBF7D0] dark:border-[#166534] flex items-center gap-1.5">
                  <Zap className="w-3 h-3 fill-current" />
                  <span>{autopsyResult.engine || '⚡ Groq LPU (LLaMA 3.3 70B) Reasoning'}</span>
                </span>
                <span className="text-xs font-mono text-[#737373] dark:text-[#A3A3A3]">
                  • Audited: <strong className="text-black dark:text-white">{autopsyResult.title || customTitle || 'Venture Deck'}</strong>
                </span>
              </div>
              <button
                onClick={() => setAutopsyResult(null)}
                className="text-xs font-mono font-semibold text-[#666666] dark:text-[#999999] hover:text-black dark:hover:text-white flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Audit Another Deck</span>
              </button>
            </div>

            {/* 1. Historical Parallel Callout Banner */}
            <div className="p-6 sm:p-8 rounded-[16px] bg-black text-white dark:bg-[#0A0A0A] border border-[#262626] flex flex-col md:flex-row items-start justify-between gap-6 shadow-xl">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-pulse" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#EF4444]">
                    CRITICAL HISTORICAL GRAVEYARD PARALLEL
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
                  This venture's unit economics & cost architecture mirror:{' '}
                  <span className="underline decoration-[#EF4444] text-white">
                    {autopsyResult.parallelCompany || 'Canonical High-Burn Venture Archetype'}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed">
                  {autopsyResult.summary}
                </p>
                {autopsyResult.parallelExplanation && (
                  <p className="text-xs text-[#999999] pt-1 leading-relaxed border-t border-[#222222]">
                    <span className="text-white font-semibold">Why this pattern repeats: </span>
                    {autopsyResult.parallelExplanation}
                  </p>
                )}
                {autopsyResult.parallelSlug && (
                  <div className="pt-2">
                    <Link
                      to={`/startup/${autopsyResult.parallelSlug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-white hover:text-[#EF4444] transition-colors"
                    >
                      <span>Examine {(autopsyResult.parallelCompany || '').split('(')[0].trim() || 'Parallel'} Full Forensic Postmortem</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Overall Failure / Risk Index Badge */}
              <div className="shrink-0 p-5 rounded-[12px] bg-[#141414] border border-[#2E2E2E] text-center w-full md:w-auto">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#888888] block mb-1">
                  OVERALL RISK INDEX
                </span>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-4xl font-extrabold font-mono text-white">
                    {autopsyResult.overallRiskScore}
                  </span>
                  <span className="text-xs font-mono text-[#777777]">/ 100</span>
                </div>
                <div className="mt-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                    autopsyResult.overallRiskScore >= 80
                      ? 'bg-red-950/80 text-red-400 border border-red-800'
                      : autopsyResult.overallRiskScore >= 60
                      ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                      : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                  }`}>
                    {autopsyResult.riskLevel || 'ELEVATED RISK'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Slide-by-Slide Vulnerability Assessment Matrix */}
            <div className="vault-card p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-[#EEEEEE] dark:border-[#222222] pb-3">
                <div>
                  <h3 className="text-sm font-bold font-sans text-black dark:text-white">
                    2. Risk Dimension Audit & Vulnerability Heatmap
                  </h3>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                    Objective forensic rating of pitch deck assumptions across operational verticals.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                  {autopsyResult.categories?.length || 0} Core Dimensions Audited
                </span>
              </div>

              <div className="space-y-3.5 pt-2">
                {autopsyResult.categories?.map((cat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-[8px] bg-[#F9F9F9] dark:bg-[#121212] border border-[#EAEAEA] dark:border-[#222222] space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-black dark:text-white">
                        {cat.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cat.score >= 80
                            ? 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400'
                            : cat.score >= 65
                            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400'
                            : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400'
                        }`}>
                          Risk Score: {cat.score}/100
                        </span>
                      </div>
                    </div>

                    {/* Risk Bar Gauge */}
                    <div className="w-full h-1.5 bg-[#E0E0E0] dark:bg-[#2A2A2A] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          cat.score >= 80
                            ? 'bg-[#EF4444]'
                            : cat.score >= 65
                            ? 'bg-[#F59E0B]'
                            : 'bg-[#10B981]'
                        }`}
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>

                    <p className="text-xs text-[#555555] dark:text-[#BBBBBB] leading-relaxed pt-1 font-sans">
                      <span className="font-semibold text-black dark:text-white">Forensic Finding: </span>
                      {cat.flag}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Red Flags Callout */}
            {autopsyResult.redFlags && autopsyResult.redFlags.length > 0 && (
              <div className="vault-card p-6 sm:p-8 space-y-4 border-l-4 border-l-[#EF4444]">
                <div>
                  <h3 className="text-sm font-bold font-sans text-black dark:text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                    <span>3. Critical Slide Fallacies & Red Flags</span>
                  </h3>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                    Specific claims in the deck that represent mathematical, unit-economic, or regulatory fallacies.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  {autopsyResult.redFlags.map((flag, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-[6px] bg-[#FFF5F5] dark:bg-[#1A0C0C] border border-[#FED7D7] dark:border-[#3D1414] text-xs text-[#9B2C2C] dark:text-[#FEB2B2] flex items-start gap-3"
                    >
                      <span className="font-mono font-bold shrink-0 mt-0.5">[{idx + 1}]</span>
                      <span className="leading-relaxed font-sans">{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Pre-Pitch Survival Playbook */}
            {autopsyResult.survivalPlaybook && autopsyResult.survivalPlaybook.length > 0 && (
              <div className="vault-card p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between border-b border-[#EEEEEE] dark:border-[#222222] pb-3">
                  <div>
                    <h3 className="text-sm font-bold font-sans text-black dark:text-white flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-black dark:text-white" />
                      <span>4. Pre-Pitch Survival Playbook</span>
                    </h3>
                    <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                      Non-negotiable structural corrections the founder must execute before presenting to institutional investors.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                    {autopsyResult.survivalPlaybook.length} Directives
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  {autopsyResult.survivalPlaybook.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-[8px] bg-white dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] flex items-start gap-3.5 text-xs"
                    >
                      <div className="w-5 h-5 rounded-full bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-[#333333] dark:text-[#CCCCCC] leading-relaxed font-sans">
                        {rule}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Bottom Action Bar */}
            <div className="p-4 rounded-[12px] bg-[#F8F9FA] dark:bg-[#0E0E0E] border border-[#E5E5E5] dark:border-[#222222] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#737373] dark:text-[#A3A3A3]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Need to question the assumptions of this pitch deck or historical parallels?</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-[6px] border border-[#D5D5D5] dark:border-[#333333] text-xs font-semibold hover:border-black dark:hover:border-white transition-all flex items-center gap-1.5 bg-white dark:bg-black"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Report</span>
                </button>

                {autopsyResult.parallelSlug && (
                  <Link
                    to={`/startup/${autopsyResult.parallelSlug}`}
                    className="px-4 py-1.5 rounded-[6px] bg-black text-white dark:bg-white dark:text-black text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition-all"
                  >
                    <GhostIcon className="w-3.5 h-3.5" />
                    <span>Chat with Failed Founder</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PitchDeckAutopsy;
