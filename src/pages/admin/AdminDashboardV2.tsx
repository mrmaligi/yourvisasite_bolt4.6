import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, Briefcase, TrendingUp, DollarSign, AlertTriangle, CheckCircle, Bell } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function AdminDashboardV2() {
  const [stats] = useState({
    totalUsers: 1250,
    totalLawyers: 45,
    pendingVerifications: 8,
    totalRevenue: 45000,
  });

  const recentActivity = [
    { type: 'user', message: 'New user registered: john@example.com', time: '2 min ago' },
    { type: 'lawyer', message: 'Lawyer verified: Jane Doe', time: '15 min ago' },
    { type: 'alert', message: 'High priority abuse report', time: '1 hour ago' },
  ];

  const pendingTasks = [
    { label: 'Pending Verifications', count: 8, icon: Briefcase },
    { label: 'Abuse Reports', count: 3, icon: AlertTriangle },
    { label: 'Support Tickets', count: 12, icon: Bell },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-slate-600">Welcome back! Here's what's happening today.</p>
              </div>
              <Button variant="primary">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-100 text-blue-600' },
              { label: 'Lawyers', value: stats.totalLawyers, icon: Briefcase, color: 'bg-green-100 text-green-600' },
              { label: 'Pending', value: stats.pendingVerifications, icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-600' },
              { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-purple-100 text-purple-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
              
              <div className="space-y-3">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200">
                    <div className="w-8 h-8 bg-blue-100 flex items-center justify-center">
                      {item.type === 'user' && <Users className="w-4 h-4 text-blue-600" />}
                      {item.type === 'lawyer' && <CheckCircle className="w-4 h-4 text-green-600" />}
                      {item.type === 'alert' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900">{item.message}</p>
                      <p className="text-sm text-slate-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Pending Tasks</h2>
              
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <div key={task.label} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-100 flex items-center justify-center">
                        <task.icon className="w-4 h-4 text-amber-600" />
                      </div>
                      <span className="text-slate-700">{task.label}</span>
                    </div>
                    
                    <Badge variant="warning">{task.count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Platform Growth</h3>
                  <p className="text-blue-700">User registrations up 25% this month</p>
                </div>
              </div>
              <Button variant="outline">View Report</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
