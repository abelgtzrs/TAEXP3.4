const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load env vars
dotenv.config();

// Load the HabboRareBase model
const HabboRareBase = require("./models/HabboRareBase");

// --- Database Connection Function ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for Habbo Rare Seeder...");
  } catch (err) {
    console.error("Seeder DB Connection Error:", err);
    process.exit(1);
  }
};

/**
 * Capitalizes the first letter of a string.
 * @param {string} s - The input string.
 * @returns {string}
 */
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Transforms the raw Habbo Rare data from JSON file into our schema format.
 * @param {Array<object>} rawData - The array of Habbo Rares from JSON file.
 * @returns {Array<object>} - The transformed data ready for MongoDB.
 */
const transformHabboRareData = (rawData) => {
  return rawData.map((item) => {
    return {
      habboRareId: item.habboRareId,
      name: item.name,
      description: item.description || "A rare item from the classic Habbo era.",
      imageUrl: item.imageUrl,
      rarityCategory: item.rarityCategory || "common_rare",
      originalYear: item.originalYear || "Classic",
      series: item.series || "General",
    };
  });
};

// --- Main Seeder Functions ---

const importHabboRares = async () => {
  try {
    console.log("Reading Habbo Rare data from JSON file...");

    // Read the Habbo Rare JSON file
    const rawHabboRareData = JSON.parse(fs.readFileSync(`${__dirname}/data/habboRaresBase.json`, "utf-8"));

    console.log(`Found ${rawHabboRareData.length} Habbo Rares in JSON file.`);

    // Transform the data to fit our schema
    const transformedData = transformHabboRareData(rawHabboRareData);

    // Clear existing Habbo Rare data and insert the new data
    console.log("Deleting existing Habbo Rare data...");
    await HabboRareBase.deleteMany();

    console.log("Importing new Habbo Rare data...");
    const createdRares = await HabboRareBase.create(transformedData);

    console.log(`✅ Successfully imported ${createdRares.length} Habbo Rares!`);

    // Show some sample data
    console.log("\n📋 Sample imported items:");
    createdRares.slice(0, 5).forEach((rare, index) => {
      console.log(`${index + 1}. ${rare.name} (${rare.rarityCategory}) - ${rare.series}`);
    });
  } catch (err) {
    console.error("❌ Error importing Habbo Rare data:", err);
    process.exit(1);
  }
};

const deleteHabboRares = async () => {
  try {
    const deletedCount = await HabboRareBase.countDocuments();
    await HabboRareBase.deleteMany();
    console.log(`🗑️ Deleted ${deletedCount} Habbo Rares from database!`);
  } catch (err) {
    console.error("❌ Error deleting Habbo Rare data:", err);
    process.exit(1);
  }
};

const showStats = async () => {
  try {
    const totalCount = await HabboRareBase.countDocuments();
    const rarityStats = await HabboRareBase.aggregate([
      {
        $group: {
          _id: "$rarityCategory",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const seriesStats = await HabboRareBase.aggregate([
      {
        $group: {
          _id: "$series",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    console.log(`\n📊 Habbo Rare Database Statistics:`);
    console.log(`Total Habbo Rares: ${totalCount}`);

    console.log(`\n🎯 Rarity Distribution:`);
    rarityStats.forEach((stat) => {
      console.log(`  ${stat._id}: ${stat.count}`);
    });

    console.log(`\n📚 Series Distribution:`);
    seriesStats.slice(0, 10).forEach((stat) => {
      console.log(`  ${stat._id}: ${stat.count}`);
    });
  } catch (err) {
    console.error("❌ Error getting stats:", err);
    process.exit(1);
  }
};

// --- Main Execution Flow ---
const run = async () => {
  await connectDB();

  const command = process.argv[2];

  switch (command) {
    case "-i":
    case "--import":
      await importHabboRares();
      break;
    case "-d":
    case "--delete":
      await deleteHabboRares();
      break;
    case "-s":
    case "--stats":
      await showStats();
      break;
    default:
      console.log(`
🏨 Habbo Rare Seeder Usage:

  -i, --import    Import Habbo Rares from JSON file
  -d, --delete    Delete all Habbo Rares from database
  -s, --stats     Show database statistics

Examples:
  node habboRareSeeder.js -i
  node habboRareSeeder.js --import
  node habboRareSeeder.js --stats
      `);
      break;
  }

  // Disconnect from the database when done
  await mongoose.disconnect();
  console.log("🔌 MongoDB Disconnected.");
};

// Handle process termination gracefully
process.on("SIGINT", async () => {
  console.log("\n🛑 Received SIGINT. Closing database connection...");
  await mongoose.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Received SIGTERM. Closing database connection...");
  await mongoose.disconnect();
  process.exit(0);
});

run().catch((err) => {
  console.error("💥 Fatal error:", err);
  process.exit(1);
});
