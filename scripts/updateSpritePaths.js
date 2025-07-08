// scripts/updateSpritePaths.js
// Re-points spriteGen5Animated / spriteGen6Animated to local GIFs

const fs = require("fs");
const path = require("path");

const INPUT = path.resolve(__dirname, "../data/pokemon_db.json");
const OUTPUT = path.resolve(__dirname, "../data/pokemon_db_local.json");

// ---------- helper -------------
const toFileName = (name) =>
  `${name
    .toLowerCase()
    .replace(/[\s.']/g, "")
    .replace(/:/g, "")
    .replace(/\u2640|\u2642/g, "") /* remove gender symbols */
    .replace(/[^\w-]/g, "")}.gif`; // keeps hyphens for forms like deoxys-attack
// --------------------------------

const db = JSON.parse(fs.readFileSync(INPUT, "utf8"));

db.forEach((p) => {
  const fileName = toFileName(p.name);
  (p.forms || []).forEach((f) => {
    f.spriteGen5Animated = `/pokemon/gen5ani/${fileName}`;
    f.spriteGen6Animated = `/pokemon/gen6ani/${fileName}`;
  });
});

fs.writeFileSync(OUTPUT, JSON.stringify(db, null, 2));
console.log(`✅  Paths rewritten → ${OUTPUT}`);
