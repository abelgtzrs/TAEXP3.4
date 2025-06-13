# The Abel Experience™ - MERN Application

**Version:** 0.3.0 (Pre-Alpha)
**Last Updated:** June 13, 2025

A multifaceted MERN stack application designed as a personalized digital sanctuary, content management system, and gamified productivity platform.

---

## Table of Contents

1.  [Project Philosophy & Ultimate Goal](#1-project-philosophy--ultimate-goal)
2.  [Core Features](#2-core-features)
    * [Admin Panel (Abel's Experience)](#admin-panel)
    * [User Panel (Wendy & Members)](#user-panel)
    * [Public Terminal Viewer](#public-terminal-viewer)
3.  [Technology Stack](#3-technology-stack)
4.  [Project Structure](#4-project-structure)
5.  [Setup and Installation](#5-setup-and-installation)
    * [Prerequisites](#prerequisites)
    * [Backend Setup (Server)](#backend-setup-server)
    * [Frontend Setup (Admin/User Panel & Public Terminal)](#frontend-setup-adminuser-panel--public-terminal)
6.  [Running the Application](#6-running-the-application)
7.  [Environment Variables](#7-environment-variables)
8.  [Database Seeding](#8-database-seeding)
9.  [API Endpoints Overview](#9-api-endpoints-overview)
10. [Database Models Overview](#10-database-models-overview)
11. [Current Development Status](#11-current-development-status)

---

## 1. Project Philosophy & Ultimate Goal

The ultimate goal of "The Abel Experience™" is to create an **evolving digital extension of its primary users' (Abel & Wendy) world, interests, and personal growth journey.** It is a **Personalized Digital Sanctuary & Command Center**, blending productivity, creativity, and gamification.

The design philosophy emphasizes:
* **Deep Personalization:** Extensive options to tailor the interface, data, and aesthetics (e.g., "Abel Personas").
* **Immersive & Rich Interface:** A professional, dark, futuristic HUD-style UI that is data-rich but intuitive.
* **Joyful Gamification:** Rewarding daily activities with a unique three-currency economy, collectible items, and a sense of progression.
* **Seamless Integration:** A central hub for tracking various life aspects (habits, fitness, reading, tasks, media, and eventually finances & sports).

While built for a core user experience, it includes features for a wider audience, such as a public terminal for consuming content and registration for members to participate in the collection ecosystem.

## 2. Core Features

### Admin Panel (Abel's Experience)
* **Dynamic Theming:** Select from unlocked "Abel Personas" to dynamically change the entire admin panel's color scheme.
* **HUD Dashboard:** A command center with complex charts and graphs displaying custom, lore-based data.
* **Content Management:** Full CRUD (Create, Read, Update, Delete) and publishing control over "Greentext Volumes."
* **Base Data Management:** Interfaces to manage the foundational data for all collectibles (Pokémon, Snoopys, Badges, etc.) and definitions (Exercises).
* **User Management:** View all users and manage their roles.
* **Showcase Pages:** (Post-MVP) Ability to create and post personal galleries, music lists, and other showcases.
* **Full User Panel Access:** Receives all features available to Wendy.

### User Panel (Wendy & Members)
* **Secure Registration & Login:** For `special_user` (Wendy) and `member` roles.
* **Personalized Profile:** A customizable space to display chosen collectibles, badges, and titles.
* **Three-Currency Economy:**
    * **`TemuTokens`**: Earned from completing habits.
    * **`GatillaGold`**: Earned from logging workout exercises.
    * **`WendyHearts`**: Earned from reading books.
* **Gacha Shop:** Spend currencies for a random chance to acquire collectibles.
* **Trackers:**
    * **Habit Tracker:** Log daily habits to earn `TemuTokens` and XP.
    * **Workout Tracker:** Log detailed workouts to earn `GatillaGold` and XP.
    * **Book Tracker:** Track reading progress to earn `WendyHearts` and significant XP.
    * **Task Manager:** A personal to-do list with sub-task checklists.
    * **Notes & Media Trackers:** For personal notes and tracking shows, movies, and games.
* **Collectible Systems:**
    * **Pokémon (Gen 1-6):** Get a starter, acquire more via gacha, and level up/evolve your party (leveling/evolution for Admin/Wendy in MVP).
    * **Snoopys, Habbo Rares, Yu-Gi-Oh! Cards:** Acquire via gacha and display in your collection.
    * **Badges:** Earn Pokémon gym/league badges through daily login streaks.
    * **Titles:** (Post-MVP) Unlock and equip titles.

### Public Terminal Viewer
* **Immersive Interface:** A retro terminal aesthetic for viewing published Greentext Volumes.
* **Typewriter Animation:** Text is revealed character-by-character with random, subtle glitches and pauses.
* **Command-Line Interaction:** Users type commands like "catalogue", "random", or "view \[id]" to navigate content.

## 3. Technology Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose ODM
* **Frontend:** React (with Vite)
* **Authentication:** JSON Web Tokens (JWT), bcryptjs
* **Styling:** Tailwind CSS
* **API Client:** Axios
* **Charting:** Recharts (or similar)
* **Icons:** Lucide React

## 4. Project Structure
```
abel_experience_mern/
├── server/                 # Backend (Node.js, Express)
│   ├── config/             # Database connection
│   ├── controllers/        # Request handling logic
│   ├── data/               # JSON files for seeding
│   ├── middleware/         # Auth, error handling
│   ├── models/             # Mongoose schemas
│   │   └── userSpecific/   # User-specific instance models
│   ├── routes/             # API route definitions
│   ├── .env                # Environment variables
│   ├── server.js           # Main backend entry point
│   └── seeder.js           # Script to seed database
├── client-admin/           # Frontend - Admin/User Panel (React)
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── .env.local
│   └── tailwind.config.js
└── client-public/          # Frontend - Public Terminal (React)
└── ...
```

## 5. Setup and Installation

### Prerequisites
* Node.js (v18.x or later)
* npm (v9.x or later)
* MongoDB Atlas Account (or local MongoDB installation)
* Git

### Backend Setup (Server)
Located in the `server/` directory.

1.  **Navigate to directory:** `cd server`
2.  **Install dependencies:** `npm install`
3.  **Create `.env` file:** Create a file named `.env` in the `server/` root. Populate it with your specific configurations (see [Environment Variables](#7-environment-variables)).
    * **Crucial variables:** `MONGO_URI`, `JWT_SECRET`, `PORT`.

### Frontend Setup (Admin/User Panel & Public Terminal)
Repeat these steps for both `client-admin/` and `client-public/`.

1.  **Navigate to directory:** `cd client-admin` (or `cd client-public`)
2.  **Install dependencies:** `npm install`
3.  **Create `.env.local` file (optional):** To specify the backend API URL.
    ```env
    # client-admin/.env.local
    VITE_API_BASE_URL=http://localhost:5000/api
    ```

## 6. Running the Application

You will need **three separate terminal windows** open simultaneously.

1.  **Terminal 1: Start Backend Server**
    ```bash
    cd server
    npm run dev
    ```
    *Server will run on `http://localhost:5000` (or your specified port).*

2.  **Terminal 2: Start Admin Panel Frontend**
    ```bash
    cd client-admin
    npm run dev
    ```
    *App will run on `http://localhost:5173` (or the next available port).*

3.  **Terminal 3: Start Public Terminal Frontend**
    ```bash
    cd client-public
    npm run dev
    ```
    *App will run on `http://localhost:5174` (or the next available port).*

## 7. Environment Variables

### Server (`server/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Port the backend server will run on. | `5000` |
| `NODE_ENV` | Application environment. | `development` |
| `MONGO_URI`| Your full MongoDB connection string. | `mongodb+srv://user:pass@cluster.xyz.mongodb.net/abelExperienceDB`|
| `JWT_SECRET` | A long, random, secret key for signing tokens.| `a_very_long_random_and_secret_string_!@#$%` |
| `JWT_EXPIRE` | Expiration time for JWTs. | `30d` |

### Frontend (`client-*/.env.local`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | The base URL for your backend API. | `http://localhost:5000/api`|

## 8. Database Seeding

The `server/seeder.js` script populates the database with foundational "Base" data (Pokémon, Snoopys, Exercises, etc.) from JSON files in `server/data/`.

* **Import data:**
    ```bash
    # from server/ directory
    npm run data:import
    ```
* **Destroy data (from seeded collections):**
    ```bash
    # from server/ directory
    npm run data:destroy
    ```
**Note:** Ensure all required model files exist in `server/models/` before running the seeder.

## 9. API Endpoints Overview

* **Auth:** `/api/auth` (register, login, me)
* **Users:** `/api/users` (Admin management, profile updates)
* **Volumes:** `/api/admin/volumes` (Admin CRUD), `/api/volumes/public` (Public access)
* **Trackers:** `/api/habits`, `/api/books`, `/api/workouts`, `/api/tasks`, `/api/notes`
* **Shop/Gacha:** `/api/shop/pull/:category`
* **Base Data (Admin):** `/api/admin/base/*` (e.g., `/pokemon`, `/snoopys`)
* **User Collections:** `/api/me/collection/:type`

## 10. Database Models Overview

The application utilizes ~22 Mongoose models, categorized as:
* **Core:** `User`
* **Content:** `Volume`
* **Base Collectibles:** `PokemonBase`, `SnoopyArtBase`, `BadgeBase`, `TitleBase`, `YugiohCardBase`, `HabboRareBase`, `AbelPersonaBase`
* **User-Specific Instances:** `UserPokemon`, `UserSnoopyArt`, `UserBadge`, `UserTitle`, `UserYugiohCard`, `UserHabboRare`
* **Trackers:** `Habit`, `Task`, `Book`, `MediaItem`, `Note`
* **Workout:** `ExerciseDefinition`, `WorkoutLog`

## 11. Current Development Status

The project is currently in the **Backend Development** phase. Key accomplishments include:
* Full backend setup with Node.js/Express and MongoDB connection.
* Complete authentication system with JWTs and role-based access control.
* Fully defined Mongoose schemas for all planned features.
* Functional APIs for core trackers (Habits, Books, Workouts) with currency/XP reward systems.
* Functional API for the Gacha/Shop collectible acquisition system.
* A seeder script for populating foundational "Base" data.
* The project is now transitioning to **Frontend Development**, starting with the Admin/User Panel (`client-admin`).

## 12. Post-MVP Vision

* Full "Paste and Parse" for volume creation.
* Social features: Public user profiles, comments on volumes, friend system.
* Advanced trackers and system configuration panels.
* Integration with external APIs like **Spotify**, **Plaid**, and **Sports APIs**.
* In-app notification system and advanced gamification mechanics.
