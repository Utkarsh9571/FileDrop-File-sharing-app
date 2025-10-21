/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 2px 8px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};
