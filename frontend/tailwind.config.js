// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ed',
          100: '#fdecd4',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        axum: {
          green: '#15803d',
          gold: '#f59e0b',
          stone: '#57534e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}