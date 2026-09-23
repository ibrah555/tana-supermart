import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./context/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F97316",
          dark: "#EA580C",
          light: "#FFF3E8",
        },
        sale: {
          DEFAULT: "#F5333F",
          dark: "#D91F2B",
        },
        promo: {
          from: "#FF7A00",
          to: "#FF4D4F",
        },
        accent: {
          yellow: "#FFD100",
        },
        surface: "#FFFFFF",
        background: "#F5F5F5",
        foreground: "#333333",
        muted: "#757575",
        border: "#E8E8E8",
      },
      fontFamily: {
        sans: ["var(--font-open-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0, 0, 0, 0.06)",
        pop: "0 4px 12px rgba(0, 0, 0, 0.12)",
      },
      backgroundImage: {
        "promo-gradient": "linear-gradient(90deg, #FF7A00 0%, #FF4D4F 100%)",
        "sale-gradient": "linear-gradient(90deg, #F97316 0%, #F5333F 100%)",
        "tile-texture":
          "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.14) 0, transparent 45%)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
