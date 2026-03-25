import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fbf9f2',
          100: '#f5efdf',
          200: '#eadabf',
          300: '#d9bf94',
          400: '#c59f6d',
          500: '#c9a84c', // Main Gold
          600: '#a6853a',
          700: '#8c6e31',
          800: '#735b2a',
          900: '#5e4a25',
          950: '#352914',
        },
        navy: {
          50: '#f1f4f9',
          100: '#e1e8f2',
          200: '#c2d1e5',
          300: '#94afd2',
          400: '#5f87b9',
          500: '#3e669d',
          600: '#2f4f81',
          700: '#264069',
          800: '#1b2d4b',
          900: '#0f172a', // Deep Navy
          950: '#0a0f1d',
        },
      },
      fontFamily: {
        serif: ['var(--font-noto-serif-jp)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
