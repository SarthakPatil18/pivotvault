import React from 'react';
import { formatCurrency } from '../../lib/utils';
import { Users, DollarSign, Briefcase, FileCheck } from 'lucide-react';
import { StartupCard } from '../common/StartupCard';

export function FinancialSummary({ startup }) {
  if (!startup) return null;

  return (
    <div className="space-y-6">
      {/* People / Founders & Leadership */}
      <div className="vault-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1 rounded bg-neutral-100 dark:bg-neutral-800">
            <Users className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
          </div>
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
            Founders & Key Leadership
          </h3>
        </div>

        <div className="space-y-3">
          {startup.founders?.map((person, idx) => (
            <div key={idx} className="p-3 rounded bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 font-sans block">
                  {person.name}
                </span>
                <span className="text-[11px] font-mono text-neutral-500">
                  {person.role}
                </span>
              </div>
              {person.background && (
                <span className="text-xs text-neutral-500 italic max-w-sm sm:text-right">
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
            <div className="p-1 rounded bg-neutral-100 dark:bg-neutral-800">
              <Briefcase className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            </div>
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
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
        <div className="vault-card p-6 bg-neutral-50/40 dark:bg-neutral-900/20">
          <div className="flex items-center gap-2 mb-3">
            <FileCheck className="w-4 h-4 text-rose-600" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              Primary Verified Autopsy Sources
            </h3>
          </div>
          <ul className="space-y-1.5 text-xs font-mono text-neutral-500 dark:text-neutral-400">
            {startup.evidenceSources.map((source, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-rose-600 font-bold">•</span>
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
    <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold font-sans tracking-tight text-neutral-950 dark:text-neutral-50">
            Related Failure Case Studies
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
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
