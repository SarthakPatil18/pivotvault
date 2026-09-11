import React from 'react';

export function MetricCard({ label, value, subtext, icon: Icon, trend, alert = false }) {
  return (
    <div className={`card-editorial !p-5 ${alert ? 'border-[#FF6173]/40 bg-[#FFE8EB]/20 dark:bg-[#26070A]/20' : ''}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#555555] dark:text-white/50">
          {label}
        </span>
        {Icon && (
          <div className="p-1.5 rounded-[5px] bg-[#FAFAFA] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#EFEFEF] dark:border-[#2D2D2D]">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-2 text-[26px] font-extrabold tracking-tight text-black dark:text-white">
        {value}
      </div>
      {(subtext || trend) && (
        <div className="mt-1 flex items-center gap-1.5 text-[12px] text-[#555555] dark:text-white/60">
          {trend && (
            <span className={trend.startsWith('+') ? 'text-[#FF6173] font-bold' : 'text-black dark:text-white font-bold'}>
              {trend}
            </span>
          )}
          {subtext && <span>{subtext}</span>}
        </div>
      )}
    </div>
  );
}

export default MetricCard;

