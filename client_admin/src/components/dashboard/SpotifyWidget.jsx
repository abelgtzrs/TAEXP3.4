// --- FILE: client-admin/src/components/dashboard/SpotifyWidget.jsx (New File) ---
import { useState, useEffect } from "react";
import api from "../../services/api";
import Widget from "../ui/Widget";
import { useAuth } from "../../context/AuthContext";
import { Music, RefreshCw } from "lucide-react";

const SpotifyWidget = () => {
  const { user } = useAuth();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const connectSpotify = async () => {
    try {
      const response = await api.get("/spotify/login");
      // Redirect the user to the Spotify authorization page
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Could not initiate Spotify connection:", error);
      alert("Failed to connect to Spotify. Please try again.");
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await api.post("/spotify/sync");
      alert(response.data.message);
    } catch (error) {
      alert("Failed to sync recent tracks.");
    } finally {
      setIsSyncing(false);
    }
  };

  // This effect polls for the currently playing track every 15 seconds
  useEffect(() => {
    if (user?.spotifyConnected) {
      const fetchCurrentTrack = async () => {
        try {
          const response = await api.get("/spotify/currently-playing");
          if (response.data.data && response.data.data.is_playing) {
            setCurrentTrack(response.data.data);
          } else {
            // If nothing is playing, fetch the last played track
            const recentRes = await api.post("/spotify/sync"); // Sync first
            const recent = await api.get("/spotify/recently-played"); // This endpoint needs to be created
            setCurrentTrack(recent.data.items[0]); // Simplified
          }
        } catch (error) {
          console.error("Error fetching Spotify status:", error);
        }
      };

      fetchCurrentTrack(); // Fetch immediately on load
      const intervalId = setInterval(fetchCurrentTrack, 15000); // Then every 15 seconds
      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [user?.spotifyConnected]);

  // If user hasn't connected their Spotify account yet
  if (!user?.spotifyConnected) {
    return (
      <Widget title="Spotify Activity">
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-sm text-text-secondary mb-4">Connect your Spotify account to see your listening stats.</p>
          <button
            onClick={connectSpotify}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Connect to Spotify
          </button>
        </div>
      </Widget>
    );
  }

  // If connected but no track data is loaded yet
  if (!currentTrack) {
    return (
      <Widget title="Spotify Activity">
        <p className="text-sm text-text-secondary">Loading listening data...</p>
      </Widget>
    );
  }

  const track = currentTrack.track || currentTrack; // Handle both currently-playing and recent track structures
  const albumArtUrl = track.album.images[0]?.url;
  const artists = track.artists.map((a) => a.name).join(", ");

  return (
    <Widget title="Spotify Activity" className="flex flex-col">
      <div className="flex items-center gap-4">
        {albumArtUrl ? (
          <img src={albumArtUrl} alt={track.album.name} className="w-24 h-24 rounded-md" />
        ) : (
          <div className="w-24 h-24 bg-gray-700 rounded-md flex items-center justify-center">
            <Music />
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          <p className="font-bold text-white truncate">{track.name}</p>
          <p className="text-sm text-text-secondary truncate">{artists}</p>
          {currentTrack.is_playing && (
            <div className="w-full bg-gray-600 rounded-full h-1 mt-2">
              <div
                className="bg-green-500 h-1 rounded-full"
                style={{ width: `${(currentTrack.progress_ms / track.duration_ms) * 100}%` }}
              ></div>
            </div>
          )}
          <p className="text-xs text-text-tertiary mt-1">
            {currentTrack.is_playing ? "Currently Playing" : "Last Played"}
          </p>
        </div>
      </div>
      <div className="mt-4 border-t border-gray-700/50 pt-3">
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="w-full text-xs text-text-secondary hover:text-white flex items-center justify-center gap-2"
        >
          <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
          {isSyncing ? "Syncing..." : "Sync Recent Activity"}
        </button>
      </div>
    </Widget>
  );
};

export default SpotifyWidget;
