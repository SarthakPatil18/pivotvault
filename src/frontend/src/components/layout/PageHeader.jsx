import React from 'react';
import { Link } from 'react-router-dom';

export function PageHeader({ 
  title, 
  subtitle, 
  badge, 
  breadcrumbs = [], 
  actions,
  tagline
}) {
  return (
    <div className="py-7 sm:py-9 border-b border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#0A0A0A] mb-8 transition-colors">
      <div className="vault-container">
        {/* Breadcrumbs & Tagline */}
        <div className="flex items-center gap-2 text-[12px] text-[#737373] dark:text-[#A3A3A3] mb-2.5 flex-wrap">
          {badge && (
            <span className="vault-badge-neutral font-mono text-[10px]">
              {badge}
            </span>
          )}

          {breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1.5 font-mono text-[11px]" aria-label="Breadcrumb">
              <Link to="/app" className="hover:text-black dark:hover:text-white transition-colors">
                PivotVault
              </Link>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.label + idx}>
                  <span className="text-[#A3A3A3] dark:text-[#404040]">/</span>
                  {crumb.href ? (
                    <Link to={crumb.href} className="hover:text-black dark:hover:text-white transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-black dark:text-white font-bold">
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}

          {tagline && (
            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              <span className="text-[#A3A3A3] dark:text-[#404040]">/</span>
              <span className="text-black dark:text-white font-bold uppercase tracking-wider">
                {tagline}
              </span>
            </div>
          )}
        </div>

        {/* Title and Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-black dark:text-white">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-2 max-w-3xl leading-relaxed text-[14px] text-[#737373] dark:text-[#A3A3A3]">
                {subtitle}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex items-center gap-2.5 shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PageHeader;
