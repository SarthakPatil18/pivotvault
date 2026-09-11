import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { useTheme } from '../hooks/useTheme';
import { useBookmarks } from '../hooks/useBookmarks';
import { getStartupById } from '../lib/data/startupsData';
import { 
  Sun, Moon, Monitor, ShieldCheck, Database, Trash2, 
  Sparkles, ExternalLink, Cpu, Info, Check 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { FailureScoreBadge } from '../components/common/FailureScoreBadge';

export function Settings() {
  const { theme, setTheme } = useTheme();
  const { bookmarks, toggleBookmark } = useBookmarks();

  const savedStartupRecords = bookmarks.map(id => getStartupById(id)).filter(Boolean);

  const dataSources = [
    { name: 'SEC EDGAR Database', type: 'Regulatory Filings', desc: 'Form 10-K, 8-K, S-1 Registration Statements, and SEC Litigation Releases.' },
    { name: 'US Bankruptcy Courts', type: 'Court Dockets', desc: 'Chapter 11 and Chapter 7 petitions across Delaware, S.D.N.Y., and California districts.' },
    { name: 'The Information & WSJ', type: 'Investigative Forensics', desc: 'In-depth financial burn investigations, leaked investor pitch decks, and internal whistleblower records.' },
    { name: 'PitchBook & Crunchbase', type: 'Cap Table Intelligence', desc: 'Verified financing rounds, institutional investor allocations, and valuation histories.' },
    { name: 'Founder Autobiographies & Memos', type: 'Primary Testimony', desc: 'Verified post-mortems published directly by founders and key engineering leads.' }
  ];

  return (
    <div className="pb-20">
      <PageHeader
        title="Settings & System Disclosures"
        subtitle="Manage appearance, view data provenance sources, and inspect AI ethical boundaries."
        badge="Platform Telemetry"
        tagline="SYSTEM CONFIGURATION"
        breadcrumbs={[{ label: 'Settings' }]}
      />

      <div className="vault-container max-w-4xl mx-auto space-y-8">
        {/* Appearance Section */}
        <div className="vault-card p-6 space-y-4">
          <div className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <h3 className="text-base font-bold font-sans text-neutral-950 dark:text-neutral-50">
              Appearance & Visual Theme
            </h3>
            <p className="text-xs text-neutral-500 font-sans">
              Choose your interface color mode. PivotVault defaults to a high-contrast Black + White visual identity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light Mode', icon: Sun, desc: 'Clean white surfaces, crisp black text.' },
              { id: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Near-black surfaces, subtle crimson accents.' },
              { id: 'system', label: 'System Default', icon: Monitor, desc: 'Automatically syncs with OS preferences.' },
            ].map((mode) => {
              const Icon = mode.icon;
              const isSelected = theme === mode.id;

              return (
                <button
                  key={mode.id}
                  onClick={() => setTheme(mode.id)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    isSelected 
                      ? 'border-neutral-900 dark:border-neutral-100 ring-1 ring-neutral-900 dark:ring-neutral-100 bg-neutral-50 dark:bg-neutral-900' 
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                    {isSelected && <Check className="w-3.5 h-3.5 text-rose-600" />}
                  </div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 font-sans">
                    {mode.label}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    {mode.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bookmarked Startups */}
        <div className="vault-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="text-base font-bold font-sans text-neutral-950 dark:text-neutral-50">
                Saved Startup Autopsies ({savedStartupRecords.length})
              </h3>
              <p className="text-xs text-neutral-500 font-sans">
                Startups pinned to your local research session.
              </p>
            </div>
          </div>

          {savedStartupRecords.length > 0 ? (
            <div className="space-y-2">
              {savedStartupRecords.map((s) => (
                <div 
                  key={s.id}
                  className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-neutral-900 dark:text-neutral-100">
                      {s.name}
                    </span>
                    <span className="font-mono text-neutral-400 text-[11px]">
                      ({s.industry})
                    </span>
                    <FailureScoreBadge score={s.failureScore} size="sm" />
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to={`/startup/${s.id}`}
                      className="font-mono text-xs text-neutral-900 dark:text-neutral-100 hover:text-rose-600 font-medium"
                    >
                      Open Case →
                    </Link>
                    <button
                      onClick={() => toggleBookmark(s.id)}
                      className="text-neutral-400 hover:text-rose-600 p-1"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-neutral-400 py-4 text-center">
              No bookmarked startups. Click the bookmark icon on any startup card to save it here.
            </div>
          )}
        </div>

        {/* Data Provenance & Sources */}
        <div className="vault-card p-6 space-y-4">
          <div className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <h3 className="text-base font-bold font-sans text-neutral-950 dark:text-neutral-50">
              Verified Data Provenance & Sources
            </h3>
            <p className="text-xs text-neutral-500 font-sans">
              All 413+ startup failure records are grounded in verified public domain documentation.
            </p>
          </div>

          <div className="space-y-3">
            {dataSources.map((source, idx) => (
              <div key={idx} className="p-3.5 rounded bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/70 dark:border-neutral-800 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-neutral-900 dark:text-neutral-100">
                    {source.name}
                  </span>
                  <span className="vault-badge vault-badge-neutral text-[10px]">
                    {source.type}
                  </span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 text-xs">
                  {source.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Transparency & Ethical Boundaries */}
        <div className="vault-card p-6 space-y-3 bg-neutral-50/70 dark:bg-neutral-900/40">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              AI Transparency & Safety Policy
            </h3>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
            PivotVault does not use generative AI to fabricate speculative or defamatory claims. All failure post-mortems, financial burn rates, and persona dialogue in the Hall of Ghosts are strictly synthesized from public trial testimony, bankruptcy court schedules, and verified journalistic publications.
          </p>
          <div className="text-[11px] font-mono text-neutral-400 pt-1">
            PivotVault Forensic Engine v2.4.0 • Build 2026.09
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
