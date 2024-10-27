/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "meta",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'custom400': '400px',
      },
    },
  },
  plugins: [],
}