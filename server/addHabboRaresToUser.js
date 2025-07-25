const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load env vars
dotenv.config();

// Load models
const User = require("./models/User");
const HabboRareBase = require("./models/HabboRareBase");
const UserHabboRare = require("./models/userSpecific/userHabboRare");

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for Habbo Rare Test...");
  } catch (err) {
    console.error("DB Connection Error:", err);
    process.exit(1);
  }
};

const addHabboRaresToUser = async (username) => {
  try {
    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      console.log(`User "${username}" not found!`);
      return;
    }

    // Get some sample Habbo Rares from the base collection
    const habboRares = await HabboRareBase.find().limit(6);
    console.log(`Found ${habboRares.length} Habbo Rares in database`);

    // Create UserHabboRare instances for each one
    const userHabboRares = [];
    for (const habboRare of habboRares) {
      const userHabboRare = new UserHabboRare({
        user: user._id,
        habboRareBase: habboRare._id,
        obtainedAt: new Date(),
      });
      await userHabboRare.save();
      userHabboRares.push(userHabboRare._id);
      console.log(`✅ Added ${habboRare.name} to user collection`);
    }

    // Add them to the user's collection and displayed items
    user.habboRares = userHabboRares;
    user.displayedHabboRares = userHabboRares;
    await user.save();

    console.log(`🎉 Successfully added ${userHabboRares.length} Habbo Rares to ${username}'s collection!`);
  } catch (error) {
    console.error("Error adding Habbo Rares:", error);
  }
};

const run = async () => {
  await connectDB();

  const username = process.argv[2];
  if (!username) {
    console.log("Usage: node addHabboRaresToUser.js <username>");
    console.log("Example: node addHabboRaresToUser.js abelgtzrs");
    process.exit(1);
  }

  await addHabboRaresToUser(username);

  await mongoose.disconnect();
  console.log("🔌 MongoDB Disconnected.");
};

run().catch((err) => {
  console.error("💥 Fatal error:", err);
  process.exit(1);
});
