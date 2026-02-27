/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#e8f0f7',
          100: '#c5d9eb',
          200: '#9fbfdd',
          300: '#79a5cf',
          400: '#5c91c4',
          500: '#3f7db9',
          600: '#336a9e',
          700: '#275480',
          800: '#1B4F72',
          900: '#0f3451',
        },
        teal: {
          50: '#e6f7f9',
          100: '#c1ecf1',
          200: '#98dfe8',
          300: '#6fd2df',
          400: '#50c8d8',
          500: '#17A2B8',
          600: '#148fa3',
          700: '#107785',
          800: '#0c5f6a',
          900: '#084750',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(23,162,184,0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(23,162,184,0.4)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
