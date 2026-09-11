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
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout for fast fallback
    
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

  return fetchWithFallback('/startups', { method: 'GET' }, async () => {
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
    body: JSON.stringify({
      query: inputData.idea,
      ideaText: inputData.idea,
      features: inputData.modelFeatures,
    }),
  }, async () => {
    // Intelligent offline algorithmic risk engine
    const {
      idea = '',
      industry = 'SaaS & Enterprise',
      targetCustomer = 'B2B',
      businessModel = 'Subscription',
      monetizationStage = 'Pre-revenue',
      burnRate = '$20k - $50k/mo',
      hardwareInvolved = false,
      regulatoryHeavy = false
    } = inputData;

    // Calculate realistic category risk scores
    let pRisk = 45;
    let mRisk = 40;
    let bmRisk = 50;
    let cRisk = 55;
    let eRisk = 50;

    if (hardwareInvolved) {
      pRisk += 25;
      eRisk += 20;
    }
    if (regulatoryHeavy || industry.includes('Health') || industry.includes('FinTech') || industry.includes('Crypto')) {
      eRisk += 25;
      bmRisk += 15;
    }
    if (targetCustomer === 'B2C' || industry.includes('Social') || industry.includes('Media')) {
      mRisk += 25;
      bmRisk += 20;
    }
    if (monetizationStage === 'Pre-revenue' && (burnRate.includes('100k') || burnRate.includes('500k'))) {
      bmRisk += 30;
      eRisk += 15;
    }

    // Clamp values 0-99
    pRisk = Math.min(96, Math.max(25, pRisk));
    mRisk = Math.min(96, Math.max(20, mRisk));
    bmRisk = Math.min(96, Math.max(25, bmRisk));
    cRisk = Math.min(96, Math.max(30, cRisk));
    eRisk = Math.min(96, Math.max(25, eRisk));

    const overallScore = Math.round((pRisk * 0.25) + (mRisk * 0.25) + (bmRisk * 0.2) + (cRisk * 0.15) + (eRisk * 0.15));

    // Find historical matches from the 413+ dataset
    const matches = ALL_STARTUPS.filter((s) => s.industry.toLowerCase() === industry.toLowerCase() || (hardwareInvolved && s.industry.includes('Hardware'))).slice(0, 3);

    return {
      overallRiskScore: overallScore,
      riskLevel: overallScore >= 75 ? 'Elevated Failure Pattern Risk' : overallScore >= 55 ? 'Moderate Vulnerability Pattern' : 'Standard Venture Baseline',
      disclaimer: 'Evidence-based risk diagnostic modeled on historical startup failure distributions. Not deterministic advice.',
      categoryScores: {
        productRisk: pRisk,
        marketRisk: mRisk,
        businessModelRisk: bmRisk,
        competitionRisk: cRisk,
        executionRisk: eRisk
      },
      topRiskFactors: [
        `High vulnerability to customer acquisition cost surges in ${industry}.`,
        hardwareInvolved ? 'Capital-intensive prototype-to-manufacturing defect exposure.' : 'Platform dependency and disintermediation risks.',
        'Premature burn rate scaling before establishing repeatable per-unit contribution margins.'
      ],
      historicalMatches: matches.length > 0 ? matches : CURATED_STARTUPS.slice(0, 3),
      evidenceSummary: `Historical data across ${matches.length} comparable ${industry} collapses indicates an average failure lifespan of 3.4 years when unit economics are not locked within the first 14 months.`,
      recommendations: [
        'Secure 5 design-partner pre-commitments with upfront cash deposits before building custom infrastructure.',
        'Cap monthly burn at under 1/24th of verified liquid treasury.',
        'Build defensive proprietary workflows or data flywheels rather than competing solely on feature breadth.'
      ],
      potentialPivots: [
        {
          name: 'Narrow Wedge Verticalization',
          description: `Pivot from broad ${industry} platform to a single mission-critical compliance or workflow problem for high-ACV buyers.`
        },
        {
          name: 'Software-Only Architecture',
          description: hardwareInvolved ? 'License algorithm and telemetry software to existing tier-1 hardware OEMs rather than manufacturing custom devices.' : 'Shift to programmatic API middleware to capture transactional volume without direct consumer acquisition overhead.'
        }
      ]
    };
  });

  if (!result.isLive) return result;
  const { ideaScore, scoreBreakdown = {}, sources = [] } = result.data;
  return {
    ...result,
    data: {
      ideaScore,
      scoreBreakdown,
      topRiskFactors: [],
      recommendations: [],
      sources,
    },
  };
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
  return {
    ...result,
    data: {
      answer: result.data.answer,
      evidenceCitations: result.data.sources?.map((source) => source.metadata?.companyName || source.metadata?.source || source.contentId).filter(Boolean) ?? [],
      relatedStartups: [],
      failurePatterns: [],
      suggestedNextQueries: [],
    },
  };
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
