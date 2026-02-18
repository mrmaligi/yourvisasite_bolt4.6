import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, ArrowUpRight, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import type { Visa } from '../../types/database';

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'work', label: 'Work' },
  { value: 'family', label: 'Family' },
  { value: 'student', label: 'Student' },
  { value: 'visitor', label: 'Visitor' },
  { value: 'humanitarian', label: 'Humanitarian' },
  { value: 'business', label: 'Business' },
  { value: 'other', label: 'Other' },
];

const SORTS = [
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'subclass_asc', label: 'Subclass' },
  { value: 'cost_asc', label: 'Cost (Low to High)' },
];

export function VisaSearch() {
  const [visas, setVisas] = useState<Visa[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name_asc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchVisas = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('visas')
        .select('*')
        .eq('is_active', true)
        .eq('country', 'Australia');

      if (error) {
        console.error('Error fetching visas:', error);
      } else {
        setVisas(data || []);
      }
      setLoading(false);
    };

    fetchVisas();
  }, []);

  const filteredVisas = visas
    .filter((visa) => {
      const matchesSearch =
        visa.name.toLowerCase().includes(search.toLowerCase()) ||
        visa.subclass.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || visa.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name_asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'subclass_asc') {
        return a.subclass.localeCompare(b.subclass);
      }
      if (sortBy === 'cost_asc') {
        const costA = a.base_cost_aud || 0;
        const costB = b.base_cost_aud || 0;
        return costA - costB;
      }
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Visa Search</h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Find detailed information, processing times, and expert guides for Australian visas.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
            <Input
              placeholder="Search by name or subclass..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12"
            />
          </div>
          <Button
            variant="secondary"
            className="md:hidden px-3"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        <div className={`flex flex-col md:flex-row gap-4 ${showFilters ? 'flex' : 'hidden md:flex'}`}>
          <div className="w-full md:w-[200px]">
            <Select
              options={CATEGORIES}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="w-full md:w-[200px]">
            <Select
              options={SORTS}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filteredVisas.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No visas found"
          description="Try adjusting your search or filter criteria."
        />
      ) : (
        <>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                Showing {filteredVisas.length} of {visas.length} visas
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVisas.map((visa) => (
                <Link key={visa.id} to={`/visas/${visa.id}`}>
                <Card hover className="h-full group">
                    <CardBody className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                        <Badge>{visa.subclass}</Badge>
                        <Badge variant="primary">{visa.category}</Badge>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600 transition-colors" />
                    </div>

                    <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                            {visa.name}
                        </h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
                            {visa.summary}
                        </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 dark:border-neutral-700 flex items-center justify-between text-sm">
                        <span className="text-neutral-600 dark:text-neutral-300 font-medium">
                            {visa.cost_aud ? visa.cost_aud : 'Free / Varies'}
                        </span>
                        {visa.processing_time_range && (
                             <span className="text-neutral-500 dark:text-neutral-400">
                                {visa.processing_time_range}
                             </span>
                        )}
                    </div>
                    </CardBody>
                </Card>
                </Link>
            ))}
            </div>
        </>
      )}
    </div>
  );
}
