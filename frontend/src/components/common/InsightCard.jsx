import React from 'react';
import { ArrowRight, Lightbulb, ShieldAlert, Sparkles, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export function InsightCard({ title, description, category = 'Pattern Insight', metric, linkTo, iconType = 'lightbulb' }) {
  const getIcon = () => {
    switch (iconType) {
      case 'alert':
        return <ShieldAlert className="w-4 h-4 text-[#FF6173]" />;
      case 'trend':
        return <TrendingDown className="w-4 h-4 text-black dark:text-white" />;
      case 'sparkles':
        return <Sparkles className="w-4 h-4 text-black dark:text-white" />;
      default:
        return <Lightbulb className="w-4 h-4 text-black dark:text-white" />;
    }
  };

  const CardWrapper = linkTo ? Link : 'div';

  return (
    <CardWrapper 
      to={linkTo} 
      className="card-editorial flex flex-col justify-between block group"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="badge-neutral text-[11px] font-bold">
            {category}
          </span>
          <div className="p-1.5 rounded-[5px] bg-[#FAFAFA] dark:bg-[#1A1A1A] border border-[#EFEFEF] dark:border-[#2D2D2D]">
            {getIcon()}
          </div>
        </div>

        <h4 className="text-[18px] font-bold text-black dark:text-white group-hover:text-[#555555] dark:group-hover:text-white/80 transition-colors">
          {title}
        </h4>

        <p className="mt-2 text-[13px] text-[#555555] dark:text-white/70 leading-relaxed">
          {description}
        </p>
      </div>

      {(metric || linkTo) && (
        <div className="mt-5 pt-3 border-t border-[#EFEFEF] dark:border-[#202020] flex items-center justify-between text-[13px]">
          {metric ? (
            <span className="font-bold text-[#FF6173] text-[12px]">
              {metric}
            </span>
          ) : <span />}
          
          {linkTo && (
            <span className="inline-flex items-center gap-1 font-bold text-black dark:text-white group-hover:underline">
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
        <div className="w-8 h-8 border-2 border-[#EFEFEF] dark:border-[#2D2D2D] border-t-black dark:border-t-white rounded-full animate-spin" />
      </div>
      <p className="text-[12px] font-bold uppercase tracking-wider text-[#555555] dark:text-white/60">
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
    <div className="card-editorial !p-12 text-center my-8 flex flex-col items-center justify-center">
      <div className="w-12 h-12 mb-4 rounded-full bg-[#FAFAFA] dark:bg-[#1A1A1A] border border-[#EFEFEF] dark:border-[#2D2D2D] flex items-center justify-center text-black dark:text-white">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <h3 className="text-[18px] font-bold text-black dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-[14px] text-[#555555] dark:text-white/70 max-w-md mx-auto">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 btn-primary !py-2.5 !px-5 text-[14px]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default InsightCard;

