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
        // Antique brass — the signature metal. Muted and refined, never neon.
        gold: {
          50: "#fbf8f1",
          100: "#f5eddd",
          200: "#ead9ba",
          300: "#dcc08c",
          400: "#cba765",
          500: "#b28a49", // Signature Brass
          600: "#96703a",
          700: "#7a5830",
          800: "#65482b",
          900: "#543c26",
          950: "#2f2013",
        },
        // Warm paper + ink foundation
        paper: "#f6f1e8",
        "paper-deep": "#ede5d8",
        ink: "#1b1712",
        "ink-soft": "#4a443b",
        noir: {
          900: "#0d0b09", // Deep espresso black
          800: "#161310",
          700: "#1e1a15",
          600: "#2a2420",
          500: "#3a332c",
        },
        champagne: "#f7f3e9",
        roseGold: "#b76e79",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        eyebrow: "0.32em",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #cba765 0%, #ead9ba 50%, #96703a 100%)",
        "brass-line": "linear-gradient(90deg, transparent, #b28a49, transparent)",
        "dark-radial": "radial-gradient(circle at center, #1e1a15 0%, #0d0b09 100%)",
        "paper-radial": "radial-gradient(ellipse at top, #fbf8f1 0%, #f6f1e8 55%, #ede5d8 100%)",
      },
      boxShadow: {
        editorial: "0 24px 60px -30px rgba(27,23,18,0.35)",
        "editorial-sm": "0 12px 30px -18px rgba(27,23,18,0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-up": "fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        float: "float 5s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
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
      },
    },
  },
  plugins: [],
};
export default config;
