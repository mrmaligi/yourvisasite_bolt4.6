import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, Calendar, DollarSign, Star, FileText, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function LawyerDashboardV2() {
  const [stats] = useState({
    clients: 45,
    consultations: 12,
    revenue: 12500,
    rating: 4.9,
  });

  const recentActivity = [
    { type: 'booking', message: 'New consultation booked with Sarah Johnson', time: '2 hours ago' },
    { type: 'document', message: 'Document uploaded by Mike Chen', time: '4 hours ago' },
    { type: 'review', message: 'New 5-star review received', time: '1 day ago' },
  ];

  const upcomingConsultations = [
    { client: 'Sarah Johnson', date: '2024-03-25', time: '10:00 AM', type: 'Partner Visa' },
    { client: 'Mike Chen', date: '2024-03-26', time: '2:00 PM', type: 'Skilled Migration' },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-600">Welcome back! Here's your practice overview.</p>
              </div>
              <Button variant="primary">
                <Calendar className="w-4 h-4 mr-2" />
                View Schedule
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Active Clients', value: stats.clients, icon: Users, color: 'bg-blue-100 text-blue-600' },
              { label: 'Consultations', value: stats.consultations, icon: Calendar, color: 'bg-green-100 text-green-600' },
              { label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'bg-purple-100 text-purple-600' },
              { label: 'Rating', value: stats.rating, icon: Star, color: 'bg-yellow-100 text-yellow-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Upcoming Consultations</h2>
                <Button variant="outline" size="sm">View All</Button>
              </div>

              <div className="space-y-4">
                {upcomingConsultations.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200">
                    <div>
                      <p className="font-medium text-slate-900">{c.client}</p>
                      <p className="text-sm text-slate-500">{c.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">{c.time}</p>
                      <p className="text-sm text-slate-500">{c.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
                <Button variant="outline" size="sm">View All</Button>
              </div>

              <div className="space-y-4">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200">
                    <div className="w-8 h-8 bg-blue-100 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900">{a.message}</p>
                      <p className="text-sm text-slate-500">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">Complete your profile</h3>
                <p className="text-blue-700">Add more details to attract more clients</p>
              </div>
              
              <Button variant="primary">
                Edit Profile
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
