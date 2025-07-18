// This file should use module.exports because of the .cjs extension
module.exports = {
  // This 'content' array is crucial. It tells Tailwind to look for class names
  // in all of your .html and .jsx files inside the src directory.
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#131139ff",
        surface: "#0c1d34ff",
        primary: "#426280ff",
        secondary: "#144573ff",
        tertiary: "#73aee6ff",
        "text-main": "#ffffff",
        "text-secondary": "#9CA3AF",
        "text-tertiary": "#1f4365ff",
        "status-success": "#22c55e",
        "status-warning": "#facc15",
        "status-danger": "#ef4444",
        "status-info": "#38bdf8",
      },
      boxShadow: {
        "glow-primary": "0 0 12px 0 rgba(45, 212, 191, 0.5)",
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
