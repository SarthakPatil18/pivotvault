import React from 'react';
import { getFailureScoreColor } from '../../lib/utils';
import { AlertTriangle, AlertCircle, ShieldAlert } from 'lucide-react';

export function FailureScoreBadge({ score, size = 'md', showIcon = true, showLabel = false }) {
  const colorData = getFailureScoreColor(score);
  
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-0.5 text-xs',
    lg: 'px-2.5 py-1 text-sm font-semibold',
  };

  const iconSizes = {
    sm: 'w-3 h-3 mr-1',
    md: 'w-3.5 h-3.5 mr-1.5',
    lg: 'w-4 h-4 mr-1.5',
  };

  return (
    <span 
      className={`inline-flex items-center font-mono border rounded-md transition-colors ${colorData.bg} ${colorData.text} ${colorData.border} ${sizeClasses[size] || sizeClasses.md}`}
      title={`Failure Score: ${score}/100 (${colorData.label})`}
    >
      {showIcon && (
        score >= 85 ? (
          <ShieldAlert className={iconSizes[size] || iconSizes.md} />
        ) : score >= 70 ? (
          <AlertTriangle className={iconSizes[size] || iconSizes.md} />
        ) : (
          <AlertCircle className={iconSizes[size] || iconSizes.md} />
        )
      )}
      <span>FS {score}</span>
      {showLabel && (
        <span className="ml-1 opacity-75 text-[10px] uppercase font-sans font-medium">
          • {colorData.label}
        </span>
      )}
    </span>
  );
}

export default FailureScoreBadge;
