import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import UserOverviewCard from "../components/profile/UserOverviewCard";
import BadgeDisplay from "../components/profile/BadgeDisplay";
import UserStatsWidget from "../components/profile/UserStatsWidget";
import DisplayedCollection from "../components/profile/DisplayedCollection";
import CompactDisplayedCollections from "../components/profile/CompactDisplayedCollections";
import { Flame, Images, Star, User as UserIcon, Image as ImageIcon } from "lucide-react";
import ProfileEditPanel from "../components/profile/ProfileEditPanel";

const ProfilePage = () => {
  const { user } = useAuth(); // We get the populated user object from our context

  // State for data fetched specifically for this page
  const [allBadges, setAllBadges] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  // Collections tab data
  const [collectionsState, setCollectionsState] = useState({
    pokemon: [],
    snoopy: [],
    habbo: [],
    yugioh: [],
    loading: false,
    loaded: false,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data needed for the profile page in parallel
        const [badgesRes, statsRes] = await Promise.all([
          api.get("/badges/base"),
          api.get("/users/me/dashboard-stats"),
        ]);
        setAllBadges(badgesRes.data.data);
        setDashboardStats(statsRes.data.data);
      } catch (error) {
        console.error("Failed to load profile page data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Lazy-load full collections when user navigates to the Collections tab
  useEffect(() => {
    const loadCollections = async () => {
      if (activeTab !== "collections") return;
      if (collectionsState.loaded || collectionsState.loading) return;
      try {
        setCollectionsState((s) => ({ ...s, loading: true, error: "" }));
        const [p, s, h, y] = await Promise.all([
          api.get("/users/me/collection/pokemon"),
          api.get("/users/me/collection/snoopy"),
          api.get("/users/me/collection/habbo"),
          api.get("/users/me/collection/yugioh"),
        ]);
        setCollectionsState({
          pokemon: p.data?.data || [],
          snoopy: s.data?.data || [],
          habbo: h.data?.data || [],
          yugioh: y.data?.data || [],
          loading: false,
          loaded: true,
          error: "",
        });
      } catch (e) {
        console.error("Failed to load collections:", e);
        setCollectionsState((prev) => ({ ...prev, loading: false, error: "Failed to load collections." }));
      }
    };
    loadCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  if (loading || !user) {
    return (
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white text-center">
        Loading Profile...
      </motion.p>
    );
  }

  // Theme accent from active persona if available
  const accent = user?.activeAbelPersona?.colors?.primary || "#22d3ee"; // teal-400 fallback
  const serverBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").split("/api")[0];
  const avatarUrl = user?.profilePicture
    ? `${serverBaseUrl}${user.profilePicture}`
    : `https://api.dicebear.com/8.x/pixel-art/svg?seed=${user?.username || "user"}`;
  const bannerUrl = user?.bannerImage ? `${serverBaseUrl}${user.bannerImage}` : null;

  const totalCollectibles =
    (user?.pokemonCollection?.length || 0) +
    (user?.snoopyArtCollection?.length || 0) +
    (user?.habboRares?.length || 0) +
    (user?.yugiohCards?.length || 0);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      {/* Hero header */}
      <div className="relative px-1 sm:px-2 mb-4">
        <div className="relative h-[13.75rem] sm:h-[16.25rem] md:h-[20rem] w-full md:w-[125%] md:mx-[-12.5%] rounded-xl sm:rounded-2xl overflow-hidden">
          {/* Banner image layer */}
          {bannerUrl ? (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${bannerUrl})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: user.bannerFitMode || "cover",
                backgroundPosition: `${user.bannerPositionX ?? 50}% ${user.bannerPositionY ?? 50}%`,
                filter: "saturate(1.05) contrast(1.02)",
                transform: "translateZ(0)",
              }}
            />
          ) : null}
          {/* Accent overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${accent}33, transparent), radial-gradient(1200px 400px at 0% 0%, ${accent}22, transparent 60%)`,
              boxShadow: "inset 0 0 80px rgba(255,255,255,0.03)",
            }}
          />
          {/* Edit Banner quick button */}
          <div className="ml-auto mb-1">
            <button
              onClick={() => setActiveTab("edit")}
              className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs md:text-sm rounded-md bg-black/40 border border-white/15 text-white hover:bg-black/50 transition"
            >
              <ImageIcon size={16} /> Edit Banner
            </button>
          </div>
        </div>
        {/* Avatar and primary info */}
        <div className="px-1 sm:px-2 -mt-12 md:-mt-16 flex items-end gap-4 relative z-10">
          <div className="w-28 h-28 md:w-[200px] md:h-[200px] rounded-full border-2 border-white/20 shadow-xl overflow-hidden bg-black/30 relative z-20">
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg md:text-2xl font-bold text-white">{user.username}</h1>
              {user?.motto && <span className="text-xs md:text-sm text-slate-300/90 italic">“{user.motto}”</span>}
            </div>
            <div className="mt-0.5 flex items-center gap-3 text-[11px] md:text-xs text-slate-300 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <UserIcon size={14} /> Level {user.level}
              </span>
              <span className="inline-flex items-center gap-1 text-amber-300">
                <Flame size={14} />
                {(dashboardStats?.activeStreaks ?? user.currentLoginStreak) || 0} day streak
              </span>
              <span className="inline-flex items-center gap-1 text-sky-300">
                <Images size={14} />
                {totalCollectibles} collectibles
              </span>
              {user?.equippedTitle?.titleBase?.name && (
                <span className="inline-flex items-center gap-1 text-emerald-300">
                  <Star size={14} />
                  {user.equippedTitle.titleBase.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-1 sm:px-2 mb-3">
        <div className="inline-flex bg-white/5 border border-white/10 rounded-lg p-0.5 overflow-hidden">
          {[
            { id: "overview", label: "Overview" },
            { id: "collections", label: "Collections" },
            { id: "badges", label: "Badges" },
            { id: "stats", label: "Stats" },
            { id: "edit", label: "Edit" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs md:text-sm rounded-md transition-colors ${
                activeTab === tab.id ? "bg-white/15 text-white" : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === "overview" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start px-1 sm:px-2"
        >
          {/* Left: Profile summary + badges */}
          <div className="lg:col-span-1 space-y-3">
            <UserOverviewCard onEdit={() => setActiveTab("edit")} />
            <BadgeDisplay allBadges={allBadges} earnedBadges={user.badges} />
          </div>
          {/* Right: Compact all displayed collections */}
          <div className="lg:col-span-2 space-y-3">
            <CompactDisplayedCollections
              displayedPokemon={user.displayedPokemon || []}
              displayedSnoopyArt={user.displayedSnoopyArt || []}
              displayedHabboRares={user.displayedHabboRares || []}
              displayedYugiohCards={user.displayedYugiohCards || []}
            />
          </div>
        </motion.div>
      )}

      {activeTab === "collections" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 px-1 sm:px-2">
          {collectionsState.loading && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white text-center">
              Loading Collections...
            </motion.p>
          )}
          {collectionsState.error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-center">
              {collectionsState.error}
            </motion.p>
          )}
          {!collectionsState.loading && !collectionsState.error && (
            <>
              <DisplayedCollection title="All Pokémon" items={collectionsState.pokemon} baseField="basePokemon" />
              <DisplayedCollection title="All Snoopys" items={collectionsState.snoopy} baseField="snoopyArtBase" />
              <DisplayedCollection title="All Habbo Rares" items={collectionsState.habbo} baseField="habboRareBase" />
              <DisplayedCollection
                title="All Yu-Gi-Oh! Cards"
                items={collectionsState.yugioh}
                baseField="yugiohCardBase"
              />
            </>
          )}
        </motion.div>
      )}

      {activeTab === "badges" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <BadgeDisplay allBadges={allBadges} earnedBadges={user.badges} />
        </motion.div>
      )}

      {activeTab === "stats" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <UserStatsWidget stats={dashboardStats} />
        </motion.div>
      )}

      {activeTab === "edit" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <ProfileEditPanel />
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProfilePage;
