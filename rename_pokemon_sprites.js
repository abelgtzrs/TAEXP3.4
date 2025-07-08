// rename_pokemon_sprites.js
const fs = require("fs");
const path = require("path");

const folders = [
  path.join(__dirname, "public", "pokemon", "gen5ani"),
  path.join(__dirname, "public", "pokemon", "gen6ani"),
];

// Define any special cases you know must map differently
const specialCases = {
  "mr mime": "mrmime",
  "mime jr": "mimejr",
  "type: null": "typenull",
  "jangmo-o": "jangmoo",
  "hakamo-o": "hakamoo",
  "kommo-o": "kommoo",
  "tapu koko": "tapukoko",
  "tapu lele": "tapulele",
  "tapu bulu": "tapubulu",
  "tapu fini": "tapufini",
  // Add more if needed!
};

folders.forEach((folder) => {
  console.log(`\n📂 Checking folder: ${folder}`);
  fs.readdirSync(folder).forEach((file) => {
    const ext = path.extname(file);
    const base = path.basename(file, ext);

    // Skip if not GIF
    if (ext.toLowerCase() !== ".gif") return;

    // Make safe lower name
    let newName = base
      .toLowerCase()
      .replace(/[\s.']/g, "")
      .replace(/:/g, "")
      .replace(/_+/g, "-");

    // Apply special cases override if needed
    if (specialCases[newName]) {
      newName = specialCases[newName];
    }

    const oldPath = path.join(folder, file);
    const newPath = path.join(folder, `${newName}${ext}`);

    if (oldPath !== newPath) {
      fs.renameSync(oldPath, newPath);
      console.log(`✔️ ${file} → ${newName}${ext}`);
    }
  });
});

console.log("\n✅ All done! Filenames cleaned.");
