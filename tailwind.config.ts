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
          DEFAULT: '#1f2921',
          light: '#314235',
          muted: '#536257',
          subtle: '#718076',
        },
        cream: {
          DEFAULT: '#f7f5ed',
          dark: '#ece8dc',
          border: '#ddd8c9',
        },
        accent: {
          DEFAULT: '#2f7d42',
          hover: '#245f33',
          light: '#e7f2e8',
          muted: '#4f6f54',
        },
        gold: {
          DEFAULT: '#fe6212',
          light: '#fff0e8',
        },
        /* Admin / compat */
        primary: {
          100: '#fff0e8',
          500: '#fe6212',
          600: '#e5560f',
          700: '#c94e0e',
          800: '#0a2653',
          900: '#0a2653',
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
        'card': '0 1px 2px 0 rgb(17 24 39 / 0.04), 0 12px 30px -24px rgb(17 24 39 / 0.18)',
        'card-hover': '0 24px 50px -30px rgb(17 24 39 / 0.28), 0 10px 24px -18px rgb(17 24 39 / 0.18)',
        'elevated': '0 28px 70px -36px rgb(17 24 39 / 0.36)',
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
