import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Background: warm near-black, no blue tint
        bg: {
          DEFAULT: "#0d0d0e",
          900: "#0d0d0e",
          800: "#141416",
          700: "#1a1a1d",
          600: "#222226",
          500: "#2c2c30",
        },
        surface: {
          DEFAULT: "#161618",
          elevated: "#1d1d20",
          glass: "rgba(28, 28, 32, 0.55)",
        },
        // Reserved data-viz / score accent (kept neon — used sparingly)
        cyan: {
          DEFAULT: "#00e5ff",
          500: "#00e5ff",
          400: "#33ebff",
          600: "#00b8cc",
        },
        // Warm cream — used for brand mark, hero accent
        cream: {
          DEFAULT: "#d8c4a3",
          500: "#d8c4a3",
          400: "#e6d3b2",
          600: "#b8a282",
        },
        // Verdict colors (slightly desaturated — feel less neon)
        amber: {
          DEFAULT: "#e0a050",
          500: "#e0a050",
          400: "#eab37a",
          600: "#b8853f",
        },
        emerald: {
          DEFAULT: "#7eb27e",
          500: "#7eb27e",
          400: "#9ac79a",
          600: "#5a8e5a",
        },
        rose: {
          DEFAULT: "#d9695a",
          500: "#d9695a",
          400: "#e58779",
          600: "#a84d3f",
        },
        violet: {
          500: "#9b85c4",
        },
        ink: {
          DEFAULT: "#e8e6e0",
          muted: "#9c998f",
          dim: "#6c6862",
          faint: "#46443f",
        },
        line: {
          DEFAULT: "rgba(255, 255, 255, 0.06)",
          strong: "rgba(255, 255, 255, 0.12)",
        },
      },
      fontFamily: {
        display: ["Sora", "Outfit", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["DM Sans", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(0,229,255,0.18), 0 0 24px rgba(0,229,255,0.18)",
        "glow-strong":
          "0 0 0 1px rgba(0,229,255,0.4), 0 0 36px rgba(0,229,255,0.30)",
        "glow-amber":
          "0 0 0 1px rgba(224,160,80,0.30), 0 0 22px rgba(224,160,80,0.20)",
        "glow-rose":
          "0 0 0 1px rgba(217,105,90,0.35), 0 0 26px rgba(217,105,90,0.22)",
        "glow-emerald":
          "0 0 0 1px rgba(126,178,126,0.30), 0 0 22px rgba(126,178,126,0.18)",
        card: "0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 30px -16px rgba(0,0,0,0.7)",
      },
      keyframes: {
        "grid-pan": {
          "0%": { backgroundPosition: "0 0, 0 0" },
          "100%": { backgroundPosition: "60px 60px, 60px 60px" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(217,105,90,0.45)" },
          "70%": { boxShadow: "0 0 0 14px rgba(217,105,90,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(217,105,90,0)" },
        },
        "pulse-ring-cyan": {
          "0%": { boxShadow: "0 0 0 0 rgba(0,229,255,0.40)" },
          "70%": { boxShadow: "0 0 0 12px rgba(0,229,255,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(0,229,255,0)" },
        },
        "dash-flow": { to: { strokeDashoffset: "-24" } },
        blink: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "grid-pan": "grid-pan 30s linear infinite",
        "pulse-ring": "pulse-ring 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-ring-cyan":
          "pulse-ring-cyan 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "dash-flow": "dash-flow 1.2s linear infinite",
        blink: "blink 1.1s steps(1) infinite",
        "fade-up": "fade-up 0.5s ease-out both",
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [animate],
};
