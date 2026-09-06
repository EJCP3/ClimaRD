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
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        vtPageFadeOut: {
          'from': { opacity: '1', transform: 'translateY(0) scale(1)' },
          'to': { opacity: '0', transform: 'translateY(-8px) scale(0.995)' }
        },
        vtPageFadeIn: {
          'from': { opacity: '0', transform: 'translateY(12px) scale(0.995)' },
          'to': { opacity: '1', transform: 'translateY(0) scale(1)' }
        }
      },
      animation: {
        marquee: 'marquee 60s linear infinite',
        fadeIn: 'fadeIn 0.25s ease-out forwards',
        scaleUp: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'vt-fade-out': 'vtPageFadeOut 180ms cubic-bezier(0.4, 0, 1, 1) both',
        'vt-fade-in': 'vtPageFadeIn 260ms cubic-bezier(0, 0, 0.2, 1) both'
      }
    }
  },
  plugins: []
} satisfies Config
