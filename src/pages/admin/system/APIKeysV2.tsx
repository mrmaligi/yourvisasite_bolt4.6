import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Key, Copy, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
}

const MOCK_KEYS: APIKey[] = [
  { id: '1', name: 'Production API', key: 'pk_live_••••••••••••••••', createdAt: '2024-01-15', lastUsed: '2024-03-20' },
  { id: '2', name: 'Development API', key: 'pk_test_••••••••••••••••', createdAt: '2024-02-01', lastUsed: '2024-03-19' },
];

export function APIKeysV2() {
  const [keys] = useState<APIKey[]>(MOCK_KEYS);
  const [showKey, setShowKey] = useState<string | null>(null);

  return (
    <>
      <Helmet>
        <title>API Keys | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">API Keys</h1>
                <p className="text-slate-600">Manage API access credentials</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Key
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-blue-50 border border-blue-200 p-4 mb-6">
            <div className="flex items-start gap-3">
              <Key className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Keep your API keys secure</p>
                <p className="text-sm text-blue-700">Never share your API keys in public repositories or client-side code.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {keys.map((apiKey) => (
              <div key={apiKey.id} className="bg-white border border-slate-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-slate-900">{apiKey.name}</h3>
                      <Badge variant="secondary">Full Access</Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <code className="bg-slate-100 px-2 py-1 text-sm font-mono">
                        {showKey === apiKey.id ? apiKey.key.replace('••••••••••••••••', 'abc123xyz789') : apiKey.key}
                      </code>
                      <Button variant="outline" size="sm" onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}>
                        {showKey === apiKey.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex gap-4 text-sm text-slate-500">
                      <span>Created: {apiKey.createdAt}</span>
                      <span>Last used: {apiKey.lastUsed}</span>
                    </div>
                  </div>
                  
                  <Button variant="danger" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
