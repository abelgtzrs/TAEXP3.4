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
    <div className="widget-container p-4 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-primary relative group">
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

      {/* Hover Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 bg-surface border border-gray-600 rounded-lg p-4 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-text-main">{pokemon.name}</h4>
            <div className="flex gap-1">
              {pokemon.isLegendary && (
                <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-0.5 rounded">Legendary</span>
              )}
              {pokemon.isMythical && (
                <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-0.5 rounded">Mythical</span>
              )}
              {pokemon.isStarter && (
                <span className="text-xs bg-green-600/20 text-green-400 px-2 py-0.5 rounded">Starter</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-text-secondary">Generation:</span>
              <span className="text-text-main ml-1">{pokemon.generation}</span>
            </div>
            <div>
              <span className="text-text-secondary">Evolution Stage:</span>
              <span className="text-text-main ml-1">{pokemon.evolutionStage}</span>
            </div>
          </div>

          {pokemon.evolutionPaths && pokemon.evolutionPaths.length > 0 && (
            <div>
              <span className="text-text-secondary text-xs">Evolves to:</span>
              <div className="text-xs text-text-main mt-1">
                {pokemon.evolutionPaths.map((evo, index) => (
                  <div key={index}>
                    #{evo.toSpeciesId} via {evo.method} {evo.detail && `(${evo.detail})`}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <span className="text-text-secondary text-xs">Description:</span>
            <p className="text-xs text-text-main mt-1 leading-relaxed">{pokemon.description}</p>
          </div>
        </div>

        {/* Arrow pointing down */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-600"></div>
      </div>
    </div>
  );
};

export default PokemonCard;
