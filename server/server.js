// Core server dependencies
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
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

// User-specific models (personal collections)
require("./models/userSpecific/userPokemon");
require("./models/userSpecific/userSnoopyArt");
require("./models/userSpecific/UserBadge");
require("./models/userSpecific/userTitle");
require("./models/userSpecific/userHabboRare");
require("./models/userSpecific/userYugiohCard");

// Initialize app and database connection
dotenv.config();
const app = express();
connectDB();

// Essential middleware stack
app.use(cors()); // Allow cross-origin requests from frontend
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse form data

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

// External integrations & additional features
app.use("/api/spotify", require("./routes/spotifyRoutes"));
app.use("/api/finance", require("./routes/financeRoutes"));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Welcome to the T43XP API!
The Abel Experience™ API is now operational.
Temporal Sync Initialized @ ${new Date().toLocaleTimeString()}
Listening on http://localhost:${PORT}
`);
});
