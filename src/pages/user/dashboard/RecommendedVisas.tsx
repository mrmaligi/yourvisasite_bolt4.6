import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { supabase } from '../../../lib/supabase';

interface Visa {
  id: string;
  subclass: string;
  name: string;
  description: string;
}

export function RecommendedVisas() {
  const [visas, setVisas] = useState<(Visa & { match: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisas = async () => {
      const { data } = await supabase
        .from('visas')
        .select('id, subclass, name')
        .limit(3);

      const mocked = (data || []).map(v => ({
        ...v,
        description: 'Permanent residency pathway',
        match: Math.floor(Math.random() * (99 - 85 + 1) + 85) // Random 85-99
      }));

      setVisas(mocked);
      setLoading(false);
    };
    fetchVisas();
  }, []);

  return (
    <Card className="border-blue-100 dark:border-blue-900">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Recommended for You</h2>
        <Link to="/visas" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="space-y-4">
             {[1, 2, 3].map(i => <div key={i} className="h-16 bg-neutral-100 animate-pulse rounded-lg"/>)}
          </div>
        ) : (
          <div className="grid gap-4">
            {visas.map((visa) => (
              <div key={visa.id} className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 hover:border-blue-200 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-neutral-900 dark:text-white">{visa.subclass}</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      {visa.match}% Match
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{visa.name}</h3>
                </div>
                <Link to={`/visas/${visa.id}`}>
                  <Button size="sm" variant="secondary" className="bg-white hover:bg-blue-50 text-blue-600 border-blue-200">
                    View
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
