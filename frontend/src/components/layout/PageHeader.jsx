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
    <div className="py-8 sm:py-10 border-b border-[#e3e8ee] bg-[#f6f9fc] mb-8 transition-colors">
      <div className="vault-container">
        {/* Breadcrumbs & Tagline */}
        <div className="flex items-center gap-2 text-[12px] text-[#64748d] mb-3 flex-wrap">
          {badge && (
            <span 
              style={{
                backgroundColor: '#b9b9f9',
                color: '#4434d4',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 500,
                padding: '4px 12px',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              {badge}
            </span>
          )}

          {breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1.5 font-sans" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-[#0d253d] transition-colors">
                PivotVault
              </Link>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.label + idx}>
                  <span className="text-[#e3e8ee]">//</span>
                  {crumb.href ? (
                    <Link to={crumb.href} className="hover:text-[#0d253d] transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-[#273951] font-medium">
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}

          {tagline && (
            <div className="flex items-center gap-1.5">
              <span className="text-[#e3e8ee]">//</span>
              <span 
                style={{
                  color: '#533afd',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase'
                }}
              >
                {tagline}
              </span>
            </div>
          )}
        </div>

        {/* Title and Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 
              className="text-2xl sm:text-3xl lg:text-4xl tracking-tight"
              style={{
                color: '#0d253d',
                fontWeight: 700
              }}
            >
              {title}
            </h1>

            {subtitle && (
              <p 
                className="mt-2 max-w-3xl leading-relaxed"
                style={{
                  color: '#64748d',
                  fontSize: '15px'
                }}
              >
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
