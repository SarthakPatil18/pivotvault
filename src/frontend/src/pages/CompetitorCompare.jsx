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

  return (
    <div className="pb-20 bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <PageHeader
        title="Side-by-Side Failure Post-Mortem Comparator"
        badge="Comparative Forensics"
        tagline="POST-MORTEM COMPARATOR"
        breadcrumbs={[{ label: 'Analysis' }, { label: 'Competitor Compare' }]}
      />

      <div className="vault-container space-y-6">

        {/* Selection Dropdown Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Startup A Selector */}
          <div className="p-5 rounded-[12px] bg-white dark:bg-[#0A0A0A] border border-[#D4D4D4] dark:border-[#262626] shadow-sm space-y-2.5">
            <label className="block text-[11px] font-mono font-bold text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider">
              Venture A (Reference Case)
            </label>
            <select
              value={startupAId}
              onChange={(e) => setStartupAId(e.target.value)}
              className="w-full px-3 py-2 text-sm font-semibold rounded-[6px] border border-[#D4D4D4] dark:border-[#333333] bg-[#FBFBFB] dark:bg-[#141414] text-black dark:text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
            >
              {CURATED_STARTUPS.map((s) => (
                <option key={s.id} value={s.id}>{s.name} — {s.industry}</option>
              ))}
            </select>
          </div>

          {/* Startup B Selector */}
          <div className="p-5 rounded-[12px] bg-white dark:bg-[#0A0A0A] border border-[#D4D4D4] dark:border-[#262626] shadow-sm space-y-2.5">
            <label className="block text-[11px] font-mono font-bold text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider">
              Venture B (Comparative Case)
            </label>
            <select
              value={startupBId}
              onChange={(e) => setStartupBId(e.target.value)}
              className="w-full px-3 py-2 text-sm font-semibold rounded-[6px] border border-[#D4D4D4] dark:border-[#333333] bg-[#FBFBFB] dark:bg-[#141414] text-black dark:text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
            >
              {CURATED_STARTUPS.map((s) => (
                <option key={s.id} value={s.id}>{s.name} — {s.industry}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Side-by-Side Comparison Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Column A */}
          <div className="rounded-[12px] p-6 space-y-5 bg-white dark:bg-[#0A0A0A] border-2 border-[#E0E0E0] dark:border-[#262626] shadow-md hover:border-black dark:hover:border-white transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5] dark:border-[#262626]">
              <div className="flex items-center gap-3.5">
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
              <div className="p-3.5 rounded-[8px] bg-[#F8F8F8] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626]">
                <span className="text-[#737373] dark:text-[#A3A3A3] block text-[10px] uppercase font-bold tracking-wider">Capital Evaporated</span>
                <span className="text-base font-bold text-black dark:text-white tabular-nums mt-0.5 block">{formatCurrency(startupA.capitalRaised)}</span>
              </div>
              <div className="p-3.5 rounded-[8px] bg-[#F8F8F8] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626]">
                <span className="text-[#737373] dark:text-[#A3A3A3] block text-[10px] uppercase font-bold tracking-wider">Active Span</span>
                <span className="text-base font-bold text-black dark:text-white tabular-nums mt-0.5 block">{startupA.foundedYear}–{startupA.failedYear}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-[8px] bg-[#F8F8F8] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#737373] dark:text-[#A3A3A3]">Primary Failure Vector</span>
              <div className="text-xs font-bold text-black dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#DC2626] shrink-0" />
                <span>{startupA.failureMode}</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-[#E5E5E5] dark:border-[#262626]">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#737373] dark:text-[#A3A3A3]">Documented Root Causes</span>
              <ul className="space-y-2 text-xs text-[#404040] dark:text-[#CCCCCC]">
                {startupA.rootCauses?.map((rc, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-black dark:text-white font-bold text-sm leading-none mt-0.5">•</span>
                    <span className="leading-snug">{rc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <Link 
                to={`/startup/${startupA.id}`} 
                className="w-full py-2.5 px-4 rounded-[6px] text-xs font-mono font-bold text-center block bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
              >
                View Full {startupA.name} Dossier →
              </Link>
            </div>
          </div>

          {/* Column B */}
          <div className="rounded-[12px] p-6 space-y-5 bg-white dark:bg-[#0A0A0A] border-2 border-[#E0E0E0] dark:border-[#262626] shadow-md hover:border-black dark:hover:border-white transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5] dark:border-[#262626]">
              <div className="flex items-center gap-3.5">
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
              <div className="p-3.5 rounded-[8px] bg-[#F8F8F8] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626]">
                <span className="text-[#737373] dark:text-[#A3A3A3] block text-[10px] uppercase font-bold tracking-wider">Capital Evaporated</span>
                <span className="text-base font-bold text-black dark:text-white tabular-nums mt-0.5 block">{formatCurrency(startupB.capitalRaised)}</span>
              </div>
              <div className="p-3.5 rounded-[8px] bg-[#F8F8F8] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626]">
                <span className="text-[#737373] dark:text-[#A3A3A3] block text-[10px] uppercase font-bold tracking-wider">Active Span</span>
                <span className="text-base font-bold text-black dark:text-white tabular-nums mt-0.5 block">{startupB.foundedYear}–{startupB.failedYear}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-[8px] bg-[#F8F8F8] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#737373] dark:text-[#A3A3A3]">Primary Failure Vector</span>
              <div className="text-xs font-bold text-black dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#DC2626] shrink-0" />
                <span>{startupB.failureMode}</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-[#E5E5E5] dark:border-[#262626]">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#737373] dark:text-[#A3A3A3]">Documented Root Causes</span>
              <ul className="space-y-2 text-xs text-[#404040] dark:text-[#CCCCCC]">
                {startupB.rootCauses?.map((rc, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-black dark:text-white font-bold text-sm leading-none mt-0.5">•</span>
                    <span className="leading-snug">{rc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <Link 
                to={`/startup/${startupB.id}`} 
                className="w-full py-2.5 px-4 rounded-[6px] text-xs font-mono font-bold text-center block bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
              >
                View Full {startupB.name} Dossier →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompetitorCompare;
