const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./.env" }); // Make sure it finds your .env file

// Load models
const YugiohCardBase = require("./models/YugiohCardBase");

// Connect to DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for Yu-Gi-Oh! Seeder...");
  } catch (err) {
    console.error("Seeder DB Connection Error:", err);
    process.exit(1);
  }
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const transformYugiohData = (rawData) => {
  return rawData.map((card) => ({
    name: card.name,
    description: card.description,
    imageUrl: card.image,
    atk: card.attack,
    def: card.defense,
    level: card.level,
    type: card.type,
    attribute: card.attribute,
    race: card.typing,
    systemRarity: card.rarity,
  }));
};

const importYugiohData = async () => {
  try {
    console.log("Reading local Yu-Gi-Oh! JSON file...");
    const rawYugiohData = JSON.parse(fs.readFileSync(`${__dirname}/data/yugioh_cards.json`, "utf-8"));

    console.log("Transforming data to match schema...");
    const transformedData = transformYugiohData(rawYugiohData);

    console.log("Deleting existing Yu-Gi-Oh! card data...");
    await YugiohCardBase.deleteMany();

    console.log("Importing new transformed Yu-Gi-Oh! card data...");
    await YugiohCardBase.create(transformedData);

    console.log("Yu-Gi-Oh! Card Data Imported Successfully!");
  } catch (err) {
    console.error("Error during Yu-Gi-Oh! data import:", err);
  }
};

const deleteYugiohData = async () => {
  try {
    await YugiohCardBase.deleteMany();
    console.log("Yu-Gi-Oh! Card Data Destroyed!");
  } catch (err) {
    console.error(err);
  }
};

const run = async () => {
  await connectDB();

  if (process.argv[2] === "-i") {
    await importYugiohData();
  } else if (process.argv[2] === "-d") {
    await deleteYugiohData();
  } else {
    console.log("Please use -i to import data or -d to delete data.");
  }

  await mongoose.disconnect();
  console.log("MongoDB Disconnected.");
};

run();
