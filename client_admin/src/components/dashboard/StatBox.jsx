import { ArrowUpRight, ArrowDownRight } from "lucide-react";

// Lightweight inline sparkline. Pass an array of numbers in `trend`.
const Sparkline = ({ data = [], height = 28, stroke = "#60a5fa", fill = "rgba(96,165,250,0.12)" }) => {
  if (!Array.isArray(data) || data.length < 2) return null;
  const width = 120;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });
  const path = `M ${points[0]} L ${points.slice(1).join(" ")}`;
  const area = `M ${points[0]} L ${points.slice(1).join(" ")} L ${width},${height} L 0,${height} Z`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[28px] overflow-visible">
      <path d={area} fill={fill} />
      <path d={path} fill="none" stroke={stroke} strokeWidth="2" />
    </svg>
  );
};

const StatBox = ({
  title,
  value,
  change,
  changeType,
  period,
  lastUpdate = "1 min ago",
  trend, // optional array of numbers for sparkline
  compact = false, // optional compact styling
}) => {
  const isIncrease = changeType === "increase";
  const changeColor = isIncrease ? "text-green-400" : "text-red-400";
  const Icon = isIncrease ? ArrowUpRight : ArrowDownRight;

  return (
    // Each stat box is a flex container, growing to fill space.
    // It has a right border to create the vertical dividers, except for the last one.
    <div className={`flex-1 ${compact ? "p-3" : "p-4"} border-r border-gray-700/50 last:border-r-0`}>
      <h4
        className={`font-bold uppercase text-text-secondary tracking-wider ${
          compact ? "text-[10px] mb-1" : "text-xs mb-2"
        }`}
      >
        {title}
      </h4>
      <p className={`${compact ? "text-2xl" : "text-3xl"} font-semibold text-text-main text-glow mb-1`}>{value}</p>
      {Array.isArray(trend) && trend.length > 1 && (
        <div className="mt-1 mb-1 -mx-1">
          <Sparkline data={trend} />
        </div>
      )}
      <div className={`flex items-center text-text-secondary ${compact ? "text-[11px]" : "text-xs"}`}>
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
