import { useEffect, useState, useMemo } from "react";
import Widget from "../components/ui/Widget";
import {
  fetchRealMadridStats,
  fetchRealMadridSchedule,
  fetchRealMadridTopPerformers,
  fetchRealMadridRoster,
  fetchRealMadridLiveMatch,
} from "../services/sportsService";

// NOTE: Replaced previous local Section component with shared <Widget /> for consistent dashboard styling.

const StatBadge = ({ label, value }) => (
  <div className="flex flex-col items-center bg-gray-900 rounded-md px-3 py-2 min-w-[60px] border border-gray-700">
    <span className="text-[10px] uppercase tracking-wide text-gray-400">{label}</span>
    <span className="text-lg font-semibold text-white">{value}</span>
  </div>
);

const ResultTag = ({ result }) => {
  const color = result === "W" ? "bg-green-600/60" : result === "L" ? "bg-red-600/60" : "bg-yellow-600/60";
  return <span className={`px-1.5 py-0.5 rounded text-[10px] text-white font-semibold ${color}`}>{result}</span>;
};

const LiveBanner = ({ match }) => {
  if (!match) return null;
  return (
    <div className="rounded-md bg-red-700/30 border border-red-600/40 p-3 flex items-center gap-4 animate-pulse">
      <span className="text-red-400 text-xs font-bold uppercase">Live</span>
      <span className="text-white text-sm font-medium">Real Madrid vs {match.opponent}</span>
      <span className="text-white text-sm font-mono bg-gray-900/60 px-2 py-1 rounded">{match.score}</span>
      <span className="text-gray-300 text-xs">
        {match.minute}' • {match.competition}
      </span>
    </div>
  );
};

const FootballTrackerPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [performers, setPerformers] = useState(null);
  const [roster, setRoster] = useState([]);
  const [live, setLive] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [st, sch, perf, ros, liveMatch] = await Promise.all([
          fetchRealMadridStats(),
          fetchRealMadridSchedule(),
          fetchRealMadridTopPerformers(),
          fetchRealMadridRoster(),
          fetchRealMadridLiveMatch(),
        ]);
        if (!mounted) return;
        setStats(st);
        setSchedule(sch);
        setPerformers(perf);
        setRoster(ros);
        setLive(liveMatch);
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load data");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    const interval = setInterval(async () => {
      try {
        const lm = await fetchRealMadridLiveMatch();
        if (mounted) setLive(lm);
      } catch {}
    }, 60000); // poll live once per minute
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const upcomingFirst = schedule?.upcoming?.[0];

  if (loading) {
    return <div className="p-4 text-gray-300 text-sm">Loading Real Madrid tracker...</div>;
  }
  if (error) {
    return <div className="p-4 text-red-400 text-sm">{error}</div>;
  }

  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-teal-400">Real Madrid Tracker</h1>
        <LiveBanner match={live} />
      </div>

      {/* Top Row: Overview & Next Match */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Widget title="Season Overview" className="bg-gray-800/60 border-gray-700 shadow-sm">
          {stats && (
            <div className="flex flex-wrap gap-2">
              <StatBadge label="Pos" value={stats.position} />
              <StatBadge label="Pld" value={stats.played} />
              <StatBadge label="W" value={stats.wins} />
              <StatBadge label="D" value={stats.draws} />
              <StatBadge label="L" value={stats.losses} />
              <StatBadge label="GF" value={stats.goalsFor} />
              <StatBadge label="GA" value={stats.goalsAgainst} />
              <StatBadge label="GD" value={stats.goalDiff} />
              <StatBadge label="Pts" value={stats.points} />
            </div>
          )}
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
            Form:
            {stats?.form?.map((r, i) => (
              <ResultTag key={i} result={r} />
            ))}
          </div>
        </Widget>
        <Widget title="Next Fixture" className="bg-gray-800/60 border-gray-700 shadow-sm">
          {upcomingFirst ? (
            <div className="text-sm text-gray-200 flex flex-col gap-1">
              <div className="font-semibold">vs {upcomingFirst.opponent}</div>
              <div className="text-gray-400 text-xs">
                {new Date(upcomingFirst.date).toLocaleString()} • {upcomingFirst.competition}
              </div>
              <div className="text-gray-400 text-xs">Venue: {upcomingFirst.venue === "H" ? "Home" : "Away"}</div>
            </div>
          ) : (
            <div className="text-xs text-gray-500">No upcoming fixtures.</div>
          )}
        </Widget>
        <Widget title="Latest Result" className="bg-gray-800/60 border-gray-700 shadow-sm">
          {schedule?.latestResult ? (
            <div className="text-sm text-gray-200 flex flex-col gap-1">
              <div className="font-semibold">
                {schedule.latestResult.score} vs {schedule.latestResult.opponent}
              </div>
              <div className="text-gray-400 text-xs">
                {schedule.latestResult.date} • {schedule.latestResult.venue === "H" ? "Home" : "Away"}
              </div>
              <div className="text-gray-400 text-[11px]">Scorers: {schedule.latestResult.scorers.join(", ")}</div>
            </div>
          ) : (
            <div className="text-xs text-gray-500">No recent result.</div>
          )}
        </Widget>
      </div>

      {/* Middle Row: Top Performers & Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Widget title="Top Scorers" className="bg-gray-800/60 border-gray-700 shadow-sm">
          <table className="w-full text-xs">
            <tbody className="divide-y divide-gray-700/60">
              {performers?.topScorers?.map((p) => (
                <tr key={p.player} className="hover:bg-gray-700/30">
                  <td className="py-1 pr-2 text-gray-200">{p.player}</td>
                  <td className="py-1 text-right font-semibold text-white">{p.goals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Widget>
        <Widget title="Top Assists" className="bg-gray-800/60 border-gray-700 shadow-sm">
          <table className="w-full text-xs">
            <tbody className="divide-y divide-gray-700/60">
              {performers?.topAssists?.map((p) => (
                <tr key={p.player} className="hover:bg-gray-700/30">
                  <td className="py-1 pr-2 text-gray-200">{p.player}</td>
                  <td className="py-1 text-right font-semibold text-white">{p.assists}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Widget>
        <Widget title="Roster" className="bg-gray-800/60 border-gray-700 shadow-sm">
          <div className="max-h-64 overflow-y-auto pr-1 custom-scrollbar">
            <table className="w-full text-[11px]">
              <tbody className="divide-y divide-gray-800/80">
                {roster.map((p) => (
                  <tr key={p.name} className="hover:bg-gray-800/40">
                    <td className="py-1 pr-2 text-gray-300">{p.name}</td>
                    <td className="py-1 text-right text-gray-500 font-medium">{p.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Widget>
      </div>

      {/* Bottom Row: Match History & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Widget title="Recent Matches" className="bg-gray-800/60 border-gray-700 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-gray-400 text-[10px] uppercase tracking-wide">
                  <th className="py-1 text-left font-medium">Date</th>
                  <th className="py-1 text-left font-medium">Opponent</th>
                  <th className="py-1 text-left font-medium">Comp</th>
                  <th className="py-1 text-left font-medium">Venue</th>
                  <th className="py-1 text-left font-medium">Score</th>
                  <th className="py-1 text-left font-medium">Res</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/70">
                {schedule?.history?.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-800/40">
                    <td className="py-1 pr-2 text-gray-400">{m.date}</td>
                    <td className="py-1 pr-2 text-gray-200">{m.opponent}</td>
                    <td className="py-1 pr-2 text-gray-400">{m.competition}</td>
                    <td className="py-1 pr-2 text-gray-400">{m.venue}</td>
                    <td className="py-1 pr-2 text-gray-300 font-medium">{m.score}</td>
                    <td className="py-1 text-gray-300">
                      <ResultTag result={m.result} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Widget>
        <Widget title="Upcoming Fixtures" className="bg-gray-800/60 border-gray-700 shadow-sm">
          <div className="space-y-2">
            {schedule?.upcoming?.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between text-[11px] bg-gray-900/40 px-3 py-2 rounded border border-gray-700/50"
              >
                <div className="flex flex-col">
                  <span className="text-gray-200 font-medium">vs {m.opponent}</span>
                  <span className="text-gray-500">{new Date(m.date).toLocaleString()}</span>
                </div>
                <div className="text-gray-400 text-right">
                  <div>{m.competition}</div>
                  <div className="text-[10px]">{m.venue === "H" ? "Home" : "Away"}</div>
                </div>
              </div>
            ))}
          </div>
        </Widget>
      </div>

      <div className="text-[10px] text-gray-500 pt-2 border-t border-gray-800/80">
        Data is placeholder / mock. TODO: Integrate real APIs (Football-Data.org or API-Football) with server caching &
        rate limit handling.
      </div>
    </div>
  );
};

export default FootballTrackerPage;
