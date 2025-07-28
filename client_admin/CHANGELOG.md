# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Comprehensive Tailwind CSS configuration with custom color variables, font families, and box shadows.
- Custom scrollbar-hide utility for cross-browser scrollbar hiding.
- Plugin to inject CSS variables into `:root` for theme colors and surfaces.

### Changed

- Extended Tailwind theme to use CSS variables for primary, secondary, tertiary, background, surface, and text colors.
- Updated font family to use CSS variable `--font-main` for both sans and mono.
- Added custom box shadow `glow-primary` using the primary color variable.

### Fixed

- Ensured Tailwind scans all `.html`, `.js`, `.ts`, `.jsx`, and `.tsx` files in the `src` directory for class names.
- Fixed color variable mapping for background and surface.
- Improved plugin structure for better maintainability.

### Removed

- N/A

---

## [Earlier]

- Initial project setup.
