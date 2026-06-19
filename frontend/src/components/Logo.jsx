import React, { useState } from 'react';
import { clsx } from 'clsx';

// Helper function to extract domain from name (basic heuristic)
const getDomainFromName = (name) => {
  if (!name) return null;
  
  // Common suffixes to try
  const suffixes = ['.com', '.co', '.io', '.ai', '.app', '.net', '.org', '.in'];
  
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  for (const suffix of suffixes) {
    return cleanName + suffix;
  }
  
  return cleanName + '.com';
};

const Logo = ({ 
  name, 
  domain, 
  size = 'md', 
  className = '', 
  fallbackInitials,
  ...props 
}) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const logoDomain = domain || getDomainFromName(name);
  const logoUrl = logoDomain 
    ? `https://logo.clearbit.com/${logoDomain}` 
    : null;
  
  const initials = fallbackInitials || (name 
    ? name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
    : '??');
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-20 h-20 text-3xl'
  };
  
  const getGradient = (str) => {
    const hash = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const gradients = [
      'from-pink-500 to-rose-500',
      'from-purple-600 to-indigo-600',
      'from-blue-500 to-cyan-500',
      'from-emerald-500 to-teal-500',
      'from-amber-500 to-orange-500',
      'from-violet-500 to-fuchsia-500',
    ];
    return gradients[hash % gradients.length];
  };
  
  return (
    <div 
      className={clsx(
        'relative overflow-hidden rounded-lg flex items-center justify-center bg-surface-3 border border-border',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {!isError && logoUrl ? (
        <img
          src={logoUrl}
          alt={`${name || 'Company'} logo`}
          className="w-full h-full object-contain"
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setIsError(true);
          }}
        />
      ) : (
        <div className={clsx(
          'w-full h-full flex items-center justify-center font-display font-bold text-white bg-gradient-to-br',
          getGradient(name || initials)
        )}>
          {initials}
        </div>
      )}
    </div>
  );
};

export default Logo;
