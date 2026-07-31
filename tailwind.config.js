/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F5F0E8",
        parchment: "#EDE5D4",
        latte: "#C9A96E",
        espresso: "#2A1F14",
        dark: "#1A1208",
        mid: "#6B5744",
        "light-mid": "#9C826A",
        white: "#FDFAF5",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-jost)", "Jost", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 10px 40px rgba(26, 18, 8, 0.08)",
        "luxury-lg": "0 20px 60px rgba(26, 18, 8, 0.15)",
        gold: "0 4px 20px rgba(201, 169, 110, 0.25)",
      },
    },
  },
  plugins: [],
};
