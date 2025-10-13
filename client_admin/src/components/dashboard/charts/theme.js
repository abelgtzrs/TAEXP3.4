export const getTheme = () => {
  const root = getComputedStyle(document.documentElement);
  return {
    primary: root.getPropertyValue("--color-primary") || "#426280ff",
    secondary: root.getPropertyValue("--color-secondary") || "#144573ff",
    textSecondary: root.getPropertyValue("--color-text-secondary") || "#9ca3af",
  };
};
