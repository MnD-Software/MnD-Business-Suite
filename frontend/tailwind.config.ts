import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        "primary-strong": "hsl(var(--primary-strong))",
        bg: "hsl(var(--bg))",
        surface: "hsl(var(--surface))",
        "surface-2": "hsl(var(--surface-2))",
        "surface-3": "hsl(var(--surface-3))",
        fg: "hsl(var(--text))",
        "fg-muted": "hsl(var(--muted))",
        "fg-subtle": "hsl(var(--subtle))",
        border: "hsl(var(--border))",
        success: "hsl(var(--success))",
        error: "hsl(var(--danger))",
        danger: "hsl(var(--danger))"
      },
      borderRadius: {
        "2xl": "var(--radius-lg)"
      },
      boxShadow: {
        glass: "var(--shadow-1)",
        elevate: "var(--shadow-2)",
        pop: "var(--shadow-pop)"
      },
      transitionTimingFunction: {
        "ease-out": "var(--ease-out)",
        "ease-in-out": "var(--ease-in-out)"
      }
    }
  },
  plugins: []
} satisfies Config;
