import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1200px",
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        // Deep trustworthy navy — primary brand color
        brand: {
          50: "#eef4fb",
          100: "#d9e6f6",
          200: "#b6cdec",
          300: "#86abdd",
          400: "#5283c9",
          500: "#3163b0",
          600: "#264e94",
          700: "#1f3f78",
          800: "#1b3460",
          900: "#0f2444",
          950: "#0a1830",
        },
        // Warm amber/gold — accent for CTAs and highlights
        accent: {
          50: "#fff8eb",
          100: "#ffedc6",
          200: "#ffd888",
          300: "#ffbf4a",
          400: "#ffa61f",
          500: "#f98307",
          600: "#dd5f02",
          700: "#b74106",
          800: "#94320c",
          900: "#7a2a0e",
          950: "#461302",
        },
        // Calm supporting teal/green for trust & "inspection passed" cues
        sage: {
          50: "#f0fdf6",
          100: "#dcfce9",
          200: "#bbf7d4",
          300: "#86efb5",
          400: "#4ade8d",
          500: "#22c56b",
          600: "#16a354",
          700: "#158045",
          800: "#16653a",
          900: "#145332",
          950: "#052e18",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(15, 36, 68, 0.08), 0 8px 24px -8px rgba(15, 36, 68, 0.12)",
        card: "0 1px 3px rgba(15, 36, 68, 0.06), 0 12px 32px -12px rgba(15, 36, 68, 0.18)",
        glow: "0 10px 40px -10px rgba(249, 131, 7, 0.45)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.8s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
