/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        bounce200: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1)' },
        },
        bounce400: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '60%': { transform: 'scale(1)' },
        },
        'pulse-gradient': {
          '0%, 100%': { opacity: '0.7', transform: 'scale(1)' },
          '33%': { opacity: '0.7', transform: 'scale(1.025)' },
          '66%': { opacity: '0.75', transform: 'scale(1.03)' },
        },
      },
      animation: {
        bounce200: 'bounce200 1.4s infinite ease-in-out both',
        bounce400: 'bounce400 1.4s infinite ease-in-out both',
        'pulse-gradient': 'pulse-gradient 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

