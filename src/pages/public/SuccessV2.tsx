import { CheckCircle, ArrowRight, FileText, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function SuccessV2() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Success!</h1>
          <p className="text-slate-600 mb-8">Your action has been completed successfully.</p>
          
          <div className="bg-slate-50 p-4 mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-slate-400" />
              <span className="font-medium">Application Submitted</span>
            </div>
            
            <p className="text-sm text-slate-500">Reference: APP-2024-5678</p>
          </div>
          
          <div className="space-y-3">
            <Button variant="primary" className="w-full">
              View Application
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button variant="outline" className="w-full">
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
