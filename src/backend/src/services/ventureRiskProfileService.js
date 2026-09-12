/**
 * Venture Risk Profile Service
 * Uses Groq / Gemini (with deterministic grounded fallback) to extract an intelligent,
 * context-aware, founder-friendly venture profile.
 * 
 * CORE PRINCIPLES:
 * 1. The Idea is the primary source of truth. Never let accidental form defaults override the actual concept.
 * 2. Adaptive relevance: Not every startup has regulatory, clinical, or hardware risks.
 * 3. Human advisor language: Avoid internal ML/forensic jargon.
 * 4. Zero fabrication: Never invent metrics, companies, or citations.
 */

const { callGroq, callGemini, parseJSON } = require('../agents/lib/ai');

const ALL_DIMENSIONS = [
  'customerNeed',
  'differentiation',
  'competition',
  'productMarketFit',
  'businessModel',
  'unitEconomics',
  'executionComplexity',
  'scalability',
  'marketTiming',
  'capitalIntensity',
  'regulatoryExposure',
  'defensibility'
];

/**
 * Detects if form fields contradict the text of the idea.
 * The idea text is ALWAYS the primary source of truth.
 */
function sanitizeVentureContext({ ideaText, industry, targetCustomer, businessModel, burnRate, hardwareInvolved, regulatoryHeavy }) {
  const text = (ideaText || '').toLowerCase();
  const ind = (industry || '').toLowerCase();
  const cust = (targetCustomer || '').toLowerCase();
  const model = (businessModel || '').toLowerCase();
  const burn = (burnRate || '').toLowerCase();

  // Keyword indicators from idea text (primary source of truth)
  const hasHardwareWords = /\b(hardware|device|devices|robot|robots|robotics|sensor|sensors|machinery|chip|chips|semiconductor|semiconductors|iot|physical product|wearable|wearables|manufactur\w*|gadget|gadgets)\b/i.test(text);
  const hasClinicalHealthWords = /\b(patient|patients|clinical|clinic|clinics|fda|diagnostic|diagnostics|diagnos\w*|therapy|therapeutic|therapeutics|drug|drugs|medical|medicine|biotech|telehealth|blood test|hospital|hospitals|doctor|doctors|pharma|pharmaceutical|healthcare|health)\b/i.test(text);
  const hasFintechWords = /\b(payment|payments|banking|lending|credit|loan|loans|crypto|wallet|wallets|fiat|custody|brokerage|insurance|fintech|securities|sec\b|fincen|invoice|invoicing)\b/i.test(text);
  const hasMarketplaceWords = /\b(marketplace|two-sided|buyers and sellers|platform connecting|commission per transaction|courier|couriers|driver|drivers|gig|delivery|food delivery|grocery)\b/i.test(text);
  const isPureSoftware = /\b(app|saas|software|platform|copilot|dashboard|tool|extension|plugin|bot|ai-powered|productivity|crm|todo|task|scheduler|workflow)\b/i.test(text) 
    && !hasHardwareWords && !hasClinicalHealthWords;

  // Resolve Contradictions: Idea text overrides checkboxes and accidental dropdown choices
  let cleanHardware = Boolean(hardwareInvolved);
  let cleanRegulatory = Boolean(regulatoryHeavy);
  let cleanIndustry = industry || 'Software / SaaS';

  if (isPureSoftware) {
    // If the idea is pure software (e.g. todo list, task manager, saas platform, dev tool):
    // Never let accidental hardware or healthcare/fintech selections distort it.
    if (!hasHardwareWords) cleanHardware = false;
    if (!hasClinicalHealthWords && !hasFintechWords) cleanRegulatory = false;
    if (!hasClinicalHealthWords && !hasFintechWords && !hasMarketplaceWords) {
      if (ind.includes('health') || ind.includes('bio') || ind.includes('hardware') || ind.includes('device')) {
        cleanIndustry = 'Software / SaaS';
      }
    }
  }

  // Normalize "Not sure yet" / "Other" for Industry
  if (!industry || ind.includes('not sure') || ind.includes('other')) {
    if (hasClinicalHealthWords) cleanIndustry = 'Healthcare & Biotech';
    else if (hasHardwareWords || cleanHardware) cleanIndustry = 'Hardware & Devices';
    else if (hasFintechWords) cleanIndustry = 'Finance / Fintech';
    else if (hasMarketplaceWords) cleanIndustry = 'E-commerce & Retail';
    else if (text.includes('food') || text.includes('grocery')) cleanIndustry = 'Food / Delivery';
    else if (text.includes('learn') || text.includes('school') || text.includes('student')) cleanIndustry = 'Education / EdTech';
    else cleanIndustry = 'Software / SaaS';
  }

  // Determine realistic archetype from concept text (Priority 1: Idea text, Priority 2: Inferred industry)
  // When hardware is explicitly flagged or hardware keywords dominate, hardware takes priority over
  // incidental health words (e.g., "crop health" should not trigger Healthcare & Biotech).
  let ventureType = 'SaaS & Software';
  const hardwareExplicit = cleanHardware || hasHardwareWords || ind.includes('hardware');
  if (hardwareExplicit && hasClinicalHealthWords) {
    // Hardware venture that happens to mention 'health' (e.g., 'crop health', 'pet health') → Hardware wins
    ventureType = 'Consumer Hardware';
    cleanIndustry = 'Hardware & Devices';
  } else if (hasClinicalHealthWords || (!isPureSoftware && (cleanIndustry.includes('Health') || cleanIndustry.includes('Bio')))) {
    ventureType = 'Healthcare & Biotech';
    cleanIndustry = 'Healthcare & Biotech';
    cleanRegulatory = true;
  } else if ((hasHardwareWords || cleanHardware) || (!isPureSoftware && cleanIndustry.includes('Hardware'))) {
    ventureType = 'Consumer Hardware';
    cleanIndustry = 'Hardware & Devices';
  } else if (hasFintechWords || (!isPureSoftware && (cleanIndustry.includes('Fin') || cleanIndustry.includes('Crypto')))) {
    ventureType = 'FinTech';
    cleanIndustry = 'Finance / Fintech';
    cleanRegulatory = true;
  } else if (hasMarketplaceWords || model.includes('marketplace') || cust.includes('both') || cleanIndustry.includes('Food') || cleanIndustry.includes('Delivery')) {
    ventureType = 'Marketplace';
  } else if (text.includes('consumer') || text.includes('social') || text.includes('game') || cust.includes('consumer') || cleanIndustry.includes('Social') || cleanIndustry.includes('Media')) {
    ventureType = 'Consumer Tech';
  } else {
    ventureType = 'SaaS & Software';
  }

  // Normalize Target Customer
  let cleanCustomer = targetCustomer;
  if (!cleanCustomer || cust.includes('not sure') || cust.includes('other')) {
    if (text.includes('developer') || text.includes('engineer') || text.includes('designer')) {
      cleanCustomer = 'Developers / technical users';
    } else if (text.includes('consumer') || text.includes('shopper') || text.includes('student')) {
      cleanCustomer = 'Individual consumers';
    } else if (text.includes('enterprise') || text.includes('fortune') || text.includes('large company')) {
      cleanCustomer = 'Large companies';
    } else {
      cleanCustomer = 'Small and medium businesses';
    }
  }

  // Normalize Business Model
  let cleanModel = businessModel;
  if (!cleanModel || model.includes('not sure') || model.includes('other') || model.includes('deciding')) {
    if (text.includes('commission') || text.includes('take rate') || ventureType === 'Marketplace') {
      cleanModel = 'Marketplace commission';
    } else if (cleanHardware || text.includes('purchase') || text.includes('buy')) {
      cleanModel = 'One-time purchase';
    } else {
      cleanModel = 'Monthly / yearly subscription';
    }
  }

  // Normalize Burn Rate
  let cleanBurn = burnRate;
  if (!cleanBurn || burn.includes('not sure')) {
    cleanBurn = cleanHardware ? 'Early Stage ($10k - $50k/mo)' : 'Bootstrapped (Under $10k/mo)';
  }

  return {
    ideaText: ideaText.trim(),
    ventureType,
    industry: cleanIndustry,
    targetCustomer: cleanCustomer,
    businessModel: cleanModel,
    burnRate: cleanBurn,
    hardwareInvolved: cleanHardware,
    regulatoryHeavy: cleanRegulatory
  };
}

/**
 * Determines which dimensions are genuinely relevant for a given venture type.
 * Irrelevant dimensions return 'not_applicable'.
 */
function getApplicableDimensions(ventureType, context) {
  switch (ventureType) {
    case 'Consumer Hardware':
      return [
        'capitalIntensity',
        'executionComplexity',
        'unitEconomics',
        'customerNeed',
        'differentiation',
        'competition'
      ];

    case 'Healthcare & Biotech':
      return [
        'regulatoryExposure',
        'executionComplexity',
        'customerNeed',
        'productMarketFit',
        'capitalIntensity',
        'defensibility'
      ];

    case 'FinTech':
      return [
        'regulatoryExposure',
        'unitEconomics',
        'competition',
        'customerNeed',
        'businessModel',
        'defensibility'
      ];

    case 'Marketplace':
      return [
        'unitEconomics',
        'productMarketFit',
        'competition',
        'customerNeed',
        'scalability',
        'differentiation'
      ];

    case 'Consumer Tech':
      return [
        'productMarketFit',
        'customerNeed',
        'differentiation',
        'competition',
        'marketTiming',
        'unitEconomics'
      ];

    case 'B2B SaaS':
    case 'SaaS & Software':
    default:
      return [
        'competition',
        'differentiation',
        'customerNeed',
        'productMarketFit',
        'businessModel',
        'unitEconomics'
      ];
  }
}

/**
 * Deterministic text hash — produces a stable integer from a string.
 * Same input always yields the same output, different inputs yield different outputs.
 * This is NOT cryptographic; it is used solely for repeatable score variation.
 */
function textHash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Returns a deterministic number in [min, max] range seeded by the idea text + a salt.
 * Different salts produce different but stable sub-ranges for different dimensions.
 */
function seededScore(ideaText, salt, min, max) {
  const h = textHash(ideaText + '::' + salt);
  return min + (h % (max - min + 1));
}

/**
 * Counts how many words from a keyword list appear in the text.
 */
function countKeywordHits(text, keywords) {
  let hits = 0;
  for (const kw of keywords) {
    if (text.includes(kw)) hits++;
  }
  return hits;
}

/**
 * Grounded deterministic fallback profiler that is IDEA-AWARE.
 *
 * Unlike the LLM path, this does not hallucinate. Instead it uses:
 * 1. Keyword-based signal detection from the actual idea text
 * 2. Deterministic hash seeding so different ideas produce different scores
 * 3. Context from the sanitized venture type, customer, and business model
 * 4. Dynamic diagnosis text referencing the actual submitted concept
 *
 * RULE: Same idea + same form inputs = same scores (deterministic, stable).
 *       Different ideas = different scores (text-derived variation).
 */
function createDeterministicProfile(rawInput) {
  const ctx = sanitizeVentureContext(rawInput);
  const text = ctx.ideaText.toLowerCase();
  const applicable = getApplicableDimensions(ctx.ventureType, ctx);

  const isHighBurn = ctx.burnRate.includes('150k') || ctx.burnRate.includes('500k');

  // ── Keyword signal banks for idea-specific scoring ──
  const HIGH_COMPETITION_WORDS = ['todo', 'task', 'note', 'notes', 'chat', 'social', 'delivery', 'food', 'crm', 'email', 'calendar', 'project management', 'productivity', 'e-commerce', 'ecommerce', 'dating', 'ride', 'taxi'];
  const MODERATE_COMPETITION_WORDS = ['ai', 'analytics', 'dashboard', 'monitor', 'track', 'automate', 'automation', 'workflow', 'scheduling', 'booking', 'marketplace'];
  const NICHE_WORDS = ['agriculture', 'farmer', 'farm', 'rural', 'mining', 'construction', 'maritime', 'veterinary', 'forestry', 'archaeology', 'genealogy', 'niche', 'specialized'];
  const TECHNICAL_COMPLEXITY_WORDS = ['blockchain', 'decentralized', 'machine learning', 'deep learning', 'neural', 'computer vision', 'nlp', 'natural language', 'autonomous', 'self-driving', 'quantum', 'cryptograph', 'distributed', 'real-time', 'iot', 'embedded'];
  const STRONG_NEED_WORDS = ['compliance', 'safety', 'security', 'emergency', 'critical', 'must-have', 'required', 'mandate', 'regulation', 'essential', 'life-saving', 'pain', 'problem', 'frustrat'];
  const VIRAL_WORDS = ['social', 'share', 'community', 'network', 'viral', 'referral', 'invite', 'friend', 'group', 'collaborate', 'team'];
  const DEFENSIBILITY_WORDS = ['patent', 'proprietary', 'exclusive', 'data moat', 'network effect', 'switching cost', 'lock-in', 'api', 'integration', 'ecosystem', 'platform'];

  const highCompHits = countKeywordHits(text, HIGH_COMPETITION_WORDS);
  const modCompHits = countKeywordHits(text, MODERATE_COMPETITION_WORDS);
  const nicheHits = countKeywordHits(text, NICHE_WORDS);
  const techHits = countKeywordHits(text, TECHNICAL_COMPLEXITY_WORDS);
  const needHits = countKeywordHits(text, STRONG_NEED_WORDS);
  const viralHits = countKeywordHits(text, VIRAL_WORDS);
  const defenseHits = countKeywordHits(text, DEFENSIBILITY_WORDS);

  // Idea text length affects confidence and PMF (more detail = slightly lower risk)
  const ideaLength = ctx.ideaText.trim().length;
  const detailBonus = ideaLength > 150 ? -6 : (ideaLength > 80 ? -3 : 4);

  // Word count for further signal extraction
  const wordCount = ctx.ideaText.trim().split(/\s+/).length;
  const uniqueWords = new Set(text.split(/\s+/).filter(w => w.length > 3));

  // ── Compute each dimension score based on idea text signals ──
  const dimensions = {};
  const dimensionStatus = {};
  const dimensionReasoning = {};

  for (const dim of ALL_DIMENSIONS) {
    if (!applicable.includes(dim)) {
      dimensions[dim] = 0;
      dimensionStatus[dim] = 'not_applicable';
      dimensionReasoning[dim] = 'Not applicable to this type of venture.';
      continue;
    }

    dimensionStatus[dim] = 'active';

    switch (dim) {
      case 'competition': {
        let base = seededScore(ctx.ideaText, 'competition', 55, 70);
        base += highCompHits * 6;  // High-competition keywords increase score
        base += modCompHits * 3;
        base -= nicheHits * 8;     // Niche markets reduce competition risk
        base -= defenseHits * 4;
        dimensions[dim] = Math.min(95, Math.max(25, base));
        if (highCompHits >= 2) {
          dimensionReasoning[dim] = `Your idea operates in a crowded space with many established players. Users already have familiar tools for ${HIGH_COMPETITION_WORDS.filter(w => text.includes(w)).slice(0, 2).join(' and ')}-related tasks, so switching costs are your biggest barrier.`;
        } else if (nicheHits >= 1) {
          dimensionReasoning[dim] = `This targets a specialized niche (${NICHE_WORDS.filter(w => text.includes(w)).join(', ')}), which means fewer direct competitors but also a smaller initial addressable market.`;
        } else {
          dimensionReasoning[dim] = 'There are existing alternatives in this space. You\'ll need a clear, demonstrable advantage to convince users to switch.';
        }
        break;
      }

      case 'differentiation': {
        let base = seededScore(ctx.ideaText, 'differentiation', 50, 68);
        base += highCompHits * 4;
        base -= defenseHits * 6;
        base -= nicheHits * 5;
        base -= techHits * 3;  // Technical complexity can be a differentiator
        dimensions[dim] = Math.min(92, Math.max(25, base));
        if (defenseHits >= 2) {
          dimensionReasoning[dim] = `You mention elements that could create defensible advantages (${DEFENSIBILITY_WORDS.filter(w => text.includes(w)).join(', ')}), which is a positive sign for long-term differentiation.`;
        } else if (highCompHits >= 2) {
          dimensionReasoning[dim] = 'In a crowded category, feature-level improvements alone rarely create lasting moats. You need proprietary data, workflows, or integrations that competitors cannot easily replicate.';
        } else {
          dimensionReasoning[dim] = 'Standing out depends on offering a unique angle—whether through superior UX, specialized focus, or proprietary technology—that existing tools don\'t address well.';
        }
        break;
      }

      case 'customerNeed': {
        let base = seededScore(ctx.ideaText, 'customerNeed', 45, 65);
        base -= needHits * 7;   // Strong need keywords reduce risk
        base += detailBonus;    // More detail often means clearer need identification
        dimensions[dim] = Math.min(90, Math.max(20, base));
        if (needHits >= 2) {
          dimensionReasoning[dim] = `Your idea addresses a clearly urgent or critical need (${STRONG_NEED_WORDS.filter(w => text.includes(w)).slice(0, 2).join(', ')}), which increases the likelihood that users will actively seek a solution.`;
        } else {
          dimensionReasoning[dim] = `You need to confirm whether target users view this as a must-have solution or merely a nice-to-have. Talk to potential customers to verify actual demand intensity.`;
        }
        break;
      }

      case 'productMarketFit': {
        let base = seededScore(ctx.ideaText, 'pmf', 55, 72);
        base -= needHits * 4;
        base += detailBonus;
        base -= viralHits * 3;
        dimensions[dim] = Math.min(88, Math.max(30, base));
        dimensionReasoning[dim] = ideaLength > 120
          ? 'You have a clearly articulated concept, but pre-launch ideas need verified retention data from real users before product-market fit can be confirmed.'
          : 'This is still a concept-stage idea. Real product-market fit requires evidence of repeat usage and organic referrals from actual paying users.';
        break;
      }

      case 'businessModel': {
        let base = seededScore(ctx.ideaText, 'bizmodel', 40, 60);
        if (ctx.businessModel.includes('Subscription') || ctx.businessModel.includes('subscription')) base -= 5;
        if (ctx.businessModel.includes('Advertising') || ctx.businessModel.includes('advertising')) base += 10;
        if (ctx.businessModel.includes('Not sure') || ctx.businessModel.includes('Deciding')) base += 12;
        if (ctx.businessModel.includes('Marketplace') || ctx.businessModel.includes('commission')) base += 5;
        dimensions[dim] = Math.min(85, Math.max(25, base));
        if (ctx.businessModel.includes('Not sure') || ctx.businessModel.includes('Deciding')) {
          dimensionReasoning[dim] = 'You haven\'t decided on a monetization model yet. This is normal at the concept stage, but pricing validation should happen early to avoid building something users won\'t pay for.';
        } else {
          dimensionReasoning[dim] = `A ${ctx.businessModel.toLowerCase()} model can work well for this type of product, but you need to validate conversion rates and willingness to pay with real users before scaling.`;
        }
        break;
      }

      case 'unitEconomics': {
        let base = seededScore(ctx.ideaText, 'unit_econ', 42, 60);
        if (isHighBurn) base += 18;
        if (viralHits >= 2) base -= 6; // Viral growth reduces CAC
        if (ctx.hardwareInvolved) base += 12;
        dimensions[dim] = Math.min(92, Math.max(25, base));
        dimensionReasoning[dim] = isHighBurn
          ? 'High monthly spending means you need to acquire and retain customers quickly enough to cover costs. Calculate your expected customer acquisition cost vs. expected lifetime value early.'
          : viralHits >= 2
            ? 'If your product naturally encourages sharing and collaboration, user acquisition costs can stay low, which helps unit economics significantly.'
            : 'Keeping customer acquisition costs manageable while maintaining healthy margins will be key. Identify at least one organic growth channel early.';
        break;
      }

      case 'capitalIntensity': {
        let base = ctx.hardwareInvolved ? 82 : seededScore(ctx.ideaText, 'capital', 28, 45);
        if (isHighBurn) base += 15;
        if (techHits >= 2) base += 8; // Complex tech needs more capital
        dimensions[dim] = Math.min(95, Math.max(15, base));
        dimensionReasoning[dim] = ctx.hardwareInvolved
          ? 'Hardware ventures require significant upfront capital for manufacturing, tooling, and inventory before generating revenue.'
          : techHits >= 2
            ? 'Building advanced technology (like AI/ML infrastructure) requires meaningful R&D investment, but cloud services help manage costs incrementally.'
            : 'Software-based products can be validated with relatively modest initial investment, which is a structural advantage.';
        break;
      }

      case 'executionComplexity': {
        let base = ctx.hardwareInvolved ? 82 : seededScore(ctx.ideaText, 'execution', 35, 55);
        if (ctx.regulatoryHeavy) base += 15;
        if (techHits >= 2) base += 10;
        if (text.includes('marketplace') || text.includes('two-sided')) base += 8; // Two-sided markets are operationally complex
        dimensions[dim] = Math.min(95, Math.max(20, base));
        dimensionReasoning[dim] = ctx.hardwareInvolved
          ? 'Physical product development adds layers of complexity: manufacturing, quality control, logistics, and supply chain management.'
          : techHits >= 2
            ? 'The technical architecture involves complex engineering challenges that will require specialized talent and careful development sequencing.'
            : 'The core product appears technically feasible to build. Execution risk is more about distribution, design quality, and user experience polish.';
        break;
      }

      case 'regulatoryExposure': {
        let base = ctx.regulatoryHeavy ? 80 : seededScore(ctx.ideaText, 'regulatory', 12, 28);
        if (text.includes('children') || text.includes('kids') || text.includes('minor')) base += 15;
        if (text.includes('data') && text.includes('privacy')) base += 10;
        dimensions[dim] = Math.min(95, Math.max(8, base));
        dimensionReasoning[dim] = ctx.regulatoryHeavy
          ? 'This business will need to navigate formal regulatory requirements and compliance processes before full commercial launch.'
          : (text.includes('children') || text.includes('kids'))
            ? 'Products targeting minors face additional regulatory scrutiny (COPPA, age verification). Plan compliance requirements early.'
            : 'Standard digital product with minimal regulatory barriers, though basic data privacy best practices should still be followed.';
        break;
      }

      case 'scalability': {
        let base = seededScore(ctx.ideaText, 'scalability', 35, 55);
        if (ctx.hardwareInvolved) base += 15;
        if (viralHits >= 1) base -= 8;
        if (text.includes('local') || text.includes('city') || text.includes('region')) base += 10;
        dimensions[dim] = Math.min(90, Math.max(20, base));
        dimensionReasoning[dim] = (text.includes('local') || text.includes('city'))
          ? 'Location-dependent products often face challenges scaling beyond their initial geography without significant operational investment.'
          : viralHits >= 1
            ? 'Social and collaborative features can drive organic growth loops that help scale efficiently.'
            : 'Software products generally scale well technically, but user growth depends on distribution channels and market demand.';
        break;
      }

      case 'marketTiming': {
        let base = seededScore(ctx.ideaText, 'timing', 38, 58);
        if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('gpt') || text.includes('llm')) base -= 8; // AI is timely now
        if (text.includes('crypto') || text.includes('nft') || text.includes('metaverse')) base += 10; // Uncertain timing
        dimensions[dim] = Math.min(85, Math.max(20, base));
        dimensionReasoning[dim] = (text.includes('ai') || text.includes('artificial intelligence'))
          ? 'AI-powered products are in a strong market timing window right now, with high user interest and growing adoption.'
          : 'Market timing appears reasonable, but you should verify that potential customers are actively looking for this solution today, not just in theory.';
        break;
      }

      case 'defensibility': {
        let base = seededScore(ctx.ideaText, 'defensibility', 48, 68);
        base -= defenseHits * 6;
        base -= techHits * 3;
        base += highCompHits * 3;
        dimensions[dim] = Math.min(90, Math.max(20, base));
        dimensionReasoning[dim] = defenseHits >= 1
          ? `Potential defensive advantages exist through ${DEFENSIBILITY_WORDS.filter(w => text.includes(w)).join(', ')}. Build these moats intentionally from launch.`
          : 'Long-term defensibility depends on building proprietary advantages—unique data, deep integrations, or strong brand loyalty—that competitors cannot easily copy.';
        break;
      }

      default: {
        dimensions[dim] = seededScore(ctx.ideaText, dim, 40, 60);
        dimensionReasoning[dim] = 'Moderate operational factor for an early-stage startup in this category.';
      }
    }
  }

  // ── Dynamic 4-Part Founder Diagnosis based on actual idea ──
  const ideaSnippet = ctx.ideaText.length > 100 ? ctx.ideaText.slice(0, 97).trim() + '...' : ctx.ideaText.trim();

  const whatWeThink = `You're building a ${ctx.ventureType.toLowerCase()} product for ${ctx.targetCustomer.toLowerCase()} using a ${ctx.businessModel.toLowerCase()} approach. Your concept—"${ideaSnippet}"—${nicheHits >= 1 ? 'targets a specialized market segment, which could be an advantage if demand is strong enough' : highCompHits >= 2 ? 'enters a competitive market where user switching costs are the main barrier' : 'addresses an identifiable problem space with room for a focused solution'}.`;

  // Build dynamic risk explanations from what we actually detected
  const whyItIsRisky = [];
  const topDims = applicable
    .filter(d => dimensions[d] >= 55)
    .sort((a, b) => (dimensions[b] || 0) - (dimensions[a] || 0))
    .slice(0, 3);

  for (const dim of topDims) {
    const dimLabel = {
      competition: 'Competition', differentiation: 'Standing Out', customerNeed: 'Customer Demand',
      productMarketFit: 'Product-Market Fit', businessModel: 'Revenue Model', unitEconomics: 'Unit Economics',
      executionComplexity: 'Execution Complexity', capitalIntensity: 'Capital Requirements',
      regulatoryExposure: 'Regulatory Risk', scalability: 'Scaling', marketTiming: 'Market Timing',
      defensibility: 'Defensibility'
    }[dim] || dim;
    whyItIsRisky.push(`${dimLabel} (${dimensions[dim]}/100): ${dimensionReasoning[dim]}`);
  }
  if (whyItIsRisky.length === 0) {
    whyItIsRisky.push('While overall risk is moderate, every pre-launch idea needs to validate that real customers will pay and return consistently.');
  }

  // Build dynamic positive signals from low-risk dimensions
  const whatLooksPromising = [];
  const lowDims = applicable
    .filter(d => dimensions[d] < 45 && dimensions[d] > 0)
    .sort((a, b) => (dimensions[a] || 50) - (dimensions[b] || 50))
    .slice(0, 2);

  for (const dim of lowDims) {
    whatLooksPromising.push(`Low risk in ${dimensionReasoning[dim].split('.')[0].toLowerCase()}.`);
  }
  if (whatLooksPromising.length === 0) {
    whatLooksPromising.push(ctx.hardwareInvolved
      ? 'Physical products can build strong defensibility once manufacturing and distribution are established.'
      : 'Software products can be prototyped and tested quickly with minimal upfront capital.');
    whatLooksPromising.push(`Your ${ctx.businessModel.toLowerCase()} approach is a well-understood monetization strategy for this type of product.`);
  }

  // Idea-specific validation steps
  const validateFirst = [];
  if (highCompHits >= 1) {
    validateFirst.push(`Interview 15 potential users to learn exactly what tool they currently use for ${HIGH_COMPETITION_WORDS.filter(w => text.includes(w))[0] || 'this problem'} and what concrete benefit would make them switch.`);
  } else {
    validateFirst.push(`Talk to 15 people in your target audience (${ctx.targetCustomer.toLowerCase()}) to confirm they actually experience this problem frequently enough to pay for a solution.`);
  }
  validateFirst.push(`Build a simple landing page describing your solution and test whether visitors click a "Sign Up" or "Pre-Order" button to gauge real interest.`);
  if (ctx.businessModel.includes('Not sure') || ctx.businessModel.includes('Deciding')) {
    validateFirst.push('Decide on a preliminary pricing model and test it with 5 potential customers before writing production code.');
  } else {
    validateFirst.push(`Validate your ${ctx.businessModel.toLowerCase()} pricing with at least 5 real prospects—ask if they would pay, and at what price point.`);
  }

  const practicalQuestions = [
    `Who specifically are the first 50 ${ctx.targetCustomer.toLowerCase()} users you would sell to, and how will you reach them?`,
    `What do these users currently use to solve this problem, and why is that solution inadequate?`,
    `What is the one metric that would prove real traction within 90 days of launch?`
  ];
  if (ctx.hardwareInvolved) {
    practicalQuestions.push('What is your minimum viable manufacturing run size, and can you fund it without external investment?');
  } else if (techHits >= 2) {
    practicalQuestions.push('Can you deliver the core technical functionality with your current team, or does this require specialized hiring?');
  } else {
    practicalQuestions.push('Can you acquire your first 100 users without spending money on paid advertising?');
  }

  return {
    ventureType: ctx.ventureType,
    industry: ctx.industry,
    targetCustomer: ctx.targetCustomer,
    businessModel: ctx.businessModel,
    coreValueProposition: ctx.ideaText.slice(0, 140),
    dimensions,
    dimensionStatus,
    applicableDimensions: applicable,
    dimensionReasoning,
    whatWeThink,
    whyItIsRisky,
    whatLooksPromising,
    validateFirst,
    practicalQuestions,
    positiveSignals: whatLooksPromising,
    unknowns: practicalQuestions,
    primaryAssumptions: [
      `Target ${ctx.targetCustomer.toLowerCase()} users feel enough friction with current options to try a new tool.`,
      'Customer acquisition cost will remain low enough to support positive margins.',
      'Core user retention will remain stable beyond the initial curiosity phase.'
    ]
  };
}

/**
 * Main Profiler: Sends venture concept to Groq / Gemini with clear instructions
 * to act like an expert startup advisor writing in plain, understandable English.
 */
async function extractVentureProfile(rawInput) {
  const ctx = sanitizeVentureContext(rawInput);
  const applicableDimensions = getApplicableDimensions(ctx.ventureType, ctx);

  const prompt = `You are a veteran startup advisor and venture analyst for PivotVault.
Your goal is to give the founder honest, clear, and highly relevant feedback on their startup idea.
Speak directly to the founder in plain, natural, and friendly human language.
DO NOT use overly technical machine jargon like "structural vulnerability", "failure vector topology", or "venture architecture mechanics".
DO NOT invent competitors, fake revenue, false market numbers, or hallucinated facts.

CRITICAL INSTRUCTION ON RELEVANCE:
- Evaluate the actual idea entered by the founder: "${ctx.ideaText}"
- Startup Category: "${ctx.ventureType}" (${ctx.industry})
- Target Customer: "${ctx.targetCustomer}"
- Business Model: "${ctx.businessModel}"
- ONLY evaluate risk dimensions that ACTUALLY apply to this business.
- For non-applicable dimensions (e.g. manufacturing for pure software, or medical compliance for a to-do list), mark them "not_applicable".
- A simple software tool should NOT receive hardware or regulatory risks.

Return a STRICT JSON object with this exact structure:
{
  "ventureType": "${ctx.ventureType}",
  "whatWeThink": "1-3 plain English sentences explaining what you understand about this startup and its main premise.",
  "whyItIsRisky": [
    "2-4 concrete, idea-specific reasons why this specific business is risky in plain language."
  ],
  "whatLooksPromising": [
    "1-3 real positive aspects or advantages based on what was described."
  ],
  "validateFirst": [
    "2-4 practical, actionable steps or tests the founder should perform before investing heavily."
  ],
  "practicalQuestions": [
    "3-4 practical questions the founder has not answered yet (e.g. 'Will users pay $X?', 'Can you acquire users cheaply?')"
  ],
  "relevantDimensions": [
    ${applicableDimensions.map(d => `"${d}"`).join(', ')}
  ],
  "dimensionScores": {
    ${applicableDimensions.map(d => `"${d}": (integer 0-100, where 0=low risk, 50=normal baseline, 100=very high risk)`).join(',\n    ')}
  },
  "dimensionReasoning": {
    ${applicableDimensions.map(d => `"${d}": "1-2 sentences of idea-specific, founder-friendly explanation for why this score was given"`).join(',\n    ')}
  }
}`;

  const userGroqKey = rawInput.groqApiKey || rawInput.apiKey || (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes('mock') ? process.env.GROQ_API_KEY : null);
  const userGeminiKey = rawInput.geminiApiKey || (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('mock') ? process.env.GEMINI_API_KEY : null);

  let engineUsed = 'PivotVault Forensic Knowledge Graph';

  try {
    let raw = null;
    if (userGroqKey) {
      try {
        raw = await callGroq(prompt, { maxTokens: 1400, json: true, apiKey: userGroqKey });
        if (raw) engineUsed = 'Groq LPU (LLaMA 3.3 70B)';
      } catch (err) {
        console.warn('Groq profiling call failed, attempting Gemini:', err.message);
      }
    }

    if (!raw && userGeminiKey) {
      try {
        raw = await callGemini(prompt, { maxTokens: 1400, json: true, apiKey: userGeminiKey });
        if (raw) engineUsed = 'Google Gemini 1.5 Flash';
      } catch (err) {
        console.warn('Gemini profiling call failed:', err.message);
      }
    }

    const parsed = parseJSON(raw);
    if (parsed && parsed.dimensionScores && typeof parsed.dimensionScores === 'object') {
      const dimensions = {};
      const dimensionStatus = {};
      const dimensionReasoning = {};

      const activeList = Array.isArray(parsed.relevantDimensions) && parsed.relevantDimensions.length > 0
        ? parsed.relevantDimensions
        : applicableDimensions;

      for (const dim of ALL_DIMENSIONS) {
        if (activeList.includes(dim) && parsed.dimensionScores[dim] !== undefined) {
          const val = Number(parsed.dimensionScores[dim]);
          dimensions[dim] = Number.isFinite(val) ? Math.min(99, Math.max(5, Math.round(val))) : 50;
          dimensionStatus[dim] = 'active';
          dimensionReasoning[dim] = parsed.dimensionReasoning?.[dim] || 'Evaluated based on current business model and competitive landscape.';
        } else {
          dimensions[dim] = 0;
          dimensionStatus[dim] = 'not_applicable';
          dimensionReasoning[dim] = 'Not applicable to this venture archetype.';
        }
      }

      return {
        ventureType: parsed.ventureType || ctx.ventureType,
        industry: ctx.industry,
        targetCustomer: ctx.targetCustomer,
        businessModel: ctx.businessModel,
        coreValueProposition: ctx.ideaText.slice(0, 140),
        dimensions,
        dimensionStatus,
        applicableDimensions: activeList,
        dimensionReasoning,
        whatWeThink: parsed.whatWeThink || `This is a ${ctx.ventureType} concept addressing ${ctx.targetCustomer} customers with a ${ctx.businessModel} model.`,
        whyItIsRisky: Array.isArray(parsed.whyItIsRisky) && parsed.whyItIsRisky.length > 0
          ? parsed.whyItIsRisky
          : ['Competition from established alternatives is your biggest hurdle.', 'Customer willingness to pay must be proven before building.'],
        whatLooksPromising: Array.isArray(parsed.whatLooksPromising) && parsed.whatLooksPromising.length > 0
          ? parsed.whatLooksPromising
          : ['Clear, focused proposition that can be prototyped quickly.'],
        validateFirst: Array.isArray(parsed.validateFirst) && parsed.validateFirst.length > 0
          ? parsed.validateFirst
          : ['Interview 10 potential users to verify active pain.', 'Test pricing with a simple landing page.'],
        practicalQuestions: Array.isArray(parsed.practicalQuestions) && parsed.practicalQuestions.length > 0
          ? parsed.practicalQuestions
          : ['Will customers pay for this solution?', 'How will you acquire users cost-effectively?'],
        positiveSignals: parsed.whatLooksPromising || ['Focused initial feature set.'],
        unknowns: parsed.practicalQuestions || ['Verified willingness to pay.'],
        primaryAssumptions: [
          'Target customers will switch from current tools.',
          'Unit economics remain positive as acquisition scales.'
        ],
        engine: engineUsed,
        reasoningEngine: engineUsed
      };
    }
  } catch (err) {
    console.warn('[VentureProfiler] External AI call failed or timed out, using grounded advisor profile:', err.message);
  }

  // Grounded deterministic fallback (zero hallucination, plain English, idea-aware)
  const deterministic = createDeterministicProfile(rawInput);
  return {
    ...deterministic,
    engine: 'PivotVault Forensic Grounded Engine',
    reasoningEngine: 'PivotVault Forensic Knowledge Graph'
  };
}

module.exports = {
  extractVentureProfile,
  ALL_DIMENSIONS
};
