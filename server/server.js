// Core server dependencies
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Auth middleware for protected routes
const { protect, authorize } = require("./middleware/authMiddleware");

// Pre-load all models to ensure they're available when routes need them
// Base models (shared data)
require("./models/User");
require("./models/PokemonBase");
require("./models/SnoopyArtBase");
require("./models/BadgeBase");
require("./models/TitleBase");
require("./models/HabboRareBase");
require("./models/YugiohCardBase");
require("./models/AbelPersonaBase");
require("./models/ExerciseDefinition");
require("./models/SpotifyLogs");
require("./models/Volume");
require("./models/WorkoutTemplate");

// Finance models
require("./models/finance/FinancialCategory");
require("./models/finance/FinancialTransaction");
require("./models/finance/RecurringBill");
require("./models/finance/Budget");
require("./models/finance/Debt");
require("./models/finance/DebtAccount");
require("./models/finance/FinancialGoal");
require("./models/finance/FinancialActionLog");

// User-specific models (personal collections)
require("./models/userSpecific/userPokemon");
require("./models/userSpecific/userSnoopyArt");
require("./models/userSpecific/userBadge");
require("./models/userSpecific/userTitle");
require("./models/userSpecific/userHabboRare");
require("./models/userSpecific/userYugiohCard");

// Strokes models (music)
require("./models/StrokesAlbum");
require("./models/StrokesSong");

const strokesRoutes = require("./routes/strokesRoutes");
// Initialize app and database connection
dotenv.config();
const app = express();
connectDB();

// Essential middleware stack
const rawOrigins = process.env.CORS_ORIGIN || process.env.CORS_ORIGINS;
let allowedOrigins;
if (rawOrigins) {
  allowedOrigins = rawOrigins.split(",").map((o) => o.trim()).filter(Boolean);
} else {
  allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://taexp3-0.onrender.com", // API self
    "https://taexp-3-0.vercel.app", // Deployed frontend
  ];
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser or same-origin requests (like server-to-server without origin header)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions)); // Removed explicit app.options("*", ...) to avoid path-to-regexp v6 wildcard error under Express 5
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse form data

// --- Serve static files from multiple directories ---
// Profile pictures and user uploads
app.use("/uploads", express.static("public/uploads"));
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// General static assets
app.use(express.static("public")); // Serve uploaded files (avatars, etc.)
app.use(express.static(path.join(__dirname, "../public"))); // Serve public assets (habbo rares, pokemon, etc.)

// Serve built client applications
app.use(express.static(path.join(__dirname, "../client_admin/dist")));
app.use(express.static(path.join(__dirname, "../client_public/dist")));

// Health check endpoint
app.get("/", (req, res) => {
  res.send("The Abel Experience™ API is running...");
});

// API route configuration
// Auth & user management
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Activity tracking (habits, books, workouts)
app.use("/api/habits", require("./routes/habitRoutes"));
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/workouts", require("./routes/workoutLogRoutes"));
app.use("/api/exercises", require("./routes/exerciseDefinitionRoutes"));
app.use("/api/workout-templates", require("./routes/workoutTemplateRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

// Shop & collections system
app.use("/api/shop", require("./routes/shopRoutes"));
app.use("/api/pokemon", require("./routes/pokemonRoutes"));
app.use("/api/badges", require("./routes/badgeRoutes"));

// Public content & volumes
app.use("/api/public", require("./routes/publicRoutes"));

// Admin-only routes (protected with middleware)
app.use("/api/admin/volumes", require("./routes/volumeRoutes"));
app.use("/api/admin/workout-templates", require("./routes/workoutTemplateRoutes"));
app.use("/api/admin/exercises", protect, authorize("admin"), require("./routes/exerciseAdminRoutes"));
app.use("/api/admin/pokemon", protect, authorize("admin"), require("./routes/pokemonAdminRoutes"));
app.use("/api/admin/habbo-rares", require("./routes/habboRareAdminRoutes"));

// External integrations & additional features
app.use("/api/spotify", require("./routes/spotifyRoutes"));
app.use("/api/finance", require("./routes/financeRoutes"));
app.use("/api/strokes", strokesRoutes);

// Catch-all middleware: send back React's index.html file for client-side routing
app.use((req, res, next) => {
  // If the request is for an API route that doesn't exist, return 404
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ message: "API route not found" });
  }

  // For all other routes, serve the React app
  res.sendFile(path.join(__dirname, "../client_admin/dist/index.html"));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Welcome to the T43XP API!
The Abel Experience™ API is now operational.
Temporal Sync Initialized @ ${new Date().toLocaleTimeString()}
Listening on http://localhost:${PORT}
`);
});
