# The Abel Experience™ CFW (Cognitive Framework) v3.0

## Description

The Abel Experience™ CFW (Cognitive Framework) is the third iteration of a full-stack MERN application designed as a personalized digital sanctuary and command center. It leverages a decoupled API architecture to serve a private user/admin panel and a public-facing content viewer.

The core philosophy of this project is to create a deeply integrated environment that blends personal productivity, content management, and sophisticated gamification. The system is built around a suite of trackers for daily life activities (habits, workouts, reading), which fuel an internal economy of multiple currencies. These currencies are then used in a gacha-style shop to acquire a wide range of digital collectibles.

The primary client is a feature-rich web application (`client-admin`) providing a dark, professional, HUD-style interface for registered users. A secondary client (`client-public`) offers an immersive, retro-terminal experience for viewing published narrative content.

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

-   Node.js (v18.x or later)
-   npm (v9.x or later)
-   MongoDB (A local instance or a free cloud cluster from MongoDB Atlas)
-   Git

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
    -   `MONGO_URI`: Your MongoDB connection string.
    -   `JWT_SECRET`: A long, random string for signing tokens.
    -   `PORT`: The port for the backend server (e.g., 5000).

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
    *The server will typically run on `http://localhost:5000`.*

2.  **Start the Admin Panel Frontend:**
    ```bash
    cd client-admin
    npm run dev
    ```
    *This client will typically run on `http://localhost:5173` or the next available port.*

3.  **Start the Public Terminal Frontend:**
    ```bash
    cd client-public
    npm run dev
    ```
    *This client will typically run on the next available port after the admin panel (e.g., `5174`).*

### Seeding Initial Data

After setting up the project, the first step is to populate the database with the foundational "Base" data for collectibles and definitions.

1.  **Review Data Files:** Ensure the JSON files in `server/data/` are configured as desired.
2.  **Run the Import Script:**
    ```bash
    cd server
    npm run data:import
    ```
    *This command will clear the relevant collections and insert the data from your JSON files.*

---

## Features

### Backend & API

-   **Authentication:** Secure user registration and login system using JSON Web Tokens (JWT).
-   **Middleware:** Role-based access control (`admin`, `special_user`, `member`) and route protection.
-   **Decoupled Architecture:** RESTful API designed to serve multiple clients (web, future native desktop/mobile).
-   **Gamified Economy:** Logic for awarding three distinct currencies (`TemuTokens`, `GatillaGold`, `WendyHearts`) based on user activities.
-   **Gacha System:** A robust API endpoint for handling randomized "pulls" of collectibles, deducting currency, and handling duplicates.
-   **Content Parsing:** A server-side parser to convert raw "greentext" block text into a structured JSON format for storage.
-   **Data Seeding:** A script to populate the database with foundational data for all collectible types.

### Admin & User Panel (`client-admin`)

-   **Responsive Design:** Fully functional on both desktop and mobile devices.
-   **HUD Dashboard:** A professional, data-rich dashboard with a futuristic aesthetic, displaying lore-based charts and key user metrics.
-   **Abel Persona Theming:** A system for Admin and Wendy to unlock and equip "Personas" that dynamically change the entire UI color scheme.
-   **Full-Featured Trackers:**
    -   **Habit Tracker:** CRUD for personal habits.
    -   **Book Tracker:** Track reading progress, ratings, and library.
    -   **Workout Tracker:** Log detailed workouts with exercises, sets, reps, and weight. Includes support for "clean" sessions or "prebuilt templates."
    -   **Task Manager:** With support for sub-task checklists.
    -   **Note Manager:** For personal notes and ideas.
-   **Collection Management:** UI to view all collected items (Pokémon, Snoopys, Habbo Rares, Yu-Gi-Oh! Cards, Badges, Titles).
-   **Profile Customization:** Users can select up to 6 of each collectible type to display on their profile page.
-   **Admin-Specific Panels:**
    -   **Volume Manager:** Create, edit, publish, and delete Greentext Volumes using a form with a live JSON preview.
    -   **Base Data Manager:** CRUD interfaces for managing the foundational data of all collectibles (e.g., adding a new exercise to the system, defining a new Snoopy collectible).

### Public Terminal Viewer (`client-public`)

-   **Immersive Interface:** A retro, full-screen terminal aesthetic.
-   **Typewriter Animation:** Greentext Volumes are displayed character-by-character with randomized, subtle glitch effects for an authentic feel.
-   **Command-Line Navigation:** Users interact with the system by typing commands like `catalogue`, `random`, `view [id]`, `next`, etc.

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

1.  Log in to the `client-admin` application. You are greeted by your personalized HUD Dashboard.
2.  Navigate to the **Habit Tracker** and mark several habits as complete. Observe your `TemuTokens` balance increase.
3.  Go to the **Book Tracker** and update your `pagesRead` for a book you are currently reading. See your `WendyHearts` balance increase.
4.  Visit the **Workout Tracker** and log a session using a prebuilt template, filling in reps and weight. Your `GatillaGold` balance will increase based on the number of sets completed.
5.  With your newly earned currency, navigate to the **Shop (Gacha)** page and perform a "pull" for a new Pokémon or Snoopy.
6.  Visit your **Profile** page to see your updated level/XP, currency balances, and manage which collectibles are displayed.

---

## Screenshot

*(Coming soon.)*


---

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

## Contributors

This is a personal project developed and maintained by Abel Gutierrez.
For any questions, you can reach me at:
- GitHub: [abelgtzrs](https://github.com/abelgtzrs)
- Email: abelgtzrs@gmail.com
