import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

interface SubscriptionData {
  status: string;
  plan: string;
  expiresAt: string;
}

export function DashboardV2() {
  const [subscription] = useState<SubscriptionData>({
    status: 'active',
    plan: 'Premium',
    expiresAt: '2024-12-31'
  });

  return (
    <>
      <Helmet>
        <title>Dashboard | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600">Manage your subscription and account</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Subscription</h2>
                  <p className="text-slate-600">{subscription.plan} Plan</p>
                </div>
              </div>
              <Badge variant={subscription.status === 'active' ? 'success' : 'warning'}>
                {subscription.status}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-slate-600 mb-4">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Expires: {subscription.expiresAt}</span>
            </div>

            <Button variant="outline">Manage Subscription</Button>
          </div>
        </div>
      </div>
    </>
  );
}
