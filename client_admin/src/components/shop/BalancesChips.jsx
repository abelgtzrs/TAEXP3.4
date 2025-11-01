import { motion } from "framer-motion";

const BalancesChips = ({ balances }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="flex flex-wrap items-center gap-2 mb-4"
      aria-label="Balances overview"
    >
      {balances.map(({ label, value, symbol, icon: Icon, title }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.25 + i * 0.04 }}
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1 glass-surface"
          style={{ borderColor: "var(--color-primary)" }}
          title={title}
          aria-label={`${label}: ${value} ${symbol}`}
        >
          <span
            className="inline-flex items-center justify-center h-6 w-6 rounded-full border"
            style={{ background: "var(--color-background)", borderColor: "var(--color-primary)" }}
          >
            <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          </span>
          <span className="text-sm text-text-main font-semibold">{value}</span>
          <span className="text-xs text-text-secondary">{symbol}</span>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BalancesChips;
