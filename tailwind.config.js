/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}" 
  ],
  theme: {
    extend: {
      colors:
      {
        main:'#1d4ed8',
        secondary:'#89CFF3',
        third:'#A0E9FF'
        
      }
    },
  },
  plugins: [],
}

