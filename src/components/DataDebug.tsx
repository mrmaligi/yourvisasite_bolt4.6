import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function DataDebug() {
  const [status, setStatus] = useState('Checking...');
  const [error, setError] = useState<string | null>(null);
  const [visaCount, setVisaCount] = useState(0);

  useEffect(() => {
    const testData = async () => {
      try {
        setStatus('Testing connection...');
        
        const { data, error } = await supabase
          .from('visas')
          .select('id, name')
          .eq('is_active', true)
          .limit(10);
        
        if (error) {
          setError(error.message);
          setStatus('Error');
        } else {
          setVisaCount(data?.length || 0);
          setStatus(`Found ${data?.length || 0} visas`);
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
        setStatus('Exception');
      }
    };

    testData();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="font-bold">Data Debug</h3>
      <p>Status: {status}</p>
      <p>Visas: {visaCount}</p>
      {error && <p className="text-red-600">Error: {error}</p>}
    </div>
  );
}

export default DataDebug;
