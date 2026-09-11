import React from 'react';

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
        const isHighRisk = score >= 70;

        return (
          <div key={key} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-black dark:text-white font-sans">
                  {label}
                </span>
                <span className="hidden sm:inline ml-2 text-[11px] text-[#737373] dark:text-[#A3A3A3] font-sans">
                  — {desc}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {isHighRisk && <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] shrink-0" />}
                <span className="font-mono font-bold text-xs text-black dark:text-white">
                  {score}%
                </span>
              </div>
            </div>

            {/* Meter Bar: Black fill on light gray track */}
            <div className="w-full h-2 bg-[#E5E5E5] dark:bg-[#2A2A2A] rounded-[2px] overflow-hidden">
              <div 
                className="h-full rounded-[2px] bg-black dark:bg-white transition-all duration-700 ease-out"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RiskCategoryMeter;
