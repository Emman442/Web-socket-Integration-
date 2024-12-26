/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      primary: "#00acb4"
    },
    fontFamily: {
      custom: ["Raleway", "sans-serif"]
    }
  },
  plugins: [
    require('tailwind-scrollbar'),
    // require('tailwind-scrollbar-hide'), // Optional for hiding scrollbars
  ],
};
