import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Widget from "./Widget";

// Mock data to make the chart look interesting
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

const LoreChartWidget = () => {
  return (
    <Widget title="System Integrity: Narrative Coherence Index">
      <div className="py-8 h-[100%] w-full">
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
            {/* The <defs> and <linearGradient> tags are standard SVG elements.
                Recharts knows how to render them without needing a specific import.
                This was the source of the error. */}
            <defs>
              <linearGradient id="colorCoherence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="50%" stopColor="#c34014ff" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ec7e24ff" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis dataKey="name" stroke="#6b7250" tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <YAxis stroke="#6b7280" domain={["dataMin - 5", "dataMax + 5"]} tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                borderColor: "#d45f2dff",
                color: "#e5e7eb",
              }}
              labelStyle={{ fontWeight: "bold" }}
            />
            <Area
              type="monotone"
              dataKey="coherence"
              stroke="#d42d2dff"
              strokeWidth={1}
              fillOpacity={1}
              fill="url(#colorCoherence)"
              dot={{ r: 3, fill: "#d42d2dff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Widget>
  );
};

export default LoreChartWidget;
