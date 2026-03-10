import { FileText, CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ApplicationFormV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Visa Application</h1>
          <p className="text-slate-400">Partner Visa (820/801)</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-8">
          <div className="flex items-center gap-4 mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 flex items-center justify-center ${
                  step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {step}
                </div>
                {step < 4 && <div className="w-8 h-0.5 bg-slate-200 mx-2" />}
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold text-slate-900 mb-6">Personal Information</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-200" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-200" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth *</label>
              <input type="date" className="w-full px-3 py-2 border border-slate-200" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Passport Number *</label>
              <input type="text" className="w-full px-3 py-2 border border-slate-200" />
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline">Save Draft</Button>
              <Button variant="primary">Continue</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
