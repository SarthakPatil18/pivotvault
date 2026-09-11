import React from 'react';

export function RiskScoreGauge({ score = 65, size = 'lg', label = 'Overall Failure Risk Index' }) {
  const numScore = Number(score) || 0;
  const isHighRisk = numScore >= 70;
  const isLowRisk = numScore < 50;

  // Single functional status dot accent
  const dotColor = isHighRisk ? 'bg-[#DC2626]' : isLowRisk ? 'bg-[#16A34A]' : 'bg-[#737373]';
  const tierLabel = isHighRisk ? 'High Risk' : isLowRisk ? 'Low Risk / Ready' : 'Moderate Risk';

  // SVG Circular Gauge calculations: black fill on a light gray track
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (numScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative flex items-center justify-center">
        <svg className="w-32 h-32 -rotate-90 transform" viewBox="0 0 100 100">
          {/* Background Track: light gray (dark: dark gray) */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="text-[#E5E5E5] dark:text-[#2A2A2A]"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
          />
          {/* Progress Indicator: solid black fill (dark: solid white) */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="text-black dark:text-white transition-all duration-1000 ease-out"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Score Readout */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-bold font-mono tracking-tight text-black dark:text-white">
            {numScore}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#737373] dark:text-[#A3A3A3] -mt-1">
            / 100
          </span>
        </div>
      </div>

      <div className="mt-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-[11px] font-mono font-bold uppercase tracking-wider bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]">
          <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
          {tierLabel}
        </span>
        <p className="mt-1 text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">
          {label}
        </p>
      </div>
    </div>
  );
}

export default RiskScoreGauge;
