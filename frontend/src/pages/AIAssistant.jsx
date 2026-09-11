import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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
    <div className="pb-20 bg-[#f6f9fc] min-h-screen">
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
            <div 
              className="p-5"
              style={{
                backgroundColor: '#ffffff',
                borderRight: '1px solid #e3e8ee',
                border: '1px solid #e3e8ee',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: 'rgba(0, 55, 112, 0.06) 0px 2px 8px'
              }}
            >
              {/* Quick Investigation Presets */}
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#533afd]" />
                <span 
                  style={{
                    color: '#64748d',
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  FORENSIC PROMPTS
                </span>
              </div>
              <div className="space-y-1.5 mb-6">
                {presetQueries.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAsk(item.prompt)}
                    className="w-full text-left transition-colors block"
                    style={{
                      color: '#273951',
                      fontSize: '13px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      borderBottom: '1px solid #e3e8ee'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f6f9fc';
                      e.currentTarget.style.color = '#0d253d';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#273951';
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Inquiry History */}
              <div className="flex items-center gap-2 mb-3 pt-3 border-t border-[#e3e8ee]">
                <Clock className="w-3.5 h-3.5 text-[#64748d]" />
                <span 
                  style={{
                    color: '#64748d',
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  INQUIRY LOG
                </span>
              </div>
              <div className="space-y-1">
                {queryHistory.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAsk(item)}
                    className="w-full text-left truncate block transition-colors"
                    style={{
                      color: '#64748d',
                      fontSize: '12px',
                      padding: '6px 0',
                      borderBottom: '1px solid #f6f9fc'
                    }}
                    title={item}
                  >
                    • {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Workspace */}
          <div className="lg:col-span-3 space-y-6">
            {/* Input Box */}
            <div 
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #a8c3de',
                borderRadius: '12px',
                boxShadow: 'rgba(0, 55, 112, 0.06) 0px 2px 8px',
                padding: '20px'
              }}
            >
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
                    className="w-full p-3 bg-transparent text-sm text-[#0d253d] focus:outline-none resize-none font-sans"
                    style={{
                      color: '#0d253d',
                      fontSize: '14px',
                    }}
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#e3e8ee]">
                  <span 
                    style={{
                      color: '#64748d',
                      fontSize: '12px',
                      fontFeatureSettings: '"tnum"'
                    }}
                  >
                    Press Analyze to cross-reference 413+ post-mortems
                  </span>
                  <button
                    type="submit"
                    disabled={!question.trim() || loading}
                    className="flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    style={{
                      backgroundColor: '#533afd',
                      color: '#ffffff',
                      borderRadius: '9999px',
                      padding: '8px 20px',
                      fontSize: '14px',
                      fontWeight: 500,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4434d4'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#533afd'}
                  >
                    {loading ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Synthesizing...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-white" />
                        <span>Analyze Question</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* AI Response Display */}
            {loading && (
              <div 
                className="p-12 text-center"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e3e8ee',
                  borderRadius: '12px',
                  boxShadow: 'rgba(0, 55, 112, 0.06) 0px 2px 8px'
                }}
              >
                <div className="w-8 h-8 border-2 border-[#b9b9f9] border-t-[#533afd] rounded-full animate-spin mx-auto mb-3" />
                <p className="font-mono text-xs text-[#64748d] uppercase tracking-wider">
                  Traversing SEC filings, bankruptcy records, and post-mortem taxonomy...
                </p>
              </div>
            )}

            {!loading && currentResponse && (
              <div 
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e3e8ee',
                  borderRadius: '12px',
                  boxShadow: 'rgba(0, 55, 112, 0.12) 0px 8px 24px',
                  padding: '24px'
                }}
              >
                <AIResponseCard 
                  response={currentResponse} 
                  onAskFollowUp={(q) => handleAsk(q)}
                />
              </div>
            )}

            {!loading && !currentResponse && (
              <div 
                className="p-12 text-center space-y-3"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e3e8ee',
                  borderRadius: '12px',
                  boxShadow: 'rgba(0, 55, 112, 0.06) 0px 2px 8px'
                }}
              >
                <Sparkles className="w-8 h-8 mx-auto" style={{ color: '#b9b9f9' }} />
                <h4 
                  style={{
                    color: '#0d253d',
                    fontWeight: 600,
                    fontSize: '16px'
                  }}
                >
                  Forensic Research Assistant Ready
                </h4>
                <p 
                  className="max-w-md mx-auto"
                  style={{
                    color: '#64748d',
                    fontSize: '14px'
                  }}
                >
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
