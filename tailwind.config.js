/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        fallingSphere: {
          '0%': { 
            transform: 'translateY(-100%) translateX(0)',
            opacity: 0 
          },
          '10%': { 
            opacity: 1 
          },
          '100%': { 
            transform: 'translateY(1000%) translateX(var(--tx))',
            opacity: 0
          }
        },
        spinSlow: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' }
        },
        diagonalMove: {
          '0%': { 
            transform: 'translate(0%, 0%) rotate(-45deg)'
          },
          '100%': { 
            transform: 'translate(-100%, 100%) rotate(-45deg)'
          }
        }
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        fallingSphere: 'fallingSphere var(--duration) ease-in-out infinite',
        spinSlow: 'spinSlow 20s linear infinite',
        diagonalMove: 'diagonalMove var(--duration) linear infinite'
      }
    },
  },
  plugins: [],
}


