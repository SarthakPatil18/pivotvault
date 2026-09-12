import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2, 
  RotateCcw, 
  ShieldAlert, 
  ArrowUp,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { chatWithGhost } from '../../lib/api';
import { GhostIcon } from '../common/GhostIcon';

export function FounderChatBox({ startup, isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [geminiApiKey] = useState(() => {
    return typeof window !== 'undefined' ? (localStorage.getItem('gemini_api_key') || localStorage.getItem('pivotvault_gemini_api_key') || '') : '';
  });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  if (!startup) return null;

  const founderName = (startup.founders && startup.founders[0]?.name) || 
                      (startup.founders && startup.founders[0]) || 
                      `${startup.name} Founder`;

  const initials = founderName
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'FO';

  const starterQuestions = [
    `Why did ${startup.name}'s core strategy fail?`,
    `What was the critical turning point before the wind-down?`,
    `What would you do differently today?`,
    `What advice do you have for founders in ${startup.industry?.split('/')[0]?.trim() || 'this sector'}?`
  ];

  // Initialize initial greeting when startup changes
  useEffect(() => {
    if (startup) {
      const introMessage = {
        id: 'initial',
        role: 'assistant',
        sender: founderName,
        text: `I am ${founderName}, founder of ${startup.name}. We launched with massive ambition in ${startup.industry || 'this industry'}, raising ${startup.capitalRaised ? `$${(startup.capitalRaised / 1e6).toFixed(0)}M+` : 'substantial capital'}, but structural missteps and operational friction led to our wind-down in ${startup.failedYear || 2024}. Ask me anything about what went wrong behind closed doors, our board dynamics, or the lessons you should take away.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([introMessage]);
    }
  }, [startup?.id, startup?.name, founderName]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isMinimized]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  if (!isOpen) return null;

  const handleSend = async (questionText) => {
    const textToSend = questionText || input;
    if (!textToSend || !textToSend.trim() || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      sender: 'You',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!questionText) setInput('');
    setLoading(true);

    try {
      const meta = {
        startup: startup.name,
        slug: startup.slug || startup.id,
        founder: founderName,
        industry: startup.industry,
        failureMode: startup.failureMode,
        rootCauses: startup.rootCauses,
        lessons: startup.lessons,
        summary: startup.summary,
        geminiApiKey: geminiApiKey.trim() || undefined
      };

      const res = await chatWithGhost(startup.slug || startup.id, textToSend.trim(), meta);
      const replyText = res?.data?.answer || res?.data?.reply || `Reflecting on ${startup.name}, our biggest mistake was scaling fixed operating costs before confirming sustainable unit economics.`;

      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        sender: res?.data?.persona || founderName,
        text: replyText,
        sources: res?.data?.sources || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        sender: founderName,
        text: `Looking back at our dissolution, no amount of venture capital subsidies can overcome fundamentally inverted unit economics. We scaled fixed commitments before our organic retention justified it.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    const introMessage = {
      id: 'initial',
      role: 'assistant',
      sender: founderName,
      text: `Conversation restarted. I am ${founderName}, founder of ${startup.name}. What specific decision or failure vector would you like to explore?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([introMessage]);
  };

  // Minimized Button (Circular Ghost Action Button from Screenshot)
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-center">
        <button 
          onClick={() => setIsMinimized(false)}
          aria-label={`Open AI Ghost Chat with ${founderName}`}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black text-white dark:bg-white dark:text-black border-2 border-white/25 dark:border-black/25 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer group relative ring-4 ring-black/10 dark:ring-white/10"
          title={`Resume conversation with ${founderName}`}
        >
          <GhostIcon className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-black animate-pulse" />
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-[6px] bg-black text-white dark:bg-white dark:text-black text-xs font-mono font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg">
            <span>Resume {founderName}</span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-32px)] h-[580px] max-h-[calc(100vh-100px)] rounded-[12px] bg-white dark:bg-[#0A0A0A] border border-[#D4D4D4] dark:border-[#2A2A2A] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 font-sans">
      {/* Top Window Header */}
      <div className="px-4 py-3 bg-[#F9F9F9] dark:bg-[#111111] border-b border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black font-mono font-bold flex items-center justify-center shrink-0 border border-white/20 dark:border-black/20">
              <GhostIcon className="w-4 h-4" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#111111]" />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-bold text-black dark:text-white truncate flex items-center gap-1.5">
              <span className="truncate">{founderName}</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#E5E5E5] dark:bg-[#2A2A2A] text-[#525252] dark:text-[#A3A3A3] shrink-0">
                Ghost AI
              </span>
            </h3>
            <p className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3] truncate">
              {startup.name} · {startup.industry?.split('/')[0]?.trim()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[#737373] dark:text-[#A3A3A3]">
          <button 
            onClick={resetChat}
            className="p-1.5 rounded hover:bg-[#EAEAEA] dark:hover:bg-[#222222] hover:text-black dark:hover:text-white cursor-pointer"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded hover:bg-[#EAEAEA] dark:hover:bg-[#222222] hover:text-black dark:hover:text-white cursor-pointer"
            title="Minimize to Ghost icon"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#EAEAEA] dark:hover:bg-[#222222] hover:text-black dark:hover:text-white cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs leading-relaxed">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div 
              key={msg.id} 
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#737373] px-1">
                <span>{msg.sender}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div 
                className={`max-w-[88%] p-3 rounded-[8px] ${
                  isUser 
                    ? 'bg-black text-white dark:bg-white dark:text-black rounded-tr-none'
                    : 'bg-[#F6F6F6] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A] text-black dark:text-[#E0E0E0] rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex flex-col items-start space-y-1">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#737373] px-1">
              <span>{founderName}</span>
              <span>•</span>
              <span>reflecting...</span>
            </div>
            <div className="p-3 rounded-[8px] rounded-tl-none bg-[#F6F6F6] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#737373] dark:text-[#8E8E8E] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] font-mono ml-1">Consulting autopsy records...</span>
            </div>
          </div>
        )}

        {/* Starter Prompts (show when only 1 intro message present) */}
        {messages.length === 1 && (
          <div className="pt-2 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373] dark:text-[#8E8E8E] block">
              Suggested Questions:
            </span>
            <div className="flex flex-col gap-1.5">
              {starterQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="text-left p-2 rounded-[6px] border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0E0E0E] hover:border-black dark:hover:border-white transition-colors text-[11px] text-[#404040] dark:text-[#CCCCCC] cursor-pointer"
                >
                  “{q}”
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-[#F9F9F9] dark:bg-[#111111] border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="relative flex items-center">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${founderName} anything about ${startup.name}...`}
            className="w-full pl-3 pr-10 py-2.5 text-xs rounded-[6px] border border-[#D4D4D4] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] text-black dark:text-white placeholder-[#8E8E8E] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white resize-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className={`absolute right-1.5 p-1.5 rounded-[4px] transition-all cursor-pointer ${
              input.trim() && !loading
                ? 'bg-black text-white dark:bg-white dark:text-black hover:opacity-90'
                : 'text-[#A3A3A3] cursor-not-allowed'
            }`}
            title="Send question"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[9px] font-mono text-[#8E8E8E]">
          <span>Press Enter to send</span>
          <span>PivotVault Hall of Ghosts v3.0</span>
        </div>
      </div>
    </div>
  );
}

export default FounderChatBox;
