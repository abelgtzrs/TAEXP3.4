import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import Widget from "../../ui/Widget";
import { getTheme } from "./theme";
import { useChartData } from "./ChartDataContext";
import React from "react";

export default function DriftChart() {
  const { primary, textSecondary } = getTheme();
  const { driftSeries } = useChartData();
  const data = React.useMemo(() => driftSeries.map((d) => ({ name: d.name, drift: d.value })), [driftSeries]);
  return (
    <Widget title="Temporal Drift Analysis" className="h-64">
      <div className="flex-1 w-full h-full min-h-0 py-2">
        <ResponsiveContainer width="100%" height="100%" minHeight={120}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: -15, bottom: 10 }}>
            <XAxis dataKey="name" stroke={primary} tick={{ fill: textSecondary, fontSize: 10 }} />
            <YAxis stroke={primary} domain={[0, 0.25]} tick={{ fill: textSecondary, fontSize: 10 }} />
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <Tooltip
              contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", borderColor: primary, color: "#e5e7eb" }}
            />
            <Line type="monotone" dataKey="drift" stroke={primary} strokeWidth={2} dot={{ r: 3, fill: primary }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Widget>
  );
}
