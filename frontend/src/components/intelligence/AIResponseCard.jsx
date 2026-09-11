import React from 'react';
import { FileText, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FailureScoreBadge } from '../common/FailureScoreBadge';

export function EvidenceCard({ title, source, citation, date, confidence = 'High (Court / SEC Verified)' }) {
  return (
    <div className="vault-card p-4 text-xs space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5 text-rose-600" />
          {source}
        </span>
        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
          {confidence}
        </span>
      </div>

      <h5 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
        {title}
      </h5>

      {citation && (
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 italic border-l-2 border-neutral-300 dark:border-neutral-700 pl-2.5 py-0.5">
          "{citation}"
        </p>
      )}

      {date && (
        <div className="text-[10px] font-mono text-neutral-400 pt-1">
          Documented: {date}
        </div>
      )}
    </div>
  );
}

export function AIResponseCard({ response, onAskFollowUp }) {
  if (!response) return null;

  return (
    <div className="vault-card p-6 space-y-5 border-neutral-300 dark:border-neutral-700 shadow-sm animate-fade-in">
      {/* Response Header */}
      <div className="flex items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
            AI Failure Reasoning Engine
          </span>
        </div>
        <span className="text-[10px] font-mono text-neutral-400">
          Cross-referenced with 413+ post-mortems
        </span>
      </div>

      {/* Main Synthesized Text */}
      <div className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed space-y-3 font-sans">
        <p>{response.answer}</p>
      </div>

      {/* Failure Patterns Identified */}
      {response.failurePatterns && response.failurePatterns.length > 0 && (
        <div className="pt-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
            Identified Failure Patterns
          </div>
          <div className="flex flex-wrap gap-1.5">
            {response.failurePatterns.map((pattern, idx) => (
              <span key={idx} className="vault-badge vault-badge-red text-[11px]">
                {pattern}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related Case Autopsies */}
      {response.relatedStartups && response.relatedStartups.length > 0 && (
        <div className="pt-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
            Historical Parallels
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {response.relatedStartups.map((s) => (
              <Link
                key={s.id}
                to={`/startup/${s.id}`}
                className="p-2.5 rounded border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-neutral-50 dark:bg-neutral-900/60 block group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold font-sans text-neutral-900 dark:text-neutral-100 group-hover:text-rose-600">
                    {s.name}
                  </span>
                  <FailureScoreBadge score={s.failureScore} size="sm" />
                </div>
                <p className="text-[11px] text-neutral-500 truncate">
                  {s.failureMode}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Evidence Sources */}
      {response.evidenceCitations && response.evidenceCitations.length > 0 && (
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
            Verified Evidence Citations
          </div>
          <ul className="space-y-1">
            {response.evidenceCitations.map((cite, idx) => (
              <li key={idx} className="text-xs font-mono text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                <span className="text-rose-600 font-bold">•</span>
                <span>{cite}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggested Next Inquiries */}
      {response.suggestedNextQueries && response.suggestedNextQueries.length > 0 && (
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
            Suggested Investigation Prompts
          </div>
          <div className="space-y-1.5">
            {response.suggestedNextQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onAskFollowUp && onAskFollowUp(q)}
                className="w-full text-left p-2 rounded text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 border border-neutral-100 dark:border-neutral-800/50 flex items-center justify-between group"
              >
                <span>"{q}"</span>
                <span className="font-mono text-[11px] text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Ask →
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AIResponseCard;
