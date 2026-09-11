import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { CURATED_STARTUPS, getStartupById } from '../lib/data/startupsData';
import { FailureScoreBadge } from '../components/common/FailureScoreBadge';
import { CompanyLogo } from '../components/common/CompanyLogo';
import { formatCurrency } from '../lib/utils';
import { ArrowLeftRight, CheckCircle2, XCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CompetitorCompare() {
  const [startupAId, setStartupAId] = useState('wework');
  const [startupBId, setStartupBId] = useState('katerra');

  const startupA = getStartupById(startupAId) || CURATED_STARTUPS[0];
  const startupB = getStartupById(startupBId) || CURATED_STARTUPS[1];

  const curatedPairs = [
    { name: 'SoftBank Mega-Fails: WeWork vs Katerra', a: 'wework', b: 'katerra' },
    { name: 'Hardware Over-Engineering: Juicero vs Jawbone', a: 'juicero', b: 'jawbone' },
    { name: 'Mobile Media Collapse: Quibi vs Vine', a: 'quibi', b: 'vine' },
    { name: 'Biotech & CleanTech Deception: Theranos vs Solyndra', a: 'theranos', b: 'solyndra' },
    { name: 'Fintech Hyper-Burn: Fast vs ScaleFactor', a: 'fast', b: 'scalefactor' }
  ];

  return (
    <div className="pb-20 bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <PageHeader
        title="Side-by-Side Failure Post-Mortem Comparator"
        subtitle="Compare fatal divergences, governance blindspots, and capital destruction across pairs of collapsed startups."
        badge="Comparative Forensics"
        tagline="POST-MORTEM COMPARATOR"
        breadcrumbs={[{ label: 'Analysis' }, { label: 'Competitor Compare' }]}
      />

      <div className="vault-container space-y-8">
        {/* Curated Preset Pairs */}
        <div className="vault-card p-4 sm:p-5">
          <div className="text-xs font-mono uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-2.5">
            Curated Head-to-Head Comparative Autopsies:
          </div>
          <div className="flex flex-wrap gap-2">
            {curatedPairs.map((pair, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setStartupAId(pair.a);
                  setStartupBId(pair.b);
                }}
                className={`px-3 py-1.5 rounded-[4px] text-xs font-mono transition-colors border cursor-pointer ${
                  startupAId === pair.a && startupBId === pair.b
                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white font-bold'
                    : 'bg-white dark:bg-black text-black dark:text-white border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-black dark:hover:border-white'
                }`}
              >
                {pair.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selection Dropdown Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Startup A Selector */}
          <div className="vault-card p-4 space-y-2">
            <label className="block text-xs font-mono font-bold text-[#737373] dark:text-[#A3A3A3] uppercase">
              Venture A (Reference Autopsy)
            </label>
            <select
              value={startupAId}
              onChange={(e) => setStartupAId(e.target.value)}
              className="vault-input font-bold cursor-pointer"
            >
              {CURATED_STARTUPS.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.industry})</option>
              ))}
            </select>
          </div>

          {/* Startup B Selector */}
          <div className="vault-card p-4 space-y-2">
            <label className="block text-xs font-mono font-bold text-[#737373] dark:text-[#A3A3A3] uppercase">
              Venture B (Comparative Autopsy)
            </label>
            <select
              value={startupBId}
              onChange={(e) => setStartupBId(e.target.value)}
              className="vault-input font-bold cursor-pointer"
            >
              {CURATED_STARTUPS.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.industry})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Side-by-Side Comparison Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column A */}
          <div className="vault-card p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
              <div className="flex items-center gap-3">
                <CompanyLogo startup={startupA} size="lg" />
                <div>
                  <h3 className="text-xl font-bold font-sans text-black dark:text-white">
                    {startupA.name}
                  </h3>
                  <span className="text-xs font-mono text-[#737373] dark:text-[#A3A3A3]">{startupA.industry}</span>
                </div>
              </div>
              <FailureScoreBadge score={startupA.failureScore} size="md" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="text-[#737373] dark:text-[#A3A3A3] block text-[10px] uppercase">Capital Evaporated</span>
                <span className="text-base font-bold text-black dark:text-white tabular-nums">{formatCurrency(startupA.capitalRaised)}</span>
              </div>
              <div className="p-3 rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="text-[#737373] dark:text-[#A3A3A3] block text-[10px] uppercase">Active Span</span>
                <span className="text-base font-bold text-black dark:text-white tabular-nums">{startupA.foundedYear}–{startupA.failedYear}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#737373] dark:text-[#A3A3A3]">Primary Failure Mode:</span>
              <div className="text-xs font-bold text-black dark:text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                <span>{startupA.failureMode}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
              <span className="text-[10px] font-mono uppercase text-[#737373] dark:text-[#A3A3A3]">Documented Root Causes:</span>
              <ul className="space-y-1.5 text-xs text-[#737373] dark:text-[#A3A3A3]">
                {startupA.rootCauses?.map((rc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-black dark:text-white font-bold">•</span>
                    <span>{rc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link to={`/startup/${startupA.id}`} className="vault-btn-secondary w-full text-xs font-mono inline-block text-center mt-2">
              View Full {startupA.name} Autopsy →
            </Link>
          </div>

          {/* Column B */}
          <div className="vault-card p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
              <div className="flex items-center gap-3">
                <CompanyLogo startup={startupB} size="lg" />
                <div>
                  <h3 className="text-xl font-bold font-sans text-black dark:text-white">
                    {startupB.name}
                  </h3>
                  <span className="text-xs font-mono text-[#737373] dark:text-[#A3A3A3]">{startupB.industry}</span>
                </div>
              </div>
              <FailureScoreBadge score={startupB.failureScore} size="md" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="text-[#737373] dark:text-[#A3A3A3] block text-[10px] uppercase">Capital Evaporated</span>
                <span className="text-base font-bold text-black dark:text-white tabular-nums">{formatCurrency(startupB.capitalRaised)}</span>
              </div>
              <div className="p-3 rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="text-[#737373] dark:text-[#A3A3A3] block text-[10px] uppercase">Active Span</span>
                <span className="text-base font-bold text-black dark:text-white tabular-nums">{startupB.foundedYear}–{startupB.failedYear}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#737373] dark:text-[#A3A3A3]">Primary Failure Mode:</span>
              <div className="text-xs font-bold text-black dark:text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                <span>{startupB.failureMode}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
              <span className="text-[10px] font-mono uppercase text-[#737373] dark:text-[#A3A3A3]">Documented Root Causes:</span>
              <ul className="space-y-1.5 text-xs text-[#737373] dark:text-[#A3A3A3]">
                {startupB.rootCauses?.map((rc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-black dark:text-white font-bold">•</span>
                    <span>{rc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link to={`/startup/${startupB.id}`} className="vault-btn-secondary w-full text-xs font-mono inline-block text-center mt-2">
              View Full {startupB.name} Autopsy →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompetitorCompare;
