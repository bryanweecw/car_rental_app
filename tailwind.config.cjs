/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      screens: {
        custxs: { max: "575px" }, // Mobile (iPhone 3 - iPhone XS Max).
        custsm: { min: "576px", max: "897px" }, // Mobile (matches max: iPhone 11 Pro Max landscape @ 896px).
        custmd: { min: "898px", max: "1199px" }, // Tablet (matches max: iPad Pro @ 1112px).
        custlg: { min: "1200px" }, // Desktop smallest.
        custxl: { min: "1159px" }, // Desktop wide.
        cust2xl: { min: "1359px" }, // Desktop widescreen.
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

module.exports = config;
