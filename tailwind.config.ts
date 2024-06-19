import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.2s ease-in forwards",
        fadeOut: "fadeOut 0.2s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: "0"
          },
          "100%": {
            opacity: "1"
          },
        },
        fadeOut: {
          "0%": {
            opacity: "1"
          },
          "100%": {
            opacity: "0"
          },
        },
      },
    }
  },
  plugins: [],
} as Config;
