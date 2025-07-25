import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export const useTheme = () => {
  const { user } = useAuth();
  // The activePersona object is now fully populated with theme data.
  const activePersona = user?.activeAbelPersona;

  useEffect(() => {
    const root = window.document.documentElement;

    const defaultTheme = {
      colors: {
        bg: "#0D1117",
        surface: "#161B22",
        primary: "#1a6359ff",
        secondary: "#0099c399",
        tertiary: "#A5F3FC",
      },
      text: {
        main: "#E5E7EB",
        secondary: "#9CA3AF",
        tertiary: "#4B5563",
      },
      font: "Inter, sans-serif",
    };

    // Use the active persona's theme, or fall back to the default.
    // The persona object from the database has colors and text as direct properties
    const theme = activePersona
      ? {
          colors: activePersona.colors,
          text: activePersona.text,
          font: activePersona.font,
        }
      : defaultTheme;

    if (theme.colors) {
      root.style.setProperty("--color-bg", theme.colors.bg);
      root.style.setProperty("--color-surface", theme.colors.surface);
      root.style.setProperty("--color-primary", theme.colors.primary);
      root.style.setProperty("--color-secondary", theme.colors.secondary);
      root.style.setProperty("--color-tertiary", theme.colors.tertiary);
    }

    if (theme.text) {
      root.style.setProperty("--color-text-main", theme.text.main);
      root.style.setProperty("--color-text-secondary", theme.text.secondary);
      root.style.setProperty("--color-text-tertiary", theme.text.tertiary);
    }

    if (theme.font) {
      root.style.setProperty("--font-main", theme.font);
    }

    // Debug logging
    console.log("Theme applied:", theme);
    console.log("Active persona:", activePersona);
  }, [activePersona]); // This effect re-runs whenever the activePersona object changes.
};
