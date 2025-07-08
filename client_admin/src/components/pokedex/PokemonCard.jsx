const PokemonCard = ({ pokemon, useGen6Sprites = false }) => {
  // Use the first form for the primary display
  const defaultForm = pokemon.forms[0];
  
  // Choose sprite based on the preference
  const spriteUrl = useGen6Sprites ? defaultForm.spriteGen6Animated : defaultForm.spriteGen5Animated;
  const typeColorMap = {
    Grass: "bg-green-500/20 text-green-300",
    Poison: "bg-purple-500/20 text-purple-300",
    Fire: "bg-red-500/20 text-red-300",
    Flying: "bg-sky-500/20 text-sky-300",
    Water: "bg-blue-500/20 text-blue-300",
    Bug: "bg-lime-500/20 text-lime-300",
    Normal: "bg-gray-500/20 text-gray-300",
    Electric: "bg-yellow-500/20 text-yellow-300",
    Ground: "bg-amber-700/30 text-amber-300",
    Fairy: "bg-pink-500/20 text-pink-300",
    Fighting: "bg-orange-500/20 text-orange-300",
    Psychic: "bg-pink-600/20 text-pink-400",
    Rock: "bg-stone-500/20 text-stone-300",
    Steel: "bg-slate-500/20 text-slate-300",
    Ice: "bg-cyan-500/20 text-cyan-300",
    Ghost: "bg-indigo-600/20 text-indigo-400",
    Dragon: "bg-violet-600/20 text-violet-400",
    Dark: "bg-zinc-700/30 text-zinc-300",
  };

  return (
    <div className="widget-container p-4 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-primary">
      <div className="w-24 h-24 mb-2 flex items-center justify-center">
        {/* Use the selected sprite generation */}
        <img src={spriteUrl} alt={pokemon.name} className="max-w-full max-h-full object-contain" />
      </div>
      <p className="text-xs text-text-secondary">No. {String(pokemon.speciesId).padStart(3, "0")}</p>
      <h3 className="text-lg font-bold text-text-main">{pokemon.name}</h3>
      <div className="flex gap-1 mt-2">
        {defaultForm.types.map((type) => (
          <span
            key={type}
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              typeColorMap[type] || "bg-gray-500/20 text-gray-300"
            }`}
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PokemonCard;
