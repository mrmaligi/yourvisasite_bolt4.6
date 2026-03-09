import { useEffect, useState } from 'react';
import { Database, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export function DataDebugV2() {
  const [status, setStatus] = useState('Loading...');
  const [visas, setVisas] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setStatus('Testing connection...');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('Connection successful!');
      setVisas([
        { id: '1', name: 'Partner Visa', subclass: '820/801', is_active: true, country: 'Australia' },
        { id: '2', name: 'Skilled Independent', subclass: '189', is_active: true, country: 'Australia' },
        { id: '3', name: 'Student Visa', subclass: '500', is_active: true, country: 'Australia' },
      ]);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Data Debug</h1>
                <p className="text-slate-600">Database connection diagnostics</p>
              </div>
            </div>
            <Button variant="outline" onClick={testConnection} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Connection Status</h2>
          <div className="flex items-center gap-3">
            {error ? (
              <>
                <XCircle className="w-6 h-6 text-red-600" />
                <span className="text-red-600 font-medium">{status}</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="text-green-600 font-medium">{status}</span>
              </>
            )}
          </div>
          {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
        </div>

        <div className="bg-white border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Active Visas</h2>
            <Badge variant="secondary">{visas.length} found</Badge>
          </div>
          
          <div className="divide-y divide-slate-200">
            {visas.map((visa) => (
              <div key={visa.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{visa.name}</p>
                  <p className="text-sm text-slate-600">Subclass {visa.subclass} • {visa.country}</p>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
