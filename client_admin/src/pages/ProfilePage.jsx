import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import PageHeader from "../components/ui/PageHeader";
import UserInfoCard from "../components/profile/UserInfoCard";
import BadgeDisplay from "../components/profile/BadgeDisplay";
import UserStatsWidget from "../components/profile/UserStatsWidget";
import DisplayedCollection from "../components/profile/DisplayedCollection";

const ProfilePage = () => {
  const { user } = useAuth(); // We get the populated user object from our context

  // State for data fetched specifically for this page
  const [allBadges, setAllBadges] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(true);

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

  if (loading || !user) {
    return (
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white text-center">
        Loading Profile...
      </motion.p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <PageHeader title="Operator Profile" subtitle="Your personal sanctuary and collection overview." />
      </motion.div>

      {/* --- Main 3-Column Grid Layout --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-4 gap-2 items-start"
      >
        {/* === Left Column (1/4 width) === */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="lg:col-span-1 space-y-6"
        >
          <motion.div whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
            <UserInfoCard />
          </motion.div>
          <motion.div whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}>
            <BadgeDisplay allBadges={allBadges} earnedBadges={user.badges} />
          </motion.div>
        </motion.div>

        {/* === Middle Column (1/2 width) === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="lg:col-span-2 space-y-6"
        >
          <motion.div whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}>
            <DisplayedCollection
              title="Displayed Pokémon"
              items={user.displayedPokemon || []}
              baseField="basePokemon"
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}>
            <DisplayedCollection
              title="Displayed Snoopys"
              items={user.displayedSnoopyArt || []}
              baseField="snoopyArtBase"
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}>
            <DisplayedCollection
              title="Displayed Habbo Rares"
              items={user.displayedHabboRares || []}
              baseField="habboRareBase"
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}>
            <DisplayedCollection
              title="Displayed Yu-Gi-Oh! Cards"
              items={user.displayedYugiohCards || []}
              baseField="yugiohCardBase"
            />
          </motion.div>
        </motion.div>

        {/* === Right Column (1/4 width) === */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="lg:col-span-1 space-y-6"
        >
          <motion.div whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
            <UserStatsWidget stats={dashboardStats} />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage;
