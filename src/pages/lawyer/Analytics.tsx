import { Helmet } from 'react-helmet-async';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import { LawyerDashboardLayout } from '@/components/layout/LawyerDashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

const EARNINGS_DATA = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 3000 },
  { name: 'Mar', amount: 5000 },
  { name: 'Apr', amount: 4500 },
  { name: 'May', amount: 6000 },
  { name: 'Jun', amount: 5500 },
];

const CLIENTS_DATA = [
  { name: 'Jan', count: 12 },
  { name: 'Feb', count: 15 },
  { name: 'Mar', count: 18 },
  { name: 'Apr', count: 16 },
  { name: 'May', count: 22 },
  { name: 'Jun', count: 25 },
];

export function Analytics() {
  return (
    <LawyerDashboardLayout>
      <Helmet>
        <title>Practice Analytics | VisaBuild</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Track your practice performance and growth.</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardBody className="p-4 flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Total Revenue</p>
                <p className="text-xl font-bold text-neutral-900 dark:text-white">$28,000</p>
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12%
                </span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Active Clients</p>
                <p className="text-xl font-bold text-neutral-900 dark:text-white">25</p>
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +5%
                </span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4 flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Consultations</p>
                <p className="text-xl font-bold text-neutral-900 dark:text-white">48</p>
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +8%
                </span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4 flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Retention</p>
                <p className="text-xl font-bold text-neutral-900 dark:text-white">92%</p>
                <span className="text-xs text-neutral-500">Stable</span>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Revenue Growth</h2>
            </CardHeader>
            <CardBody>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={EARNINGS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                    <XAxis
                      dataKey="name"
                      stroke="#A3A3A3"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#A3A3A3"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                       cursor={{ fill: 'transparent' }}
                       contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Client Acquisition</h2>
            </CardHeader>
            <CardBody>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={CLIENTS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                    <XAxis
                      dataKey="name"
                      stroke="#A3A3A3"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#A3A3A3"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                       contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </LawyerDashboardLayout>
  );
}
