// --- FILE: client-admin/src/pages/ShopPage.jsx (Corrected) ---
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import GachaCard from "../components/shop/GachaCard";
import PullResultModal from "../components/shop/PullResultModal";

const ShopPage = () => {
  const { user, setUser } = useAuth();
  const [loadingCategory, setLoadingCategory] = useState(null);
  const [error, setError] = useState("");
  const [lastPulledItem, setLastPulledItem] = useState(null);

  const SHOP_CONFIG = [
    {
      category: "pokemon",
      title: "Summon Pokémon",
      description: "Use your determination from completing habits to summon a random Pokémon.",
      cost: 5,
      currencyName: "temuTokens",
      currencySymbol: "TT",
    },
    {
      category: "yugioh",
      title: "Draw a Card",
      description: "It's time to duel! Draw a random card from the archives.",
      cost: 5,
      currencyName: "temuTokens",
      currencySymbol: "TT",
    },
    {
      category: "snoopy",
      title: "Find a Snoopy",
      description: "Use your workout energy to find a rare piece of pixel art.",
      cost: 20,
      currencyName: "gatillaGold",
      currencySymbol: "GG",
    },
    {
      category: "habbo",
      title: "Discover a Habbo Rare",
      description: "Uncover a piece of internet history from the Habbo Hotel.",
      cost: 20,
      currencyName: "gatillaGold",
      currencySymbol: "GG",
    },
    {
      category: "abelpersona",
      title: "Unlock a Persona",
      description: "Use the power of stories (Wendy Hearts) to unlock a new Abel Persona.",
      cost: 10,
      currencyName: "wendyHearts",
      currencySymbol: "❤️",
    },
  ];

  const handlePull = async (category) => {
    const config = SHOP_CONFIG.find((c) => c.category === category);
    if (!config || !user) return;

    if (user[config.currencyName] < config.cost) {
      setError("You don't have enough currency for this!");
      return;
    }

    setLoadingCategory(category);
    setError("");

    try {
      const response = await api.post(`/shop/pull/${category}`);
      // Set the entire response data to state, our modal will parse it.
      setLastPulledItem(response.data);

      // Update the user's currency in the global context state.
      setUser((prevUser) => {
        const newUserState = { ...prevUser };
        const currency = config.currencyName;
        const cost = config.cost;
        const refund = Math.floor(cost / 4);

        // Safely check for the isDuplicate flag from the nested data object.
        if (response.data?.data?.isDuplicate) {
          newUserState[currency] = (newUserState[currency] || 0) - cost + refund;
        } else {
          newUserState[currency] = (newUserState[currency] || 0) - cost;
        }
        return newUserState;
      });
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during the pull.");
    } finally {
      setLoadingCategory(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl font-bold text-primary mb-2"
      >
        The Gacha Shop
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-text-secondary mb-8"
      >
        Spend your hard-earned currency to acquire new collectibles.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
        className="flex flex-wrap gap-4 mb-8 p-4 rounded-lg border"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-primary)" }}
      >
        <span className="text-text-main">Balances:</span>
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="font-bold text-primary"
        >
          {user?.temuTokens || 0} TT
        </motion.span>
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="font-bold text-primary"
        >
          {user?.gatillaGold || 0} GG
        </motion.span>
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="font-bold text-primary"
        >
          {user?.wendyHearts || 0} ❤️
        </motion.span>
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-red-500 text-center mb-4"
        >
          {error}
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {SHOP_CONFIG.map((config, index) => {
          if (config.category === "abelpersona" && user?.role !== "admin") {
            return null;
          }
          return (
            <motion.div
              key={config.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <GachaCard
                title={config.title}
                description={config.description}
                cost={config.cost}
                currencyName={config.currencyName}
                currencySymbol={config.currencySymbol}
                isLoading={loadingCategory === config.category}
                onPull={() => handlePull(config.category)}
              />
            </motion.div>
          );
        })}
      </motion.div>

      <PullResultModal result={lastPulledItem} onClose={() => setLastPulledItem(null)} />
    </motion.div>
  );
};

export default ShopPage;
