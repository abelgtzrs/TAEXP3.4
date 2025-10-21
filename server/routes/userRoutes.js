// server/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// --- Multer Configuration for file uploads ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the destination directory for uploads
    cb(null, "public/uploads/avatars/");
  },
  filename: function (req, file, cb) {
    // Create a unique filename to avoid conflicts
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, req.user.id + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Check both MIME type and file extension
    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    const allowedExtensions = /\.(jpg|jpeg|png|gif)$/i;

    if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpg, jpeg, png, gif) are allowed!"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});
// --- End Multer Configuration ---

const {
  getUserCollection,
  updateDisplayedItems,
  getDashboardStats,
  setActivePersona,
  updateProfilePicture, // <-- IMPORT NEW FUNCTION
  getStreakStatus,
  tickLoginStreak,
  updateProfileBio,
} = require("../controllers/userController");
const { getMe } = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Apply 'protect' middleware to all routes in this file
router.use(protect);

// Basic profile fetch for current user (mirrors /api/auth/me)
router.get("/me", getMe);

// --- ADD THIS NEW ROUTE for profile picture upload ---
router.put("/me/profile-picture", upload.single("profilePicture"), updateProfilePicture);

router.put("/me/profile/active-persona", setActivePersona);
router.put("/me/profile", updateProfileBio);

// Temporary route to unlock all personas for testing
router.post("/me/test/unlock-personas", async (req, res) => {
  try {
    const User = require("../models/User");
    const AbelPersonaBase = require("../models/AbelPersonaBase");

    // Get all personas
    const allPersonas = await AbelPersonaBase.find({});
    const personaIds = allPersonas.map((p) => p._id);

    // Update user to have all personas unlocked
    await User.findByIdAndUpdate(req.user.id, {
      unlockedAbelPersonas: personaIds,
    });

    res.json({ success: true, message: `Unlocked ${personaIds.length} personas for testing` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// It should be placed before any routes with URL parameters if possible, for clarity.
router.get("/me/dashboard-stats", getDashboardStats);

// Daily login streak helpers
router.get("/me/streak/status", getStreakStatus);
router.post("/me/streak/tick", tickLoginStreak);

// Existing routes
router.get("/me/collection/:type", getUserCollection);
router.put("/me/profile/display", updateDisplayedItems);

module.exports = router;
