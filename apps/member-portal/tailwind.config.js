/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2196F3',
          dark: '#1976D2',
          light: '#64B5F6',
        },
        secondary: {
          DEFAULT: '#03DAC6',
          dark: '#018786',
          light: '#66FFF9',
        },
        background: {
          DEFAULT: '#0F0F23',
          light: '#1A1A2E',
          card: '#16213E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}