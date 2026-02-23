import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { DollarSign, CreditCard, TrendingUp, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';

const fetchRevenue = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    totalRevenue: 45000,
    projectedRevenue: 52000,
    monthlyBreakdown: [
      { name: 'Jan', revenue: 4000, expenses: 1200 },
      { name: 'Feb', revenue: 3000, expenses: 1000 },
      { name: 'Mar', revenue: 5000, expenses: 1500 },
      { name: 'Apr', revenue: 4500, expenses: 1300 },
      { name: 'May', revenue: 6000, expenses: 2000 },
      { name: 'Jun', revenue: 5500, expenses: 1800 },
    ],
    sources: [
      { name: 'Consultations', value: 400 },
      { name: 'Retainers', value: 300 },
      { name: 'One-off Services', value: 300 },
    ],
  };
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export const RevenueAnalytics = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['lawyer-analytics-revenue'],
    queryFn: fetchRevenue,
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Revenue Analytics</h1>
          <p className="text-neutral-500 mt-1">Detailed breakdown of your earnings</p>
        </div>
        <Button variant="secondary">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full text-green-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Total Revenue (YTD)</p>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">${data?.totalRevenue}</h2>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Projected (EOY)</p>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">${data?.projectedRevenue}</h2>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full text-purple-600">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Avg. Transaction</p>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">$450</h2>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 h-96">
          <CardHeader>
            <h2 className="text-lg font-semibold">Revenue vs Expenses</h2>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.monthlyBreakdown}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#4F46E5" fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="expenses" stroke="#EF4444" fillOpacity={1} fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card className="h-96">
          <CardHeader>
            <h2 className="text-lg font-semibold">Revenue Sources</h2>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.sources}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data?.sources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {data?.sources.map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-neutral-600 dark:text-neutral-400">{entry.name}</span>
                  </div>
                  <span className="font-semibold text-neutral-900 dark:text-white">{entry.value}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </motion.div>
  );
};
