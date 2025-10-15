import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // <-- Import Link
import api from "../services/api";
import PageHeader from "../components/ui/PageHeader";
import StyledInput from "../components/ui/StyledInput";
import PokemonCard from "../components/pokedex/PokemonCard";

const PokedexPage = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [useGen6Sprites, setUseGen6Sprites] = useState(false);

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
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <StyledInput
          type="text"
          placeholder="Search by name or number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">Sprites:</span>
          <div
            className="inline-flex rounded-lg border overflow-hidden"
            style={{ borderColor: "var(--color-primary)" }}
          >
            <button
              onClick={() => setUseGen6Sprites(false)}
              className={`px-3 py-1 text-xs ${!useGen6Sprites ? "bg-primary/20 text-main" : ""}`}
              style={{ borderRight: "1px solid var(--color-primary)" }}
            >
              Gen 5
            </button>
            <button
              onClick={() => setUseGen6Sprites(true)}
              className={`px-3 py-1 text-xs ${useGen6Sprites ? "bg-primary/20 text-main" : ""}`}
            >
              Gen 6
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
