
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ivory: '#FAF7F2',
        beige: '#F3EDE4',
        blush: '#F8DDE6',
        sage: '#DCE8DD',
        gold: '#C8A96A',
        charcoal: '#2B2B2B',
        platinum: '#E8E6E1',
        fog: '#F5F3EF',
        graphite: '#1A1A1A',
        smoke: '#6B6B6B',
      },
      fontFamily: {
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Jost"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxe: '0.35em',
        wide: '0.2em',
      },
      transitionDuration: {
        400: '400ms',
        600: '600ms',
        800: '800ms',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      boxShadow: {
        luxe: '0 25px 80px -20px rgba(43, 43, 43, 0.12)',
        'luxe-lg': '0 40px 100px -30px rgba(43, 43, 43, 0.18)',
        'luxe-gold': '0 30px 70px -20px rgba(200, 169, 106, 0.35)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255,255,255,0.4)',
        float: '0 50px 100px -40px rgba(0,0,0,0.15)',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(4%,-6%) scale(1.1)' },
          '66%': { transform: 'translate(-5%,4%) scale(0.95)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        aurora: 'aurora 18s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      },
      backdropBlur: {
        luxe: '24px',
      },
    },
  },
  plugins: [],
};
