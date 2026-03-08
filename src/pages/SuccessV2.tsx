import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Download, Calendar, XCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function SuccessV2() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const type = searchParams.get('type');
  const [loading, setLoading] = useState(true);

  const isConsultation = type === 'consultation';

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Invalid Request</h1>
          <p className="text-slate-600 mb-8">No payment session found.</p>
          <Link to="/"><Button variant="primary">Return Home</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Success | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {isConsultation ? 'Consultation Booked!' : 'Payment Successful!'}
            </h1>
            <p className="text-lg text-slate-600">
              {isConsultation
                ? 'Your consultation has been confirmed.'
                : 'Thank you for your purchase. Your access is now active.'}
            </p>
          </div>

          {/* Order Summary - SQUARE */}
          <div className="bg-white border border-slate-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Product:</span>
                <span className="font-medium">{isConsultation ? 'Lawyer Consultation' : 'VisaBuild Premium'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Status:</span>
                <span className="text-green-600 font-medium">Completed</span>
              </div>
            </div>
          </div>

          {/* Action Cards - SQUARE */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-slate-200 p-6">
              <div className="w-10 h-10 bg-blue-100 flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Manage Booking</h3>
              <p className="text-slate-600 text-sm mb-4">View details or reschedule.</p>
              <Link to="/dashboard/consultations">
                <Button variant="outline" className="w-full">
                  View Consultations
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <div className="w-10 h-10 bg-blue-100 flex items-center justify-center mb-4">
                <Download className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Access Content</h3>
              <p className="text-slate-600 text-sm mb-4">Browse guides and resources.</p>
              <Link to="/dashboard/my-visas">
                <Button variant="outline" className="w-full">
                  View My Visas
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-center">
            <Link to="/dashboard">
              <Button variant="primary">
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
