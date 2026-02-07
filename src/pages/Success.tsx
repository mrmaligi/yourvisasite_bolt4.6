import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Download, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getProductByPriceId } from '../stripe-config';

export function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const { data: orders } = await supabase
          .from('stripe_user_orders')
          .select('*')
          .eq('checkout_session_id', sessionId)
          .single();

        if (orders) {
          setOrderDetails(orders);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-green-50 px-6 py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for your purchase. Your payment has been processed successfully.
            </p>
          </div>

          {/* Order Details */}
          {orderDetails && (
            <div className="px-6 py-8">
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium text-gray-900">{orderDetails.order_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount Paid</p>
                    <p className="font-medium text-gray-900">
                      {formatAmount(orderDetails.amount_total, orderDetails.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <p className="font-medium text-green-600 capitalize">
                      {orderDetails.payment_status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(orderDetails.order_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* What's Next */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Download className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Access Premium Content</p>
                      <p className="text-gray-600">You now have access to all premium visa guides and resources.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Schedule Consultation</p>
                      <p className="text-gray-600">Book a consultation with our expert immigration lawyers.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/dashboard"
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
                <Link
                  to="/visas"
                  className="flex-1 bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
                >
                  Browse Visas
                </Link>
              </div>
            </div>
          )}

          {/* No Order Details */}
          {!orderDetails && !loading && (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-600 mb-6">
                We couldn't find the details for this order, but your payment was successful.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          )}
        </div>

        {/* Support */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@visabuild.com" className="text-indigo-600 hover:text-indigo-700">
              support@visabuild.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}