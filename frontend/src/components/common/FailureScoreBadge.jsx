import React from 'react';
import { AlertTriangle, AlertCircle, ShieldAlert } from 'lucide-react';

export function FailureScoreBadge({ score, size = 'md', showIcon = true, showLabel = false }) {
  const numScore = Number(score) || 0;
  const isHighRisk = numScore >= 70;
  const isModerate = numScore >= 50 && numScore < 70;
  
  const badgeColor = isHighRisk 
    ? { bg: 'rgba(225, 101, 64, 0.10)', text: '#e16540', border: 'rgba(225, 101, 64, 0.25)' }
    : isModerate
    ? { bg: 'rgba(251, 199, 104, 0.16)', text: '#9b6829', border: 'rgba(251, 199, 104, 0.35)' }
    : { bg: 'rgba(71, 208, 150, 0.16)', text: '#2e7d32', border: 'rgba(71, 208, 150, 0.35)' };

  return (
    <span 
      className="inline-flex items-center font-mono shadow-xs"
      style={{
        backgroundColor: badgeColor.bg,
        color: badgeColor.text,
        border: `1px solid ${badgeColor.border}`,
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: 700,
        padding: '4px 10px',
      }}
      title={`Failure Score: ${score}/100`}
    >
      {showIcon && (
        numScore >= 85 ? (
          <ShieldAlert className="w-3.5 h-3.5 mr-1.5" style={{ color: badgeColor.text }} />
        ) : (
          <AlertTriangle className="w-3.5 h-3.5 mr-1.5" style={{ color: badgeColor.text }} />
        )
      )}
      <span style={{ fontFeatureSettings: '"tnum"' }}>FS {score}</span>
      {showLabel && (
        <span className="ml-1 opacity-80 text-[10px] uppercase font-sans font-medium">
          • {numScore >= 85 ? 'Catastrophic' : numScore >= 70 ? 'Severe' : 'Moderate'}
        </span>
      )}
    </span>
  );
}

export default FailureScoreBadge;
