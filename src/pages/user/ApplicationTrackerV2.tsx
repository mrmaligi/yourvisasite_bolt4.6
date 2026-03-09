import { FileText, CheckSquare, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ApplicationTrackerV2() {
  const stages = [
    { name: 'Application Submitted', status: 'completed', date: 'Mar 1, 2024' },
    { name: 'Documents Reviewed', status: 'completed', date: 'Mar 5, 2024' },
    { name: 'Biometrics Requested', status: 'in-progress', date: 'Mar 10, 2024' },
    { name: 'Under Assessment', status: 'pending', date: null },
    { name: 'Decision Made', status: 'pending', date: null },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Application Tracker</h1>
          <p className="text-slate-400">Track your visa application progress</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-500">Application ID</p>
              <p className="text-xl font-bold text-slate-900">#APP-2024-001</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-slate-500">Status</p>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium">In Progress</span>
            </div>
          </div>
          
          <div className="h-2 bg-slate-100">
            <div className="h-full bg-blue-600 w-3/5" />
          </div>
          <p className="text-sm text-slate-500 mt-2">60% complete - Estimated completion: May 2024</p>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {stages.map((stage, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <div className={`w-10 h-10 flex items-center justify-center ${
                  stage.status === 'completed' ? 'bg-green-100' :
                  stage.status === 'in-progress' ? 'bg-blue-100' :
                  'bg-slate-100'
                }`}>
                  {stage.status === 'completed' ? <CheckSquare className="w-5 h-5 text-green-600" /> :
                   stage.status === 'in-progress' ? <Clock className="w-5 h-5 text-blue-600" /> :
                   <div className="w-5 h-5 border-2 border-slate-300" />}
                </div>
                
                <div className="flex-1">
                  <p className={`font-medium ${
                    stage.status === 'pending' ? 'text-slate-400' : 'text-slate-900'
                  }`}>{stage.name}</p>
                  {stage.date && <p className="text-sm text-slate-500">{stage.date}</p>}
                </div>
                
                <span className={`text-sm ${
                  stage.status === 'completed' ? 'text-green-600' :
                  stage.status === 'in-progress' ? 'text-blue-600' :
                  'text-slate-400'
                }`}>
                  {stage.status === 'completed' ? 'Completed' :
                   stage.status === 'in-progress' ? 'In Progress' :
                   'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
