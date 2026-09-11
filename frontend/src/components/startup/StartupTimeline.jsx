import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';

export function StartupTimeline({ timeline = [] }) {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="vault-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-1 rounded bg-neutral-100 dark:bg-neutral-800">
          <Calendar className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
        </div>
        <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
          Chronological Autopsy Timeline
        </h3>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800">
        {timeline.map((item, idx) => {
          const isLast = idx === timeline.length - 1;

          return (
            <div key={idx} className="relative group">
              {/* Dot */}
              <div 
                className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isLast 
                    ? 'bg-rose-600 border-rose-600 text-white' 
                    : 'bg-white dark:bg-neutral-900 border-neutral-400 dark:border-neutral-600'
                }`}
              >
                {isLast && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>

              {/* Event Content */}
              <div>
                <span className={`inline-block font-mono text-xs font-bold mb-1 ${isLast ? 'text-rose-600 dark:text-rose-400' : 'text-neutral-900 dark:text-neutral-100'}`}>
                  {item.year}
                </span>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {item.event}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StartupTimeline;
