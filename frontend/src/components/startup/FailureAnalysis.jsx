import React from 'react';
import { AlertOctagon, Lightbulb, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { RiskCategoryMeter } from '../intelligence/RiskCategoryMeter';

export function FailureAnalysis({ startup }) {
  if (!startup) return null;

  return (
    <div className="space-y-6">
      {/* Root Causes Box */}
      <div className="vault-card p-6 border-rose-200 dark:border-rose-900/40">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
            Fatal Failure Mechanisms & Root Causes
          </h3>
        </div>

        <div className="space-y-3">
          {startup.rootCauses?.map((cause, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
              <span className="flex items-center justify-center w-5 h-5 rounded font-mono text-[10px] font-bold bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 shrink-0 mt-0.5">
                0{idx + 1}
              </span>
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                {cause}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Failure Factors Category Breakdown */}
      {startup.failureFactors && (
        <div className="vault-card p-6">
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-4">
            Risk Factor Spectrum Analysis
          </h3>
          <RiskCategoryMeter categoryScores={startup.failureFactors} />
        </div>
      )}

      {/* Founder Lessons & Takeaways */}
      {startup.lessons && startup.lessons.length > 0 && (
        <div className="vault-card p-6 bg-neutral-50/50 dark:bg-neutral-900/30">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
              <Lightbulb className="w-4 h-4 text-rose-600" />
            </div>
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              Actionable Founder Lessons
            </h3>
          </div>

          <div className="space-y-3">
            {startup.lessons.map((lesson, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
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
