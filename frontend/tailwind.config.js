/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#533afd',
          accent: '#533afd',
          deep: '#4434d4',
          soft: '#665efd',
          bg: '#b9b9f9',
        },
        brand: {
          dark: '#1c1e54',
        },
        ink: {
          DEFAULT: '#0d253d',
          secondary: '#273951',
          mute: '#64748d',
          2: '#273951',
          3: '#64748d',
        },
        canvas: {
          DEFAULT: '#ffffff',
          soft: '#f6f9fc',
          cream: '#f5e9d4',
        },
        paper: {
          DEFAULT: '#ffffff',
          2: '#f6f9fc',
        },
        hairline: {
          DEFAULT: '#e3e8ee',
          input: '#a8c3de',
        },
        line: {
          DEFAULT: '#e3e8ee',
          dark: '#e3e8ee',
          dark2: '#a8c3de',
        },
        ruby: {
          DEFAULT: '#ea2261',
          bg: 'rgba(234, 34, 97, 0.10)',
        },
        lemon: {
          DEFAULT: '#9b6829',
          bg: 'rgba(155, 104, 41, 0.12)',
        },
        // Amplemarket Design Token System
        am: {
          'primary-dark': '#111111',
          'primary-light': '#f6f5f3',
          'secondary-dark': '#272625',
          'secondary-light': '#fbfaf9',
          'secondary-white': '#ffffff',
          'neutral-02': '#373634',
          'neutral-03': '#494846',
          'neutral-04': '#5e5c5a',
          'neutral-05': '#787673',
          'neutral-06': '#a7a6a4',
          'neutral-07': '#dcdbda',
          'neutral-08': '#ecebea',
          'product-blue': '#2d72f0',
          'pillars-leadgen': '#e16540',
          'pillars-intelligence': '#328efa',
          'pillars-engagement': '#fbc768',
          'pillars-deliver': '#47d096',
          'nav-light': 'rgba(251, 250, 249, 0.85)',
          'nav-dark': 'rgba(39, 38, 37, 0.85)',
          'nav-border-dark': 'rgba(73, 72, 70, 0.85)',
          'border-white': 'rgba(255, 255, 255, 0.051)',
        },
        'soft-green': '#b9b9f9',
        'strong-green': '#4434d4',
        'soft-red': 'rgba(234, 34, 97, 0.10)',
        'strong-red': '#ea2261',
        'focus-ring': '#533afd',
      },
      fontFamily: {
        sans: ['"Open Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      maxWidth: {
        'site': '1520px',
      },
      borderRadius: {
        'button': '9999px',
        'card': '16px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 55, 112, 0.08)',
        'dropdown': '0 8px 24px rgba(0, 55, 112, 0.08)',
        'product': '0 2px 8px rgba(0, 55, 112, 0.06)',
        'elevated': '0 8px 24px rgba(0, 55, 112, 0.12)',
      },
      animation: {
        'slide-down': 'slideDown 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in': 'fadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
