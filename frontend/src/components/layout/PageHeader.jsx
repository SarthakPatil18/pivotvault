import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function PageHeader({ 
  title, 
  subtitle, 
  badge, 
  breadcrumbs = [], 
  actions,
  tagline
}) {
  return (
    <div className="py-8 sm:py-10 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/20 mb-8 transition-colors">
      <div className="vault-container">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 mb-3" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
              PivotVault
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.label + idx}>
                <ChevronRight className="w-3 h-3 text-neutral-400" />
                {crumb.href ? (
                  <Link to={crumb.href} className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Title and Badges */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
              {badge && (
                <span className="vault-badge vault-badge-red text-[11px]">
                  {badge}
                </span>
              )}
              {tagline && (
                <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                  // {tagline}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-neutral-950 dark:text-neutral-50">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
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
