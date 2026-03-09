import { CheckSquare, Square, Clock, AlertCircle } from 'lucide-react';

export function UserChecklistV2() {
  const checklist = [
    { id: 1, task: 'Complete profile information', completed: true, category: 'Profile' },
    { id: 2, task: 'Upload passport copy', completed: true, category: 'Documents' },
    { id: 3, task: 'Upload birth certificate', completed: false, category: 'Documents' },
    { id: 4, task: 'Provide relationship evidence', completed: false, category: 'Documents' },
    { id: 5, task: 'Schedule consultation', completed: false, category: 'Meetings' },
    { id: 6, task: 'Pay application fee', completed: false, category: 'Payment' },
  ];

  const completed = checklist.filter(i => i.completed).length;
  const progress = Math.round((completed / checklist.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Application Checklist</h1>
          <p className="text-slate-400">Track your application requirements</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-slate-900">Overall Progress</span>
            <span className="font-bold text-blue-600">{progress}%</span>
          </div>
          <div className="h-3 bg-slate-100">
            <div className="h-full bg-blue-600" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm text-slate-500 mt-2">{completed} of {checklist.length} tasks completed</p>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {checklist.map((item) => (
              <div key={item.id} className="p-4 flex items-center gap-4">
                <button className="text-blue-600">
                  {item.completed ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                </button>
                
                <div className="flex-1">
                  <p className={`font-medium ${item.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{item.task}</p>
                  <p className="text-sm text-slate-500">{item.category}</p>
                </div>
                
                {!item.completed && <AlertCircle className="w-5 h-5 text-amber-500" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
