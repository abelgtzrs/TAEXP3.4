/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          '"Courier New"',
          "Courier",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      colors: {
        // For the CRT/retro terminal look
        "crt-black": "#0A0A0A",
        "crt-green": "#34D399",
        "crt-lightgreen": "#6EE7B7",
        "crt-amber": "#FACC15",
        "crt-gray": "#9CA3AF",
        "crt-darkgray": "#374151",
        "crt-blue": "#3B82F6",
        "crt-white": "#E5E7EB",
        // Standard Tailwind colors for page elements outside terminal
        "gray-900": "#111827",
        "teal-400": "#2DD4BF",
        "blue-400": "#60A5FA",
      },
    },
  },
  plugins: [],
};
