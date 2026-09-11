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

  // Fallback if category has no subitems
  if (!category.items || category.items.length === 0) {
    const isActive = location.pathname === category.href;
    return (
      <Link
        to={category.href}
        className={`inline-flex items-center px-3 lg:px-4 py-2 text-[14px] font-medium leading-[20px] transition-colors duration-150 rounded-[6px] ${
          isActive 
            ? 'text-black dark:text-white font-bold' 
            : 'text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white'
        }`}
      >
        {category.name}
      </Link>
    );
  }

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
        className={`inline-flex items-center gap-1.5 px-3 lg:px-4 py-2 text-[14px] font-medium leading-[20px] transition-colors duration-150 rounded-[6px] ${
          isCategoryActive 
            ? 'text-black dark:text-white font-bold' 
            : 'text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white'
        }`}
        aria-expanded={isOpen}
      >
        <span>{category.name}</span>
        <span className={`text-[10px] transform transition-transform duration-150 text-[#737373] dark:text-[#A3A3A3] ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-[8px] p-2 z-50 animate-slide-down shadow-dropdown"
          role="menu"
        >
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
                      ? 'bg-[#F5F5F5] dark:bg-[#1A1A1A] text-black dark:text-white font-bold' 
                      : 'hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] text-[#404040] dark:text-[#D4D4D4] hover:text-black dark:hover:text-white'
                  }`}
                  role="menuitem"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium leading-tight">
                      {item.name}
                    </span>
                    <span className="text-[12px] text-[#A3A3A3] dark:text-[#737373] group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3] mt-0.5 line-clamp-1">
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
