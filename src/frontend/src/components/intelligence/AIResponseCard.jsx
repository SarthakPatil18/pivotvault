import React from 'react';
import { FileText, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FailureScoreBadge } from '../common/FailureScoreBadge';

export function EvidenceCard({ title, source, citation, date, confidence = 'High (Court / SEC Verified)' }) {
  return (
    <div className="vault-card p-4 text-xs space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5 text-black dark:text-white" />
          {source}
        </span>
        <span className="px-1.5 py-0.5 rounded-[4px] text-[10px] font-mono bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]">
          {confidence}
        </span>
      </div>

      <h5 className="font-bold text-black dark:text-white text-xs">
        {title}
      </h5>

      {citation && (
        <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3] italic border-l-2 border-black dark:border-white pl-2.5 py-0.5">
          "{citation}"
        </p>
      )}

      {date && (
        <div className="text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3] pt-1">
          Documented: {date}
        </div>
      )}
    </div>
  );
}

export function AIResponseCard({ response, onAskFollowUp }) {
  if (!response) return null;

  return (
    <div className="vault-card p-6 space-y-5 shadow-sm animate-fade-in">
      {/* Response Header */}
      <div className="flex items-center justify-between gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-[4px] bg-black dark:bg-white text-white dark:text-black">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white">
            AI Failure Reasoning Engine
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3]">
          Cross-referenced with 413+ post-mortems
        </span>
      </div>

      {/* Main Synthesized Text */}
      <div className="text-sm text-black dark:text-white leading-relaxed space-y-3 font-sans">
        <p>{response.answer}</p>
      </div>

      {/* Failure Patterns Identified */}
      {response.failurePatterns && response.failurePatterns.length > 0 && (
        <div className="pt-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-2">
            Identified Failure Patterns
          </div>
          <div className="flex flex-wrap gap-1.5">
            {response.failurePatterns.map((pattern, idx) => (
              <span key={idx} className="vault-badge vault-badge-neutral text-[11px]">
                {pattern}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related Case Autopsies */}
      {response.relatedStartups && response.relatedStartups.length > 0 && (
        <div className="pt-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-2">
            Historical Parallels
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {response.relatedStartups.map((s) => (
              <Link
                key={s.id}
                to={`/startup/${s.id}`}
                className="p-2.5 rounded-[6px] border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-black dark:hover:border-white bg-[#F5F5F5] dark:bg-[#1A1A1A] block group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold font-sans text-black dark:text-white group-hover:underline">
                    {s.name}
                  </span>
                  <FailureScoreBadge score={s.failureScore} size="sm" />
                </div>
                <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3] truncate">
                  {s.failureMode}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Evidence Sources */}
      {response.evidenceCitations && response.evidenceCitations.length > 0 && (
        <div className="pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-1.5">
            Verified Evidence Citations
          </div>
          <ul className="space-y-1">
            {response.evidenceCitations.map((cite, idx) => (
              <li key={idx} className="text-xs font-mono text-black dark:text-white flex items-center gap-1.5">
                <span className="font-bold">•</span>
                <span>{cite}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggested Next Inquiries */}
      {response.suggestedNextQueries && response.suggestedNextQueries.length > 0 && (
        <div className="pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-2">
            Suggested Investigation Prompts
          </div>
          <div className="space-y-1.5">
            {response.suggestedNextQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onAskFollowUp && onAskFollowUp(q)}
                className="w-full text-left p-2 rounded-[4px] text-xs text-black dark:text-white hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between group cursor-pointer"
              >
                <span>"{q}"</span>
                <span className="font-mono text-[11px] text-black dark:text-white opacity-0 group-hover:opacity-100 transition-opacity">
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
