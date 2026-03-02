import { useState, useEffect } from 'react';
import { Gift, Copy, Check, Share2, Users, DollarSign } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../ui/Toast';

interface Referral {
  id: string;
  referred_email?: string;
  status: 'pending' | 'signed_up' | 'converted';
  reward_claimed: boolean;
  converted_at?: string;
  created_at: string;
}

interface ReferralStats {
  totalReferrals: number;
  signedUp: number;
  converted: number;
  balance: number;
  code: string;
}

export function ReferralDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      fetchReferralData();
    }
  }, [user]);

  const fetchReferralData = async () => {
    try {
      // Get user's referral code and balance
      const { data: profile } = await supabase
        .from('profiles')
        .select('referral_code, referral_balance')
        .eq('id', user?.id)
        .single();

      // Get referrals
      const { data: refs } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user?.id)
        .order('created_at', { ascending: false });

      if (profile) {
        setStats({
          code: profile.referral_code,
          balance: profile.referral_balance,
          totalReferrals: refs?.length || 0,
          signedUp: refs?.filter(r => r.status !== 'pending').length || 0,
          converted: refs?.filter(r => r.status === 'converted').length || 0,
        });
        setReferrals(refs || []);
      }
    } catch (error) {
      console.error('Error fetching referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  const referralLink = stats?.code 
    ? `${window.location.origin}/register?ref=${stats.code}`
    : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast('success', 'Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = async () => {
    const shareData = {
      title: 'Get $20 off your visa guide',
      text: 'Use my referral link to get $20 off your first visa guide on VisaBuild!',
      url: referralLink,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled
      }
    } else {
      copyToClipboard();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardBody>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3" />
            <div className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded" />
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <Gift className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Your Balance</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                ${(stats?.balance || 0) / 100}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Referrals</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {stats?.totalReferrals || 0}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Signed Up</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {stats?.signedUp || 0}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Converted</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {stats?.converted || 0}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Referral Link */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Your Referral Link
          </h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-300">
            Share this link with friends. When they sign up and purchase a visa guide, 
            you both get <strong>$20 credit</strong>.
          </p>
          
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-sm font-mono text-neutral-700 dark:text-neutral-300 truncate">
              {referralLink}
            </div>
            <Button variant="secondary" onClick={copyToClipboard}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
            <Button onClick={shareReferral}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Social Share Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Get $20 off your visa guide: ${referralLink}`)}`, '_blank')}
            >
              WhatsApp
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Get $20 off your Australian visa guide! ${referralLink}`)}`, '_blank')}
            >
              Twitter
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank')}
            >
              Facebook
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Referral History */}
      {referrals.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Referral History
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {referrals.map((ref) => (
                <div 
                  key={ref.id}
                  className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      ref.status === 'converted' ? 'bg-green-500' :
                      ref.status === 'signed_up' ? 'bg-blue-500' : 'bg-neutral-300'
                    }`} />
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {ref.referred_email || 'Pending signup'}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {new Date(ref.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge status={ref.status} />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

function Badge({ status }: { status: string }) {
  const styles = {
    pending: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
    signed_up: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    converted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  };

  const labels = {
    pending: 'Pending',
    signed_up: 'Signed Up',
    converted: 'Converted',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
      {labels[status as keyof typeof labels]}
    </span>
  );
}