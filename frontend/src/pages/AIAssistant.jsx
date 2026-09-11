import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { AIResponseCard } from '../components/intelligence/AIResponseCard';
import { askAssistant } from '../lib/api';
import { Sparkles, Send, Terminal, BookOpen, ShieldAlert, RotateCcw, Clock } from 'lucide-react';

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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar: Prompts & History */}
          <div className="space-y-6">
            {/* Quick Investigation Presets */}
            <div className="vault-card p-5">
              <div className="flex items-center gap-2 mb-3 text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>Forensic Prompts</span>
              </div>
              <div className="space-y-1.5">
                {presetQueries.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAsk(item.prompt)}
                    className="w-full text-left p-2 rounded text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-100 dark:border-neutral-800/80 transition-colors block"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiry History */}
            <div className="vault-card p-5">
              <div className="flex items-center gap-2 mb-3 text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>Inquiry Log</span>
              </div>
              <div className="space-y-1.5">
                {queryHistory.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAsk(item)}
                    className="w-full text-left p-2 rounded text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 truncate block"
                    title={item}
                  >
                    • {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Chat / Research Workspace */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Input Box */}
            <div className="vault-card p-4 sm:p-5 bg-white dark:bg-neutral-900">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleAsk(); }}
                className="space-y-3"
              >
                <div className="relative">
                  <textarea
                    rows={3}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a forensic question (e.g. 'Why did Quibi fail in 6 months?', 'Compare WeWork vs Katerra failure modes', 'What burn rate warning signs preceded Fast shutting down?')..."
                    className="w-full p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none font-sans"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-400">
                    Press Analyze to cross-reference 413+ post-mortems
                  </span>
                  <button
                    type="submit"
                    disabled={!question.trim() || loading}
                    className="vault-btn-primary text-xs font-mono px-4 py-2 flex items-center gap-1.5"
                  >
                    {loading ? (
                      <>
                        <span className="w-3 h-3 border-2 border-neutral-300 border-t-white rounded-full animate-spin" />
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
              <div className="vault-card p-12 text-center">
                <div className="w-8 h-8 border-2 border-neutral-300 border-t-rose-600 rounded-full animate-spin mx-auto mb-3" />
                <p className="font-mono text-xs text-neutral-500 uppercase tracking-wider">
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
              <div className="vault-card p-12 text-center text-neutral-400 space-y-3">
                <Sparkles className="w-8 h-8 text-neutral-400 mx-auto" />
                <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Forensic Research Assistant Ready
                </h4>
                <p className="text-xs max-w-md mx-auto text-neutral-500">
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
