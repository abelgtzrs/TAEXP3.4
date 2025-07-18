// This file should use module.exports because of the .cjs extension
module.exports = {
  // This 'content' array is crucial. It tells Tailwind to look for class names
  // in all of your .html and .jsx files inside the src directory.
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        tertiary: "var(--color-tertiary)",
        background: "var(--color-bg)",
        surface: "var(--color-surface)",
        "text-main": "var(--color-text-main)",
        "text-secondary": "var(--color-text-secondary)",
        "text-tertiary": "var(--color-text-tertiary)",
        "status-success": "#22c55e",
        "status-warning": "#facc15",
        "status-danger": "#ef4444",
        "status-info": "#38bdf8",
      },
      fontFamily: {
        sans: "var(--font-main)",
        mono: "var(--font-main)", // You can have a separate mono font if you prefer
      },
      boxShadow: {
        "glow-primary": "0 0 12px 0 var(--color-primary)",
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      addBase({
        ":root": {
          "--color-primary": theme("colors.primary"),
          "--color-secondary": theme("colors.secondary"),
          "--color-text-secondary": theme("colors.text-secondary"),
          "--color-background": theme("colors.background"),
          "--color-surface": theme("colors.surface"),
        },
      });
    },
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",
          /* Firefox */
          "scrollbar-width": "none",
          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    },
  ],
};
