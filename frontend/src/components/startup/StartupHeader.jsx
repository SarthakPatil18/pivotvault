import React from 'react';
import { FailureScoreBadge } from '../common/FailureScoreBadge';
import { CompanyLogo } from '../common/CompanyLogo';
import { formatCurrency } from '../../lib/utils';
import { Bookmark, BookmarkCheck, Share2 } from 'lucide-react';
import { useBookmarks } from '../../hooks/useBookmarks';

export function StartupHeader({ startup }) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(startup.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Autopsy link copied to clipboard!');
    }
  };

  return (
    <div className="vault-card p-6 sm:p-8 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        {/* Left Info Column */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap font-mono text-[11px]">
            <span className="vault-badge vault-badge-neutral text-[10px]">
              {startup.industry}
            </span>
            <span className="text-[#A3A3A3] dark:text-[#737373]">•</span>
            <span className="vault-badge vault-badge-neutral text-[10px]">
              {startup.country}
            </span>
            <span className="text-[#A3A3A3] dark:text-[#737373]">•</span>
            <span className="text-[#737373] dark:text-[#A3A3A3]">
              Status: <strong className="text-black dark:text-white font-bold">{startup.status}</strong>
            </span>
          </div>

          <div className="flex items-start gap-4">
            <CompanyLogo startup={startup} size="xl" className="shadow-xs mt-1" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-sans tracking-tight text-black dark:text-white">
                {startup.name}
              </h1>
              <p className="mt-2 text-base text-[#404040] dark:text-[#D4D4D4] leading-relaxed font-sans">
                {startup.tagline}
              </p>
            </div>
          </div>

          <p className="text-xs text-[#737373] dark:text-[#A3A3A3] leading-relaxed border-l-2 border-black dark:border-white pl-3 py-1 font-sans">
            {startup.summary}
          </p>

          {/* Quick Metrics Strip */}
          <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-8 text-xs font-mono">
            <div>
              <span className="text-[#737373] dark:text-[#A3A3A3] block text-[10px] uppercase">Capital Evaporated</span>
              <span className="text-base font-bold text-black dark:text-white">
                {formatCurrency(startup.capitalRaised)}
              </span>
            </div>
            {startup.peakValuation && (
              <div>
                <span className="text-[#737373] dark:text-[#A3A3A3] block text-[10px] uppercase">Peak Valuation</span>
                <span className="text-base font-bold text-black dark:text-white">
                  {formatCurrency(startup.peakValuation)}
                </span>
              </div>
            )}
            <div>
              <span className="text-[#737373] dark:text-[#A3A3A3] block text-[10px] uppercase">Active Lifespan</span>
              <span className="text-base font-bold text-black dark:text-white">
                {startup.foundedYear} – {startup.failedYear} ({startup.failedYear - startup.foundedYear} yrs)
              </span>
            </div>
          </div>
        </div>

        {/* Right Score & Actions Box */}
        <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-[#E5E5E5] dark:border-[#2A2A2A] pt-4 lg:pt-0 lg:pl-6 shrink-0">
          <div className="flex flex-col items-start lg:items-end">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-1">
              Diagnostic Failure Score
            </span>
            <FailureScoreBadge score={startup.failureScore} size="lg" showLabel={true} />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmark(startup.id)}
              className="vault-btn-secondary text-xs flex items-center gap-1.5 font-mono"
            >
              {bookmarked ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-black dark:text-white" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-black dark:text-white" />
                  <span>Bookmark</span>
                </>
              )}
            </button>
            <button
              onClick={handleShare}
              className="vault-btn-secondary text-xs p-2"
              title="Share autopsy"
            >
              <Share2 className="w-3.5 h-3.5 text-black dark:text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartupHeader;
