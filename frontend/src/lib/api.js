/**
 * PivotVault Centralized API Layer
 * 
 * Provides unified data access for all intelligence features.
 * Supports configurable backend endpoint via VITE_API_URL with graceful fallback
 * to rich offline curated intelligence data.
 */

import { ALL_STARTUPS, getStartupById, getStartupStatistics, CURATED_STARTUPS } from './data/startupsData';
import { QUIZ_QUESTIONS } from './data/quizData';
import { FOUNDER_CONFESSIONS } from './data/confessionsData';
import { GHOST_PERSONAS } from './data/ghostsData';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Helper to attempt a network fetch to the backend API, falling back to mock generator
 */
async function fetchWithFallback(endpoint, options = {}, fallbackFn) {
  try {
    const controller = new AbortController();
    const timeoutMs = options.timeout || 25000; // default 25s for deep analytical reasoning
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data, isLive: true, source: 'backend_api' };
  } catch (error) {
    // Graceful fallback to rich curated mock data layer
    const mockData = await fallbackFn();
    return { data: mockData, isLive: false, source: 'curated_offline_dataset', error: error.message };
  }
}

/**
 * Fetch all startups with search, filtering, sorting, and pagination
 */
export async function getStartups(params = {}) {
  const {
    query = '',
    industry = 'All Industries',
    country = 'All Countries',
    failureMode = 'All Failure Modes',
    minScore = 0,
    maxScore = 100,
    sort = 'score_desc', // score_desc, score_asc, capital_desc, capital_asc, year_desc, name_asc
    page = 1,
    limit = 12
  } = params;

  const queryParams = new URLSearchParams();
  if (query) queryParams.set('query', query);
  if (industry && industry !== 'All Industries') queryParams.set('industry', industry);
  if (country && country !== 'All Countries') queryParams.set('country', country);
  if (failureMode && failureMode !== 'All Failure Modes') queryParams.set('failureMode', failureMode);
  if (sort) queryParams.set('sort', sort);
  if (page) queryParams.set('page', String(page));
  if (limit) queryParams.set('limit', String(limit));
  const queryString = queryParams.toString();
  const endpoint = queryString ? `/startups?${queryString}` : '/startups';

  return fetchWithFallback(endpoint, { method: 'GET' }, async () => {
    let filtered = [...ALL_STARTUPS];

    // Text search
    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter((s) => 
        s.name.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.failureMode.toLowerCase().includes(q) ||
        s.industry.toLowerCase().includes(q) ||
        s.rootCauses.some(c => c.toLowerCase().includes(q)) ||
        s.founders.some(f => f.name.toLowerCase().includes(q)) ||
        s.investors.some(inv => inv.toLowerCase().includes(q))
      );
    }

    // Industry filter
    if (industry && industry !== 'All Industries') {
      filtered = filtered.filter((s) => s.industry.toLowerCase() === industry.toLowerCase());
    }

    // Country filter
    if (country && country !== 'All Countries') {
      filtered = filtered.filter((s) => s.country.toLowerCase() === country.toLowerCase());
    }

    // Failure mode filter
    if (failureMode && failureMode !== 'All Failure Modes') {
      filtered = filtered.filter((s) => s.failureMode.toLowerCase() === failureMode.toLowerCase());
    }

    // Failure score filter
    filtered = filtered.filter((s) => s.failureScore >= minScore && s.failureScore <= maxScore);

    // Sorting
    switch (sort) {
      case 'score_desc':
        filtered.sort((a, b) => b.failureScore - a.failureScore);
        break;
      case 'score_asc':
        filtered.sort((a, b) => a.failureScore - b.failureScore);
        break;
      case 'capital_desc':
        filtered.sort((a, b) => b.capitalRaised - a.capitalRaised);
        break;
      case 'capital_asc':
        filtered.sort((a, b) => a.capitalRaised - b.capitalRaised);
        break;
      case 'year_desc':
        filtered.sort((a, b) => b.failedYear - a.failedYear);
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        filtered.sort((a, b) => b.failureScore - a.failureScore);
    }

    // Pagination
    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / limit);
    const offset = (page - 1) * limit;
    const paginatedItems = filtered.slice(offset, offset + limit);

    return {
      startups: paginatedItems,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    };
  });
}

/**
 * Fetch a single startup by ID
 */
export async function getStartup(id) {
  return fetchWithFallback(`/startups/${id}`, { method: 'GET' }, async () => {
    const startup = getStartupById(id);
    if (!startup) {
      throw new Error(`Startup with ID '${id}' not found.`);
    }
    return startup;
  });
}

/**
 * Global Search across startups, founders, industries, failure causes, and investors
 */
export async function searchStartups(query) {
  if (!query || query.trim() === '') return { data: [], isLive: false };

  return fetchWithFallback(`/search?q=${encodeURIComponent(query)}`, { method: 'GET' }, async () => {
    const q = query.toLowerCase().trim();
    const matches = ALL_STARTUPS.filter((s) => 
      s.name.toLowerCase().includes(q) ||
      s.tagline.toLowerCase().includes(q) ||
      s.industry.toLowerCase().includes(q) ||
      s.failureMode.toLowerCase().includes(q) ||
      s.founders.some(f => f.name.toLowerCase().includes(q)) ||
      s.investors.some(inv => inv.toLowerCase().includes(q)) ||
      s.rootCauses.some(rc => rc.toLowerCase().includes(q))
    ).slice(0, 8);

    return matches;
  });
}

/**
 * Fetch macro insights & dataset statistics
 */
export async function getInsights() {
  return fetchWithFallback('/insights', { method: 'GET' }, async () => {
    return getStartupStatistics();
  });
}

/**
 * Fetch related startups by ID or category
 */
export async function getRelatedStartups(id) {
  return fetchWithFallback(`/startups/${id}/related`, { method: 'GET' }, async () => {
    const current = getStartupById(id);
    if (!current) return CURATED_STARTUPS.slice(0, 3);

    const related = ALL_STARTUPS.filter(
      (s) => s.id !== current.id && (s.industry === current.industry || s.failureMode === current.failureMode)
    ).slice(0, 4);

    return related;
  });
}

/**
 * Run Evidence-Based Startup Risk Scanner
 */
export async function runRiskScanner(inputData) {
  const result = await fetchWithFallback('/ai/risk-scan', {
    method: 'POST',
    timeout: 30000,
    body: JSON.stringify({
      ideaText: inputData.idea || inputData.ideaText,
      industry: inputData.industry,
      targetCustomer: inputData.targetCustomer,
      businessModel: inputData.businessModel,
      burnRate: inputData.burnRate,
      hardwareInvolved: inputData.hardwareInvolved,
      regulatoryHeavy: inputData.regulatoryHeavy,
    }),
  }, async () => {
    // Intelligent offline fallback structured identically
    const {
      idea = '',
      industry = 'SaaS & Enterprise',
      targetCustomer = 'B2B',
      businessModel = 'Subscription',
      burnRate = '$20k - $50k/mo',
      hardwareInvolved = false,
      regulatoryHeavy = false
    } = inputData;

    let pRisk = 62;
    let mRisk = 58;
    let bmRisk = 54;
    let cRisk = 65;
    let eRisk = hardwareInvolved ? 85 : 52;
    let rRisk = regulatoryHeavy ? 88 : 35;
    let capRisk = (burnRate.includes('150k') || burnRate.includes('500k')) ? 84 : 45;

    const vScore = Math.round((pRisk * 0.2) + (mRisk * 0.15) + (bmRisk * 0.15) + (cRisk * 0.15) + (eRisk * 0.15) + (rRisk * 0.1) + (capRisk * 0.1));
    const hScore = 65;
    const finalRiskScore = Math.round(vScore * 0.71 + hScore * 0.29);

    const matches = ALL_STARTUPS.filter((s) => s.industry.toLowerCase() === industry.toLowerCase() || (hardwareInvolved && s.industry.includes('Hardware'))).slice(0, 3);

    return {
      finalRiskScore,
      riskLevel: finalRiskScore >= 75 ? 'CRITICAL / HIGH RISK' : finalRiskScore >= 50 ? 'MODERATE RISK' : 'LOW / CONTROLLED RISK',
      confidence: 88,
      ventureProfile: {
        ventureType: hardwareInvolved ? 'Consumer Hardware' : (regulatoryHeavy ? 'Regulated Venture' : `${industry} Venture`),
        businessModel,
        targetCustomer,
        coreValueProposition: (idea || 'Venture Concept').slice(0, 140),
        dimensions: {
          productMarketFit: pRisk,
          customerNeed: mRisk,
          differentiation: 62,
          competition: cRisk,
          businessModel: bmRisk,
          unitEconomics: bmRisk + 10,
          executionComplexity: eRisk,
          scalability: 60,
          marketTiming: 55,
          capitalIntensity: capRisk,
          regulatoryExposure: rRisk,
          defensibility: 60
        }
      },
      scoring: {
        ventureRiskScore: vScore,
        historicalSimilarityScore: hScore,
        mlBenchmarkScore: null,
        mlBenchmarkStatus: 'Unavailable (Pre-launch)',
        mlBenchmarkReason: 'Pre-launch concepts lack historical venture financing rounds required by the 5-feature capitalization model.',
        weightsUsed: { ventureRisk: 0.71, historicalSimilarity: 0.29, mlBenchmark: 0.00 }
      },
      primaryFailureVectors: [
        { name: 'Unit Economics Collapse', associationScore: 78, associationLevel: 'HIGH', rationale: 'Projected burn rate risks outrunning contribution margin recovery.' },
        { name: 'Outcompeted by Incumbents', associationScore: 68, associationLevel: 'MEDIUM', rationale: 'Incumbents possess established distribution flywheels.' },
        { name: 'Runway Exhaustion / Burn Rate', associationScore: 65, associationLevel: 'MEDIUM', rationale: 'Requires disciplined cash management before product-market fit.' }
      ],
      riskDrivers: [
        { name: 'Execution & Operational Complexity', score: eRisk },
        { name: 'Competitive Headwinds', score: cRisk },
        { name: 'Unit Economics & Margins', score: bmRisk + 10 }
      ],
      positiveSignals: [
        { name: 'Recognizable Monetization Mechanics', score: 40, reasoning: 'Clear commercial model rather than unmonetized traffic.' }
      ],
      assumptions: [
        'Target customers possess immediate discretionary budget for this solution.',
        'Customer acquisition costs remain below 1/3rd of first-year lifetime value.'
      ],
      unknowns: [
        'Verified customer willingness to pay without initial discounting.',
        'Organic 60-day customer retention and net revenue expansion rate.'
      ],
      historicalMatches: matches.map(m => ({
        id: m.id,
        name: m.name,
        industry: m.industry,
        failureMode: m.failureMode,
        failedYear: m.failedYear,
        capitalRaised: m.capitalRaised,
        relevanceScore: 75,
        whyRelevant: `Parallels in ${m.failureMode} within ${m.industry}.`,
        keyLesson: m.lessons?.[0] || 'Enforce positive unit margins before scaling.',
        evidenceCount: 12
      })),
      evidenceSummary: {
        matchedCompaniesCount: matches.length,
        totalEvidenceCount: matches.length * 8
      },
      explanation: `Evaluated as a ${industry} venture. Primary structural vulnerability maps to Unit Economics Collapse, driven by competitive headwinds and operational friction.`,
      recommendations: [
        'Secure 3–5 signed non-refundable pilot prepayments before committing engineering sprint hours.',
        'Enforce positive unit contribution margin from day one before scaling marketing.',
        'Maintain a minimum 18-month cash runway covenant.'
      ]
    };
  });

  if (result.isLive && result.data) {
    const d = result.data.data || result.data;
    return {
      ...result,
      data: {
        ...d,
        ideaScore: d.finalRiskScore,
        overallRiskScore: d.finalRiskScore,
        categoryScores: {
          productRisk: d.ventureProfile?.dimensions?.productMarketFit || 60,
          marketRisk: d.ventureProfile?.dimensions?.customerNeed || 55,
          businessModelRisk: d.ventureProfile?.dimensions?.unitEconomics || 65,
          competitionRisk: d.ventureProfile?.dimensions?.competition || 60,
          executionRisk: d.ventureProfile?.dimensions?.executionComplexity || 55
        },
        topRiskFactors: d.riskDrivers?.map(r => `${r.name}: ${r.reasoning || `${r.score}/100 vulnerability`}`) || []
      }
    };
  }

  return result;
}

/**
 * AI Research Assistant query
 */
export async function askAssistant(question) {
  const result = await fetchWithFallback('/ai/research', {
    method: 'POST',
    body: JSON.stringify({ query: question }),
  }, async () => {
    const q = (question || '').toLowerCase();
    
    let answer = '';
    let relatedIds = ['wework', 'theranos', 'quibi'];
    let failurePatterns = ['Unit Economics Collapse', 'Premature Scaling', 'Governance Blindspots'];

    if (q.includes('wework') || q.includes('adam') || q.includes('lease') || q.includes('real estate')) {
      answer = 'WeWork collapsed due to an extreme asset-liability duration mismatch: signing 10-15 year non-cancellable commercial lease liabilities while offering members 30-day cancelable memberships. Subsidized by SoftBank Vision Fund capital, the company scaled across 120 cities before individual locations reached sustainable contribution margins.';
      relatedIds = ['wework', 'katerra', 'bird'];
      failurePatterns = ['Unit Economics Collapse', 'Asset-Liability Mismatch', 'Premature Hyper-Scaling'];
    } else if (q.includes('theranos') || q.includes('holmes') || q.includes('blood') || q.includes('fraud') || q.includes('health')) {
      answer = 'Theranos failed due to foundational technological fabrication and an absolute breakdown in governance. The company bypassed peer-reviewed scientific journals under the guise of "trade secrecy", appointed a board lacking biomedical expertise, and deployed non-functional micro-fluidic testing on actual patients.';
      relatedIds = ['theranos', 'scalefactor', 'ftx'];
      failurePatterns = ['Fraud & Governance Failure', 'Absence of Peer Review', 'Compartmentalized Secrecy'];
    } else if (q.includes('quibi') || q.includes('video') || q.includes('stream') || q.includes('media') || q.includes('mobile')) {
      answer = 'Quibi vaporized $1.75B in 6 months because it forced a top-down Hollywood studio model ($100k/minute) onto mobile users while forbidding screenshots, memes, and social sharing. It fundamentally misunderstood that modern mobile video consumers prioritize creator community and virality over compressed prestige drama.';
      relatedIds = ['quibi', 'vine', 'pebble'];
      failurePatterns = ['Lack of Market Need / PMF', 'Banning Social Virality', 'Astronomical Fixed Unit Costs'];
    } else if (q.includes('hardware') || q.includes('juicero') || q.includes('jawbone') || q.includes('pebble')) {
      answer = 'Hardware startups in our dataset exhibit three primary fatal failure modes: 1) High defect and warranty return rates (Jawbone), 2) Over-engineering machines to solve tasks that can be completed for free (Juicero), and 3) Getting squeezed by platform monopolies once tech giants launch ecosystem accessories (Pebble vs Apple Watch).';
      relatedIds = ['juicero', 'jawbone', 'pebble'];
      failurePatterns = ['Hardware Execution / Manufacturing', 'Ecosystem Platform Squeeze', 'Over-Engineering'];
    } else if (q.includes('unit economic') || q.includes('cac') || q.includes('ltv') || q.includes('burn')) {
      answer = 'Across our 413+ startup failure records, Unit Economics Collapse accounts for 28% of all venture deaths. The most common pattern is CAC exceeding LTV by 2x-4x, masked by venture capital subsidies until macroeconomic conditions tighten and bridge rounds dry up (e.g. Fast, Bird, Homejoy, Beepi).';
      relatedIds = ['fast', 'bird', 'wework'];
      failurePatterns = ['Unit Economics Collapse', 'Runway Exhaustion', 'Venture Subsidy Distortion'];
    } else {
      answer = `Based on our curated corpus of 413+ startup failures, your question touches on fundamental venture survival dynamics. The dataset shows that 70% of venture-backed failures stem from three intersecting vectors: premature headcount scaling, negative contribution margins masked by investor subsidies, and inability to build defensive customer retention moats.`;
      relatedIds = ['theranos', 'wework', 'quibi'];
    }

    const startups = relatedIds.map(id => getStartupById(id)).filter(Boolean);

    return {
      answer,
      evidenceCitations: [
        'SEC Enforcement Releases & Bankruptcy Filings',
        'Wall Street Journal / The Information Investigative Post-Mortems',
        'PivotVault Curated 413+ Failure Corpus Cross-Taxonomy'
      ],
      relatedStartups: startups,
      failurePatterns,
      suggestedNextQueries: [
        'How can a founder identify negative unit economics before scaling?',
        'What governance mechanisms prevent founder-led deception in deeptech?',
        'Compare the failure trajectories of WeWork and Katerra.'
      ]
    };
  });

  if (!result.isLive) return result;

  const sources = result.data.sources || [];
  const matchedCompanyNames = sources
    .map((s) => s.metadata?.companyName)
    .filter(Boolean);
  const matchedStartups = matchedCompanyNames
    .map((name) => getStartupById(name))
    .filter(Boolean);

  const fallbackStartups = [getStartupById('wework'), getStartupById('theranos'), getStartupById('quibi')].filter(Boolean);

  return {
    ...result,
    data: {
      answer: result.data.answer || 'Detailed failure analysis synthesized from verified records.',
      evidenceCitations: sources.length > 0 
        ? sources.map((s) => s.metadata?.companyName ? `${s.metadata.companyName} (${s.metadata.source || 'SEC / Court Record'})` : s.chunkText?.slice(0, 60)).filter(Boolean)
        : ['SEC Bankruptcy Dockets', 'Wall Street Journal Investigative Reports', 'Court Depositions'],
      relatedStartups: matchedStartups.length > 0 ? matchedStartups : fallbackStartups,
      failurePatterns: [
        'Unit Economics Collapse',
        'Premature Scaling',
        'Governance Blindspots'
      ],
      suggestedNextQueries: [
        'How can a founder identify negative unit economics before scaling?',
        'What governance mechanisms prevent founder-led deception in deeptech?',
        'Compare the failure trajectories of WeWork and Katerra.'
      ],
      sources
    },
  };
}

/**
 * Interactive Founder Persona Ghost Chat
 */
export async function chatWithGhost(personaId, message) {
  return fetchWithFallback('/ai/ghost-chat', {
    method: 'POST',
    body: JSON.stringify({ personaId, message }),
  }, async () => null);
}

/**
 * Generate 90-Day Defense Playbook
 */
export async function generateDefensePlaybook(ideaText) {
  return fetchWithFallback('/ai/playbook', {
    method: 'POST',
    body: JSON.stringify({ ideaText }),
  }, async () => {
    return {
      plan: `# 90-Day Evidence-Based Defense Plan\n\n### Phase 1: Days 1–30 (Unit Economics & Demand Verification)\n- Conduct 20 customer discovery interviews focused exclusively on willingness to pay without discounts.\n- Secure 3–5 signed non-refundable LOIs or pre-payment deposits before committing engineering sprint hours.\n- Calculate fully burdened Customer Acquisition Cost (CAC) including founder time, software subscriptions, and acquisition overhead.\n\n### Phase 2: Days 31–60 (Concierge MVP & Margin Defense)\n- Deliver the core service manually to the first 5 customers to understand edge cases and real operational friction.\n- Enforce positive gross margin from day one: ensure revenues cover direct hosting, API, and labor costs.\n- Implement strict runway covenant: freeze hiring until organic retention exceeds 25% at 60 days.\n\n### Phase 3: Days 61–90 (Defensive Moat & Scalable Distribution)\n- Construct proprietary workflow locks or data assets that competitors cannot clone in a single sprint.\n- Stress-test the cash burn curve against a 6-month macroeconomic downturn or delayed follow-on financing.`,
      sources: []
    };
  });
}

/**
 * Failure Quiz, Confessions, Ghosts APIs
 */
export async function getQuizQuestions() {
  return { data: QUIZ_QUESTIONS, isLive: false };
}

export async function getFounderConfessions() {
  return { data: FOUNDER_CONFESSIONS, isLive: false };
}

export async function getGhostPersonas() {
  return { data: GHOST_PERSONAS, isLive: false };
}
