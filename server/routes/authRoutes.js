// server/routes/authRoutes.js
const express = require("express");
const router = express.Router();

// We will import controller functions here later
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/authController"); // We'll create this controller next

// We will import authentication middleware here later
// const { protect } = require('../middleware/authMiddleware');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post("/register", registerUser);

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
router.post("/login", loginUser);

// @desc    Get current logged-in user's data
// @route   GET /api/auth/me
// @access  Private (will need 'protect' middleware later)
// For now, let's make it public for easier initial testing, then add 'protect'
router.get("/me", /* protect, */ getMe); // Temporarily public

module.exports = router;
