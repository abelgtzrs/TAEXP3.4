# File Structure: JavaScript & React (client_admin/src)

Below is a detailed breakdown of every JavaScript and React file in the `client_admin/src` directory, including its purpose and how it fits into the project. Use this as a reference for onboarding, debugging, or extending the dashboard.

---

## Top-Level Files

- **main.jsx** — React app entry point. Sets up routing and authentication context.
- **App.jsx** — Main app component. Defines all routes and imports all page components.

---

## Context & Hooks

- **context/AuthContext.jsx** — Provides authentication state and logic to the app.
- **hooks/useTheme.js** — Custom hook for theme management (light/dark/system).

---

## Services & Utilities

- **services/api.js** — Centralizes all API calls to the backend.
- **utils/greentextParser.js** — Utility for parsing and formatting greentext in user content.

---

## Layout & Routing

- **components/layout/AdminLayout.jsx** — Main dashboard layout (sidebar, header, content area).
- **components/layout/Header.jsx** — Top navigation/header bar.
- **components/routing/ProtectedRoute.jsx** — Route guard for authenticated users.
- **components/routing/AdminRoute.jsx** — Route guard for admin-only pages.

---

## UI Components

- **components/ui/Widget.jsx** — Standard container for dashboard widgets.
- **components/ui/Button.jsx** — Reusable button component.
- **components/ui/StyledButton.jsx** — Variant of Button with style presets.
- **components/ui/StyledInput.jsx** — Standardized input field with theme styling.
- **components/ui/input.jsx** — Input component compatible with shadcn/ui API.
- **components/ui/StyledToggle.jsx** — Toggle switch component.
- **components/ui/PageHeader.jsx** — Consistent page header for dashboard sections.
- **components/ui/Separator.jsx** — Visual separator for grouping content.
- **components/ui/card.jsx** — Card container for grouped content.

---

## Dashboard Widgets

- **components/dashboard/Widget.jsx** — Main widget container for dashboard modules.
- **components/dashboard/GlobeWidget.jsx** — Shows user locations or global stats.
- **components/dashboard/GoalsWidget.jsx** — Displays user goals.
- **components/dashboard/HabitTrackerWidget.jsx** — Visualizes habit completion.
- **components/dashboard/BookTrackerWidget.jsx** — Tracks books read.
- **components/dashboard/PersonaWidget.jsx** — Shows user persona/character info.
- **components/dashboard/WeatherWidget.jsx** — Displays weather info.
- **components/dashboard/SpotifyWidget.jsx** — Shows current Spotify playback.
- **components/dashboard/SystemStatusWidget.jsx** — Displays system/server health.
- **components/dashboard/RecentAcquisitionsWidget.jsx** — Shows latest items collected.
- ...and more widgets for stats, charts, and summaries.

---

## Profile & Collection Components

- **components/profile/DisplayedCollection.jsx** — Renders a grid of collected items for a user.
- **components/profile/UserInfoCard.jsx** — Displays user profile info.
- **components/profile/UserProfileHeader.jsx** — Header for the profile page.
- **components/profile/UserStatsWidget.jsx** — Widget for displaying user statistics.
- **components/profile/BadgeDisplay.jsx** — Renders a user's badges.

---

## Books & Shop Components

- **components/books/BookItem.jsx** — Displays a single book in the user's collection.
- **components/books/AddBookForm.jsx** — Form for adding a new book.
- **components/shop/GachaCard.jsx** — Displays a gacha (random draw) card.
- **components/shop/PullResultModal.jsx** — Modal dialog showing the result of a gacha pull.

---

## Admin & Editor Components

- **components/HabboRareEditor.jsx** — Full-featured admin editor for Habbo Rare items.

---

## Pages

- **pages/\*.jsx** — Each file represents a top-level page in the app (e.g., DashboardPage.jsx, BooksPage.jsx, CollectionsPage.jsx, HabboRareManagement.jsx, ProfilePage.jsx, ShopPage.jsx, SettingsPage.jsx, LoginPage.jsx, AdminExercisesPage.jsx, AdminTemplatesPage.jsx, etc.).

---

This structure ensures modularity, reusability, and clarity for all developers working on the project. For backend/server files, follow a similar approach: controllers handle API logic, models define data schemas, and routes expose endpoints.

If you add new files, update this section to keep the documentation current and helpful for future developers.
