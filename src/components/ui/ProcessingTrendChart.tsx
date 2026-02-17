import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardBody, CardHeader } from './Card';
import { TrendingUp } from 'lucide-react';
import type { TrackerEntry } from '../../types/database';

interface ProcessingTrendChartProps {
  entries: TrackerEntry[];
  visaName: string;
}

export function ProcessingTrendChart({ entries, visaName }: ProcessingTrendChartProps) {
  // Filter for approved visas and sort by decision date
  const data = entries
    .filter(e => e.outcome === 'approved' && e.processing_days > 0)
    .sort((a, b) => new Date(a.decision_date).getTime() - new Date(b.decision_date).getTime())
    .map(e => ({
      date: new Date(e.decision_date).getTime(),
      days: e.processing_days,
      formattedDate: new Date(e.decision_date).toLocaleDateString(),
    }));

  if (data.length === 0) {
    return null;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-600" />
          Processing Time Trend
        </h2>
      </CardHeader>
      <CardBody>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
              <XAxis
                dataKey="date"
                domain={['auto', 'auto']}
                name="Date"
                tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
                type="number"
                stroke="#A3A3A3"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                dataKey="days"
                name="Days"
                unit="d"
                stroke="#A3A3A3"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-neutral-200 shadow-lg rounded-lg text-sm">
                        <p className="font-semibold text-neutral-900">{data.formattedDate}</p>
                        <p className="text-primary-600 font-bold">{data.days} days</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Scatter name={`${visaName} Approvals`} data={data} fill="#0ea5e9" line={{ stroke: '#0ea5e9', strokeWidth: 2 }} shape="circle" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-neutral-500 mt-4 text-center">
          Showing successful approvals over time. The trend line indicates moving average.
        </p>
      </CardBody>
    </Card>
  );
}
