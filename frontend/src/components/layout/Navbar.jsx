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
      <header className="sticky top-0 z-50 w-full bg-[#ffffff] border-b border-[#e3e8ee] transition-colors duration-150">
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

          {/* Right Action Tools: Search, Theme, Explore CTA, Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger Button */}
            <button
              onClick={openSearch}
              className="flex items-center gap-2 px-3 py-2 text-[14px] text-[#64748d] hover:text-[#0d253d] bg-[#ffffff] border border-[#e3e8ee] rounded-[8px] transition-colors"
              title="Search startup intelligence (Cmd+K)"
              aria-label="Search startup intelligence"
            >
              <Search className="w-4 h-4 text-[#64748d]" />
              <span className="hidden lg:inline font-normal text-[#64748d]">Search archive...</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[11px] font-mono bg-[#f6f9fc] border border-[#e3e8ee] rounded text-[#64748d]">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-[#64748d] hover:text-[#0d253d] hover:bg-[#f6f9fc] rounded-[8px] transition-colors"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#64748d]" /> : <Moon className="w-4 h-4 text-[#64748d]" />}
            </button>

            {/* Explore Archive CTA Button (hidden on mobile) */}
            <Link
              to="/explore"
              className="hidden lg:inline-flex items-center justify-center text-[14px] transition-colors"
              style={{
                backgroundColor: '#533afd',
                color: '#ffffff',
                borderRadius: '9999px',
                padding: '8px 20px',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4434d4'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#533afd'}
            >
              Explore Archive →
            </Link>

            {/* Hamburger Button (md:hidden) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col items-center justify-center w-[48px] h-[48px] p-2 focus:outline-none"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              <span 
                className={`block w-[26px] h-[3px] bg-[#0d253d] rounded-sm transition-transform duration-150 ${
                  mobileMenuOpen ? 'rotate-45 translate-y-[9px]' : ''
                }`}
              />
              <span 
                className={`block w-[26px] h-[3px] bg-[#0d253d] rounded-sm my-[6px] transition-opacity duration-150 ${
                  mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span 
                className={`block w-[26px] h-[3px] bg-[#0d253d] rounded-sm transition-transform duration-150 ${
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
