import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import Widget from "../ui/Widget";
import { RefreshCw, Music } from "lucide-react";

const StrokesLyricsWidget = () => {
  const [song, setSong] = useState(null);
  const [currentLyric, setCurrentLyric] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRandomSong = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/strokes/random");
      const newSong = response.data.data;
      setSong(newSong);

      // Select one random lyric from the new song
      if (newSong.lyrics && newSong.lyrics.length > 0) {
        const randomIndex = Math.floor(Math.random() * newSong.lyrics.length);
        setCurrentLyric(newSong.lyrics[randomIndex]);
      } else {
        setCurrentLyric("...");
      }
    } catch (err) {
      setError("Could not fetch lyrics. Is the database seeded?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a new song on mount and then set an interval to fetch a new one every 15 seconds
  useEffect(() => {
    fetchRandomSong(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchRandomSong();
    }, 15000); // Cycle every 15 seconds

    // Clear the interval when the component unmounts to prevent memory leaks
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Widget title="The Strokes - Lyrical Transmission" className="flex flex-col">
      {loading &&
        !song && ( // Only show initial loading state
          <div className="flex-grow flex items-center justify-center">
            <p className="text-text-secondary animate-pulse">Fetching transmission...</p>
          </div>
        )}
      {error && (
        <div className="flex-grow flex flex-col items-center justify-center">
          <p className="text-status-danger">{error}</p>
          <button onClick={fetchRandomSong} className="mt-4 text-primary hover:underline">
            Retry
          </button>
        </div>
      )}
      {song && (
        <div className="flex-grow flex flex-col justify-between">
          {/* Top section with song info */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              {song.album.coverImageUrl ? (
                <img
                  src={song.album.coverImageUrl}
                  alt={song.album.name}
                  className="w-16 h-16 rounded-md object-cover border-2 border-gray-700"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center">
                  <Music size={24} className="text-text-tertiary" />
                </div>
              )}
              <div className="overflow-hidden">
                <h3 className="text-md font-bold text-white truncate">{song.title}</h3>
                <p className="text-sm text-primary truncate">
                  {song.album.name} ({song.album.year})
                </p>
              </div>
            </div>
          </div>

          {/* Lyric Section with Animation */}
          <div className="flex-grow flex items-center justify-center text-center my-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentLyric + song.title} // Key change triggers animation
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-lg italic text-text-secondary"
              >
                "{currentLyric}"
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Footer with Refresh Button */}
          <div className="mt-auto pt-3 border-t border-gray-700/50">
            <button
              onClick={fetchRandomSong}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-xs text-text-secondary hover:text-primary transition-colors"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              New Random Song
            </button>
          </div>
        </div>
      )}
    </Widget>
  );
};

export default StrokesLyricsWidget;
