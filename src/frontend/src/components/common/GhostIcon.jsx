import React from 'react';

/**
 * GhostIcon matching the Hall of Ghosts arcade / retro ghost character
 * With rounded dome, 2 circular eye dots, and a 3-point zigzag skirt.
 */
export function GhostIcon({ className = "w-6 h-6", color = "currentColor", strokeWidth = 2.5 }) {
  return (
    <svg 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Ghost Outline */}
      <path 
        d="M 8 23 V 14 C 8 9.58 11.58 6 16 6 C 20.42 6 24 9.58 24 14 V 23 L 21.33 20.8 L 18.67 23 L 16 20.8 L 13.33 23 L 10.67 20.8 Z" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Ghost Eyes */}
      <circle cx="13" cy="13.5" r="1.5" fill={color} />
      <circle cx="19" cy="13.5" r="1.5" fill={color} />
    </svg>
  );
}

export default GhostIcon;
