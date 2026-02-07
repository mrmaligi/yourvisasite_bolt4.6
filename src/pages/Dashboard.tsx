import { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { SubscriptionStatus } from '../components/SubscriptionStatus';

interface SubscriptionData {
  subscription_status: string;
  price_id: string | null;
  current_period_end: number | null;
}

export function Dashboard() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('subscription_status, price_id, current_period_end')
        .maybeSingle();

      if (error) {
        throw error;
      }

      setSubscription(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch subscription data');
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionStatusDisplay = (status: string) => {
    switch (status) {
      case 'active':
        return { text: 'Active', variant: 'success' as const };
      case 'trialing':
        return { text: 'Trial', variant: 'default' as const };
      case 'past_due':
        return { text: 'Past Due', variant: 'warning' as const };
      case 'canceled':
        return { text: 'Canceled', variant: 'destructive' as const };
      case 'not_started':
        return { text: 'No Active Plan', variant: 'default' as const };
      default:
        return { text: status, variant: 'default' as const };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.email}</p>
        </div>

        <SubscriptionStatus />

        {error && (
          <div className="mb-8">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Email:</span> {user?.email}
                </div>
                <div>
                  <span className="font-medium">User ID:</span> {user?.id}
                </div>
                <div>
                  <span className="font-medium">Account Created:</span>{' '}
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
              <CardDescription>Your current plan and billing information</CardDescription>
            </CardHeader>
            <CardContent>
              {subscription ? (
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Status:</span>{' '}
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getSubscriptionStatusDisplay(subscription.subscription_status).variant === 'success'
                          ? 'bg-green-100 text-green-800'
                          : getSubscriptionStatusDisplay(subscription.subscription_status).variant === 'warning'
                          ? 'bg-yellow-100 text-yellow-800'
                          : getSubscriptionStatusDisplay(subscription.subscription_status).variant === 'destructive'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {getSubscriptionStatusDisplay(subscription.subscription_status).text}
                    </span>
                  </div>
                  {subscription.price_id && (
                    <div>
                      <span className="font-medium">Plan:</span> {subscription.price_id}
                    </div>
                  )}
                  {subscription.current_period_end && (
                    <div>
                      <span className="font-medium">Next Billing:</span>{' '}
                      {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">No subscription data available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}