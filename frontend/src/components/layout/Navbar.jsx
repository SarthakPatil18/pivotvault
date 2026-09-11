import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PivotVaultLogo } from '../../assets/logo';
import { NAV_CATEGORIES } from '../../lib/routes';
import { DropdownMenu } from './DropdownMenu';
import { MobileMenu } from './MobileMenu';
import { SearchModal } from '../common/SearchModal';
import { useTheme } from '../../hooks/useTheme';
import { useSearch } from '../../hooks/useSearch';
import { Search, Sun, Moon, Settings } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { isSearchOpen, openSearch, closeSearch } = useSearch();
  const location = useLocation();

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-black border-b border-[#EFEFEF] dark:border-[#202020] transition-colors duration-150">
        <div className="site-container flex items-center justify-between h-[68px]">
          {/* Brand Logo */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link to="/" className="flex items-center focus:outline-none" aria-label="PivotVault Home">
              <PivotVaultLogo />
            </Link>

            {/* Desktop Navigation Hover Dropdowns (visible >= md / 768px) */}
            <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
              {NAV_CATEGORIES.map((category) => (
                <DropdownMenu key={category.id} category={category} />
              ))}
            </nav>
          </div>

          {/* Right Action Tools: Search, Theme, Settings, Explore CTA, Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger Button */}
            <button
              onClick={openSearch}
              className="flex items-center gap-2 px-3 py-2 text-[14px] text-[#555555] dark:text-white/60 hover:text-black dark:hover:text-white bg-[#FAFAFA] dark:bg-[#1A1A1A] border border-[#EFEFEF] dark:border-[#2D2D2D] rounded-[5px] transition-colors"
              title="Search startup intelligence (Cmd+K)"
              aria-label="Search startup intelligence"
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline font-normal">Search archive...</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[11px] font-mono bg-white dark:bg-black border border-[#EFEFEF] dark:border-[#2D2D2D] rounded text-[#555555] dark:text-white/60">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] rounded-[5px] transition-colors"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-black" />}
            </button>

            {/* Settings & Disclosures Link */}
            <Link
              to="/settings"
              className={`p-2 rounded-[5px] transition-colors ${
                location.pathname === '/settings' 
                  ? 'text-black dark:text-white bg-[#FAFAFA] dark:bg-[#1A1A1A]' 
                  : 'text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A]'
              }`}
              title="Platform Settings & Disclosures"
              aria-label="Platform Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>

            {/* Explore Archive CTA Button (hidden on mobile) */}
            <Link
              to="/explore"
              className="hidden lg:inline-flex btn-nav-cta text-[15px]"
            >
              Explore Archive →
            </Link>

            {/* Hamburger Button (md:hidden) from design.md: 68x68px touch area, 26x3px bars */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col items-center justify-center w-[48px] h-[48px] p-2 focus:outline-none"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              <span 
                className={`block w-[26px] h-[3px] bg-black dark:bg-white rounded-sm transition-transform duration-150 ${
                  mobileMenuOpen ? 'rotate-45 translate-y-[9px]' : ''
                }`}
              />
              <span 
                className={`block w-[26px] h-[3px] bg-black dark:bg-white rounded-sm my-[6px] transition-opacity duration-150 ${
                  mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span 
                className={`block w-[26px] h-[3px] bg-black dark:bg-white rounded-sm transition-transform duration-150 ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-[9px]' : ''
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

