import React from 'react';

export function FailureScoreBadge({ score, size = 'md', showIcon = true, showLabel = false }) {
  const numScore = Number(score) || 0;
  const isHighRisk = numScore >= 70;
  const isLowRisk = numScore < 50;

  // Single permitted functional accent: tiny status dot only
  const dotColor = isHighRisk 
    ? 'bg-[#DC2626]' 
    : isLowRisk 
    ? 'bg-[#16A34A]' 
    : 'bg-[#737373]';

  return (
    <span 
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] font-mono text-[11px] font-bold tracking-wider uppercase shadow-xs select-none"
      title={`Failure Score: ${score}/100`}
    >
      {/* Functional status indicator dot */}
      <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
      <span style={{ fontFeatureSettings: '"tnum"' }}>FS {score}</span>
      {showLabel && (
        <span className="text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3] normal-case">
          {numScore >= 85 ? '(Catastrophic)' : numScore >= 70 ? '(High Risk)' : '(Monitored)'}
        </span>
      )}
    </span>
  );
}

export default FailureScoreBadge;
