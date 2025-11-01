import { Filter } from "lucide-react";

const ShopFilter = ({ value, onChange }) => {
  const options = [
    { key: "all", label: "All" },
    { key: "TT", label: "TT" },
    { key: "GG", label: "GG" },
    { key: "❤️", label: "Hearts" },
  ];
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-text-main">Active Banners</h2>
      <div className="flex items-center gap-2">
        <div className="text-text-secondary text-sm">Filter</div>
        <div
          className="inline-flex items-center rounded-lg border overflow-hidden glass-surface"
          style={{ borderColor: "var(--color-primary)" }}
        >
          {options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => onChange(opt.key)}
              className={`px-3 py-1.5 text-sm transition-colors ${
                value === opt.key ? "bg-primary text-white" : "text-text-main hover:bg-[var(--color-background)]"
              }`}
              aria-pressed={value === opt.key}
              aria-label={`Filter banners: ${opt.label}`}
            >
              {opt.key === "all" ? <Filter className="inline h-4 w-4 mr-1 align-[-2px]" /> : null}
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopFilter;
