import { useEffect, useState } from 'react';
import { Crown, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface SubscriptionData {
  status: string;
  planName: string;
}

export function SubscriptionStatus() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscriptionStatus();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSubscriptionStatus = async () => {
    try {
      // Check for active orders (one-time purchases)
      const { data: orders } = await supabase
        .from('stripe_user_orders')
        .select('*')
        .eq('payment_status', 'paid')
        .eq('order_status', 'completed')
        .order('order_date', { ascending: false })
        .limit(1);

      if (orders && orders.length > 0) {
        setSubscription({
          status: 'active',
          planName: 'VisaBuild Premium'
        });
      } else {
        // Check for active subscriptions
        const { data: subscriptions } = await supabase
          .from('stripe_user_subscriptions')
          .select('*')
          .eq('subscription_status', 'active')
          .limit(1);

        if (subscriptions && subscriptions.length > 0) {
          setSubscription({
            status: 'active',
            planName: 'VisaBuild Premium'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return null;
  }

  if (!subscription) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-medium">
      <Crown className="w-4 h-4" />
      <span>{subscription.planName}</span>
      <CheckCircle className="w-4 h-4" />
    </div>
  );
}