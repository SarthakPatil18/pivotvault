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
    <div className="pb-20 bg-white dark:bg-black text-black dark:text-white min-h-screen">
      {/* Top Breadcrumbs Strip */}
      <div className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#0A0A0A] py-3">
        <div className="vault-container flex items-center justify-between text-xs font-mono text-[#737373] dark:text-[#A3A3A3]">
          <div className="flex items-center gap-1.5">
            <Link to="/explore" className="hover:text-black dark:hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Explore Archive</span>
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-black dark:text-white font-bold">{startup.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/risk-scanner?q=${encodeURIComponent(startup.name)}`}
              className="text-black dark:text-white hover:underline flex items-center gap-1 font-semibold"
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
        <div className="flex items-center gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] mb-6 font-mono text-xs">
          {[
            { id: 'autopsy', label: 'Failure Autopsy & Lessons' },
            { id: 'timeline', label: 'Chronological Timeline' },
            { id: 'people_investors', label: 'Leadership & Investors' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-3 transition-colors border-b-2 -mb-px font-semibold cursor-pointer ${
                activeTab === tab.id
                  ? 'border-black text-black dark:border-white dark:text-white'
                  : 'border-transparent text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white'
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
