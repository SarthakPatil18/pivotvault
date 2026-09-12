/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // the five official brand colors
        'pv-lime': '#C6F91F',
        'pv-navy': '#0B132B',
        'pv-teal': '#5BC0BE',
        'pv-violet': '#6320EE',
        'pv-lavender': '#8075FF',
        // navy surface ramp
        'pv-navy-1': '#101A38',
        'pv-navy-2': '#16203F',
        'pv-navy-3': '#1E2A4E',
        'pv-navy-4': '#2A3760',
        // light surfaces
        'pv-paper': '#F8F6F2',
        'pv-paper-3': '#EFECE6',
        'pv-paper-4': '#E8E4DD',
        'pv-paper-violet': '#ECEAFD',
        'pv-surface': '#FFFFFF',
        // palette tints + hairlines
        'pv-lime-tint': '#F2FBD4',
        'pv-lime-line': '#DDEFA6',
        'pv-teal-tint': '#E2F4F3',
        'pv-teal-line': '#C6E6E5',
        'pv-violet-tint': '#ECE6FD',
        'pv-violet-line': '#D5C8F7',
        'pv-lavender-tint': '#EAE7FF',
        'pv-lavender-line': '#D3CCFF',
        // ink ramp on light
        'pv-ink': '#0B132B',
        'pv-ink-2': '#1B2340',
        'pv-muted': '#555E7A',
        'pv-muted-2': '#7C85A0',
        'pv-muted-3': '#9AA2B8',
        'pv-line': 'rgba(11, 19, 43, 0.14)',
        // deepened accents — readable as small text on light tints
        'pv-teal-ink': '#1C7D7B',
        'pv-violet-ink': '#4A17B8',
        'pv-lavender-muted': '#7F76C9',
        // ink ramp on navy
        'pv-on-navy': '#F4F6FF',
        'pv-on-navy-2': '#DFE3F2',
        'pv-on-navy-muted': '#A9B1CB',
        'pv-on-navy-faint': '#7D86A3',
        'pv-on-navy-line': 'rgba(255, 255, 255, 0.12)',
        'pv-on-lime': '#0B132B',
        'pv-on-lime-muted': '#46560F',
      },
      fontFamily: {
        display: ['"Sora"', '"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        '44': '2.75rem',
        '84': '4.75rem',
        '100': '5.25rem',
        '112': '6.25rem',
        '144': '8rem',
        '168': '9rem',
        '168-lg': '10.5rem',
      },
      maxWidth: {
        shell: '80rem',
        'shell-sm': '62rem',
        'hero-copy': '30rem',
        'hero-copy-lg': '32rem',
        'section-copy': '38.5rem',
        'section-copy-sm': '32rem',
        cta: '32rem',
        'cta-form': '22rem',
        nav: '50rem',
        'nav-sm': '43.5rem',
        testimonial: '43.5rem',
      },
      letterSpacing: {
        tightest: '-0.08em',
        tighter: '-0.07em',
        tight: '-0.06em',
      },
      borderRadius: {
        nav: '0.75rem',
        card: '0.875rem',
        'card-sm': '0.625rem',
        'btn': '0.5rem',
        'btn-sm': '0.375rem',
      },
      boxShadow: {
        float: '0 10px 30px rgba(11, 19, 43, 0.06)',
        card: '0 16px 40px rgba(11, 19, 43, 0.13)',
        'card-lg': '0 29px 60px rgba(11, 19, 43, 0.22)',
        'btn-dark': '0 4px 13px rgba(11, 19, 43, 0.16)',
        'btn-dark-active':
          '0 6px 2px rgba(17,17,17,0.01), 0 3px 2px rgba(17,17,17,0.05), 0 1px 1px rgba(17,17,17,0.09), 0 0 1px rgba(17,17,17,0.12), inset 0 6px 12px rgba(17,17,17,0.05), inset 0 1px 1px rgba(17,17,17,0.2)',
      },
    },
  },
  plugins: [],
}
