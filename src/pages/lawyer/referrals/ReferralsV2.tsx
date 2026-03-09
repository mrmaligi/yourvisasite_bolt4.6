import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Share2, Users, Gift, Copy } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

export function ReferralsV2() {
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://visabuild.com/r/jane-doe';

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = {
    invited: 5,
    joined: 3,
    rewards: 3,
  };

  return (
    <>
      <Helmet>
        <title>Referrals | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Referral Program</h1>
                <p className="text-slate-600">Invite colleagues and earn rewards</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Invited', value: stats.invited, icon: Share2 },
              { label: 'Joined', value: stats.joined, icon: Users },
              { label: 'Rewards', value: stats.rewards, icon: Gift },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Referral Link</h2>
            
            <p className="text-slate-600 mb-4">
              Share this link with other lawyers. You'll both get 1 month of premium free when they verify their account.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200"
              />
              <Button variant="primary" onClick={copyLink}>
                <Copy className="w-4 h-4 mr-2" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-6">
            <div className="flex items-start gap-3">
              <Gift className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900">How it works</h3>
                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                  <li>1. Share your unique referral link</li>
                  <li>2. They sign up and verify their account</li>
                  <li>3. You both get 1 month premium free</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
