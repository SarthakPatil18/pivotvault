import React from 'react';

/**
 * PivotVault Official Flower / Loop Brand Mark
 * Clean monochrome geometric loop structure from design specification
 */
export function PivotVaultIcon({ className = "w-6 h-6", color = "currentColor" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Orthogonal Petals / Loops */}
        <ellipse cx="50" cy="36" rx="14" ry="22" transform="rotate(0 50 36)" fill="none" opacity="0.9" />
        <ellipse cx="64" cy="50" rx="14" ry="22" transform="rotate(90 64 50)" fill="none" opacity="0.9" />
        <ellipse cx="50" cy="64" rx="14" ry="22" transform="rotate(180 50 64)" fill="none" opacity="0.9" />
        <ellipse cx="36" cy="50" rx="14" ry="22" transform="rotate(270 36 50)" fill="none" opacity="0.9" />
        
        {/* Diagonal Petals */}
        <ellipse cx="60" cy="40" rx="12" ry="18" transform="rotate(45 60 40)" fill="none" opacity="0.75" />
        <ellipse cx="60" cy="60" rx="12" ry="18" transform="rotate(135 60 60)" fill="none" opacity="0.75" />
        <ellipse cx="40" cy="60" rx="12" ry="18" transform="rotate(225 40 60)" fill="none" opacity="0.75" />
        <ellipse cx="40" cy="40" rx="12" ry="18" transform="rotate(315 40 40)" fill="none" opacity="0.75" />
      </g>
      {/* Central Core Anchor */}
      <circle cx="50" cy="50" r="3.5" fill={color} />
    </svg>
  );
}

export function PivotVaultLogo({ className = "h-7", showWordmark = true, wordmarkClass = "text-[20px] leading-[30px]" }) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div className="relative flex items-center justify-center text-black dark:text-white transition-colors">
        <PivotVaultIcon className="w-6 h-6" color="currentColor" />
      </div>
      {showWordmark && (
        <span className={`font-sans font-extrabold tracking-tight text-black dark:text-white ${wordmarkClass}`}>
          PivotVault
        </span>
      )}
    </div>
  );
}

export default PivotVaultLogo;

