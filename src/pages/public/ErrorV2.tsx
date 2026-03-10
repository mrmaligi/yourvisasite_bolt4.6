import { AlertTriangle, XCircle, CheckCircle, Info } from 'lucide-react';

export function ErrorV2() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 bg-red-100 mx-auto mb-6 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Something Went Wrong</h1>
        <p className="text-slate-600 mb-8">We apologize for the inconvenience. An unexpected error has occurred.</p>
        
        <div className="bg-white border border-slate-200 p-4 mb-8 text-left">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-500">Error Code: 500</span>
          </div>
        </div>
        
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-blue-600 text-white">
            Go Home
          </button>
          
          <button className="px-6 py-3 border border-slate-200">
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
