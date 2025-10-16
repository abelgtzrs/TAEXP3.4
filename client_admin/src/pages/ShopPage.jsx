// --- FILE: client-admin/src/pages/ShopPage.jsx (Corrected) ---
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Coins, Gem, Heart, Filter, X, ShoppingBag, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import GachaCard from "../components/shop/GachaCard";
import PullResultModal from "../components/shop/PullResultModal";

const ShopPage = () => {
  const { user, setUser } = useAuth();
  const [loadingCategory, setLoadingCategory] = useState(null);
  const [error, setError] = useState("");
  const [lastPulledItem, setLastPulledItem] = useState(null);
  const [filterCurrency, setFilterCurrency] = useState("all");

  const SHOP_CONFIG = [
    {
      category: "pokemon",
      title: "Summon Pokémon",
      description: "Burn Temu Tokens to execute a randomized Pokémon roll. Duplicates auto-refund at 25%.",
      cost: 5,
      currencyName: "temuTokens",
      currencySymbol: "TT",
    },
    {
      category: "yugioh",
      title: "Draw a Card",
      description: "Consume Temu Tokens to draw a random card from the archive. Standard RNG applies.",
      cost: 5,
      currencyName: "temuTokens",
      currencySymbol: "TT",
    },
    {
      category: "snoopy",
      title: "Find a Snoopy",
      description: "Spend Gatilla Gold to uncover a randomized Snoopy pixel—rarity-weighted outcomes.",
      cost: 20,
      currencyName: "gatillaGold",
      currencySymbol: "GG",
    },
    {
      category: "habbo",
      title: "Discover a Habbo Rare",
      description: "Redeem Gatilla Gold to roll for a Habbo rare. Duplicates trigger partial credit.",
      cost: 20,
      currencyName: "gatillaGold",
      currencySymbol: "GG",
    },
    {
      category: "abelpersona",
      title: "Unlock a Persona",
      description: "Spend Wendy Hearts to unlock a new Abel Persona. Access restricted to administrators.",
      cost: 10,
      currencyName: "wendyHearts",
      currencySymbol: "❤️",
    },
  ];

  const balances = useMemo(
    () => [
      {
        label: "Temu Tokens",
        value: user?.temuTokens || 0,
        symbol: "TT",
        icon: Coins,
        title: "Primary grind currency earned via habits",
      },
      {
        label: "Gatilla Gold",
        value: user?.gatillaGold || 0,
        symbol: "GG",
        icon: Gem,
        title: "Premium currency earned via workouts and challenges",
      },
      {
        label: "Wendy Hearts",
        value: user?.wendyHearts || 0,
        symbol: "\u2764\uFE0F",
        icon: Heart,
        title: "Narrative currency for Persona unlocks",
      },
    ],
    [user]
  );

  const visibleConfigs = useMemo(() => {
    if (filterCurrency === "all") return SHOP_CONFIG;
    return SHOP_CONFIG.filter((c) => c.currencySymbol === filterCurrency);
  }, [SHOP_CONFIG, filterCurrency]);

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
        className="flex items-center gap-2 text-3xl font-bold text-primary mb-2"
      >
        <ShoppingBag className="h-8 w-8" aria-hidden="true" />
        Storefront
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-text-secondary mb-8"
      >
        Burn tokens to execute an RNG pull across active banners. Duplicates are auto-refunded at 25% of cost.
      </motion.p>

      {/* Balances */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
      >
        {balances.map(({ label, value, symbol, icon: Icon, title }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.4 + i * 0.05 }}
            className="rounded-lg border p-4 flex items-center justify-between"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-primary)" }}
            title={title}
            aria-label={`${label} balance card`}
          >
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-md flex items-center justify-center border"
                style={{ background: "var(--color-background)", borderColor: "var(--color-primary)" }}
              >
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <div className="text-sm text-text-secondary">{label}</div>
                <div className="text-xl font-semibold text-text-main">
                  <span className="text-primary mr-1">{value}</span>
                  <span className="text-text-secondary text-sm align-middle">{symbol}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-main">Active Banners</h2>
        <div className="flex items-center gap-2">
          <div className="text-text-secondary text-sm">Filter</div>
          <div
            className="inline-flex items-center rounded-lg border overflow-hidden"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-primary)" }}
          >
            {[
              { key: "all", label: "All" },
              { key: "TT", label: "TT" },
              { key: "GG", label: "GG" },
              { key: "❤️", label: "Hearts" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setFilterCurrency(opt.key)}
                className={`px-3 py-1.5 text-sm transition-colors ${
                  filterCurrency === opt.key
                    ? "bg-primary text-white"
                    : "text-text-main hover:bg-[var(--color-background)]"
                }`}
                aria-pressed={filterCurrency === opt.key}
                aria-label={`Filter banners: ${opt.label}`}
              >
                {opt.key === "all" ? <Filter className="inline h-4 w-4 mr-1 align-[-2px]" /> : null}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mb-4 rounded-lg border px-4 py-3 flex items-start gap-3"
          style={{ background: "rgba(255, 0, 0, 0.06)", borderColor: "#ef4444" }}
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" aria-hidden="true" />
          <div className="flex-1 text-sm text-text-main">{error}</div>
          <button
            onClick={() => setError("")}
            className="rounded p-1 hover:bg-[var(--color-background)]"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4 text-text-secondary" />
          </button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {visibleConfigs.map((config, index) => {
          if (config.category === "abelpersona" && user?.role !== "admin") {
            return null;
          }
          return (
            <motion.div
              key={config.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.06 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="relative"
            >
              {/* Cost pill overlay */}
              <div
                className="absolute -top-2 -right-2 z-10 rounded-full border px-3 py-1 text-xs font-medium"
                style={{ background: "var(--color-background)", borderColor: "var(--color-primary)" }}
                title={`Cost per roll: ${config.cost} ${config.currencySymbol}`}
              >
                <span className="text-primary">{config.cost}</span>
                <span className="ml-1 text-text-secondary">{config.currencySymbol}</span>
              </div>
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

      {/* Meta note */}
      <p className="mt-6 text-xs text-text-secondary">
        Tip: Pull outcomes are probabilistic. We surface duplicate detection and issue a 25% credit to your balance on
        duplicates.
      </p>

      <PullResultModal result={lastPulledItem} onClose={() => setLastPulledItem(null)} />
    </motion.div>
  );
};

export default ShopPage;
