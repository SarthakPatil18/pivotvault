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
      text: 'text-[#ea2261]',
      bg: 'bg-[rgba(234,34,97,0.10)]',
      border: 'border-[rgba(234,34,97,0.20)]',
      fill: '#ea2261',
      label: 'Catastrophic',
    };
  }
  if (num >= 70) {
    return {
      text: 'text-[#ea2261]',
      bg: 'bg-[rgba(234,34,97,0.08)]',
      border: 'border-[rgba(234,34,97,0.15)]',
      fill: '#ea2261',
      label: 'Severe',
    };
  }
  if (num >= 50) {
    return {
      text: 'text-[#9b6829]',
      bg: 'bg-[rgba(155,104,41,0.12)]',
      border: 'border-[rgba(155,104,41,0.20)]',
      fill: '#9b6829',
      label: 'Moderate',
    };
  }
  return {
    text: 'text-[#4434d4]',
    bg: 'bg-[#b9b9f9]',
    border: 'border-[#b9b9f9]',
    fill: '#4434d4',
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
