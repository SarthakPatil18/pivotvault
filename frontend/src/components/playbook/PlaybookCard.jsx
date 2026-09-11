import React from 'react';
import { ArrowRight, CheckCircle, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PlaybookCard({ playbook }) {
  if (!playbook) return null;

  return (
    <div className="vault-card p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="vault-badge vault-badge-red text-[11px]">
            Risk: {playbook.riskCategory}
          </span>
          <span className="text-[10px] font-mono text-neutral-400">
            {playbook.historicalFailuresCount}+ Historical Cases
          </span>
        </div>

        <h3 className="text-base font-bold font-sans text-neutral-950 dark:text-neutral-50 mb-2">
          {playbook.title}
        </h3>

        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
          {playbook.description}
        </p>

        {/* Action Steps */}
        <div className="space-y-2 border-t border-neutral-100 dark:border-neutral-800 pt-3">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
            Defensive Execution Moves:
          </div>
          {playbook.actions?.map((action, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
              <CheckCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
              <span>{action}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-mono">
        <span className="text-neutral-400 text-[11px]">
          Examples: {playbook.examples?.join(', ')}
        </span>
        <Link
          to={`/explore?failureMode=${encodeURIComponent(playbook.failureMode || '')}`}
          className="text-neutral-900 dark:text-neutral-100 hover:text-rose-600 dark:hover:text-rose-400 font-bold flex items-center gap-1"
        >
          <span>Examine Autopsies</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

export default PlaybookCard;
