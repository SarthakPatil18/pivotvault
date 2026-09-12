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

  // Single essential failure reason (eliminate repetitive duplicates)
  const failureReason = startup.failureMode || 
    (Array.isArray(startup.rootCauses) && startup.rootCauses[0]) || 
    startup.tagline || 
    startup.summary || 
    'Unit economics inversion';

  const cleanCountry = (startup.country?.toLowerCase().includes('united states') || startup.country?.toLowerCase().includes('us'))
    ? 'USA' 
    : (startup.country || '');

  return (
    <Link 
      to={`/startup/${startup.id}`}
      className="group block h-full bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#242424] hover:border-black dark:hover:border-white rounded-[12px] p-5 transition-all duration-150 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] flex flex-col justify-between"
    >
      <div>
        {/* Top Meta: Industry & Failure Score */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#666666] dark:text-[#999999] bg-[#F5F5F5] dark:bg-[#161616] px-2 py-0.5 rounded-[4px] border border-[#EAEAEA] dark:border-[#222222]">
            {startup.industry}
          </span>
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

        {/* Company Header: Logo, Name & Origin */}
        <div className="flex items-center gap-3.5 mb-3">
          <CompanyLogo startup={startup} size="lg" className="rounded-[10px] shadow-xs shrink-0" />
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-[17px] font-bold text-black dark:text-white truncate group-hover:underline">
              {startup.name}
            </h3>
            <div className="text-[11.5px] font-mono text-[#737373] dark:text-[#A3A3A3] mt-0.5">
              {cleanCountry ? `${cleanCountry} • ` : ''}{startup.foundedYear}–{startup.failedYear}
            </div>
          </div>
        </div>

        {/* Essential Core Failure Vector */}
        <p className="text-xs sm:text-[13px] text-[#444444] dark:text-[#BBBBBB] leading-relaxed line-clamp-2 mt-2 font-sans">
          {failureReason}
        </p>
      </div>

      {/* Footer: Capital Lost & Action */}
      <div className="mt-4 pt-3 border-t border-[#EAEAEA] dark:border-[#1E1E1E] flex items-center justify-between text-xs font-mono">
        <span className="font-bold text-black dark:text-white">
          {formatCurrency(startup.capitalRaised)} lost
        </span>
        <span className="text-black dark:text-white font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          <span>Dossier</span>
          <span>→</span>
        </span>
      </div>
    </Link>
  );
}

export default StartupCard;
