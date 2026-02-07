import { useEffect, useState } from 'react';
import { Users, Calendar, DollarSign, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export function LawyerDashboard() {
  const { profile } = useAuth();
  const [lawyerProfile, setLawyerProfile] = useState<{ is_verified: boolean; verification_status: string } | null>(null);
  const [counts, setCounts] = useState({ clients: 0, upcoming: 0, earnings: 0 });

  useEffect(() => {
    if (!profile) return;
    supabase
      .schema('lawyer')
      .from('profiles')
      .select('is_verified, verification_status')
      .eq('profile_id', profile.id)
      .maybeSingle()
      .then(({ data }) => setLawyerProfile(data));
  }, [profile]);

  const statCards = [
    { label: 'Total Clients', value: counts.clients, icon: Users },
    { label: 'Upcoming Sessions', value: counts.upcoming, icon: Calendar },
    { label: 'Estimated Earnings', value: `$${counts.earnings}`, icon: DollarSign },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Lawyer Dashboard</h1>
        <p className="text-neutral-500 mt-1">Manage your practice and clients.</p>
      </div>

      {lawyerProfile && !lawyerProfile.is_verified && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-amber-800">Verification {lawyerProfile.verification_status}</p>
            <p className="text-sm text-amber-700">
              Your account is pending admin verification. Some features are restricted until approval.
            </p>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardBody className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                <p className="text-xs text-neutral-500">{stat.label}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {lawyerProfile?.is_verified && (
        <Badge variant="success">Verified Lawyer</Badge>
      )}
    </div>
  );
}
