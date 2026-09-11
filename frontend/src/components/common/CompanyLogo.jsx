import React, { useState } from 'react';

/**
 * High-clarity Company Logo Component for PivotVault
 * 
 * Provides razor-sharp, high-resolution logos for all startups across the platform:
 * 1. Pixel-perfect, high-clarity vector SVGs for curated/flagship startups
 * 2. High-res (128px) domain favicon resolver with graceful fallback
 * 3. Procedural ultra-sharp vector geometric monogram badges for generated startups
 */

// Official domain mapping for high-clarity fetching
const KNOWN_DOMAINS = {
  theranos: 'theranos.com',
  wework: 'wework.com',
  quibi: 'quibi.com',
  fast: 'fast.co',
  jawbone: 'jawbone.com',
  juicero: 'juicero.com',
  'better-place': 'betterplace.com',
  solyndra: 'solyndra.com',
  ftx: 'ftx.com',
  bird: 'bird.co',
  katerra: 'katerra.com',
  pebble: 'getpebble.com',
  'zume-pizza': 'zume.com',
  zume: 'zume.com',
  scalefactor: 'scalefactor.com',
  vine: 'vine.co',
  gumroad: 'gumroad.com',
  '99dresses': '99dresses.com',
  'magic-leap': 'magicleap.com',
  ubiome: 'ubiome.com',
  beepi: 'beepi.com',
  shyp: 'shyp.com',
  aereo: 'aereo.com',
  rdio: 'rdio.com',
  'yik-yak': 'yikyak.com'
};

// High-clarity custom vector SVGs for major known failure cases
const KNOWN_VECTOR_LOGOS = {
  theranos: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="48" height="48" rx="10" fill="#0d253d" />
      {/* Theranos iconic blood droplet and cross micro-fluidics */}
      <circle cx="24" cy="24" r="14" fill="rgba(234,34,97,0.15)" />
      <path d="M24 13C24 13 17 21.5 17 26.2C17 30.1 20.1 33 24 33C27.9 33 31 30.1 31 26.2C31 21.5 24 13 24 13Z" fill="#ea2261" />
      <circle cx="22.5" cy="23.5" r="2" fill="#ffffff" opacity="0.8" />
    </svg>
  ),
  wework: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="48" height="48" rx="10" fill="#0d253d" />
      {/* WeWork iconic stylized curved 'w' ligature */}
      <path d="M12 28.5C12.8 28.5 13.5 28 13.8 26.8L16.2 17.5H19L16.4 27.5C15.8 29.8 14.2 31 12 31V28.5ZM21.2 28.5C22 28.5 22.7 28 23 26.8L25.4 17.5H28.2L25.6 27.5C25 29.8 23.4 31 21.2 31V28.5ZM30.4 28.5C31.2 28.5 31.9 28 32.2 26.8L34.6 17.5H37.4L34.8 27.5C34.2 29.8 32.6 31 30.4 31V28.5Z" fill="#ffffff" />
      <circle cx="36" cy="18" r="1.5" fill="#533afd" />
    </svg>
  ),
  ftx: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="48" height="48" rx="10" fill="#0c1829" />
      {/* FTX cyan cubic logo */}
      <path d="M14 17H34V22H14V17Z" fill="#00D2D2" />
      <path d="M21 22H31V27H21V22Z" fill="#00D2D2" />
      <path d="M26 27H34V32H26V27Z" fill="#00D2D2" />
      <rect x="14" y="27" width="5" height="5" fill="#00B4D8" />
    </svg>
  ),
  quibi: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="48" height="48" rx="10" fill="#4434d4" />
      {/* Quibi high-contrast Q */}
      <circle cx="23" cy="23" r="9" stroke="#ffffff" strokeWidth="4" />
      <path d="M29 29L35 35" stroke="#ea2261" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  ),
  fast: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="48" height="48" rx="10" fill="#0d253d" />
      {/* Fast forward arrow symbol */}
      <path d="M15 16L25 24L15 32V16Z" fill="#533afd" />
      <path d="M25 16L35 24L25 32V16Z" fill="#ffffff" />
    </svg>
  ),
  bird: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="48" height="48" rx="10" fill="#1c1e54" />
      {/* Bird wings/scooter minimal icon */}
      <path d="M14 28C18 20 28 17 35 18C33 22 29 28 22 30L14 28Z" fill="#ffffff" />
      <path d="M21 21C24 16 30 14 36 15C34 18 31 22 26 24L21 21Z" fill="#533afd" opacity="0.9" />
    </svg>
  ),
  jawbone: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="48" height="48" rx="10" fill="#ea2261" />
      {/* Jawbone audio bars */}
      <rect x="15" y="21" width="3" height="7" rx="1.5" fill="#ffffff" />
      <rect x="21" y="16" width="3" height="17" rx="1.5" fill="#ffffff" />
      <rect x="27" y="19" width="3" height="11" rx="1.5" fill="#ffffff" />
      <rect x="33" y="22" width="3" height="5" rx="1.5" fill="#ffffff" />
    </svg>
  ),
  juicero: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="48" height="48" rx="10" fill="#f6f9fc" stroke="#e3e8ee" strokeWidth="1" />
      {/* Juicero press / droplet */}
      <circle cx="24" cy="24" r="12" fill="#e8f5e9" />
      <path d="M24 16C24 16 18 23 18 26.5C18 29.8 20.7 32 24 32C27.3 32 30 29.8 30 26.5C30 23 24 16 24 16Z" fill="#2e7d32" />
      <path d="M24 19L27 24H21L24 19Z" fill="#81c784" />
    </svg>
  ),
  vine: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="48" height="48" rx="10" fill="#00b488" />
      {/* Vine iconic curly V */}
      <path d="M15 16C15 22 17 33 23 33C29 33 33 23 33 18C33 14 30 14 30 17C30 21 27 28 23 28C19 28 18 20 18 16H15Z" fill="#ffffff" />
    </svg>
  ),
  pebble: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="48" height="48" rx="10" fill="#d32f2f" />
      {/* Pebble e-paper watch face */}
      <rect x="15" y="15" width="18" height="18" rx="4" fill="#ffffff" />
      <rect x="17" y="17" width="14" height="14" rx="2" fill="#1c1e54" />
      <circle cx="24" cy="24" r="2.5" fill="#ffffff" />
    </svg>
  ),
  solyndra: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="48" height="48" rx="10" fill="#0d253d" />
      {/* Solyndra cylindrical solar ring */}
      <circle cx="24" cy="24" r="11" stroke="#9b6829" strokeWidth="3" strokeDasharray="4 2" />
      <circle cx="24" cy="24" r="6" fill="#533afd" />
    </svg>
  ),
  katerra: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="48" height="48" rx="10" fill="#273951" />
      {/* Modular architecture blocks */}
      <rect x="14" y="24" width="9" height="9" fill="#533afd" />
      <rect x="25" y="24" width="9" height="9" fill="#b9b9f9" />
      <rect x="19.5" y="15" width="9" height="9" fill="#ffffff" />
    </svg>
  ),
  'better-place': (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="48" height="48" rx="10" fill="#1c1e54" />
      {/* EV battery switch icon */}
      <circle cx="24" cy="24" r="10" stroke="#4434d4" strokeWidth="3" />
      <path d="M22 17L27 24H23L26 31" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  'zume-pizza': (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="48" height="48" rx="10" fill="#0d253d" />
      {/* Zume robotic pizza slice */}
      <path d="M24 14L34 32H14L24 14Z" fill="#ea2261" />
      <circle cx="24" cy="23" r="2" fill="#ffffff" />
      <circle cx="21" cy="28" r="1.5" fill="#ffffff" />
      <circle cx="27" cy="28" r="1.5" fill="#ffffff" />
    </svg>
  ),
  scalefactor: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="48" height="48" rx="10" fill="#533afd" />
      {/* Financial ledger balance scale */}
      <path d="M24 14V34M16 20L24 17L32 20M14 26C14 28 18 28 18 26L16 20H14ZM30 26C30 28 34 28 34 26L32 20H30Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  gumroad: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="48" height="48" rx="10" fill="#ff90e8" />
      <path d="M24 15C19 15 15 19 15 24C15 29 19 33 24 33C29 33 33 29 33 24H24V21H36C36.2 22 36.4 23 36.4 24C36.4 31 31 36 24 36C17 36 11 31 11 24C11 17 17 12 24 12C28 12 31 13.5 33.5 16L31 18.5C29 16.5 27 15 24 15Z" fill="#000000" />
    </svg>
  )
};

// Size configurations in exact pixels
const SIZES = {
  xs: 'w-5 h-5 min-w-[20px] text-[10px]',
  sm: 'w-7 h-7 min-w-[28px] text-[11px]',
  md: 'w-9 h-9 min-w-[36px] text-[13px]',
  lg: 'w-12 h-12 min-w-[48px] text-[16px]',
  xl: 'w-16 h-16 min-w-[64px] text-[20px]'
};

// Palette themes for procedural deterministic badges
const PALETTE_THEMES = [
  { bg: '#533afd', text: '#ffffff', border: '#4434d4', accent: '#b9b9f9' },
  { bg: '#1c1e54', text: '#ffffff', border: '#0d253d', accent: '#533afd' },
  { bg: '#0d253d', text: '#ffffff', border: '#273951', accent: '#665efd' },
  { bg: '#273951', text: '#ffffff', border: '#1c1e54', accent: '#a8c3de' },
  { bg: '#4434d4', text: '#ffffff', border: '#533afd', accent: '#ffffff' },
  { bg: '#b9b9f9', text: '#1c1e54', border: '#533afd', accent: '#533afd' },
  { bg: '#f6f9fc', text: '#0d253d', border: '#e3e8ee', accent: '#533afd' }
];

function getDeterministicTheme(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETTE_THEMES.length;
  return PALETTE_THEMES[index];
}

export function CompanyLogo({ 
  startup, 
  name, 
  id, 
  size = 'md', 
  className = '',
  showDomainFallback = true
}) {
  const [imgError, setImgError] = useState(false);

  // Normalize inputs
  const companyName = startup?.name || name || 'Startup';
  const companyId = (startup?.id || id || companyName.toLowerCase().replace(/[^a-z0-9]/g, '-')).toLowerCase();
  const domain = startup?.domain || KNOWN_DOMAINS[companyId] || KNOWN_DOMAINS[companyId.replace(/-[0-9]+$/, '')];

  // 1. If we have a dedicated pixel-perfect vector SVG, use it directly (infinite sharpness)
  const normalizedKey = Object.keys(KNOWN_VECTOR_LOGOS).find(
    k => companyId === k || companyId.startsWith(k) || companyName.toLowerCase().includes(k)
  );

  const sizeClass = SIZES[size] || SIZES.md;

  if (normalizedKey && KNOWN_VECTOR_LOGOS[normalizedKey]) {
    return (
      <div 
        className={`inline-flex items-center justify-center shrink-0 rounded-[8px] overflow-hidden shadow-xs select-none ${sizeClass} ${className}`}
        style={{ border: '1px solid rgba(0,55,112,0.08)' }}
        title={`${companyName} Logo`}
      >
        {KNOWN_VECTOR_LOGOS[normalizedKey]}
      </div>
    );
  }

  // 2. High-Resolution Google Favicon resolver (sz=128 for razor-sharp clarity on retina displays)
  if (domain && !imgError && showDomainFallback) {
    const highResFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    return (
      <div 
        className={`inline-flex items-center justify-center shrink-0 rounded-[8px] overflow-hidden bg-[#ffffff] p-1 shadow-xs select-none ${sizeClass} ${className}`}
        style={{ border: '1px solid #e3e8ee' }}
        title={`${companyName} Logo`}
      >
        <img
          src={highResFaviconUrl}
          alt={`${companyName} logo`}
          className="w-full h-full object-contain"
          onError={() => setImgError(true)}
          loading="lazy"
          style={{ imageRendering: '-webkit-optimize-contrast' }}
        />
      </div>
    );
  }

  // 3. Ultra-Crisp Procedural Vector Monogram Badge
  const theme = getDeterministicTheme(companyName);
  const initials = companyName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('');

  return (
    <div 
      className={`inline-flex items-center justify-center shrink-0 rounded-[8px] font-bold select-none shadow-xs ${sizeClass} ${className}`}
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        border: `1px solid ${theme.border}`,
        boxShadow: 'rgba(0, 55, 112, 0.04) 0px 1px 3px'
      }}
      title={`${companyName}`}
    >
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Subtle geometric background accent ring */}
        <circle cx="28" cy="8" r="14" fill={theme.accent} opacity="0.16" />
        <text 
          x="50%" 
          y="54%" 
          dominantBaseline="middle" 
          textAnchor="middle" 
          fill={theme.text}
          fontWeight="700"
          fontSize="14"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          letterSpacing="-0.5px"
        >
          {initials || companyName.substring(0, 2).toUpperCase()}
        </text>
      </svg>
    </div>
  );
}

export default CompanyLogo;
