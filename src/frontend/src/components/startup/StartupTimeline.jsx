import React from 'react';
import { Calendar } from 'lucide-react';

export function StartupTimeline({ timeline = [] }) {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="vault-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-1 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]">
          <Calendar className="w-4 h-4" />
        </div>
        <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-black dark:text-white">
          Chronological Autopsy Timeline
        </h3>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5E5E5] dark:before:bg-[#2A2A2A]">
        {timeline.map((item, idx) => {
          const isLast = idx === timeline.length - 1;

          return (
            <div key={idx} className="relative group">
              {/* Dot */}
              <div 
                className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isLast 
                    ? 'bg-black border-black dark:bg-white dark:border-white text-white dark:text-black' 
                    : 'bg-white dark:bg-[#0A0A0A] border-[#A3A3A3] dark:border-[#737373]'
                }`}
              >
                {isLast && <div className="w-1.5 h-1.5 bg-[#DC2626] rounded-full" />}
              </div>

              {/* Event Content */}
              <div>
                <span className={`inline-block font-mono text-xs font-bold mb-1 ${isLast ? 'text-black dark:text-white' : 'text-black dark:text-white'}`}>
                  {item.year} {isLast && <span className="text-[10px] text-[#DC2626] uppercase ml-1 font-mono">• Fatal Dissolution</span>}
                </span>
                <p className="text-xs text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
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
