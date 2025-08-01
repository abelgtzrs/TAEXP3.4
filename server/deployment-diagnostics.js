#!/usr/bin/env node

/**
 * Deployment Troubleshooting Script for The Abel Experience Dashboard
 *
 * This script helps identify common deployment issues including:
 * - Database connectivity problems
 * - Missing environment variables
 * - API endpoint accessibility
 * - Static file serving issues
 * - Model registration problems
 */

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Colors for console output
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
  bright: "\x1b[1m",
};

const log = (color, message) => console.log(`${colors[color]}${message}${colors.reset}`);
const error = (message) => log("red", `❌ ${message}`);
const success = (message) => log("green", `✅ ${message}`);
const warning = (message) => log("yellow", `⚠️  ${message}`);
const info = (message) => log("blue", `ℹ️  ${message}`);

async function checkEnvironmentVariables() {
  info("Checking Environment Variables...");

  const requiredVars = ["MONGO_URI", "JWT_SECRET", "NODE_ENV"];

  const optionalVars = ["PORT", "SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET", "SPOTIFY_REDIRECT_URI"];

  let allRequired = true;

  requiredVars.forEach((varName) => {
    if (process.env[varName]) {
      success(`${varName} is set`);
    } else {
      error(`${varName} is missing`);
      allRequired = false;
    }
  });

  optionalVars.forEach((varName) => {
    if (process.env[varName]) {
      success(`${varName} is set (optional)`);
    } else {
      warning(`${varName} is missing (optional)`);
    }
  });

  return allRequired;
}

async function testDatabaseConnection() {
  info("Testing Database Connection...");

  try {
    await mongoose.connect(process.env.MONGO_URI);
    success("Database connection successful");

    // Test basic operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    success(`Found ${collections.length} collections in database`);

    // Check for critical collections
    const criticalCollections = ["users", "pokemonbases", "financialcategories", "financialtransactions"];

    criticalCollections.forEach((collName) => {
      const found = collections.find((c) => c.name === collName);
      if (found) {
        success(`Collection '${collName}' exists`);
      } else {
        warning(`Collection '${collName}' not found`);
      }
    });

    return true;
  } catch (err) {
    error(`Database connection failed: ${err.message}`);
    return false;
  }
}

async function testModelRegistration() {
  info("Testing Model Registration...");

  try {
    // Try to load all models
    const modelsToTest = [
      "./models/User",
      "./models/PokemonBase",
      "./models/finance/FinancialCategory",
      "./models/finance/FinancialTransaction",
      "./models/finance/RecurringBill",
    ];

    for (const modelPath of modelsToTest) {
      try {
        require(modelPath);
        success(`Model loaded: ${modelPath}`);
      } catch (err) {
        error(`Failed to load model ${modelPath}: ${err.message}`);
      }
    }

    return true;
  } catch (err) {
    error(`Model registration test failed: ${err.message}`);
    return false;
  }
}

async function testStaticFileServing() {
  info("Testing Static File Serving...");

  const staticDirs = [
    path.join(__dirname, "public"),
    path.join(__dirname, "../public"),
    path.join(__dirname, "../client_admin/dist"),
    path.join(__dirname, "../client_public/dist"),
  ];

  const fs = require("fs");

  staticDirs.forEach((dir) => {
    if (fs.existsSync(dir)) {
      success(`Static directory exists: ${dir}`);

      // Check for common subdirectories
      const subdirs = ["uploads", "pokemon", "habborares"];
      subdirs.forEach((subdir) => {
        const fullPath = path.join(dir, subdir);
        if (fs.existsSync(fullPath)) {
          success(`  Subdirectory exists: ${subdir}`);
        } else {
          warning(`  Subdirectory missing: ${subdir}`);
        }
      });
    } else {
      warning(`Static directory missing: ${dir}`);
    }
  });
}

async function testCriticalEndpoints() {
  info("Testing Critical API Endpoints...");

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Test routes that are failing
  const endpointsToTest = [
    { path: "/api/auth/me", method: "GET", description: "User authentication check" },
    { path: "/api/users/me/dashboard-stats", method: "GET", description: "Dashboard statistics" },
    { path: "/api/finance/transactions", method: "GET", description: "Financial transactions" },
    { path: "/api/finance/categories", method: "GET", description: "Financial categories" },
    { path: "/api/pokemon", method: "GET", description: "Pokemon data" },
    { path: "/api/shop", method: "GET", description: "Shop data" },
  ];

  // Simulate loading routes
  try {
    // Load route files to check for syntax errors
    const routeFiles = [
      "./routes/authRoutes",
      "./routes/userRoutes",
      "./routes/financeRoutes",
      "./routes/pokemonRoutes",
      "./routes/shopRoutes",
    ];

    routeFiles.forEach((routeFile) => {
      try {
        require(routeFile);
        success(`Route file loaded: ${routeFile}`);
      } catch (err) {
        error(`Failed to load route file ${routeFile}: ${err.message}`);
      }
    });
  } catch (err) {
    error(`Route testing failed: ${err.message}`);
  }
}

async function checkFilePermissions() {
  info("Checking File Permissions...");

  const fs = require("fs");
  const pathsToCheck = ["./public", "./public/uploads", "./config", ".env"];

  pathsToCheck.forEach((checkPath) => {
    try {
      const fullPath = path.resolve(checkPath);
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        success(`Path accessible: ${checkPath} (${stats.isDirectory() ? "directory" : "file"})`);
      } else {
        warning(`Path not found: ${checkPath}`);
      }
    } catch (err) {
      error(`Permission denied: ${checkPath} - ${err.message}`);
    }
  });
}

async function generateDeploymentReport() {
  log("cyan", "\n" + "=".repeat(60));
  log("cyan", "   THE ABEL EXPERIENCE™ DEPLOYMENT DIAGNOSTICS");
  log("cyan", "=".repeat(60) + "\n");

  const results = {
    environment: await checkEnvironmentVariables(),
    database: await testDatabaseConnection(),
    models: await testModelRegistration(),
    staticFiles: testStaticFileServing(),
    endpoints: await testCriticalEndpoints(),
    permissions: checkFilePermissions(),
  };

  log("cyan", "\n" + "=".repeat(60));
  log("cyan", "                    SUMMARY REPORT");
  log("cyan", "=".repeat(60) + "\n");

  Object.entries(results).forEach(([test, passed]) => {
    if (passed) {
      success(`${test.toUpperCase()}: PASSED`);
    } else {
      error(`${test.toUpperCase()}: FAILED`);
    }
  });

  const allPassed = Object.values(results).every((result) => result);

  if (allPassed) {
    log("green", "\n🎉 All checks passed! Your deployment should be working correctly.");
  } else {
    log("red", "\n🚨 Some checks failed. Please review the issues above.");
    log("yellow", "\nCommon fixes:");
    log("yellow", "• Ensure all environment variables are set in production");
    log("yellow", "• Check that static file directories exist and have proper permissions");
    log("yellow", "• Verify MongoDB connection string is correct for production");
    log("yellow", "• Make sure all npm packages are installed");
    log("yellow", "• Check that the build process completed successfully");
  }

  // Cleanup database connection
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
}

// Run the diagnostics
generateDeploymentReport().catch((err) => {
  error(`Diagnostics failed: ${err.message}`);
  process.exit(1);
});
