import { useState, useEffect } from "react";
import api from "../services/api";
import PageHeader from "../components/ui/PageHeader";
import StyledInput from "../components/ui/StyledInput";
import PokemonCard from "../components/pokedex/PokemonCard";

const PokedexPage = () => {
  // State for the full list of Pokémon fetched from the API
  const [pokemonList, setPokemonList] = useState([]);
  // State for the filtered list that is actually displayed
  const [filteredList, setFilteredList] = useState([]);
  // State for the search term
  const [searchTerm, setSearchTerm] = useState("");
  // State for sprite generation preference
  const [useGen6Sprites, setUseGen6Sprites] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokedex = async () => {
      try {
        const response = await api.get("/pokemon/base");
        setPokemonList(response.data.data);
        setFilteredList(response.data.data);
      } catch (error) {
        console.error("Failed to fetch Pokédex data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPokedex();
  }, []);

  // This effect runs whenever the user types in the search box
  useEffect(() => {
    const results = pokemonList.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) || String(pokemon.speciesId).includes(searchTerm)
    );
    setFilteredList(results);
  }, [searchTerm, pokemonList]);

  if (loading) {
    return <div className="text-center text-text-secondary py-10">Loading Pokédex...</div>;
  }

  return (
    <div>
      <PageHeader
        title="Pokédex"
        subtitle={`A comprehensive list of all ${pokemonList.length} Pokémon available in the system.`}
      />
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <StyledInput
            type="text"
            placeholder="Search by name or number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary">Sprite Style:</span>
            <button
              onClick={() => setUseGen6Sprites(!useGen6Sprites)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                useGen6Sprites
                  ? "bg-primary text-white"
                  : "bg-surface border border-gray-600 text-text-secondary hover:text-white hover:border-primary"
              }`}
            >
              {useGen6Sprites ? "Gen 6 (Static)" : "Gen 5 (Animated)"}
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {filteredList.map((pokemon) => (
          <PokemonCard key={pokemon.speciesId} pokemon={pokemon} useGen6Sprites={useGen6Sprites} />
        ))}
      </div>
    </div>
  );
};

export default PokedexPage;
