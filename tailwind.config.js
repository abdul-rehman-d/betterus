/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        blush: "var(--app-background)",
        "blush-deep": "var(--app-background-deep)",
        berry: "var(--app-berry)",
        "berry-dark": "var(--app-berry-dark)",
        "berry-light": "var(--app-berry-light)",
        petal: "var(--app-petal)",
        "petal-soft": "var(--app-petal-soft)",
        plum: "var(--app-plum)",
        muted: "var(--app-muted)",
        "muted-light": "var(--app-muted-light)",
        outline: "var(--app-outline)",
        "outline-soft": "var(--app-outline-soft)",
        success: "var(--app-success)",
        "success-soft": "var(--app-success-soft)",
        danger: "var(--app-danger)",
        "danger-soft": "var(--app-danger-soft)",
        gold: "var(--app-gold)",
        "gold-soft": "var(--app-gold-soft)",
        surface: "var(--app-surface)",
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
