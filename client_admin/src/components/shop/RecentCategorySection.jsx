const RecentCategorySection = ({ label, items, categoryLabel }) => {
  const placeholder = [...Array(5)];
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-text-main">{label}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {!items || items.length === 0
          ? placeholder.map((_, i) => (
              <div
                key={`empty-${i}`}
                className="rounded-lg border p-2 flex items-center gap-2 opacity-60"
                style={{ background: "var(--color-surface)", borderColor: "var(--color-primary)" }}
              >
                <div
                  className="h-10 w-10 flex items-center justify-center bg-[var(--color-background)] rounded border"
                  style={{ borderColor: "var(--color-primary)" }}
                >
                  <span className="text-[10px] text-text-secondary">—</span>
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-text-secondary truncate">No pulls yet</div>
                </div>
              </div>
            ))
          : items.map((rp) => (
              <div
                key={`${rp.category}-${rp.id}-${rp.ts}`}
                className="rounded-lg border p-2 flex items-center gap-2"
                style={{ background: "var(--color-surface)", borderColor: "var(--color-primary)" }}
                title={`${rp.name} • ${categoryLabel ? categoryLabel(rp.category) : rp.category}`}
              >
                <div
                  className="h-10 w-10 flex items-center justify-center bg-[var(--color-background)] rounded border"
                  style={{ borderColor: "var(--color-primary)" }}
                >
                  {rp.imageUrl ? (
                    <img src={rp.imageUrl} alt={rp.name} className="max-h-9 max-w-9 object-contain" />
                  ) : (
                    <span className="text-[10px] text-text-secondary">No Img</span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-text-main truncate">{rp.name}</div>
                  <div className="text-[10px] text-text-secondary truncate capitalize">
                    {categoryLabel ? categoryLabel(rp.category) : rp.category}
                    {rp.rarity ? ` • ${String(rp.rarity).replace(/_/g, " ")}` : ""}
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default RecentCategorySection;
