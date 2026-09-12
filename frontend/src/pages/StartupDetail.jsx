import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStartup, getRelatedStartups } from '../lib/api';
import { StartupHeader } from '../components/startup/StartupHeader';
import { StartupTimeline } from '../components/startup/StartupTimeline';
import { FailureAnalysis } from '../components/startup/FailureAnalysis';
import { FinancialSummary, RelatedStartups } from '../components/startup/FinancialSummary';
import { FounderChatBox } from '../components/startup/FounderChatBox';
import { LoadingState, EmptyState } from '../components/common/InsightCard';
import { ArrowLeft, Sparkles, ShieldAlert, FileText, ChevronRight } from 'lucide-react';
import { GhostIcon } from '../components/common/GhostIcon';

export function StartupDetail() {
  const { id } = useParams();
  const [startup, setStartup] = useState(null);
  const [relatedStartups, setRelatedStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('autopsy'); // 'autopsy', 'timeline', 'people_investors'
  const [isChatOpen, setIsChatOpen] = useState(false);

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
        setError('Failed to load startup autopsy records.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return <LoadingState message="Deciphering forensic autopsy docket..." />;
  }

  if (error || !startup) {
    return (
      <EmptyState
        title="Autopsy Docket Not Found"
        description="The requested startup record does not exist in the public knowledge graph."
        action={
          <Link to="/app" className="vault-btn-primary text-xs">
            Return to Registry
          </Link>
        }
      />
    );
  }

  const founderName = (startup.founders && startup.founders[0]?.name) || 
                      (startup.founders && startup.founders[0]) || 
                      'Founder';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in relative">
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center gap-2 text-xs font-mono text-[#737373] dark:text-[#A3A3A3]">
        <Link to="/app" className="hover:text-black dark:hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Failure Registry</span>
        </Link>
        <span>/</span>
        <span className="text-black dark:text-white font-bold">{startup.name}</span>
      </div>

      {/* Main Core Dossier Content */}
      <div className="space-y-8">
        {/* Startup Hero Header Banner */}
        <StartupHeader 
          startup={startup} 
          onOpenFounderChat={() => setIsChatOpen(true)} 
        />

        {/* Tab Selection */}
        <div className="flex border-b border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-mono">
          {[
            { id: 'autopsy', label: 'Forensic Autopsy & Anatomy' },
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
              <div className="lg:col-span-1">
                <div className="sticky top-20 space-y-6">
                  <FinancialSummary startup={startup} />
                </div>
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

        {/* Bottom Hall of Ghosts AI Chat Trigger connecting to Gemini */}
        <div className="vault-card p-6 sm:p-8 mt-12 border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#0A0A0A] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto">
            {/* Circular Ghost Button from Screenshot */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black text-white dark:bg-white dark:text-black border-2 border-white/20 dark:border-black/20 shadow-md hover:scale-110 active:scale-95 transition-transform flex items-center justify-center shrink-0 cursor-pointer group ring-4 ring-black/5 dark:ring-white/5"
              title={`Open Ghost Chat with ${founderName}`}
            >
              <GhostIcon className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-black text-white dark:bg-white dark:text-black font-extrabold">
                  Hall of Ghosts
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Gemini API Connected
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-black dark:text-white mt-1 font-sans">
                Interrogate {founderName} ({startup.name})
              </h4>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5 max-w-xl font-sans leading-relaxed">
                Direct AI historical reconstruction grounded in SEC filings and bankruptcy records. Ask about fatal decisions, board dynamics, or what they'd do differently.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsChatOpen(true)}
            className="vault-btn-primary text-xs flex items-center gap-2 font-mono shrink-0 cursor-pointer shadow-sm hover:scale-102 transition-transform w-full sm:w-auto justify-center"
          >
            <GhostIcon className="w-4 h-4" />
            <span>Launch Ghost Chat</span>
          </button>
        </div>

        {/* Related Startup Autopsies */}
        <RelatedStartups startups={relatedStartups} />
      </div>

      {/* Floating Ghost Action Button (from user screenshot) */}
      {!isChatOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center">
          <button
            onClick={() => setIsChatOpen(true)}
            aria-label={`Open AI Ghost Chat with ${founderName}`}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black text-white dark:bg-white dark:text-black border-2 border-white/25 dark:border-black/25 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer group relative ring-4 ring-black/10 dark:ring-white/10"
            title={`Interrogate ${founderName} (Gemini AI Chat)`}
          >
            {/* Ghost icon matching screenshot */}
            <GhostIcon className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />

            {/* Active Gemini pulse badge */}
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-black animate-pulse" />

            {/* Hover Tooltip Pill */}
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-[6px] bg-black text-white dark:bg-white dark:text-black text-xs font-mono font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg flex items-center gap-1.5">
              <span>Ask {founderName}</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-neutral-800 text-neutral-300 dark:bg-neutral-200 dark:text-neutral-800">
                Gemini
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Interactive Founder AI Chatbox */}
      <FounderChatBox
        startup={startup}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}

export default StartupDetail;
