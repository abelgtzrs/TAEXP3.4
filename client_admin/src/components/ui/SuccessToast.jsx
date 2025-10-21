import { useEffect } from "react";

// Lightweight success toast for transient confirmations
// Props: open (bool), message (string), duration (ms), onClose (fn)
const SuccessToast = ({ open, message, duration = 2500, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;
  return (
    <div className="fixed top-17 right-[220px] z-50">
      <div className="bg-gray-800 border border-primary rounded-lg px-6 py-4 shadow-lg flex items-center gap-3 animate-fade-in">
        <span className="text-status-success font-bold">Success</span>
        <span className="text-white">{message}</span>
      </div>
    </div>
  );
};

export default SuccessToast;
