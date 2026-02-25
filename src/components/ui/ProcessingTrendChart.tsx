import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardBody, CardHeader } from './Card';
import { TrendingUp } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { TrackerEntry } from '../../types/database';

interface ProcessingTrendChartProps {
  entries: TrackerEntry[];
  visaName: string;
}

export function ProcessingTrendChart({ entries, visaName }: ProcessingTrendChartProps) {
  const { isDark } = useTheme();

  // Filter for approved visas and sort by decision date
  const data = entries
    .filter(e => e.outcome === 'approved' && e.processing_days !== null && e.processing_days > 0 && e.decision_date)
    .sort((a, b) => {
        const dateA = a.decision_date ? new Date(a.decision_date).getTime() : 0;
        const dateB = b.decision_date ? new Date(b.decision_date).getTime() : 0;
        return dateA - dateB;
    })
    .map(e => ({
      date: e.decision_date ? new Date(e.decision_date).getTime() : 0,
      days: e.processing_days || 0,
      formattedDate: e.decision_date ? new Date(e.decision_date).toLocaleDateString() : '',
    }));

  if (data.length === 0) {
    return null;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-600" />
          Processing Time Trend
        </h2>
      </CardHeader>
      <CardBody>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#404040' : '#E5E5E5'} />
              <XAxis
                dataKey="date"
                domain={['auto', 'auto']}
                name="Date"
                tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
                type="number"
                stroke={isDark ? '#737373' : '#A3A3A3'}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                dataKey="days"
                name="Days"
                unit="d"
                stroke={isDark ? '#737373' : '#A3A3A3'}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-neutral-800 p-3 border border-neutral-200 dark:border-neutral-700 shadow-lg rounded-lg text-sm">
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">{data.formattedDate}</p>
                        <p className="text-primary-600 dark:text-primary-400 font-bold">{data.days} days</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ color: isDark ? '#d4d4d4' : '#525252' }} />
              <Scatter name={`${visaName} Approvals`} data={data} fill="#0ea5e9" line={{ stroke: '#0ea5e9', strokeWidth: 2 }} shape="circle" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4 text-center">
          Showing successful approvals over time. The trend line indicates moving average.
        </p>
      </CardBody>
    </Card>
  );
}
