import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./mdx-components.tsx",
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        paper: "#eef0ea",
        ink: "#1f1d1a",
        accent: "#e24b3b",
        mute: "#5c5852",
        chalk: "#161513",
        chalkink: "#e8e4d9",
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "ui-sans-serif", "system-ui", "sans-serif"],
        hand: ["var(--font-caveat)", "ui-sans-serif", "cursive"],
        mono: ["var(--font-ibm)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
