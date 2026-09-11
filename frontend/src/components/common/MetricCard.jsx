import React from 'react';

export function MetricCard({ label, value, subtext, icon: Icon, trend, alert = false, sparkline }) {
  return (
    <div 
      className="p-5 md:p-6 relative overflow-hidden transition-all duration-150 bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] shadow-xs hover:border-black dark:hover:border-white"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="w-7 h-7 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white flex items-center justify-center shrink-0 border border-[#E5E5E5] dark:border-[#2A2A2A]">
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="uppercase text-[10px] font-mono font-bold text-[#737373] dark:text-[#A3A3A3] tracking-wider">
            {label}
          </span>
        </div>

        {trend && (
          <span className="inline-flex items-center gap-1 font-mono font-bold rounded-[4px] text-[10px] px-2 py-0.5 leading-none bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]">
            {alert && <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] shrink-0" />}
            {trend}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between mb-2">
        <div 
          className="text-3xl sm:text-4xl font-extrabold text-black dark:text-white leading-tight font-sans tracking-tight"
          style={{
            fontFeatureSettings: '"tnum"',
            letterSpacing: '-0.42px',
          }}
        >
          {value}
        </div>
        {sparkline}
      </div>

      {subtext && (
        <div className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">
          {subtext}
        </div>
      )}
    </div>
  );
}

export default MetricCard;
