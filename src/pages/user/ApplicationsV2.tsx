import { Briefcase, Plus, MapPin, DollarSign, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserApplicationsV2() {
  const applications = [
    { id: 1, visa: 'Partner Visa (820/801)', status: 'in_progress', progress: 65, submitted: '2024-03-15', lawyer: 'Jane Smith' },
    { id: 2, visa: 'Skilled Independent (189)', status: 'draft', progress: 30, submitted: '-', lawyer: 'Not assigned' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
            <p className="text-slate-600">Track and manage your visa applications</p>
          </div>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            New Application
          </Button>
        </div>

        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white border border-slate-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{app.visa}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <span>Submitted: {app.submitted}</span>
                      <span>Lawyer: {app.lawyer}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 text-xs font-medium ${
                    app.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {app.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-600">Progress</span>
                  <span className="font-medium text-slate-900">{app.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100">
                  <div className="h-2 bg-blue-600" style={{ width: `${app.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
