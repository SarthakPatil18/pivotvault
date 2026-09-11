import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PlaybookCard({ playbook }) {
  if (!playbook) return null;

  return (
    <div className="vault-card p-6 flex flex-col justify-between h-full border-[#E5E5E5] dark:border-[#2A2A2A]">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="vault-badge vault-badge-neutral text-[10px]">
            Risk: {playbook.riskCategory}
          </span>
          <span className="text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3]">
            {playbook.historicalFailuresCount}+ Historical Cases
          </span>
        </div>

        <h3 className="text-base font-bold font-sans text-black dark:text-white mb-2">
          {playbook.title}
        </h3>

        <p className="text-xs text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
          {playbook.description}
        </p>

        {/* Action Steps */}
        <div className="space-y-2 border-t border-[#E5E5E5] dark:border-[#2A2A2A] pt-3">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3]">
            Defensive Execution Moves:
          </div>
          {playbook.actions?.map((action, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-[#404040] dark:text-[#D4D4D4]">
              <CheckCircle className="w-3.5 h-3.5 text-black dark:text-white shrink-0 mt-0.5" />
              <span>{action}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between text-xs font-mono">
        <span className="text-[#737373] dark:text-[#A3A3A3] text-[11px]">
          Examples: {playbook.examples?.join(', ')}
        </span>
        <Link
          to={`/explore?failureMode=${encodeURIComponent(playbook.failureMode || '')}`}
          className="text-black dark:text-white hover:underline font-bold flex items-center gap-1"
        >
          <span>Examine Autopsies</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

export default PlaybookCard;
