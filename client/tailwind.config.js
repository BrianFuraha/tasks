/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements-react/dist/js/**/*.js",
  ],
  theme: {
    extend: {
      screens: {
        "md-max": { max: "768px" },
      },
      gridTemplateColumns: {
        "chat-lg": "22% auto",
        "chat-md": "16% auto",
      },
      spacing: {
        "1rem": "1rem",
        "10px": "10px",
      },
      colors: {
        yellow: "#f5c32c",
        orange: "#fca61f",
        black: "#242d49",
        profileShadow: "rgba(0, 0, 0, 0.25)",
        hrColor: "#cfcdcd",
        cardColor: "rgba(255, 255, 255, 0.64)",
        buttonBg: {
          DEFAULT: "linear-gradient(98.63deg, #f9a225 0%, #f95f35 100%)",
        },
        inputColor: "rgba(40, 52, 62, 0.07)",
        photo: "#4CB256",
        video: "#4A4EB7",
        location: "#EF5757",
        schedule: "#E1AE4A",
      },
      boxShadow: {
        profile: "0px 4px 17px 2px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms", "tw-elements-react/dist/plugin.cjs"),
    function ({ addUtilities }) {
      const newUtilities = {
        ".hide-scrollbar": {
          /* Firefox */
          "scrollbar-width": "none",
          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        ".hide-name": {
          display: "none",
        },
      };
      addUtilities(newUtilities, ["responsive"]);
    },
  ],
});
