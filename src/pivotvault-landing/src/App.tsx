import { FormEvent, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Bot, BrainCircuit, Check, ChevronRight, CircleAlert, Database, Menu, Search, ShieldAlert, Sparkles, X } from 'lucide-react'

const navItems = [['Explore', 'ghosts'], ['Intelligence', 'intelligence'], ['Analysis', 'pillars'], ['Insights', 'insights'], ['Learn', 'playbook']]
const risks = [['Market risk', 'LOW', 27], ['Competition risk', 'HIGH', 78], ['Customer acquisition', 'HIGH', 81], ['Funding risk', 'MEDIUM', 54], ['Historical similarity', 'MEDIUM', 62]]
const sources = ['Startup Genome', 'CB Insights', 'Dealroom', 'Tracxn', 'Founder Postmortems', 'Public Filings']
const stream: [string, string][] = [['Unit economics broke after expansion', 'structural'], ['Raised too early', 'strategic'], ['Product-market fit never stabilized', 'growth'], ['Customer acquisition cost exceeded margin', 'market'], ['Founder-market fit weakened', 'strategic'], ['Burn accelerated before validation', 'structural'], ['Competitor pressure increased', 'strategic'], ['Runway collapsed after premature hiring', 'structural'], ['Market timing shifted', 'market'], ['Revenue concentration became dangerous', 'market']]
const pillars = [
  { number: '01', title: 'Historical Failure Intelligence', copy: 'Find startups that faced the same problems before you.', kind: 'timeline', items: ['Similar startup matching', 'Failure categories', 'Historical timelines', 'Evidence, not anecdotes'] },
  { number: '02', title: 'Market Intelligence', copy: 'Understand the environment your idea is entering.', kind: 'market', items: ['Market signals', 'Demand indicators', 'Industry changes', 'Emerging constraints'] },
  { number: '03', title: 'Competitive Intelligence', copy: 'Know what could kill your idea before you build it.', kind: 'competition', items: ['Competitor landscape', 'Funding & momentum', 'Positioning', 'Market overlap'] },
  { number: '04', title: 'Risk Intelligence', copy: 'See the risks hiding inside your assumptions.', kind: 'risk', items: ['Product risk', 'Monetization', 'Customer acquisition', 'Execution pressure'] },
]
const ghosts = [
  { name: 'Quibi', domain: 'Streaming', raised: '$1.75B', stage: 'Series C', cause: 'Product-market fit never stabilized', lesson: 'Distribution and timing outrank production value.' },
  { name: 'Fast', domain: 'Fintech', raised: '$120M', stage: 'Series B', cause: 'Unit economics broke after expansion', lesson: 'Revenue without margin is just expensive marketing.' },
  { name: 'Katerra', domain: 'Construction', raised: '$2B', stage: 'Series D', cause: 'Burn accelerated before validation', lesson: 'Vertical integration multiplies every wrong assumption.' },
  { name: 'Honest Co. Beauty', domain: 'Consumer', raised: '$48M', stage: 'Series A', cause: 'Revenue concentration became dangerous', lesson: 'One channel owning 80% of revenue is a single point of failure.' },
  { name: 'Beepi', domain: 'Marketplace', raised: '$149M', stage: 'Series B', cause: 'Customer acquisition cost exceeded margin', lesson: 'Marketplace liquidity cannot be bought, only earned.' },
  { name: 'Jawbone', domain: 'Hardware', raised: '$3B', stage: 'Late stage', cause: 'Runway collapsed after premature hiring', lesson: 'Capital is a runway, not a strategy.' },
]
const ghostNodes = ['Quibi', 'Fast', 'Katerra', 'Beepi', 'Jawbone', 'Tally', 'HomeJoy', 'Ninja', 'Secto', 'Vitae']
const confessions = [
  { quote: 'We had eighteen months of runway and spent it proving a hypothesis nobody had asked for. I wish I had known this before.', author: 'Anonymous founder', detail: 'Consumer social · shut down 2021' },
  { quote: 'Every metric went up and to the right except the one that mattered: did customers come back in week four?', author: 'Anonymous founder', detail: 'B2B SaaS · acqui-hired' },
  { quote: 'The Series A felt like validation. It was actually just a longer rope.', author: 'Anonymous founder', detail: 'Fintech · shut down 2023' },
  { quote: 'Our competitor raised more, launched later, and won. Timing was the entire game and we never studied it.', author: 'Anonymous founder', detail: 'Dev tools · pivoted twice, folded' },
]
const signals = [
  { label: 'Premature scaling risk', evidence: '14 matched failures raised ahead of retention', amount: 86 },
  { label: 'Weak market assumption', evidence: 'TAM cited from aggregator reports, not interviews', amount: 71 },
  { label: 'Unclear monetization', evidence: 'Pricing appears on slide 14, framed as "later"', amount: 63 },
  { label: 'High capital intensity', evidence: 'Hardware assumptions without unit economics', amount: 54 },
  { label: 'Crowded market', evidence: '9 funded competitors in the same wedge', amount: 42 },
]
const playbook = [
  ['What to validate', 'Interview 15 target users. Test the sharpest customer-acquisition hypothesis before writing product code.'],
  ['What to avoid', 'Premature scaling. Every matched failure hired ahead of a repeatable weekly habit.'],
  ['What to measure', 'Week-4 retention, CAC payback, and revenue concentration — the three signals that surfaced in 7 of 7 matched cases.'],
  ['When to raise', 'After the habit forms, not before. Historical failure clusters inside the 6 months after a premature raise.'],
  ['When not to scale', 'While acquisition cost exceeds lifetime margin. Scaling amplifies negative unit economics.'],
  ['Assumptions to test', 'Differentiation, founder-market fit, and channel dependency — ranked by historical kill rate.'],
]
const vectorData = [['Premature scaling', 24, 92], ['No market need', 19, 74], ['Cash exhaustion', 15, 58], ['Team conflict', 9, 31], ['Pricing & margins', 8, 27], ['Regulatory shift', 5, 18]] as const

function Reveal({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const reduced = useReducedMotion()
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: .55, ease: [0.2, .8, .2, 1] }}>{children}</motion.div>
}

function SectionIntro({ eyebrow, title, copy, align = 'left' }: { eyebrow: string, title: string, copy?: string, align?: 'left' | 'center' }) {
  return <Reveal className={`section-intro ${align}`}><div className="eyebrow"><span />{eyebrow}</div><h2 className="h-xl">{title}</h2>{copy && <p>{copy}</p>}</Reveal>
}

function Dashboard({ compact = false }: { compact?: boolean }) {
  return <div className={`dashboard ${compact ? 'compact' : ''}`} id="demo">
    <div className="dashboard-top"><div className="app-mark"><span className="mark-small" /> PivotVault <em>FAILURE INTELLIGENCE</em></div><div className="live-dot">LIVE EVIDENCE</div></div>
    <div className="dashboard-grid">
      <div className="score-card"><span className="micro">IDEA SCORE</span><div className="score-row"><strong>72</strong><span>/ 100</span></div><div className="meter"><i style={{ width: '72%' }} /></div><div className="verdict"><CircleAlert size={14} /> CAUTION <span>Needs validation</span></div></div>
      <div className="risk-card"><span className="micro">RISK ANALYSIS</span>{risks.slice(0, compact ? 3 : 5).map(([name, level, value]) => <div className="risk-line" key={name}><span>{name}</span><b className={String(level).toLowerCase()}>{level}</b><i><u style={{ width: `${value}%` }} /></i></div>)}</div>
      <div className="evidence-card"><span className="micro">HISTORICAL EVIDENCE <small>4 matches</small></span>{['Similar startup failed after high CAC', '3 comparable startups struggled with retention', 'Competitor moat detected', '2 failures linked to premature scaling'].map((item, index) => <div className="evidence-item" key={item}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}<small>Source {index % 2 ? '— founder postmortem' : '— market archive'}</small></p><ChevronRight size={14} /></div>)}</div>
    </div>
  </div>
}

function PillarVisual({ kind }: { kind: string }) {
  if (kind === 'timeline') return <div className="visual timeline-visual"><div className="visual-header"><span>SIMILAR FAILURE PATHS</span><b>12 matched</b></div><div className="timeline"><i /><div><b>Pre-seed</b><span>Strong early interest</span></div><div><b>Month 8</b><span>Paid conversion stalls</span></div><div className="danger"><b>Month 14</b><span>Customer acquisition costs spike</span></div></div><div className="citation">◌ Evidence: 8 founder postmortems + public filings</div></div>
  if (kind === 'market') return <div className="visual market-visual"><div className="visual-header"><span>MARKET SIGNALS</span><b className="up">+18% relevance</b></div><div className="chart"><svg viewBox="0 0 400 140" preserveAspectRatio="none"><path d="M0 110 C50 98 56 86 95 91 S145 52 184 72 S247 48 278 57 S335 18 400 25" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M0 110 C50 98 56 86 95 91 S145 52 184 72 S247 48 278 57 S335 18 400 25 L400 140 L0 140Z" fill="currentColor" opacity=".11" /></svg></div><div className="signal-grid"><span>Demand<br/><b>Moderate</b></span><span>Category<br/><b>Cooling</b></span><span>Regulation<br/><b>Watch</b></span></div></div>
  if (kind === 'competition') return <div className="visual competition-visual"><div className="visual-header"><span>COMPETITIVE FIELD</span><b>14 active</b></div><div className="map"><div className="axis x">Differentiation →</div><div className="axis y">Market traction →</div>{['A', 'B', 'C', 'D', 'You'].map((label, index) => <i key={label} className={`dot dot-${index}`}>{label}</i>)}</div><div className="citation">Your position overlaps with 3 funded alternatives</div></div>
  return <div className="visual risk-visual"><div className="visual-header"><span>ASSUMPTION MAP</span><b className="amber">3 to validate</b></div>{[['Customer acquisition', '81'], ['Differentiation', '74'], ['Pricing model', '51'], ['Execution complexity', '38']].map(([label, amount]) => <div className="assumption" key={label}><span>{label}</span><div><i style={{ width: `${amount}%` }} /></div><b>{amount}</b></div>)}<div className="citation">Higher score = less supported assumption</div></div>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [idea, setIdea] = useState('AI-powered fitness platform for college students')
  const [analyzing, setAnalyzing] = useState(false)
  const analyze = (event: FormEvent) => { event.preventDefault(); setAnalyzing(true); window.setTimeout(() => setAnalyzing(false), 1100) }
  const goToDemo = () => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })
  const goToScan = () => document.getElementById('scan')?.scrollIntoView({ behavior: 'smooth' })
  return <>
    <header className="site-header"><nav className="nav shell"><a className="brand" href="#top" aria-label="PivotVault home"><img className="brand-flower" src="/pivotvault-logo.svg" alt="" width={30} height={30} /><span>PivotVault<small>Startup Failure Intelligence</small></span></a><div className="nav-links">{navItems.map(([name, target]) => <a key={name} href={`#${target}`}>{name}</a>)}</div><div className="nav-actions"><a href="http://localhost:5173/signin" className="signin">Sign In</a><button className="button dark small" onClick={goToScan}>Explore Archive <ArrowUpRight size={15}/></button></div><button className="menu-toggle" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}<span className="sr-only">Toggle navigation</span></button></nav>
      <div id="mobile-menu" className={`mobile-menu ${menuOpen ? 'open' : ''}`}>{navItems.map(([name, target]) => <a key={name} href={`#${target}`} onClick={() => setMenuOpen(false)}>{name}<ArrowRight size={18}/></a>)}<button className="button dark" onClick={() => { setMenuOpen(false); goToScan() }}>Explore Archive <ArrowRight size={17}/></button></div>
    </header>
    <main id="top">
      <section className="hero shell">
        {/* Organic atmospheric background: orange glow -> cream transition -> purple atmosphere */}
        <div className="hero-atmosphere" aria-hidden="true">
          <div className="atmosphere-mesh" />
          <div className="atmosphere-cloud cloud-orange" />
          <div className="atmosphere-cloud cloud-cream" />
          <div className="atmosphere-cloud cloud-purple" />
          <div className="atmosphere-cloud cloud-lavender" />
          <div className="atmosphere-cloud cloud-flow" />
          <svg className="atmosphere-grain" width="100%" height="100%">
            <filter id="hero-atmosphere-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.08   0 0 0 0 0.08   0 0 0 0 0.12   0 0 0 0.38 0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#hero-atmosphere-grain)" />
          </svg>
        </div>
        <div className="hero-copy"><Reveal>
          <a className="eyebrow pill" href="#intelligence"><Sparkles size={13} />STARTUP FAILURE INTELLIGENCE PLATFORM <ArrowRight size={13} /></a>
          <h1 className="h-xxl">Learn from startup failures.<br/><span className="word-gradient" data-word="Make better decisions">Make better decisions</span> before you build.</h1>
          <p>PivotVault synthesizes historical startup failures, AI reasoning, and evidence into actionable intelligence for founders and investors.</p>
          <div className="hero-buttons"><button className="button dark" onClick={goToScan}>Explore 413+ Failures <ArrowRight size={17}/></button><a className="text-button" href="#scan">Scan Startup Risk <ArrowRight size={16}/></a></div>
        </Reveal></div>
        <Reveal className="hero-product">
          <div className="hero-rocket-stage">
            <img src="/rocket-illustration.avif" loading="eager" width={388} alt="" className="am-rocket-illustration" />
          </div>
        </Reveal>
      </section>
      <section className="hero-dashboard shell"><Reveal><Dashboard compact /></Reveal></section>
      <section id="sources" className="sources"><div className="shell"><p className="source-label">Research &amp; Data Sources <span>— not affiliated or partnered</span></p><div className="source-rail">{sources.map(source => <span key={source}>{source}</span>)}</div></div></section>
      <section className="convergence shell"><SectionIntro eyebrow="THE EVIDENCE IS ALREADY HERE" title="The answers already exist. They’re just scattered everywhere." copy="PivotVault turns scattered startup history into searchable, structured evidence." align="center" /><Reveal className="convergence-stage"><div className="source-card postmortem">Founder<br/>Postmortem</div><div className="source-card market-report">Market Report</div><div className="source-card funding">Funding History</div><div className="source-card review">Competitor Review</div><div className="source-card filing">Public Filing</div><div className="intel-node"><BrainCircuit /><span>PivotVault</span><small>FAILURE INTELLIGENCE</small></div><div className="flow-line line-a"/><div className="flow-line line-b"/><div className="flow-line line-c"/></Reveal></section>
      <section id="intelligence" className="intelligence"><div className="shell"><SectionIntro eyebrow="EVIDENCE-FIRST ANALYSIS" title="AI that learns from failure" copy="PivotVault doesn’t just generate an opinion. It searches historical evidence — retrieved with RAG over structured failure data — and analyzes your idea against patterns from startups that came before it." /><Reveal className="search-panel"><div className="searchbar"><Search size={19}/><span>Why do AI productivity startups fail to retain users?</span><button aria-label="Search evidence"><ArrowRight size={18}/></button></div><div className="search-results"><aside><span className="micro">RELATED EVIDENCE</span><b>7 <small>relevant startup failures</small></b><b>3 <small>recurring retention problems</small></b><b>2 <small>competitor displacement patterns</small></b><b>1 <small>pricing-related failure pattern</small></b></aside><article><div className="result-title"><span>RECURRING PATTERN</span><b>Expectation gap after initial activation</b></div><p>Across the matched cases, teams created an impressive first session but failed to establish a repeatable, weekly habit.</p><div className="citations"><span>01 / Founder postmortem</span><span>02 / Customer review archive</span><span>03 / Public closure filing</span></div></article></div></Reveal></div></section>
      <section className="signal-stream"><div className="shell"><SectionIntro eyebrow="LIVE FAILURE SIGNAL STREAM" title="Never miss a failure pattern" copy="New signals are continuously organized into the patterns that matter." /><div className="stream-window"><div className="stream-track">{[...stream, ...stream].map(([text, category], index) => <div className="stream-event" data-signal={category} key={`${text}-${index}`}><span className="pulse" /><p>{text}</p><small>ARCHIVE SIGNAL</small></div>)}</div></div></div></section>
      <section id="pillars" className="pillars shell"><SectionIntro eyebrow="FAILURE INTELLIGENCE" title="Failure intelligence, built from what went wrong." copy="PivotVault turns startup failures into structured evidence, patterns, and decisions." align="center" /><div className="pillar-list-wrap">{pillars.map((pillar, index) => <div className={`pillar ${index % 2 ? 'reverse' : ''}`} key={pillar.number}><Reveal className="pillar-copy"><span className="number">{pillar.number}</span><h2 className="h-l">{pillar.title}</h2><p>{pillar.copy}</p><ul>{pillar.items.map(item => <li key={item}><Check size={15}/>{item}</li>)}</ul><a href="#scan" className="text-button">Explore intelligence <ArrowRight size={16}/></a></Reveal><Reveal className="pillar-canvas"><PillarVisual kind={pillar.kind} /></Reveal></div>)}</div></section>
      <section id="ghosts" className="ghosts dark-band"><div className="shell"><SectionIntro eyebrow="HALL OF GHOSTS" title="The graveyard of startups that once looked promising." copy="Explore what happened, why they failed, how much capital disappeared — and what founders today can learn from them." /><Reveal className="ghost-grid">{ghosts.map(ghost => <article className="ghost-card" key={ghost.name}><span className="micro">GHOST № {String(ghosts.indexOf(ghost) + 1).padStart(3, '0')}</span><h3>{ghost.name}</h3><div className="ghost-meta"><span>{ghost.domain}</span><span>{ghost.stage}</span></div><p className="ghost-cause"><CircleAlert size={13} />{ghost.cause}</p><p className="ghost-lesson">“{ghost.lesson}”</p><div className="ghost-lost"><span>Capital disappeared</span><b>{ghost.raised}</b></div></article>)}</Reveal></div></section>
      <section id="insights" className="insights shell"><SectionIntro eyebrow="INSIGHT DASHBOARD" title="See the patterns hiding across startup failures." copy="Failure vectors, capital evaporated, and recurring causes — visualized from the archive." /><Reveal className="insight-grid">
        <div className="insight-card span-2"><div className="visual-header"><span>FAILURE VECTOR DISTRIBUTION</span><b>413 events</b></div>{vectorData.map(([label, count, width]) => <div className="insight-bar" key={label}><span>{label}</span><div><i style={{ width: `${width}%` }} /></div><b>{count}%</b></div>)}<div className="citation">Share of 413 curated failures, 2015–2025</div></div>
        <div className="insight-card"><div className="visual-header"><span>CAPITAL EVAPORATED</span><b>$26.8B</b></div><div className="stat-hero"><strong>$26.8B</strong><span>total capital evaporated across the archive</span></div><div className="signal-grid dark-signal"><span>Failure vectors<br/><b>14</b></span><span>Curated failures<br/><b>413+</b></span><span>Closures indexed<br/><b>2015–25</b></span></div></div>
        <div className="insight-card"><div className="visual-header"><span>FAILURE EVENTS OVER TIME</span><b className="up">Indexed</b></div><div className="chart tall-chart"><svg viewBox="0 0 400 140" preserveAspectRatio="none"><path d="M0 118 C40 112 60 100 95 96 S150 84 184 88 S240 70 278 62 S340 30 400 22" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M0 118 C40 112 60 100 95 96 S150 84 184 88 S240 70 278 62 S340 30 400 22 L400 140 L0 140Z" fill="currentColor" opacity=".11" /></svg></div><div className="citation">Failure events per year, normalized</div></div>
      </Reveal></section>
      <section id="scan" className="demo shell"><SectionIntro eyebrow="RISK SCANNER" title="Put your startup idea through the patterns of history." copy="A working preview of how PivotVault scans an idea against historical failure patterns — market, competition, founder-market fit, monetization, capital intensity, time-to-revenue, differentiation, and regulatory risk." /><Reveal className="demo-workbench"><form onSubmit={analyze}><label htmlFor="idea">YOUR IDEA</label><textarea id="idea" value={idea} onChange={event => setIdea(event.target.value)} /><button className="button dark" type="submit" disabled={analyzing}>{analyzing ? 'Scanning evidence…' : <>Scan startup risk <ArrowRight size={17}/></>}</button><p><Database size={14}/> No idea is stored in this demo.</p></form><div className="demo-result"><div className="analysis-status"><span>HISTORICAL RISK PATTERNS</span><b><i /> CAUTION</b></div><div className="demo-score"><strong>72</strong><span>/100 <small>Idea score</small></span></div><div className="why"><span className="micro">RISK FLAGS</span>{['High competition', 'Weak differentiation', 'Difficult customer acquisition', 'Moderate historical failure similarity'].map(item => <p key={item}><CircleAlert size={14}/>{item}</p>)}</div><div className="historical"><span className="micro">RELEVANT FAILURE CASES</span><p>7 similar startups analyzed <a href="#intelligence">View evidence <ArrowRight size={13}/></a></p><p>3 failed due to customer acquisition</p><p>2 struggled with retention</p><p>Recommended action: validate pricing before building</p></div></div></Reveal></section>
      <section id="playbook" className="plan"><div className="shell"><SectionIntro eyebrow="FOUNDER PLAYBOOK" title="Don’t just identify the risk. Know what to do next." copy="Evidence-backed recommendations: what to validate, what to avoid, what to measure, when to raise, and when not to scale." /><Reveal className="plan-grid">{playbook.map(([title, text]) => <article key={title}><span className="days">Play<small>DECISION</small></span><h3>{title}</h3><p>{text}</p><a href="#scan">Open action plan <ArrowRight size={15}/></a></article>)}</Reveal></div></section>
      <section className="compare shell"><SectionIntro eyebrow="COMPETITOR COMPARE" title="Compare your startup against history’s cautionary tales." copy="Positioning, funding, traction, differentiation, and historical risk — side by side." /><Reveal className="compare-grid">
        <article className="compare-card you"><span className="micro">YOUR STARTUP</span><h3>You</h3><dl><div><dt>Positioning</dt><dd>AI-native wedge</dd></div><div><dt>Funding</dt><dd>Pre-seed</dd></div><div><dt>Traction</dt><dd>Waitlist</dd></div><div><dt>Differentiation</dt><dd>Unproven</dd></div><div><dt>Historical risk</dt><dd className="risk-medium">MEDIUM</dd></div></dl></article>
        <article className="compare-card"><span className="micro">GHOST A</span><h3>Fast</h3><dl><div><dt>Positioning</dt><dd>Category creation</dd></div><div><dt>Funding</dt><dd>$120M · Series B</dd></div><div><dt>Traction</dt><dd>Hypergrowth</dd></div><div><dt>Differentiation</dt><dd>Thin</dd></div><div><dt>Historical risk</dt><dd className="risk-high">HIGH</dd></div></dl></article>
        <article className="compare-card"><span className="micro">GHOST B</span><h3>Beepi</h3><dl><div><dt>Positioning</dt><dd>Full-stack marketplace</dd></div><div><dt>Funding</dt><dd>$149M · Series B</dd></div><div><dt>Traction</dt><dd>Regional only</dd></div><div><dt>Differentiation</dt><dd>Operational</dd></div><div><dt>Historical risk</dt><dd className="risk-high">HIGH</dd></div></dl></article>
      </Reveal></section>
      <section id="autopsy" className="autopsy dark-band"><div className="shell"><SectionIntro eyebrow="PITCH DECK AUTOPSY" title="Find the assumptions history may challenge." copy="Upload a pitch deck and PivotVault surfaces the claims investors, markets, and historical failure patterns will pressure-test." /><Reveal className="autopsy-grid">{signals.map(signal => <article className="autopsy-card" key={signal.label}><span className="micro">FINDING</span><h3>{signal.label}</h3><p>{signal.evidence}</p><div className="assumption slim"><span>Historical pressure</span><div><i style={{ width: `${signal.amount}%` }} /></div><b>{signal.amount}</b></div></article>)}</Reveal></div></section>
      <section className="confessions dark-band"><div className="shell"><SectionIntro eyebrow="FOUNDERS CONFESSIONS" title="Real stories. Real mistakes. No polished mythology." copy="Founder accounts of the turning points they didn’t see coming — shared so you can." align="center" /><Reveal className="confession-grid">{confessions.map(confession => <figure className="confession-card" key={confession.quote}><blockquote>“{confession.quote}”</blockquote><figcaption><b>{confession.author}</b><span>{confession.detail}</span></figcaption></figure>)}</Reveal><p className="confession-note">Composite, anonymized accounts in the style of public founder postmortems — not claims by identifiable customers.</p></div></section>
      <section className="knowledge shell"><SectionIntro eyebrow="KNOWLEDGE GRAPH" title="See how failure connects." copy="Companies, founders, markets, failure vectors, funding decisions, and outcomes — one connected evidence graph." align="center" /><Reveal className="knowledge-stage">
        <div className="kg-node center"><BrainCircuit /><span>PivotVault Graph</span></div>
        {ghostNodes.map((name, index) => { const angle = (index / ghostNodes.length) * Math.PI * 2; const x = 50 + 38 * Math.cos(angle); const y = 50 + 34 * Math.sin(angle); return <div key={name} className="kg-node satellite" style={{ left: `${x}%`, top: `${y}%` }}>{name}</div> })}
        <div className="kg-edge e0" /><div className="kg-edge e1" /><div className="kg-edge e2" /><div className="kg-edge e3" /><div className="kg-edge e4" /><div className="kg-edge e5" /><div className="kg-edge e6" /><div className="kg-edge e7" /><div className="kg-edge e8" /><div className="kg-edge e9" />
      </Reveal></section>
      <section className="architecture"><div className="shell"><SectionIntro eyebrow="MULTI-AGENT ANALYSIS" title="One idea. Multiple perspectives." copy="Each specialist inspects a different angle of your idea before a final red-team pass." align="center" /><Reveal className="agent-system"><div className="agent-grid">{['Market Agent', 'Competitor Agent', 'Failure Pattern Agent', 'Risk Agent'].map((agent, index) => <div className="agent" key={agent}><Bot size={18}/><span>{agent}</span><small>0{index + 1}</small></div>)}</div><div className="system-arrow">↓</div><div className="red-team"><ShieldAlert size={19}/><span>Red-Team Agent</span><small>Challenging the consensus</small></div><div className="system-arrow">↓</div><div className="engine"><BrainCircuit size={24}/><span>PivotVault Intelligence Engine</span><i>Evidence synthesis · pgvector retrieval · Contradiction checks</i></div><div className="system-arrow">↓</div><div className="outcome"><span>IDEA SCORE</span><strong>72<small>/100</small></strong><b>CAUTION</b></div></Reveal></div></section>
      <section className="stats shell"><Reveal className="stat-grid">{[['413+', 'curated startup failures'], ['14', 'failure vectors'], ['$26.8B', 'capital evaporated'], ['Evidence-backed', 'recommendations']].map(([number, label]) => <div key={label}><strong>{number}</strong><span>{label}</span></div>)}</Reveal></section>
      <section className="final-cta shell"><Reveal><span className="eyebrow"><span />BUILD WITH CONTEXT</span><h2 className="h-xxl">Before you build it, learn why others couldn’t.</h2><p>Use the history of startup failure to make better decisions about what to build next.</p><div className="hero-buttons"><button className="button light" onClick={goToScan}>Scan Startup Risk <ArrowRight size={17}/></button><a className="text-button light-text" href="#ghosts">Visit the Hall of Ghosts <ArrowRight size={16}/></a></div></Reveal><div className="cta-orbit orbit-one"/><div className="cta-orbit orbit-two"/></section>
    </main>
    <footer className="site"><div className="shell footer-main"><div className="footer-brand"><a className="brand" href="#top"><img className="brand-flower" src="/pivotvault-logo.svg" alt="" width={30} height={30} /><span>PivotVault<small>Startup Failure Intelligence</small></span></a><p>Startup intelligence built from the mistakes of the past.</p></div>{[['Product', 'Failure Explorer|Knowledge Graph|Hall of Ghosts|Risk Scanner'], ['Intelligence', 'Pitch Deck Autopsy|Competitor Compare|Insight Dashboard'], ['Founder', 'Founder Playbook|Founders Confessions'], ['Company', 'About|Research|Contact']].map(([title, links]) => <div className="footer-column" key={title}><b>{title}</b>{links.split('|').map(link => <a href="#top" key={link}>{link}</a>)}</div>)}</div><div className="shell footer-bottom"><span>© 2026 PivotVault</span><span>Failure intelligence for deliberate founders.</span></div></footer>
  </>
}
export default App
