/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e5f0ff',
          100: '#cce1ff',
          200: '#99c3ff',
          300: '#66a4ff',
          400: '#3386ff',
          500: '#004aad', // base color
          600: '#00429d',
          700: '#003685',
          800: '#002a6d',
          900: '#001f5e',
        },
        secondary: {
          50: '#f7fce5',
          100: '#eefaca',
          200: '#dcf596',
          300: '#caf062',
          400: '#b7eb2e',
          500: '#cef141', // base color
          600: '#a9c739',
          700: '#839e2c',
          800: '#5d751f',
          900: '#485b19',
        },
      },
    },
  },
  plugins: [],
}

