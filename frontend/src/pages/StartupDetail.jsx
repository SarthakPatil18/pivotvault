import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStartup, getRelatedStartups } from '../lib/api';
import { StartupHeader } from '../components/startup/StartupHeader';
import { StartupTimeline } from '../components/startup/StartupTimeline';
import { FailureAnalysis } from '../components/startup/FailureAnalysis';
import { FinancialSummary, RelatedStartups } from '../components/startup/FinancialSummary';
import { LoadingState, EmptyState } from '../components/common/InsightCard';
import { ArrowLeft, Sparkles, ShieldAlert, FileText, ChevronRight } from 'lucide-react';

export function StartupDetail() {
  const { id } = useParams();
  const [startup, setStartup] = useState(null);
  const [relatedStartups, setRelatedStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('autopsy'); // 'autopsy', 'timeline', 'people_investors'

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const startupRes = await getStartup(id);
        setStartup(startupRes.data);

        const relatedRes = await getRelatedStartups(id);
        setRelatedStartups(relatedRes.data || []);
      } catch (err) {
        setError(err.message || `Startup with ID "${id}" could not be retrieved.`);
      } finally {
        setLoading(false);
      }
    }

    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="vault-container py-20">
        <LoadingState message="Reconstructing post-mortem telemetry and forensic evidence..." />
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="vault-container py-12">
        <EmptyState
          title="Startup Autopsy Record Not Found"
          description={error || `No documented post-mortem exists for "${id}".`}
          actionLabel="Return to Explore Archive"
          onAction={() => window.location.href = '/explore'}
        />
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Top Breadcrumbs Strip */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 py-3">
        <div className="vault-container flex items-center justify-between text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Link to="/explore" className="hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Explore Archive</span>
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-neutral-900 dark:text-neutral-100 font-bold">{startup.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/risk-scanner?q=${encodeURIComponent(startup.name)}`}
              className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Scan Related Risk</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="vault-container pt-6">
        {/* Startup Header Banner */}
        <StartupHeader startup={startup} />

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 mb-6 font-mono text-xs">
          {[
            { id: 'autopsy', label: 'Failure Autopsy & Lessons' },
            { id: 'timeline', label: 'Chronological Timeline' },
            { id: 'people_investors', label: 'Leadership & Investors' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-3 transition-colors border-b-2 -mb-px font-semibold ${
                activeTab === tab.id
                  ? 'border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="space-y-8">
          {activeTab === 'autopsy' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <FailureAnalysis startup={startup} />
              </div>
              <div>
                <FinancialSummary startup={startup} />
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="max-w-3xl">
              <StartupTimeline timeline={startup.timeline} />
            </div>
          )}

          {activeTab === 'people_investors' && (
            <div className="max-w-3xl">
              <FinancialSummary startup={startup} />
            </div>
          )}
        </div>

        {/* Related Startup Autopsies */}
        <RelatedStartups startups={relatedStartups} />
      </div>
    </div>
  );
}

export default StartupDetail;
