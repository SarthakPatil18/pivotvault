import React from 'react';
import { Link } from 'react-router-dom';
import { FailureScoreBadge } from './FailureScoreBadge';
import { CompanyLogo } from './CompanyLogo';
import { formatCurrency } from '../../lib/utils';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useBookmarks } from '../../hooks/useBookmarks';

export function StartupCard({ startup, compact = false }) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(startup?.id);

  if (!startup) return null;

  return (
    <div 
      className="flex flex-col justify-between h-full group transition-all duration-150 bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-black dark:hover:border-white rounded-[8px] p-5 shadow-xs hover:shadow-dropdown"
    >
      <div>
        {/* Card Header: Industry, Failure Score & Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[4px] text-[10px] px-2 py-0.5 font-mono font-bold uppercase tracking-wider">
              {startup.industry}
            </span>
            <span className="text-[#737373] dark:text-[#A3A3A3] text-[11px] font-mono">
              {startup.country}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FailureScoreBadge score={startup.failureScore} size="sm" />
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleBookmark(startup.id);
              }}
              className="p-1 text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white transition-colors"
              title={bookmarked ? "Remove bookmark" : "Save startup"}
              aria-label="Bookmark startup"
            >
              {bookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-black dark:text-white" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Startup Name & Summary */}
        <Link to={`/startup/${startup.id}`} className="block">
          <div className="flex items-center gap-3">
            <CompanyLogo startup={startup} size="md" />
            <h3 className="flex items-center justify-between flex-1 text-lg sm:text-xl font-extrabold text-black dark:text-white transition-colors">
              <span>{startup.name}</span>
              <span className="text-[14px] text-black dark:text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                →
              </span>
            </h3>
          </div>
        </Link>
        <p className="mt-2 line-clamp-2 leading-relaxed text-[13px] text-[#737373] dark:text-[#A3A3A3]">
          {startup.tagline || startup.summary}
        </p>

        {/* Fatal Failure Mode */}
        <div className="mt-4 pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
          <div className="text-[#737373] dark:text-[#A3A3A3] text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
            Fatal Failure Vector
          </div>
          <div className="line-clamp-1 text-[13px] font-bold text-black dark:text-white">
            {startup.failureMode}
          </div>
          {startup.rootCauses && startup.rootCauses.length > 0 && !compact && (
            <p className="mt-1 line-clamp-2 text-[12px] italic text-[#737373] dark:text-[#A3A3A3]">
              "{startup.rootCauses[0]}"
            </p>
          )}
        </div>
      </div>

      {/* Card Footer: Metrics & Link */}
      <div className="mt-5 pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between text-[12px] font-mono">
        <div className="flex items-center gap-2">
          <span className="font-bold text-black dark:text-white">
            {formatCurrency(startup.capitalRaised)} lost
          </span>
          <span className="text-[#A3A3A3] dark:text-[#404040]">•</span>
          <span className="text-[#737373] dark:text-[#A3A3A3]">
            {startup.foundedYear}–{startup.failedYear}
          </span>
        </div>

        <Link
          to={`/startup/${startup.id}`}
          className="inline-flex items-center gap-1 text-black dark:text-white font-bold hover:underline"
        >
          <span>Dossier</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

export default StartupCard;
