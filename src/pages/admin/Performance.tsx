import { useState } from 'react';
import {
  Activity,
  Cpu,
  Database,
  Server,
  Globe,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const PERFORMANCE_DATA = [
  { time: '00:00', cpu: 12, memory: 45, latency: 120 },
  { time: '04:00', cpu: 15, memory: 48, latency: 130 },
  { time: '08:00', cpu: 45, memory: 60, latency: 250 },
  { time: '12:00', cpu: 65, memory: 72, latency: 450 },
  { time: '16:00', cpu: 55, memory: 68, latency: 320 },
  { time: '20:00', cpu: 30, memory: 55, latency: 180 },
  { time: '23:59', cpu: 18, memory: 48, latency: 140 },
];

const API_REQUESTS_DATA = [
  { time: '00:00', requests: 1200, errors: 2 },
  { time: '04:00', requests: 800, errors: 0 },
  { time: '08:00', requests: 4500, errors: 12 },
  { time: '12:00', requests: 8200, errors: 45 },
  { time: '16:00', requests: 6400, errors: 28 },
  { time: '20:00', requests: 3200, errors: 8 },
  { time: '23:59', requests: 1500, errors: 4 },
];

export function Performance() {
  const [timeRange, setTimeRange] = useState('24h');

  const services = [
    { name: 'API Gateway', status: 'healthy', uptime: '99.99%', latency: '45ms' },
    { name: 'Auth Service', status: 'healthy', uptime: '99.95%', latency: '120ms' },
    { name: 'Database Primary', status: 'healthy', uptime: '100%', latency: '12ms' },
    { name: 'Storage Service', status: 'degraded', uptime: '98.5%', latency: '850ms' },
    { name: 'Edge Functions', status: 'healthy', uptime: '99.9%', latency: '240ms' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">System Performance</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Monitor infrastructure health and metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => window.location.reload()} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-1 border border-neutral-200 dark:border-neutral-700 flex">
            {['1h', '24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  timeRange === range
                    ? 'bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Service Status Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {services.map((service) => (
          <Card key={service.name} className={service.status === 'degraded' ? 'border-yellow-200 dark:border-yellow-800' : ''}>
            <CardBody className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${service.status === 'healthy' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30'}`}>
                  <Server className="w-4 h-4" />
                </div>
                <div className={`w-2 h-2 rounded-full ${service.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-white text-sm truncate">{service.name}</h3>
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-neutral-500">Uptime</span>
                <span className="font-medium text-neutral-900 dark:text-white">{service.uptime}</span>
              </div>
              <div className="flex justify-between mt-1 text-xs">
                <span className="text-neutral-500">Latency</span>
                <span className="font-medium text-neutral-900 dark:text-white">{service.latency}</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Resource Usage Chart */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-neutral-500" />
              Resource Usage (CPU & Memory)
            </h2>
          </CardHeader>
          <CardBody>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PERFORMANCE_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#A3A3A3" fontSize={12} />
                  <YAxis stroke="#A3A3A3" fontSize={12} unit="%" />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="cpu" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorCpu)" name="CPU Load" />
                  <Area type="monotone" dataKey="memory" stroke="#10b981" fillOpacity={1} fill="url(#colorMem)" name="Memory Usage" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* API Performance Chart */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-neutral-500" />
              API Performance
            </h2>
          </CardHeader>
          <CardBody>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={API_REQUESTS_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="time" stroke="#A3A3A3" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#A3A3A3" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#ef4444" fontSize={12} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} name="Requests/min" dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2} name="Errors/min" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-neutral-500" />
            Active Alerts
          </h2>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Severity</th>
                  <th className="px-6 py-3">Service</th>
                  <th className="px-6 py-3">Message</th>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="px-6 py-3">
                    <Badge variant="warning">High</Badge>
                  </td>
                  <td className="px-6 py-3 font-medium text-neutral-900 dark:text-white">Storage Service</td>
                  <td className="px-6 py-3 text-neutral-600 dark:text-neutral-300">High latency detected (&gt;500ms)</td>
                  <td className="px-6 py-3 text-neutral-500">10 mins ago</td>
                  <td className="px-6 py-3 text-right">
                    <span className="text-yellow-600 font-medium text-xs">Investigating</span>
                  </td>
                </tr>
                <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="px-6 py-3">
                    <Badge variant="secondary">Info</Badge>
                  </td>
                  <td className="px-6 py-3 font-medium text-neutral-900 dark:text-white">Database</td>
                  <td className="px-6 py-3 text-neutral-600 dark:text-neutral-300">Backup completed successfully</td>
                  <td className="px-6 py-3 text-neutral-500">2 hours ago</td>
                  <td className="px-6 py-3 text-right">
                    <span className="text-green-600 font-medium text-xs flex items-center justify-end gap-1">
                      <CheckCircle className="w-3 h-3" /> Resolved
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
