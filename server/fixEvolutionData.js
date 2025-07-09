// server/fixEvolutionData.js
const fs = require("fs");

// Evolution data mapping - contains the evolution chains for Gen 1-6
const EVOLUTION_DATA = {
  // Gen 1 Starters
  1: { stage: 1, evolvesTo: [{ id: 2, method: "level-up", detail: 16 }] }, // Bulbasaur
  2: { stage: 2, evolvesTo: [{ id: 3, method: "level-up", detail: 32 }] }, // Ivysaur
  3: { stage: 3, evolvesTo: [] }, // Venusaur

  4: { stage: 1, evolvesTo: [{ id: 5, method: "level-up", detail: 16 }] }, // Charmander
  5: { stage: 2, evolvesTo: [{ id: 6, method: "level-up", detail: 36 }] }, // Charmeleon
  6: { stage: 3, evolvesTo: [] }, // Charizard

  7: { stage: 1, evolvesTo: [{ id: 8, method: "level-up", detail: 16 }] }, // Squirtle
  8: { stage: 2, evolvesTo: [{ id: 9, method: "level-up", detail: 36 }] }, // Wartortle
  9: { stage: 3, evolvesTo: [] }, // Blastoise

  // Gen 1 Other Common Evolution Lines
  10: { stage: 1, evolvesTo: [{ id: 11, method: "level-up", detail: 7 }] }, // Caterpie
  11: { stage: 2, evolvesTo: [{ id: 12, method: "level-up", detail: 10 }] }, // Metapod
  12: { stage: 3, evolvesTo: [] }, // Butterfree

  13: { stage: 1, evolvesTo: [{ id: 14, method: "level-up", detail: 7 }] }, // Weedle
  14: { stage: 2, evolvesTo: [{ id: 15, method: "level-up", detail: 10 }] }, // Kakuna
  15: { stage: 3, evolvesTo: [] }, // Beedrill

  16: { stage: 1, evolvesTo: [{ id: 17, method: "level-up", detail: 18 }] }, // Pidgey
  17: { stage: 2, evolvesTo: [{ id: 18, method: "level-up", detail: 36 }] }, // Pidgeotto
  18: { stage: 3, evolvesTo: [] }, // Pidgeot

  19: { stage: 1, evolvesTo: [{ id: 20, method: "level-up", detail: 20 }] }, // Rattata
  20: { stage: 2, evolvesTo: [] }, // Raticate

  21: { stage: 1, evolvesTo: [{ id: 22, method: "level-up", detail: 20 }] }, // Spearow
  22: { stage: 2, evolvesTo: [] }, // Fearow

  23: { stage: 1, evolvesTo: [{ id: 24, method: "level-up", detail: 22 }] }, // Ekans
  24: { stage: 2, evolvesTo: [] }, // Arbok

  25: { stage: 1, evolvesTo: [{ id: 26, method: "use-item", detail: "thunder-stone" }] }, // Pikachu
  26: { stage: 2, evolvesTo: [] }, // Raichu

  27: { stage: 1, evolvesTo: [{ id: 28, method: "level-up", detail: 22 }] }, // Sandshrew
  28: { stage: 2, evolvesTo: [] }, // Sandslash

  29: { stage: 1, evolvesTo: [{ id: 30, method: "level-up", detail: 16 }] }, // Nidoran♀
  30: { stage: 2, evolvesTo: [{ id: 31, method: "use-item", detail: "moon-stone" }] }, // Nidorina
  31: { stage: 3, evolvesTo: [] }, // Nidoqueen

  32: { stage: 1, evolvesTo: [{ id: 33, method: "level-up", detail: 16 }] }, // Nidoran♂
  33: { stage: 2, evolvesTo: [{ id: 34, method: "use-item", detail: "moon-stone" }] }, // Nidorino
  34: { stage: 3, evolvesTo: [] }, // Nidoking

  35: { stage: 1, evolvesTo: [{ id: 36, method: "use-item", detail: "moon-stone" }] }, // Clefairy
  36: { stage: 2, evolvesTo: [] }, // Clefable

  37: { stage: 1, evolvesTo: [{ id: 38, method: "use-item", detail: "fire-stone" }] }, // Vulpix
  38: { stage: 2, evolvesTo: [] }, // Ninetales

  39: { stage: 1, evolvesTo: [{ id: 40, method: "use-item", detail: "moon-stone" }] }, // Jigglypuff
  40: { stage: 2, evolvesTo: [] }, // Wigglytuff

  41: { stage: 1, evolvesTo: [{ id: 42, method: "level-up", detail: 22 }] }, // Zubat
  42: { stage: 2, evolvesTo: [{ id: 169, method: "level-up-high-friendship", detail: "friendship" }] }, // Golbat -> Crobat

  43: { stage: 1, evolvesTo: [{ id: 44, method: "level-up", detail: 21 }] }, // Oddish
  44: { stage: 2, evolvesTo: [{ id: 45, method: "use-item", detail: "leaf-stone" }] }, // Gloom
  45: { stage: 3, evolvesTo: [] }, // Vileplume

  46: { stage: 1, evolvesTo: [{ id: 47, method: "level-up", detail: 24 }] }, // Paras
  47: { stage: 2, evolvesTo: [] }, // Parasect

  48: { stage: 1, evolvesTo: [{ id: 49, method: "level-up", detail: 31 }] }, // Venonat
  49: { stage: 2, evolvesTo: [] }, // Venomoth

  50: { stage: 1, evolvesTo: [{ id: 51, method: "level-up", detail: 26 }] }, // Diglett
  51: { stage: 2, evolvesTo: [] }, // Dugtrio

  52: { stage: 1, evolvesTo: [{ id: 53, method: "level-up", detail: 28 }] }, // Meowth
  53: { stage: 2, evolvesTo: [] }, // Persian

  54: { stage: 1, evolvesTo: [{ id: 55, method: "level-up", detail: 33 }] }, // Psyduck
  55: { stage: 2, evolvesTo: [] }, // Golduck

  56: { stage: 1, evolvesTo: [{ id: 57, method: "level-up", detail: 28 }] }, // Mankey
  57: { stage: 2, evolvesTo: [] }, // Primeape

  58: { stage: 1, evolvesTo: [{ id: 59, method: "use-item", detail: "fire-stone" }] }, // Growlithe
  59: { stage: 2, evolvesTo: [] }, // Arcanine

  60: { stage: 1, evolvesTo: [{ id: 61, method: "level-up", detail: 25 }] }, // Poliwag
  61: { stage: 2, evolvesTo: [{ id: 62, method: "use-item", detail: "water-stone" }] }, // Poliwhirl
  62: { stage: 3, evolvesTo: [] }, // Poliwrath

  63: { stage: 1, evolvesTo: [{ id: 64, method: "level-up", detail: 16 }] }, // Abra
  64: { stage: 2, evolvesTo: [{ id: 65, method: "trade", detail: "trade" }] }, // Kadabra
  65: { stage: 3, evolvesTo: [] }, // Alakazam

  66: { stage: 1, evolvesTo: [{ id: 67, method: "level-up", detail: 28 }] }, // Machop
  67: { stage: 2, evolvesTo: [{ id: 68, method: "trade", detail: "trade" }] }, // Machoke
  68: { stage: 3, evolvesTo: [] }, // Machamp

  69: { stage: 1, evolvesTo: [{ id: 70, method: "level-up", detail: 21 }] }, // Bellsprout
  70: { stage: 2, evolvesTo: [{ id: 71, method: "use-item", detail: "leaf-stone" }] }, // Weepinbell
  71: { stage: 3, evolvesTo: [] }, // Victreebel

  72: { stage: 1, evolvesTo: [{ id: 73, method: "level-up", detail: 30 }] }, // Tentacool
  73: { stage: 2, evolvesTo: [] }, // Tentacruel

  74: { stage: 1, evolvesTo: [{ id: 75, method: "level-up", detail: 25 }] }, // Geodude
  75: { stage: 2, evolvesTo: [{ id: 76, method: "trade", detail: "trade" }] }, // Graveler
  76: { stage: 3, evolvesTo: [] }, // Golem

  77: { stage: 1, evolvesTo: [{ id: 78, method: "level-up", detail: 40 }] }, // Ponyta
  78: { stage: 2, evolvesTo: [] }, // Rapidash

  79: { stage: 1, evolvesTo: [{ id: 80, method: "level-up", detail: 37 }] }, // Slowpoke
  80: { stage: 2, evolvesTo: [] }, // Slowbro

  81: { stage: 1, evolvesTo: [{ id: 82, method: "level-up", detail: 30 }] }, // Magnemite
  82: { stage: 2, evolvesTo: [{ id: 462, method: "level-up", detail: "special-location" }] }, // Magnezone (Gen 4)

  84: { stage: 1, evolvesTo: [{ id: 85, method: "level-up", detail: 31 }] }, // Doduo
  85: { stage: 2, evolvesTo: [] }, // Dodrio

  86: { stage: 1, evolvesTo: [{ id: 87, method: "level-up", detail: 34 }] }, // Seel
  87: { stage: 2, evolvesTo: [] }, // Dewgong

  88: { stage: 1, evolvesTo: [{ id: 89, method: "level-up", detail: 38 }] }, // Grimer
  89: { stage: 2, evolvesTo: [] }, // Muk

  90: { stage: 1, evolvesTo: [{ id: 91, method: "use-item", detail: "water-stone" }] }, // Shellder
  91: { stage: 2, evolvesTo: [] }, // Cloyster

  92: { stage: 1, evolvesTo: [{ id: 93, method: "level-up", detail: 25 }] }, // Gastly
  93: { stage: 2, evolvesTo: [{ id: 94, method: "trade", detail: "trade" }] }, // Haunter
  94: { stage: 3, evolvesTo: [] }, // Gengar

  95: { stage: 1, evolvesTo: [{ id: 208, method: "trade", detail: "trade-with-metal-coat" }] }, // Onix -> Steelix

  96: { stage: 1, evolvesTo: [{ id: 97, method: "level-up", detail: 26 }] }, // Drowzee
  97: { stage: 2, evolvesTo: [] }, // Hypno

  98: { stage: 1, evolvesTo: [{ id: 99, method: "level-up", detail: 28 }] }, // Krabby
  99: { stage: 2, evolvesTo: [] }, // Kingler

  100: { stage: 1, evolvesTo: [{ id: 101, method: "level-up", detail: 30 }] }, // Voltorb
  101: { stage: 2, evolvesTo: [] }, // Electrode

  102: { stage: 1, evolvesTo: [{ id: 103, method: "use-item", detail: "leaf-stone" }] }, // Exeggcute
  103: { stage: 2, evolvesTo: [] }, // Exeggutor

  104: { stage: 1, evolvesTo: [{ id: 105, method: "level-up", detail: 28 }] }, // Cubone
  105: { stage: 2, evolvesTo: [] }, // Marowak

  108: { stage: 1, evolvesTo: [{ id: 463, method: "level-up", detail: "knows-rollout" }] }, // Lickitung -> Lickilicky

  109: { stage: 1, evolvesTo: [{ id: 110, method: "level-up", detail: 35 }] }, // Koffing
  110: { stage: 2, evolvesTo: [] }, // Weezing

  111: { stage: 1, evolvesTo: [{ id: 112, method: "level-up", detail: 42 }] }, // Rhyhorn
  112: { stage: 2, evolvesTo: [{ id: 464, method: "trade", detail: "trade-with-protector" }] }, // Rhydon -> Rhyperior

  113: { stage: 1, evolvesTo: [{ id: 242, method: "level-up-high-friendship", detail: "friendship" }] }, // Chansey -> Blissey

  114: { stage: 1, evolvesTo: [{ id: 465, method: "level-up", detail: "knows-ancient-power" }] }, // Tangela -> Tangrowth

  116: { stage: 1, evolvesTo: [{ id: 117, method: "level-up", detail: 32 }] }, // Horsea
  117: { stage: 2, evolvesTo: [{ id: 230, method: "trade", detail: "trade-with-dragon-scale" }] }, // Seadra -> Kingdra

  118: { stage: 1, evolvesTo: [{ id: 119, method: "level-up", detail: 33 }] }, // Goldeen
  119: { stage: 2, evolvesTo: [] }, // Seaking

  120: { stage: 1, evolvesTo: [{ id: 121, method: "use-item", detail: "water-stone" }] }, // Staryu
  121: { stage: 2, evolvesTo: [] }, // Starmie

  123: { stage: 1, evolvesTo: [{ id: 212, method: "trade", detail: "trade-with-metal-coat" }] }, // Scyther -> Scizor

  124: { stage: 1, evolvesTo: [{ id: 238, method: "level-up", detail: 30 }] }, // Jynx (baby: Smoochum)

  125: { stage: 1, evolvesTo: [{ id: 466, method: "trade", detail: "trade-with-electirizer" }] }, // Electabuzz -> Electivire

  126: { stage: 1, evolvesTo: [{ id: 467, method: "trade", detail: "trade-with-magmarizer" }] }, // Magmar -> Magmortar

  129: { stage: 1, evolvesTo: [{ id: 130, method: "level-up", detail: 20 }] }, // Magikarp
  130: { stage: 2, evolvesTo: [] }, // Gyarados

  133: {
    stage: 1,
    evolvesTo: [
      { id: 134, method: "use-item", detail: "water-stone" }, // Vaporeon
      { id: 135, method: "use-item", detail: "thunder-stone" }, // Jolteon
      { id: 136, method: "use-item", detail: "fire-stone" }, // Flareon
      { id: 196, method: "level-up-high-friendship", detail: "friendship-day" }, // Espeon
      { id: 197, method: "level-up-high-friendship", detail: "friendship-night" }, // Umbreon
      { id: 470, method: "level-up", detail: "near-moss-rock" }, // Leafeon
      { id: 471, method: "level-up", detail: "near-ice-rock" }, // Glaceon
    ],
  }, // Eevee

  138: { stage: 1, evolvesTo: [{ id: 139, method: "level-up", detail: 40 }] }, // Omanyte
  139: { stage: 2, evolvesTo: [] }, // Omastar

  140: { stage: 1, evolvesTo: [{ id: 141, method: "level-up", detail: 40 }] }, // Kabuto
  141: { stage: 2, evolvesTo: [] }, // Kabutops

  147: { stage: 1, evolvesTo: [{ id: 148, method: "level-up", detail: 30 }] }, // Dratini
  148: { stage: 2, evolvesTo: [{ id: 149, method: "level-up", detail: 55 }] }, // Dragonair
  149: { stage: 3, evolvesTo: [] }, // Dragonite

  // Legendaries and mythicals (stage 1, no evolution)
  144: { stage: 1, evolvesTo: [] }, // Articuno
  145: { stage: 1, evolvesTo: [] }, // Zapdos
  146: { stage: 1, evolvesTo: [] }, // Moltres
  150: { stage: 1, evolvesTo: [] }, // Mewtwo
  151: { stage: 1, evolvesTo: [] }, // Mew

  // Gen 2 Starters
  152: { stage: 1, evolvesTo: [{ id: 153, method: "level-up", detail: 16 }] }, // Chikorita
  153: { stage: 2, evolvesTo: [{ id: 154, method: "level-up", detail: 32 }] }, // Bayleef
  154: { stage: 3, evolvesTo: [] }, // Meganium

  155: { stage: 1, evolvesTo: [{ id: 156, method: "level-up", detail: 14 }] }, // Cyndaquil
  156: { stage: 2, evolvesTo: [{ id: 157, method: "level-up", detail: 36 }] }, // Quilava
  157: { stage: 3, evolvesTo: [] }, // Typhlosion

  158: { stage: 1, evolvesTo: [{ id: 159, method: "level-up", detail: 18 }] }, // Totodile
  159: { stage: 2, evolvesTo: [{ id: 160, method: "level-up", detail: 30 }] }, // Croconaw
  160: { stage: 3, evolvesTo: [] }, // Feraligatr
};

/**
 * Gets evolution stage and paths for a Pokémon species ID
 */
function getEvolutionData(speciesId) {
  const data = EVOLUTION_DATA[speciesId];
  if (data) {
    return {
      evolutionStage: data.stage,
      evolutionPaths: data.evolvesTo.map((evo) => ({
        toSpeciesId: evo.id,
        method: evo.method,
        detail: evo.detail,
      })),
    };
  }

  // Default for unknown Pokémon - assume stage 1, no evolution
  return {
    evolutionStage: 1,
    evolutionPaths: [],
  };
}

/**
 * Main function to fix the evolution data in pokemon_db_local.json
 */
function fixEvolutionData() {
  const inputFile = "./data/pokemon_db_local.json";
  const outputFile = "./data/pokemon_db_local_fixed.json";

  console.log("Reading Pokemon data...");
  const pokemonData = JSON.parse(fs.readFileSync(inputFile, "utf-8"));

  console.log(`Processing ${pokemonData.length} Pokemon...`);

  const fixedData = pokemonData.map((pokemon) => {
    const evolutionData = getEvolutionData(pokemon.speciesId);

    return {
      ...pokemon,
      evolutionStage: evolutionData.evolutionStage,
      evolutionPaths: evolutionData.evolutionPaths,
    };
  });

  console.log("Writing fixed data...");
  fs.writeFileSync(outputFile, JSON.stringify(fixedData, null, 2), "utf-8");

  console.log(`✅ Fixed evolution data saved to ${outputFile}`);
  console.log(`📊 Statistics:`);

  const stages = { 1: 0, 2: 0, 3: 0 };
  let totalEvolutions = 0;

  fixedData.forEach((pokemon) => {
    stages[pokemon.evolutionStage]++;
    totalEvolutions += pokemon.evolutionPaths.length;
  });

  console.log(`   Stage 1 Pokemon: ${stages[1]}`);
  console.log(`   Stage 2 Pokemon: ${stages[2]}`);
  console.log(`   Stage 3 Pokemon: ${stages[3]}`);
  console.log(`   Total evolution paths: ${totalEvolutions}`);

  console.log(`\n🔄 To use the fixed data:`);
  console.log(`   1. Backup your current file: cp ${inputFile} ${inputFile}.backup`);
  console.log(`   2. Replace with fixed data: cp ${outputFile} ${inputFile}`);
  console.log(`   3. Run the seeder: node seeder.js -i`);
}

// Run the script
fixEvolutionData();
