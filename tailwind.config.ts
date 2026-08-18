import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        "background-soft": "var(--background-soft)",
        foreground: "var(--foreground)",
        secondary: "var(--secondary)",
        border: "var(--border)",
        accent: {
          DEFAULT: "#D97757",
          hover: "#C45C3A",
          muted: "var(--accent-muted)",
        },
        card: {
          DEFAULT: "var(--card-bg)",
          foreground: "var(--card-fg)",
          border: "var(--card-border)",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "68ch",
            color: "var(--foreground)",
            lineHeight: "1.75",
            a: {
              color: "#D97757",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              "&:hover": {
                color: "#C45C3A",
              },
            },
            h1: {
              color: "var(--foreground)",
              fontWeight: "700",
              letterSpacing: "-0.025em",
            },
            h2: {
              color: "var(--foreground)",
              fontWeight: "600",
              letterSpacing: "-0.02em",
            },
            h3: {
              color: "var(--foreground)",
              fontWeight: "600",
            },
            code: {
              color: "var(--foreground)",
              backgroundColor: "var(--background-soft)",
              padding: "0.2em 0.4em",
              borderRadius: "0.25rem",
              fontWeight: "400",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            blockquote: {
              borderLeftColor: "#D97757",
              color: "var(--secondary)",
              fontStyle: "normal",
            },
            strong: {
              color: "var(--foreground)",
              fontWeight: "600",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
