import { FileText, Clock, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';

export function VisaApplicationV2() {
  const steps = [
    { id: 1, name: 'Eligibility Check', status: 'completed', description: 'Confirm you meet the requirements' },
    { id: 2, name: 'Document Collection', status: 'in-progress', description: 'Gather required documents' },
    { id: 3, name: 'Application Form', status: 'pending', description: 'Complete the application' },
    { id: 4, name: 'Payment', status: 'pending', description: 'Pay the visa fee' },
    { id: 5, name: 'Submission', status: 'pending', description: 'Submit your application' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Visa Application</h1>
          <p className="text-slate-400">Partner Visa (820/801)</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium text-slate-900">Application Progress</span>
            <span className="font-bold text-blue-600">20%</span>
          </div>
          <div className="h-3 bg-slate-100">
            <div className="h-full bg-blue-600 w-1/5" />
          </div>
        </div>

        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="bg-white border border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 flex items-center justify-center ${
                  step.status === 'completed' ? 'bg-green-100' :
                  step.status === 'in-progress' ? 'bg-blue-100' :
                  'bg-slate-100'
                }`}>
                  {step.status === 'completed' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                   step.status === 'in-progress' ? <Clock className="w-5 h-5 text-blue-600" /> :
                   <span className="font-bold text-slate-400">{step.id}</span>}
                </div>
                
                <div className="flex-1">
                  <p className={`font-semibold ${step.status === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>{step.name}</p>
                  <p className="text-sm text-slate-500">{step.description}</p>
                </div>
                
                <button className="p-2 text-slate-400 hover:text-blue-600"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
