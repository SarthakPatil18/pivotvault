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
      className="flex flex-col justify-between h-full group transition-all duration-200"
      style={{
        backgroundColor: '#fbfaf9',
        border: '1px solid #dcdbda',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: 'rgba(0, 0, 0, 0.04) 0px 2px 8px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.08) 0px 8px 24px';
        e.currentTarget.style.borderColor = '#a7a6a4';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.04) 0px 2px 8px';
        e.currentTarget.style.borderColor = '#dcdbda';
      }}
    >
      <div>
        {/* Card Header: Industry, Failure Score & Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span 
              style={{
                backgroundColor: '#f6f5f3',
                color: '#373634',
                border: '1px solid #ecebea',
                borderRadius: '9999px',
                fontSize: '12px',
                padding: '3px 10px',
              }}
            >
              {startup.industry}
            </span>
            <span 
              style={{
                background: 'transparent',
                color: '#787673',
                fontSize: '12px',
              }}
            >
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
              className="p-1 transition-colors"
              style={{ color: '#787673' }}
              title={bookmarked ? "Remove bookmark" : "Save startup"}
              aria-label="Bookmark startup"
            >
              {bookmarked ? (
                <BookmarkCheck className="w-4 h-4" style={{ color: '#2d72f0' }} />
              ) : (
                <Bookmark className="w-4 h-4 hover:text-[#111111]" />
              )}
            </button>
          </div>
        </div>

        {/* Startup Name & Summary */}
        <Link to={`/startup/${startup.id}`} className="block">
          <div className="flex items-center gap-3">
            <CompanyLogo startup={startup} size="md" />
            <h3 
              className="flex items-center justify-between flex-1 group-hover:text-[#2d72f0] transition-colors"
              style={{
                color: '#111111',
                fontSize: '24px',
                fontWeight: 700,
              }}
            >
              <span>{startup.name}</span>
              <span className="text-[16px] text-[#2d72f0] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                →
              </span>
            </h3>
          </div>
        </Link>
        <p 
          className="mt-2 line-clamp-2 leading-relaxed"
          style={{
            color: '#5e5c5a',
            fontSize: '14px',
          }}
        >
          {startup.tagline || startup.summary}
        </p>

        {/* Fatal Failure Mode */}
        <div className="mt-4 pt-3 border-t border-[#ecebea]">
          <div 
            style={{
              color: '#787673',
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '4px',
            }}
          >
            FATAL FAILURE VECTOR
          </div>
          <div 
            className="line-clamp-1"
            style={{
              color: '#111111',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            {startup.failureMode}
          </div>
          {startup.rootCauses && startup.rootCauses.length > 0 && !compact && (
            <p 
              className="mt-1 line-clamp-2"
              style={{
                color: '#787673',
                fontSize: '13px',
                fontStyle: 'italic',
              }}
            >
              "{startup.rootCauses[0]}"
            </p>
          )}
        </div>
      </div>

      {/* Card Footer: Metrics & Link */}
      <div className="mt-5 pt-3 border-t border-[#ecebea] flex items-center justify-between text-[13px]">
        <div className="flex items-center gap-2">
          <span 
            style={{
              color: '#e16540',
              fontWeight: 600,
              fontFeatureSettings: '"tnum"',
              letterSpacing: '-0.42px',
            }}
          >
            {formatCurrency(startup.capitalRaised)} lost
          </span>
          <span style={{ color: '#dcdbda' }}>•</span>
          <span style={{ color: '#787673', fontSize: '13px' }}>
            {startup.foundedYear}–{startup.failedYear}
          </span>
        </div>

        <Link
          to={`/startup/${startup.id}`}
          className="hover:underline inline-flex items-center gap-1"
          style={{
            color: '#2d72f0',
            fontWeight: 500,
          }}
        >
          <span>Dossier</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

export default StartupCard;
