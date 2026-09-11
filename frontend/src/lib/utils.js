/**
 * Utility functions for PivotVault
 */

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '$0';
  if (typeof amount === 'string' && (amount.startsWith('$') || amount.includes('M') || amount.includes('B') || amount.includes('K'))) {
    return amount;
  }
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '$0';

  if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(0)}K`;
  }
  return `$${num.toLocaleString()}`;
}

export function formatNumber(num) {
  if (num === undefined || num === null) return '0';
  return Number(num).toLocaleString();
}

/**
 * Returns color classes based on a failure score (0 - 100)
 * Uses design.md soft-red (#FFE8EB / #FF6173) and neutral monochrome badges
 */
export function getFailureScoreColor(score) {
  const num = Number(score) || 0;
  if (num >= 85) {
    return {
      text: 'text-[#FF6173]',
      bg: 'bg-[#FFE8EB] dark:bg-[#26070A]',
      border: 'border-[#FF6173]/30 dark:border-[#551119]',
      fill: '#FF6173',
      label: 'Catastrophic',
    };
  }
  if (num >= 70) {
    return {
      text: 'text-black dark:text-white',
      bg: 'bg-[#FAFAFA] dark:bg-[#1A1A1A]',
      border: 'border-[#EFEFEF] dark:border-[#2D2D2D]',
      fill: '#000000',
      label: 'Severe',
    };
  }
  if (num >= 50) {
    return {
      text: 'text-[#555555] dark:text-white/70',
      bg: 'bg-[#FAFAFA] dark:bg-[#1A1A1A]',
      border: 'border-[#EFEFEF] dark:border-[#2D2D2D]',
      fill: '#555555',
      label: 'Moderate',
    };
  }
  return {
    text: 'text-[#52C46F]',
    bg: 'bg-[#E7F6EA] dark:bg-[#082410]',
    border: 'border-[#52C46F]/30 dark:border-[#124D23]',
    fill: '#52C46F',
    label: 'Low Risk',
  };
}

export function truncateText(text, maxLength = 120) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
