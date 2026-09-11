import React, { useState } from 'react';

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
  const [imgError, setImgError] = useState(false);

  // Normalize inputs
  const companyName = startup?.name || name || 'Startup';
  const companyId = (startup?.id || id || companyName.toLowerCase().replace(/[^a-z0-9]/g, '-')).toLowerCase();
  const domain = startup?.domain || KNOWN_DOMAINS[companyId] || KNOWN_DOMAINS[companyId.replace(/-[0-9]+$/, '')];

  const sizeClass = SIZES[size] || SIZES.md;

  // 1. High-Resolution Favicon resolver with grayscale filter
  if (domain && !imgError && showDomainFallback) {
    const highResFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    return (
      <div 
        className={`inline-flex items-center justify-center shrink-0 rounded-[6px] overflow-hidden bg-white dark:bg-[#0A0A0A] p-1 border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-xs select-none ${sizeClass} ${className}`}
        title={`${companyName} Logo`}
      >
        <img
          src={highResFaviconUrl}
          alt={`${companyName} logo`}
          className="w-full h-full object-contain grayscale dark:invert"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // 2. Strict Black & White Procedural Monogram
  const initials = companyName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('');

  return (
    <div 
      className={`inline-flex items-center justify-center shrink-0 rounded-[6px] font-mono font-bold bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white select-none shadow-xs ${sizeClass} ${className}`}
      title={`${companyName}`}
    >
      <span className="tracking-tight leading-none">
        {initials || companyName.substring(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

export default CompanyLogo;
