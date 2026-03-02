import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { TrendingUp } from 'lucide-react';

const data = [
  { name: 'Jan', applicants: 400, approvals: 240 },
  { name: 'Feb', applicants: 300, approvals: 139 },
  { name: 'Mar', applicants: 200, approvals: 980 },
  { name: 'Apr', applicants: 278, approvals: 390 },
  { name: 'May', applicants: 189, approvals: 480 },
  { name: 'Jun', applicants: 239, approvals: 380 },
  { name: 'Jul', applicants: 349, approvals: 430 },
];

export function VisaTrendsChart() {
  return (
    <Card className="h-full border-blue-100 dark:border-blue-900">
      <CardHeader>
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Visa Trends
        </h2>
      </CardHeader>
      <CardBody>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Area type="monotone" dataKey="applicants" stackId="1" stroke="#3b82f6" fill="#93c5fd" />
              <Area type="monotone" dataKey="approvals" stackId="1" stroke="#2563eb" fill="#3b82f6" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-neutral-500 mt-4 text-center">
          Showing mock visa application and approval trends for the last 6 months.
        </p>
      </CardBody>
    </Card>
  );
}
