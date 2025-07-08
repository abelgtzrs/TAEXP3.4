const axios = require("axios");
const fs = require("fs");

const BASE_URL = "https://pokeapi.co/api/v2";

const GENERATIONS = [
  { gen: 1, range: [1, 151] },
  { gen: 2, range: [152, 251] },
  { gen: 3, range: [252, 386] },
  { gen: 4, range: [387, 493] },
  { gen: 5, range: [494, 649] },
  { gen: 6, range: [650, 721] },
];

async function getPokemonData(speciesId) {
  const pokemonUrl = `${BASE_URL}/pokemon/${speciesId}`;
  const speciesUrl = `${BASE_URL}/pokemon-species/${speciesId}`;

  const [pokemonRes, speciesRes] = await Promise.all([axios.get(pokemonUrl), axios.get(speciesUrl)]);

  const pokemon = pokemonRes.data;
  const species = speciesRes.data;

  const evolutionStage = species.evolves_from_species ? 2 : 1; // Simple: 1 if base, else 2+
  const isLegendary = species.is_legendary;
  const isMythical = species.is_mythical;

  const baseTypes = pokemon.types.map((t) => t.type.name);

  const descriptionEntry = species.flavor_text_entries.find((entry) => entry.language.name === "en");

  const form = {
    formName: "Normal",
    types: baseTypes,
    spriteGen5Animated: pokemon.sprites.versions["generation-v"]?.["black-white"]?.animated?.front_default || null,
    spriteGen6Animated: pokemon.sprites.versions["generation-vi"]?.["x-y"]?.front_default || null,
  };

  return {
    speciesId,
    name: pokemon.name,
    generation: getGeneration(speciesId),
    baseTypes,
    isLegendary,
    isMythical,
    isStarter: false, // You can manually mark starters later or use a lookup
    evolutionStage,
    description: descriptionEntry ? descriptionEntry.flavor_text.replace(/\f/g, " ").replace(/\n|\r/g, " ") : "",
    forms: [form],
    evolutionPaths: [], // We'll fill this in later
  };
}

function getGeneration(id) {
  for (let gen of GENERATIONS) {
    if (id >= gen.range[0] && id <= gen.range[1]) {
      return gen.gen;
    }
  }
  return null;
}

async function main() {
  const output = [];

  for (let gen of GENERATIONS) {
    for (let id = gen.range[0]; id <= gen.range[1]; id++) {
      console.log(`Fetching #${id}`);
      const data = await getPokemonData(id);
      output.push(data);
    }
  }

  fs.writeFileSync("pokemon_db.json", JSON.stringify(output, null, 2));
}

main();
