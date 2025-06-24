// --- FILE: client-admin/src/components/dashboard/LoreChartWidget.jsx (Corrected) ---
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Widget from './Widget';

// Mock data to make the chart look interesting
const chartData = [
  { name: 'T-72h', coherence: 98.5, anomaly: 2, drift: 0.1 },
  { name: 'T-60h', coherence: 98.6, anomaly: 3, drift: 0.12 },
  { name: 'T-48h', coherence: 98.4, anomaly: 2, drift: 0.11 },
  { name: 'T-36h', coherence: 98.7, anomaly: 5, drift: 0.15 },
  { name: 'T-24h', coherence: 98.6, anomaly: 4, drift: 0.14 },
  { name: 'T-12h', coherence: 98.8, anomaly: 1, drift: 0.09 },
  { name: 'Current', coherence: 98.7, anomaly: 2, drift: 0.1 },
];


const LoreChartWidget = () => {
  return (
    <Widget title="System Integrity: Narrative Coherence Index">
      <div className="h-80 w-full">
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
            {/* The <defs> and <linearGradient> tags are standard SVG elements.
                Recharts knows how to render them without needing a specific import.
                This was the source of the error. */}
            <defs>
              <linearGradient id="colorCoherence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis stroke="#6b7280" domain={['dataMin - 0.5', 'dataMax + 0.5']} tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderColor: '#2dd4bf',
                color: '#e5e7eb',
                borderRadius: '0.5rem'
              }}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Area
              type="monotone"
              dataKey="coherence"
              stroke="#2dd4bf"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCoherence)"
              dot={{ r: 4, fill: '#2dd4bf' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Widget>
  );
};

export default LoreChartWidget;