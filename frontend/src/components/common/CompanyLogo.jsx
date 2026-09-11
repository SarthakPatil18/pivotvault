import React, { useState } from 'react';
import { resolveCompanyDomain } from '../../lib/data/companyDomains';

// Authentic vector brand marks for famous historical startup failures
const OFFICIAL_BRAND_SVGS = {
  theranos: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <circle cx="50" cy="50" r="46" fill="#E52528" />
      <circle cx="50" cy="50" r="24" fill="#FFFFFF" />
      <circle cx="50" cy="50" r="13" fill="#E52528" />
      <circle cx="50" cy="28" r="4.5" fill="#FFFFFF" />
      <circle cx="72" cy="50" r="4.5" fill="#FFFFFF" />
      <circle cx="50" cy="72" r="4.5" fill="#FFFFFF" />
      <circle cx="28" cy="50" r="4.5" fill="#FFFFFF" />
    </svg>
  ),
  wework: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#000000" />
      <text x="50" y="65" textAnchor="middle" fill="#FFFFFF" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="38" letterSpacing="-2">
        we
      </text>
    </svg>
  ),
  quibi: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="22" fill="url(#quibi-grad)" />
      <defs>
        <linearGradient id="quibi-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8A2BE2" />
          <stop offset="100%" stopColor="#FF1493" />
        </linearGradient>
      </defs>
      <circle cx="48" cy="46" r="22" stroke="#FFFFFF" strokeWidth="8" />
      <path d="M58 56 L74 72" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
    </svg>
  ),
  fast: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#0D1117" />
      <path d="M26 50 L48 24 L42 46 L74 46 L40 76 L48 54 Z" fill="#00E5FF" />
    </svg>
  ),
  ftx: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#0A141D" />
      <rect x="22" y="24" width="56" height="14" rx="3" fill="#00E0D0" />
      <rect x="22" y="44" width="40" height="13" rx="3" fill="#00E0D0" />
      <rect x="22" y="24" width="16" height="52" rx="3" fill="#00E0D0" />
      <rect x="44" y="63" width="34" height="13" rx="3" fill="#60A5FA" />
    </svg>
  ),
  vine: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#00B488" />
      <path d="M30 32 C36 48 44 68 50 74 C56 68 62 48 68 32 C62 32 58 40 50 56 C44 42 40 32 30 32 Z" fill="#FFFFFF" />
      <circle cx="50" cy="74" r="5" fill="#FFFFFF" />
    </svg>
  ),
  juicero: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#2ECC71" />
      <path d="M50 20 C50 20 28 46 28 62 C28 74 38 82 50 82 C62 82 72 74 72 62 C72 46 50 20 50 20 Z" fill="#FFFFFF" />
      <path d="M50 40 L50 72 M42 56 L50 64 L58 56" stroke="#2ECC71" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  jawbone: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#EA4435" />
      <rect x="22" y="42" width="8" height="16" rx="4" fill="#FFFFFF" />
      <rect x="34" y="32" width="8" height="36" rx="4" fill="#FFFFFF" />
      <rect x="46" y="24" width="8" height="52" rx="4" fill="#FFFFFF" />
      <rect x="58" y="32" width="8" height="36" rx="4" fill="#FFFFFF" />
      <rect x="70" y="42" width="8" height="16" rx="4" fill="#FFFFFF" />
    </svg>
  ),
  bird: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#000000" />
      <path d="M22 64 C36 46 58 36 82 34 C64 48 46 64 22 64 Z" fill="#FFFFFF" />
      <circle cx="32" cy="42" r="5" fill="#FFFFFF" />
    </svg>
  ),
  pebble: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#E11D48" />
      <rect x="26" y="22" width="48" height="56" rx="8" fill="#1F2937" stroke="#FFFFFF" strokeWidth="4" />
      <rect x="34" y="32" width="32" height="36" rx="3" fill="#F3F4F6" />
      <path d="M40 50 L46 44 L52 54 L58 48" stroke="#E11D48" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
  solyndra: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#0F172A" />
      <circle cx="50" cy="50" r="18" fill="#F59E0B" />
      <path d="M50 14 L50 24 M50 76 L50 86 M14 50 L24 50 M76 50 L86 50 M25 25 L32 32 M68 68 L75 75 M75 25 L68 32 M32 68 L25 75" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),
  katerra: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#0B2545" />
      <path d="M24 74 L50 26 L76 74 Z" stroke="#10B981" strokeWidth="7" fill="none" strokeLinejoin="round" />
      <path d="M36 74 L50 48 L64 74 Z" fill="#10B981" />
    </svg>
  ),
  'pets-com': (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#F97316" />
      <circle cx="36" cy="38" r="7" fill="#FFFFFF" />
      <circle cx="64" cy="38" r="7" fill="#FFFFFF" />
      <circle cx="26" cy="52" r="6" fill="#FFFFFF" />
      <circle cx="74" cy="52" r="6" fill="#FFFFFF" />
      <ellipse cx="50" cy="62" rx="16" ry="13" fill="#FFFFFF" />
    </svg>
  ),
  webvan: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#15803D" />
      <path d="M22 40 L54 40 L66 52 L78 52 L78 66 L22 66 Z" fill="#FFFFFF" />
      <circle cx="34" cy="68" r="7" fill="#FACC15" />
      <circle cx="66" cy="68" r="7" fill="#FACC15" />
      <rect x="52" y="46" width="10" height="8" fill="#15803D" />
    </svg>
  ),
  blockbuster: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#1E3A8A" />
      <rect x="18" y="30" width="64" height="40" rx="4" fill="#FACC15" transform="rotate(-6 50 50)" />
      <text x="50" y="55" textAnchor="middle" fill="#1E3A8A" fontFamily="sans-serif" fontWeight="900" fontSize="16" transform="rotate(-6 50 50)">
        BB
      </text>
    </svg>
  ),
  napster: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#10B981" />
      <circle cx="50" cy="52" r="22" fill="#FFFFFF" />
      <path d="M30 38 L36 48 M70 38 L64 48" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
      <circle cx="42" cy="52" r="3.5" fill="#10B981" />
      <circle cx="58" cy="52" r="3.5" fill="#10B981" />
      <path d="M24 48 C24 32 76 32 76 48" stroke="#1F2937" strokeWidth="4" fill="none" />
      <rect x="20" y="44" width="8" height="16" rx="4" fill="#1F2937" />
      <rect x="72" y="44" width="8" height="16" rx="4" fill="#1F2937" />
    </svg>
  ),
  blackberry: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#000000" />
      <g fill="#FFFFFF">
        <circle cx="36" cy="36" r="5" />
        <circle cx="50" cy="36" r="5" />
        <circle cx="64" cy="36" r="5" />
        <circle cx="30" cy="50" r="5" />
        <circle cx="44" cy="50" r="5" />
        <circle cx="58" cy="50" r="5" />
        <circle cx="72" cy="50" r="5" />
        <circle cx="36" cy="64" r="5" />
        <circle cx="50" cy="64" r="5" />
        <circle cx="64" cy="64" r="5" />
      </g>
    </svg>
  ),
  clubhouse: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#F59E0B" />
      <path d="M36 34 C36 28 42 28 42 34 L42 48 M42 30 C42 24 48 24 48 30 L48 48 M48 32 C48 26 54 26 54 32 L54 50 M54 38 C54 34 60 34 60 38 L60 54 C60 66 52 74 42 74 C34 74 30 68 30 60 L30 52 C30 46 36 46 36 50 Z" fill="#FFFFFF" />
    </svg>
  ),
  byjus: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#6D28D9" />
      <text x="50" y="62" textAnchor="middle" fill="#FBBF24" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="32">
        B
      </text>
    </svg>
  ),
  'yik-yak': (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#22C55E" />
      <circle cx="50" cy="54" r="18" fill="#FFFFFF" />
      <path d="M34 40 C28 28 20 32 20 40 M66 40 C72 28 80 32 80 40" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" />
      <circle cx="44" cy="52" r="3" fill="#22C55E" />
      <circle cx="56" cy="52" r="3" fill="#22C55E" />
    </svg>
  ),
  rdio: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#0284C7" />
      <circle cx="50" cy="50" r="22" stroke="#FFFFFF" strokeWidth="8" fill="none" />
      <path d="M50 28 L50 72" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
    </svg>
  ),
  'zume-pizza': (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#EF4444" />
      <path d="M26 30 L74 30 L50 78 Z" fill="#FBBF24" stroke="#FFFFFF" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="44" cy="42" r="3.5" fill="#DC2626" />
      <circle cx="56" cy="48" r="3.5" fill="#DC2626" />
      <circle cx="50" cy="60" r="3.5" fill="#DC2626" />
    </svg>
  ),
  scalefactor: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#2563EB" />
      <path d="M26 70 L50 30 L74 70 Z" fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinejoin="round" />
      <path d="M38 70 L50 50 L62 70 Z" fill="#FFFFFF" />
    </svg>
  )
};

// Distinctive color palettes for procedural brand badges
const BRAND_GRADIENTS = [
  'from-indigo-600 to-violet-700 text-white',
  'from-blue-600 to-cyan-600 text-white',
  'from-emerald-600 to-teal-700 text-white',
  'from-rose-600 to-pink-700 text-white',
  'from-amber-500 to-orange-600 text-white',
  'from-purple-600 to-fuchsia-700 text-white',
  'from-slate-700 to-neutral-900 text-white',
  'from-teal-600 to-emerald-700 text-white'
];

function getBrandGradient(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % BRAND_GRADIENTS.length;
  return BRAND_GRADIENTS[idx];
}

// Size configurations in exact pixels
const SIZES = {
  xs: 'w-5 h-5 min-w-[20px] text-[10px]',
  sm: 'w-7 h-7 min-w-[28px] text-[11px]',
  md: 'w-9 h-9 min-w-[36px] text-[13px]',
  lg: 'w-12 h-12 min-w-[48px] text-[16px]',
  xl: 'w-16 h-16 min-w-[64px] text-[20px]'
};

export function CompanyLogo({ 
  startup, 
  name, 
  id, 
  size = 'md', 
  className = '',
  showDomainFallback = true
}) {
  const [providerIndex, setProviderIndex] = useState(0); // 0: Google S2, 1: DuckDuckGo, 2: Monogram

  // Normalize inputs
  const companyName = startup?.name || name || 'Startup';
  const rawId = (startup?.id || startup?.slug || id || companyName).toLowerCase();
  const cleanKey = rawId.replace(/[^a-z0-9]/g, '-').replace(/^-+|-+$/g, '');
  const strippedKey = cleanKey.replace(/-/g, '');

  // 1. Check for authentic curated vector brand mark
  const svgLogo = OFFICIAL_BRAND_SVGS[cleanKey] || 
                  OFFICIAL_BRAND_SVGS[strippedKey] || 
                  OFFICIAL_BRAND_SVGS[companyName.toLowerCase()];

  const sizeClass = SIZES[size] || SIZES.md;

  if (svgLogo) {
    return (
      <div 
        className={`inline-flex items-center justify-center shrink-0 rounded-[8px] overflow-hidden bg-white shadow-xs p-0.5 border border-neutral-200/90 dark:border-neutral-700/80 select-none ${sizeClass} ${className}`}
        title={`${companyName} Official Logo`}
      >
        {svgLogo}
      </div>
    );
  }

  // 2. Resolve domain for real high-clarity network fetching
  const domain = startup?.domain || resolveCompanyDomain(companyName, cleanKey);

  if (domain && showDomainFallback && providerIndex < 2) {
    const urls = [
      `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      `https://icons.duckduckgo.com/ip3/${domain}.ico`
    ];
    const currentUrl = urls[providerIndex];

    return (
      <div 
        className={`inline-flex items-center justify-center shrink-0 rounded-[8px] overflow-hidden bg-white shadow-xs p-1 border border-neutral-200/90 dark:border-neutral-700/80 select-none ${sizeClass} ${className}`}
        title={`${companyName} Logo`}
      >
        <img
          src={currentUrl}
          alt={`${companyName} logo`}
          className="w-full h-full object-contain"
          onError={() => setProviderIndex((prev) => prev + 1)}
          loading="lazy"
        />
      </div>
    );
  }

  // 3. Fallback: Distinctive Brand Monogram Badge with deterministic vibrant gradient
  const initials = companyName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('');

  const gradientClass = getBrandGradient(companyName);

  return (
    <div 
      className={`inline-flex items-center justify-center shrink-0 rounded-[8px] font-sans font-bold bg-gradient-to-br ${gradientClass} select-none shadow-xs border border-white/20 ${sizeClass} ${className}`}
      title={companyName}
    >
      <span className="tracking-tight leading-none drop-shadow-xs">
        {initials || companyName.substring(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

export default CompanyLogo;
