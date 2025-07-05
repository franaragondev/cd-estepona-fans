/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      screens: {
        md: "1080px",
        lg: "1120px,",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
        bebas: ["var(--font-bebas)", "sans-serif"],
      },
    },
  },
};
