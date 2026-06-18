import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#070710',
          800: '#0b0b16',
          700: '#11111f',
          600: '#181828',
        },
        chalk: '#ECECF1',
        muted: '#8A8AA0',
        glassline: 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(2.6rem, 7vw, 5.5rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        display: ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.08', letterSpacing: '-0.01em' }],
      },
      backgroundImage: {
        'glass-grad': 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
        'accent-glow': 'radial-gradient(60% 60% at 50% 40%, var(--accent-soft), transparent 70%)',
      },
      boxShadow: {
        glass: '0 8px 40px -12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
        accent: '0 0 50px -8px var(--accent-soft)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        drift: 'drift 60s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)', filter: 'blur(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        drift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-40px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
