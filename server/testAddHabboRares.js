const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables

const connectDB = require("./config/db");
const User = require("./models/User");
const HabboRareBase = require("./models/HabboRareBase");
const UserHabboRare = require("./models/userSpecific/userHabboRare");

const addTestHabboRaresToUser = async (username) => {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await connectDB();

    // Find user
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      console.log(`❌ User "${username}" not found!`);
      return;
    }
    console.log(`✅ Found user: ${user.username}`);

    // Get some test Habbo Rares
    const habboRares = await HabboRareBase.find().limit(3);
    if (habboRares.length === 0) {
      console.log("❌ No Habbo Rares found. Run the seeder first.");
      return;
    }
    console.log(`🎯 Found ${habboRares.length} Habbo Rares to add`);

    // Clear existing user habbo rares to avoid duplicates
    await UserHabboRare.deleteMany({ user: user._id });
    console.log("🧹 Cleared existing user Habbo Rares");

    // Create new UserHabboRare instances
    const userHabboRares = [];
    for (const habboRare of habboRares) {
      const userHabboRare = new UserHabboRare({
        user: user._id,
        habboRareBase: habboRare._id,
        obtainedAt: new Date(),
      });

      const saved = await userHabboRare.save();
      userHabboRares.push(saved._id);
      console.log(`✅ Added ${habboRare.name} to user collection`);
      console.log(`   Image URL: ${habboRare.imageUrl}`);
    }

    // Update user's habbo rares array (but don't require email validation)
    await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          habboRares: userHabboRares,
          displayedHabboRares: userHabboRares,
        },
      },
      {
        new: true,
        runValidators: false, // Skip validation to avoid email requirement
      }
    );

    console.log(`🎉 Successfully added ${userHabboRares.length} Habbo Rares to ${username}'s collection!`);

    // Test image URLs
    console.log("\n🔍 Testing image URLs:");
    for (const habboRare of habboRares) {
      const fullUrl = `http://localhost:5000/${habboRare.imageUrl}`;
      console.log(`   ${habboRare.name}: ${fullUrl}`);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB Disconnected");
  }
};

// Get username from command line
const username = process.argv[2];
if (!username) {
  console.log("Usage: node testAddHabboRares.js <username>");
  console.log("Example: node testAddHabboRares.js abel_prime");
  process.exit(1);
}

addTestHabboRaresToUser(username).catch(console.error);
