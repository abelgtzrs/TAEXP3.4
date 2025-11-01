import { motion } from "framer-motion";

const CategoryPanel = ({ config, recentItems = [], isAdmin, onPull, isLoading, categoryLabel }) => {
  if (config.category === "abelpersona" && !isAdmin) return null;

  const label = categoryLabel ? categoryLabel(config.category) : config.title;
  const items = Array.isArray(recentItems) ? recentItems.slice(0, 5) : [];
  const placeholders = items.length === 0 ? Array.from({ length: 5 }) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative rounded-lg border p-4 flex flex-col gap-3 glass-surface"
      style={{ borderColor: "var(--color-primary)" }}
    >
      {/* Cost pill */}
      <div
        className="absolute -top-2 -right-2 z-10 rounded-full border px-2.5 py-0.5 text-xs font-medium"
        style={{ background: "var(--color-background)", borderColor: "var(--color-primary)" }}
        title={`Cost per roll: ${config.cost} ${config.currencySymbol}`}
      >
        <span className="text-primary">{config.cost}</span>
        <span className="ml-1 text-text-secondary">{config.currencySymbol}</span>
      </div>

      <div className="min-w-0">
        <div className="text-base font-semibold text-text-main truncate">{label}</div>
        <div className="text-xs text-text-secondary truncate" title={config.title}>
          {config.title}
        </div>
      </div>

      {/* Recent thumbnails */}
      <div className="flex items-center gap-2 min-h-[48px]" aria-label={`Recent ${label}`}>
        {items.map((rp) => (
          <div
            key={`${rp.category}-${rp.id}-${rp.ts}`}
            className="h-10 w-10 rounded-md border overflow-hidden flex items-center justify-center"
            style={{ background: "var(--color-background)", borderColor: "var(--color-primary)" }}
            title={`${rp.name}${rp.rarity ? ` • ${String(rp.rarity).replace(/_/g, " ")}` : ""}`}
          >
            {rp.imageUrl ? (
              <img src={rp.imageUrl} alt={rp.name} className="max-h-9 max-w-9 object-contain" />
            ) : (
              <span className="text-[10px] text-text-secondary">No Img</span>
            )}
          </div>
        ))}
        {placeholders.map((_, i) => (
          <div
            key={`ph-${config.category}-${i}`}
            className="h-10 w-10 rounded-md border flex items-center justify-center opacity-60"
            style={{ background: "var(--color-background)", borderColor: "var(--color-primary)" }}
          >
            <span className="text-[10px] text-text-secondary">—</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-[11px] text-text-secondary truncate pr-2">{config.description}</div>
        <button
          onClick={() => onPull(config.category)}
          disabled={isLoading}
          className="shrink-0 bg-primary hover:opacity-90 text-white font-semibold text-sm rounded-md px-3 py-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label={`Pull from ${label}`}
        >
          {isLoading ? "Pulling…" : "Pull"}
        </button>
      </div>
    </motion.div>
  );
};

export default CategoryPanel;
