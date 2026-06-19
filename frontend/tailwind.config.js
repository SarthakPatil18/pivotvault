/** @type {import('tailwindcss').Config} */

// Helper to build a color that reads space-separated RGB channels from a CSS var,
// while still supporting Tailwind's opacity suffixes (e.g. bg-surface/60).
const withVar = (name) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: withVar('--color-bg'),
        surface: withVar('--color-surface'),
        'surface-2': withVar('--color-surface-2'),
        'surface-3': withVar('--color-surface-3'),
        border: withVar('--color-border'),
        'border-strong': withVar('--color-border-strong'),
        accent: withVar('--color-accent'),
        'accent-2': withVar('--color-accent-2'),
        'accent-contrast': withVar('--color-accent-contrast'),
        info: withVar('--color-info'),
        success: withVar('--color-success'),
        warning: withVar('--color-warning'),
        danger: withVar('--color-danger'),
        'text-primary': withVar('--color-text-primary'),
        'text-secondary': withVar('--color-text-secondary'),
        'text-muted': withVar('--color-text-muted'),
        red: withVar('--color-danger'),
        green: withVar('--color-success'),
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: 'var(--radius-lg)',
        hero: 'var(--radius-xl)',
        button: 'var(--radius-md)',
        badge: 'var(--radius-sm)',
        modal: 'var(--radius-xl)',
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.045em', fontWeight: '700' }],
        'display-sm': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.035em', fontWeight: '700' }],
        'heading-lg': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.025em', fontWeight: '700' }],
        'heading-md': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.015em', fontWeight: '650' }],
        'heading-sm': ['1rem', { lineHeight: '1.4', fontWeight: '650' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.55' }],
        'label': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.08em', fontWeight: '700' }],
        'data': ['0.75rem', { lineHeight: '1.45', fontWeight: '500' }],
      },
      spacing: {
        'control-sm': '2rem',
        'control': '2.5rem',
        'control-lg': '3rem',
        'section': '4rem',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        card: 'var(--shadow-card)',
        elevated: 'var(--shadow-elevated)',
        focus: '0 0 0 3px rgb(var(--color-focus) / 0.22)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
      },
    },
  },
  plugins: [],
}
