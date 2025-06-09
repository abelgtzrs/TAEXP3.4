// server/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // To fetch user details from DB

// Protect routes
const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (e.g., "Bearer eyJhbGciOiJIUzI1NiIsIn...")
      token = req.headers.authorization.split(" ")[1]; // Split "Bearer" and the token

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token's payload (we stored user id as 'id' in the token)
      // and attach it to the request object, excluding the password.
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        // This case might happen if the user was deleted after the token was issued
        return res
          .status(401)
          .json({ success: false, message: "Not authorized, user not found" });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error("Token verification error:", error.message);
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }
};

// Middleware to authorize based on roles
const authorize = (...roles) => {
  // Takes an array of roles (e.g., 'admin', 'special_user')
  return (req, res, next) => {
    // req.user should be set by the 'protect' middleware before this runs
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "User role not found, authorization denied",
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        // 403 Forbidden
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }3+
    next(); // Role is authorized, proceed
  };
};

module.exports = { protect, authorize };
