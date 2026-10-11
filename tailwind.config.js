/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        blush: "#FFF9FA",
        "blush-deep": "#FBEFF3",
        berry: "#B51E52",
        "berry-dark": "#81143C",
        "berry-light": "#D94B7C",
        petal: "#FFD7E4",
        "petal-soft": "#FFF0F4",
        plum: "#2A131E",
        muted: "#765F68",
        "muted-light": "#A38E96",
        outline: "#EAD7DE",
        "outline-soft": "#F3E7EB",
        success: "#16834A",
        "success-soft": "#E8F7EE",
        danger: "#B42335",
        "danger-soft": "#FFF0F1",
        gold: "#B87924",
        "gold-soft": "#FFF4DF",
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
