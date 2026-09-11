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
        className={`inline-flex items-center gap-1.5 px-3 lg:px-4 py-2 text-[16px] font-bold leading-[20px] transition-colors duration-150 rounded-[5px] ${
          isCategoryActive 
            ? 'text-black dark:text-white font-extrabold' 
            : 'text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white'
        }`}
        aria-expanded={isOpen}
      >
        <span>{category.name}</span>
        <span className={`text-[10px] transform transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Dropdown Panel with design.md subtle shadow: 0 2px 5px rgba(0,0,0,0.2) */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-[#0E0E0E] border border-[#EFEFEF] dark:border-[#202020] rounded-[5px] p-2 z-50 animate-slide-down"
          style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
          role="menu"
        >
          {category.description && (
            <div className="px-3 py-1.5 mb-1 border-b border-[#EFEFEF] dark:border-[#202020]">
              <p className="text-[12px] text-[#555555] dark:text-white/50">
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
                  className={`group block px-3 py-2.5 rounded-[5px] transition-colors duration-150 ${
                    isActive 
                      ? 'bg-[#FAFAFA] dark:bg-[#1A1A1A] text-black dark:text-white font-bold' 
                      : 'hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] text-black/80 dark:text-white/80'
                  }`}
                  role="menuitem"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-bold leading-tight group-hover:text-black dark:group-hover:text-white">
                      {item.name}
                    </span>
                    <span className="text-[14px] text-[#555555] group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-[12px] text-[#555555] dark:text-white/50 mt-0.5 line-clamp-1">
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

