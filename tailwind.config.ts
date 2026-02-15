import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        background: {
          main: "var(--background-main)",
          card: "var(--background-card)",
          sidebar: "var(--background-sidebar)",
          elevated: "var(--background-elevated)",
        },
        // Borders
        border: {
          DEFAULT: "var(--border-default)",
          interactive: "var(--border-interactive)",
          subtle: "var(--border-subtle)",
        },
        // Text
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          disabled: "var(--text-disabled)",
        },
        // Accents
        accent: {
          green: "var(--accent-green)",
          red: "var(--accent-red)",
          cyan: "var(--accent-cyan)",
          amber: "var(--accent-amber)",
        },
        // Semantic
        success: "var(--success)",
        error: "var(--error)",
        warning: "var(--warning)",
        info: "var(--info)",
        // Graph
        graph: {
          positive: "var(--graph-positive)",
          negative: "var(--graph-negative)",
          neutral: "var(--graph-neutral)",
          grid: "var(--graph-grid)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
};

export default config;
