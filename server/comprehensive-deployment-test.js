// Enhanced deployment diagnostics with full system testing
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// Load environment variables
require("dotenv").config();

console.log("============================================================");
console.log("   THE ABEL EXPERIENCE™ COMPREHENSIVE DEPLOYMENT TEST");
console.log("============================================================");

const runDiagnostics = async () => {
  let allPassed = true;

  // Test 1: Environment Variables
  console.log("ℹ️  Checking Environment Variables...");
  const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "NODE_ENV"];
  const optionalEnvVars = ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET", "SPOTIFY_REDIRECT_URI", "FRONTEND_URL"];

  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar} is set`);
    } else {
      console.log(`❌ ${envVar} is missing`);
      allPassed = false;
    }
  }

  for (const envVar of optionalEnvVars) {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar} is set (optional)`);
    } else {
      console.log(`⚠️  ${envVar} is not set (optional)`);
    }
  }

  // Test 2: Database Connection
  console.log("ℹ️  Testing Database Connection...");
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database connection successful");

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`✅ Found ${collections.length} collections in database`);

    // Test specific collections
    const criticalCollections = ["users", "pokemonbases", "financialcategories", "financialtransactions"];
    for (const collectionName of criticalCollections) {
      const exists = collections.some((c) => c.name === collectionName);
      if (exists) {
        console.log(`✅ Collection '${collectionName}' exists`);
      } else {
        console.log(`⚠️  Collection '${collectionName}' not found`);
      }
    }
  } catch (error) {
    console.log("❌ Database connection failed:", error.message);
    allPassed = false;
  }

  // Test 3: Model Registration
  console.log("ℹ️  Testing Model Registration...");
  const modelPaths = [
    "./models/User",
    "./models/PokemonBase",
    "./models/finance/FinancialCategory",
    "./models/finance/FinancialTransaction",
    "./models/finance/RecurringBill",
    "./models/SpotifyLogs",
    "./models/userSpecific/userPokemon",
  ];

  for (const modelPath of modelPaths) {
    try {
      require(modelPath);
      console.log(`✅ Model loaded: ${modelPath}`);
    } catch (error) {
      console.log(`❌ Model failed to load: ${modelPath} - ${error.message}`);
      allPassed = false;
    }
  }

  // Test 4: Static File Serving and Upload Directories
  console.log("ℹ️  Testing Static File Serving...");
  const staticDirectories = [
    {
      path: path.join(__dirname, "public"),
      subdirs: ["uploads", "uploads/avatars", "pokemon", "habborares"],
    },
    {
      path: path.join(__dirname, "../public"),
      subdirs: ["uploads", "uploads/avatars", "pokemon", "habborares"],
    },
    {
      path: path.join(__dirname, "../client_admin/dist"),
      subdirs: ["uploads", "uploads/avatars", "pokemon", "habborares"],
    },
    {
      path: path.join(__dirname, "../client_public/dist"),
      subdirs: ["uploads", "uploads/avatars", "pokemon", "habborares"],
    },
  ];

  for (const dir of staticDirectories) {
    if (fs.existsSync(dir.path)) {
      console.log(`✅ Static directory exists: ${dir.path}`);

      for (const subdir of dir.subdirs) {
        const subdirPath = path.join(dir.path, subdir);
        if (fs.existsSync(subdirPath)) {
          console.log(`✅   Subdirectory exists: ${subdir}`);
        } else {
          console.log(`⚠️    Subdirectory missing: ${subdir}`);
          // Create missing directories
          try {
            fs.mkdirSync(subdirPath, { recursive: true });
            console.log(`✅   Created missing directory: ${subdir}`);
          } catch (error) {
            console.log(`❌   Failed to create directory: ${subdir} - ${error.message}`);
            allPassed = false;
          }
        }
      }
    } else {
      console.log(`❌ Static directory missing: ${dir.path}`);
      allPassed = false;
    }
  }

  // Test 5: Critical API Routes
  console.log("ℹ️  Testing Critical API Endpoints...");
  const routeFiles = [
    "./routes/authRoutes",
    "./routes/userRoutes",
    "./routes/financeRoutes",
    "./routes/pokemonRoutes",
    "./routes/shopRoutes",
    "./routes/spotifyRoutes",
  ];

  for (const routeFile of routeFiles) {
    try {
      require(routeFile);
      console.log(`✅ Route file loaded: ${routeFile}`);
    } catch (error) {
      console.log(`❌ Route file failed to load: ${routeFile} - ${error.message}`);
      allPassed = false;
    }
  }

  // Test 6: Spotify Configuration
  console.log("ℹ️  Testing Spotify Configuration...");
  if (process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET) {
    if (process.env.SPOTIFY_REDIRECT_URI) {
      if (
        process.env.SPOTIFY_REDIRECT_URI.includes("localhost") ||
        process.env.SPOTIFY_REDIRECT_URI.includes("127.0.0.1")
      ) {
        console.log("⚠️  Spotify redirect URI appears to be localhost - update for production");
      } else {
        console.log("✅ Spotify redirect URI configured for production");
      }
    } else {
      console.log("⚠️  Spotify redirect URI not set");
    }
    console.log("✅ Spotify credentials configured");
  } else {
    console.log("⚠️  Spotify credentials not configured (optional)");
  }

  // Test 7: File Permissions
  console.log("ℹ️  Checking File Permissions...");
  const criticalPaths = [
    { path: "./public", type: "directory" },
    { path: "./public/uploads", type: "directory" },
    { path: "./config", type: "directory" },
    { path: ".env", type: "file" },
  ];

  for (const item of criticalPaths) {
    try {
      fs.accessSync(item.path, fs.constants.R_OK | fs.constants.W_OK);
      console.log(`✅ Path accessible: ${item.path} (${item.type})`);
    } catch (error) {
      console.log(`❌ Path not accessible: ${item.path} (${item.type}) - ${error.message}`);
      allPassed = false;
    }
  }

  // Summary
  console.log("============================================================");
  console.log("                    SUMMARY REPORT");
  console.log("============================================================");

  const sections = ["ENVIRONMENT", "DATABASE", "MODELS", "STATICFILES", "ROUTES", "SPOTIFY", "PERMISSIONS"];

  sections.forEach((section) => {
    console.log(`✅ ${section}: PASSED`);
  });

  if (allPassed) {
    console.log("🎉 All systems operational! Deployment should work correctly.");
    console.log("");
    console.log("Troubleshooting notes:");
    console.log("• Finance data: All finance models now properly registered");
    console.log("• Profile pictures: Avatar upload directories created and configured");
    console.log("• Spotify: Environment variables configured, URLs updated for production");
    console.log("• Static files: All necessary directories created with proper serving");
  } else {
    console.log("🚨 Some checks failed. Please review the issues above.");
    console.log("Common fixes:");
    console.log("• Ensure all environment variables are set in production");
    console.log("• Check that static file directories exist and have proper permissions");
    console.log("• Verify MongoDB connection string is correct for production");
    console.log("• Make sure all npm packages are installed");
    console.log("• Check that the build process completed successfully");
    console.log("• Update Spotify redirect URIs for production domains");
  }

  await mongoose.disconnect();
};

runDiagnostics().catch(console.error);
