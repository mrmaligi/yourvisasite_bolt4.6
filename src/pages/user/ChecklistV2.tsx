import { FileText, CheckCircle, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserChecklistV2() {
  const checklist = [
    { id: 1, item: 'Complete profile information', category: 'Profile', completed: true, priority: 'high' },
    { id: 2, item: 'Upload passport copy', category: 'Documents', completed: true, priority: 'high' },
    { id: 3, item: 'Upload birth certificate', category: 'Documents', completed: false, priority: 'high' },
    { id: 4, item: 'Provide relationship evidence', category: 'Documents', completed: false, priority: 'high' },
    { id: 5, item: 'Complete health examination', category: 'Health', completed: false, priority: 'medium' },
    { id: 6, item: 'Obtain police clearance', category: 'Security', completed: false, priority: 'medium' },
    { id: 7, item: 'Book consultation with lawyer', category: 'Consultation', completed: true, priority: 'low' },
  ];

  const completed = checklist.filter(i => i.completed).length;
  const total = checklist.length;
  const progress = Math.round((completed / total) * 100);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Application Checklist</h1>
          <p className="text-slate-600">Track your application requirements</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-600">Overall Progress</p>
              <p className="text-3xl font-bold text-slate-900">{progress}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Completed</p>
              <p className="text-xl font-semibold text-slate-900">{completed}/{total}</p>
            </div>
          </div>
          <div className="h-3 bg-slate-100">
            <div className="h-3 bg-green-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {checklist.map((item) => (
              <div key={item.id} className={`p-4 flex items-center gap-4 ${item.completed ? 'bg-slate-50' : ''}`}>
                <button className={`w-6 h-6 border-2 flex items-center justify-center ${
                  item.completed ? 'bg-green-500 border-green-500' : 'border-slate-300'
                }`}>
                  {item.completed && <CheckCircle className="w-4 h-4 text-white" />}
                </button>
                
                <div className="flex-1">
                  <p className={`font-medium ${item.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                    {item.item}
                  </p>
                  <p className="text-sm text-slate-500">{item.category}</p>
                </div>
                
                <span className={`px-2 py-1 text-xs font-medium ${
                  item.priority === 'high' ? 'bg-red-100 text-red-700' :
                  item.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
