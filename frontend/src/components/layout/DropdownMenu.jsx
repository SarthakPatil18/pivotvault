import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function DropdownMenu({ category }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isCategoryActive = category.items?.some(item => {
    const basePath = item.href.split('?')[0];
    return location.pathname === basePath;
  });

  return (
    <div 
      className="relative" 
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onFocus={() => setIsOpen(true)}
        className={`inline-flex items-center gap-1.5 px-3 lg:px-4 py-2 text-[15px] font-medium leading-[20px] transition-colors duration-150 rounded-[8px] ${
          isCategoryActive 
            ? 'text-[#0d253d] font-semibold' 
            : 'text-[#64748d] hover:text-[#0d253d]'
        }`}
        aria-expanded={isOpen}
      >
        <span>{category.name}</span>
        <span className={`text-[10px] transform transition-transform duration-150 text-[#64748d] ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 w-72 bg-[#ffffff] border border-[#e3e8ee] rounded-[8px] p-2 z-50 animate-slide-down"
          style={{ boxShadow: 'rgba(0, 55, 112, 0.08) 0px 8px 24px' }}
          role="menu"
        >
          {category.description && (
            <div className="px-3 py-1.5 mb-1 border-b border-[#e3e8ee]">
              <p className="text-[12px] text-[#64748d]">
                {category.description}
              </p>
            </div>
          )}

          <div className="space-y-1">
            {category.items.map((item) => {
              const itemBasePath = item.href.split('?')[0];
              const isActive = location.pathname === itemBasePath && 
                (item.href.includes('?') ? location.search === item.href.substring(item.href.indexOf('?')) : location.search === '');

              return (
                <Link
                  key={item.name + item.href}
                  to={item.href}
                  className={`group block px-3 py-2 rounded-[6px] transition-colors duration-150 ${
                    isActive 
                      ? 'bg-[#f6f9fc] text-[#0d253d] font-semibold' 
                      : 'hover:bg-[#f6f9fc] text-[#273951] hover:text-[#0d253d]'
                  }`}
                  role="menuitem"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-medium leading-tight">
                      {item.name}
                    </span>
                    <span className="text-[13px] text-[#64748d] group-hover:text-[#0d253d] group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-[12px] text-[#64748d] mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;
