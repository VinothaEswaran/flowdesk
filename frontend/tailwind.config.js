/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        dm: ["DM Sans", "sans-serif"],
      },
      colors: {
        fd: {
          bg: "#0a0a0f",
          surface: "#13131a",
          card: "#1a1a24",
          border: "#2a2a38",
          accent: "#6c63ff",
          accent2: "#00d4aa",
          accent3: "#ff6b6b",
          text: "#f0f0f8",
          muted: "#7b7b99",
          dim: "#3a3a50",
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};