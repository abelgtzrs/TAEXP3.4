import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import Widget from "../../ui/Widget";
import { getTheme } from "./theme";
import { useChartData } from "./ChartDataContext";

export default function SystemStatusChart() {
  const { textSecondary } = getTheme();
  const { systemStatus } = useChartData();
  return (
    <Widget title="System Status Overview" className="h-64">
      <div className="flex-1 w-full h-full min-h-0 flex flex-col justify-center py-2">
        <div className="flex-1 flex items-center justify-center" style={{ minHeight: "120px" }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={100}>
            <PieChart>
              <Pie
                data={systemStatus}
                cx="50%"
                cy="50%"
                outerRadius="95%"
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
        <div className="flex justify-center space-x-4 text-[8px] mt-2">
          {systemStatus.map((item, index) => (
            <div key={index} className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span style={{ color: textSecondary }}>
                {item.name}: {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Widget>
  );
}
