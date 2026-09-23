/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./context/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1C2530",
        muted: "#6B7684",
        line: "#E2E5EA",
        surface: "#FFFFFF",
        canvas: "#F7F8FA",
        accent: {
          DEFAULT: "#2F6FED",
          dark: "#1F53C4",
          light: "#EAF0FE",
        },
        danger: {
          DEFAULT: "#D64545",
          light: "#FBEAEA",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
