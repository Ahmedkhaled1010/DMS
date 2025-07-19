/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}" 
  ],
  theme: {
    extend: {
      colors:
      {
        main:'#00A9FF',
        secondary:'89CFF3',
        third:'A0E9FF'
      }
    },
  },
  plugins: [],
}

