import { FileText, CheckCircle, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ApplicationStatusV2() {
  const timeline = [
    { step: 1, title: 'Application Submitted', date: 'Mar 1, 2024', status: 'completed', description: 'Your application has been received' },
    { step: 2, title: 'Payment Confirmed', date: 'Mar 1, 2024', status: 'completed', description: 'Payment of $7,850 received' },
    { step: 3, title: 'Documents Received', date: 'Mar 5, 2024', status: 'completed', description: 'All required documents uploaded' },
    { step: 4, title: 'Under Review', date: 'Mar 10, 2024', status: 'in-progress', description: 'Your application is being assessed' },
    { step: 5, title: 'Decision', date: 'Pending', status: 'pending', description: 'Final decision will be notified' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Application Status</h1>
          <p className="text-slate-400">Track your visa application progress</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-500">Application ID</p>
              <p className="text-xl font-bold text-slate-900">#APP-2024-5678</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Current Status</p>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium">Under Review</span>
            </div>
          </div>
          
          <div className="h-2 bg-slate-100">
            <div className="h-full bg-blue-600 w-3/5" />
          </div>
          <p className="text-sm text-slate-500 mt-2">60% complete • Estimated completion: June 2024</p>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {timeline.map((item) => (
              <div key={item.step} className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 flex items-center justify-center ${
                    item.status === 'completed' ? 'bg-green-100' :
                    item.status === 'in-progress' ? 'bg-blue-100' :
                    'bg-slate-100'
                  }`}>
                    {item.status === 'completed' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                     item.status === 'in-progress' ? <Clock className="w-5 h-5 text-blue-600" /> :
                     <div className="w-5 h-5 border-2 border-slate-300" />}
                  </div>
                  
                  <div className="flex-1">
                    <p className={`font-semibold ${item.status === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>{item.title}</p>
                    <p className="text-sm text-slate-500">{item.date}</p>
                    <p className="text-slate-600 mt-1">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
