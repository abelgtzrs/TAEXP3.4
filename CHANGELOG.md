# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Comprehensive Tailwind CSS configuration with custom color variables, font families, and box shadows (client_admin).
- Custom scrollbar-hide utility for cross-browser scrollbar hiding (client_admin).
- Plugin to inject CSS variables into `:root` for theme colors and surfaces (client_admin).
- Modular React component structure for dashboard, profile, collections, and shop pages (client_admin).
- Gacha shop system supporting Pokémon, Yu-Gi-Oh! cards, Snoopys, Habbo Rares, and Abel Personas (server).
- RESTful API endpoints for user authentication, profile, collections, badges, and shop (server).
- MongoDB models for users, collectibles, badges, workout logs, books, and more (server).
- Seeder scripts for initial data population (server).
- Custom Express middleware for authentication and error handling (server).
- Modern dashboard UI with animated widgets and charts (client_admin).
- Profile page with displayed collections and badge showcase (client_admin).
- Collection detail and management pages for all collectible types (client_admin).
- Data import/export scripts for Pokémon, Yu-Gi-Oh!, and Habbo Rares (server/data).

### Changed

- Extended Tailwind theme to use CSS variables for primary, secondary, tertiary, background, surface, and text colors (client_admin).
- Updated font family to use CSS variable `--font-main` for both sans and mono (client_admin).
- Added custom box shadow `glow-primary` using the primary color variable (client_admin).
- Improved API error handling and response consistency (server).
- Refactored gacha pull logic to support multi-card packs and duplicate handling (server/controllers/shopController.js).
- Improved plugin structure for better maintainability (client_admin/tailwind.config.cjs).

### Fixed

- Ensured Tailwind scans all `.html`, `.js`, `.ts`, `.jsx`, and `.tsx` files in the `src` directory for class names (client_admin).
- Fixed color variable mapping for background and surface (client_admin).
- Fixed broken image links for Yu-Gi-Oh! cards on profile page (client_admin).
- Fixed 500 errors on `/api/users/me/dashboard-stats` by correcting Mongoose populate usage (server/controllers/userController.js).
- Improved duplicate gacha pull refund logic (server/controllers/shopController.js).

### Removed

- Deprecated AdminEditPokemonPage and all related routes/components (client_admin).

---

## [Earlier]

- Initial project setup for both client and server.
