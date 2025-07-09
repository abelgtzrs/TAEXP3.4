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
      <div className="mb-8">
        <StyledInput
          type="text"
          placeholder="Search by name or number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {filteredList.map((pokemon) => (
          // Wrap the card in a Link component to make it clickable
          <PokemonCard pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
};

export default PokedexPage;
