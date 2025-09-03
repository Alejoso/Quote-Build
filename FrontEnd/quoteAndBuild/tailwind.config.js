/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}", // busca clases en estos archivos
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        naranja: '#F59723',
        naranjaHover: '#DB8621', 
        negroClaro: '#1C1B1B',
        verde: '#14ae5c'
      }
    },
  },
  plugins: [],
}