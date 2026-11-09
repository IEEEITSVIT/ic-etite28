import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme colours editable in admin → Site content → Appearance (CSS variables set in app/layout.tsx).
        brand: {
          primary: "rgb(var(--c-primary) / <alpha-value>)",
          "primary-dark": "rgb(var(--c-primary-dark) / <alpha-value>)",
          "primary-hover": "rgb(var(--c-primary-hover) / <alpha-value>)",
          secondary: "rgb(var(--c-secondary) / <alpha-value>)",
          accent: "rgb(var(--c-accent) / <alpha-value>)",
          "accent-dark": "rgb(var(--c-accent-dark) / <alpha-value>)",
          text: "rgb(var(--c-text) / <alpha-value>)",
          muted: "rgb(var(--c-muted) / <alpha-value>)",
          surface: "rgb(var(--c-surface) / <alpha-value>)",
          border: "rgb(var(--c-border) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--c-text) / <alpha-value>)",
          soft: "rgb(var(--c-muted) / <alpha-value>)",
          muted: "rgb(var(--c-muted) / <alpha-value>)",
          faint: "#718096",
          inverse: "#ffffff",
        },
        inksoft: "#4A5568",
        accent: {
          DEFAULT: "#0B6B4A",
          emerald: "#0B6B4A",
          dark: "#085037",
          light: "#EAF5F0",
          terra: "#c4622d",
          orange: "#DE6D1B",
        },
        accent2: {
          DEFAULT: "#1D5C82",
          blue: "#1D5C82",
          dark: "#144360",
          light: "#EBF3F8",
        },
        line: {
          DEFAULT: "#E4E7EC",
          subtle: "#F0F2F5",
        },
        paper: {
          DEFAULT: "#F7F8FA",
          subtle: "#FAFBFD",
        },
        canvas: {
          DEFAULT: "#ffffff",
          subtle: "#F7F8FA",
        },
        surface: {
          DEFAULT: "#ffffff",
          alt: "#F7F8FA",
          border: "#E4E7EC",
        },
        navy: {
          DEFAULT: "#101B2E",
          dark: "#0B1220",
          deep: "#101B2E",
          light: "#1D5C82",
        },
        ieee: {
          blue: "rgb(var(--c-secondary) / <alpha-value>)",
          dark: "#101B2E",
          light: "#EBF3F8",
        },
        vit: {
          DEFAULT: "rgb(var(--c-primary) / <alpha-value>)",
          navy: "rgb(var(--c-primary) / <alpha-value>)",
          navyDark: "rgb(var(--c-primary-dark) / <alpha-value>)",
          blue: "rgb(var(--c-primary-hover) / <alpha-value>)",
          royal: "#0D2E5C",
          gold: "rgb(var(--c-accent-dark) / <alpha-value>)",
          goldDark: "#D98200",
          goldLight: "#FFF4DB",
          red: "#FF0050",
          light: "#F4F7FB",
          dark: "#00152E",
        },
        acm: {
          blue: "#0075A2",
          light: "#EBF3F8",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-body)",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        serif: [
          "var(--font-heading)",
          '"Plus Jakarta Sans"',
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        display: [
          "var(--font-heading)",
          '"Plus Jakarta Sans"',
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "'SF Mono'",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        academic: "0 1px 3px 0 rgba(16, 27, 46, 0.05), 0 1px 2px -1px rgba(16, 27, 46, 0.03)",
        subtle: "0 4px 6px -1px rgba(16, 27, 46, 0.05), 0 2px 4px -2px rgba(16, 27, 46, 0.03)",
        card: "0 10px 15px -3px rgba(16, 27, 46, 0.04), 0 4px 6px -4px rgba(16, 27, 46, 0.02)",
        hover: "0 14px 28px -4px rgba(16, 27, 46, 0.09)",
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 60s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
