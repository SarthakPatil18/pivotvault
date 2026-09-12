import React from 'react';

export function RiskScoreGauge({ score = 65, size = 'lg', label = 'Overall Failure Risk Index' }) {
  const numScore = Number(score) || 0;
  const isHighRisk = numScore >= 70;
  const isLowRisk = numScore < 50;

  // PivotVault status color accents
  const strokeColor = isHighRisk ? '#DC2626' : isLowRisk ? '#10B981' : '#F59E0B';
  const dotColor = isHighRisk ? 'bg-[#DC2626]' : isLowRisk ? 'bg-[#10B981]' : 'bg-[#F59E0B]';
  const badgeStyle = isHighRisk 
    ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/60'
    : isLowRisk 
    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60'
    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60';
  const tierLabel = isHighRisk ? 'High Risk' : isLowRisk ? 'Low Risk / Ready' : 'Moderate Risk';

  // SVG Circular Gauge calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (numScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative flex items-center justify-center">
        <svg className="w-32 h-32 -rotate-90 transform" viewBox="0 0 100 100">
          {/* Background Track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="text-[#EAEAEA] dark:text-[#262626]"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
          />
          {/* Progress Indicator with PivotVault risk color */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Readout */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold font-mono tracking-tight text-black dark:text-white">
            {numScore}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#737373] dark:text-[#A3A3A3] -mt-0.5">
            / 100
          </span>
        </div>
      </div>

      <div className="mt-3.5">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] text-[11px] font-mono font-bold uppercase tracking-wider border shadow-xs ${badgeStyle}`}>
          <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor} ${isHighRisk ? 'animate-pulse' : ''}`} />
          {tierLabel}
        </span>
        {label && (
          <p className="mt-1.5 text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">
            {label}
          </p>
        )}
      </div>
    </div>
  );
}

export default RiskScoreGauge;
