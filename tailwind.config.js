/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      keyframes: {
        'bus-left': {
          '0%': { left: '-250px' },
          '100%': { left: '25%' }
        },
        'bus-right': {
          '0%': { right: '-250px' },
          '100%': { right: '25%' }
        },
      },
      animation: {
        'bus-left': 'bus-left 2.5s ease-out forwards',
        'bus-right': 'bus-right 2.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
