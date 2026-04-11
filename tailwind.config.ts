import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ---- とこぷりブック カラーパレット (CMYK) ----
        tokopuri: {
          yellow:  '#F5C842', // Y: プリンのからだ
          magenta: '#E8457A', // M: 靴下
          cyan:    '#4BBFCD', // C: 靴下
          black:   '#333333', // K: ひとみ
          cream:   '#FFFDF0', // 背景
        },
        // ---- 後方互換（BookDetail / Analysis 用）----
        gold: {
          50:  '#fbf9f2',
          100: '#f5efdf',
          200: '#eadabf',
          300: '#d9bf94',
          400: '#c59f6d',
          500: '#c9a84c',
          600: '#a6853a',
          700: '#8c6e31',
          800: '#735b2a',
          900: '#5e4a25',
          950: '#352914',
        },
        navy: {
          50:  '#f1f4f9',
          100: '#e1e8f2',
          200: '#c2d1e5',
          300: '#94afd2',
          400: '#5f87b9',
          500: '#3e669d',
          600: '#2f4f81',
          700: '#264069',
          800: '#1b2d4b',
          900: '#0f172a',
          950: '#0a0f1d',
        },
      },
      fontFamily: {
        rounded: ['var(--font-mplus-rounded)', 'sans-serif'],
        serif:   ['var(--font-noto-serif-jp)', 'serif'],
        sans:    ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
};
export default config;
