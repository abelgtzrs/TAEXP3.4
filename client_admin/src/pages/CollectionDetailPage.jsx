import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
      console.log("Updating display with:", {
        collectionType: collectionType,
        items: newDisplayedIds,
      });

      const response = await api.put("/users/me/profile/display", {
        collectionType: collectionType,
        items: newDisplayedIds,
      });

      console.log("Update response:", response.data);

      const updatedUserRes = await api.get("/auth/me");
      console.log("Updated user data:", updatedUserRes.data);

      setUser(updatedUserRes.data.data);
    } catch (error) {
      console.error("Error updating display:", error);
      alert("Failed to update display.");
    }
  };

  if (!config)
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-2xl">
        Error: Unknown Collection Type "{collectionType}"
      </motion.div>
    );

  if (loading)
    return (
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white text-center">
        Loading Collection...
      </motion.p>
    );

  if (error)
    return (
      <motion.p
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-red-500"
      >
        {error}
      </motion.p>
    );

  // We use the same safe array check here before calling .map()
  const displayedIds = Array.isArray(user[config.displayField])
    ? user[config.displayField].map((item) => item._id)
    : [];

  // Get the actual displayed items from the collection
  const displayedItems = collection.filter((item) => displayedIds.includes(item._id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-6"
      >
        <Link to="/collections" className="text-teal-400 hover:text-teal-300">
          &larr; Back to Collections Hub
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <PageHeader title={config.title} subtitle={`You have collected ${collection.length} items.`} />
      </motion.div>

      {/* Profile Display Counter and Status */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Profile Display</h3>
            <p className="text-gray-300 text-sm">Select up to {config.limit} items to showcase on your profile</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-teal-400">
              {displayedIds.length}/{config.limit}
            </div>
            <div className="text-xs text-gray-400">Selected</div>
          </div>
        </div>
      </motion.div>

      {/* Displayed Items Section - Only show if items are selected */}
      {displayedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="text-xl font-semibold text-white mb-4 flex items-center gap-2"
          >
            <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
            Currently Displayed on Profile
          </motion.h3>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 bg-teal-900/20 rounded-lg border border-teal-500/30"
          >
            {displayedItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className="h-auto"
              >
                <CollectionItemCard
                  item={item}
                  config={config}
                  isDisplayed={true}
                  isDisplayFull={false}
                  onSelect={handleUpdateDisplay}
                  isCompact={true}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* All Collection Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: displayedItems.length > 0 ? 1.2 : 0.6 }}
      >
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: displayedItems.length > 0 ? 1.3 : 0.7 }}
          className="text-xl font-semibold text-white mb-4"
        >
          Full Collection
        </motion.h3>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: displayedItems.length > 0 ? 1.4 : 0.8 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {collection.map((item, index) => (
            <CollectionItemCard
              item={item}
              config={config}
              isDisplayed={displayedIds.includes(item._id)}
              isDisplayFull={displayedIds.length >= config.limit}
              onSelect={handleUpdateDisplay}
              isCompact={true}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CollectionDetailPage;
