import api from "./api";

// In-memory cache to avoid multiple aggregate fetches per render cycle
let aggregateCache = null;
let aggregateFetchedAt = 0;
const AGGREGATE_TTL = 60 * 1000; // 1 minute client-side

async function fetchAggregate(force = false) {
  const now = Date.now();
  if (!force && aggregateCache && now - aggregateFetchedAt < AGGREGATE_TTL) return aggregateCache;
  try {
    const { data } = await api.get("/api/sports/football/real-madrid");
    aggregateCache = data;
    aggregateFetchedAt = now;
    return data;
  } catch (e) {
    console.warn("[sportsService] Falling back to mock due to error:", e.message);
    // Fallback minimal structure to keep UI functional
    return (
      aggregateCache || {
        stats: {
          season: "N/A",
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
      }
    );
  }
}

export async function fetchRealMadridStats() {
  const agg = await fetchAggregate();
  return agg.stats;
}

export async function fetchRealMadridSchedule() {
  const agg = await fetchAggregate();
  return agg.schedule;
}

export async function fetchRealMadridTopPerformers() {
  const agg = await fetchAggregate();
  return agg.performers;
}

export async function fetchRealMadridRoster() {
  const agg = await fetchAggregate();
  return agg.roster;
}

export async function fetchRealMadridLiveMatch() {
  try {
    const { data } = await api.get("/api/sports/football/real-madrid/live");
    return data.live;
  } catch (e) {
    return null;
  }
}
