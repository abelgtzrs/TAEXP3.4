const axios = require("axios");
const querystring = require("querystring");
const User = require("../models/User");
const SpotifyLog = require("../models/SpotifyLogs");

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const REDIRECT_URI = "https://localhost:5000/api/spotify/callback";

// @desc    Generate the URL for Spotify authorization
// @route   GET /api/spotify/login
exports.getSpotifyAuthUrl = (req, res) => {
  const scope = "user-read-private user-read-email user-read-currently-playing user-read-recently-played";
  const authUrl = `${SPOTIFY_AUTH_URL}?${querystring.stringify({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: REDIRECT_URI,
    state: req.user.id, // We pass the user's ID to identify them on callback
  })}`;
  res.json({ url: authUrl });
};

// @desc    Handle the callback from Spotify after user authorization
// @route   GET /api/spotify/callback
exports.handleSpotifyCallback = async (req, res) => {
  const { code, state, error } = req.query;
  const userId = state;

  if (error) {
    return res.status(400).send(`Error from Spotify: ${error}`);
  }

  try {
    const response = await axios({
      method: "post",
      url: SPOTIFY_TOKEN_URL,
      data: querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET).toString("base64"),
      },
    });

    const { access_token, refresh_token, expires_in } = response.data;

    // Fetch the user's Spotify profile to get their Spotify ID
    const profileResponse = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    // Update the user in our database with the new tokens and info
    await User.findByIdAndUpdate(userId, {
      spotifyConnected: true,
      spotifyUserId: profileResponse.data.id,
      spotifyAccessToken: access_token,
      spotifyRefreshToken: refresh_token,
      spotifyTokenExpiresAt: new Date(Date.now() + expires_in * 1000),
    });

    // Redirect the user back to their dashboard or a success page
    res.redirect("http://localhost:5173/dashboard"); // Redirect to your admin panel URL
  } catch (err) {
    console.error("Spotify callback error:", err.response ? err.response.data : err.message);
    res.status(500).send("An error occurred during Spotify authentication.");
  }
};

// @desc    Get the user's currently playing track
// @route   GET /api/spotify/currently-playing
exports.getCurrentlyPlaying = async (req, res) => {
  // This is a simplified version. A full implementation would handle token refreshing.
  const user = await User.findById(req.user.id);
  if (!user || !user.spotifyConnected) {
    return res.status(400).json({ success: false, message: "Spotify not connected." });
  }
  try {
    const response = await axios.get("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${user.spotifyAccessToken}` },
    });
    if (response.status === 204 || !response.data) {
      return res.json({ success: true, data: { is_playing: false } });
    }
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not fetch from Spotify." });
  }
};

// @desc    Sync recent tracks and log them to the database
// @route   POST /api/spotify/sync
exports.syncRecentTracks = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user || !user.spotifyConnected) {
    return res.status(400).json({ success: false, message: "Spotify not connected." });
  }
  try {
    const response = await axios.get("https://api.spotify.com/v1/me/player/recently-played?limit=50", {
      headers: { Authorization: `Bearer ${user.spotifyAccessToken}` },
    });

    const tracks = response.data.items;
    if (!tracks || tracks.length === 0) {
      return res.status(200).json({ success: true, message: "No new tracks to sync." });
    }

    const newLogs = tracks.map((item) => ({
      user: user._id,
      trackId: item.track.id,
      trackName: item.track.name,
      artistName: item.track.artists.map((a) => a.name).join(", "),
      albumName: item.track.album.name,
      playedAt: new Date(item.played_at),
      durationMs: item.track.duration_ms,
    }));

    // Use ordered:false to insert all valid logs even if some are duplicates (which will be ignored)
    const result = await SpotifyLog.insertMany(newLogs, { ordered: false }).catch((err) => {
      // Ignore duplicate key errors, but log others
      if (err.code !== 11000) console.error("Sync error:", err);
    });

    res.status(200).json({ success: true, message: `Sync complete. ${result ? result.length : 0} new tracks logged.` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not sync from Spotify." });
  }
};
