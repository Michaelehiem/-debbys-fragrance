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
        // Rose-gold — the signature metal. Refined, dusty, never neon.
        gold: {
          50: "#fdf6f6",
          100: "#fbe9ea",
          200: "#f6d3d6",
          300: "#eeb2b8",
          400: "#e08d97",
          500: "#cd6f7d", // Signature Rose-Gold
          600: "#b35667",
          700: "#944557",
          800: "#7a394a",
          900: "#663140",
          950: "#3a1923",
        },
        // Romantic rose — the feminine accent. Dusty, never candy.
        rose: {
          50: "#fdf7f8",
          100: "#fbeef1",
          200: "#f6dbe1",
          300: "#efbcc7",
          400: "#e393a4",
          500: "#d3708a",
          600: "#bc5876",
          700: "#9d4560",
          800: "#823a51",
          900: "#6e3346",
        },
        // Warm cream + soft plum-ink foundation
        paper: "#fdf7f4",
        "paper-deep": "#f7e8e6",
        ink: "#2e2126",
        "ink-soft": "#5c4a50",
        noir: {
          900: "#0d0b09", // Deep espresso black
          800: "#161310",
          700: "#1e1a15",
          600: "#2a2420",
          500: "#3a332c",
        },
        champagne: "#fbf1ec",
        roseGold: "#b76e79",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "var(--font-playfair)", "cursive"],
      },
      letterSpacing: {
        eyebrow: "0.32em",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #e08d97 0%, #f6d3d6 50%, #b35667 100%)",
        "rose-gradient": "linear-gradient(135deg, #e393a4 0%, #f6dbe1 50%, #bc5876 100%)",
        "rosegold-gradient": "linear-gradient(135deg, #d3708a 0%, #e08d97 55%, #b76e79 100%)",
        "brass-line": "linear-gradient(90deg, transparent, #cd6f7d, transparent)",
        "rose-line": "linear-gradient(90deg, transparent, #d3708a, transparent)",
        "dark-radial": "radial-gradient(circle at center, #1e1a15 0%, #0d0b09 100%)",
        "paper-radial": "radial-gradient(ellipse at top, #fdf7f4 0%, #fbeef1 45%, #f7e8e6 100%)",
        "blush-radial": "radial-gradient(circle at 50% 0%, #fbeef1 0%, transparent 60%)",
      },
      boxShadow: {
        editorial: "0 24px 60px -30px rgba(120,58,81,0.28)",
        "editorial-sm": "0 12px 30px -18px rgba(120,58,81,0.22)",
        soft: "0 18px 44px -26px rgba(120,58,81,0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-up": "fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        float: "float 5s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
        sway: "sway 7s ease-in-out infinite",
        bloom: "bloom 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        bloom: {
          "0%": { opacity: "0", transform: "scale(0.94)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
