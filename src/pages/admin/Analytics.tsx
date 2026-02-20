import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Eye,
  Clock,
  Globe,
  Smartphone,
  Calendar,
  Download
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

const USER_GROWTH_DATA = [
  { name: 'Jan', users: 400, active: 240 },
  { name: 'Feb', users: 300, active: 139 },
  { name: 'Mar', users: 200, active: 980 },
  { name: 'Apr', users: 278, active: 390 },
  { name: 'May', users: 189, active: 480 },
  { name: 'Jun', users: 239, active: 380 },
  { name: 'Jul', users: 349, active: 430 },
];

const DEVICE_DATA = [
  { name: 'Mobile', value: 400, color: '#8b5cf6' },
  { name: 'Desktop', value: 300, color: '#ec4899' },
  { name: 'Tablet', value: 300, color: '#10b981' },
];

const TRAFFIC_SOURCE_DATA = [
  { name: 'Direct', value: 400 },
  { name: 'Social', value: 300 },
  { name: 'Organic', value: 300 },
  { name: 'Referral', value: 200 },
];

export function Analytics() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { count } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
      setTotalUsers(count || 0);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const metrics = [
    { label: 'Total Users', value: totalUsers.toLocaleString(), change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Page Views', value: '1.2M', change: '+5%', icon: Eye, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { label: 'Avg. Session', value: '4m 32s', change: '-2%', icon: Clock, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    { label: 'Bounce Rate', value: '42%', change: '+1%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Platform Analytics</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Traffic, engagement, and user behavior</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Last 30 Days
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardBody className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${metric.bg}`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <div>
                <p className="text-sm text-neutral-500">{metric.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-neutral-900 dark:text-white">{metric.value}</span>
                  <span className={`text-xs font-medium ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">User Growth & Activity</h2>
          </CardHeader>
          <CardBody>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={USER_GROWTH_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#A3A3A3" fontSize={12} />
                  <YAxis stroke="#A3A3A3" fontSize={12} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="users" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorUsers)" name="Total Users" />
                  <Area type="monotone" dataKey="active" stroke="#ec4899" fillOpacity={1} fill="url(#colorActive)" name="Active Users" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Device Distribution */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-neutral-500" />
              Device Usage
            </h2>
          </CardHeader>
          <CardBody>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DEVICE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {DEVICE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
         {/* Traffic Sources */}
         <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-neutral-500" />
              Traffic Sources
            </h2>
          </CardHeader>
          <CardBody>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TRAFFIC_SOURCE_DATA} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E5E5" />
                  <XAxis type="number" stroke="#A3A3A3" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#A3A3A3" fontSize={12} width={60} />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Top Pages Table */}
        <Card>
          <CardHeader>
             <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Top Pages</h2>
          </CardHeader>
          <CardBody className="p-0">
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                 <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 font-medium">
                   <tr>
                     <th className="px-6 py-3">Page Path</th>
                     <th className="px-6 py-3 text-right">Views</th>
                     <th className="px-6 py-3 text-right">Bounce</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                   {[
                     { path: '/visas/search', views: '45.2K', bounce: '32%' },
                     { path: '/lawyers', views: '32.1K', bounce: '28%' },
                     { path: '/pricing', views: '18.5K', bounce: '45%' },
                     { path: '/blog/visa-changes-2024', views: '12.3K', bounce: '65%' },
                     { path: '/dashboard', views: '10.2K', bounce: '12%' },
                   ].map((page, i) => (
                     <tr key={i} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                       <td className="px-6 py-3 font-medium text-neutral-900 dark:text-white">{page.path}</td>
                       <td className="px-6 py-3 text-right text-neutral-600 dark:text-neutral-400">{page.views}</td>
                       <td className="px-6 py-3 text-right text-neutral-600 dark:text-neutral-400">{page.bounce}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
