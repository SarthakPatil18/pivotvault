import React from 'react';
import { ArrowRight, Lightbulb, ShieldAlert, Sparkles, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export function InsightCard({ title, description, category = 'Pattern Insight', metric, linkTo, iconType = 'lightbulb' }) {
  const getIcon = () => {
    switch (iconType) {
      case 'alert':
        return <ShieldAlert className="w-3.5 h-3.5 text-black dark:text-white" />;
      case 'trend':
        return <TrendingDown className="w-3.5 h-3.5 text-black dark:text-white" />;
      case 'sparkles':
        return <Sparkles className="w-3.5 h-3.5 text-black dark:text-white" />;
      default:
        return <Lightbulb className="w-3.5 h-3.5 text-black dark:text-white" />;
    }
  };

  const CardWrapper = linkTo ? Link : 'div';

  return (
    <CardWrapper 
      to={linkTo} 
      className="flex flex-col justify-between block group transition-all duration-150 bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-black dark:hover:border-white rounded-[8px] p-6 shadow-xs"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[4px] text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5">
            {category}
          </span>
          <div className="p-1 rounded-[4px] flex items-center justify-center bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A]">
            {getIcon()}
          </div>
        </div>

        <h4 className="text-[17px] font-bold text-black dark:text-white transition-colors">
          {title}
        </h4>

        <p className="mt-2 text-[13px] leading-relaxed text-[#737373] dark:text-[#A3A3A3]">
          {description}
        </p>
      </div>

      {(metric || linkTo) && (
        <div className="mt-5 pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between text-[12px] font-mono">
          {metric ? (
            <span 
              className="font-bold text-black dark:text-white"
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              {metric}
            </span>
          ) : <span />}
          
          {linkTo && (
            <span className="inline-flex items-center gap-1 font-bold text-black dark:text-white hover:underline transition-colors">
              <span>Explore Pattern</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
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
      <div className="relative flex items-center justify-center mb-3">
        <div className="w-7 h-7 border-2 border-[#E5E5E5] border-t-black dark:border-[#2A2A2A] dark:border-t-white rounded-full animate-spin" />
      </div>
      <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3]">
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
    <div className="text-center my-8 flex flex-col items-center justify-center bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] p-12 shadow-xs">
      <div className="w-10 h-10 mb-3 rounded-[6px] flex items-center justify-center bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] text-black dark:text-white">
        <ShieldAlert className="w-5 h-5 text-black dark:text-white" />
      </div>
      <h3 className="text-[17px] font-bold text-black dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-[13px] max-w-md mx-auto text-[#737373] dark:text-[#A3A3A3]">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary mt-5 text-xs font-mono"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default InsightCard;
