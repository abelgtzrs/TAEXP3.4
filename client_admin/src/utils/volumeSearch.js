// client_admin/src/utils/volumeSearch.js
// Local full-text-ish search across admin-fetched Volume docs.
// Returns an array of { volume, matches: Array<{ field, index?: number, excerpt: string }> }

const normalize = (s) => (s || "").toString();

function excerptAround(text, query, maxLen = 100) {
  const t = normalize(text);
  const q = normalize(query);
  if (!t || !q) return t.slice(0, maxLen);
  const idx = t.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return t.slice(0, maxLen);
  const start = Math.max(0, idx - Math.floor((maxLen - q.length) / 2));
  const end = Math.min(t.length, start + maxLen);
  let snippet = t.slice(start, end);
  if (start > 0) snippet = "…" + snippet;
  if (end < t.length) snippet = snippet + "…";
  return snippet;
}

export function searchVolumes(volumes, query, options = {}) {
  const q = normalize(query).trim();
  if (!q) return [];

  const results = [];
  for (const v of volumes || []) {
    const matches = [];

    // Title
    if (normalize(v.title).toLowerCase().includes(q.toLowerCase())) {
      matches.push({ field: "title", excerpt: excerptAround(v.title, q) });
    }

    // Edition
    if (normalize(v.edition).toLowerCase().includes(q.toLowerCase())) {
      matches.push({ field: "edition", excerpt: excerptAround(v.edition, q) });
    }

    // Dream
    if (normalize(v.dream).toLowerCase().includes(q.toLowerCase())) {
      matches.push({ field: "dream", excerpt: excerptAround(v.dream, q) });
    }

    // Blessing intro
    if (normalize(v.blessingIntro).toLowerCase().includes(q.toLowerCase())) {
      matches.push({ field: "blessingIntro", excerpt: excerptAround(v.blessingIntro, q) });
    }

    // Blessings
    if (Array.isArray(v.blessings)) {
      v.blessings.forEach((b, i) => {
        const item = normalize(b.item);
        const desc = normalize(b.description);
        if (item.toLowerCase().includes(q.toLowerCase())) {
          matches.push({ field: "blessing.item", index: i, excerpt: excerptAround(item, q) });
        } else if (desc.toLowerCase().includes(q.toLowerCase())) {
          matches.push({ field: "blessing.description", index: i, excerpt: excerptAround(desc, q) });
        }
      });
    }

    // Body lines
    if (Array.isArray(v.bodyLines)) {
      v.bodyLines.forEach((line, i) => {
        const t = normalize(line);
        if (t && t.toLowerCase().includes(q.toLowerCase())) {
          matches.push({ field: "body", index: i, excerpt: excerptAround(t, q) });
        }
      });
    }

    if (matches.length) {
      results.push({ volume: v, matches });
    }
  }

  // Sort results: more matches first, then by volumeNumber asc
  results.sort((a, b) => {
    if (b.matches.length !== a.matches.length) return b.matches.length - a.matches.length;
    const an = a.volume?.volumeNumber ?? 0;
    const bn = b.volume?.volumeNumber ?? 0;
    return an - bn;
  });

  return results;
}

export function highlightQuery(snippet, query) {
  // Return a simple array of parts with a flag for highlighting; consumer can style.
  const t = normalize(snippet);
  const q = normalize(query);
  if (!t || !q) return [{ text: t, hit: false }];
  const parts = [];
  let i = 0;
  const lower = t.toLowerCase();
  const ql = q.toLowerCase();
  while (i < t.length) {
    const idx = lower.indexOf(ql, i);
    if (idx === -1) {
      parts.push({ text: t.slice(i), hit: false });
      break;
    }
    if (idx > i) parts.push({ text: t.slice(i, idx), hit: false });
    parts.push({ text: t.slice(idx, idx + q.length), hit: true });
    i = idx + q.length;
  }
  return parts;
}
