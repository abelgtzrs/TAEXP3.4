// server/controllers/authController.js
const User = require("../models/User"); // Import the User model we created
// We'll need bcryptjs for comparing passwords during login
// const bcrypt = require('bcryptjs');
// We'll need jsonwebtoken for creating tokens
// const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  // Placeholder logic
  // In a real implementation:
  // 1. Destructure name, email, password, role from req.body
  // 2. Validate input (e.g., check if email already exists)
  // 3. Hash the password (this is handled by the pre-save hook in User.js)
  // 4. Create a new user using User.create()
  // 5. Generate a JWT token
  // 6. Send back user info and token
  console.log("Register User Request Body:", req.body); // Log the request body
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide email and password" });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Create user (password will be hashed by Mongoose pre-save hook)
    user = await User.create({
      email,
      password,
      role: role || "member", // Default to 'member' if role not provided
    });

    // For now, just send back the created user (without password)
    // Later, we'll generate and send a JWT token here
    const userResponse = { ...user.toObject() };
    delete userResponse.password; // Ensure password is not sent back

    res.status(201).json({
      success: true,
      message:
        "User registered successfully. Implement JWT token generation next.",
      data: userResponse,
      // token: generateToken(user._id) // Placeholder for token generation
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res
      .status(500)
      .json({
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
  // Placeholder logic
  // In a real implementation:
  // 1. Destructure email, password from req.body
  // 2. Validate input
  // 3. Find user by email (ensure to .select('+password') because it's hidden by default)
  // 4. If user exists, compare entered password with stored hashed password (using user.comparePassword())
  // 5. If passwords match, generate a JWT token
  // 6. Send back user info and token
  console.log("Login User Request Body:", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide email and password" });
  }

  try {
    // Find user by email and explicitly include the password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Invalid credentials (user not found)",
        });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password); // Using the method from UserSchema

    if (!isMatch) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Invalid credentials (password mismatch)",
        });
    }

    // For now, just send back the user (without password)
    // Later, we'll generate and send a JWT token here
    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message:
        "User logged in successfully. Implement JWT token generation next.",
      data: userResponse,
      // token: generateToken(user._id) // Placeholder for token generation
    });
  } catch (error) {
    console.error("Login Error:", error);
    res
      .status(500)
      .json({
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
  // Placeholder logic
  // In a real implementation (after JWT and 'protect' middleware):
  // 1. The 'protect' middleware will have already validated the token and attached the user object to req.user
  // 2. We can then just send back req.user
  // For now, since it's public and we don't have req.user from a token:
  // We could try to find a user by a query param for testing, but that's not secure.
  // Let's assume for now this endpoint will be secured later and just send a placeholder.
  // If you want to test it now, you'd need to pass an ID or something, or just fetch a known user.
  // Example: const user = await User.findById('someKnownUserId');
  // res.status(200).json({ success: true, data: user });

  // For now, let's simulate what it would do if 'protect' middleware was active
  // and had set req.user. This won't work until 'protect' is implemented.
  if (req.user) {
    // This will be undefined until 'protect' middleware is added
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } else {
    // If no req.user (because 'protect' isn't active or no token was sent/valid)
    // For initial testing, let's find the first user in the DB as a placeholder.
    // THIS IS NOT SECURE AND ONLY FOR INITIAL TESTING.
    try {
      const firstUser = await User.findOne().sort({ createdAt: 1 }); // Get the oldest user
      if (firstUser) {
        const userResponse = { ...firstUser.toObject() };
        delete userResponse.password;
        res.status(200).json({
          success: true,
          message: "Fetched first user for /me (DEV ONLY - SECURE THIS ROUTE!)",
          data: userResponse,
        });
      } else {
        res
          .status(404)
          .json({
            success: false,
            message: "No users found (DEV ONLY - SECURE THIS ROUTE!)",
          });
      }
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message:
            "Server error fetching user for /me (DEV ONLY - SECURE THIS ROUTE!)",
        });
    }
  }
};

// Helper function to generate JWT (we'll move this to a utils folder later)
// const generateToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRE || '30d',
//     });
// };

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
