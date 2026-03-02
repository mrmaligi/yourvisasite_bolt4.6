import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Check, X, AlertCircle } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Loading } from '../../components/ui/Loading';
import { getVisaComparisonDetails } from '../../lib/visa-comparison-data';
import type { Visa } from '../../types/database';

export function VisaComparison() {
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
        // Sort by input order to maintain selection order
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
        <div className="flex justify-center mb-6">
          <AlertCircle className="w-16 h-16 text-neutral-300 dark:text-neutral-600" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">No visas selected</h2>
        <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-md mx-auto">
          Please select at least two visas from the search page to view a side-by-side comparison.
        </p>
        <Link to="/visas">
          <Button size="lg">Browse Visas</Button>
        </Link>
      </div>
    );
  }

  // Enhance visas with comparison data
  const enhancedVisas = visas.map(visa => ({
    ...visa,
    comparison: getVisaComparisonDetails(visa)
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link to="/visas" className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Search
        </Link>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Compare Visas</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            Comparing {visas.length} visas side-by-side
        </p>
      </div>

      <div className="overflow-x-auto pb-4">
        <table className="w-full min-w-[800px] border-collapse bg-white dark:bg-neutral-900 rounded-xl shadow-sm overflow-hidden table-fixed">
          <thead>
            <tr>
              <th className="p-6 text-left w-64 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Features</span>
              </th>
              {enhancedVisas.map((visa) => (
                <th key={visa.id} className="p-6 text-left border-b border-neutral-200 dark:border-neutral-800 min-w-[300px] align-bottom">
                  <div className="flex flex-col gap-3">
                    <div>
                        <Badge variant="secondary" className="mb-2 text-xs">{visa.subclass}</Badge>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white leading-tight">{visa.name}</h3>
                    </div>
                    <Link to={`/visas/${visa.id}`} className="block mt-2">
                         <Button size="sm" variant="secondary" className="w-full justify-center">View Full Details</Button>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {/* Processing Time */}
            <tr>
              <td className="p-6 font-medium text-neutral-900 dark:text-white align-top bg-neutral-50/30 dark:bg-neutral-800/20">
                Processing Time
              </td>
              {enhancedVisas.map((visa) => (
                <td key={visa.id} className="p-6 text-neutral-600 dark:text-neutral-300 align-top">
                  {visa.processing_time_range || 'Varies'}
                </td>
              ))}
            </tr>

            {/* Cost */}
            <tr>
              <td className="p-6 font-medium text-neutral-900 dark:text-white align-top bg-neutral-50/30 dark:bg-neutral-800/20">
                Estimated Cost
              </td>
              {enhancedVisas.map((visa) => (
                <td key={visa.id} className="p-6 text-neutral-600 dark:text-neutral-300 align-top">
                  <div className="font-semibold text-neutral-900 dark:text-white mb-1">
                    {visa.cost_aud || 'Free / Varies'}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Includes government fees. Does not include service fees or other associated costs.
                  </p>
                </td>
              ))}
            </tr>

             {/* Path to PR */}
             <tr>
              <td className="p-6 font-medium text-neutral-900 dark:text-white align-top bg-neutral-50/30 dark:bg-neutral-800/20">
                Path to PR
              </td>
              {enhancedVisas.map((visa) => (
                <td key={visa.id} className="p-6 text-neutral-600 dark:text-neutral-300 align-top">
                   <div className="flex items-start gap-2">
                      <div className="mt-1 min-w-[16px]">
                        {visa.comparison.pathToPR.includes('No direct') ? (
                           <X className="w-4 h-4 text-red-500" />
                        ) : (
                           <Check className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <span>{visa.comparison.pathToPR}</span>
                   </div>
                </td>
              ))}
            </tr>

            {/* Pros */}
            <tr>
              <td className="p-6 font-medium text-neutral-900 dark:text-white align-top bg-neutral-50/30 dark:bg-neutral-800/20">
                Pros
              </td>
              {enhancedVisas.map((visa) => (
                <td key={visa.id} className="p-6 align-top">
                  <ul className="space-y-2">
                    {visa.comparison.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Cons */}
            <tr>
              <td className="p-6 font-medium text-neutral-900 dark:text-white align-top bg-neutral-50/30 dark:bg-neutral-800/20">
                Cons
              </td>
              {enhancedVisas.map((visa) => (
                <td key={visa.id} className="p-6 align-top">
                   <ul className="space-y-2">
                    {visa.comparison.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                        <X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Key Requirements */}
            <tr>
                <td className="p-6 font-medium text-neutral-900 dark:text-white align-top bg-neutral-50/30 dark:bg-neutral-800/20">
                    Eligibility
                </td>
                {enhancedVisas.map((visa) => (
                    <td key={visa.id} className="p-6 align-top">
                         <ul className="space-y-2 mb-4">
                            {visa.comparison.eligibility.map((req, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                                    <span>{req}</span>
                                </li>
                            ))}
                        </ul>
                        {visa.key_requirements && (
                           <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg text-xs text-neutral-500 dark:text-neutral-400 italic border border-neutral-100 dark:border-neutral-700">
                               "{visa.key_requirements}"
                           </div>
                        )}
                    </td>
                ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
