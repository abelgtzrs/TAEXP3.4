// server/controllers/authController.js
const User = require("../models/User"); // Import the User model we created
// We'll need bcryptjs for comparing passwords during login
// const bcrypt = require('bcryptjs');
// We'll need jsonwebtoken for creating tokens
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d", // Use || '30d' as a fallback
  });
};
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  console.log("Register User Request Body:", req.body);
  const { email, username, password, role } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide email and password" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    user = await User.create({
      email,
      username,
      password,
      role: role || "user",
    });

    const token = generateToken(user._id, user.role); // <--- GENERATE TOKEN

    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token, // <--- SEND TOKEN IN RESPONSE
      data: userResponse,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    // More specific error handling based on error type can be added
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error during registration",
      error: error.message,
    });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  console.log("Login User Request Body:", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" }); // Generic message
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" }); // Generic message
    }

    const token = generateToken(user._id, user.role); // <--- GENERATE TOKEN

    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      token, // <--- SEND TOKEN IN RESPONSE
      data: userResponse,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error during login",
      error: error.message,
    });
  }
};

// @desc    Get current logged-in user's data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  // This function will primarily work AFTER 'protect' middleware is implemented
  // 'protect' will add req.user from the validated token.
  if (req.user) {
    // req.user will be set by the 'protect' middleware
    // Fetch fresh user data to ensure it's up-to-date, excluding password
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("GetMe Error:", error);
      res
        .status(500)
        .json({ success: false, message: "Server Error fetching user data" });
    }
  } else {
    // This case should ideally not be hit if 'protect' middleware is correctly applied.
    // If 'protect' is NOT YET active on the route, this path will be taken.
    // Keeping the insecure dev fallback for now, but it should be removed once 'protect' is in.
    try {
      const firstUser = await User.findOne()
        .sort({ createdAt: 1 })
        .select("-password");
      if (firstUser) {
        res.status(200).json({
          success: true,
          message:
            "Fetched first user (DEV ONLY - SECURE THIS /me ROUTE WITH PROTECT MIDDLEWARE!)",
          data: firstUser,
        });
      } else {
        res
          .status(404)
          .json({ success: false, message: "No users found (DEV ONLY)" });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error fetching user for /me (DEV ONLY)",
      });
    }
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};

// Explanation:

// const User = require('../models/User');: Imports the User model so we can interact with the users collection in MongoDB.
// async (req, res, next) => {...}: These are asynchronous controller functions.
// async: Allows us to use await inside the function for asynchronous operations (like database queries).
// req: The request object. req.body will contain data sent in the request body (e.g., email and password for registration).
// res: The response object, used to send a response back to the client (e.g., success message, user data, or an error).
// next: A function to pass control to the next middleware function. Used mainly for error handling or custom middleware chains.
// registerUser:
// Takes email, password, role from req.body.
// Checks if a user with that email already exists.
// If not, it creates a new user using User.create(). The password hashing is handled by the pre('save') hook in your User.js model.
// Sends a success response. (Later, it will also send a JWT token).
// loginUser:
// Takes email, password from req.body.
// Finds the user by email using User.findOne({ email }).select('+password');. We need .select('+password') because we set select: false for the password field in the UserSchema.
// If the user is found, it compares the provided password with the stored hashed password using the user.comparePassword(password) method we defined in User.js.
// Sends a success response if credentials are valid. (Later, it will also send a JWT token).
// getMe:
// This route is intended to be private and return the data of the currently authenticated user (based on their JWT).
// For now, since we haven't implemented the protect middleware (which would verify the token and add req.user), I've added a temporary, insecure way to fetch the first user for basic testing. This must be secured with protect middleware later.
// module.exports: Exports these controller functions.
