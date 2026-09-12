import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { NAV_CATEGORIES } from '../../lib/routes';
import { PivotVaultLogo } from '../../assets/logo';

export function MobileMenu({ isOpen, onClose, onOpenSearch }) {
  const [expandedCategories, setExpandedCategories] = useState({
    explore: true,
    intelligence: true,
    analysis: true,
    insights: true,
    learn: true,
  });
  const location = useLocation();

  if (!isOpen) return null;

  const toggleCategory = (id) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose} 
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-black border-l border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col z-10 overflow-hidden animate-slide-down shadow-xl">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between">
          <PivotVaultLogo />
          <button 
            onClick={onClose}
            className="p-2 rounded-[6px] text-black dark:text-white hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search Trigger inside drawer */}
        <div className="p-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
          <button
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-mono bg-[#F5F5F5] dark:bg-[#0A0A0A] text-[#737373] dark:text-[#A3A3A3] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[6px]"
          >
            <span>Search 413+ Failures...</span>
            <span className="font-bold text-black dark:text-white">⌘K</span>
          </button>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {NAV_CATEGORIES.map((cat) => {
            const hasItems = cat.items && cat.items.length > 0;
            const isExpanded = !!expandedCategories[cat.id];

            if (!hasItems) {
              const isActive = location.pathname === cat.href;
              return (
                <div key={cat.id} className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
                  <Link
                    to={cat.href}
                    onClick={onClose}
                    className={`w-full flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider py-1 ${
                      isActive 
                        ? 'text-black dark:text-white' 
                        : 'text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[#A3A3A3] dark:text-[#737373]">→</span>
                  </Link>
                </div>
              );
            }

            return (
              <div key={cat.id} className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white py-1"
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] text-[#737373] dark:text-[#A3A3A3]">{isExpanded ? '▲' : '▼'}</span>
                </button>

                {isExpanded && (
                  <div className="mt-2 pl-3 space-y-1 border-l-2 border-black dark:border-white">
                    {cat.items.map((item) => {
                      const itemBasePath = item.href.split('?')[0];
                      const isActive = location.pathname === itemBasePath;

                      return (
                        <Link
                          key={item.name + item.href}
                          to={item.href}
                          onClick={onClose}
                          className={`block px-2 py-2 rounded-[4px] text-xs font-medium transition-colors ${
                            isActive 
                              ? 'bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white font-bold' 
                              : 'text-[#404040] dark:text-[#D4D4D4] hover:text-black dark:hover:text-white hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{item.name}</span>
                            <span className="text-[#A3A3A3] dark:text-[#737373]">→</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Direct Links */}
          <div className="pt-2">
            <Link
              to="/explore"
              onClick={onClose}
              className="btn-primary w-full text-xs font-mono"
            >
              Explore Full Archive →
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-[#F5F5F5] dark:bg-[#0A0A0A] border-t border-[#E5E5E5] dark:border-[#2A2A2A] text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3] text-center">
          PivotVault • 413+ Documented Startup Failures
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
