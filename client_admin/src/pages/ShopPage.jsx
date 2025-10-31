// --- FILE: client-admin/src/pages/ShopPage.jsx ---
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Coins, Gem, Heart, X, ShoppingBag, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import PullResultModal from "../components/shop/PullResultModal";
import ShopFilter from "../components/shop/ShopFilter";
import BalancesChips from "../components/shop/BalancesChips";
import CategoryPanel from "../components/shop/CategoryPanel";

const ShopPage = () => {
  const { user, setUser } = useAuth();
  const [loadingCategory, setLoadingCategory] = useState(null);
  const [error, setError] = useState("");
  const [lastPulledItem, setLastPulledItem] = useState(null);
  const [filterCurrency, setFilterCurrency] = useState("all");
  // Per-category last 5 pulls, persisted locally (with migration from old flat list)
  const [recentByCategory, setRecentByCategory] = useState(() => {
    try {
      const raw = localStorage.getItem("tae.shop.recentByCategory.v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : {};
      }
      const legacyRaw = localStorage.getItem("tae.shop.recentPulls");
      const mapping = {};
      if (legacyRaw) {
        const flat = JSON.parse(legacyRaw);
        if (Array.isArray(flat)) {
          for (const e of flat) {
            const cat = e?.category || "misc";
            if (!mapping[cat]) mapping[cat] = [];
            mapping[cat].push(e);
          }
          for (const k of Object.keys(mapping)) mapping[k] = mapping[k].slice(0, 5);
        }
      }
      return mapping;
    } catch {
      return {};
    }
  });

  // Build absolute URLs for relative images based on API base URL
  const serverBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").split("/api")[0];
  const buildImageUrl = (url) => {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;
    let path = url.replace(/^public\//, "").replace(/^\/public\//, "");
    if (path.startsWith("/")) return `${serverBaseUrl}${path}`;
    return `${serverBaseUrl}/${path}`;
  };

  // Label helper for sections
  const categoryLabel = (cat) => {
    const map = {
      pokemon: "Pokémon",
      yugioh: "Yu-Gi-Oh!",
      snoopy: "Snoopy",
      habbo: "Habbo Rare",
      abelpersona: "Persona",
    };
    return map[cat] || cat;
  };

  // Persist per-category recents (cap 5 per category)
  useEffect(() => {
    try {
      const capped = {};
      for (const [cat, arr] of Object.entries(recentByCategory || {})) {
        capped[cat] = (Array.isArray(arr) ? arr : []).slice(0, 5);
      }
      localStorage.setItem("tae.shop.recentByCategory.v1", JSON.stringify(capped));
    } catch {}
  }, [recentByCategory]);

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
      setLastPulledItem(response.data);

      const nested = response.data?.data || {};
      const pulledItems =
        nested.items && Array.isArray(nested.items) && nested.items.length > 0
          ? nested.items
          : nested.item
          ? [nested.item]
          : [];
      const ts = Date.now();
      const entries = pulledItems.map((it) => {
        let img = it.imageUrl;
        if (!img && it.forms) img = it.forms?.[0]?.spriteGen5Animated || it.forms?.[0]?.spriteGen6Animated;
        const imageUrl = buildImageUrl(img);
        const name = it.name || it.title || "Unknown";
        const rarity = it.rarity || it.rarityCategory || it.systemRarity || null;
        const id = it._id || it.id || `${name}-${ts}`;
        return { id, name, imageUrl, rarity, category, ts };
      });
      setRecentByCategory((prev) => {
        const next = { ...prev };
        const cat = category;
        const existing = Array.isArray(next[cat]) ? [...next[cat]] : [];
        for (const entry of entries) {
          const withoutDup = existing.filter((e) => e.id !== entry.id);
          existing.splice(0, existing.length, entry, ...withoutDup);
        }
        next[cat] = existing.slice(0, 5);
        return next;
      });

      setUser((prevUser) => {
        const newUserState = { ...prevUser };
        const currency = config.currencyName;
        const cost = config.cost;
        const refund = Math.floor(cost / 4);
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
        className="text-text-secondary mb-6"
      >
        Burn tokens to execute an RNG pull across active banners. Duplicates are auto-refunded at 25% of cost.
      </motion.p>

      {/* Balances (compact chips) */}
      <BalancesChips balances={balances} />

      {/* Controls */}
      <ShopFilter value={filterCurrency} onChange={setFilterCurrency} />

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

      {/* Compact panels combining banner + recents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleConfigs.map((cfg) => (
          <CategoryPanel
            key={cfg.category}
            config={cfg}
            recentItems={recentByCategory[cfg.category] || []}
            isAdmin={user?.role === "admin"}
            onPull={handlePull}
            isLoading={loadingCategory === cfg.category}
            categoryLabel={categoryLabel}
          />
        ))}
      </div>

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
