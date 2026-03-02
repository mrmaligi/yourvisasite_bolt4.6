import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BarChart as BarChartIcon, TrendingUp, Users, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';

const fetchAnalytics = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    overview: {
      revenue: 12500,
      clients: 45,
      consultations: 28,
      growth: 15,
    },
    monthlyData: [
      { name: 'Jan', revenue: 4000 },
      { name: 'Feb', revenue: 3000 },
      { name: 'Mar', revenue: 2000 },
      { name: 'Apr', revenue: 2780 },
      { name: 'May', revenue: 1890 },
      { name: 'Jun', revenue: 2390 },
    ],
  };
};

export const PracticeAnalytics = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['lawyer-analytics-practice'],
    queryFn: fetchAnalytics,
  });

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Practice Analytics</h1>
          <p className="text-neutral-500 mt-1">Overview of your practice performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `$${data?.overview.revenue}`, icon: DollarSign, color: 'text-green-600' },
          { label: 'Active Clients', value: data?.overview.clients, icon: Users, color: 'text-blue-600' },
          { label: 'Consultations', value: data?.overview.consultations, icon: BarChartIcon, color: 'text-purple-600' },
          { label: 'Growth', value: `+${data?.overview.growth}%`, icon: TrendingUp, color: 'text-emerald-600' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardBody className="flex items-center gap-4">
              <div className={`p-3 rounded-full bg-neutral-100 dark:bg-neutral-800 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">{stat.label}</p>
                <p className="text-xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card className="h-96">
        <CardHeader>
          <h2 className="text-lg font-semibold">Revenue Trend</h2>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                cursor={{ fill: '#F3F4F6' }}
              />
              <Bar dataKey="revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </motion.div>
  );
};
