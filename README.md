# The Abel Experience™ CFW (Cognitive Framework) v3.4

## Description

The Abel Experience™ CFW (Cognitive Framework) is the third iteration of a full-stack MERN application designed as a personalized digital sanctuary and command center. It leverages a decoupled API architecture to serve a private user/admin panel and a public-facing content viewer.

The core philosophy of this project is to create a deeply integrated environment that blends personal productivity, content management, and sophisticated gamification. The system is built around a suite of trackers for daily life activities (habits, workouts, reading), which fuel an internal economy of multiple currencies. These currencies are then used in a gacha-style shop to acquire a wide range of digital collectibles.

The primary client is a feature-rich web application (`client-admin`) providing a dark, professional, HUD-style interface for registered users. A secondary client (`client-public`) offers an immersive, retro-terminal experience for viewing published narrative content.

**Version 3.4** introduces enhanced dashboard widgets, improved profile collection displays, and refined Pokemon editor functionality with better UI/UX alignment and responsive design.

### What's New in v3.4

- **Enhanced Dashboard Widgets**: Complete redesign of dashboard widgets including:

  - **LoreChartWidget**: A responsive 2x2 grid of four interconnected charts displaying complex narrative data:
    - **Narrative Coherence Index** (Area Chart)
    - **Anomaly Detection Events** (Bar Chart)
    - **Temporal Drift Analysis** (Line Chart)
    - **System Status Overview** (Pie Chart)
  - **HabitTrackerWidget**: Shows up to 10 habits with completed items crossed out but remaining visible
  - **WorkoutTrackerWidget**: 2x2 grid of preset workout template buttons plus custom log option
  - **BookTrackerWidget**: Displays last 4 active books with cover images, year, author, and update controls
  - **WeatherWidget**: 2-column layout with current weather and 5-day forecast
  - **ClockWidget**: Enhanced time display with improved alignment
  - **Additional Widgets**: RecentAcquisitionsWidget, SocialSalesWidget, TopProductsWidget, CurrencySourceWidget

- **Improved Profile Collections**:

  - **DisplayedCollection**: Redesigned to show 6 items per row with 20% width-to-height ratio
  - **Responsive Grid**: 3 columns on mobile, 6 on desktop for optimal viewing
  - **Height Independence**: Middle column no longer forced to align with sidebar heights
  - **Error Handling**: Robust fallbacks for undefined collection data

- **Pokemon Editor Enhancements**:

  - **Wider Editor**: Increased editor width by reducing sidebar from 240px to 192px
  - **Better Layout**: More space for forms and content editing
  - **Success Feedback**: Non-blocking toast notifications positioned in top-right corner
  - **Improved Navigation**: Enhanced Pokemon selector with better search functionality

- **Persona Theming System Enhancements**:

  - **Dynamic UI Theming**: Fully functional persona-based theme switching that updates CSS custom properties in real-time
  - **Dropdown Interface**: Converted PersonaWidget from button grid to elegant dropdown with Portal-based positioning
  - **Theme Color Integration**: Each persona applies unique color schemes across all UI components including charts
  - **Backend Integration**: Proper database schema alignment for persona data with corrected color and text object structures

- **Chart Widget Architecture**:

  - **Modular Design**: Split monolithic LoreChartWidget into four independent, reusable chart components
  - **Responsive Containers**: All charts automatically adjust to widget container sizes using flexible layouts
  - **Data Visualization**: Advanced Recharts integration with custom styling and theming support
  - **Performance Optimization**: Efficient rendering with proper component separation and state management

- **UI/UX Improvements**:
  - **Grid Layout Fixes**: Proper gap spacing and alignment across all dashboard widgets
  - **Responsive Design**: Better mobile and tablet compatibility with flexible chart containers
  - **Visual Consistency**: Unified styling and spacing throughout the application
  - **Performance**: Optimized component rendering and state management

Future iterations of this project will explore the development of native desktop (C# or C++) and mobile UI clients that will connect to the same robust backend API, offering enhanced performance and deeper OS integration.

## Table of Contents

1.  [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Backend Setup (Server)](#backend-setup-server)
    - [Frontend Setup (client-admin & client-public)](#frontend-setup-client-admin--client-public)
2.  [Usage](#usage)
    - [Running the Application](#running-the-application)
    - [Seeding Initial Data](#seeding-initial-data)
3.  [Features](#features)
    - [Backend & API](#backend--api)
    - [Admin & User Panel (`client-admin`)](#admin--user-panel-client-admin)
    - [Public Terminal Viewer (`client-public`)](#public-terminal-viewer-client-public)
4.  [Walkthrough](#walkthrough)
    - [First Time Setup (Admin)](#first-time-setup-admin)
    - [Daily User Flow](#daily-user-flow)
5.  [Screenshot](#screenshot)
6.  [License](#license)
7.  [Contributors and Questions](#contributors-and-questions)

---

## Installation

### Prerequisites

- Node.js (v18.x or later)
- npm (v9.x or later)
- MongoDB (A local instance or a free cloud cluster from MongoDB Atlas)
- Git

### Backend Setup (Server)

The server is located in the `server/` directory.

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create an Environment File:**
    Create a `.env` file in the `server/` root and populate it with the necessary variables. See the `Environment Variables` section in the project's full documentation for a complete list.
    **Crucial variables:**
    - `MONGO_URI`: Your MongoDB connection string.
    - `JWT_SECRET`: A long, random string for signing tokens.
    - `PORT`: The port for the backend server (e.g., 5000).

### Frontend Setup (client-admin & client-public)

The setup process is identical for both the `client-admin` and `client-public` directories.

1.  **Navigate to the client directory:**
    ```bash
    cd client-admin  # or client-public
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **(Optional) Create Local Environment File:**
    For local development, you can create a `.env.local` file in the client's root to specify the backend API URL.
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```

---

## Usage

### Running the Application

To run the full application, you will need to open three separate terminal windows.

1.  **Start the Backend Server:**

    ```bash
    cd server
    npm run dev
    ```

    _The server will typically run on `http://localhost:5000`._

2.  **Start the Admin Panel Frontend:**

    ```bash
    cd client-admin
    npm run dev
    ```

    _This client will typically run on `http://localhost:5173` or the next available port._

3.  **Start the Public Terminal Frontend:**
    ```bash
    cd client-public
    npm run dev
    ```
    _This client will typically run on the next available port after the admin panel (e.g., `5174`)._

### Seeding Initial Data

After setting up the project, the first step is to populate the database with the foundational "Base" data for collectibles and definitions.

1.  **Review Data Files:** Ensure the JSON files in `server/data/` are configured as desired.
2.  **Run the Import Script:**
    ```bash
    cd server
    npm run data:import
    ```
    _This command will clear the relevant collections and insert the data from your JSON files._

---

## Features

### Backend & API

- **Authentication:** Secure user registration and login system using JSON Web Tokens (JWT).
- **Middleware:** Role-based access control (`admin`, `special_user`, `member`) and route protection.
- **Decoupled Architecture:** RESTful API designed to serve multiple clients (web, future native desktop/mobile).
- **Gamified Economy:** Logic for awarding three distinct currencies (`TemuTokens`, `GatillaGold`, `WendyHearts`) based on user activities.
- **Gacha System:** A robust API endpoint for handling randomized "pulls" of collectibles, deducting currency, and handling duplicates.
- **Content Parsing:** A server-side parser to convert raw "greentext" block text into a structured JSON format for storage.
- **Data Seeding:** A script to populate the database with foundational data for all collectible types.

### Admin & User Panel (`client-admin`)

- **Responsive Design:** Fully functional on both desktop and mobile devices with enhanced mobile layouts.
- **HUD Dashboard:** A professional, data-rich dashboard with a futuristic aesthetic, featuring:
  - **Comprehensive Widget Grid**: All dashboard widgets displayed in an optimized 6-column grid layout
  - **LoreChartWidget**: Four responsive, interconnected charts displaying complex narrative data with real-time theming:
    - **Narrative Coherence Index** (Area Chart): Tracks story consistency metrics with gradient fills and smooth animations
    - **Anomaly Detection Events** (Bar Chart): Visualizes data irregularities and system alerts with color-coded severity
    - **Temporal Drift Analysis** (Line Chart): Monitors timeline stability with precision markers and trend indicators
    - **System Status Overview** (Pie Chart): Displays operational health metrics with interactive segments and tooltips
  - **Enhanced Tracker Widgets**: Habit, Book, and Workout trackers with improved functionality and responsive layouts
  - **Weather & Clock Integration**: Real-time weather data and enhanced clock display with improved alignment
  - **Additional Analytics**: Recent acquisitions, sales data, and currency tracking widgets with live updates
- **Abel Persona Theming:** A comprehensive system for Admin and Wendy to unlock and equip "Personas" that dynamically change the entire UI color scheme:
  - **Real-time Theme Switching**: Instant application of persona color schemes across all components
  - **CSS Custom Properties**: Advanced theming system using CSS variables for seamless color transitions
  - **Chart Integration**: Persona themes automatically apply to all chart components with coordinated color palettes
  - **Dropdown Interface**: Elegant persona selection dropdown with Portal-based positioning to avoid z-index conflicts
- **Full-Featured Trackers:**
  - **Habit Tracker:** CRUD for personal habits with completion status persistence and visual feedback.
  - **Book Tracker:** Track reading progress, ratings, and library with cover image support and detailed metadata.
  - **Workout Tracker:** Log detailed workouts with exercises, sets, reps, and weight. Includes support for "clean" sessions and "prebuilt templates" with 2x2 preset button layout.
  - **Task Manager:** With support for sub-task checklists.
  - **Note Manager:** For personal notes and ideas.
- **Collection Management:** UI to view all collected items (Pokémon, Snoopys, Habbo Rares, Yu-Gi-Oh! Cards, Badges, Titles) with enhanced grid layouts.
- **Profile Customization:**
  - **Optimized Display Collections**: Show 6 items per collection in a compact, responsive grid
  - **Independent Height Management**: Collections maintain their optimal aspect ratio (20% width-to-height)
  - **Visual Selection Interface**: Easy-to-use interface for selecting displayed items from collections
- **Admin-Specific Panels:**
  - **Volume Manager:** Create, edit, publish, and delete Greentext Volumes using a form with a live JSON preview.
  - **Pokemon Database Editor:** Enhanced editor with wider layout, improved navigation, and non-blocking success feedback.
  - **Base Data Manager:** CRUD interfaces for managing the foundational data of all collectibles (e.g., adding a new exercise to the system, defining a new Snoopy collectible).

### Public Terminal Viewer (`client-public`)

- **Immersive Interface:** A retro, full-screen terminal aesthetic.
- **Typewriter Animation:** Greentext Volumes are displayed character-by-character with randomized, subtle glitch effects for an authentic feel.
- **Command-Line Navigation:** Users interact with the system by typing commands like `catalogue`, `random`, `view [id]`, `next`, etc.

---

## Walkthrough

### First Time Setup (Admin)

1.  After installation, run `npm run data:import` in the `server` directory to seed the database.
2.  Start all three services (`server`, `client-admin`, `client-public`).
3.  Navigate to the `client-admin` application and register your primary `admin` account.
4.  Using the admin-only links in the sidebar, navigate to "Exercise Definitions" and "Workout Templates" to create the foundational data for the Workout Tracker.
5.  Navigate to the "Volume Manager," paste a complete raw greentext into the form, set the status to "published," and create the volume.
6.  Navigate to the `client-public` URL to see the published volume available for viewing.

### Daily User Flow

1.  Log in to the `client-admin` application. You are greeted by your personalized HUD Dashboard featuring all enhanced widgets in an optimized grid layout.
2.  Navigate to the **Habit Tracker** and mark several habits as complete. Completed habits remain visible but crossed out. Observe your `TemuTokens` balance increase.
3.  Go to the **Book Tracker** and update your `pagesRead` for a book you are currently reading. View cover images and detailed book information. See your `WendyHearts` balance increase.
4.  Visit the **Workout Tracker** and log a session using one of the four preset template buttons in the 2x2 grid, or create a custom workout. Your `GatillaGold` balance will increase based on the number of sets completed.
5.  Check the **Weather Widget** for current conditions and 5-day forecast, and view the time on the enhanced **Clock Widget**.
6.  Review the **LoreChartWidget** to see complex data visualizations across four interconnected charts:
    - Monitor **Narrative Coherence** trends with the smooth area chart visualization
    - Analyze **Anomaly Detection Events** using the interactive bar chart with recent data highlights
    - Track **Temporal Drift** patterns through the precise line chart with data point markers
    - Check **System Status** at a glance with the comprehensive pie chart breakdown
7.  Experiment with **Persona Theming** by selecting different personas from the dropdown to see real-time theme changes across all dashboard components and charts.
8.  With your newly earned currency, navigate to the **Shop (Gacha)** page and perform a "pull" for a new Pokémon or Snoopy.
9.  Visit your **Profile** page to see your updated level/XP, currency balances, and manage which collectibles are displayed in the optimized 6-item-per-row collections with improved spacing and visual hierarchy.

The enhanced dashboard now provides a comprehensive view of your digital sanctuary with responsive charts that adapt to any screen size, persona-based theming that reflects your current aesthetic preferences, and detailed analytics that help you track your progress across all areas of the system.

---

## Screenshot

_(Coming soon.)_

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

## Contributors

This is a personal project developed and maintained by Abel Gutierrez.
For any questions, you can reach me at:

- GitHub: [abelgtzrs](https://github.com/abelgtzrs)
- Email: abelgtzrs@gmail.com
