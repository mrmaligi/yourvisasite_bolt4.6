import { Gift, Share2, Copy, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserReferralsV2() {
  const stats = {
    totalReferrals: 12,
    successful: 8,
    rewardsEarned: '$240',
    code: 'VISABUILD2024',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Referrals</h1>
          <p className="text-slate-400">Invite friends and earn rewards</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-slate-200 p-4">
            <p className="text-sm text-slate-600">Total Referrals</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalReferrals}</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-4">
            <p className="text-sm text-slate-600">Successful</p>
            <p className="text-2xl font-bold text-slate-900">{stats.successful}</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-4">
            <p className="text-sm text-slate-600">Rewards Earned</p>
            <p className="text-2xl font-bold text-green-600">{stats.rewardsEarned}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Your Referral Code</h2>
          
          <div className="flex gap-2 mb-6">
            <input type="text" value={stats.code} readOnly className="flex-1 px-3 py-2 border border-slate-200 bg-slate-50" />
            <Button variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>

          <div className="flex gap-4">
            <Button variant="primary">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
