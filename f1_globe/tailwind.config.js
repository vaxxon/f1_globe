// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./f1_globe/**/*.{js,ts,jsx,tsx}", // Add this line if components live there
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-public-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};