const axios = require("axios");
const querystring = require("querystring");
const User = require("../models/User");
const SpotifyLog = require("../models/SpotifyLogs");

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || "http://127.0.0.1:5000/api/spotify/callback";

// Small helper to determine if the current access token is expired or about to expire
const isAccessTokenExpired = (user) => {
  if (!user?.spotifyTokenExpiresAt) return true;
  const expiresAt = new Date(user.spotifyTokenExpiresAt).getTime();
  // Add a 60s safety window
  return Date.now() >= expiresAt - 60000;
};

// Helper function to refresh Spotify access token
const refreshSpotifyToken = async (user) => {
  try {
    if (!user?.spotifyRefreshToken) {
      const err = new Error("Missing Spotify refresh token. Please reconnect your Spotify account.");
      err.code = "SPOTIFY_NO_REFRESH_TOKEN";
      throw err;
    }
    const response = await axios({
      method: "post",
      url: SPOTIFY_TOKEN_URL,
      data: querystring.stringify({
        grant_type: "refresh_token",
        refresh_token: user.spotifyRefreshToken,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET).toString("base64"),
      },
    });

    const { access_token, expires_in, refresh_token } = response.data;

    // Update user with new tokens
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        spotifyAccessToken: access_token,
        spotifyTokenExpiresAt: new Date(Date.now() + expires_in * 1000),
        // Some refresh responses include a new refresh token
        ...(refresh_token && { spotifyRefreshToken: refresh_token }),
      },
      { new: true }
    );

    return updatedUser;
  } catch (error) {
    console.error("Token refresh failed:", error.response?.data || error.message);
    throw error;
  }
};

// Helper function to make authenticated Spotify API requests with auto-refresh
const makeSpotifyRequest = async (user, url, options = {}) => {
  try {
    let workingUser = user;
    // Proactively refresh if token is missing or expired
    if (!workingUser.spotifyAccessToken || isAccessTokenExpired(workingUser)) {
      console.log("Spotify access token missing/expired. Refreshing before request...");
      workingUser = await refreshSpotifyToken(workingUser);
    }

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${workingUser.spotifyAccessToken}` },
      ...options,
    });
    return response;
  } catch (error) {
    // If we get a 401, try refreshing the token and retry once
    if (error.response?.status === 401) {
      console.log("Access token expired, refreshing...");
      const refreshedUser = await refreshSpotifyToken(user);

      // Retry with new token
      const retryResponse = await axios.get(url, {
        headers: { Authorization: `Bearer ${refreshedUser.spotifyAccessToken}` },
        ...options,
      });
      return retryResponse;
    }
    throw error;
  }
};

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
    const dashboardUrl =
      process.env.NODE_ENV === "production"
        ? `${process.env.FRONTEND_URL || "https://your-app.vercel.app"}/dashboard`
        : "http://localhost:5173/dashboard";
    res.redirect(dashboardUrl);
  } catch (err) {
    console.error("Spotify callback error:", err.response ? err.response.data : err.message);
    res.status(500).send("An error occurred during Spotify authentication.");
  }
};

// @desc    Get the user's currently playing track
// @route   GET /api/spotify/currently-playing
exports.getCurrentlyPlaying = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user || !user.spotifyConnected) {
    return res.status(400).json({ success: false, message: "Spotify not connected." });
  }

  try {
    const response = await makeSpotifyRequest(user, "https://api.spotify.com/v1/me/player/currently-playing");

    if (response.status === 204 || !response.data) {
      return res.json({ success: true, data: { is_playing: false } });
    }
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error fetching currently playing:", error.response?.data || error.message || error);

    const status = error.response?.status;
    const errMsg = error.response?.data?.error?.message || error.response?.data?.message || error.message;

    if (status === 401) {
      return res
        .status(400)
        .json({ success: false, message: "Spotify authentication failed. Please reconnect your account." });
    }
    if (status === 429) {
      return res
        .status(429)
        .json({ success: false, message: "Spotify API rate limit reached. Please try again later." });
    }
    if (status === 400 && /invalid_grant|refresh token/i.test(errMsg || "")) {
      return res
        .status(400)
        .json({ success: false, message: "Spotify session expired. Please reconnect your Spotify account." });
    }
    if (status === 403) {
      return res.status(400).json({ success: false, message: "Spotify permission denied. Please re-authorize." });
    }
    if (error.code && ["ENOTFOUND", "ECONNRESET", "ETIMEDOUT"].includes(error.code)) {
      return res
        .status(502)
        .json({ success: false, message: "Network error contacting Spotify. Please try again soon." });
    }

    res.status(500).json({ success: false, message: "Could not fetch from Spotify." });
  }
};

// @desc    Get recently played tracks from database with pagination
// @route   GET /api/spotify/recently-played
exports.getRecentlyPlayed = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user || !user.spotifyConnected) {
    return res.status(400).json({ success: false, message: "Spotify not connected." });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const tracks = await SpotifyLog.find({ user: user._id }).sort({ playedAt: -1 }).skip(skip).limit(limit).lean();

    const totalTracks = await SpotifyLog.countDocuments({ user: user._id });
    const totalPages = Math.ceil(totalTracks / limit);

    res.json({
      success: true,
      items: tracks,
      pagination: {
        currentPage: page,
        totalPages,
        totalTracks,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching recent tracks:", error);
    res.status(500).json({ success: false, message: "Could not fetch recent tracks." });
  }
};

// @desc    Sync recent tracks and log them to the database
// @route   POST /api/spotify/sync
exports.syncRecentTracks = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user || !user.spotifyConnected) {
    return res.status(400).json({ success: false, message: "Spotify not connected." });
  }
  if (!user.spotifyAccessToken && !user.spotifyRefreshToken) {
    return res
      .status(400)
      .json({ success: false, message: "Spotify session missing. Please reconnect your Spotify account." });
  }

  try {
    // Get the most recent track timestamp to avoid duplicates
    const lastLog = await SpotifyLog.findOne({ user: user._id }).sort({ playedAt: -1 });
    const after = lastLog ? Math.floor(new Date(lastLog.playedAt).getTime()) : null;

    const url = after
      ? `https://api.spotify.com/v1/me/player/recently-played?limit=50&after=${after}`
      : `https://api.spotify.com/v1/me/player/recently-played?limit=50`;

    const response = await makeSpotifyRequest(user, url);

    const tracks = response.data.items;
    if (!tracks || tracks.length === 0) {
      return res.status(200).json({ success: true, message: "No new tracks to sync.", newTracks: 0, totalFetched: 0 });
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
    let insertedCount = 0;
    try {
      const result = await SpotifyLog.insertMany(newLogs, { ordered: false });
      insertedCount = result.length;
    } catch (err) {
      // Handle duplicate key errors gracefully across driver versions
      const isDup =
        err?.code === 11000 || (Array.isArray(err?.writeErrors) && err.writeErrors.some((e) => e?.code === 11000));
      if (isDup) {
        // Some driver versions don't expose insertedIds on error reliably; default to 0 and proceed
        insertedCount = 0;
        console.log(
          `Sync completed with duplicates skipped. Inserted ${insertedCount} new tracks (duplicates ignored).`
        );
      } else {
        console.error("Sync error (non-duplicate):", err);
        throw err;
      }
    }

    res.status(200).json({
      success: true,
      message: `Sync complete. ${insertedCount} new tracks logged.`,
      newTracks: insertedCount,
      totalFetched: newLogs.length,
    });
  } catch (error) {
    console.error("Sync error:", error.response?.data || error.message || error);

    // Provide more specific error messages
    const status = error.response?.status;
    const errMsg = error.response?.data?.error?.message || error.response?.data?.message || error.message;

    if (status === 401) {
      return res
        .status(400)
        .json({ success: false, message: "Spotify authentication failed. Please reconnect your account." });
    }
    if (status === 429) {
      return res
        .status(429)
        .json({ success: false, message: "Spotify API rate limit reached. Please try again later." });
    }
    if (status === 400 && /invalid_grant|refresh token/i.test(errMsg || "")) {
      return res
        .status(400)
        .json({ success: false, message: "Spotify session expired. Please reconnect your Spotify account." });
    }
    if (status === 403) {
      return res.status(400).json({ success: false, message: "Spotify permission denied. Please re-authorize." });
    }

    // Network-ish
    if (error.code && ["ENOTFOUND", "ECONNRESET", "ETIMEDOUT"].includes(error.code)) {
      return res
        .status(502)
        .json({ success: false, message: "Network error contacting Spotify. Please try again soon." });
    }

    return res.status(500).json({ success: false, message: "Could not sync from Spotify." });
  }
};

// @desc    Get Spotify statistics
// @route   GET /api/spotify/stats
exports.getSpotifyStats = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user || !user.spotifyConnected) {
    return res.status(400).json({ success: false, message: "Spotify not connected." });
  }

  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    // Aggregate statistics
    const stats = await SpotifyLog.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: null,
          totalTracks: { $sum: 1 },
          totalMinutes: { $sum: { $divide: ["$durationMs", 60000] } },
          earliestPlay: { $min: "$playedAt" },
          latestPlay: { $max: "$playedAt" },
        },
      },
    ]);

    // Time-based statistics
    const timeStats = await Promise.all([
      // Today
      SpotifyLog.aggregate([
        { $match: { user: user._id, playedAt: { $gte: todayStart } } },
        { $group: { _id: null, count: { $sum: 1 }, minutes: { $sum: { $divide: ["$durationMs", 60000] } } } },
      ]),
      // This week
      SpotifyLog.aggregate([
        { $match: { user: user._id, playedAt: { $gte: weekStart } } },
        { $group: { _id: null, count: { $sum: 1 }, minutes: { $sum: { $divide: ["$durationMs", 60000] } } } },
      ]),
      // This month
      SpotifyLog.aggregate([
        { $match: { user: user._id, playedAt: { $gte: monthStart } } },
        { $group: { _id: null, count: { $sum: 1 }, minutes: { $sum: { $divide: ["$durationMs", 60000] } } } },
      ]),
      // This year
      SpotifyLog.aggregate([
        { $match: { user: user._id, playedAt: { $gte: yearStart } } },
        { $group: { _id: null, count: { $sum: 1 }, minutes: { $sum: { $divide: ["$durationMs", 60000] } } } },
      ]),
    ]);

    // Top artists
    const topArtists = await SpotifyLog.aggregate([
      { $match: { user: user._id } },
      {
        $group: { _id: "$artistName", count: { $sum: 1 }, totalMinutes: { $sum: { $divide: ["$durationMs", 60000] } } },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Top albums
    const topAlbums = await SpotifyLog.aggregate([
      { $match: { user: user._id } },
      {
        $group: { _id: "$albumName", count: { $sum: 1 }, totalMinutes: { $sum: { $divide: ["$durationMs", 60000] } } },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Top tracks
    const topTracks = await SpotifyLog.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: { track: "$trackName", artist: "$artistName" },
          count: { $sum: 1 },
          totalMinutes: { $sum: { $divide: ["$durationMs", 60000] } },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      success: true,
      stats: {
        total: {
          tracks: stats[0]?.totalTracks || 0,
          minutes: Math.round(stats[0]?.totalMinutes || 0),
          hours: Math.round(((stats[0]?.totalMinutes || 0) / 60) * 100) / 100,
          earliestPlay: stats[0]?.earliestPlay,
          latestPlay: stats[0]?.latestPlay,
        },
        today: {
          tracks: timeStats[0][0]?.count || 0,
          minutes: Math.round(timeStats[0][0]?.minutes || 0),
        },
        thisWeek: {
          tracks: timeStats[1][0]?.count || 0,
          minutes: Math.round(timeStats[1][0]?.minutes || 0),
        },
        thisMonth: {
          tracks: timeStats[2][0]?.count || 0,
          minutes: Math.round(timeStats[2][0]?.minutes || 0),
        },
        thisYear: {
          tracks: timeStats[3][0]?.count || 0,
          minutes: Math.round(timeStats[3][0]?.minutes || 0),
        },
        topArtists: topArtists.map((artist) => ({
          name: artist._id,
          plays: artist.count,
          minutes: Math.round(artist.totalMinutes),
        })),
        topAlbums: topAlbums.map((album) => ({
          name: album._id,
          plays: album.count,
          minutes: Math.round(album.totalMinutes),
        })),
        topTracks: topTracks.map((track) => ({
          name: track._id.track,
          artist: track._id.artist,
          plays: track.count,
          minutes: Math.round(track.totalMinutes),
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching Spotify stats:", error);
    res.status(500).json({ success: false, message: "Could not fetch Spotify statistics." });
  }
};
