import { FileText, FileUp, FileCheck, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicResetPasswordV2() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 mx-auto mb-4 flex items-center justify-center">
            <FileCheck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
          <p className="text-slate-600 mt-2">Enter your email to receive reset instructions</p>
        </div>

        <div className="bg-white border border-slate-200 p-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input type="email" placeholder="you@example.com" className="w-full px-3 py-2 border border-slate-200" />
            </div>

            <Button variant="primary" className="w-full">
              Send Reset Link
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="/login" className="text-blue-600 hover:underline">Back to login</a>
        </div>
      </div>
    </div>
  );
}
