import { Gift, Tag, Percent, Copy } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserRewardsV2() {
  const rewards = [
    { id: 1, title: 'Welcome Bonus', description: 'Joined VisaBuild', points: 100, status: 'claimed' },
    { id: 2, title: 'First Consultation', description: 'Booked your first consultation', points: 250, status: 'claimed' },
    { id: 3, title: 'Document Upload', description: 'Uploaded 5 documents', points: 150, status: 'available' },
    { id: 4, title: 'Referral Bonus', description: 'Referred a friend', points: 500, status: 'available' },
  ];

  const history = [
    { action: 'Earned - Welcome Bonus', points: 100, date: '2024-03-01' },
    { action: 'Redeemed - $10 Credit', points: -500, date: '2024-03-15' },
    { action: 'Earned - First Consultation', points: 250, date: '2024-03-10' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Rewards</h1>
          <p className="text-slate-600">Earn points and redeem rewards</p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Your Points Balance</p>
              <p className="text-4xl font-bold">1,250</p>
            </div>
            <Gift className="w-16 h-16 text-blue-200" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900">Available Rewards</h2>
            </div>
            <div className="divide-y divide-slate-200">
              {rewards.filter(r => r.status === 'available').map((reward) => (
                <div key={reward.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{reward.title}</p>
                      <p className="text-sm text-slate-500">{reward.description}</p>
                    </div>
                    <Button variant="primary" size="sm">
                      Claim {reward.points}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900">Points History</h2>
            </div>
            <div className="divide-y divide-slate-200">
              {history.map((h, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{h.action}</p>
                    <p className="text-sm text-slate-500">{h.date}</p>
                  </div>
                  <span className={`font-semibold ${h.points > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                    {h.points > 0 ? '+' : ''}{h.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
