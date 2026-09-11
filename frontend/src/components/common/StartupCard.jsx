import React from 'react';
import { Link } from 'react-router-dom';
import { FailureScoreBadge } from './FailureScoreBadge';
import { formatCurrency } from '../../lib/utils';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useBookmarks } from '../../hooks/useBookmarks';

export function StartupCard({ startup, compact = false }) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(startup?.id);

  if (!startup) return null;

  return (
    <div className="card-editorial flex flex-col justify-between h-full group">
      <div>
        {/* Card Header: Industry, Failure Score & Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="badge-neutral text-[11px] font-bold">
              {startup.industry}
            </span>
            <span className="text-[#555555] dark:text-white/40 text-[12px]">
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
              className="text-[#555555] hover:text-black dark:text-white/50 dark:hover:text-white transition-colors p-1"
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
          <h3 className="text-[20px] font-extrabold tracking-tight text-black dark:text-white flex items-center justify-between">
            <span>{startup.name}</span>
            <span className="text-[16px] text-[#555555] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
              →
            </span>
          </h3>
        </Link>
        <p className="mt-2 text-[13px] text-[#555555] dark:text-white/70 line-clamp-2 leading-relaxed">
          {startup.tagline || startup.summary}
        </p>

        {/* Fatal Failure Mode */}
        <div className="mt-4 pt-3 border-t border-[#EFEFEF] dark:border-[#202020]">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#555555] dark:text-white/50 mb-1">
            FATAL FAILURE VECTOR
          </div>
          <div className="text-[13px] font-bold text-black dark:text-white line-clamp-1">
            {startup.failureMode}
          </div>
          {startup.rootCauses && startup.rootCauses.length > 0 && !compact && (
            <p className="mt-1 text-[12px] text-[#555555] dark:text-white/60 line-clamp-2 italic">
              "{startup.rootCauses[0]}"
            </p>
          )}
        </div>
      </div>

      {/* Card Footer: Metrics & Link */}
      <div className="mt-5 pt-3 border-t border-[#EFEFEF] dark:border-[#202020] flex items-center justify-between text-[13px]">
        <div className="flex items-center gap-3">
          <div className="font-bold text-black dark:text-white">
            <span>{formatCurrency(startup.capitalRaised)}</span>
            <span className="font-normal text-[11px] text-[#555555] dark:text-white/50 ml-1">lost</span>
          </div>
          <span className="text-[#555555] dark:text-white/40">•</span>
          <div className="text-[12px] text-[#555555] dark:text-white/60">
            {startup.foundedYear}–{startup.failedYear}
          </div>
        </div>

        <Link
          to={`/startup/${startup.id}`}
          className="font-bold text-[13px] text-black dark:text-white hover:underline inline-flex items-center gap-1"
        >
          <span>Dossier</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

export default StartupCard;

