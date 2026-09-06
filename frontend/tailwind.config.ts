import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/@moni-labs/moni-ui/**/*.{js,mjs,ts}'
  ],
  theme: {
    extend: {
      colors: {
        'surface-light': '#F8FAFC',
        'surface-dark': '#0F172A',
        'primary-blue': '#0284C7',
        'accent-cyan': '#06B6D4',
        'alert-green': '#10B981',
        'alert-yellow': '#F59E0B',
        'alert-red': '#EF4444',
        'incident-orange': '#F97316'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      }
    }
  },
  plugins: []
} satisfies Config
