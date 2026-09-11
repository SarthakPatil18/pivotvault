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
        ink: {
          DEFAULT: '#000000',
          2: 'rgba(0, 0, 0, 0.6)',
          3: '#555555',
        },
        paper: {
          DEFAULT: '#FFFFFF',
          2: '#FAFAFA',
        },
        line: {
          DEFAULT: '#EFEFEF',
          dark: '#202020',
          dark2: '#2D2D2D',
        },
        'light-black': '#0E0E0E',
        'soft-green': '#E7F6EA',
        'strong-green': '#52C46F',
        'soft-red': '#FFE8EB',
        'strong-red': '#FF6173',
        'dark-input': '#1A1A1A',
        'focus-ring': '#3898EC',
        'table-border': '#E5E5E5',
        'table-alt': '#F5F5F5',
      },
      fontFamily: {
        sans: ['"Open Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      maxWidth: {
        'site': '1150px',
      },
      borderRadius: {
        'button': '5px',
        'card': '12px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
        'dropdown': '0 2px 5px rgba(0,0,0,0.2)',
        'product': '1px 1px 8px rgba(0,0,0,0.1)',
      },
      animation: {
        'slide-down': 'slideDown 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
