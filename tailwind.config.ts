import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // IngatWaktu palette — bone white + deep blue
        bg: {
          deep: "hsl(var(--bg-deep))",
          elevated: "hsl(var(--bg-elevated))",
          hover: "hsl(var(--bg-hover))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          light: "hsl(var(--primary-light))",
          dark: "hsl(var(--primary-dark))",
          foreground: "hsl(var(--primary-foreground))",
        },
        bone: {
          DEFAULT: "hsl(var(--bone))",
          muted: "hsl(var(--bone-muted))",
          subtle: "hsl(var(--bone-subtle))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--border))",
        ring: "hsl(var(--primary))",
        accent: {
          gold: "hsl(var(--accent-gold))",
          DEFAULT: "hsl(var(--accent-gold))",
          foreground: "hsl(var(--bg-deep))",
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--bone))",
        },
        muted: {
          DEFAULT: "hsl(var(--bg-hover))",
          foreground: "hsl(var(--bone-muted))",
        },
        popover: {
          DEFAULT: "hsl(var(--bg-elevated))",
          foreground: "hsl(var(--bone))",
        },
        card: {
          DEFAULT: "hsl(var(--bg-elevated))",
          foreground: "hsl(var(--bone))",
        },
        foreground: "hsl(var(--bone))",
        secondary: {
          DEFAULT: "hsl(var(--bg-hover))",
          foreground: "hsl(var(--bone))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(212 85% 55% / 0.4)" },
          "50%": { boxShadow: "0 0 0 12px hsl(212 85% 55% / 0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "shimmer": "shimmer 3s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(ellipse at center, var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "shimmer-gradient": "linear-gradient(90deg, transparent, hsl(212 85% 55% / 0.2), transparent)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
