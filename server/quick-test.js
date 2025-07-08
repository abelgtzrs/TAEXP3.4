const PokedexModule = require("pokedex-promise-v2");
const Pokedex = PokedexModule.default || PokedexModule; // 👈 handles both cases

const P = new Pokedex();

(async () => {
  const pikachu = await P.getPokemonByName("pikachu");
  console.log(pikachu.name);
})();
