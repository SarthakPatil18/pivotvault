import React from 'react';
import { ArrowRight, Lightbulb, ShieldAlert, Sparkles, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export function InsightCard({ title, description, category = 'Pattern Insight', metric, linkTo, iconType = 'lightbulb' }) {
  const getIcon = () => {
    switch (iconType) {
      case 'alert':
        return <ShieldAlert className="w-4 h-4 text-[#ea2261]" />;
      case 'trend':
        return <TrendingDown className="w-4 h-4 text-[#533afd]" />;
      case 'sparkles':
        return <Sparkles className="w-4 h-4 text-[#533afd]" />;
      default:
        return <Lightbulb className="w-4 h-4 text-[#533afd]" />;
    }
  };

  const CardWrapper = linkTo ? Link : 'div';

  return (
    <CardWrapper 
      to={linkTo} 
      className="flex flex-col justify-between block group transition-all"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e8ee',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: 'rgba(0, 55, 112, 0.06) 0px 2px 8px'
      }}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span 
            style={{
              backgroundColor: '#f6f9fc',
              color: '#273951',
              border: '1px solid #e3e8ee',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 500,
              padding: '2px 10px'
            }}
          >
            {category}
          </span>
          <div 
            className="p-1.5 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: '#f6f9fc',
              border: '1px solid #e3e8ee'
            }}
          >
            {getIcon()}
          </div>
        </div>

        <h4 
          className="text-[18px] font-bold transition-colors group-hover:text-[#533afd]"
          style={{ color: '#0d253d' }}
        >
          {title}
        </h4>

        <p className="mt-2 text-[13px] leading-relaxed" style={{ color: '#64748d' }}>
          {description}
        </p>
      </div>

      {(metric || linkTo) && (
        <div className="mt-5 pt-3 border-t border-[#e3e8ee] flex items-center justify-between text-[13px]">
          {metric ? (
            <span 
              className="font-bold text-[12px]"
              style={{ color: '#ea2261', fontFeatureSettings: '"tnum"' }}
            >
              {metric}
            </span>
          ) : <span />}
          
          {linkTo && (
            <span 
              className="inline-flex items-center gap-1 font-medium hover:underline"
              style={{ color: '#533afd' }}
            >
              <span>Explore Pattern</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          )}
        </div>
      )}
    </CardWrapper>
  );
}

export function LoadingState({ message = 'Accessing startup intelligence records...' }) {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-8 h-8 border-2 border-[#b9b9f9] border-t-[#533afd] rounded-full animate-spin" />
      </div>
      <p className="text-[12px] font-medium uppercase tracking-wider" style={{ color: '#64748d' }}>
        {message}
      </p>
    </div>
  );
}

export function EmptyState({ 
  title = 'No intelligence records found', 
  description = 'Try adjusting your search criteria, clearing filters, or exploring a different category.',
  actionLabel,
  onAction
}) {
  return (
    <div 
      className="text-center my-8 flex flex-col items-center justify-center"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e8ee',
        borderRadius: '16px',
        padding: '48px 24px',
        boxShadow: 'rgba(0, 55, 112, 0.06) 0px 2px 8px'
      }}
    >
      <div 
        className="w-12 h-12 mb-4 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: '#f6f9fc',
          border: '1px solid #e3e8ee',
          color: '#533afd'
        }}
      >
        <ShieldAlert className="w-6 h-6 text-[#533afd]" />
      </div>
      <h3 className="text-[18px] font-bold" style={{ color: '#0d253d' }}>
        {title}
      </h3>
      <p className="mt-2 text-[14px] max-w-md mx-auto" style={{ color: '#64748d' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 transition-colors"
          style={{
            backgroundColor: '#533afd',
            color: '#ffffff',
            borderRadius: '9999px',
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4434d4'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#533afd'}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default InsightCard;
