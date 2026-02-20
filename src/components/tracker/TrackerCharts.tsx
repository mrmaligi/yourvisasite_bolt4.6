import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  p25: number;
  median: number;
  p75: number;
  avg: number;
}

export function TrackerCharts({ p25, median, p75, avg }: Props) {
  const data = [
    { name: 'Fast (25%)', days: Math.round(p25), color: '#10b981' },
    { name: 'Median', days: Math.round(median), color: '#3b82f6' },
    { name: 'Avg', days: Math.round(avg), color: '#6366f1' },
    { name: 'Slow (75%)', days: Math.round(p75), color: '#f59e0b' },
  ];

  return (
    <div className="h-40 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            width={70}
            tick={{ fontSize: 11, fill: '#737373' }}
            interval={0}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: any) => [`${value} days`, 'Processing Time']}
          />
          <Bar dataKey="days" radius={[0, 4, 4, 0]} barSize={16} background={{ fill: '#f5f5f5' }}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
