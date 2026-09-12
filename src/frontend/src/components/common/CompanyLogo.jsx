import React, { useState } from 'react';
import { resolveCompanyDomain } from '../../lib/data/companyDomains';

// Authentic vector brand marks for famous historical startup failures
const OFFICIAL_BRAND_SVGS = {
  arrival: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="18" fill="#0A0A0A" />
      <g fill="#FFFFFF">
        <path d="M22 68 L36 28 L46 28 L60 68 L50 68 L41 42 L32 68 Z" />
        <rect x="33" y="52" width="16" height="5" />
        <path d="M58 28 L72 28 C78 28 82 32 82 37 C82 41 79 44 75 45 L84 68 L74 68 L66 47 L64 47 L64 68 L58 68 Z M64 34 L64 42 L71 42 C73 42 75 40 75 38 C75 36 73 34 71 34 Z" />
      </g>
      <circle cx="50" cy="80" r="3" fill="#10B981" />
    </svg>
  ),
  enron: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="18" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="2" />
      <g transform="translate(50, 40) rotate(-45) translate(-26, -26)">
        <rect x="0" y="0" width="46" height="10" fill="#00A859" />
        <rect x="0" y="16" width="36" height="10" fill="#0080C6" />
        <rect x="0" y="32" width="46" height="10" fill="#ED1C24" />
        <rect x="0" y="0" width="10" height="42" fill="#00A859" />
      </g>
      <text x="50" y="84" textAnchor="middle" fill="#111111" fontFamily="sans-serif" fontWeight="900" fontSize="13" letterSpacing="2">
        ENRON
      </text>
    </svg>
  ),
  'lehman-brothers': (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="18" fill="#001F3F" />
      <text x="50" y="48" textAnchor="middle" fill="#FFFFFF" fontFamily="Georgia, serif" fontWeight="700" fontSize="30" letterSpacing="1">
        LB
      </text>
      <line x1="20" y1="56" x2="80" y2="56" stroke="#C5A059" strokeWidth="2" />
      <text x="50" y="70" textAnchor="middle" fill="#C5A059" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="7.5" letterSpacing="1.8">
        LEHMAN BROTHERS
      </text>
    </svg>
  ),
  lehman: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="18" fill="#001F3F" />
      <text x="50" y="48" textAnchor="middle" fill="#FFFFFF" fontFamily="Georgia, serif" fontWeight="700" fontSize="30" letterSpacing="1">
        LB
      </text>
      <line x1="20" y1="56" x2="80" y2="56" stroke="#C5A059" strokeWidth="2" />
      <text x="50" y="70" textAnchor="middle" fill="#C5A059" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="7.5" letterSpacing="1.8">
        LEHMAN BROTHERS
      </text>
    </svg>
  ),
  worldcom: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="18" fill="#002B49" />
      <circle cx="50" cy="38" r="18" stroke="#00A3E0" strokeWidth="3.5" fill="none" />
      <ellipse cx="50" cy="38" rx="18" ry="7" stroke="#FFBF00" strokeWidth="2.5" fill="none" transform="rotate(-25 50 38)" />
      <text x="50" y="74" textAnchor="middle" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="9.5" letterSpacing="1.5">
        WORLDCOM
      </text>
    </svg>
  ),
  wirecard: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="18" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="2" />
      <g fill="#FF5500">
        <circle cx="50" cy="36" r="4.5" />
        <path d="M41 28 C46 23 54 23 59 28" stroke="#FF5500" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M33 21 C42 13 58 13 67 21" stroke="#FF5500" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      </g>
      <text x="50" y="72" textAnchor="middle" fill="#111111" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="12" letterSpacing="0.5">
        wirecard
      </text>
    </svg>
  ),
  kodak: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="18" fill="#FFC800" />
      <g fill="#D81E05">
        <rect x="22" y="20" width="56" height="60" rx="8" />
        <circle cx="62" cy="50" r="18" fill="#FFC800" />
        <path d="M22 20 L22 80 L38 80 L38 56 L54 80 L74 80 L52 50 L72 20 L52 20 L38 42 L38 20 Z" fill="#FFC800" />
        <text x="44" y="55" fill="#D81E05" fontFamily="sans-serif" fontWeight="900" fontSize="8" letterSpacing="1">Kodak</text>
      </g>
    </svg>
  ),
  nokia: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="18" fill="#124191" />
      <text x="50" y="59" textAnchor="middle" fill="#FFFFFF" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="19" letterSpacing="1.5">
        NOKIA
      </text>
    </svg>
  ),
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
      <rect width="100" height="100" rx="20" fill="#682382" />
      <defs>
        <linearGradient id="byjus-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDB813" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <path
        d="M30 24 L52 24 C62 24 70 29 70 37.5 C70 43.5 66 47.5 60 49.5 C68 51.5 73 56.5 73 64 C73 72.5 64 78 52 78 L30 78 Z M43 35 L43 45 L52 45 C56 45 59 43 59 40 C59 37 56 35 52 35 Z M43 57 L43 67 L53 67 C57.5 67 61 65 61 62 C61 59 57.5 57 53 57 Z"
        fill="url(#byjus-gold)"
      />
      <circle cx="76" cy="27" r="4.5" fill="#FDB813" />
    </svg>
  ),
  'byju-s': (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#682382" />
      <path
        d="M30 24 L52 24 C62 24 70 29 70 37.5 C70 43.5 66 47.5 60 49.5 C68 51.5 73 56.5 73 64 C73 72.5 64 78 52 78 L30 78 Z M43 35 L43 45 L52 45 C56 45 59 43 59 40 C59 37 56 35 52 35 Z M43 57 L43 67 L53 67 C57.5 67 61 65 61 62 C61 59 57.5 57 53 57 Z"
        fill="#FDB813"
      />
      <circle cx="76" cy="27" r="4.5" fill="#FDB813" />
    </svg>
  ),
  byju: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#682382" />
      <path
        d="M30 24 L52 24 C62 24 70 29 70 37.5 C70 43.5 66 47.5 60 49.5 C68 51.5 73 56.5 73 64 C73 72.5 64 78 52 78 L30 78 Z M43 35 L43 45 L52 45 C56 45 59 43 59 40 C59 37 56 35 52 35 Z M43 57 L43 67 L53 67 C57.5 67 61 65 61 62 C61 59 57.5 57 53 57 Z"
        fill="#FDB813"
      />
      <circle cx="76" cy="27" r="4.5" fill="#FDB813" />
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
  ),
  'better-place': (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#047857" />
      <circle cx="50" cy="50" r="26" stroke="#FFFFFF" strokeWidth="6" fill="none" />
      <path d="M50 32 L50 48 L62 48" stroke="#34D399" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="50" cy="50" r="5" fill="#34D399" />
    </svg>
  ),
  moviepass: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#DC2626" />
      <rect x="22" y="30" width="56" height="40" rx="6" fill="#991B1B" stroke="#FFFFFF" strokeWidth="3" />
      <text x="50" y="58" textAnchor="middle" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="24">
        M
      </text>
    </svg>
  ),
  'essential-products': (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#18181B" />
      <circle cx="50" cy="50" r="24" stroke="#A1A1AA" strokeWidth="5" fill="none" />
      <circle cx="50" cy="50" r="8" fill="#FFFFFF" />
    </svg>
  ),
  convoy: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#059669" />
      <path d="M24 64 L50 26 L76 64 Z" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" />
      <line x1="38" y1="52" x2="62" y2="52" stroke="#FFFFFF" strokeWidth="4" />
    </svg>
  ),
  'toys-r-us': (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#0284C7" />
      <text x="50" y="64" textAnchor="middle" fill="#FACC15" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="36" transform="scale(-1, 1) translate(-100, 0)">
        R
      </text>
      <circle cx="28" cy="36" r="4" fill="#EF4444" />
      <circle cx="72" cy="68" r="4" fill="#22C55E" />
    </svg>
  ),
  'musical-ly': (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#E11D48" />
      <circle cx="42" cy="66" r="10" fill="#FFFFFF" />
      <path d="M52 66 L52 30 L74 24 L74 44 L52 48" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
  'justin-tv': (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#7C3AED" />
      <rect x="22" y="34" width="56" height="42" rx="8" fill="#5B21B6" stroke="#FFFFFF" strokeWidth="4" />
      <line x1="38" y1="22" x2="48" y2="34" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
      <line x1="62" y1="22" x2="52" y2="34" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="55" r="8" fill="#FACC15" />
    </svg>
  ),
  netscape: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#0D9488" />
      <circle cx="50" cy="50" r="28" stroke="#FFFFFF" strokeWidth="4" fill="none" />
      <path d="M38 68 L38 32 L62 68 L62 32" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  digg: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#1E40AF" />
      <text x="50" y="66" textAnchor="middle" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="32">
        digg
      </text>
    </svg>
  ),
  kozmo: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#FF5000" />
      <circle cx="50" cy="44" r="22" stroke="#FFFFFF" strokeWidth="6" fill="none" />
      <path d="M42 36 L58 52 M58 36 L42 52" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" />
      <text x="50" y="80" textAnchor="middle" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="12" letterSpacing="1">
        KOZMO
      </text>
    </svg>
  ),
  'kozmo-com': (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#FF5000" />
      <circle cx="50" cy="44" r="22" stroke="#FFFFFF" strokeWidth="6" fill="none" />
      <path d="M42 36 L58 52 M58 36 L42 52" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" />
      <text x="50" y="80" textAnchor="middle" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="12" letterSpacing="1">
        KOZMO
      </text>
    </svg>
  ),
  shyp: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#1E88E5" />
      <path d="M30 40 L50 28 L70 40 L70 64 L50 76 L30 64 Z" stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" fill="none" />
      <path d="M50 28 L50 76 M30 40 L50 52 L70 40" stroke="#FFFFFF" strokeWidth="4.5" strokeLinejoin="round" />
    </svg>
  ),
  hopin: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#2563EB" />
      <circle cx="50" cy="50" r="20" fill="#FFFFFF" />
      <circle cx="50" cy="50" r="9" fill="#2563EB" />
    </svg>
  ),
  casper: (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <rect width="100" height="100" rx="20" fill="#1C355E" />
      <text x="50" y="58" textAnchor="middle" fill="#FFFFFF" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="700" fontSize="22">
        Casper
      </text>
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

// Size configurations in exact pixels (enlarged for rich visibility)
const SIZES = {
  xs: 'w-6 h-6 min-w-[24px] text-[11px]',
  sm: 'w-8 h-8 min-w-[32px] text-[12px]',
  md: 'w-12 h-12 min-w-[48px] text-[15px]',
  lg: 'w-16 h-16 min-w-[64px] text-[18px]',
  xl: 'w-20 h-20 min-w-[80px] text-[22px]',
  '2xl': 'w-24 h-24 sm:w-28 sm:h-28 min-w-[96px] sm:min-w-[112px] text-[28px]',
  '3xl': 'w-32 h-32 sm:w-36 sm:h-36 min-w-[128px] sm:min-w-[144px] text-[36px]'
};

export function CompanyLogo({ 
  startup, 
  name, 
  id, 
  size = 'md', 
  className = '',
  showDomainFallback = true
}) {
  const [providerIndex, setProviderIndex] = useState(0);

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
        className={`inline-flex items-center justify-center shrink-0 rounded-[10px] overflow-hidden bg-white shadow-xs p-1 border border-neutral-200/90 dark:border-neutral-700/80 select-none ${sizeClass} ${className}`}
        title={`${companyName} Official Logo`}
      >
        {svgLogo}
      </div>
    );
  }

  // 2. Resolve domain for real high-clarity network fetching
  const domain = startup?.domain || resolveCompanyDomain(companyName, cleanKey);

  if (domain && showDomainFallback && providerIndex < 5) {
    const urls = [
      `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      `https://icon.horse/icon/${domain}`,
      `https://icons.duckduckgo.com/ip3/${domain}.ico`,
      `https://unavatar.io/${domain}?fallback=false`,
      `https://logo.clearbit.com/${domain}`
    ];
    const currentUrl = urls[providerIndex];

    return (
      <div 
        className={`inline-flex items-center justify-center shrink-0 rounded-[10px] overflow-hidden bg-white shadow-xs p-1.5 border border-neutral-200/90 dark:border-neutral-700/80 select-none ${sizeClass} ${className}`}
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
