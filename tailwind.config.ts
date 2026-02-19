import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        degen: {
          dark: '#0A0A0F',
          darker: '#06060A',
          card: '#12121A',
          border: '#1E1E2E',
          green: '#00CC6A',
          'green-dim': '#00994F',
          gold: '#FFD700',
          red: '#FF4444',
          orange: '#FF8C00',
          text: '#CCCCCC',
          muted: '#888888',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-green': 'pulse-green 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-green': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px #00CC6A33' },
          '100%': { boxShadow: '0 0 20px #00CC6A66' },
        }
      }
    },
  },
  plugins: [],
}
export default config
