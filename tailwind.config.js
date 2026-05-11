/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        fontFamily: {
            anta: ['Anta', 'sans-serif'],
            blinker: ['Blinker', 'sans-serif'],
            bruno: ['"Bruno Ace SC"', 'sans-serif'],
            jura: ['Jura', 'sans-serif'],
            michroma: ['Michroma', 'sans-serif'],
            zendots: ['ZenDots', 'sans-serif'],
            fredoka: ['Fredoka', 'sans-serif'],
        },
    },
  },
  plugins: [],
}

