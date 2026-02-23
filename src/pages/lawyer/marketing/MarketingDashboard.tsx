import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Eye, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';

const fetchMarketingStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    overview: {
      leads: 150,
      views: 1200,
      conversion: '12.5%',
      roi: '350%',
    },
    traffic: [
      { name: 'Mon', visits: 120 },
      { name: 'Tue', visits: 150 },
      { name: 'Wed', visits: 180 },
      { name: 'Thu', visits: 140 },
      { name: 'Fri', visits: 160 },
      { name: 'Sat', visits: 90 },
      { name: 'Sun', visits: 80 },
    ],
  };
};

export const MarketingDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['lawyer-marketing-stats'],
    queryFn: fetchMarketingStats,
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Marketing Dashboard</h1>
          <p className="text-neutral-500 mt-1">Track your growth and outreach</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: data?.overview.leads, icon: Users, color: 'text-blue-600' },
          { label: 'Profile Views', value: data?.overview.views, icon: Eye, color: 'text-purple-600' },
          { label: 'Conversion Rate', value: data?.overview.conversion, icon: Target, color: 'text-green-600' },
          { label: 'Marketing ROI', value: data?.overview.roi, icon: TrendingUp, color: 'text-orange-600' },
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
          <h2 className="text-lg font-semibold">Traffic Overview (Last 7 Days)</h2>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.traffic}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip />
              <Area type="monotone" dataKey="visits" stroke="#8884d8" fillOpacity={1} fill="url(#colorVisits)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </motion.div>
  );
};
