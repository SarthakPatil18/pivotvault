import React from 'react';
import { FailureScoreBadge } from '../common/FailureScoreBadge';
import { CompanyLogo } from '../common/CompanyLogo';
import { formatCurrency } from '../../lib/utils';
import { Building, Globe, Calendar, DollarSign, Bookmark, BookmarkCheck, Share2 } from 'lucide-react';
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
    <div className="vault-card p-6 sm:p-8 mb-8 bg-neutral-50/70 dark:bg-neutral-900/50">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        {/* Left Info Column */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="vault-badge vault-badge-neutral text-xs">
              {startup.industry}
            </span>
            <span className="text-neutral-400">•</span>
            <span className="vault-badge vault-badge-neutral text-xs">
              {startup.country}
            </span>
            <span className="text-neutral-400">•</span>
            <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
              Status: <strong className="text-rose-600 dark:text-rose-400 font-normal">{startup.status}</strong>
            </span>
          </div>

          <div className="flex items-start gap-4">
            <CompanyLogo startup={startup} size="xl" className="shadow-sm mt-1" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold font-sans tracking-tight text-neutral-950 dark:text-neutral-50">
                {startup.name}
              </h1>
              <p className="mt-2 text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                {startup.tagline}
              </p>
            </div>
          </div>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed border-l-2 border-neutral-300 dark:border-neutral-700 pl-3 py-1">
            {startup.summary}
          </p>

          {/* Quick Metrics Strip */}
          <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-8 text-xs font-mono">
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase">Capital Evaporated</span>
              <span className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                {formatCurrency(startup.capitalRaised)}
              </span>
            </div>
            {startup.peakValuation && (
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">Peak Valuation</span>
                <span className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  {formatCurrency(startup.peakValuation)}
                </span>
              </div>
            )}
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase">Active Lifespan</span>
              <span className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                {startup.foundedYear} – {startup.failedYear} ({startup.failedYear - startup.foundedYear} yrs)
              </span>
            </div>
          </div>
        </div>

        {/* Right Score & Actions Box */}
        <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-neutral-200 dark:border-neutral-800 pt-4 lg:pt-0 lg:pl-6 shrink-0">
          <div className="flex flex-col items-start lg:items-end">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Diagnostic Failure Score
            </span>
            <FailureScoreBadge score={startup.failureScore} size="lg" showLabel={true} />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmark(startup.id)}
              className="vault-btn-secondary text-xs flex items-center gap-1.5"
            >
              {bookmarked ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-rose-600" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Bookmark</span>
                </>
              )}
            </button>
            <button
              onClick={handleShare}
              className="vault-btn-secondary text-xs p-2"
              title="Share autopsy"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartupHeader;
