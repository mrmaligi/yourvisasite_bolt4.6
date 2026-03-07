import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function DataDebug() {
  const [status, setStatus] = useState('Loading...');
  const [visas, setVisas] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('Testing Supabase connection...');
        
        // Test 1: Basic connection
        const { data: testData, error: testError } = await supabase
          .from('visas')
          .select('count')
          .limit(1);
        
        if (testError) {
          setError(`Connection error: ${testError.message}`);
          setStatus('Connection failed');
          return;
        }
        
        setStatus('Connection successful! Fetching visas...');
        
        // Test 2: Fetch all visas
        const { data, error } = await supabase
          .from('visas')
          .select('id, name, subclass, is_active, country')
          .eq('is_active', true)
          .eq('country', 'Australia');
        
        if (error) {
          setError(`Fetch error: ${error.message}`);
          setStatus('Fetch failed');
          return;
        }
        
        setVisas(data || []);
        setStatus(`Success! Found ${data?.length || 0} visas`);
      } catch (e: any) {
        setError(`Unexpected error: ${e.message}`);
        setStatus('Error');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Data Debug Page</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <p className="font-semibold">Status: {status}</p>
        {error && (
          <p className="text-red-600 mt-2">Error: {error}</p>
        )}
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Supabase Config:</h2>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`URL: ${supabase.supabaseUrl}
Key: ${supabase.supabaseKey?.substring(0, 20)}...`}
        </pre>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Visas Found: {visas.length}</h2>
        {visas.length === 0 ? (
          <p className="text-gray-500">No visas loaded</p>
        ) : (
          <div className="space-y-2">
            {visas.slice(0, 10).map((visa) => (
              <div key={visa.id} className="bg-white p-3 rounded border">
                <p className="font-medium">{visa.name} ({visa.subclass})</p>
                <p className="text-sm text-gray-500">
                  Active: {visa.is_active ? 'Yes' : 'No'} | Country: {visa.country}
                </p>
              </div>
            ))}
            {visas.length > 10 && (
              <p className="text-gray-500 text-sm">
                ... and {visas.length - 10} more
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DataDebug;
