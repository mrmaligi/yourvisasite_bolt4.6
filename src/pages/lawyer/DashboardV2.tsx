import { Video, Calendar, User, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function LawyerDashboardV2() {
  const stats = [
    { label: 'Active Cases', value: 24 },
    { label: 'New Leads', value: 8 },
    { label: 'This Week', value: 5 },
    { label: 'Earnings', value: '$12,450' },
  ];

  const upcoming = [
    { client: 'John Doe', time: '10:00 AM', type: 'Video Call' },
    { client: 'Jane Smith', time: '2:00 PM', type: 'In Person' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Lawyer Dashboard</h1>
          <p className="text-slate-400">Welcome back, manage your practice</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 p-4">
              <p className="text-sm text-slate-600">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Today's Schedule</h2>
            
            <div className="space-y-3">
              {upcoming.map((apt, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{apt.client}</p>
                      <p className="text-sm text-slate-500">{apt.type}</p>
                    </div>
                  </div>
                  <span className="text-slate-600">{apt.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Quick Actions</h2>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">View Cases</Button>
              <Button variant="outline" className="w-full justify-start">New Consultation</Button>
              <Button variant="outline" className="w-full justify-start">Client Messages</Button>
              <Button variant="outline" className="w-full justify-start">Update Availability</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
