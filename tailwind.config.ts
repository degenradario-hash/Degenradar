import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-nova)', 'Nova Flat', 'sans-serif'],
        subtitle: ['var(--font-chakra)', 'Chakra Petch', 'sans-serif'],
        body: ['var(--font-outfit)', 'Outfit', 'sans-serif'],
        mono: ['var(--font-space)', 'Space Mono', 'monospace'],
      },
      animation: {
        'pulse-accent': 'pulse-accent 2s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        'pulse-accent': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #FFFF0033' },
          '100%': { boxShadow: '0 0 20px #FFFF0066' },
        },
      },
    },
  },
  plugins: [],
}
export default config
