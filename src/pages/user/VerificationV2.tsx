import { Shield, FileCheck, Award, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserVerificationV2() {
  const steps = [
    { id: 1, title: 'Email Verification', description: 'Verify your email address', completed: true },
    { id: 2, title: 'Phone Verification', description: 'Verify your phone number', completed: true },
    { id: 3, title: 'Identity Verification', description: 'Upload government-issued ID', completed: false, current: true },
    { id: 4, title: 'Address Verification', description: 'Confirm your residential address', completed: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Account Verification</h1>
          <p className="text-slate-600">Complete verification to unlock all features</p>
        </div>

        <div className="bg-green-50 border border-green-200 p-4 mb-8 flex items-center gap-3">
          <Shield className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-medium text-green-900">50% Complete</p>
            <p className="text-sm text-green-700">Complete all steps to get the verified badge</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {steps.map((step) => (
              <div key={step.id} className={`p-6 ${step.current ? 'bg-blue-50' : ''}`}>
                <div className="flex items-start gap-4">
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
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{step.title}</p>
                    <p className="text-sm text-slate-600">{step.description}</p>
                  </div>
                  <div>
                    {step.completed ? (
                      <span className="text-sm text-green-600">Completed</span>
                    ) : step.current ? (
                      <Button variant="primary" size="sm">Complete</Button>
                    ) : (
                      <span className="text-sm text-slate-400">Locked</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-white border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-amber-600" />
            <h2 className="font-semibold text-slate-900">Benefits of Verification</h2>
          </div>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Faster application processing</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Priority customer support</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Access to premium features</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Verified badge on your profile</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
