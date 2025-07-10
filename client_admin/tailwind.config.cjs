/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This tells Tailwind to scan all your component files for classes
  ],
  theme: {
    extend: {
      // This is where your custom color palette from the styling phase should go
      colors: {
        background: "#0D1117",
        surface: "#161B22",
        primary: "#2DD4BF",
        secondary: "#67e8f9",
        "text-main": "#E5E7EB",
        "text-secondary": "#9CA3AF",
        "text-tertiary": "#4B5563",
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
  plugins: [],
};
