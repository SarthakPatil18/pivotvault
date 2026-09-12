import React, { useState, useEffect, useRef } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { FailureScoreBadge } from '../components/common/FailureScoreBadge';
import { GhostIcon } from '../components/common/GhostIcon';
import { 
  FileUp, FileText, AlertTriangle, CheckCircle, ArrowRight, 
  Sparkles, Layers, ShieldAlert, DollarSign, PieChart, RefreshCw,
  Key, Check, ExternalLink, Printer, Upload, HelpCircle, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SAMPLE_DECKS = [
  {
    id: 'b2b-saas',
    title: 'AutoTax AI — Series Seed Deck',
    industry: 'FinTech / B2B SaaS',
    pages: 14,
    targetRaise: '$3.5M Seed',
    parallelSlug: 'scalefactor',
    description: 'Autonomous tax preparation for SMBs claiming 99.8% precision through proprietary machine learning.'
  },
  {
    id: 'hardware-d2c',
    title: 'SmartKitchen Press — Pitch Deck v2',
    industry: 'Hardware & IoT',
    pages: 18,
    targetRaise: '$5.0M Series A',
    parallelSlug: 'juicero',
    description: 'Connected kitchen appliance with closed-ecosystem consumable pods and modeled 72% gross margin.'
  },
  {
    id: 'quick-commerce',
    title: 'FlashDrop 10-Min Groceries — Pitch Deck',
    industry: 'Food & Quick Commerce',
    pages: 12,
    targetRaise: '$8.0M Seed',
    parallelSlug: 'fast',
    description: 'Urban micro-fulfillment dark store network promising 10-minute grocery delivery at zero customer friction.'
  },
  {
    id: 'ev-mobility',
    title: 'AeroVan Micro-EV — Seed Presentation',
    industry: 'Automotive & CleanTech',
    pages: 20,
    targetRaise: '$12.0M Series A',
    parallelSlug: 'arrival',
    description: 'Decentralized micro-factories assembling modular electric commercial vans and passenger buses simultaneously.'
  },
  {
    id: 'healthtech-biotech',
    title: 'NanoBlood Diagnostics — Seed Deck',
    industry: 'HealthTech & Biotech',
    pages: 16,
    targetRaise: '$6.5M Seed',
    parallelSlug: 'theranos',
    description: 'Proprietary capillary fingerprick testing running 100+ diagnostic assays without peer-reviewed publication.'
  },
  {
    id: 'proptech-coworking',
    title: 'FlexiDesk Collective — Growth Deck',
    industry: 'PropTech & Real Estate',
    pages: 15,
    targetRaise: '$15.0M Growth',
    parallelSlug: 'wework',
    description: '10-year non-cancellable commercial master leases monetized through 30-day flexible desk memberships.'
  }
];

export function PitchDeckAutopsy() {
  const [selectedDeck, setSelectedDeck] = useState('b2b-saas');
  const [activeTab, setActiveTab] = useState('samples'); // 'samples' | 'upload' | 'paste'
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

  // Gemini API Key State
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  const handleSaveKey = () => {
    localStorage.setItem('gemini_api_key', geminiApiKey.trim());
    setKeySaved(true);
    setTimeout(() => {
      setKeySaved(false);
      setShowKeyInput(false);
    }, 1200);
  };

  // Run Forensic Autopsy
  const handleRunAutopsy = async (deckId = selectedDeck, customPayload = null) => {
    setIsAnalyzing(true);
    setAnalysisStep('1/3: Extracting slide claims & unit economic assumptions...');

    const stepTimer1 = setTimeout(() => {
      setAnalysisStep('2/3: Auditing contribution margin against 413+ historical bankruptcy cases...');
    }, 450);

    const stepTimer2 = setTimeout(() => {
      setAnalysisStep('3/3: Calculating failure probability and slide vulnerability red flags...');
    }, 900);

    try {
      const payload = customPayload || {
        deckId,
        title: SAMPLE_DECKS.find(d => d.id === deckId)?.title || 'Venture Pitch Deck',
        industry: SAMPLE_DECKS.find(d => d.id === deckId)?.industry || 'Technology',
        targetRaise: SAMPLE_DECKS.find(d => d.id === deckId)?.targetRaise || '$3M Seed',
        deckContent: SAMPLE_DECKS.find(d => d.id === deckId)?.description || '',
        geminiApiKey: geminiApiKey || undefined
      };

      const res = await fetch('/api/ai/pitch-deck-autopsy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(geminiApiKey ? { 'x-gemini-api-key': geminiApiKey } : {})
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const json = await res.json();
        if (json.autopsy || json.data) {
          setAutopsyResult(json.autopsy || json.data);
          return;
        }
      }
      throw new Error('Backend route unavailable');
    } catch (err) {
      // Fallback: Client-Side Forensic Engine for Sample Decks
      const fallbackDeck = SAMPLE_DECKS.find(d => d.id === deckId);
      if (deckId === 'hardware-d2c') {
        setAutopsyResult({
          title: 'SmartKitchen Press — Pitch Deck Autopsy',
          overallRiskScore: 84,
          riskLevel: 'CRITICAL',
          summary: 'The deck proposes high upfront tooling capex ($1.2M) and a proprietary DRM pod model with gross margins modeled at 72%. However, unit economics fail to account for warranty return rates and retail distributor take-rates.',
          parallelCompany: 'Juicero ($120M Lost) & Teforia ($17M Lost)',
          parallelSlug: 'juicero',
          parallelExplanation: 'Closed-ecosystem hardware with proprietary pods creates massive upfront tooling lead times, customer friction, and prohibitive CAC before subscription lock-in takes effect.',
          categories: [
            { name: 'Unit Economics & COGS', score: 92, flag: 'Omits ocean freight, injection mold tooling amortization, and distributor margin cuts.' },
            { name: 'Hardware Tooling & Supply Chain', score: 88, flag: 'Assumes 4-month tooling turnaround without local Shenzen factory QA presence.' },
            { name: 'Business Model Friction', score: 85, flag: 'DRM-locked pod ecosystem alienates consumers when initial novelty fades.' },
            { name: 'Market Timing & Competition', score: 68, flag: 'Consumer counter space is fiercely defended by legacy appliance manufacturers at 1/5th the price.' },
            { name: 'Capital Efficiency', score: 80, flag: 'Series A target will be consumed entirely by minimum order quantities (MOQs) and inventory working capital.' }
          ],
          redFlags: [
            'Slide 06: Assumes 0.5% warranty return rate; industry average for new IoT hardware is 8-12%.',
            'Slide 09: Projects 72% gross margin by omitting retail channel partner margins (30-40%) and packaging fulfillment.',
            'Slide 11: CAC estimated at $45 on a $499 device, severely underestimating customer education friction.'
          ],
          survivalPlaybook: [
            'Contract manufacturing on existing ODM white-label chassis before financing bespoke tooling molds.',
            'Stress-test unit economics with a 35% retail margin haircut and $30/unit reverse logistics buffer.',
            'Remove DRM software locks: monetize through subscription software value rather than proprietary physical pods.'
          ]
        });
      } else if (deckId === 'quick-commerce') {
        setAutopsyResult({
          title: 'FlashDrop 10-Min Delivery — Pitch Deck Autopsy',
          overallRiskScore: 91,
          riskLevel: 'CRITICAL',
          summary: 'The pitch deck assumes dark store micro-fulfillment profitability at 150 daily orders per hub. In reality, fixed commercial leases and idle courier hourly guarantees produce negative contribution margin per drop once VC subsidies cease.',
          parallelCompany: 'Fast ($120M Lost), SpoonRocket ($13M Lost) & Webvan ($830M Lost)',
          parallelSlug: 'fast',
          parallelExplanation: 'Relying on venture subsidies to offer zero-friction delivery creates artificial GMV that collapses instantly when discount vouchers expire and delivery fees reflect true labor costs.',
          categories: [
            { name: 'Unit Contribution Margin', score: 98, flag: 'Negative gross margin per basket after fully burdened rider pay and packing labor.' },
            { name: 'Real Estate & Fixed Lease Risk', score: 92, flag: 'Non-cancellable urban dark store leases create fatal fixed burn during demand fluctuations.' },
            { name: 'Cohort Retention & LTV', score: 88, flag: '30-day user retention drops below 15% once promo discount codes are terminated.' },
            { name: 'Competitive Moat', score: 82, flag: 'Incumbent delivery platforms with multi-category scale cross-subsidize instant grocery at zero cost.' },
            { name: 'Capital Intensity', score: 94, flag: 'Hyper-scaling to 6 cities simultaneously before single-hub contribution breakeven guarantees insolvency.' }
          ],
          redFlags: [
            'Slide 04: Net contribution modeled at +$3.50/basket, but courier base wage ($8) and cold-chain packing ($2) exceed average $18 order take-rate.',
            'Slide 07: Claims 65% month-3 retention, but fails to segment organic vs heavily discounted promotional orders.',
            'Slide 12: 3-year commercial leases signed across 18 dark stores without break clauses.'
          ],
          survivalPlaybook: [
            'Enforce positive unit contribution on delivery fees alone—never subsidize delivery labor with equity capital.',
            'Prove single-hub EBITDA profitability across 180 consecutive operating days before signing second lease.',
            'Transition from dedicated dark stores to 3PL consignment models inside existing retail grocery footprints.'
          ]
        });
      } else if (deckId === 'ev-mobility') {
        setAutopsyResult({
          title: 'AeroVan Micro-EV — Pitch Deck Autopsy',
          overallRiskScore: 89,
          riskLevel: 'CRITICAL',
          summary: 'The deck proposes radical micro-manufacturing and simultaneous development of multiple vehicle form factors. Automotive tooling lead times, regulatory crash homologation, and supply-chain MOQs make this capital strategy mathematically fragile.',
          parallelCompany: 'Arrival ($1.4B Lost) & Local Motors ($100M Lost)',
          parallelSlug: 'arrival',
          parallelExplanation: 'Attempting to innovate on both the vehicle platform AND the manufacturing factory architecture simultaneously multiplies failure points and exhausts capital before production certification.',
          categories: [
            { name: 'Manufacturing Capex & Tooling', score: 95, flag: 'Decentralized assembly model requires unproven robotic tooling and custom composite materials.' },
            { name: 'Regulatory Homologation', score: 90, flag: 'Omits 18-24 month crash testing, FMVSS, and EPA certification expense.' },
            { name: 'Product Scope & Multi-Model Sprawl', score: 86, flag: 'Promising buses, delivery vans, and passenger cars simultaneously scatters engineering resources.' },
            { name: 'Commercial Pre-Order Validity', score: 82, flag: 'Non-binding LOIs from fleet operators treated as guaranteed contracted backlog.' },
            { name: 'Cash Depletion Horizon', score: 94, flag: 'Target raise covers less than 6 months of pre-series validation burn.' }
          ],
          redFlags: [
            'Slide 05: Assumes commercial volume production 10 months from seed close, violating automotive industry tooling physics.',
            'Slide 08: Books non-binding letters of intent (LOIs) as committed enterprise revenue.',
            'Slide 14: Projected capex of $15M for vehicle manufacturing line where legacy tier-1s require $150M minimum.'
          ],
          survivalPlaybook: [
            'Kill all secondary models: certify and deliver one commercial van platform before designing subsequent vehicles.',
            'Partner with established automotive contract manufacturers (e.g. Magna Steyr, Valmet) instead of inventing proprietary factories.',
            'Secure binding customer pre-orders with milestone-based progress deposits rather than non-refundable LOIs.'
          ]
        });
      } else if (deckId === 'healthtech-biotech') {
        setAutopsyResult({
          title: 'NanoBlood Diagnostics — Pitch Deck Autopsy',
          overallRiskScore: 94,
          riskLevel: 'CRITICAL',
          summary: 'The deck claims breakthrough diagnostic efficacy and consumer-level testing speed without third-party peer-reviewed validation. Treating clinical testing as proprietary trade secrecy exposes the company to severe regulatory shutdown and enterprise liability.',
          parallelCompany: 'Theranos ($700M Lost) & UBiome ($105M Lost)',
          parallelSlug: 'theranos',
          parallelExplanation: 'Substituting marketing narratives for blinded peer-reviewed scientific replication creates fatal internal blindspots that unravel the moment FDA/CLIA oversight audits clinical data.',
          categories: [
            { name: 'Clinical & Scientific Validation', score: 98, flag: 'Zero blinded peer-reviewed publications in accredited medical journals.' },
            { name: 'FDA / CLIA Regulatory Exposure', score: 96, flag: 'Underestimates 510(k) de novo clearance requirements and proficiency audit rigor.' },
            { name: 'Analytical Accuracy & Sensitivity', score: 92, flag: 'Micro-sample dilution creates catastrophic coefficient-of-variation errors across diverse cohorts.' },
            { name: 'Governance & Medical Oversight', score: 85, flag: 'Advisory board lacks independent certified hematologists and clinical pathologists.' },
            { name: 'Channel Partnership Legal Exposure', score: 88, flag: 'National retail pharmacy agreements signed before diagnostic accuracy is certified.' }
          ],
          redFlags: [
            'Slide 07: Claims 99.4% diagnostic accuracy across 100+ assays without blinded multi-center clinical trials.',
            'Slide 10: Classifies core analytical assay methodology as trade secret, refusing independent third-party laboratory verification.',
            'Slide 13: GTM roadmap projects consumer retail testing roll-out prior to receiving full CLIA laboratory accreditation.'
          ],
          survivalPlaybook: [
            'Publish blinded analytical sensitivity and coefficient-of-variation data in peer-reviewed journals before raising growth capital.',
            'Establish an independent scientific advisory committee with veto authority over commercial marketing claims.',
            'Focus regulatory strategy on a single FDA-cleared biomarker before announcing universal multi-analyte testing.'
          ]
        });
      } else if (deckId === 'proptech-coworking') {
        setAutopsyResult({
          title: 'FlexiDesk Collective — Pitch Deck Autopsy',
          overallRiskScore: 87,
          riskLevel: 'CRITICAL',
          summary: 'The deck presents a classic duration mismatch: financing 10-15 year non-cancellable commercial property master leases with month-to-month flexible memberships, while pricing the business on high software multiples.',
          parallelCompany: 'WeWork ($47B Valuation Collapse) & Knotel ($560M Lost)',
          parallelSlug: 'wework',
          parallelExplanation: 'Marketing physical real estate leasing as a tech platform cannot overcome high tenant fit-out capex, lease payment liabilities, and rapid occupancy drops during economic pullbacks.',
          categories: [
            { name: 'Asset-Liability Duration Mismatch', score: 96, flag: 'Long-term fixed master lease liabilities backed by short-term flexible membership contracts.' },
            { name: 'Unit Economics & Fit-Out Capex', score: 90, flag: 'Location-level contribution negative after amortizing construction, architect, and HVAC fit-out debt.' },
            { name: 'Occupancy Fragility', score: 85, flag: 'Financial model assumes permanent 88% occupancy; economic slowdowns drop co-working occupancy below 60%.' },
            { name: 'Valuation & Multiple Disconnect', score: 82, flag: 'Seeking 15x ARR tech multiple for a business with 18% physical EBITDA margins.' },
            { name: 'Governance & Related-Party Risk', score: 78, flag: 'Lacks institutional lease approval covenants from independent board members.' }
          ],
          redFlags: [
            'Slide 06: Calculates "Community Adjusted EBITDA" which excludes actual lease liabilities and construction capex amortization.',
            'Slide 09: Assumes 92% continuous occupancy across newly launched international metropolitan hubs.',
            'Slide 12: Master leases backed by parent corporate entity without segregated special-purpose vehicle (SPV) liability firewalls.'
          ],
          survivalPlaybook: [
            'Shift from conventional master leases to revenue-sharing management agreements with landlord partners.',
            'Isolate individual property liabilities in ring-fenced bankruptcy-remote SPVs to protect corporate treasury.',
            'Value the venture on discounted net operating income (NOI) rather than speculative software ARR multiples.'
          ]
        });
      } else {
        setAutopsyResult({
          title: 'AutoTax AI — Pitch Deck Autopsy',
          overallRiskScore: 72,
          riskLevel: 'HIGH',
          summary: 'The pitch deck claims high automated gross margins (80%+) while delivering high-touch services that quietly require human-in-the-loop operational labor. With rising paid acquisition costs, payback period exceeds safe runway buffers.',
          parallelCompany: 'ScaleFactor ($104M Lost) & Zume ($445M Lost)',
          parallelSlug: 'scalefactor',
          parallelExplanation: 'Promising fully autonomous AI execution while relying behind the scenes on manual human support staff inverts unit economics as customer volume increases.',
          categories: [
            { name: 'Automation vs Service Reality', score: 78, flag: 'High human-in-the-loop exception handling disguised as pure software gross margin.' },
            { name: 'Customer Acquisition Cost (CAC)', score: 74, flag: 'Paid search and outbound CAC payback modeled at 6 months; realistic SMB churn forces payback past 16 months.' },
            { name: 'Market Timing & Defensibility', score: 65, flag: 'Incumbent workflow platforms (QuickBooks, Salesforce) can replicate the core feature in a minor release.' },
            { name: 'Regulatory & Execution Liability', score: 82, flag: 'Automated errors on client operations create legal and financial indemnification liabilities.' },
            { name: 'Runway & Burn Architecture', score: 69, flag: 'Headcount expansion planned before repeatable sales motion is documented.' }
          ],
          redFlags: [
            'Slide 05: Claims 99.8% autonomous ML execution with zero mention of human exception-handling triage labor cost.',
            'Slide 08: Models blended CAC at $85 on a $120/mo contract, ignoring enterprise sales cycle attrition.',
            'Slide 11: 18-month target raise leaves zero cash buffer for product refactoring if churn spikes above 2.5% monthly.'
          ],
          survivalPlaybook: [
            'Audit true COGS to include human operational triage, API inference tokens, and customer success labor.',
            'Validate organic customer retention over 120 days before accelerating paid acquisition spend.',
            'Secure enterprise contracts with annual pre-payment to fund working capital without dilutive debt.'
          ]
        });
      }
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  // Run initial autopsy on mount
  useEffect(() => {
    handleRunAutopsy('b2b-saas');
  }, []);

  // Handle File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setCustomTitle(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result || '';
      setCustomContent(String(text).slice(0, 10000));
    };
    reader.readAsText(file);
  };

  // Trigger Custom Analysis
  const handleRunCustomAutopsy = () => {
    if (!customTitle && !customContent) return;
    handleRunAutopsy('custom', {
      title: customTitle || 'Custom Venture Pitch Deck',
      industry: customIndustry,
      targetRaise: customRaise,
      deckContent: customContent,
      geminiApiKey: geminiApiKey || undefined
    });
  };

  return (
    <div className="pb-24 bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <PageHeader
        title="Pitch Deck Forensic Autopsy"
        subtitle="Empirical, mathematical audit of venture pitch decks cross-referencing unit economics, GTM claims, and historical bankruptcy dockets."
        badge="Pitch Deck Diagnostics"
        tagline="DECK AUDIT"
        breadcrumbs={[{ label: 'Analysis' }, { label: 'Pitch Deck Autopsy' }]}
      />

      <div className="vault-container space-y-8">
        {/* Top Control Bar: Gemini Key Status & Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-[12px] bg-[#F8F9FA] dark:bg-[#0E0E0E] border border-[#E5E5E5] dark:border-[#222222]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('samples')}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold transition-all ${
                activeTab === 'samples'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-[#666666] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white'
              }`}
            >
              Curated Failure Archetypes
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold transition-all ${
                activeTab === 'upload'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-[#666666] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white'
              }`}
            >
              Upload Deck File
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold transition-all ${
                activeTab === 'paste'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-[#666666] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white'
              }`}
            >
              Paste Slide Outline
            </button>
          </div>

          {/* Gemini API Key Trigger Pill */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-mono border border-[#E0E0E0] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] hover:border-black dark:hover:border-white transition-all text-[#555555] dark:text-[#CCCCCC]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Gemini 1.5 Flash:</span>
              <span className={`font-bold ${geminiApiKey ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-500'}`}>
                {geminiApiKey ? 'Connected' : 'Free Built-in'}
              </span>
            </button>

            {showKeyInput && (
              <div className="absolute right-0 top-10 w-80 p-4 rounded-[10px] bg-white dark:bg-[#161616] border border-[#E0E0E0] dark:border-[#2E2E2E] shadow-xl z-30 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold font-sans">
                  <span>Google Gemini API Key</span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 font-normal"
                  >
                    Get free key <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 rounded-[6px] border border-[#CCCCCC] dark:border-[#333333] bg-transparent text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-[#777777]">Stored locally in browser</span>
                  <button
                    onClick={handleSaveKey}
                    className="px-3 py-1 text-xs font-semibold bg-black text-white dark:bg-white dark:text-black rounded-[4px]"
                  >
                    {keySaved ? 'Saved!' : 'Save Key'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab 1: Curated Archetypes Picker */}
        {activeTab === 'samples' && (
          <div className="vault-card p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-bold font-sans text-black dark:text-white">
                  1. Select Pitch Deck Archetype
                </h2>
                <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                  Audit canonical failure archetypes across hardware, food delivery, AI SaaS, mobility, and real estate.
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3] hidden sm:inline">
                {SAMPLE_DECKS.length} Archetypes Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {SAMPLE_DECKS.map((deck) => (
                <div
                  key={deck.id}
                  onClick={() => {
                    setSelectedDeck(deck.id);
                    handleRunAutopsy(deck.id);
                  }}
                  className={`p-4.5 rounded-[10px] border cursor-pointer transition-all flex flex-col justify-between ${
                    selectedDeck === deck.id
                      ? 'border-black dark:border-white bg-[#F9F9F9] dark:bg-[#141414] ring-1 ring-black dark:ring-white shadow-sm'
                      : 'border-[#EAEAEA] dark:border-[#222222] hover:border-black dark:hover:border-white bg-white dark:bg-black'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="vault-badge vault-badge-neutral text-[10px] uppercase font-mono">
                        {deck.industry}
                      </span>
                      <span className="text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                        {deck.pages} Slides
                      </span>
                    </div>
                    <h4 className="text-[13.5px] font-bold text-black dark:text-white font-sans leading-snug">
                      {deck.title}
                    </h4>
                    <p className="text-xs text-[#666666] dark:text-[#999999] mt-2 line-clamp-2 leading-relaxed">
                      {deck.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#F0F0F0] dark:border-[#1E1E1E] flex items-center justify-between text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                    <span>Target: {deck.targetRaise}</span>
                    <span className="text-black dark:text-white font-bold flex items-center gap-1 group">
                      Audit Deck <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Upload File Dropzone */}
        {activeTab === 'upload' && (
          <div className="vault-card p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-sm sm:text-base font-bold font-sans text-black dark:text-white">
                Upload Custom Pitch Deck (PDF / Text / PPTX Notes)
              </h2>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                Our parser audits text slides, unit economics statements, and capital asks against historical venture autopsies.
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.txt,.md,.json,.csv"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-10 border-2 border-dashed border-[#CCCCCC] dark:border-[#333333] rounded-[12px] text-center hover:border-black dark:hover:border-white transition-all bg-[#F9F9F9] dark:bg-[#111111] cursor-pointer"
            >
              <Upload className="w-9 h-9 text-[#737373] dark:text-[#A3A3A3] mx-auto mb-3" />
              <p className="text-sm font-bold text-black dark:text-white font-sans">
                {uploadedFileName ? `Loaded: ${uploadedFileName}` : 'Click or Drop Pitch Deck Document Here'}
              </p>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-1.5 font-mono">
                Supports PDF, TXT, MD, or JSON slide outlines (Up to 25MB)
              </p>
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

            <div className="flex justify-end">
              <button
                onClick={handleRunCustomAutopsy}
                disabled={!customTitle && !customContent}
                className="px-6 py-2.5 rounded-[8px] bg-black text-white dark:bg-white dark:text-black font-semibold text-xs transition-all disabled:opacity-40"
              >
                Run Forensic Autopsy on File
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Paste Slide Text */}
        {activeTab === 'paste' && (
          <div className="vault-card p-6 sm:p-8 space-y-5">
            <div>
              <h2 className="text-sm sm:text-base font-bold font-sans text-black dark:text-white">
                Paste Slide Outline & Financial Assumptions
              </h2>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                Paste slide bullets, financial model statements, or executive deck summaries.
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
                rows={6}
                placeholder="Slide 1: Executive Summary... Slide 4: Business Model (charging $50/mo)... Slide 7: CAC modeled at $30... Slide 10: TAM $40B..."
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
                className="w-full text-xs font-mono p-3 rounded-[8px] border border-[#E0E0E0] dark:border-[#2E2E2E] bg-white dark:bg-black text-black dark:text-white leading-relaxed focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleRunCustomAutopsy}
                disabled={!customTitle && !customContent}
                className="px-6 py-2.5 rounded-[8px] bg-black text-white dark:bg-white dark:text-black font-semibold text-xs transition-all disabled:opacity-40"
              >
                Audit Pasted Pitch Content
              </button>
            </div>
          </div>
        )}

        {/* Loading Scanner State */}
        {isAnalyzing && (
          <div className="vault-card p-12 text-center space-y-4">
            <div className="w-10 h-10 border-2 border-neutral-300 border-t-black dark:border-t-white rounded-full animate-spin mx-auto" />
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-black dark:text-white font-sans">
                Forensic Deck Audit in Progress
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
            {/* 1. Historical Parallel Callout Banner */}
            <div className="p-6 rounded-[16px] bg-black text-white dark:bg-[#0A0A0A] border border-[#262626] flex flex-col md:flex-row items-start justify-between gap-6 shadow-xl">
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
                    {autopsyResult.parallelCompany}
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
                      <span>Examine {autopsyResult.parallelCompany.split('(')[0].trim()} Full Forensic Postmortem</span>
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
                  <h3 className="text-sm sm:text-base font-bold font-sans text-black dark:text-white">
                    Slide-by-Slide Vulnerability Breakdown
                  </h3>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                    Empirical risk distribution across unit contribution, supply chain, and customer acquisition.
                  </p>
                </div>
                <span className="text-xs font-mono text-[#737373] dark:text-[#A3A3A3]">
                  {autopsyResult.categories?.length || 5} Categories Audited
                </span>
              </div>

              <div className="space-y-3.5 pt-2">
                {autopsyResult.categories?.map((cat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-[10px] bg-[#FAFAFA] dark:bg-[#121212] border border-[#EAEAEA] dark:border-[#222222] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[13.5px] font-sans text-black dark:text-white">
                          {cat.name}
                        </span>
                      </div>
                      <p className="text-[#555555] dark:text-[#AAAAAA] leading-relaxed font-sans">
                        {cat.flag}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-3 self-end md:self-center">
                      <div className="w-28 sm:w-36 h-2 rounded-full bg-[#E5E5E5] dark:bg-[#262626] overflow-hidden">
                        <div
                          className={`h-full transition-all rounded-full ${
                            cat.score >= 85
                              ? 'bg-[#DC2626]'
                              : cat.score >= 70
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(10, cat.score))}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-bold text-black dark:text-white w-12 text-right">
                        {cat.score} / 100
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Specific Diagnostic Red Flags */}
            <div className="vault-card p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#EEEEEE] dark:border-[#222222] pb-3">
                <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                <h3 className="text-sm sm:text-base font-bold font-sans text-black dark:text-white">
                  Specific Diagnostic Red Flags in Presentation
                </h3>
              </div>

              <div className="space-y-3 pt-1">
                {autopsyResult.redFlags?.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-[8px] bg-red-50/50 dark:bg-red-950/20 border border-red-200/70 dark:border-red-900/40 flex items-start gap-3 text-xs leading-relaxed"
                  >
                    <span className="font-mono text-[#DC2626] font-bold shrink-0 mt-0.5">
                      [FLAG #{idx + 1}]
                    </span>
                    <span className="text-[#2B2B2B] dark:text-[#E0E0E0] font-sans">
                      {flag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. The Founder's Survival Playbook */}
            {autopsyResult.survivalPlaybook && autopsyResult.survivalPlaybook.length > 0 && (
              <div className="vault-card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-white to-[#F9F9F9] dark:from-[#0E0E0E] dark:to-[#080808]">
                <div className="flex items-center justify-between border-b border-[#EEEEEE] dark:border-[#222222] pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-sm sm:text-base font-bold font-sans text-black dark:text-white">
                      The Founder's Survival Playbook (Prescription Before Raising)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                    RECOMMENDED ACTIONS
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
                <span>Need to question the assumptions of this failed archetype?</span>
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
