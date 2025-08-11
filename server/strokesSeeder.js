const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const StrokesAlbum = require("./models/StrokesAlbum");
const StrokesSong = require("./models/StrokesSong");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for Strokes Seeder...");
  } catch (err) {
    console.error("Strokes Seeder DB Connection Error:", err);
    process.exit(1);
  }
};

const readJSON = (file) => JSON.parse(fs.readFileSync(path.join(__dirname, "data", file), "utf-8"));

const seedStrokes = async () => {
  try {
    await connectDB();

    // Albums input file should be an array of { name, year, coverImageUrl }
    const albums = readJSON("strokesAlbums.json");
    const songs = readJSON("strokesSongs.json");

    // Clear existing
    await StrokesSong.deleteMany({});
    await StrokesAlbum.deleteMany({});

    // Insert albums and build a map by album name
    const insertedAlbums = await StrokesAlbum.insertMany(albums);
    const albumMap = new Map(insertedAlbums.map((a) => [a.name, a._id]));

    // Transform songs: replace album name with album ObjectId
    const transformedSongs = songs.map((s) => ({
      title: s.title,
      album: albumMap.get(s.album) || null,
      lyrics: s.lyrics || [],
    }));

    // Validate missing albums
    const missing = transformedSongs.filter((s) => !s.album);
    if (missing.length) {
      console.warn(`Warning: ${missing.length} song(s) reference unknown album names. They will be skipped.`);
    }

    const validSongs = transformedSongs.filter((s) => s.album);
    await StrokesSong.insertMany(validSongs);

    console.log(`Seeded ${insertedAlbums.length} albums and ${validSongs.length} songs.`);
    await mongoose.disconnect();
    console.log("MongoDB Disconnected.");
  } catch (err) {
    console.error("Error seeding Strokes data:", err);
    process.exit(1);
  }
};

const clearStrokes = async () => {
  try {
    await connectDB();
    await StrokesSong.deleteMany({});
    await StrokesAlbum.deleteMany({});
    console.log("Cleared Strokes albums and songs.");
    await mongoose.disconnect();
    console.log("MongoDB Disconnected.");
  } catch (err) {
    console.error("Error clearing Strokes data:", err);
    process.exit(1);
  }
};

if (process.argv.includes("-i") || process.argv.includes("--import")) {
  seedStrokes();
} else if (process.argv.includes("-d") || process.argv.includes("--destroy") || process.argv.includes("--clear")) {
  clearStrokes();
} else {
  console.log("Strokes Seeder Usage:\n  node strokesSeeder.js -i        # import\n  node strokesSeeder.js -d        # destroy");
}
