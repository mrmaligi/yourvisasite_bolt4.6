import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { TrendingUp, Users, Eye, Download, Briefcase, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const USER_GROWTH = [
  { month: 'Jan', users: 120 },
  { month: 'Feb', users: 180 },
  { month: 'Mar', users: 250 },
  { month: 'Apr', users: 320 },
  { month: 'May', users: 450 },
  { month: 'Jun', users: 580 },
];

const VISA_CATEGORIES = [
  { name: 'Work', value: 35 },
  { name: 'Family', value: 25 },
  { name: 'Student', value: 20 },
  { name: 'Visitor', value: 15 },
  { name: 'Other', value: 5 },
];

export function AnalyticsV2() {
  const [timeRange, setTimeRange] = useState('30');

  const stats = {
    totalUsers: 1250,
    totalLawyers: 45,
    totalBookings: 320,
    totalVisas: 85,
    pageViews: 12500,
  };

  return (
    <>
      <Helmet>
        <title>Analytics | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
                <p className="text-slate-600">Platform performance insights</p>
              </div>
              <div className="flex gap-2">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 border border-slate-200"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-100 text-blue-600' },
              { label: 'Lawyers', value: stats.totalLawyers, icon: Briefcase, color: 'bg-green-100 text-green-600' },
              { label: 'Bookings', value: stats.totalBookings, icon: FileText, color: 'bg-purple-100 text-purple-600' },
              { label: 'Page Views', value: stats.pageViews.toLocaleString(), icon: Eye, color: 'bg-amber-100 text-amber-600' },
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
              <h2 className="text-lg font-semibold text-slate-900 mb-4">User Growth</h2>
              
              <div className="space-y-3">
                {USER_GROWTH.map((d) => (
                  <div key={d.month} className="flex items-center gap-3">
                    <span className="w-8 text-sm text-slate-600">{d.month}</span>
                    <div className="flex-1 h-6 bg-slate-100">
                      <div 
                        className="h-full bg-blue-500"
                        style={{ width: `${(d.users / 600) * 100}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-sm font-medium text-slate-900">
                      {d.users}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Visa Categories</h2>
              
              <div className="space-y-3">
                {VISA_CATEGORIES.map((c) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <span className="w-20 text-sm text-slate-600">{c.name}</span>
                    <div className="flex-1 h-6 bg-slate-100">
                      <div 
                        className="h-full bg-purple-500"
                        style={{ width: `${c.value}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-sm font-medium text-slate-900">
                      {c.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Top Performing Content</h2>
            
            <div className="space-y-4">
              {[
                { name: 'Partner Visa Guide', views: 4500, type: 'Guide' },
                { name: 'Skilled Migration Checklist', views: 3200, type: 'Checklist' },
                { name: 'Student Visa FAQ', views: 2800, type: 'FAQ' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">{item.views.toLocaleString()} views</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
