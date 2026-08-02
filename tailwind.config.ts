import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#fffdf0",
          100: "#fffbcf",
          200: "#fff599",
          300: "#ffeb57",
          400: "#ffd821",
          500: "#d4af37", // Signature Gold
          600: "#b58e24",
          700: "#8f6a1c",
          800: "#75541c",
          900: "#63451c",
          950: "#3a250c",
        },
        noir: {
          900: "#09090b", // Rich Onyx Black
          800: "#121215",
          700: "#1a1a1e",
          600: "#27272a",
          500: "#3f3f46",
        },
        champagne: "#f7f3e9",
        roseGold: "#b76e79",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #d4af37 0%, #f3e5ab 50%, #aa7c11 100%)",
        "dark-radial": "radial-gradient(circle at center, #1a1a1e 0%, #09090b 100%)",
        "light-radial": "radial-gradient(circle at center, #fafafa 0%, #ffffff 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "float": "float 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
