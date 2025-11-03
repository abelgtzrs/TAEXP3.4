// Local storage service for Daily Drafts
// Structure: localStorage['tae.dailyDrafts'] = {
//   '2025-11-03': [ { ts: 1730611200000, content: '...' }, ... ],
//   ...
// }

const STORAGE_KEY = "tae.dailyDrafts";

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("Failed to parse daily drafts storage", e);
    return {};
  }
}

function saveAll(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function listDates() {
  const db = loadAll();
  return Object.keys(db).sort().reverse();
}

export function getHistory(dateStr) {
  const db = loadAll();
  return Array.isArray(db[dateStr]) ? db[dateStr].slice().sort((a, b) => b.ts - a.ts) : [];
}

export function getLatest(dateStr) {
  const hist = getHistory(dateStr);
  return hist.length > 0 ? hist[0] : null;
}

export function saveDraft(dateStr, content) {
  const ts = Date.now();
  const db = loadAll();
  if (!Array.isArray(db[dateStr])) db[dateStr] = [];
  db[dateStr].push({ ts, content });
  saveAll(db);
  return { ts, content };
}

export function deleteVersion(dateStr, ts) {
  const db = loadAll();
  if (!Array.isArray(db[dateStr])) return;
  db[dateStr] = db[dateStr].filter((v) => v.ts !== ts);
  if (db[dateStr].length === 0) delete db[dateStr];
  saveAll(db);
}

export function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  } catch {
    return dateStr;
  }
}
