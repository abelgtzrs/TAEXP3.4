const axios = require("axios");

// Simple in-memory cache (resets on server restart). For production scale, move to Redis.
const cache = new Map();
const setCache = (key, data, ttlMs) => cache.set(key, { data, exp: Date.now() + ttlMs });
const getCache = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.exp) {
    cache.delete(key);
    return null;
  }
  return entry.data;
};

const API_KEY = process.env.API_FOOTBALL_KEY; // DO NOT hardcode; user must supply in env
const API_BASE = "https://v3.football.api-sports.io";
const TEAM_ID_REAL_MADRID = 541; // Real Madrid
const LA_LIGA_LEAGUE_ID = 140; // La Liga
// Current season guess (European season spanning 2025-2026 uses 2025 per API-Football season param)
const CURRENT_SEASON = process.env.FOOTBALL_SEASON || "2025";

if (!API_KEY) {
  console.warn("[sportsController] API_FOOTBALL_KEY not set. Endpoints will return mock/fallback data.");
}

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "x-apisports-key": API_KEY || "",
  },
  timeout: 12000,
});

async function safeGet(url, params = {}) {
  if (!API_KEY) throw new Error("API key missing");
  const { data } = await apiClient.get(url, { params });
  return data;
}

// Fetch helpers with discrete TTL policies
async function getStandings() {
  const key = "real_madrid_standings";
  const cached = getCache(key);
  if (cached) return cached;
  const raw = await safeGet("/standings", { league: LA_LIGA_LEAGUE_ID, season: CURRENT_SEASON });
  const table = raw?.response?.[0]?.league?.standings?.[0] || [];
  const rm = table.find((t) => t.team?.id === TEAM_ID_REAL_MADRID);
  if (!rm) throw new Error("Team not found in standings");
  const stats = {
    season: CURRENT_SEASON,
    competition: "La Liga",
    position: rm.rank,
    played: rm.all?.played,
    wins: rm.all?.win,
    draws: rm.all?.draw,
    losses: rm.all?.lose,
    goalsFor: rm.goals?.for,
    goalsAgainst: rm.goals?.against,
    goalDiff: (rm.goals?.for ?? 0) - (rm.goals?.against ?? 0),
    points: rm.points,
    form: (rm.form || "").split("").filter(Boolean),
  };
  setCache(key, stats, 1000 * 60 * 5); // 5 min
  return stats;
}

async function getFixtures() {
  const key = "real_madrid_fixtures";
  const cached = getCache(key);
  if (cached) return cached;
  const [lastResp, nextResp] = await Promise.all([
    safeGet("/fixtures", { team: TEAM_ID_REAL_MADRID, season: CURRENT_SEASON, last: 8 }),
    safeGet("/fixtures", { team: TEAM_ID_REAL_MADRID, season: CURRENT_SEASON, next: 8 }),
  ]);
  const mapFixture = (fx) => {
    const isHome = fx.teams?.home?.id === TEAM_ID_REAL_MADRID;
    const opponent = isHome ? fx.teams?.away?.name : fx.teams?.home?.name;
    const venue = isHome ? "H" : "A";
    const goalsFor = isHome ? fx.goals?.home : fx.goals?.away;
    const goalsAgainst = isHome ? fx.goals?.away : fx.goals?.home;
    const score = goalsFor != null && goalsAgainst != null ? `${goalsFor}-${goalsAgainst}` : null;
    let result = null;
    if (score) {
      if (goalsFor > goalsAgainst) result = "W";
      else if (goalsFor < goalsAgainst) result = "L";
      else result = "D";
    }
    return {
      id: fx.fixture?.id,
      date: fx.fixture?.date?.slice(0, 10),
      opponent,
      venue,
      competition: fx.league?.name,
      score,
      result,
      rawDate: fx.fixture?.date,
      events: fx.events || [],
    };
  };
  const history = (lastResp.response || []).map(mapFixture).filter((f) => f.score);
  const upcoming = (nextResp.response || []).map(mapFixture).filter((f) => !f.score);
  const latestResult = history[0] || null; // last returns most recent first
  // Build scorers for latest result if events present
  if (latestResult && latestResult.events?.length) {
    const goalEvents = latestResult.events.filter((e) => e.type === "Goal" && e.team?.id === TEAM_ID_REAL_MADRID);
    latestResult.scorers = goalEvents.map((e) => `${e.player?.name || "Unknown"} ${e.time?.elapsed}`);
  }
  const schedule = { latestResult, upcoming, history };
  setCache(key, schedule, 1000 * 60 * 2); // 2 min
  return schedule;
}

async function getPerformers() {
  const key = "real_madrid_performers";
  const cached = getCache(key);
  if (cached) return cached;
  const [scorersResp, assistsResp] = await Promise.all([
    safeGet("/players/topscorers", { league: LA_LIGA_LEAGUE_ID, season: CURRENT_SEASON }),
    safeGet("/players/topassists", { league: LA_LIGA_LEAGUE_ID, season: CURRENT_SEASON }),
  ]);
  const scorers = (scorersResp.response || [])
    .filter((p) => p.statistics?.[0]?.team?.id === TEAM_ID_REAL_MADRID)
    .map((p) => ({ player: p.player?.name, goals: p.statistics?.[0]?.goals?.total || 0 }))
    .slice(0, 5);
  const assists = (assistsResp.response || [])
    .filter((p) => p.statistics?.[0]?.team?.id === TEAM_ID_REAL_MADRID)
    .map((p) => ({ player: p.player?.name, assists: p.statistics?.[0]?.goals?.assists || 0 }))
    .slice(0, 5);
  const performers = { topScorers: scorers, topAssists: assists };
  setCache(key, performers, 1000 * 60 * 5);
  return performers;
}

async function getRoster() {
  const key = "real_madrid_roster";
  const cached = getCache(key);
  if (cached) return cached;
  const squadResp = await safeGet("/players/squads", { team: TEAM_ID_REAL_MADRID });
  const players = (squadResp.response?.[0]?.players || []).map((pl) => ({ name: pl.name, position: pl.position }));
  setCache(key, players, 1000 * 60 * 60 * 12); // 12h
  return players;
}

async function getLive() {
  const key = "real_madrid_live";
  const cached = getCache(key);
  if (cached) return cached;
  const liveResp = await safeGet("/fixtures", { team: TEAM_ID_REAL_MADRID, live: "all" });
  const fx = liveResp.response?.[0];
  if (!fx) {
    setCache(key, null, 15 * 1000);
    return null;
  }
  const isHome = fx.teams?.home?.id === TEAM_ID_REAL_MADRID;
  const opponent = isHome ? fx.teams?.away?.name : fx.teams?.home?.name;
  const goalsFor = isHome ? fx.goals?.home : fx.goals?.away;
  const goalsAgainst = isHome ? fx.goals?.away : fx.goals?.home;
  const liveObj = {
    opponent,
    minute: fx.fixture?.status?.elapsed,
    score: `${goalsFor}-${goalsAgainst}`,
    competition: fx.league?.name,
  };
  setCache(key, liveObj, 15 * 1000); // 15s TTL due to frequent polling
  return liveObj;
}

function buildFallback(error) {
  console.error("[sportsController] Fallback due to error:", error.message);
  return {
    stats: {
      season: CURRENT_SEASON,
      competition: "La Liga",
      position: 0,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
      form: [],
    },
    schedule: { latestResult: null, upcoming: [], history: [] },
    performers: { topScorers: [], topAssists: [] },
    roster: [],
    live: null,
    mock: true,
    warning: API_KEY ? error.message : "API key missing",
  };
}

// GET /api/sports/football/real-madrid
exports.getRealMadridAggregate = async (req, res) => {
  try {
    const [stats, schedule, performers, roster, live] = await Promise.all([
      getStandings(),
      getFixtures(),
      getPerformers(),
      getRoster(),
      getLive(),
    ]);
    res.json({ stats, schedule, performers, roster, live, mock: false });
  } catch (error) {
    res.status(200).json(buildFallback(error));
  }
};

// GET /api/sports/football/real-madrid/live
exports.getRealMadridLive = async (req, res) => {
  try {
    const live = await getLive();
    res.json({ live, mock: false });
  } catch (error) {
    res.status(200).json({ live: null, mock: true, warning: API_KEY ? error.message : "API key missing" });
  }
};
