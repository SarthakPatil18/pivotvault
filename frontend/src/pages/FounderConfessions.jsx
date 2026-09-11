import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { getFounderConfessions } from '../lib/api';
import { LoadingState } from '../components/common/InsightCard';
import { CompanyLogo } from '../components/common/CompanyLogo';
import { Heart, MessageSquare, BookOpen, Quote, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export function FounderConfessions() {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState('confession-1');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await getFounderConfessions();
        setConfessions(res.data || []);
      } catch (err) {
        console.error('Confessions load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="vault-container py-20">
        <LoadingState message="Loading founder retrospectives and confessions..." />
      </div>
    );
  }

  return (
    <div className="pb-20 bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <PageHeader
        title="Founder Confessions & Retrospectives"
        subtitle="Unfiltered post-mortems, raw reflections, and candid lessons from founders who lived through startup collapses."
        badge="Founder Stories"
        tagline="HUMAN INTELLIGENCE"
        breadcrumbs={[{ label: 'Learn' }, { label: 'Founder Confessions' }]}
      />

      <div className="vault-container max-w-4xl mx-auto space-y-6">
        {/* Intro Quote Box */}
        <div className="vault-card p-6 bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs text-[#737373] dark:text-[#A3A3A3] font-sans leading-relaxed">
          <p className="italic">
            "Success has many fathers, but failure is an orphan. Startup autopsies become transformative only when we listen to the human founders who experienced the grief of shutting down a dream."
          </p>
        </div>

        {/* Confessions List */}
        <div className="space-y-6">
          {confessions.map((confession) => {
            const isExpanded = expandedId === confession.id;

            return (
              <div 
                key={confession.id} 
                className="vault-card p-6 sm:p-8 space-y-4 transition-all"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-sm flex items-center justify-center shrink-0">
                      {confession.avatar}
                    </div>
                    <div>
                      <h3 className="text-base font-bold font-sans text-black dark:text-white">
                        {confession.founder}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-mono text-[#737373] dark:text-[#A3A3A3] mt-1">
                        <div className="flex items-center gap-1.5">
                          <CompanyLogo name={confession.startup.replace(/\s*\(.*\)/, '')} size="xs" />
                          <span className="font-bold text-black dark:text-white">{confession.startup}</span>
                        </div>
                        <span>•</span>
                        <span>{confession.year}</span>
                        <span>•</span>
                        <span>Raised {confession.capitalRaised}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="vault-badge vault-badge-neutral text-[11px]">
                      {confession.category}
                    </span>
                    <span className="vault-badge vault-badge-neutral text-[11px] font-bold">
                      {confession.failureTag}
                    </span>
                  </div>
                </div>

                {/* Title & Summary */}
                <div>
                  <h4 className="text-base sm:text-lg font-bold font-sans text-black dark:text-white mb-2">
                    "{confession.title}"
                  </h4>
                  <p className="text-xs sm:text-sm text-[#737373] dark:text-[#A3A3A3] leading-relaxed font-sans">
                    {confession.summary}
                  </p>
                </div>

                {/* Full Story (Collapsible) */}
                {isExpanded && (
                  <div className="pt-4 border-t border-[#E5E5E5] dark:border-[#2A2A2A] space-y-4 animate-fade-in">
                    <div className="text-xs sm:text-sm text-black dark:text-white leading-relaxed whitespace-pre-line font-sans pl-3 border-l-2 border-black dark:border-white">
                      {confession.fullStory}
                    </div>

                    {/* Key Lessons */}
                    <div className="p-4 rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-2">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] font-bold">
                        Forensic Lessons from this Failure:
                      </div>
                      <div className="space-y-1.5">
                        {confession.keyLessons.map((lesson, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-black dark:text-white">
                            <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-white shrink-0 mt-0.5" />
                            <span>{lesson}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Expand / Collapse Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : confession.id)}
                    className="text-xs font-mono font-bold text-black dark:text-white hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isExpanded ? 'Collapse Story' : 'Read Full Retrospective'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FounderConfessions;
