import React, { useState, useEffect, useRef } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { FOUNDER_CONFESSIONS } from '../lib/data/confessionsData';
import { 
  Send, 
  RotateCcw, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  Heart, 
  ShieldAlert,
  Flame,
  ArrowRight,
  TrendingDown,
  User,
  Bot
} from 'lucide-react';
import { CompanyLogo } from '../components/common/CompanyLogo';

export function FounderConfessions() {
  const [selectedFounderId, setSelectedFounderId] = useState('all');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Get current active founder (if not 'all')
  const currentFounder = selectedFounderId === 'all' 
    ? null 
    : FOUNDER_CONFESSIONS.find((c) => c.id === selectedFounderId) || FOUNDER_CONFESSIONS[0];

  // Initialize or reset chat on founder change
  useEffect(() => {
    if (selectedFounderId === 'all') {
      setMessages([
        {
          id: 1,
          sender: 'bot',
          speaker: 'Confession Vault Bot',
          avatar: 'CV',
          text: 'Welcome to the Hall of Confessions. Behind every failed startup chart is a human founder who faced sleepless nights, panic attacks, team layoffs, or the heartbreak of shutting down a dream. Select a founder above, or ask any question below about startup failures.',
          keyLesson: 'Startup autopsies become transformative only when we examine the human decisions and vulnerabilities behind them.',
          suggestions: [
            'What did it feel like laying off 75% of your team?',
            'Why did Pebble lose against the Apple Watch?',
            'How did 99dresses unit economics break?',
            'Why did Justin Kan\'s $75M legal startup crash?',
            'Tell me an unfiltered story about founder burnout'
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else if (currentFounder) {
      setMessages([
        {
          id: 1,
          sender: 'founder',
          speaker: `${currentFounder.founder} (${currentFounder.startup})`,
          avatar: currentFounder.avatar,
          startup: currentFounder.startup,
          failureTag: currentFounder.failureTag,
          capitalRaised: currentFounder.capitalRaised,
          text: `"${currentFounder.title}"\n\n${currentFounder.openingPrompt}`,
          summary: currentFounder.summary,
          keyLesson: currentFounder.keyLessons[0],
          suggestions: currentFounder.starterQuestions || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [selectedFounderId]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleReset = () => {
    if (selectedFounderId === 'all') {
      setSelectedFounderId('confession-1');
      setTimeout(() => setSelectedFounderId('all'), 10);
    } else {
      const cur = selectedFounderId;
      setSelectedFounderId('all');
      setTimeout(() => setSelectedFounderId(cur), 10);
    }
  };

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    const qLower = query.toLowerCase();

    // Determine respondent
    setTimeout(() => {
      let targetFounder = currentFounder;

      // If in 'all' mode, find the founder best matching the question
      if (!targetFounder) {
        if (qLower.includes('gumroad') || qLower.includes('sahil') || qLower.includes('layoff') || qLower.includes('vc') || qLower.includes('series b')) {
          targetFounder = FOUNDER_CONFESSIONS.find((c) => c.id === 'confession-1');
        } else if (qLower.includes('pebble') || qLower.includes('hardware') || qLower.includes('watch') || qLower.includes('inventory') || qLower.includes('migicovsky')) {
          targetFounder = FOUNDER_CONFESSIONS.find((c) => c.id === 'confession-2');
        } else if (qLower.includes('99dresses') || qLower.includes('nikki') || qLower.includes('fashion') || qLower.includes('shipping') || qLower.includes('buttons')) {
          targetFounder = FOUNDER_CONFESSIONS.find((c) => c.id === 'confession-3');
        } else if (qLower.includes('atrium') || qLower.includes('justin') || qLower.includes('legal') || qLower.includes('lawyer') || qLower.includes('75m')) {
          targetFounder = FOUNDER_CONFESSIONS.find((c) => c.id === 'confession-4');
        } else if (qLower.includes('scalefactor') || qLower.includes('fake') || qLower.includes('accounting') || qLower.includes('austin')) {
          targetFounder = FOUNDER_CONFESSIONS.find((c) => c.id === 'confession-5');
        } else if (qLower.includes('burnout') || qLower.includes('panic') || qLower.includes('mental') || qLower.includes('hospital')) {
          targetFounder = FOUNDER_CONFESSIONS.find((c) => c.id === 'confession-6');
        } else {
          // Default to first founder or matching random
          targetFounder = FOUNDER_CONFESSIONS[0];
        }
      }

      // Find best answer matching query
      let answerText = targetFounder.answers?.default || targetFounder.summary;
      let lesson = targetFounder.keyLessons?.[0] || 'Survival requires facing hard economic truths early.';

      const ansKeys = Object.keys(targetFounder.answers || {});
      for (const key of ansKeys) {
        if (key === 'default') continue;
        if (qLower.includes(key) || key.split('-').some((k) => qLower.includes(k))) {
          answerText = targetFounder.answers[key];
          break;
        }
      }

      // Additional semantic checks
      if (qLower.includes('layoff') && targetFounder.answers?.layoff) {
        answerText = targetFounder.answers.layoff;
        lesson = targetFounder.keyLessons[1] || targetFounder.keyLessons[0];
      } else if ((qLower.includes('apple') || qLower.includes('watch')) && targetFounder.answers?.apple) {
        answerText = targetFounder.answers.apple;
      } else if (qLower.includes('inventory') && targetFounder.answers?.inventory) {
        answerText = targetFounder.answers.inventory;
      } else if ((qLower.includes('unit') || qLower.includes('economic')) && targetFounder.answers?.economics) {
        answerText = targetFounder.answers.economics;
      } else if (qLower.includes('burnout') && targetFounder.answers?.burnout) {
        answerText = targetFounder.answers.burnout;
        lesson = targetFounder.keyLessons[1];
      } else if (qLower.includes('fake') && targetFounder.answers?.['fake-ai']) {
        answerText = targetFounder.answers['fake-ai'];
      }

      const botReply = {
        id: Date.now() + 1,
        sender: 'founder',
        speaker: `${targetFounder.founder} (${targetFounder.startup})`,
        avatar: targetFounder.avatar,
        startup: targetFounder.startup,
        failureTag: targetFounder.failureTag,
        text: answerText,
        keyLesson: lesson,
        suggestions: targetFounder.starterQuestions?.slice(0, 3) || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="pb-20 bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <PageHeader
        title="Hall of Confessions"
        subtitle="Simple, unfiltered retrospective chatbot. Ask real founders about the hardest moments, mistakes, and painful truths behind their startup collapses."
        badge="Confession Chatbot"
        tagline="FOUNDER RETROSPECTIVES"
        breadcrumbs={[{ label: 'Stories' }, { label: 'Hall of Confessions' }]}
      />

      <div className="site-container max-w-4xl">
        {/* Simple Chatbot Screen Container */}
        <div className="rounded-[8px] border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-black shadow-sm overflow-hidden flex flex-col h-[700px]">
          {/* Top Bar: Founder Selector Pills & Controls */}
          <div className="p-3.5 sm:p-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-black dark:text-white">
                  {selectedFounderId === 'all' ? 'All Confessions Vault' : `Confessing: ${currentFounder?.founder}`}
                </span>
                <span className="text-[#D4D4D4] dark:text-[#404040] hidden sm:inline">•</span>
                <span className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3] hidden sm:inline">
                  {selectedFounderId === 'all' ? '6 Retrospectives Ready' : `${currentFounder?.startup} • ${currentFounder?.failureTag}`}
                </span>
              </div>

              <button
                onClick={handleReset}
                title="Restart Chat"
                className="p-1.5 rounded-[6px] border border-[#E5E5E5] dark:border-[#2A2A2A] hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Horizontal Founder Switcher Scroll */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setSelectedFounderId('all')}
                className={`px-3 py-1 rounded-[4px] text-[11px] font-mono transition-colors shrink-0 cursor-pointer ${
                  selectedFounderId === 'all'
                    ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                    : 'bg-[#F5F5F5] dark:bg-[#141414] text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]'
                }`}
              >
                ⚡ All Confessions
              </button>

              {FOUNDER_CONFESSIONS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedFounderId(c.id)}
                  className={`px-3 py-1 rounded-[4px] text-[11px] font-mono transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    selectedFounderId === c.id
                      ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                      : 'bg-[#F5F5F5] dark:bg-[#141414] text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white border border-[#E5E5E5] dark:border-[#2A2A2A]'
                  }`}
                >
                  <span>{c.avatar}</span>
                  <span>{c.founder.split(' ')[0]} ({c.startup.split(' ')[0]})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAFAFA] dark:bg-[#0A0A0A]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Speaker Tag */}
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                  <span className="font-semibold">
                    {msg.sender === 'user' ? 'You' : msg.speaker}
                  </span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[92%] sm:max-w-[85%] p-4 rounded-[8px] text-[13px] leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-black text-white dark:bg-white dark:text-black font-medium'
                      : 'bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] text-black dark:text-white space-y-3'
                  }`}
                >
                  {msg.sender === 'founder' || msg.sender === 'bot' ? (
                    <>
                      <p className="whitespace-pre-line text-black dark:text-[#E5E5E5]">
                        {msg.text}
                      </p>

                      {/* Raw Takeaway Lesson Box */}
                      {msg.keyLesson && (
                        <div className="p-3 rounded-[6px] bg-[#FAFAFA] dark:bg-[#111111] border-l-2 border-black dark:border-white text-[12px]">
                          <span className="font-mono font-bold uppercase tracking-wider text-[10px] text-black dark:text-white block mb-0.5">
                            Raw Forensic Lesson:
                          </span>
                          <span className="text-[#525252] dark:text-[#CCCCCC]">
                            {msg.keyLesson}
                          </span>
                        </div>
                      )}

                      {/* Follow-up Prompt Pills */}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="pt-2 border-t border-[#F0F0F0] dark:border-[#1C1C1C] space-y-1.5">
                          <span className="text-[10px] font-mono uppercase text-[#737373] dark:text-[#A3A3A3] font-semibold block">
                            Ask a follow-up:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.suggestions.map((prompt, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSendMessage(prompt)}
                                className="text-left px-2.5 py-1 text-[11px] rounded-[4px] bg-[#F5F5F5] dark:bg-[#141414] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-[#E5E5E5] dark:border-[#2A2A2A] text-black dark:text-white transition-colors cursor-pointer"
                              >
                                {prompt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs font-mono text-[#737373] dark:text-[#A3A3A3] p-2">
                <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
                <span>Founder is reflecting on public retrospective records...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sticky Bottom Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-3 sm:p-4 border-t border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                selectedFounderId === 'all'
                  ? "Ask about layoffs, burn rate, co-founder friction, or shutting down..."
                  : `Ask ${currentFounder?.founder.split(' ')[0]} about their startup failure...`
              }
              className="flex-1 px-3.5 py-2.5 text-[13px] bg-[#FAFAFA] dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[6px] text-black dark:text-white placeholder-[#737373] focus:outline-none focus:border-black dark:focus:border-white transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-4 py-2.5 rounded-[6px] bg-black text-white dark:bg-white dark:text-black text-[12px] font-bold hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FounderConfessions;
