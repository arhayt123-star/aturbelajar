import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#183153",
        forest: "#245B45",
        fresh: "#4C956C",
        cream: "#F5F3EB",
        gold: "#F2C14E",
        ink: "#263238",
      },
      borderRadius: { card: "1.25rem" },
      boxShadow: { soft: "0 8px 24px -12px rgba(24,49,83,0.25)" },
    },
  },
  plugins: [],
};
export default config;
