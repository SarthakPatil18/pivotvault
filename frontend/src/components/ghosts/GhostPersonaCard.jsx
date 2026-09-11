import React, { useState } from 'react';
import { ShieldAlert, Send, AlertCircle, Bot } from 'lucide-react';
import { CompanyLogo } from '../common/CompanyLogo';
import { chatWithGhost } from '../../lib/api';

export function GhostPersonaCard({ persona, onSelect, isSelected }) {
  return (
    <div 
      onClick={() => onSelect(persona)}
      className={`vault-card p-5 cursor-pointer transition-all ${
        isSelected 
          ? 'border-black dark:border-white ring-1 ring-black dark:ring-white bg-[#F5F5F5] dark:bg-[#1A1A1A]' 
          : 'hover:border-black dark:hover:border-white'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[6px] bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-sm flex items-center justify-center shrink-0 border border-black dark:border-white">
            {persona.avatar}
          </div>
          <div>
            <h4 className="text-sm font-bold font-sans text-black dark:text-white">
              {persona.name.split(' (')[0]}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <CompanyLogo name={persona.startup} size="xs" />
              <span className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                {persona.startup} • {persona.industry}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-[#737373] dark:text-[#A3A3A3] line-clamp-2 mb-3">
        {persona.bio}
      </p>

      <div className="pt-2 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">
        <span>Raised: {persona.raised}</span>
        <span className="text-black dark:text-white font-bold">Autopsy Active</span>
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

  const handleSend = async (textToSend) => {
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

    try {
      const liveRes = await chatWithGhost(persona.id, query);
      if (liveRes?.data?.reply) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ghost',
            text: liveRes.data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsTyping(false);
        return;
      }
    } catch (e) {
      // Graceful fallback to offline persona logic
    }

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
    }, 400);
  };

  return (
    <div className="vault-card flex flex-col h-[640px] overflow-hidden p-0 border-[#E5E5E5] dark:border-[#2A2A2A]">
      {/* Disclaimer Header */}
      <div className="p-3.5 bg-black text-white dark:bg-[#0A0A0A] border-b border-[#2A2A2A] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-white" />
          <span className="font-bold">{persona.name}</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-[#A3A3A3]">
          <ShieldAlert className="w-3.5 h-3.5 text-white" />
          <span>AI Reconstructed Persona • Public Evidence Only</span>
        </div>
      </div>

      {/* Prominent Legal / Ethical UX Banner */}
      <div className="px-4 py-2 bg-[#F5F5F5] dark:bg-[#1A1A1A] border-b border-[#E5E5E5] dark:border-[#2A2A2A] text-[11px] text-black dark:text-white flex items-center gap-2 font-mono">
        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-black dark:text-white" />
        <span>{persona.disclaimer}</span>
      </div>

      {/* Chat Transcript Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAFAFA] dark:bg-black">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3]">
              <span>{msg.sender === 'user' ? 'Founder Researcher' : persona.name.split(' (')[0]}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div 
              className={`max-w-[88%] sm:max-w-[80%] p-3.5 rounded-[6px] text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-black text-white dark:bg-white dark:text-black font-sans font-medium'
                  : 'bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#2A2A2A] text-black dark:text-white shadow-xs'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs font-mono text-[#737373] dark:text-[#A3A3A3] p-2">
            <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
            <span>Reconstructing historical reflection from court transcripts & public records...</span>
          </div>
        )}
      </div>

      {/* Starter Questions Pills */}
      <div className="p-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A]">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-1.5">
          Probing Autopsy Questions:
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {persona.starterQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="whitespace-nowrap px-2.5 py-1 text-[11px] rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black dark:text-white font-mono border border-[#E5E5E5] dark:border-[#2A2A2A] transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#0A0A0A] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Probe ${persona.name.split(' (')[0]}'s decisions, governance, or missed signals...`}
          className="flex-1 px-3 py-2 text-xs bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[6px] text-black dark:text-white placeholder-[#737373] focus:outline-none focus:border-black dark:focus:border-white font-sans"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="btn-primary text-xs px-4 py-2 shrink-0 font-bold rounded-[6px] flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Probe</span>
        </button>
      </form>
    </div>
  );
}

export default GhostPersonaCard;
