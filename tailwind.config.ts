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
        primary: "#359EFF",
        secondary: "#50E3C2",
        accent: "#FFC107",
        success: "#10b981",
        "text-light": "#4A4A4A",
        "text-dark": "#E0E0E0",
        "subtext-light": "#9B9B9B",
        "subtext-dark": "#A0A0A0",
        "background-light": "#f5f7f8",
        "background-dark": "#0f1923",
        "card-light": "#FFFFFF",
        "card-dark": "#1A242E",
        "border-light": "#EAECEF",
        "border-dark": "#333A42",
        "key-light": "#e7edf3",
        "key-dark": "#2d3748",
        "key-text-light": "#0d141b",
        "key-text-dark": "#f7fafc",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-noto-sans-kr)", "sans-serif"],
        display: ["var(--font-inter)", "var(--font-noto-sans-kr)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
