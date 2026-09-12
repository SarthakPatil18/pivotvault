import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { AIResponseCard } from '../components/intelligence/AIResponseCard';
import { askAssistant } from '../lib/api';
import { Sparkles, Send, Clock, ChevronRight } from 'lucide-react';

export function AIAssistant() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [question, setQuestion] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [queryHistory, setQueryHistory] = useState([
    'Why did WeWork fail despite raising $14 Billion?',
    'Show startups that collapsed due to negative unit economics.',
    'What key governance lessons can deeptech founders learn from Theranos?',
    'Why do hardware startups struggle with inventory and warranty defects?'
  ]);

  const presetQueries = [
    { label: 'Why did WeWork fail?', prompt: 'Why did WeWork fail despite raising $14 Billion?' },
    { label: 'Theranos governance lessons', prompt: 'What key governance lessons can deeptech founders learn from Theranos?' },
    { label: 'Unit Economics Failures', prompt: 'Show startups that collapsed due to negative unit economics and high CAC.' },
    { label: 'Why did Quibi shut down?', prompt: 'Why did Quibi shut down after only 6 months of operation?' },
    { label: 'Hardware Startup Pitfalls', prompt: 'What are the most common fatal pitfalls for hardware and IoT startups?' }
  ];

  useEffect(() => {
    if (initialQuery) {
      handleAsk(initialQuery);
    }
  }, [initialQuery]);

  const handleAsk = async (promptToAsk) => {
    const q = promptToAsk || question;
    if (!q.trim()) return;

    setLoading(true);
    setQuestion(q);
    try {
      const res = await askAssistant(q);
      setCurrentResponse(res.data);
      
      // Update history
      setQueryHistory((prev) => {
        const filtered = prev.filter((item) => item !== q);
        return [q, ...filtered].slice(0, 8);
      });
    } catch (err) {
      console.error('AI query error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20">
      <PageHeader
        title="AI Failure Research Assistant"
        subtitle="Forensic reasoning engine trained on 413+ startup autopsies, SEC regulatory filings, and court disclosures."
        badge="Dual-Layer AI Reasoning"
        tagline="INTELLIGENCE ENGINE"
        breadcrumbs={[{ label: 'Intelligence' }, { label: 'AI Assistant' }]}
      />

      <div className="vault-container">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar: Prompts & History */}
          <div className="space-y-5">
            <div className="vault-card p-5 space-y-5">
              {/* Quick Investigation Presets */}
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-black dark:text-white" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Forensic Prompts
                  </span>
                </div>
                <div className="space-y-1">
                  {presetQueries.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAsk(item.prompt)}
                      className="w-full text-left p-2 rounded-[4px] text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-950 dark:hover:text-neutral-50 transition-colors flex items-center justify-between group"
                    >
                      <span className="truncate">{item.label}</span>
                      <ChevronRight className="w-3 h-3 text-neutral-400 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Inquiry History */}
              <div className="pt-4 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Inquiry Log
                  </span>
                </div>
                <div className="space-y-1">
                  {queryHistory.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAsk(item)}
                      className="w-full text-left truncate text-[11px] font-mono text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 py-1 transition-colors block"
                      title={item}
                    >
                      • {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Workspace */}
          <div className="lg:col-span-3 space-y-6">
            {/* Input Box */}
            <div className="vault-card p-6">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleAsk(); }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2">
                    Submit Forensic Inquiry to Research Corpus
                  </label>
                  <textarea
                    rows={3}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a forensic question (e.g. 'Why did Quibi fail in 6 months?', 'Compare WeWork vs Katerra failure modes', 'What burn rate warning signs preceded Fast shutting down?')..."
                    className="vault-input resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <span className="text-xs font-mono text-neutral-400">
                    Cross-referencing 413+ post-mortems & regulatory evidence
                  </span>
                  <button
                    type="submit"
                    disabled={!question.trim() || loading}
                    className="btn-primary shrink-0 self-end sm:self-auto text-xs flex items-center gap-2 px-5 py-2.5"
                  >
                    {loading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Synthesizing...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Analyze Question</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* AI Response Display */}
            {loading && (
              <div className="vault-card p-12 text-center space-y-3">
                <div className="w-7 h-7 border-2 border-neutral-300 dark:border-neutral-700 border-t-black dark:border-t-white rounded-full animate-spin mx-auto" />
                <p className="font-mono text-xs text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider">
                  Traversing SEC filings, bankruptcy records, and post-mortem taxonomy...
                </p>
              </div>
            )}

            {!loading && currentResponse && (
              <AIResponseCard 
                response={currentResponse} 
                onAskFollowUp={(q) => handleAsk(q)}
              />
            )}

            {!loading && !currentResponse && (
              <div className="vault-card p-12 text-center space-y-3">
                <div className="w-10 h-10 rounded-[6px] bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white flex items-center justify-center mx-auto border border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold font-sans text-black dark:text-white">
                  Forensic Research Assistant Ready
                </h4>
                <p className="max-w-md mx-auto text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Select a prompt from the sidebar or enter a question to analyze cross-case failure patterns, unit economic collapses, and governance blindspots.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;
