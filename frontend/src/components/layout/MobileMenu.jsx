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
        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
        onClick={onClose} 
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#ffffff] border-l border-[#e3e8ee] flex flex-col z-10 overflow-hidden animate-slide-down shadow-[rgba(0,55,112,0.12)_0px_8px_24px]">
        {/* Header */}
        <div className="p-5 border-b border-[#e3e8ee] flex items-center justify-between">
          <PivotVaultLogo />
          <button 
            onClick={onClose}
            className="p-2 rounded-[8px] text-[#0d253d] hover:bg-[#f6f9fc] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search Trigger inside drawer */}
        <div className="p-4 border-b border-[#e3e8ee]">
          <button
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 text-[14px] bg-[#f6f9fc] text-[#64748d] border border-[#e3e8ee] rounded-[8px]"
          >
            <span>Search 413+ Failures...</span>
            <span className="font-semibold text-[#0d253d]">⌘K</span>
          </button>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {NAV_CATEGORIES.map((cat) => {
            const isExpanded = !!expandedCategories[cat.id];

            return (
              <div key={cat.id} className="border-b border-[#e3e8ee] pb-3">
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between text-[13px] font-bold uppercase tracking-wider text-[#0d253d] py-1"
                >
                  <span>{cat.name}</span>
                  <span className="text-[12px] text-[#64748d]">{isExpanded ? '▲' : '▼'}</span>
                </button>

                {isExpanded && (
                  <div className="mt-2 pl-3 space-y-1 border-l-2 border-[#533afd]">
                    {cat.items.map((item) => {
                      const itemBasePath = item.href.split('?')[0];
                      const isActive = location.pathname === itemBasePath;

                      return (
                        <Link
                          key={item.name + item.href}
                          to={item.href}
                          onClick={onClose}
                          className={`block px-2 py-2 rounded-[6px] text-[14px] transition-colors ${
                            isActive 
                              ? 'bg-[#f6f9fc] text-[#0d253d] font-semibold' 
                              : 'text-[#273951] hover:text-[#0d253d] hover:bg-[#f6f9fc]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{item.name}</span>
                            <span className="text-[#64748d]">→</span>
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
              className="w-full text-center block text-[14px] transition-colors"
              style={{
                backgroundColor: '#533afd',
                color: '#ffffff',
                borderRadius: '9999px',
                padding: '10px 20px',
                fontWeight: 500,
              }}
            >
              Explore Full Archive →
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-[#f6f9fc] border-t border-[#e3e8ee] text-[12px] text-[#64748d] text-center">
          PivotVault • 413+ Documented Startup Failures
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
