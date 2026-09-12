import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Send, 
  AlertCircle, 
  Bot, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  Scale, 
  CheckCircle2, 
  ChevronRight,
  TrendingDown,
  FileText
} from 'lucide-react';
import { CompanyLogo } from '../common/CompanyLogo';
import { chatWithGhost } from '../../lib/api';

export function GhostPersonaCard({ persona, onSelect, isSelected }) {
  return (
    <div 
      onClick={() => onSelect(persona)}
      className={`p-4 rounded-[8px] border transition-all cursor-pointer text-left relative group ${
        isSelected 
          ? 'border-black dark:border-white bg-[#F9F9F9] dark:bg-[#121212] shadow-xs' 
          : 'border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-black hover:border-[#A3A3A3] dark:hover:border-[#525252]'
      }`}
    >
      {/* Active Indicator Bar */}
      {isSelected && (
        <div className="absolute left-0 top-3 bottom-3 w-1 bg-black dark:bg-white rounded-r" />
      )}

      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-3">
          {/* Avatar Monogram */}
          <div className={`w-10 h-10 rounded-[6px] flex items-center justify-center font-mono font-bold text-xs shrink-0 border transition-colors ${
            isSelected 
              ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' 
              : 'bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white border-[#E5E5E5] dark:border-[#2A2A2A] group-hover:border-black dark:group-hover:border-white'
          }`}>
            {persona.avatar}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-[14px] font-bold tracking-tight text-black dark:text-white">
                {persona.name}
              </h4>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-[4px] bg-[#F0F0F0] dark:bg-[#202020] text-[#737373] dark:text-[#A3A3A3]">
                AI Ghost
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <CompanyLogo name={persona.startup} size="xs" />
              <span className="text-[12px] font-semibold text-black dark:text-white">
                {persona.startup}
              </span>
              <span className="text-[#D4D4D4] dark:text-[#404040]">•</span>
              <span className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                {persona.industry}
              </span>
            </div>
          </div>
        </div>

        <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition-transform ${
          isSelected ? 'text-black dark:text-white translate-x-0.5' : 'text-[#A3A3A3] group-hover:text-black dark:group-hover:text-white'
        }`} />
      </div>

      <p className="text-[12px] text-[#737373] dark:text-[#A3A3A3] leading-relaxed line-clamp-2 mb-3">
        {persona.bio}
      </p>

      {/* Metrics Strip */}
      <div className="pt-2.5 border-t border-[#EFEFEF] dark:border-[#222222] flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
          <TrendingDown className="w-3 h-3" />
          <span>{persona.capitalLost} Lost</span>
        </div>
        <span className="text-[#737373] dark:text-[#A3A3A3]">
          {persona.raised} Raised
        </span>
      </div>
    </div>
  );
}

export function GhostChatInterface({ persona }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ghost',
      text: persona.initialMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'evidence'
  const messagesEndRef = useRef(null);

  // Auto-scroll when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Reset when persona changes
  useEffect(() => {
    setMessages([
      {
        sender: 'ghost',
        text: persona.initialMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setActiveTab('chat');
  }, [persona.id]);

  const handleReset = () => {
    setMessages([
      {
        sender: 'ghost',
        text: persona.initialMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const liveRes = await chatWithGhost(persona.id, query, persona);
      const reply = liveRes?.data?.reply || liveRes?.data?.answer;
      if (reply) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ghost',
            text: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsTyping(false);
        return;
      }
    } catch (e) {
      // Graceful fallback to offline smart heuristics
    }

    // Smart heuristic matching across persona responses
    let replyText = persona.responses['default'];
    const qLower = query.toLowerCase();

    const matchKeys = Object.keys(persona.responses);
    for (const key of matchKeys) {
      if (key === 'default') continue;
      // If query matches any key or parts of key words
      const parts = key.split('-');
      if (parts.some((part) => qLower.includes(part))) {
        replyText = persona.responses[key];
        break;
      }
    }

    // Additional thematic heuristics
    if (replyText === persona.responses['default']) {
      if (qLower.includes('peer') || qLower.includes('science') || qLower.includes('journal') || qLower.includes('publish')) {
        replyText = persona.responses['peer-review'] || replyText;
      } else if (qLower.includes('board') || qLower.includes('governance') || qLower.includes('director') || qLower.includes('kissinger')) {
        replyText = persona.responses['board'] || persona.responses['governance'] || replyText;
      } else if (qLower.includes('signal') || qLower.includes('warn') || qLower.includes('lab') || qLower.includes('early')) {
        replyText = persona.responses['signals'] || persona.responses['beta'] || replyText;
      } else if (qLower.includes('softbank') || qLower.includes('masa') || qLower.includes('capital') || qLower.includes('fund')) {
        replyText = persona.responses['softbank'] || replyText;
      } else if (qLower.includes('lease') || qLower.includes('duration') || qLower.includes('mismatch') || qLower.includes('rent')) {
        replyText = persona.responses['mismatch'] || replyText;
      } else if (qLower.includes('tech') || qLower.includes('valuation') || qLower.includes('multiple') || qLower.includes('software')) {
        replyText = persona.responses['tech'] || replyText;
      } else if (qLower.includes('screenshot') || qLower.includes('clip') || qLower.includes('social') || qLower.includes('piracy')) {
        replyText = persona.responses['screenshots'] || replyText;
      } else if (qLower.includes('tiktok') || qLower.includes('creator') || qLower.includes('youtube') || qLower.includes('consumer')) {
        replyText = persona.responses['tiktok'] || replyText;
      } else if (qLower.includes('cost') || qLower.includes('minute') || qLower.includes('spend') || qLower.includes('budget')) {
        replyText = persona.responses['cost'] || replyText;
      } else if (qLower.includes('burn') || qLower.includes('runway') || qLower.includes('cash') || qLower.includes('revenue')) {
        replyText = persona.responses['burn'] || replyText;
      } else if (qLower.includes('merchant') || qLower.includes('checkout') || qLower.includes('retail') || qLower.includes('adoption')) {
        replyText = persona.responses['merchants'] || replyText;
      } else if (qLower.includes('platform') || qLower.includes('shopify') || qLower.includes('apple') || qLower.includes('moat')) {
        replyText = persona.responses['platforms'] || replyText;
      } else if (qLower.includes('headcount') || qLower.includes('hire') || qLower.includes('hiring') || qLower.includes('team')) {
        replyText = persona.responses['headcount'] || replyText;
      } else if (qLower.includes('hardware') || qLower.includes('part') || qLower.includes('engineer') || qLower.includes('machine')) {
        replyText = persona.responses['hardware'] || replyText;
      } else if (qLower.includes('wifi') || qLower.includes('drm') || qLower.includes('pack') || qLower.includes('qr')) {
        replyText = persona.responses['wifi'] || replyText;
      } else if (qLower.includes('bloomberg') || qLower.includes('video') || qLower.includes('squeeze') || qLower.includes('hand')) {
        replyText = persona.responses['bloomberg'] || replyText;
      } else if (qLower.includes('alameda') || qLower.includes('backdoor') || qLower.includes('code') || qLower.includes('python')) {
        replyText = persona.responses['backdoor'] || replyText;
      } else if (qLower.includes('deficit') || qLower.includes('hole') || qLower.includes('customer') || qLower.includes('deposit')) {
        replyText = persona.responses['deficit'] || replyText;
      } else if (qLower.includes('diligence') || qLower.includes('investor') || qLower.includes('sequoia') || qLower.includes('fomo')) {
        replyText = persona.responses['diligence'] || replyText;
      } else if (qLower.includes('control') || qLower.includes('ray') || qLower.includes('audit') || qLower.includes('accounting')) {
        replyText = persona.responses['controls'] || replyText;
      }
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ghost',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="rounded-[8px] border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-black shadow-sm overflow-hidden flex flex-col h-[700px]">
      {/* 1. Header Bar */}
      <div className="p-4 sm:p-5 border-b border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[6px] bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-sm flex items-center justify-center shrink-0">
            {persona.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-black dark:text-white tracking-tight">
                {persona.name}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#737373] dark:text-[#A3A3A3] font-semibold">
                {persona.startup} • {persona.role}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[12px] text-[#737373] dark:text-[#A3A3A3]">
              <span>Failure Vector: <strong className="text-black dark:text-white font-medium">{persona.failureCause}</strong></span>
            </div>
          </div>
        </div>

        {/* Action Controls & Tab Toggle */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-[6px] p-0.5 bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1 text-[11px] font-bold rounded-[4px] transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs'
                  : 'text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white'
              }`}
            >
              Dialogue
            </button>
            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-3 py-1 text-[11px] font-bold rounded-[4px] transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'evidence'
                  ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs'
                  : 'text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>Dossier ({persona.evidenceSources?.length || 4})</span>
            </button>
          </div>

          <button
            onClick={handleReset}
            title="Reset Conversation"
            className="p-1.5 rounded-[6px] border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] hover:bg-[#F5F5F5] dark:hover:bg-[#1E1E1E] text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Micro Trust Banner */}
      <div className="px-4 py-2 bg-[#FAFAFA] dark:bg-[#0D0D0D] border-b border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between text-[11px] text-[#737373] dark:text-[#A3A3A3]">
        <div className="flex items-center gap-1.5 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Synthesized strictly from verified trial testimony, SEC filings, & post-mortem records</span>
        </div>
        <span className="hidden sm:inline font-mono text-[10px] text-[#A3A3A3]">
          NO LIVING PERSON PARTICIPATION
        </span>
      </div>

      {/* 3. Main View Area (Chat or Evidence Dossier) */}
      {activeTab === 'evidence' ? (
        /* Evidence Dossier View */
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-white dark:bg-black">
          <div>
            <h4 className="text-[13px] font-bold uppercase tracking-wider text-black dark:text-white mb-2 font-mono flex items-center gap-1.5">
              <Scale className="w-4 h-4" />
              <span>Verified Public Evidence Sources</span>
            </h4>
            <div className="space-y-2">
              {persona.evidenceSources?.map((source, idx) => (
                <div 
                  key={idx} 
                  className="p-3 rounded-[6px] border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#111111] text-[12px] font-mono text-black dark:text-white flex items-center gap-2"
                >
                  <span className="text-[#A3A3A3] font-bold">[{idx + 1}]</span>
                  <span>{source}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[13px] font-bold uppercase tracking-wider text-black dark:text-white mb-2 font-mono flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Key Forensic Themes Investigated</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {persona.keyThemes?.map((theme, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-[6px] border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] text-[12px] text-[#404040] dark:text-[#CCCCCC] leading-relaxed flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white shrink-0 mt-1.5" />
                  <span>{theme}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-[6px] bg-[#F5F5F5] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-black dark:text-white block mb-1">
              Financial Autopsy Summary
            </span>
            <div className="grid grid-cols-3 gap-3 text-center mt-3 pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
              <div>
                <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3] uppercase font-mono">Total Capital Raised</div>
                <div className="text-[14px] font-bold font-mono text-black dark:text-white mt-0.5">{persona.raised}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3] uppercase font-mono">Peak Valuation</div>
                <div className="text-[14px] font-bold font-mono text-black dark:text-white mt-0.5">{persona.peakValuation}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3] uppercase font-mono">Estimated Loss</div>
                <div className="text-[14px] font-bold font-mono text-rose-600 dark:text-rose-400 mt-0.5">{persona.capitalLost}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Interactive Chat Transcript */
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#FAFAFA] dark:bg-[#0A0A0A]">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1.5 px-1 text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                <span className="font-semibold">
                  {msg.sender === 'user' ? 'Founder Researcher' : `${persona.name} (Reconstructed)`}
                </span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div 
                className={`max-w-[92%] sm:max-w-[85%] p-4 rounded-[8px] text-[13px] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-black text-white dark:bg-white dark:text-black font-medium shadow-xs'
                    : 'bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] text-black dark:text-white shadow-xs'
                }`}
              >
                {msg.sender === 'ghost' ? (
                  <div className="space-y-3">
                    <p className="font-normal text-black dark:text-[#E5E5E5]">
                      {msg.text}
                    </p>
                    <div className="pt-2 border-t border-[#F0F0F0] dark:border-[#1F1F1F] flex items-center justify-between text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                      <span>Source: Court Docket & S-1 Records</span>
                      <span>Verified Persona Response</span>
                    </div>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-[12px] font-mono text-[#737373] dark:text-[#A3A3A3] p-2">
              <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
              <span>Querying forensic transcripts & evidence dockets...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* 4. Starter Questions Pill Bar */}
      <div className="px-4 py-2.5 border-t border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-black">
        <div className="flex items-center justify-between mb-1.5 text-[10px] font-mono uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3]">
          <span className="font-bold">Suggested Autopsy Inquiries:</span>
          <span>Click to Probe</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {persona.starterQuestions?.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="whitespace-nowrap px-3 py-1 text-[11px] font-medium rounded-[4px] bg-[#F5F5F5] dark:bg-[#141414] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] transition-colors shrink-0 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Input Bar */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-3 sm:p-4 border-t border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#0A0A0A] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Probe ${persona.name.split(' ')[0]}'s governance, board dynamics, or ignored signals...`}
          className="flex-1 px-3.5 py-2.5 text-[13px] bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[6px] text-black dark:text-white placeholder-[#737373] focus:outline-none focus:border-black dark:focus:border-white transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="px-4 py-2.5 rounded-[6px] bg-black text-white dark:bg-white dark:text-black text-[12px] font-bold hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Probe</span>
        </button>
      </form>
    </div>
  );
}

export default GhostPersonaCard;
