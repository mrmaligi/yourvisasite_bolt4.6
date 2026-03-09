import { Shield, Check } from 'lucide-react';

export function ApiScopesV2() {
  const scopes = [
    { id: 1, name: 'visas:read', description: 'Read visa information', assigned: true },
    { id: 2, name: 'visas:write', description: 'Create and update visas', assigned: false },
    { id: 3, name: 'users:read', description: 'Read user profiles', assigned: true },
    { id: 4, name: 'users:write', description: 'Manage user accounts', assigned: false },
    { id: 5, name: 'applications:read', description: 'Read applications', assigned: true },
    { id: 6, name: 'applications:write', description: 'Manage applications', assigned: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">API Scopes</h1>
          <p className="text-slate-600">Manage API permission scopes</p>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {scopes.map((scope) => (
              <div key={scope.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-mono font-medium text-slate-900">{scope.name}</p>
                    <p className="text-sm text-slate-500">{scope.description}</p>
                  </div>
                </div>
                <button className={`w-10 h-6 flex items-center ${scope.assigned ? 'bg-blue-600' : 'bg-slate-200'} transition-colors`}>
                  <div className={`w-4 h-4 bg-white mx-1 transform transition-transform ${scope.assigned ? 'translate-x-4' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
