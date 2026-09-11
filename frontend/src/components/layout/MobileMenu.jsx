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
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-black border-l border-[#EFEFEF] dark:border-[#202020] flex flex-col z-10 overflow-hidden animate-slide-down">
        {/* Header */}
        <div className="p-5 border-b border-[#EFEFEF] dark:border-[#202020] flex items-center justify-between">
          <PivotVaultLogo />
          <button 
            onClick={onClose}
            className="p-2 rounded-[5px] text-black dark:text-white hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Quick Search Trigger inside drawer */}
        <div className="p-4 border-b border-[#EFEFEF] dark:border-[#202020]">
          <button
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="w-full flex items-center justify-between px-4 py-3 text-[14px] bg-[#FAFAFA] dark:bg-[#1A1A1A] text-[#555555] dark:text-white/60 border border-[#EFEFEF] dark:border-[#2D2D2D] rounded-[5px]"
          >
            <span>Search 413+ Failures...</span>
            <span className="font-bold text-black dark:text-white">⌘K</span>
          </button>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {NAV_CATEGORIES.map((cat) => {
            const isExpanded = !!expandedCategories[cat.id];

            return (
              <div key={cat.id} className="border-b border-[#EFEFEF] dark:border-[#202020] pb-3">
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between text-[14px] font-extrabold uppercase tracking-wider text-black dark:text-white py-1"
                >
                  <span>{cat.name}</span>
                  <span className="text-[12px]">{isExpanded ? '▲' : '▼'}</span>
                </button>

                {isExpanded && (
                  <div className="mt-2 pl-3 space-y-1 border-l-2 border-[#000000] dark:border-white">
                    {cat.items.map((item) => {
                      const itemBasePath = item.href.split('?')[0];
                      const isActive = location.pathname === itemBasePath;

                      return (
                        <Link
                          key={item.name + item.href}
                          to={item.href}
                          onClick={onClose}
                          className={`block px-2 py-2 rounded-[5px] text-[15px] transition-colors ${
                            isActive 
                              ? 'bg-[#FAFAFA] dark:bg-[#1A1A1A] text-black dark:text-white font-bold' 
                              : 'text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{item.name}</span>
                            <span className="text-[#555555]">→</span>
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
          <div className="pt-2 space-y-2">
            <Link
              to="/explore"
              onClick={onClose}
              className="btn-primary w-full text-center block text-[15px]"
            >
              Explore Full Archive →
            </Link>
            <Link
              to="/settings"
              onClick={onClose}
              className="block text-center py-2 text-[14px] font-bold text-[#555555] dark:text-white/60 hover:text-black dark:hover:text-white"
            >
              Settings & Disclosures
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-[#FAFAFA] dark:bg-[#0E0E0E] border-t border-[#EFEFEF] dark:border-[#202020] text-[12px] text-[#555555] dark:text-white/40 text-center">
          PivotVault • 413+ Documented Startup Failures
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;

