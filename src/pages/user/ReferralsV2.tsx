import { Share2, Link, Mail, MessageCircle, Copy, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserReferralsV2() {
  const referrals = [
    { id: 1, name: 'Alice Brown', email: 'alice@example.com', status: 'signed_up', date: '2024-03-20', reward: 'Pending' },
    { id: 2, name: 'Bob Wilson', email: 'bob@example.com', status: 'completed', date: '2024-03-15', reward: '$50 Credit' },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', status: 'pending', date: '2024-03-10', reward: 'Pending' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Referrals</h1>
          <p className="text-slate-600">Invite friends and earn rewards</p>
        </div>

        <div className="bg-blue-600 text-white p-8 mb-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-blue-100">Total Referrals</p>
              <p className="text-4xl font-bold">12</p>
            </div>
            <div>
              <p className="text-blue-100">Successful</p>
              <p className="text-4xl font-bold">5</p>
            </div>
            <div>
              <p className="text-blue-100">Rewards Earned</p>
              <p className="text-4xl font-bold">$250</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 mb-8">
          <h2 className="font-semibold text-slate-900 mb-4">Your Referral Link</h2>
          <div className="flex gap-2">
            <input type="text" defaultValue="https://visabuild.com/ref/johndoe123" className="flex-1 px-3 py-2 border border-slate-200 bg-slate-50" readOnly />
            <Button variant="outline">
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
          </div>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Your Referrals</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {referrals.map((ref) => (
              <div key={ref.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{ref.name}</p>
                  <p className="text-sm text-slate-500">{ref.email} • {ref.date}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-medium ${
                    ref.status === 'completed' ? 'bg-green-100 text-green-700' :
                    ref.status === 'signed_up' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {ref.status.replace('_', ' ')}
                  </span>
                  <p className="text-sm text-slate-600 mt-1">{ref.reward}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
