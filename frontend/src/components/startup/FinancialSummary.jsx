import React from 'react';
import { Users, Briefcase, FileCheck } from 'lucide-react';
import { StartupCard } from '../common/StartupCard';

export function FinancialSummary({ startup }) {
  if (!startup) return null;

  return (
    <div className="space-y-6">
      {/* People / Founders & Leadership */}
      <div className="vault-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <Users className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-black dark:text-white">
            Founders & Key Leadership
          </h3>
        </div>

        <div className="space-y-2.5">
          {startup.founders?.map((person, idx) => (
            <div key={idx} className="p-3 rounded-[6px] bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-xs text-black dark:text-white font-sans block">
                  {person.name}
                </span>
                <span className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                  {person.role}
                </span>
              </div>
              {person.background && (
                <span className="text-xs text-[#737373] dark:text-[#A3A3A3] italic max-w-sm sm:text-right">
                  {person.background}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Investors & Cap Table Backing */}
      {startup.investors && startup.investors.length > 0 && (
        <div className="vault-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]">
              <Briefcase className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-black dark:text-white">
              Notable Investors & Backers
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {startup.investors.map((inv, idx) => (
              <span key={idx} className="vault-badge vault-badge-neutral text-xs py-1 px-2.5">
                {inv}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Verified Evidence Sources */}
      {startup.evidenceSources && (
        <div className="vault-card p-6 bg-[#FAFAFA] dark:bg-[#0A0A0A]">
          <div className="flex items-center gap-2 mb-3">
            <FileCheck className="w-4 h-4 text-black dark:text-white" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white">
              Primary Verified Autopsy Sources
            </h3>
          </div>
          <ul className="space-y-1.5 text-xs font-mono text-[#737373] dark:text-[#A3A3A3]">
            {startup.evidenceSources.map((source, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-black dark:text-white font-bold">•</span>
                <span>{source}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function RelatedStartups({ startups = [] }) {
  if (!startups || startups.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold font-sans tracking-tight text-black dark:text-white">
            Related Failure Case Studies
          </h3>
          <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
            Startups with matching industry dynamics or analogous failure vectors.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {startups.map((s) => (
          <StartupCard key={s.id} startup={s} compact={true} />
        ))}
      </div>
    </div>
  );
}

export default FinancialSummary;
