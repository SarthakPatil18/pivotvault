import React from 'react';
import { FailureScoreBadge } from '../common/FailureScoreBadge';
import { CompanyLogo } from '../common/CompanyLogo';
import { formatCurrency } from '../../lib/utils';
import { Bookmark, BookmarkCheck, Share2, MessageSquare, ExternalLink } from 'lucide-react';
import { useBookmarks } from '../../hooks/useBookmarks';
import { getFounderWikipediaUrl } from '../../lib/wikipedia';
import { GhostIcon } from '../common/GhostIcon';

export function StartupHeader({ startup, onOpenFounderChat }) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(startup.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Autopsy link copied to clipboard!');
    }
  };

  const founderList = (startup.founders || []).map(f => typeof f === 'string' ? f : (f?.name || '')).filter(Boolean);
  const primaryFounder = founderList[0] || 'Founder';

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
            {founderList.length > 0 && (
              <>
                <span className="text-[#A3A3A3] dark:text-[#737373]">•</span>
                <span className="text-[#737373] dark:text-[#A3A3A3] inline-flex items-center gap-1 flex-wrap">
                  Founder{founderList.length > 1 ? 's' : ''}:
                  {founderList.map((fn, idx) => {
                    const wikiUrl = getFounderWikipediaUrl(fn);
                    return (
                      <span key={idx} className="inline-flex items-center">
                        {wikiUrl ? (
                          <a
                            href={wikiUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black dark:text-white font-bold hover:underline inline-flex items-center gap-0.5 cursor-pointer group"
                            title={`View ${fn}'s Wikipedia biography`}
                          >
                            <span>{fn}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-[#737373] group-hover:text-black dark:group-hover:text-white" />
                          </a>
                        ) : (
                          <strong className="text-black dark:text-white font-bold">{fn}</strong>
                        )}
                        {idx < founderList.length - 1 && <span className="mr-1">,</span>}
                      </span>
                    );
                  })}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-5">
            <CompanyLogo 
              startup={startup} 
              size="2xl" 
              className="shadow-md rounded-[14px] p-2 bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] shrink-0" 
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-sans tracking-tight text-black dark:text-white">
                {startup.name}
              </h1>
              <p className="mt-2 text-base sm:text-lg text-[#404040] dark:text-[#D4D4D4] leading-relaxed font-sans">
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

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={onOpenFounderChat}
              className="vault-btn-primary text-xs flex items-center gap-1.5 font-mono shadow-xs hover:scale-102 active:scale-98 transition-all"
              title={`Interrogate ${primaryFounder} (Gemini AI Chat)`}
            >
              <GhostIcon className="w-3.5 h-3.5" />
              <span>Ask Founder Ghost</span>
            </button>
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
