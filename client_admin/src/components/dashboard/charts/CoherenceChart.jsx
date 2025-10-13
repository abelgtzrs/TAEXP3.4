import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import Widget from "../../ui/Widget";
import { chartData } from "./chartData";
import { getTheme } from "./theme";

export default function CoherenceChart() {
  const { primary, secondary, textSecondary } = getTheme();
  return (
    <Widget title="Narrative Coherence Index" className="h-full min-h-0">
      <div className="flex-1 w-full h-full min-h-0 py-2">
        <ResponsiveContainer width="100%" height="100%" minHeight={120}>
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -15, bottom: 10 }}>
            <defs>
              <linearGradient id="colorCoherence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="50%" stopColor={primary} stopOpacity={0.4} />
                <stop offset="95%" stopColor={secondary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke={primary} tick={{ fill: textSecondary, fontSize: 10 }} />
            <YAxis
              stroke={primary}
              domain={["dataMin - 2", "dataMax + 2"]}
              tick={{ fill: textSecondary, fontSize: 10 }}
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <Tooltip
              contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", borderColor: primary, color: "#e5e7eb" }}
            />
            <Area type="monotone" dataKey="coherence" stroke={primary} strokeWidth={2} fill="url(#colorCoherence)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Widget>
  );
}
