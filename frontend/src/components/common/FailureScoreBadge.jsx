import React from 'react';
import { AlertTriangle, AlertCircle, ShieldAlert } from 'lucide-react';

export function FailureScoreBadge({ score, size = 'md', showIcon = true, showLabel = false }) {
  const isHighRisk = (Number(score) || 0) >= 70;
  
  return (
    <span 
      className="inline-flex items-center font-mono"
      style={{
        backgroundColor: isHighRisk ? 'rgba(234, 34, 97, 0.08)' : 'rgba(155, 104, 41, 0.10)',
        color: isHighRisk ? '#ea2261' : '#9b6829',
        border: `1px solid ${isHighRisk ? 'rgba(234, 34, 97, 0.20)' : 'rgba(155, 104, 41, 0.20)'}`,
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: 700,
        padding: '4px 10px',
      }}
      title={`Failure Score: ${score}/100`}
    >
      {showIcon && (
        score >= 85 ? (
          <ShieldAlert className="w-3.5 h-3.5 mr-1.5" style={{ color: isHighRisk ? '#ea2261' : '#9b6829' }} />
        ) : (
          <AlertTriangle className="w-3.5 h-3.5 mr-1.5" style={{ color: isHighRisk ? '#ea2261' : '#9b6829' }} />
        )
      )}
      <span style={{ fontFeatureSettings: '"tnum"' }}>FS {score}</span>
      {showLabel && (
        <span className="ml-1 opacity-75 text-[10px] uppercase font-sans font-medium">
          • {score >= 85 ? 'Catastrophic' : score >= 70 ? 'Severe' : 'Moderate'}
        </span>
      )}
    </span>
  );
}

export default FailureScoreBadge;
