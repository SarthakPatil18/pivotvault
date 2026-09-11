import React from 'react';
import { getFailureScoreColor } from '../../lib/utils';

export function RiskCategoryMeter({ categoryScores = {} }) {
  const categories = [
    { key: 'productRisk', label: 'Product & Tech Risk', desc: 'Over-engineering, unverified technical claims, hardware defect rate.' },
    { key: 'marketRisk', label: 'Market & Timing Risk', desc: 'Lack of genuine customer need, premature market timing, macro compression.' },
    { key: 'businessModelRisk', label: 'Business Model & Unit Economics', desc: 'Negative contribution margins, high CAC vs LTV, duration mismatches.' },
    { key: 'competitionRisk', label: 'Competition & Platform Risk', desc: 'Incumbent feature commoditization, closed ecosystem dependency.' },
    { key: 'executionRisk', label: 'Execution & Governance Risk', desc: 'Premature scaling, absence of board oversight, compliance exposure.' },
  ];

  return (
    <div className="space-y-4">
      {categories.map(({ key, label, desc }) => {
        const score = categoryScores[key] || 50;
        const colorData = getFailureScoreColor(score);

        return (
          <div key={key} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 font-sans">
                  {label}
                </span>
                <span className="hidden sm:inline ml-2 text-[11px] text-neutral-400 font-sans">
                  — {desc}
                </span>
              </div>
              <span className={`font-mono font-bold text-xs ${colorData.text}`}>
                {score}%
              </span>
            </div>

            {/* Meter Bar */}
            <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ 
                  width: `${score}%`, 
                  backgroundColor: colorData.fill 
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RiskCategoryMeter;
