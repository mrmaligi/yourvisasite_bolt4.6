import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Download, Calendar, Scale, XCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const type = searchParams.get('type');
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const isConsultation = type === 'consultation';

  useEffect(() => {
    if (sessionId) {
      // In a real app, we might verify the session here
      setTimeout(() => {
        setOrderDetails({
          amount: isConsultation ? 'Variable' : 49.00,
          currency: 'AUD',
          product: isConsultation ? 'Lawyer Consultation' : 'VisaBuild Premium'
        });
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [sessionId, isConsultation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Invalid Request</h1>
          <p className="text-gray-600 mb-8">No payment session found.</p>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isConsultation ? 'Consultation Booked!' : 'Payment Successful!'}
          </h1>
          <p className="text-lg text-gray-600">
            {isConsultation
              ? 'Your consultation has been confirmed. You will receive a confirmation email shortly.'
              : 'Thank you for your purchase. Your premium access is now active.'}
          </p>
        </div>

        {orderDetails && (
          <Card className="mb-8 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Product:</span>
                <span className="font-medium">{orderDetails.product}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">
                  {typeof orderDetails.amount === 'number'
                    ? `A$${orderDetails.amount.toFixed(2)}`
                    : orderDetails.amount} {orderDetails.currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-medium">Completed</span>
              </div>
            </div>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            {isConsultation ? (
              <>
                <Calendar className="w-8 h-8 text-indigo-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Manage Your Booking
                </h3>
                <p className="text-gray-600 mb-4">
                  View details, add to calendar, or reschedule your consultation.
                </p>
                <Link to="/dashboard/consultations">
                  <Button variant="secondary" className="w-full">
                    View Consultations
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Download className="w-8 h-8 text-indigo-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Access Premium Content
                </h3>
                <p className="text-gray-600 mb-4">
                  Browse our comprehensive visa guides and premium resources.
                </p>
                <Link to="/dashboard/my-visas">
                  <Button variant="secondary" className="w-full">
                    View My Visas
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </>
            )}
          </Card>

          <Card className="p-6">
            {isConsultation ? (
              <>
                <Scale className="w-8 h-8 text-indigo-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Explore More Services
                </h3>
                <p className="text-gray-600 mb-4">
                  Browse premium visa guides and document templates.
                </p>
                <Link to="/dashboard">
                  <Button variant="secondary" className="w-full">
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Calendar className="w-8 h-8 text-indigo-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Book Consultation
                </h3>
                <p className="text-gray-600 mb-4">
                  Schedule a consultation with our expert immigration lawyers.
                </p>
                <Link to="/lawyers">
                  <Button variant="secondary" className="w-full">
                    Find Lawyers
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </>
            )}
          </Card>
        </div>

        <div className="text-center">
          <Link to="/dashboard">
            <Button>
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
