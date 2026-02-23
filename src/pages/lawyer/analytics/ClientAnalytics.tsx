import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, UserPlus, UserMinus, BarChart } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';

const fetchClientStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    totalClients: 150,
    newClientsThisMonth: 12,
    churnRate: '2%',
    demographics: [
      { name: '18-25', count: 20 },
      { name: '26-35', count: 45 },
      { name: '36-45', count: 35 },
      { name: '46-60', count: 25 },
      { name: '60+', count: 10 },
    ],
    acquisitionChannels: [
      { name: 'Website', value: 40 },
      { name: 'Referral', value: 30 },
      { name: 'Social', value: 20 },
      { name: 'Other', value: 10 },
    ],
  };
};

export const ClientAnalytics = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['lawyer-analytics-clients'],
    queryFn: fetchClientStats,
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Client Analytics</h1>
          <p className="text-neutral-500 mt-1">Understand your client base</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Total Clients', value: data?.totalClients, icon: Users, color: 'text-blue-600' },
          { label: 'New This Month', value: data?.newClientsThisMonth, icon: UserPlus, color: 'text-green-600' },
          { label: 'Churn Rate', value: data?.churnRate, icon: UserMinus, color: 'text-red-600' },
          { label: 'Avg Lifetime', value: '8 mos', icon: BarChart, color: 'text-purple-600' },
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

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="h-96">
          <CardHeader>
            <h2 className="text-lg font-semibold">Client Demographics (Age)</h2>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={data?.demographics} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={50} />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card className="h-96">
          <CardHeader>
            <h2 className="text-lg font-semibold">Acquisition Channels</h2>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={data?.acquisitionChannels}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} barSize={40} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
    </motion.div>
  );
};
