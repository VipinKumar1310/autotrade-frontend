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
          surface: '#121212',
          card: '#1a1a1a',
          border: '#2a2a2a',
          text: '#ffffff',
          muted: '#888888',
        },
        // Light mode colors
        light: {
          bg: '#ffffff',
          surface: '#f8f8f8',
          card: '#ffffff',
          border: '#e5e5e5',
          text: '#0a0a0a',
          muted: '#666666',
        },
        // Status colors
        profit: '#22c55e',
        loss: '#ef4444',
        warning: '#f97316',
        info: '#6b7280',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config

