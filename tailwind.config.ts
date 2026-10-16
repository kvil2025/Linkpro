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
        background: "var(--background)",
        foreground: "var(--foreground)",
        neon: {
          purple: "#A855F7",
          cyan: "#06B6D4",
          pink: "#F43F5E",
          emerald: "#10B981",
          amber: "#F59E0B",
        },
      },
    },
  },
  plugins: [],
};
export default config;
