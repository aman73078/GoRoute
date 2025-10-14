/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
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
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'bus-left': 'bus-left 2.5s ease-out forwards',
        'bus-right': 'bus-right 2.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
