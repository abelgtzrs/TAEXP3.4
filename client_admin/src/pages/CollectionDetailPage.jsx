import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import PageHeader from "../components/ui/PageHeader";
import CollectionItemCard from "../components/collections/CollectionItemCard";

const collectionConfig = {
  pokemon: { title: "Pokédex Collection", baseField: "basePokemon", displayField: "displayedPokemon", limit: 6 },
  snoopy: { title: "Snoopy Gallery", baseField: "snoopyArtBase", displayField: "displayedSnoopyArt", limit: 6 },
  habbo: { title: "Habbo Rare Furni", baseField: "habboRareBase", displayField: "displayedHabboRares", limit: 6 },
  yugioh: { title: "Yu-Gi-Oh! Binder", baseField: "yugiohCardBase", displayField: "displayedYugiohCards", limit: 6 },
};

const CollectionDetailPage = () => {
  const { collectionType } = useParams();
  const { user, setUser } = useAuth();

  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const config = collectionConfig[collectionType];

  useEffect(() => {
    const fetchCollection = async () => {
      if (!config) {
        setError("Invalid collection type specified.");
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/users/me/collection/${collectionType}`);
        setCollection(response.data.data);
      } catch (err) {
        setError("Failed to fetch collection.");
      } finally {
        setLoading(false);
      }
    };
    fetchCollection();
  }, [collectionType, config]);

  const handleUpdateDisplay = async (itemId, isCurrentlyDisplayed) => {
    // --- THIS IS THE FIX ---
    // We safely get the array of displayed items, defaulting to an empty array if it doesn't exist.
    const displayedItems = Array.isArray(user[config.displayField])
      ? user[config.displayField].map((item) => item._id)
      : [];
    let newDisplayedIds;

    if (isCurrentlyDisplayed) {
      newDisplayedIds = displayedItems.filter((id) => id !== itemId);
    } else {
      if (displayedItems.length >= config.limit) {
        alert(`You can only display a maximum of ${config.limit} items.`);
        return;
      }
      newDisplayedIds = [...displayedItems, itemId];
    }

    try {
      await api.put("/users/me/profile/display", {
        collectionType: collectionType,
        items: newDisplayedIds,
      });
      const updatedUserRes = await api.get("/auth/me");
      setUser(updatedUserRes.data.data);
      alert("Profile display updated!");
    } catch (error) {
      alert("Failed to update display.");
    }
  };

  if (!config) return <div className="text-red-500 text-2xl">Error: Unknown Collection Type "{collectionType}"</div>;
  if (loading) return <p className="text-white text-center">Loading Collection...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // We use the same safe array check here before calling .map()
  const displayedIds = Array.isArray(user[config.displayField])
    ? user[config.displayField].map((item) => item._id)
    : [];

  return (
    <div>
      <div className="mb-6">
        <Link to="/collections" className="text-teal-400 hover:text-teal-300">
          &larr; Back to Collections Hub
        </Link>
      </div>
      <PageHeader title={config.title} subtitle={`You have collected ${collection.length} items.`} />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {collection.map((item) => (
          <CollectionItemCard
            key={item._id}
            item={item}
            config={config}
            isDisplayed={displayedIds.includes(item._id)}
            isDisplayFull={displayedIds.length >= config.limit}
            onSelect={handleUpdateDisplay}
          />
        ))}
      </div>
    </div>
  );
};

export default CollectionDetailPage;
