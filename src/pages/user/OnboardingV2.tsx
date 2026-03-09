import { Zap, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserOnboardingV2() {
  const steps = [
    { id: 1, title: 'Complete your profile', description: 'Add your personal information', completed: true },
    { id: 2, title: 'Verify your email', description: 'Check your inbox for verification link', completed: true },
    { id: 3, title: 'Upload ID documents', description: 'Passport or driver license', completed: false },
    { id: 4, title: 'Explore visa options', description: 'Find the right visa for you', completed: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 mx-auto mb-4 flex items-center justify-center">
            <Zap className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome to VisaBuild!</h1>
          <p className="text-slate-600">Let's get you set up in just a few steps</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 mb-6">
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${
                  step.completed ? 'bg-green-100' : 'bg-slate-100'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <span className="text-slate-600 font-medium">{step.id}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${step.completed ? 'text-slate-500' : 'text-slate-900'}`}>{step.title}</p>
                  <p className="text-sm text-slate-500">{step.description}</p>
                </div>
                
                {!step.completed && (
                  <Button variant="outline" size="sm">
                    Start
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <p className="text-sm text-blue-700">Completing your profile helps us provide better recommendations for your visa journey.</p>
        </div>
      </div>
    </div>
  );
}
