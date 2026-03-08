import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

interface SubscriptionData {
  subscription_status: string;
  price_id: string | null;
  current_period_end: number | null;
}

export function DashboardV2() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const { data } = await supabase
        .from('stripe_user_subscriptions')
        .select('subscription_status, price_id, current_period_end')
        .maybeSingle();

      setSubscription(data);
    } catch (err) {
      console.error('Failed to fetch subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'active': return { text: 'Active', variant: 'success' as const };
      case 'trialing': return { text: 'Trial', variant: 'default' as const };
      case 'past_due': return { text: 'Past Due', variant: 'warning' as const };
      case 'canceled': return { text: 'Canceled', variant: 'danger' as const };
      default: return { text: 'No Plan', variant: 'secondary' as const };
    }
  };

  const stats = [
    { label: 'Applications', value: '12', change: '+2 this week' },
    { label: 'Documents', value: '8', change: '3 pending' },
    { label: 'Consultations', value: '5', change: '2 upcoming' },
  ];

  const status = subscription ? getStatusDisplay(subscription.subscription_status) : { text: 'Loading...', variant: 'secondary' as const };

  return (
    <>
      <Helmet>
        <title>Dashboard | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-600">Welcome back, {user?.email?.split('@')[0] || 'User'}</p>
              </div>
              <Badge variant={status.variant}>{status.text}</Badge>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats - SQUARE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-6">
                <p className="text-sm text-slate-600 uppercase tracking-wide">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                <p className="text-sm text-blue-600 mt-1">{stat.change}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Activity - SQUARE */}
            <div className="bg-white border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
              </div>
              <div className="divide-y divide-slate-200">
                {['Document uploaded', 'Application submitted', 'Status updated'].map((item, i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50">
                    <span className="text-slate-700">{item}</span>
                    <span className="text-sm text-slate-500">{i + 1}h ago</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions - SQUARE */}
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button variant="primary" className="w-full">New Application</Button>
                <Button variant="outline" className="w-full">Upload Document</Button>
                <Button variant="outline" className="w-full">Book Consultation</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
