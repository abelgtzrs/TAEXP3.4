import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Widget from "./Widget";

// Mock data to make the charts look interesting
const chartData = [
  { name: "T-144h", coherence: 91.2, anomaly: 4, drift: 0.2 },
  { name: "T-138h", coherence: 92.1, anomaly: 3, drift: 0.19 },
  { name: "T-132h", coherence: 92.7, anomaly: 5, drift: 0.18 },
  { name: "T-126h", coherence: 93.4, anomaly: 4, drift: 0.17 },
  { name: "T-120h", coherence: 93.9, anomaly: 4, drift: 0.17 },
  { name: "T-114h", coherence: 94.0, anomaly: 3, drift: 0.16 },
  { name: "T-108h", coherence: 94.3, anomaly: 3, drift: 0.16 },
  { name: "T-102h", coherence: 94.8, anomaly: 4, drift: 0.15 },
  { name: "T-96h", coherence: 95.1, anomaly: 100, drift: 0.15 },
  { name: "T-90h", coherence: 95.3, anomaly: 4, drift: 0.14 },
  { name: "T-36h", coherence: 97.2, anomaly: 5, drift: 0.15 },
  { name: "T-30h", coherence: 97.5, anomaly: 4, drift: 0.14 },
  { name: "T-24h", coherence: 98.6, anomaly: 4, drift: 0.14 },
  { name: "T-18h", coherence: 98.1, anomaly: 3, drift: 0.12 },
  { name: "T-12h", coherence: 97.8, anomaly: 1, drift: 0.09 },
  { name: "T-9h", coherence: 97.9, anomaly: 2, drift: 0.1 },
  { name: "T-6h", coherence: 98.2, anomaly: 2, drift: 0.1 },
  { name: "T-5h", coherence: 98.4, anomaly: 1, drift: 0.09 },
  { name: "T-4h", coherence: 99.0, anomaly: 1, drift: 0.09 },
  { name: "T-3h", coherence: 99.6, anomaly: 1, drift: 0.1 },
  { name: "T-2h", coherence: 100.0, anomaly: 2, drift: 0.1 },
  { name: "Current", coherence: 100.7, anomaly: 2, drift: 0.1 },
];

// Current system status data
const systemStatus = [
  { name: "Operational", value: 87, color: "var(--color-primary)" },
  { name: "Warning", value: 10, color: "var(--color-secondary)" },
  { name: "Critical", value: 3, color: "var(--color-tertiary) " },
];

// 1. Narrative Coherence Index (Area Chart)
export const CoherenceChartWidget = () => {
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue("--color-primary") || "#426280ff";
  const secondaryColor =
    getComputedStyle(document.documentElement).getPropertyValue("--color-secondary") || "#144573ff";
  const textSecondaryColor =
    getComputedStyle(document.documentElement).getPropertyValue("--color-text-secondary") || "#9ca3af";

  return (
    <Widget title="Narrative Coherence Index">
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
            <defs>
              <linearGradient id="colorCoherence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="50%" stopColor={primaryColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={secondaryColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke={primaryColor} tick={{ fill: textSecondaryColor, fontSize: 10 }} />
            <YAxis
              stroke={primaryColor}
              domain={["dataMin - 2", "dataMax + 2"]}
              tick={{ fill: textSecondaryColor, fontSize: 10 }}
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                borderColor: primaryColor,
                color: "#e5e7eb",
              }}
            />
            <Area
              type="monotone"
              dataKey="coherence"
              stroke={primaryColor}
              strokeWidth={2}
              fill="url(#colorCoherence)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Widget>
  );
};

// 2. Anomaly Detection (Bar Chart)
export const AnomalyChartWidget = () => {
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue("--color-primary") || "#426280ff";
  const textSecondaryColor =
    getComputedStyle(document.documentElement).getPropertyValue("--color-text-secondary") || "#9ca3af";

  return (
    <Widget title="Anomaly Detection Events">
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData.slice(-8)} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
            <XAxis dataKey="name" stroke={primaryColor} tick={{ fill: textSecondaryColor, fontSize: 10 }} />
            <YAxis stroke={primaryColor} tick={{ fill: textSecondaryColor, fontSize: 10 }} />
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                borderColor: primaryColor,
                color: "#e5e7eb",
              }}
            />
            <Bar
              dataKey="anomaly"
              fill={primaryColor}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              style={{ cursor: "default" }}
              className="no-hover"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Widget>
  );
};

// 3. Temporal Drift Analysis (Line Chart)
export const DriftChartWidget = () => {
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue("--color-primary") || "#426280ff";
  const textSecondaryColor =
    getComputedStyle(document.documentElement).getPropertyValue("--color-text-secondary") || "#9ca3af";

  return (
    <Widget title="Temporal Drift Analysis">
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
            <XAxis dataKey="name" stroke={primaryColor} tick={{ fill: textSecondaryColor, fontSize: 10 }} />
            <YAxis stroke={primaryColor} domain={[0, 0.25]} tick={{ fill: textSecondaryColor, fontSize: 10 }} />
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                borderColor: primaryColor,
                color: "#e5e7eb",
              }}
            />
            <Line
              type="monotone"
              dataKey="drift"
              stroke={primaryColor}
              strokeWidth={2}
              dot={{ r: 3, fill: primaryColor }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Widget>
  );
};

// 4. System Status Overview (Pie Chart)
export const SystemStatusWidget = () => {
  const textSecondaryColor =
    getComputedStyle(document.documentElement).getPropertyValue("--color-text-secondary") || "#9ca3af";

  return (
    <Widget title="System Status Overview">
      <div className="flex-1 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={systemStatus}
              cx="50%"
              cy="50%"
              outerRadius={150}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {systemStatus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderColor: "#426280ff",
                color: "#d8dadeff",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center space-x-4 text-xs">
        {systemStatus.map((item, index) => (
          <div key={index} className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span style={{ color: textSecondaryColor }}>
              {item.name}: {item.value}%
            </span>
          </div>
        ))}
      </div>
    </Widget>
  );
};

// Combined dashboard showing all 4 charts in a 2x2 grid
const LoreChartWidget = () => {
  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <CoherenceChartWidget />
      <AnomalyChartWidget />
      <DriftChartWidget />
      <SystemStatusWidget />
    </div>
  );
};

export default LoreChartWidget;
