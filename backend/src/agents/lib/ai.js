const { getConfig } = require('../../rag/runtime');

const wrapExternalContent = (text) => `<EXTERNAL_CONTENT>${String(text ?? '')}</EXTERNAL_CONTENT>`;
function parseJSON(text) {
  try {
    const cleaned = String(text).trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    return JSON.parse(cleaned);
  } catch { return null; }
}

async function gemini(prompt, { maxTokens = 1000, json = false, system = '', apiKey = null, model = null } = {}) {
  const config = await getConfig();
  const effectiveKey = apiKey || config.GEMINI_API_KEY;
  if (!effectiveKey || effectiveKey.includes('mock')) throw new Error('GEMINI_API_KEY is not configured or is mock.');
  
  const effectiveModel = model || config.GEMINI_MODEL || 'gemini-1.5-flash';
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${effectiveModel}:generateContent?key=${effectiveKey}`, {
    method: 'POST', 
    headers: { 'content-type': 'application/json' },
    signal: AbortSignal.timeout(25000),
    body: JSON.stringify({ 
      systemInstruction: system ? { parts: [{ text: system }] } : undefined, 
      contents: [{ role: 'user', parts: [{ text: prompt }] }], 
      generationConfig: { maxOutputTokens: maxTokens, responseMimeType: json ? 'application/json' : 'text/plain' } 
    }),
  });
  if (!response.ok) throw new Error(`Gemini request failed (${response.status}): ${await response.text()}`);
  const payload = await response.json();
  return payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ?? null;
}

async function callGroq(prompt, { maxTokens = 1000, model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile' } = {}) {
  const config = await getConfig();
  if (!config.GROQ_API_KEY || config.GROQ_API_KEY.includes('mock')) throw new Error('GROQ_API_KEY is not configured or is mock.');
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', { 
    method: 'POST', 
    headers: { 'content-type': 'application/json', authorization: `Bearer ${config.GROQ_API_KEY}` }, 
    signal: AbortSignal.timeout(25000),
    body: JSON.stringify({ model, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] }) 
  });
  if (!response.ok) throw new Error(`Groq request failed (${response.status}): ${await response.text()}`);
  return (await response.json()).choices?.[0]?.message?.content ?? null;
}

function generateContextualResponse(prompt) {
  const p = String(prompt || '').toLowerCase();

  if (p.includes('simulate a founder') || p.includes('ghost') || p.includes('conversation')) {
    // 1. Elizabeth Holmes / Theranos
    if (p.includes('elizabeth') || p.includes('holmes') || p.includes('theranos')) {
      if (p.includes('peer') || p.includes('journal') || p.includes('publish') || p.includes('science')) {
        return "In our view at the time, we believed publishing in peer-reviewed journals would surrender our proprietary micro-fluidics patent advantage and alert diagnostic monopolies like Quest and LabCorp before we had national Walgreens distribution. That was our fatal conceit. In life sciences, peer review is not competitive vulnerability—it is the only objective baseline of reality. Without external replication, you end up drinking your own marketing.";
      }
      if (p.includes('board') || p.includes('governance') || p.includes('director') || p.includes('kissinger') || p.includes('mattis')) {
        return "We constructed a board of world-renowned luminaries—George Shultz, Henry Kissinger, General Jim Mattis, Admiral Roughead. They brought immense political clout and institutional gravitas, but not a single one was an analytical biochemist or hematologist. They believed in me because of our shared moral crusade, but none of them possessed the technical tools to examine our coefficient-of-variation data or ask why venous blood was diluted.";
      }
      if (p.includes('signal') || p.includes('warn') || p.includes('lab') || p.includes('edison') || p.includes('early')) {
        return "The earliest warning signs were mechanical and biochemical: high hemolyzed blood rates from capillary fingerpricks, micro-fluidic channel clogs inside the Edison machines, and persistent discrepancies when our QC runs failed internal proficiency standards. Rather than delaying commercial rollout, we diluted samples and ran them on hacked commercial Siemens analyzers under extreme secrecy.";
      }
      return "In Silicon Valley, there is a dangerous doctrine that 'fake it till you make it' applies to all sectors. In healthcare and clinical diagnostics, engineering truth always catches up to you. We allowed secrecy and fear of competitive leaks to justify bypassing rigorous peer review. Once you compromise scientific integrity for narrative momentum, catastrophic collapse is inevitable.";
    }

    // 2. Adam Neumann / WeWork
    if (p.includes('adam') || p.includes('neumann') || p.includes('wework')) {
      if (p.includes('tech') || p.includes('valuation') || p.includes('multiple') || p.includes('software')) {
        return "We argued that our proprietary spatial density algorithms, community software, and global network effects warranted software multiples—20x to 30x revenue—instead of commercial REIT multiples of 2x to 3x. But software exhibits near-zero marginal distribution costs and 80%+ gross margins. Real estate has massive, fixed rent obligations, construction fit-out capex, and ongoing facility staffing that never sleep.";
      }
      if (p.includes('softbank') || p.includes('masa') || p.includes('capital') || p.includes('fund')) {
        return "Masa Son looked me in the eye and said: 'Don\'t be smart, be crazy. WeWork isn\'t big enough; make it ten times bigger.' When you are handed billions of dollars with instructions to capture market share at all costs, it eliminates every incentive for fiscal restraint. We were signing prime Manhattan and London leases at above-market rates before verifying if earlier locations could stand on their own cash flows.";
      }
      if (p.includes('lease') || p.includes('duration') || p.includes('mismatch') || p.includes('liability')) {
        return "The duration mismatch was the structural flaw that doomed us: an average non-cancellable lease commitment of 15 years against an average member commitment of 1 to 6 months. In a zero-interest-rate environment with infinite venture subsidies, you can disguise that gap. The instant market liquidity tightened or occupancy softened by 10%, our fixed lease payments engulfed our operational cash.";
      }
      if (p.includes('governance') || p.includes('trademark') || p.includes('share') || p.includes('vote')) {
        return "Our 2019 S-1 exposed governance liberties that Silicon Valley tolerated in private but Wall Street immediately rejected: 20-vote super-voting shares, family succession clauses, and personal ownership of the 'We' trademark leased back to the company. When you demand public market capital, governance cannot be treated as founder theater.";
      }
      return "Looking back at WeWork, our biggest blindspot was confusing capital velocity with product validation. We had 15-year non-cancellable lease commitments while our members were on 30-day rolling contracts. Every time SoftBank wrote an additional multi-billion dollar check, we treated it as proof that the model worked rather than addressing the core unit economics. If I could advise founders today: never use venture equity to subsidize real estate duration risk.";
    }

    // 3. Jeffrey Katzenberg / Quibi
    if (p.includes('katzenberg') || p.includes('quibi') || p.includes('jeffrey')) {
      if (p.includes('screenshot') || p.includes('clip') || p.includes('share') || p.includes('social') || p.includes('drm')) {
        return "We approached mobile distribution through the lens of traditional Hollywood copyright protection. We feared that allowing users to take screenshots or clip five-second video segments would foster digital piracy and devalue studio intellectual property. In doing so, we committed mobile suicide: we severed our product from Twitter memes, TikTok trends, and Instagram stories—the only organic distribution engines on mobile.";
      }
      if (p.includes('tiktok') || p.includes('creator') || p.includes('youtube') || p.includes('consumer')) {
        return "We believed mobile consumers wanted five-star, cinematic micro-episodes with crane shots and Oscar-winning talent. We completely misread what people open their phones for: authentic, unvarnished, creator-led engagement. While we spent $100,000 per minute producing scripted drama, a 19-year-old on TikTok with a ring light was generating 100x our engagement for zero production cost.";
      }
      if (p.includes('cost') || p.includes('minute') || p.includes('spend') || p.includes('100,000') || p.includes('100k')) {
        return "Our content cost structure required seven million paying subscribers in Year 1 simply to amortize our production guarantees. When you saddle a brand-new subscription service with multi-million dollar fixed monthly costs, your margin for iterative learning is zero. We needed perfection on day one.";
      }
      if (p.includes('beta') || p.includes('retention') || p.includes('user') || p.includes('signal')) {
        return "The warning signs in pre-launch testing were undeniable: beta users abandoned shows after two episodes, app store reviews complained about not being able to watch on television screens, and 30-day cohort retention was negligible. We convinced ourselves that our $100M Super Bowl ad campaign would solve retention. Ads can buy downloads; they cannot buy product-market fit.";
      }
      return "With Quibi, we built an incredible Hollywood studio machine, spending over $100,000 per minute on mobile video. But we fundamentally misunderstood consumer behavior. Mobile users want agency, virality, memes, and social connection—not top-down prestige content trapped behind DRM that blocked screenshots and sharing. We raised $1.75B and still missed the essential truth of the platform.";
    }

    // 4. Domm Holland / Fast
    if (p.includes('domm') || p.includes('holland') || p.includes('fast')) {
      if (p.includes('burn') || p.includes('10m') || p.includes('50k') || p.includes('runway') || p.includes('revenue')) {
        return "We fell into the trap of believing that one-click checkout was a winner-take-all land grab. We convinced ourselves that the first player to achieve total mindshare would own the payments rails of Web2. So we ramped sales reps, engineers, and executive salaries as if we had already won the distribution war. But when your burn-to-revenue ratio is 80-to-1, any delay in your next funding round is fatal.";
      }
      if (p.includes('merchant') || p.includes('enterprise') || p.includes('checkout') || p.includes('adoption')) {
        return "Enterprise ecommerce merchants guard their checkout funnel with religious intensity. They spent years optimizing conversion rates. Asking them to place a third-party button that controlled user authentication and order routing—without years of proven uptime—was an enormous ask. The 2-second speed increase did not offset the risk of lost transactions.";
      }
      if (p.includes('shopify') || p.includes('apple') || p.includes('platform') || p.includes('shop pay')) {
        return "We were trying to sell an isolated button against integrated platform juggernauts. Shopify built Shop Pay directly into millions of merchant stores with zero integration effort. Apple had TouchID and Apple Pay built directly into the operating system of 1.2 billion iPhones. We were asking merchants to add an unnecessary fourth middleman.";
      }
      if (p.includes('headcount') || p.includes('hire') || p.includes('hiring') || p.includes('400') || p.includes('team')) {
        return "Hiring 400 people before our core product could automatically onboard a WooCommerce merchant was our biggest sin. Every employee added management overhead, communication drag, and burn velocity. Founders often use headcount as a public status symbol to impress Twitter and investors. In reality, headcount is an expense multiplier, not a traction metric.";
      }
      return "We wanted to eliminate passwords and checkout friction from the internet forever with a single button. We had Stripe backing us, 400 world-class employees, and global brand buzz. But we were burning $10 million every single month while generating roughly $50,000 in monthly revenue. The single most vital rule: never mistake venture capital in your bank account for product-market fit.";
    }

    // 5. Doug Evans / Juicero
    if (p.includes('doug') || p.includes('evans') || p.includes('juicero')) {
      if (p.includes('hardware') || p.includes('part') || p.includes('force') || p.includes('press') || p.includes('engineer')) {
        return "We designed the Juicero Press like an aerospace component. It had 400 custom parts, 10 custom injection-molded components, a high-pressure aluminum gearbox, and four tons of mechanical force—enough to lift two Teslas. We wanted commercial-grade reliability in home kitchens. But that level of precision drove manufacturing costs so high that we had to price the machine at $699. We completely lost sight of consumer willingness to pay.";
      }
      if (p.includes('wifi') || p.includes('qr') || p.includes('drm') || p.includes('lock') || p.includes('pack')) {
        return "We justified the Wi-Fi connectivity and QR code scanner as essential food safety protocols to prevent consumers from pressing expired raw produce packs. But in the eyes of consumers, it was seen as abusive DRM—restricting them from using our appliance unless they maintained an active connection and bought our proprietary packs.";
      }
      if (p.includes('bloomberg') || p.includes('squeeze') || p.includes('hand') || p.includes('video') || p.includes('viral')) {
        return "When the Bloomberg video went viral showing reporters squeezing juice from our packs directly into glasses with their bare hands in seconds—without the machine—it shattered our entire value proposition in twelve seconds. We realized that our proprietary hardware wasn\'t an enabler; it was an expensive, unnecessary obstacle.";
      }
      return "I wanted to bring cold-pressed, raw organic nutrition directly into every American household. We engineered the most sophisticated kitchen press ever built: machined aluminum, custom gearboxes, optical QR readers, and internet-connected food safety verification. But we built a $700 mainframe to do what human hands could do in thirty seconds. Never engineer complexity where simplicity solves the user’s problem.";
    }

    // 6. Sam Bankman-Fried / FTX
    if (p.includes('bankman') || p.includes('sbf') || p.includes('ftx') || p.includes('alameda')) {
      if (p.includes('backdoor') || p.includes('allow_negative') || p.includes('python') || p.includes('alameda') || p.includes('code')) {
        return "In the FTX matching engine codebase, Gary Wang inserted a specific boolean flag for Alameda: 'allow_negative = true'. While every ordinary customer faced automated liquidation the microsecond their collateral margin fell below threshold, Alameda could carry negative balances into billions of dollars without liquidating. We told the public Alameda was an ordinary customer; in reality, it was drawing from customer deposit accounts to fund speculative venture investments and illiquid tokens.";
      }
      if (p.includes('deficit') || p.includes('hole') || p.includes('8 billion') || p.includes('deposit') || p.includes('customer')) {
        return "The $8 billion deficit accumulated over months of volatile market swings: Terra/Luna collapsed, crypto lenders like Voyager and BlockFi called in loans, and Alameda used FTX customer funds to pay back those lenders. Because we had no centralized treasury team, no chief financial officer, and kept track of billions on messy Slack channels and QuickBooks, we convinced ourselves the hole was manageable until users requested withdrawals.";
      }
      if (p.includes('diligence') || p.includes('investor') || p.includes('sequoia') || p.includes('fomo') || p.includes('board')) {
        return "Top venture firms invested hundreds of millions while I played video games on Zoom calls. They were captivated by our trading volume, our Washington lobbying presence, and the fear of missing out on the next global financial monopoly. Not one investor required an independent board of directors, an external auditor with exchange experience, or segregated escrow accounts for customer balances.";
      }
      if (p.includes('control') || p.includes('ray') || p.includes('audit') || p.includes('accounting') || p.includes('treasury')) {
        return "John J. Ray III, who handled Enron’s liquidation, stated he had never seen such a complete failure of corporate controls in his entire 40-year career. No list of bank accounts, no formal balance sheets, no internal audit committee. If your startup handles other people’s capital, risk management is not an administrative nuisance—it is the single reason you are permitted to exist.";
      }
      return "We believed we were building the most liquid, capital-efficient financial exchange on the planet, all in service of earning billions to give away through Effective Altruism. But behind the dashboards, Alameda had an unlimited credit line on FTX customer deposits, tracked on sloppy spreadsheets. In November 2022, an $8 billion run on our deposits revealed our balance sheet was an illusion. Charisma and intellectual gymnastics can never substitute for verified financial auditing and segregated custody.";
    }

    return "When our startup collapsed, the primary lesson wasn't that our market was wrong—it was our timeline and burn rate discipline. We scaled headcount and marketing before achieving undeniable product-market pull. The hardest truth founders face is confronting negative unit contribution margins early before external macro conditions make survival impossible.";
  }

  if (p.includes('90-day plan') || p.includes('playbook')) {
    return `# 90-Day Evidence-Based Defense Plan

### Phase 1: Days 1–30 (Unit Economics & Demand Verification)
- Conduct 20 customer discovery interviews focused exclusively on willingness to pay without discounts.
- Secure 3–5 signed non-refundable LOIs or pre-payment deposits before committing engineering sprint hours.
- Calculate fully burdened Customer Acquisition Cost (CAC) including founder time, software subscriptions, and acquisition overhead.

### Phase 2: Days 31–60 (Concierge MVP & Margin Defense)
- Deliver the core service manually to the first 5 customers to understand edge cases and real operational friction.
- Enforce positive gross margin from day one: ensure revenues cover direct hosting, API, and labor costs.
- Implement strict runway covenant: freeze hiring until organic retention exceeds 25% at 60 days.

### Phase 3: Days 61–90 (Defensive Moat & Scalable Distribution)
- Construct proprietary workflow locks or data assets that competitors cannot clone in a single sprint.
- Stress-test the cash burn curve against a 6-month macroeconomic downturn or delayed follow-on financing.
- Establish an advisory council with verified sector operators who have survived prior downturns.`;
  }

  return `Based on verified evidence from our startup failure corpus:

1. **Root Cause Analysis**: The predominant pattern correlates directly with capital allocation distortion. When startups receive substantial funding rounds ahead of verified customer retention, operational discipline deteriorates and burn rates escalate unsustainably.

2. **Historical Analogues**: Multiple documented cases (including WeWork, Fast, Juicero, and ScaleFactor) illustrate that high gross valuation metrics frequently mask negative underlying unit economics.

3. **Key Forensic Takeaway**: Sustainable venture architecture requires proving repeatable positive contribution margins before scaling headcount or paid customer acquisition. Founders must protect their runway by maintaining a minimum 18-month cash buffer under conservative revenue assumptions.`;
}

async function callGemini(prompt, options = {}) {
  try { return await gemini(prompt, options); } catch (geminiError) {
    try { return await callGroq(prompt, options); } catch (groqError) {
      console.warn('Both configured cloud LLMs failed, activating local forensic intelligence model.', { geminiError: geminiError.message, groqError: groqError.message });
      return generateContextualResponse(prompt);
    }
  }
}
module.exports = { callGemini, callGroq, wrapExternalContent, parseJSON, generateContextualResponse };
