import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bebas Neue'", "cursive"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        pitch: {
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          900: "#14532d",
          950: "#052e16",
        },
        gold: {
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
        },
      },
      backgroundImage: {
        "pitch-texture": "radial-gradient(ellipse at 50% 0%, #15803d22 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};
export default config;
