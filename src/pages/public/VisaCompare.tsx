import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Loading } from '../../components/ui/Loading';
import type { Visa } from '../../types/database';

export function VisaCompare() {
  const [searchParams] = useSearchParams();
  const [visas, setVisas] = useState<Visa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisas = async () => {
      const ids = searchParams.get('ids')?.split(',') || [];
      if (ids.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('visas')
        .select('*')
        .in('id', ids);

      if (error) {
        console.error('Error fetching visas:', error);
      } else {
        // Sort by input order
        const sortedData = data?.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id)) || [];
        setVisas(sortedData);
      }
      setLoading(false);
    };

    fetchVisas();
  }, [searchParams]);

  if (loading) return <Loading fullScreen />;

  if (visas.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">No visas selected</h2>
        <p className="text-neutral-500 dark:text-neutral-400 mb-8">Please select at least one visa to compare.</p>
        <Link to="/visas">
          <Button>Browse Visas</Button>
        </Link>
      </div>
    );
  }

  const attributes = [
    { label: 'Name', key: 'name' },
    { label: 'Subclass', key: 'subclass_number' },
    { label: 'Category', key: 'category' },
    { label: 'Cost (AUD)', key: 'cost_aud' },
    { label: 'Processing Time', key: 'processing_time_range' },
    { label: 'Stay Duration', key: 'duration' },
    { label: 'Summary', key: 'summary' },
  ];

  const getValue = (visa: Visa, key: string) => {
    if (key === 'cost_aud') return visa.cost_aud || 'Free / Varies';
    // @ts-ignore
    return visa[key] as string;
  };

  const isDifferent = (key: string) => {
    if (visas.length < 2) return false;
    const firstVal = getValue(visas[0], key);
    return visas.some(v => getValue(v, key) !== firstVal);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link to="/visas" className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Search
        </Link>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Compare Visas</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            Comparing {visas.length} visa{visas.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="overflow-x-auto pb-4">
        <table className="w-full min-w-[800px] border-collapse bg-white dark:bg-neutral-900 rounded-lg shadow-sm overflow-hidden">
          <thead>
            <tr>
              <th className="p-6 text-left w-1/4 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">Feature</th>
              {visas.map((visa) => (
                <th key={visa.id} className="p-6 text-left w-1/4 border-b border-neutral-200 dark:border-neutral-700 min-w-[250px]">
                  <div className="flex flex-col gap-3">
                    <div>
                        <Badge variant="secondary" className="mb-2">{visa.subclass_number}</Badge>
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white leading-tight">{visa.name}</h3>
                    </div>
                    <Link to={`/visas/${visa.id}`} className="block">
                         <Button size="sm" variant="secondary" className="w-full justify-center">View Details</Button>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {attributes.map((attr) => {
                const diff = isDifferent(attr.key);
                return (
                    <tr key={attr.key} className={diff ? 'bg-yellow-50/50 dark:bg-yellow-500/5' : ''}>
                        <td className="p-6 font-medium text-neutral-900 dark:text-white align-top bg-neutral-50/30 dark:bg-neutral-800/30">
                            {attr.label}
                        </td>
                        {visas.map((visa) => (
                            <td key={visa.id} className={`p-6 text-neutral-600 dark:text-neutral-300 align-top ${diff ? 'text-neutral-900 dark:text-white font-medium' : ''}`}>
                                {attr.key === 'category' ? (
                                    <Badge variant="primary">{visa.category}</Badge>
                                ) : (
                                    getValue(visa, attr.key)
                                )}
                            </td>
                        ))}
                    </tr>
                );
            })}
             {/* Key Requirements Row */}
             <tr className="border-b border-neutral-100 dark:border-neutral-800">
                <td className="p-6 font-medium text-neutral-900 dark:text-white align-top bg-neutral-50/30 dark:bg-neutral-800/30">
                    Key Requirements
                </td>
                {visas.map((visa) => (
                    <td key={visa.id} className="p-6 text-neutral-600 dark:text-neutral-300 align-top text-sm leading-relaxed">
                        {visa.key_requirements}
                    </td>
                ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
