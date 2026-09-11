import React from 'react';
import { AlertOctagon, Lightbulb, CheckCircle2 } from 'lucide-react';
import { RiskCategoryMeter } from '../intelligence/RiskCategoryMeter';

export function FailureAnalysis({ startup }) {
  if (!startup) return null;

  return (
    <div className="space-y-6">
      {/* Root Causes Box */}
      <div className="vault-card p-6 border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-black dark:text-white">
            Fatal Failure Mechanisms & Root Causes
          </h3>
        </div>

        <div className="space-y-2.5">
          {startup.rootCauses?.map((cause, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-[6px] bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#2A2A2A]">
              <span className="flex items-center justify-center w-5 h-5 rounded-[4px] font-mono text-[10px] font-bold bg-[#E5E5E5] dark:bg-[#2A2A2A] text-black dark:text-white shrink-0 mt-0.5">
                0{idx + 1}
              </span>
              <p className="text-xs text-[#404040] dark:text-[#D4D4D4] leading-relaxed font-sans">
                {cause}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Failure Factors Category Breakdown */}
      {startup.failureFactors && (
        <div className="vault-card p-6">
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-black dark:text-white mb-4">
            Risk Factor Spectrum Analysis
          </h3>
          <RiskCategoryMeter categoryScores={startup.failureFactors} />
        </div>
      )}

      {/* Founder Lessons & Takeaways */}
      {startup.lessons && startup.lessons.length > 0 && (
        <div className="vault-card p-6 bg-[#FAFAFA] dark:bg-[#0A0A0A]">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-black dark:text-white">
              Actionable Founder Lessons
            </h3>
          </div>

          <div className="space-y-2.5">
            {startup.lessons.map((lesson, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-[#404040] dark:text-[#D4D4D4]">
                <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                <span className="leading-relaxed">{lesson}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FailureAnalysis;
