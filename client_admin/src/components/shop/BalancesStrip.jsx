import { motion } from "framer-motion";

const BalancesStrip = ({ balances }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
    >
      {balances.map(({ label, value, symbol, icon: Icon, title }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.4 + i * 0.05 }}
          className="rounded-lg border p-4 flex items-center justify-between"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-primary)" }}
          title={title}
          aria-label={`${label} balance card`}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-md flex items-center justify-center border"
              style={{ background: "var(--color-background)", borderColor: "var(--color-primary)" }}
            >
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <div className="text-sm text-text-secondary">{label}</div>
              <div className="text-xl font-semibold text-text-main">
                <span className="text-primary mr-1">{value}</span>
                <span className="text-text-secondary text-sm align-middle">{symbol}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BalancesStrip;
