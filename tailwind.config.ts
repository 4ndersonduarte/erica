import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0f0f0f',
          light: '#1a1a1a',
          muted: '#525252',
          subtle: '#737373',
        },
        cream: {
          DEFAULT: '#fafaf9',
          dark: '#f5f5f4',
          border: '#e7e5e4',
        },
        accent: {
          DEFAULT: '#0d5c4a',
          hover: '#0a4a3b',
          light: '#e8f2f0',
          muted: '#134e3e',
        },
        gold: {
          DEFAULT: '#b45309',
          light: '#fef3c7',
        },
        /* Admin / compat */
        primary: {
          100: '#e8f2f0',
          500: '#0d5c4a',
          600: '#0a4a3b',
          700: '#0a4a3b',
          800: '#0d5c4a',
          900: '#0a4a3b',
        },
        dark: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#a8a29e',
          400: '#78716c',
          500: '#57534e',
          600: '#57534e',
          700: '#44403c',
          950: '#0f0f0f',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 10px 40px -15px rgb(0 0 0 / 0.12), 0 4px 12px -4px rgb(0 0 0 / 0.06)',
        'elevated': '0 25px 50px -12px rgb(0 0 0 / 0.12)',
        'inner-soft': 'inset 0 1px 2px 0 rgb(0 0 0 / 0.03)',
      },
      letterSpacing: {
        'tight': '-0.02em',
        'wide': '0.08em',
      },
    },
  },
  plugins: [],
};

export default config;
