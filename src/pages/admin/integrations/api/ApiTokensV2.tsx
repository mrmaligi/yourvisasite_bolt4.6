import { Key, Plus, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ApiTokensV2() {
  const tokens = [
    { id: 1, name: 'Mobile App Token', lastUsed: '2 hours ago', expires: '2024-12-31' },
    { id: 2, name: 'Web Dashboard Token', lastUsed: '5 minutes ago', expires: '2024-06-30' },
    { id: 3, name: 'Third-party Integration', lastUsed: '1 day ago', expires: '2024-09-15' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">API Tokens</h1>
            <p className="text-slate-600">Manage access tokens</p>
          </div>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Token
          </Button>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {tokens.map((token) => (
              <div key={token.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                    <Key className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{token.name}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>Last used: {token.lastUsed}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Expires: {token.expires}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Revoke</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
