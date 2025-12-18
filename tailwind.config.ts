import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark mode colors
        dark: {
          bg: '#0a0a0a',
          surface: '#111111',
          card: '#161616',
          border: '#262626',
          text: '#ffffff',
          muted: '#737373',
        },
        // Light mode colors
        light: {
          bg: '#fafafa',
          surface: '#ffffff',
          card: '#ffffff',
          border: '#e5e5e5',
          text: '#0a0a0a',
          muted: '#525252',
        },
        // Status colors
        profit: '#22c55e',
        loss: '#ef4444',
        warning: '#f97316',
        info: '#6b7280',
      },
      fontFamily: {
        sans: ['DM Sans', 'var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'var(--font-mono)', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      letterSpacing: {
        tightest: '-0.03em',
      },
      boxShadow: {
        'premium': '0 1px 2px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.04)',
        'premium-lg': '0 2px 4px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glow-profit': '0 0 20px rgba(34, 197, 94, 0.3)',
        'glow-loss': '0 0 20px rgba(239, 68, 68, 0.3)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'number-pop': 'number-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'live': 'live-indicator 2s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'card-shine': 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 100%)',
      },
    },
  },
  plugins: [],
}
export default config
