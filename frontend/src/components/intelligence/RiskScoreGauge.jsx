import React from 'react';
import { getFailureScoreColor } from '../../lib/utils';
import { ShieldAlert, AlertTriangle, CheckCircle } from 'lucide-react';

export function RiskScoreGauge({ score = 65, size = 'lg', label = 'Overall Failure Risk Index' }) {
  const colorData = getFailureScoreColor(score);

  // SVG Circular Gauge calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative flex items-center justify-center">
        <svg className="w-32 h-32 -rotate-90 transform" viewBox="0 0 100 100">
          {/* Background Track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="text-neutral-200 dark:text-neutral-800"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
          />
          {/* Progress Indicator */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={colorData.fill}
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
          <span className="text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-neutral-50">
            {score}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 -mt-1">
            / 100
          </span>
        </div>
      </div>

      <div className="mt-3">
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${colorData.bg} ${colorData.text} ${colorData.border}`}>
          {score >= 80 ? (
            <ShieldAlert className="w-3.5 h-3.5" />
          ) : score >= 60 ? (
            <AlertTriangle className="w-3.5 h-3.5" />
          ) : (
            <CheckCircle className="w-3.5 h-3.5" />
          )}
          {colorData.label} Risk Tier
        </span>
        <p className="mt-1 text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
          {label}
        </p>
      </div>
    </div>
  );
}

export default RiskScoreGauge;
