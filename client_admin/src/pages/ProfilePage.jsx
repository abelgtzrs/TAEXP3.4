// src/pages/ProfilePage.jsx
import { useAuth } from '../context/AuthContext';
import UserProfileHeader from '../components/profile/UserProfileHeader';
import DisplayedCollection from '../components/profile/DisplayedCollection';

const ProfilePage = () => {
    // Get the comprehensive, populated user object from our global state
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return <p className="text-white">Loading Profile...</p>;
    }

    if (!isAuthenticated || !user) {
        return <p className="text-red-500">Could not load user profile.</p>;
    }

    return (
        <div className="space-y-8">
            <UserProfileHeader user={user} />

            <DisplayedCollection 
                title="Displayed Pokémon"
                items={user.displayedPokemon || []}
                baseField="basePokemon"
            />
            
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
            
            {/* The Badge Display will be added here in a future step */}
            <div className="widget-container p-6">
                <h2 className="text-xl font-bold text-white mb-4">Badges</h2>
                <p className="text-gray-400">Badge display will be implemented here.</p>
            </div>
        </div>
    );
};

export default ProfilePage;