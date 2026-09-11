import React, { useState } from 'react';
import { ShieldAlert, MessageSquare, Send, Sparkles, AlertCircle, RotateCcw, Bot } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { CompanyLogo } from '../common/CompanyLogo';

export function GhostPersonaCard({ persona, onSelect, isSelected }) {
  return (
    <div 
      onClick={() => onSelect(persona)}
      className={`vault-card p-5 cursor-pointer transition-all ${
        isSelected 
          ? 'border-neutral-900 dark:border-neutral-100 ring-1 ring-neutral-900 dark:ring-neutral-100 bg-neutral-50 dark:bg-neutral-900' 
          : 'hover:border-neutral-400 dark:hover:border-neutral-600'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-mono font-bold text-sm flex items-center justify-center shrink-0">
            {persona.avatar}
          </div>
          <div>
            <h4 className="text-sm font-bold font-sans text-neutral-950 dark:text-neutral-50">
              {persona.name.split(' (')[0]}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <CompanyLogo name={persona.startup} size="xs" />
              <span className="text-[11px] font-mono text-rose-600 dark:text-rose-400">
                {persona.startup} • {persona.industry}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-3">
        {persona.bio}
      </p>

      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-500">
        <span>Raised: {persona.raised}</span>
        <span className="text-rose-600 font-medium">Autopsy Active</span>
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

  // Reset when persona changes
  React.useEffect(() => {
    setMessages([
      {
        sender: 'ghost',
        text: persona.initialMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [persona.id]);

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = persona.responses['default'];
      const qLower = query.toLowerCase();

      if (qLower.includes('peer') || qLower.includes('science') || qLower.includes('publish')) {
        replyText = persona.responses['peer-review'] || replyText;
      } else if (qLower.includes('board') || qLower.includes('governance') || qLower.includes('kissinger')) {
        replyText = persona.responses['board'] || replyText;
      } else if (qLower.includes('signal') || qLower.includes('warn') || qLower.includes('lab')) {
        replyText = persona.responses['signals'] || replyText;
      } else if (qLower.includes('tech') || qLower.includes('valuation') || qLower.includes('multiple')) {
        replyText = persona.responses['tech'] || replyText;
      } else if (qLower.includes('softbank') || qLower.includes('masa') || qLower.includes('billion')) {
        replyText = persona.responses['softbank'] || replyText;
      } else if (qLower.includes('mismatch') || qLower.includes('lease') || qLower.includes('rent')) {
        replyText = persona.responses['mismatch'] || replyText;
      } else if (qLower.includes('screenshot') || qLower.includes('share') || qLower.includes('virality')) {
        replyText = persona.responses['screenshots'] || replyText;
      } else if (qLower.includes('tiktok') || qLower.includes('creator') || qLower.includes('youtube')) {
        replyText = persona.responses['tiktok'] || replyText;
      } else if (qLower.includes('burn') || qLower.includes('rate') || qLower.includes('revenue')) {
        replyText = persona.responses['burn'] || replyText;
      } else if (qLower.includes('merchant') || qLower.includes('checkout') || qLower.includes('retail')) {
        replyText = persona.responses['merchants'] || replyText;
      } else if (qLower.includes('platform') || qLower.includes('shopify') || qLower.includes('apple')) {
        replyText = persona.responses['platforms'] || replyText;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ghost',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="vault-card flex flex-col h-[640px] overflow-hidden">
      {/* Disclaimer Header (Mandatory Requirement) */}
      <div className="p-3.5 bg-neutral-900 text-white dark:bg-neutral-950 dark:text-neutral-100 border-b border-neutral-800 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-rose-500" />
          <span className="font-bold">{persona.name}</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-neutral-400">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
          <span>AI Reconstructed Persona • Public Evidence Only</span>
        </div>
      </div>

      {/* Prominent Legal / Ethical UX Banner */}
      <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
        <span>{persona.disclaimer}</span>
      </div>

      {/* Chat Transcript Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-neutral-50/50 dark:bg-neutral-900/30">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] font-mono text-neutral-400">
              <span>{msg.sender === 'user' ? 'Founder Researcher' : persona.name.split(' (')[0]}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div 
              className={`max-w-[88%] sm:max-w-[80%] p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-sans'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 p-2">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span>Reconstructing historical reflection from court transcripts & public records...</span>
          </div>
        )}
      </div>

      {/* Starter Questions Pills */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
          Probing Autopsy Questions:
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {persona.starterQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="whitespace-nowrap px-2.5 py-1 text-[11px] rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-sans border border-neutral-200 dark:border-neutral-700 transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Probe ${persona.name.split(' (')[0]}'s decisions, governance, or missed signals...`}
          className="flex-1 px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="vault-btn-primary text-xs px-3.5 py-2 shrink-0 font-mono"
        >
          <Send className="w-3.5 h-3.5 mr-1" />
          <span>Probe</span>
        </button>
      </form>
    </div>
  );
}

export default GhostPersonaCard;
