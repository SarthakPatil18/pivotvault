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
    <div className="pb-20">
      <PageHeader
        title="Founder Confessions & Retrospectives"
        subtitle="Unfiltered post-mortems, raw reflections, and candid lessons from founders who lived through startup collapses."
        badge="Founder Stories"
        tagline="HUMAN INTELLIGENCE"
        breadcrumbs={[{ label: 'Learn' }, { label: 'Founder Confessions' }]}
      />

      <div className="vault-container max-w-4xl mx-auto space-y-6">
        {/* Intro Quote Box */}
        <div className="vault-card p-6 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
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
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-mono font-bold text-sm flex items-center justify-center shrink-0">
                      {confession.avatar}
                    </div>
                    <div>
                      <h3 className="text-base font-bold font-sans text-neutral-950 dark:text-neutral-50">
                        {confession.founder}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 mt-1">
                        <div className="flex items-center gap-1.5">
                          <CompanyLogo name={confession.startup.replace(/\s*\(.*\)/, '')} size="xs" />
                          <span className="text-rose-600 dark:text-rose-400 font-medium">{confession.startup}</span>
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
                    <span className="vault-badge vault-badge-red text-[11px]">
                      {confession.failureTag}
                    </span>
                  </div>
                </div>

                {/* Title & Summary */}
                <div>
                  <h4 className="text-base sm:text-lg font-bold font-sans text-neutral-900 dark:text-neutral-100 mb-2">
                    "{confession.title}"
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                    {confession.summary}
                  </p>
                </div>

                {/* Full Story (Collapsible) */}
                {isExpanded && (
                  <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-4 animate-fade-in">
                    <div className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line font-sans pl-3 border-l-2 border-neutral-300 dark:border-neutral-700">
                      {confession.fullStory}
                    </div>

                    {/* Key Lessons */}
                    <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                        Forensic Lessons from this Failure:
                      </div>
                      <div className="space-y-1.5">
                        {confession.keyLessons.map((lesson, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
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
                    className="text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 hover:text-rose-600 flex items-center gap-1"
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
