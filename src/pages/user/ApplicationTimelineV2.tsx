import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export function ApplicationTimelineV2() {
  const steps = [
    { id: 1, title: 'Application Submitted', description: 'Your application has been received', completed: true, date: '2024-03-15' },
    { id: 2, title: 'Documents Uploaded', description: 'All required documents received', completed: true, date: '2024-03-16' },
    { id: 3, title: 'Under Review', description: 'Immigration officer reviewing', completed: false, current: true, date: 'In progress' },
    { id: 4, title: 'Decision Made', description: 'Final decision on your application', completed: false, date: 'Pending' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Application Timeline</h1>
          <p className="text-slate-600">Track your visa application progress</p>
        </div>

        <div className="bg-white border border-slate-200 p-6">
          <div className="space-y-0">
            {steps.map((step, index) => (
              <div key={step.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 flex items-center justify-center ${
                    step.completed ? 'bg-green-100' : step.current ? 'bg-blue-100' : 'bg-slate-100'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : step.current ? (
                      <Clock className="w-5 h-5 text-blue-600" />
                    ) : (
                      <div className="w-3 h-3 bg-slate-300" />
                    )}
                  </div>
                  {index < steps.length - 1 && <div className="w-0.5 h-16 bg-slate-200 my-2" />}
                </div>
                <div className="pb-8">
                  <p className="font-semibold text-slate-900">{step.title}</p>
                  <p className="text-sm text-slate-600">{step.description}</p>
                  <p className="text-xs text-slate-400 mt-1">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
