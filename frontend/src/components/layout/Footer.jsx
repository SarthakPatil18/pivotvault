import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PivotVaultLogo } from '../../assets/logo';
import { 
  ArrowUp, Check, ShieldCheck, FileText, Database, 
  ExternalLink, Sparkles, X, Info, Mail, ArrowRight 
} from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'methodology', 'disclosures', 'privacy'

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-white dark:bg-black border-t border-[#E5E5E5] dark:border-[#2A2A2A] text-black dark:text-white transition-colors">
      {/* Top Editorial CTA / Newsletter Section */}
      <div className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] py-12 md:py-16 bg-neutral-50/60 dark:bg-[#0A0A0A]/60">
        <div className="site-container">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12">
            {/* Left: Headline & Description */}
            <div className="max-w-xl space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white dark:bg-[#141414] border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono font-medium text-neutral-700 dark:text-neutral-300 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>FORENSIC VENTURE INTELLIGENCE</span>
              </div>

              <h3 className="text-[26px] sm:text-[30px] md:text-[34px] font-extrabold leading-[32px] sm:leading-[38px] md:leading-[42px] tracking-tight text-black dark:text-white">
                Learn from 413+ startup failures before you build.
              </h3>
              <p className="text-[14px] md:text-[15px] text-[#737373] dark:text-[#A3A3A3] leading-[24px]">
                Receive forensic failure breakdowns, court deposition highlights, unit economics stress tests, and defensive playbooks delivered weekly to your inbox.
              </p>
            </div>

            {/* Right: Interactive Newsletter Form Card */}
            <div className="w-full lg:max-w-md bg-white dark:bg-[#0F0F0F] p-5 sm:p-6 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-xs">
              {subscribed ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-start gap-2.5 text-xs font-mono">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Dispatches activated for {email}</span>
                      <span className="text-[11px] opacity-90">You will receive the weekly failure autopsy dispatch every Thursday morning.</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setSubscribed(false); setEmail(''); }}
                    className="text-[11px] font-mono text-neutral-500 hover:text-black dark:hover:text-white underline transition-colors"
                  >
                    Subscribe another email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your work email..."
                      className="input-editorial pl-10 pr-3 text-xs font-mono h-11 w-full"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary w-full text-xs font-mono h-11 flex items-center justify-center gap-2 font-bold"
                  >
                    <span>Join Archive</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3] pt-1 px-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Free weekly dispatch
                    </span>
                    <span>Zero spam • Unsubscribe anytime</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Link Grid */}
      <div className="site-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Column (Spans 2 on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/app" className="inline-block" aria-label="PivotVault Dashboard">
              <PivotVaultLogo />
            </Link>
            <p className="text-[13px] text-[#737373] dark:text-[#A3A3A3] leading-[22px] max-w-sm">
              PivotVault is an independent forensic venture intelligence archive cataloging 413+ historical startup collapses, SEC disclosures, bankruptcy dockets, and root-cause taxonomies to help founders build durable companies.
            </p>
            
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="badge-neutral text-[10px] font-mono">
                159 Indexed Autopsies
              </span>
              <span className="badge-neutral text-[10px] font-mono">
                $43.06B+ Capital Lost Mapped
              </span>
              <span className="badge-neutral text-[10px] font-mono">
                191 Evidence Dockets
              </span>
            </div>
          </div>

          {/* Column 1: Archive & Macro */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-black dark:text-white">
              Archive & Macro
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/explore"
                  className="text-[13px] text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white transition-colors"
                >
                  Failure Archive
                </Link>
              </li>
              <li>
                <Link
                  to="/insights"
                  className="text-[13px] text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white transition-colors"
                >
                  Macro Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Forensic Intelligence */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-black dark:text-white">
              Intelligence
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/risk-scanner"
                  className="text-[13px] text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white transition-colors"
                >
                  Risk Scanner
                </Link>
              </li>
              <li>
                <Link
                  to="/ai-assistant"
                  className="text-[13px] text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white transition-colors"
                >
                  AI Research Assistant
                </Link>
              </li>
              <li>
                <Link
                  to="/founder-playbook"
                  className="text-[13px] text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white transition-colors"
                >
                  Founder Playbook
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Forensic Autopsy */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-black dark:text-white">
              Forensics
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/pitch-deck-autopsy"
                  className="text-[13px] text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white transition-colors"
                >
                  Pitch Deck Autopsy
                </Link>
              </li>
              <li>
                <Link
                  to="/competitor-compare"
                  className="text-[13px] text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white transition-colors"
                >
                  Competitor Comparator
                </Link>
              </li>
              <li>
                <Link
                  to="/startup/wework"
                  className="text-[13px] text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white transition-colors"
                >
                  Featured Autopsy: WeWork
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Stories & Voices */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-black dark:text-white">
              Personas & Voices
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/hall-of-ghosts"
                  className="text-[13px] text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white transition-colors"
                >
                  Hall of Ghosts
                </Link>
              </li>
              <li>
                <Link
                  to="/founder-confessions"
                  className="text-[13px] text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white transition-colors"
                >
                  Founder Confessions
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="inline-flex items-center gap-1.5 text-[12px] font-mono text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white transition-colors pt-1"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Back to top</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclosures & Copyright */}
        <div className="mt-14 pt-8 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] font-mono text-[#737373] dark:text-[#A3A3A3]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>© {new Date().getFullYear()} PivotVault Systems. Forensic startup failure intelligence.</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveModal('methodology')}
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              Methodology
            </button>
            <button 
              onClick={() => setActiveModal('disclosures')}
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              Evidence Disclosures
            </button>
            <button 
              onClick={() => setActiveModal('privacy')}
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              Privacy & Integrity
            </button>
          </div>
        </div>
      </div>

      {/* Information Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg p-6 rounded-xl bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-xl text-black dark:text-white space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                <h4 className="text-sm font-bold font-mono uppercase tracking-wider">
                  {activeModal === 'methodology' && 'Platform Forensic Methodology'}
                  {activeModal === 'disclosures' && 'Evidence & Archival Disclosures'}
                  {activeModal === 'privacy' && 'Privacy & Research Integrity'}
                </h4>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed space-y-3 font-sans">
              {activeModal === 'methodology' && (
                <>
                  <p>
                    PivotVault constructs post-mortems through triangulated evidence verification. Every indexed company is corroborated using primary legal records:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Securities and Exchange Commission (SEC) Form 10-K, S-1, and 8-K regulatory filings.</li>
                    <li>United States Bankruptcy Court Chapter 7 & 11 liquidation dockets.</li>
                    <li>Investigative journalism and audited investor letters (WSJ, Bloomberg, The Information).</li>
                    <li>Verified founder post-mortems and authenticated liquidator schedules.</li>
                  </ul>
                </>
              )}

              {activeModal === 'disclosures' && (
                <>
                  <p>
                    All case autopsies, AI persona reconstructions, and Idea Score diagnostics are provided strictly for research and educational purposes:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Reconstructed personas in the Hall of Ghosts simulate founder speech patterns based exclusively on public trial transcripts, published memoirs, and press releases.</li>
                    <li>Risk Scanner results represent algorithmic heuristic projections and do not constitute investment, legal, or financial advice.</li>
                  </ul>
                </>
              )}

              {activeModal === 'privacy' && (
                <>
                  <p>
                    PivotVault is committed to founder confidentiality and zero-knowledge research:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your startup concepts entered into the Risk Scanner are evaluated dynamically without being sold to third parties or data brokers.</li>
                    <li>All telemetry and bookmarks are stored client-side in browser storage.</li>
                  </ul>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="btn-primary text-xs px-4 py-1.5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;
