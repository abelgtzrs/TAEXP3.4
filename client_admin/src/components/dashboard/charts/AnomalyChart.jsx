import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import Widget from "../../ui/Widget";
import { chartData } from "./chartData";
import { getTheme } from "./theme";

export default function AnomalyChart() {
  const { primary, textSecondary } = getTheme();
  return (
    <Widget title="Anomaly Detection Events" className="h-full min-h-0">
      <div className="flex-1 w-full h-full min-h-0 py-2">
        <ResponsiveContainer width="100%" height="100%" minHeight={120}>
          <BarChart data={chartData.slice(-16)} margin={{ top: 10, right: 20, left: -15, bottom: 10 }}>
            <XAxis dataKey="name" stroke={primary} tick={{ fill: textSecondary, fontSize: 10 }} />
            <YAxis stroke={primary} tick={{ fill: textSecondary, fontSize: 10 }} />
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <Tooltip
              contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", borderColor: primary, color: "#e5e7eb" }}
            />
            <Bar dataKey="anomaly" fill={primary} style={{ cursor: "default" }} className="no-hover" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Widget>
  );
}
