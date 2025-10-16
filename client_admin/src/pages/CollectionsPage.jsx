import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

// Central definition of collections with simple, non-emoji badges
const collections = [
  { type: "pokemon", name: "My Pokédex", abbr: "PK", description: "All captured Pokémon and progress." },
  { type: "snoopy", name: "Snoopy Gallery", abbr: "SN", description: "Snoopy artwork, media, and finds." },
  { type: "habbo", name: "Habbo Rare Furni", abbr: "HB", description: "Rare furniture index and tracking." },
  { type: "yugioh", name: "Yu-Gi-Oh! Binder", abbr: "YG", description: "TCG collection, decks, and trades." },
];

const Badge = ({ text }) => (
  <div
    className="flex h-12 w-12 items-center justify-center rounded-full border font-bold"
    style={{
      background: "var(--color-background)",
      borderColor: "var(--color-primary)",
      color: "var(--color-primary)",
    }}
  >
    {text}
  </div>
);

const CollectionsPage = () => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return collections;
    return collections.filter((c) => [c.name, c.type, c.description].some((v) => v.toLowerCase().includes(q)));
  }, [query]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-primary">Collections</h1>
        <div className="relative w-full md:w-96">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search collections by name or type"
            className="w-full rounded-md border px-4 py-2 focus:outline-none"
            style={{
              background: "var(--color-background)",
              borderColor: "var(--color-primary)",
              color: "var(--color-text-main)",
            }}
          />
        </div>
      </div>

      {/* Table layout for md+ screens */}
      <div
        className="hidden md:block overflow-x-auto rounded-lg border"
        style={{ borderColor: "var(--color-primary)" }}
      >
        <table className="min-w-full divide-y" style={{ borderColor: "var(--color-primary)" }}>
          <thead style={{ background: "var(--color-surface)" }}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Collection
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Description
              </th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody
            className="divide-y"
            style={{ background: "var(--color-background)", borderColor: "var(--color-primary)" }}
          >
            {filtered.map((c) => (
              <tr key={c.type} className="" style={{ background: "var(--color-surface)" }}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Badge text={c.abbr} />
                    <div>
                      <div className="text-sm font-medium text-text-main">{c.name}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-text-secondary">{c.type}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{c.description}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <Link
                    to={`/collections/${c.type}`}
                    className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 focus:outline-none"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card layout for small screens */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filtered.map((c) => (
          <div
            key={c.type}
            className="rounded-lg border p-4"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-primary)" }}
          >
            <div className="flex items-center gap-4">
              <Badge text={c.abbr} />
              <div className="flex-1">
                <div className="text-base font-semibold text-text-main">{c.name}</div>
                <div className="text-sm text-text-secondary">{c.description}</div>
              </div>
              <Link
                to={`/collections/${c.type}`}
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 focus:outline-none"
              >
                Open
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionsPage;
