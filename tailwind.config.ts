import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Archivo Black'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        orange: { 400: "#fb923c", 500: "#f97316", 600: "#ea6308", 700: "#c2410c" },
      },
    },
  },
  plugins: [],
};
export default config;
