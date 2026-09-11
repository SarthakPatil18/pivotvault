import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { searchStartups } from '../../lib/api';
import { FailureScoreBadge } from './FailureScoreBadge';
import { CompanyLogo } from './CompanyLogo';
import { formatCurrency } from '../../lib/utils';

export function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query || query.trim() === '') {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchStartups(query);
        setResults(res.data || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (path) => {
    onClose();
    navigate(path);
  };

  const quickTools = [
    { name: 'Risk Scanner', path: '/risk-scanner', desc: 'Scan idea against failure patterns' },
    { name: 'Founder Playbook', path: '/founder-playbook', desc: 'Defensive tactical playbooks' },
    { name: 'Pitch Deck Autopsy', path: '/pitch-deck-autopsy', desc: 'Audit pitch deck economics' },
    { name: 'Competitor Compare', path: '/competitor-compare', desc: 'Side-by-side failure post-mortems' },
    { name: 'Knowledge Graph', path: '/startup-graph', desc: 'Explore relationship network' },
    { name: 'Hall of Ghosts', path: '/hall-of-ghosts', desc: 'Interview AI founder personas' },
    { name: 'Founder Confessions', path: '/founder-confessions', desc: 'Raw founder post-mortems' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-black border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] overflow-hidden z-10 flex flex-col max-h-[80vh] shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
          <Search className="w-5 h-5 text-[#737373] dark:text-[#A3A3A3] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 413+ startups, founders, failure modes, investors..."
            className="w-full bg-transparent text-[15px] text-black dark:text-white placeholder-[#737373] dark:placeholder-[#A3A3A3] focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-3 px-2 py-0.5 text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[4px]">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="py-8 text-center text-[12px] font-mono text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider">
              Querying failure archive...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-8 text-center text-[14px] text-[#737373] dark:text-[#A3A3A3]">
              No matching startup records found for "{query}". Try checking another failure mode or company name.
            </div>
          )}

          {/* Startup Matches */}
          {results.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-2 px-2">
                Matching Startup Records ({results.length})
              </div>
              <div className="space-y-1.5">
                {results.map((startup) => (
                  <button
                    key={startup.id}
                    onClick={() => handleSelect(`/startup/${startup.id}`)}
                    className="w-full text-left p-3 rounded-[6px] hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] border border-transparent hover:border-[#E5E5E5] dark:hover:border-[#2A2A2A] transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CompanyLogo startup={startup} size="md" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[15px] text-black dark:text-white">
                            {startup.name}
                          </span>
                          <span className="text-[12px] text-[#737373] dark:text-[#A3A3A3]">
                            ({startup.industry})
                          </span>
                        </div>
                        <p className="text-[13px] text-[#737373] dark:text-[#A3A3A3] truncate max-w-md">
                          {startup.tagline || startup.summary}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span 
                        className="text-[13px] font-bold text-black dark:text-white"
                        style={{ fontFeatureSettings: '"tnum"', letterSpacing: '-0.42px' }}
                      >
                        {formatCurrency(startup.capitalRaised)}
                      </span>
                      <FailureScoreBadge score={startup.failureScore} size="sm" />
                      <span className="text-[14px] text-black dark:text-white group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Intelligence Tools */}
          {!query && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-2 px-2">
                Quick Intelligence Tools
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickTools.map((tool) => (
                  <button
                    key={tool.path}
                    onClick={() => handleSelect(tool.path)}
                    className="p-3 text-left rounded-[6px] border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-black dark:hover:border-white hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] transition-all group"
                  >
                    <div className="text-[14px] font-bold text-black dark:text-white flex items-center justify-between">
                      <span>{tool.name}</span>
                      <span className="text-black dark:text-white group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                    <div className="text-[12px] text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                      {tool.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-[#F5F5F5] dark:bg-[#0A0A0A] border-t border-[#E5E5E5] dark:border-[#2A2A2A] text-[12px] text-[#737373] dark:text-[#A3A3A3] flex items-center justify-between">
          <span>Search across 413+ verified startup post-mortems</span>
          <span className="hidden sm:inline font-medium text-black dark:text-white">Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
