const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load env vars
dotenv.config();

// Load the AbelPersonaBase model
const AbelPersonaBase = require("./models/AbelPersonaBase");

// Database Connection Function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for Abel Persona Seeder...");
  } catch (err) {
    console.error("Abel Persona Seeder DB Connection Error:", err);
    process.exit(1);
  }
};

/**
 * Transforms the raw Abel Persona data from JSON file into our schema format.
 * @param {Array<object>} rawData - The array of Abel personas from the JSON file.
 * @returns {Array<object>} - The transformed data ready for MongoDB.
 */
const transformAbelPersonaData = (rawData) => {
  return rawData.map((persona) => {
    // Transform the data to match the actual schema structure
    return {
      personaId: persona.personaId,
      name: persona.name,
      description: persona.description || "",
      rarity: persona.rarity || "common",
      colors: {
        bg: persona.colors.bg,
        surface: persona.colors.surface,
        primary: persona.colors.primary,
        secondary: persona.colors.secondary,
        tertiary: persona.colors.tertiary,
      },
      text: {
        main: persona.text.main,
        secondary: persona.text.secondary,
        tertiary: persona.text.tertiary,
      },
      font: persona.font || "Inter, sans-serif",
      iconUrlOrKey: persona.iconUrlOrKey || null,
    };
  });
};

/**
 * Main seeder function for Abel Personas
 */
const seedAbelPersonas = async () => {
  try {
    // Connect to database
    await connectDB();

    // Read the JSON file
    const rawData = JSON.parse(fs.readFileSync("./data/abelPersonaBase.json", "utf-8"));

    console.log(`Found ${rawData.length} Abel personas in JSON file...`);

    // Transform the data
    const transformedData = transformAbelPersonaData(rawData);

    // Clear existing data
    console.log("Clearing existing Abel personas...");
    await AbelPersonaBase.deleteMany({});

    // Insert new data
    console.log("Inserting new Abel personas...");
    await AbelPersonaBase.insertMany(transformedData);

    console.log(`✅ Successfully seeded ${transformedData.length} Abel personas!`);

    // Verify insertion
    const count = await AbelPersonaBase.countDocuments();
    console.log(`📊 Total Abel personas in database: ${count}`);

    // Display some sample data
    const samplePersonas = await AbelPersonaBase.find({}).limit(3);
    console.log("\n🔍 Sample personas:");
    samplePersonas.forEach((persona) => {
      console.log(`  - ${persona.name} (${persona.personaId}) - ${persona.rarity}`);
    });
  } catch (error) {
    console.error("❌ Error seeding Abel personas:", error);
    process.exit(1);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

// Handle command line arguments
if (process.argv.length > 2) {
  const command = process.argv[2];

  if (command === "--clear") {
    // Clear only Abel personas
    (async () => {
      await connectDB();
      await AbelPersonaBase.deleteMany({});
      console.log("✅ Cleared all Abel personas");
      await mongoose.connection.close();
    })();
  } else if (command === "--help") {
    console.log("Abel Persona Seeder Commands:");
    console.log("  node abelPersonaSeeder.js        - Seed all Abel personas");
    console.log("  node abelPersonaSeeder.js --clear - Clear all Abel personas");
    console.log("  node abelPersonaSeeder.js --help  - Show this help message");
  } else {
    console.log("Unknown command. Use --help for available commands.");
  }
} else {
  // Default: run the seeder
  seedAbelPersonas();
}
