/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Make sure this matches your file extensions
  ],
  theme: {
    extend: {
      // We'll add your custom HUD/Persona themes here later
      colors: {
        // Initial placeholder for Abel Persona theming
        "theme-primary": "var(--theme-primary, #14B8A6)", // Teal as a fallback
        "theme-secondary": "var(--theme-secondary, #0D9488)",
        "theme-accent": "var(--theme-accent, #2DD4BF)",
        "theme-background": "var(--theme-background, #111827)", // Dark gray as fallback
        "theme-text": "var(--theme-text, #E5E7EB)",
        // ... other themeable colors
      },
    },
  },
  plugins: [],
};
