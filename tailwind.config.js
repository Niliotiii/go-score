/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        goscore: {
          bg: 'oklch(98% 0.005 250)',
          surface: 'oklch(100% 0 0)',
          fg: 'oklch(15% 0.01 240)',
          'fg-secondary': 'oklch(35% 0.015 240)',
          muted: 'oklch(55% 0.012 240)',
          border: 'oklch(88% 0.006 240)',
          accent: 'oklch(62% 0.22 145)',
          'bg-dark': 'oklch(10% 0.008 240)',
          'surface-dark': 'oklch(15% 0.01 240)',
          'fg-dark': 'oklch(96% 0.003 240)',
          'muted-dark': 'oklch(55% 0.01 240)',
          'border-dark': 'oklch(22% 0.008 240)',
          danger: '#d62839',
        },
      },
      fontFamily: {
        display: ['-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'ui-monospace', 'Cascadia Mono', 'Menlo', 'monospace'],
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '10px',
        lg: '14px',
      },
      letterSpacing: {
        logo: '-0.03em',
        heading: '-0.015em',
        label: '0.06em',
        timer: '0.02em',
      },
      fontSize: {
        'score': ['clamp(52px, 20vw, 96px)', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
      },
      transitionDuration: {
        '80': '80ms',
        '120': '120ms',
        '180': '180ms',
        '200': '200ms',
        '350': '350ms',
      },
    },
  },
  plugins: [],
}
