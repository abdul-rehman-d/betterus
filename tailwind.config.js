/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        blush: "#FFF8F8",
        berry: "#B91F54",
        "berry-dark": "#8F1642",
        petal: "#FFDCE7",
        "petal-soft": "#FFF0F4",
        plum: "#2B141F",
        muted: "#765A65",
        outline: "#E8D5DB",
        success: "#188A42",
        danger: "#BA1A1A",
      },
      fontFamily: {
        heading: ["Epilogue_700Bold"],
        "heading-semibold": ["Epilogue_600SemiBold"],
        body: ["PlusJakartaSans_400Regular"],
        "body-semibold": ["PlusJakartaSans_600SemiBold"],
        "body-bold": ["PlusJakartaSans_700Bold"],
      },
      borderRadius: {
        card: "28px",
      },
    },
  },
  plugins: [],
};
