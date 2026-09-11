import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PivotVaultLogo } from '../../assets/logo';
import { NAV_CATEGORIES } from '../../lib/routes';
import { DropdownMenu } from './DropdownMenu';
import { MobileMenu } from './MobileMenu';
import { SearchModal } from '../common/SearchModal';
import { useTheme } from '../../hooks/useTheme';
import { useSearch } from '../../hooks/useSearch';
import { Search, Sun, Moon } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { isSearchOpen, openSearch, closeSearch } = useSearch();
  const location = useLocation();

  return (
    <>
      <header 
        className="sticky top-0 z-50 w-full transition-colors duration-150 border-b border-[#E5E5E5] dark:border-[#2A2A2A] bg-white/95 dark:bg-black/95 backdrop-blur-md"
      >
        <div className="site-container flex items-center justify-between h-[68px]">
          {/* Brand Logo */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link to="/" className="flex items-center focus:outline-none" aria-label="PivotVault Home">
              <PivotVaultLogo />
            </Link>

            {/* Desktop Navigation Links / Dropdowns (visible >= md / 768px) */}
            <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
              {NAV_CATEGORIES.map((category) => (
                category.items && category.items.length > 0 ? (
                  <DropdownMenu key={category.id} category={category} />
                ) : (
                  <Link
                    key={category.id}
                    to={category.href}
                    className={`inline-flex items-center px-3 lg:px-4 py-2 text-[14px] font-medium leading-[20px] transition-colors duration-150 rounded-[6px] ${
                      location.pathname === category.href
                        ? 'text-black dark:text-white font-bold'
                        : 'text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {category.name}
                  </Link>
                )
              ))}
            </nav>
          </div>

          {/* Right Action Tools: Search, Theme, Explore CTA, Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger Button */}
            <button
              onClick={openSearch}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono transition-colors rounded-[6px] bg-white dark:bg-[#0A0A0A] text-black dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-black dark:hover:border-white"
              title="Search startup intelligence (Cmd+K)"
              aria-label="Search startup intelligence"
            >
              <Search className="w-3.5 h-3.5 text-black dark:text-white" />
              <span className="hidden lg:inline font-sans text-xs text-[#737373] dark:text-[#A3A3A3]">Search archive...</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono rounded-[4px] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] text-black dark:text-white">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-[6px] transition-colors border border-transparent hover:border-[#E5E5E5] dark:hover:border-[#2A2A2A] hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] text-black dark:text-white"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-black" />}
            </button>

            {/* Explore Archive CTA Button */}
            <Link
              to="/explore"
              className="hidden lg:inline-flex btn-nav-cta shadow-xs"
            >
              Explore Archive →
            </Link>

            {/* Hamburger Button (md:hidden) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col items-center justify-center w-[44px] h-[44px] p-2 focus:outline-none"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              <span 
                className={`block w-[22px] h-[2px] bg-black dark:bg-white rounded-sm transition-transform duration-150 ${
                  mobileMenuOpen ? 'rotate-45 translate-y-[8px]' : ''
                }`}
              />
              <span 
                className={`block w-[22px] h-[2px] bg-black dark:bg-white rounded-sm my-[5px] transition-opacity duration-150 ${
                  mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span 
                className={`block w-[22px] h-[2px] bg-black dark:bg-white rounded-sm transition-transform duration-150 ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Global Search Dialog Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />

      {/* Mobile Drawer Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        onOpenSearch={openSearch} 
      />
    </>
  );
}

export default Navbar;
