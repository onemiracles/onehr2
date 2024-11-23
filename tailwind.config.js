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
        warning: {
          50: '#fff7e5',
          100: '#ffedcc',
          200: '#ffdb99',
          300: '#ffc966',
          400: '#ffb733',
          500: '#ff9500', // base color
          600: '#e68500',
          700: '#b36600',
          800: '#804800',
          900: '#663900',
        },
        danger: {
          50: '#ffe5e5',
          100: '#ffcccc',
          200: '#ff9999',
          300: '#ff6666',
          400: '#ff3333',
          500: '#ff0000', // base color
          600: '#e60000',
          700: '#b30000',
          800: '#800000',
          900: '#660000',
        },
      },      
    },
  },
  plugins: [],
}

