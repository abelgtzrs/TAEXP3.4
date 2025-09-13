import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * Generic action card used on workout landing page.
 * Props:
 *  - to: react-router link target
 *  - icon: React node (lucide icon component)
 *  - title: heading text
 *  - description: sub text
 *  - delay: animation delay (seconds)
 */
const ActionCard = ({ to, icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ scale: 1.02, transition: { duration: 0.18 } }}
    >
      <Link
        to={to}
        className="block p-8 bg-gray-800 rounded-lg hover:bg-gray-700 hover:border-teal-500 border-2 border-transparent transition-all duration-300 h-full text-left"
      >
        <div className="mb-4 text-teal-300">{icon}</div>
        <h2 className="text-xl font-semibold text-white mb-1">{title}</h2>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </Link>
    </motion.div>
  );
};

export default ActionCard;
