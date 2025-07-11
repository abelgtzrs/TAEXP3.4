import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatBox = ({ title, value, change, changeType, period, lastUpdate = "1 min ago" }) => {
  const isIncrease = changeType === "increase";
  const changeColor = isIncrease ? "text-green-400" : "text-red-400";
  const Icon = isIncrease ? ArrowUpRight : ArrowDownRight;

  return (
    // Each stat box is a flex container, growing to fill space.
    // It has a right border to create the vertical dividers, except for the last one.
    <div className="flex-1 p-4 border-r border-gray-700/50 last:border-r-0">
      <h4 className="text-xs font-bold uppercase text-text-secondary tracking-wider mb-2">{title}</h4>
      <p className="text-3xl font-semibold text-text-main text-glow mb-1">{value}</p>
      <div className="flex items-center text-xs text-text-secondary">
        <span className={`flex items-center mr-2 ${changeColor}`}>
          <Icon size={16} className="mr-0.5" />
          {change}
        </span>
        <span>vs {period}</span>
      </div>
      <p className="text-[10px] text-text-tertiary mt-2">updated {lastUpdate}</p>
    </div>
  );
};

export default StatBox;
