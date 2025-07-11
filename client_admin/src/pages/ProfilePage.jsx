import { useState, useEffect } from "react";
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
    return <p className="text-white text-center">Loading Profile...</p>;
  }

  return (
    <div>
      <PageHeader title="Operator Profile" subtitle="Your personal sanctuary and collection overview." />

      {/* --- Main 3-Column Grid Layout --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 items-start">
        {/* === Left Column (1/4 width) === */}
        <div className="lg:col-span-1 space-y-6">
          <UserInfoCard />
          <BadgeDisplay allBadges={allBadges} earnedBadges={user.badges} />
        </div>

        {/* === Middle Column (1/2 width) === */}
        <div className="lg:col-span-2 space-y-6">
          <DisplayedCollection title="Displayed Pokémon" items={user.displayedPokemon || []} baseField="basePokemon" />
          <DisplayedCollection
            title="Displayed Snoopys"
            items={user.displayedSnoopyArt || []}
            baseField="snoopyArtBase"
          />
          <DisplayedCollection
            title="Displayed Habbo Rares"
            items={user.displayedHabboRares || []}
            baseField="habboRareBase"
          />
          <DisplayedCollection
            title="Displayed Yu-Gi-Oh! Cards"
            items={user.displayedYugiohCards || []}
            baseField="yugiohCardBase"
          />
        </div>

        {/* === Right Column (1/4 width) === */}
        <div className="lg:col-span-1 space-y-6">
          <UserStatsWidget stats={dashboardStats} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
