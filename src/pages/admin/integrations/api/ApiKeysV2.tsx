import { Key, Plus, Copy, Trash2, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ApiKeysV2() {
  const keys = [
    { id: 1, name: 'Production API Key', key: 'sk_live_************1234', created: '2024-03-01', lastUsed: '2024-03-20' },
    { id: 2, name: 'Test API Key', key: 'sk_test_************5678', created: '2024-03-15', lastUsed: '2024-03-19' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">API Keys</h1>
            <p className="text-slate-600">Manage your API keys</p>
          </div>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Key
          </Button>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {keys.map((apiKey) => (
              <div key={apiKey.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                      <Key className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{apiKey.name}</p>
                      <p className="text-sm text-slate-500">{apiKey.key}</p>
                      <p className="text-xs text-slate-400">Created: {apiKey.created} • Last used: {apiKey.lastUsed}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-400 hover:text-blue-600"><Copy className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
