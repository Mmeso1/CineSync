import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Sora', 'sans-serif'],
        'body': ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        'electric-cyan': '#00FFF0',
        'coral-orange': '#FF6E6C',
        'popcorn-yellow': '#FFD16D',
        'dark-bg': '#0B0C10',
        'dark-secondary': '#1A1D23',
        'light-bg': '#F7F7F8',
        'light-secondary': '#FFFFFF',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'film-strip': 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255, 255, 255, 0.1) 10px, rgba(255, 255, 255, 0.1) 20px)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
        'curtain-open': 'curtain-open 2s ease-out forwards',
        'emoji-float': 'emoji-float 2s ease-out forwards',
        'floating-particle': 'float-particles 15s linear infinite',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-ring': {
          '0%': {
            transform: 'scale(0.8)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(2.4)',
            opacity: '0',
          },
        },
        'curtain-open': {
          '0%': { transform: 'scaleY(1)' },
          '100%': { transform: 'scaleY(0)' },
        },
        'emoji-float': {
          '0%': {
            transform: 'translateY(0) scale(1)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(-100px) scale(1.5)',
            opacity: '0',
          },
        },
        'float-particles': {
          '0%': {
            transform: 'translateY(100vh) rotate(0deg)',
            opacity: '0',
          },
          '10%': {
            opacity: '1',
          },
          '90%': {
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(-100px) rotate(360deg)',
            opacity: '0',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 255, 240, 0.3)',
        'glow-coral': '0 0 20px rgba(255, 110, 108, 0.3)',
        'glow-yellow': '0 0 20px rgba(255, 209, 109, 0.3)',
        'neuro-dark': '20px 20px 40px #050608, -20px -20px 40px #111218',
        'neuro-light': '20px 20px 40px #d1d1d2, -20px -20px 40px #ffffff',
        'neuro-inset-dark': 'inset 8px 8px 16px #050608, inset -8px -8px 16px #111218',
        'neuro-inset-light': 'inset 8px 8px 16px #d1d1d2, inset -8px -8px 16px #ffffff',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};

export default config;