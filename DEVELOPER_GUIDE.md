# The Abel Experience Dashboard

## Overview

This project is a full-stack web application for managing, displaying, and editing collectible data (such as Habbo Rares, Pokémon, and more) for The Abel Experience. It features a modern React dashboard, a Node.js/Express backend, and MongoDB for data storage. The app is styled with Tailwind CSS and supports both admin and public user interfaces.

---

## Project Structure

This is a high-level overview of the most important directories and files.

```
/
├── client_admin/           # React Admin Dashboard Frontend
│   ├── src/
│   │   ├── components/     # Reusable React components, organized by feature
│   │   │   ├── dashboard/      # Widgets for the main dashboard
│   │   │   ├── layout/         # Page structure components (Header, Sidebar)
│   │   │   ├── profile/        # Components for the user profile page
│   │   │   ├── ui/             # General-purpose UI elements (Button, Card)
│   │   │   ├── routing/        # Protected and Admin route components
│   │   │   ├── books/          # Components for book tracking
│   │   │   ├── collections/    # Components for collection displays
│   │   │   ├── habits/         # Components for habit tracking
│   │   │   ├── pokedex/        # Components for the Pokédex
│   │   │   ├── shop/           # Components for the item shop
│   │   │   ├── volumes/        # Components for book volume management
│   │   │   └── workouts/       # Components for workout logging and templates
│   │   ├── context/            # React Context providers (e.g., AuthContext)
│   │   ├── hooks/              # Custom React hooks (e.g., useTheme)
│   │   ├── pages/              # Page-level components, each corresponding to a route
│   │   │   ├── DashboardPage.jsx       # Main dashboard view with widgets
│   │   │   ├── LoginPage.jsx           # User authentication
│   │   │   ├── ProfilePage.jsx         # User profile, stats, and collections
│   │   │   ├── CollectionsPage.jsx     # Overview of all user collections
│   │   │   ├── CollectionDetailPage.jsx # Detail view for a specific collection item
│   │   │   ├── ShopPage.jsx            # In-app shop for gacha pulls
│   │   │   ├── HabitsPage.jsx          # Habit tracking and management
│   │   │   ├── BooksPage.jsx           # User's reading list and progress
│   │   │   ├── VolumesPage.jsx         # View and manage book volumes
│   │   │   ├── EditVolumePage.jsx      # Form to edit a book volume
│   │   │   ├── WorkoutPage.jsx         # Workout logs and templates
│   │   │   ├── LogWorkoutPage.jsx      # Form to log a workout session
│   │   │   ├── SelectTemplatePage.jsx  # Page to select a workout template
│   │   │   ├── TasksPage.jsx           # To-do list and task management
│   │   │   ├── FinancePage.jsx         # Personal finance tracking
│   │   │   ├── SettingsPage.jsx        # User account and theme settings
│   │   │   ├── PokedexPage.jsx         # Displays all Pokémon datawhere
│   │   │   ├── HabboRareManagement.jsx # Admin page for managing Habbo Rares
│   │   │   ├── PokemonEditorPage.jsx   # Admin page for managing Pokémon
│   │   │   ├── AdminExercisesPage.jsx  # Admin page for managing exercises
│   │   │   └── AdminTemplatesPage.jsx  # Admin page for managing workout templates
│   │   ├── services/       # API call handlers (e.g., api.js)
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Root component with all route definitions
│   │   └── main.jsx        # Main entry point for the React app
│   └── tailwind.config.js  # Tailwind CSS configuration
│
├── server/                 # Node.js/Express Backend
│   ├── controllers/        # Business logic for API routes
│   ├── middleware/         # Express middleware (e.g., authMiddleware)
│   ├── models/             # Mongoose data schemas
│   ├── routes/             # API route definitions
│   ├── config/             # Configuration files (e.g., db.js)
│   └── server.js           # Main backend server entry point
│
├── public/                 # Static assets served by the backend
│   ├── habborares/         # Habbo Rare images
│   └── pokemon/            # Pokémon sprites and images
│
└── DEVELOPER_GUIDE.md      # This documentation file
```

---

## Key Technologies

- **Frontend:** React (with hooks), Vite, Tailwind CSS, lucide-react icons
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Styling:** Tailwind CSS with custom theme variables (see `tailwind.config.js`)
- **Static Assets:** Served from `/public` (images, sprites, etc.)

---

## Development Setup

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

### 1. Install Dependencies

```sh
cd client_admin
npm install
cd ../server
npm install
```

### 2. Environment Variables

- Copy `.env.example` to `.env` in the `server/` directory and fill in your MongoDB URI and any secrets.
- Optionally, set `VITE_API_BASE_URL` in `client_admin/.env` for API URL (defaults to `http://localhost:5000/api`).

### 3. Running the App

- **Backend:**
  ```sh
  cd server
  npm run dev
  # or: node server.js
  ```
- **Frontend (Admin):**
  ```sh
  cd client_admin
  npm run dev
  ```
- Visit [http://localhost:5173](http://localhost:5173) for the admin dashboard.

---

## Core Concepts

### Static File Serving

- All images (e.g., Habbo Rares, Pokémon) are placed in the `public/` directory.
- The backend serves these files at `http://localhost:5000/<path>` (e.g., `/habborares/classic/Aloe.gif`).
- When referencing images in the database, use relative paths (e.g., `/habborares/classic/Aloe.gif`).

### Image URL Construction

- Both admin and public UIs use a helper to build the correct image URL, stripping any leading `/public/` and prefixing with the server base URL.
- See `getImageUrl` in both `HabboRareEditor.jsx` and `DisplayedCollection.jsx` for reference.

### Theming & Styling

- Tailwind CSS is used throughout, with custom colors and fonts defined in `tailwind.config.js`.
- Use theme variables (e.g., `bg-background`, `text-text-main`) for consistent look.

### Widget Component

- Use the `Widget` component (`src/components/dashboard/Widget.jsx`) to wrap dashboard items for consistent layout and styling.

### Data Model

- **Habbo Rares:**
  - Stored in MongoDB, with fields like `name`, `description`, `imageUrl`, `rarity`, `category`, `tags`, `isActive`.
  - Images referenced by relative path (see above).
- **User Collections:**
  - Each user has a collection of items (Pokémon, Habbo Rares, etc.), with references to base data.

### Admin Features

- **Habbo Rare Editor:**
  - Search, edit, and preview Habbo Rare items with live image preview.
  - All input fields use consistent theme styling.
  - Each item is wrapped in a `Widget` for layout.
- **Collections Page:**
  - Displays user collections using the `DisplayedCollection` component.
  - Images are loaded using the same URL construction logic as the admin editor.

---

## Common Issues & Debugging

- **Image Not Displaying:**
  - Check the image path in the database (should be relative, e.g., `/habborares/classic/Aloe.gif`).
  - Ensure the file exists in `public/habborares/classic/`.
  - Check the browser console for debug logs from `DisplayedCollection.jsx` and `HabboRareEditor.jsx`.
- **CORS Issues:**
  - The backend enables CORS for local development. If you see CORS errors, check your browser and server config.
- **Search Errors:**
  - If you see `Cannot read properties of undefined (reading 'toLowerCase')`, ensure all items have `name`, `category`, and `rarity` fields, or use null checks in filters.

---

## Contribution Guidelines

- Use consistent code style (Prettier, ESLint configs are provided).
- Use the `Widget` component for all dashboard widgets.
- Keep all image URL logic consistent between admin and public UIs.
- Document any new components or utilities in the code and update this README as needed.

---

## Contact

For questions, contact the project maintainer or open an issue in the repository.

---

## File-by-File Reference

This section provides a detailed breakdown of every important JavaScript and React file in the project, organized by directory.

### `client_admin/src`

The heart of the admin dashboard frontend.

#### Top-Level Files

- **`main.jsx`**: The main entry point for the React application. It renders the `App` component and wraps it with essential providers like `BrowserRouter` for routing and `AuthProvider` for global authentication state.
- **`App.jsx`**: The root component of the application. It defines the entire routing structure using `react-router-dom`, including public routes, protected routes, and admin-only routes. It also initializes the theme using the `useTheme` hook.

#### `context`

- **`AuthContext.jsx`**: A React Context provider that manages global authentication state. It supplies user information, authentication tokens, and login/logout functions to all components wrapped within it, ensuring a consistent authentication state across the app.

#### `hooks`

- **`useTheme.js`**: A custom React hook that manages the application's theme (e.g., light, dark). It reads the user's preference from local storage or system settings and applies the corresponding CSS classes to the root HTML element.

#### `services`

- **`api.js`**: Centralizes all API communication with the backend. It exports functions for each API endpoint (e.g., fetching user data, updating items), handles adding the authentication token to requests, and standardizes error handling.

#### `utils`

- **`greentextParser.js`**: A utility function for parsing and styling "greentext" (lines starting with `>`), commonly used in forums, to render it with a specific style.

#### `components`

This directory contains all reusable React components, organized into subdirectories.

- **`components/layout/`**: Components responsible for the overall page structure.

  - `AdminLayout.jsx`: The main layout for all authenticated pages, including the sidebar, header, and main content area.
  - `Header.jsx`: The top navigation bar component, containing user info, notifications, and the theme switcher.

- **`components/routing/`**: Higher-order components that protect routes.

  - `ProtectedRoute.jsx`: Wraps routes that require a user to be logged in. Redirects to the login page if the user is not authenticated.
  - `AdminRoute.jsx`: Wraps routes that require admin privileges. It checks the user's role and restricts access accordingly.

- **`components/ui/`**: General-purpose, reusable UI elements.

  - `Widget.jsx`: A container component for all dashboard widgets, providing a consistent frame, title, and styling.
  - `Button.jsx`, `StyledButton.jsx`: Standard button components with consistent styling.
  - `input.jsx`, `StyledInput.jsx`: Standardized text input components.
  - `card.jsx`: A flexible container for displaying content in a card format.
  - `PageHeader.jsx`: A component for creating a consistent header for each page.
  - `Separator.jsx`: A simple horizontal line for visually separating content.
  - `StyledToggle.jsx`: A toggle switch component for boolean inputs.

- **`components/dashboard/`**: Contains all the individual widgets displayed on the main dashboard.

  - Examples: `BookTrackerWidget.jsx`, `HabitTrackerWidget.jsx`, `PersonaWidget.jsx`, `SpotifyWidget.jsx`, `SystemStatusWidget.jsx`, `WeatherWidget.jsx`. Each is a self-contained component responsible for fetching and displaying its specific data.

- **`components/profile/`**: Components used on the user profile page.

  - `DisplayedCollection.jsx`: A key component that renders a user's collection of items (e.g., Habbo Rares, Pokémon). It handles fetching the correct image URLs and displaying them in a grid.
  - `UserInfoCard.jsx`: Displays and allows editing of primary user information.
  - `UserProfileHeader.jsx`: The header section of the profile page.
  - `BadgeDisplay.jsx`: Renders the badges a user has earned.

- **`components/HabboRareEditor.jsx`**: A powerful, feature-rich component for administrators to manage Habbo Rare items. It includes functionality for searching, filtering, editing form fields, and a live preview of the item's image and details.

- **`components/books/`**: Components related to the book tracking feature.
- **`components/collections/`**: Components for displaying user collections.
- **`components/habits/`**: Components for the habit tracking feature.
- **`components/pokedex/`**: Components used in the Pokédex and Pokémon-related pages.
- **`components/shop/`**: Components for the in-app shop and gacha system.
- **`components/volumes/`**: Components for managing book volumes.
- **`components/workouts/`**: Components for logging workouts and managing templates.

#### `pages`

- **`pages/*.jsx`**: Each file in this directory corresponds to a specific page (or view) in the application. They are responsible for fetching page-specific data and composing components from the `components` directory to build the final UI.
  - `DashboardPage.jsx`: The main landing page after login, displaying a variety of widgets.
  - `LoginPage.jsx`: The user authentication page.
  - `ProfilePage.jsx`: Displays user information, stats, badges, and collections.
  - `CollectionsPage.jsx`: An overview of all collections a user owns.
  - `CollectionDetailPage.jsx`: Shows detailed information about a specific item in a collection.
  - `ShopPage.jsx`: The in-app store for purchasing items or gacha pulls.
  - `HabitsPage.jsx`: The main page for tracking and managing daily habits.
  - `BooksPage.jsx`: The main page for the user's reading list and progress.
  - `VolumesPage.jsx`: A page for managing the volumes of a book series.
  - `EditVolumePage.jsx`: A form for editing a specific book volume.
  - `WorkoutPage.jsx`: The central hub for workout-related activities, showing logs and templates.
  - `LogWorkoutPage.jsx`: A form for logging the details of a completed workout session.
  - `SelectTemplatePage.jsx`: Allows the user to choose a workout template to start a session.
  - `TasksPage.jsx`: A to-do list and task management page.
  - `FinancePage.jsx`: A dashboard for personal finance tracking.
  - `SettingsPage.jsx`: A page for managing user account settings and application theme.
  - `PokedexPage.jsx`: A page that displays all Pokémon data in a filterable, searchable grid.
  - `HabboRareManagement.jsx`: The admin page that houses the `HabboRareEditor` component for managing Habbo data.
  - `PokemonEditorPage.jsx`: The admin page for managing base Pokémon data.
  - `AdminEditPokemonPage.jsx`: An admin form for editing the details of a specific Pokémon.
  - `AdminExercisesPage.jsx`: An admin page for managing the master list of exercise definitions.
  - `AdminTemplatesPage.jsx`: An admin page for creating and managing workout templates.

### `server`

The Node.js, Express, and MongoDB backend.

#### Top-Level Files

- **`server.js`**: The main entry point for the backend server. It initializes the Express app, connects to the database, sets up middleware (CORS, JSON parsing), serves static files, and mounts all the API routes.
- **`seeder.js`**: A utility script to populate the database with initial data from JSON files.

#### `config`

- **`db.js`**: Contains the logic for connecting to the MongoDB database using Mongoose.

#### `middleware`

- **`authMiddleware.js`**: Contains Express middleware for protecting routes. The `protect` function verifies the JWT token, and `authorize` checks for specific user roles (like 'admin').

#### `models`

- **`models/*.js`**: Defines the Mongoose schemas for all data structures in the application. This includes base data models (e.g., `PokemonBase.js`, `HabboRareBase.js`) and user-specific data models (e.g., `User.js`, `userSpecific/userPokemon.js`).

#### `routes`

- **`routes/*.js`**: Defines the API endpoints for the application. Each file groups related routes (e.g., `authRoutes.js`, `pokemonAdminRoutes.js`). They link HTTP methods and URL paths to specific controller functions.

#### `controllers`

- **`controllers/*.js`**: Contains the business logic for handling API requests. Each function corresponds to a specific route and is responsible for interacting with the database (via models) and sending a response back to the client.
