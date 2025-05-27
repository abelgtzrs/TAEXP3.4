// server/seeder.js
const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
require("colors"); // Optional: for colored console output
// Load env vars
dotenv.config(); // Assumes .env is in the same directory or parent

// Load models
const User = require("./models/User"); // Needed if you seed users or for refs
const PokemonBase = require("./models/PokemonBase");
const SnoopyArtBase = require("./models/SnoopyArtBase");
const AbelPersonaBase = require("./models/AbelPersonaBase");
const ExerciseDefinition = require("./models/ExerciseDefinition");
const HabboRareBase = require("./models/HabboRareBase"); // Create this model file
const BadgeBase = require("./models/BadgeBase"); // Create this model file
const TitleBase = require("./models/TitleBase"); // Create this model file
const YugiohCardBase = require("./models/YugiohCardBase"); // Create this model file
// ... import other base models as you create them and their JSON files

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  // useNewUrlParser: true, // Not needed for Mongoose 6+
  // useUnifiedTopology: true
});

// Read JSON files
const pokemonBaseData = JSON.parse(
  fs.readFileSync(`${__dirname}/data/pokemonBase.json`, "utf-8")
);
const snoopyArtBaseData = JSON.parse(
  fs.readFileSync(`${__dirname}/data/snoopyArtBase.json`, "utf-8")
);
const abelPersonaBaseData = JSON.parse(
  fs.readFileSync(`${__dirname}/data/abelPersonaBase.json`, "utf-8")
);
const exerciseDefinitionData = JSON.parse(
  fs.readFileSync(`${__dirname}/data/exerciseDefinition.json`, "utf-8")
);
// const habboRareBaseData = JSON.parse(fs.readFileSync(`${__dirname}/data/habboRareBase.json`, 'utf-8'));
// const badgeBaseData = JSON.parse(fs.readFileSync(`${__dirname}/data/badgeBase.json`, 'utf-8'));
// const titleBaseData = JSON.parse(fs.readFileSync(`${__dirname}/data/titleBase.json`, 'utf-8'));
// const yugiohCardBaseData = JSON.parse(fs.readFileSync(`${__dirname}/data/yugiohCardBase.json`, 'utf-8'));
// ... load other JSON data files

// Import into DB
const importData = async () => {
  try {
    await PokemonBase.deleteMany(); // Clear existing data
    await PokemonBase.create(pokemonBaseData);

    await SnoopyArtBase.deleteMany();
    await SnoopyArtBase.create(snoopyArtBaseData);

    await AbelPersonaBase.deleteMany();
    await AbelPersonaBase.create(abelPersonaBaseData);

    await ExerciseDefinition.deleteMany();
    await ExerciseDefinition.create(exerciseDefinitionData);

    // await HabboRareBase.deleteMany();
    // await HabboRareBase.create(habboRareBaseData);

    // await BadgeBase.deleteMany();
    // await BadgeBase.create(badgeBaseData);

    // await TitleBase.deleteMany();
    // await TitleBase.create(titleBaseData);

    // await YugiohCardBase.deleteMany();
    // await YugiohCardBase.create(yugiohCardBaseData);

    // ... import other data

    console.log("Data Imported Successfully!".green.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await PokemonBase.deleteMany();
    await SnoopyArtBase.deleteMany();
    await AbelPersonaBase.deleteMany();
    await ExerciseDefinition.deleteMany();
    // await HabboRareBase.deleteMany();
    // await BadgeBase.deleteMany();
    // await TitleBase.deleteMany();
    // await YugiohCardBase.deleteMany();
    // ... delete other data

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

// Process command line arguments
// To run: node seeder -i (to import) or node seeder -d (to delete)
if (process.argv[2] === "-i") {
  // For colors in console (optional, install 'colors' package: npm i colors)
  // require('colors'); // Uncomment if you install and want to use colors
  importData();
} else if (process.argv[2] === "-d") {
  // require('colors'); // Uncomment if you install and want to use colors
  deleteData();
} else {
  console.log("Please use -i to import data or -d to delete data.");
  // console.log('Example: node seeder -i');
  process.exit();
}
