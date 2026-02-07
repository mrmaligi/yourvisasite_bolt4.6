import React, { useEffect, useState } from 'react';
import { Crown, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface SubscriptionData {
  subscription_status: string;
  price_id: string;
  current_period_end: number;
  cancel_at_period_end: boolean;
}

export function SubscriptionStatus() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('stripe_user_subscriptions')
          .select('*')
          .single();

        if (data) {
          setSubscription(data);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  if (loading || !user) {
    return null;
  }

  if (!subscription || subscription.subscription_status !== 'active') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-yellow-800">
              No Active Subscription
            </p>
            <p className="text-sm text-yellow-700">
              Upgrade to premium to access all features and content.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <Crown className="h-5 w-5 text-indigo-600 mr-3" />
        <div className="flex-1">
          <p className="text-sm font-medium text-indigo-800">
            VisaSite Premium Active
          </p>
          <p className="text-sm text-indigo-700">
            {subscription.cancel_at_period_end 
              ? `Expires on ${formatDate(subscription.current_period_end)}`
              : `Renews on ${formatDate(subscription.current_period_end)}`
            }
          </p>
        </div>
        {subscription.cancel_at_period_end && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            Cancelling
          </span>
        )}
      </div>
    </div>
  );
}