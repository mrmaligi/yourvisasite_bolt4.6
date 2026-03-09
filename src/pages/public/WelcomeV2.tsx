import { CheckCircle, FileText, Mail, ArrowRight } from 'lucide-react';

export function PublicWelcomeV2() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 mx-auto mb-6 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-4">Welcome to VisaBuild!</h1>
        <p className="text-slate-600 mb-8">Your account has been successfully created. Let's get started on your visa journey.</p>

        <div className="bg-white border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Verify your email</p>
              <p className="text-sm text-slate-500">Check your inbox for a verification link</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Complete your profile</p>
              <p className="text-sm text-slate-500">Add your details for personalized help</p>
            </div>
          </div>
        </div>

        <button className="w-full py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
          Get Started
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
