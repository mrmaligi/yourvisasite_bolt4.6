import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Clock, Mail, Scale, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function LawyerPendingV2() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Registration Pending | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-slate-200 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">Registration Submitted</h1>

            <p className="text-slate-600 mb-6">Your lawyer registration is pending admin verification.</p>

            <div className="bg-slate-50 border border-slate-200 p-4 mb-6 space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Scale className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Verification in Progress</p>
                  <p className="text-sm text-slate-600 mt-1">Our admin team is reviewing your credentials and verification documents.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Email Notification</p>
                  <p className="text-sm text-slate-600 mt-1">You will receive an email once your application is approved.</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-500 mb-6">Verification typically takes 1-3 business days.</p>

            <div className="flex flex-col gap-3">
              <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
