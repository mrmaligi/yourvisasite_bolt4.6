import { Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';

export function ApplicationStatusV2() {
  const steps = [
    { name: 'Application Submitted', status: 'completed', date: 'Mar 1, 2024' },
    { name: 'Documents Received', status: 'completed', date: 'Mar 5, 2024' },
    { name: 'Under Review', status: 'in-progress', date: 'Mar 10, 2024' },
    { name: 'Decision', status: 'pending', date: null },
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
        <div className="bg-white border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-500">Application ID</p>
              <p className="text-xl font-bold text-slate-900">#APP-2024-5678</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-slate-500">Status</p>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium">In Progress</span>
            </div>
          </div>
          
          <div className="h-2 bg-slate-100">
            <div className="h-full bg-blue-600 w-3/5" />
          </div>
          <p className="text-sm text-slate-500 mt-2">60% complete • Estimated: June 2024</p>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {steps.map((step, i) => (
              <div key={i} className="p-6 flex items-start gap-4">
                <div className={`w-10 h-10 flex items-center justify-center ${
                  step.status === 'completed' ? 'bg-green-100' :
                  step.status === 'in-progress' ? 'bg-blue-100' :
                  'bg-slate-100'
                }`}>
                  {step.status === 'completed' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                   step.status === 'in-progress' ? <Clock className="w-5 h-5 text-blue-600" /> :
                   <div className="w-5 h-5 border-2 border-slate-300" />}
                </div>
                
                <div className="flex-1">
                  <p className={`font-semibold ${step.status === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>{step.name}</p>
                  {step.date && <p className="text-sm text-slate-500">{step.date}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
