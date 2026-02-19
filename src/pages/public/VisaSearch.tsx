import { useEffect, useState, useCallback, useRef } from 'react';
import { Search, FileText, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { VirtualizedVisaList } from '../../components/VirtualizedVisaList';
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

const PAGE_SIZE = 20;

export function VisaSearch() {
  const [visas, setVisas] = useState<Visa[]>([]);
  const [loading, setLoading] = useState(true); // Initial loading
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name_asc');
  const [showFilters, setShowFilters] = useState(false);

  // Debounce ref to avoid rapid firing
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchVisas = useCallback(async (startIndex: number, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setIsNextPageLoading(true);
      }

      let query = supabase
        .from('visas')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .eq('country', 'Australia');

      // Apply filters
      if (search) {
        // Use ilike for case-insensitive search on name or subclass
        query = query.or(`name.ilike.%${search}%,subclass.ilike.%${search}%`);
      }

      if (category !== 'all') {
        query = query.eq('category', category);
      }

      // Apply sort
      if (sortBy === 'name_asc') {
        query = query.order('name', { ascending: true });
      } else if (sortBy === 'subclass_asc') {
        query = query.order('subclass', { ascending: true });
      } else if (sortBy === 'cost_asc') {
        query = query.order('base_cost_aud', { ascending: true });
      }

      // Apply pagination
      const from = startIndex;
      const to = startIndex + PAGE_SIZE - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) {
        console.error('Error fetching visas:', error);
        return;
      }

      if (count !== null) {
        setTotalCount(count);
      }

      if (reset) {
        setVisas(data || []);
      } else {
        setVisas((prev) => [...prev, ...(data || [])]);
      }

      // Determine if there are more items
      // If we got fewer items than requested, or if total count is reached
      const currentLength = startIndex + (data || []).length;
      if ((data || []).length < PAGE_SIZE || (count !== null && currentLength >= count)) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
      setIsNextPageLoading(false);
    }
  }, [search, category, sortBy]); // Removed visas.length dependency

  // Effect to trigger fetch on filter change
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      // Reset and fetch
      setVisas([]);
      setHasMore(true);
      setTotalCount(0);
      fetchVisas(0, true);
    }, 300);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [search, category, sortBy, fetchVisas]); // Added fetchVisas to deps

  const loadNextPage = () => {
    if (!isNextPageLoading && hasMore) {
      fetchVisas(visas.length, false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 h-screen flex flex-col">
      <div className="flex-none mb-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Visa Search</h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Find detailed information, processing times, and expert guides for Australian visas.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
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

        {!loading && (
             <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Showing {visas.length} of {totalCount} visas
            </p>
        )}
      </div>

      <div className="flex-grow min-h-0">
        {loading && visas.length === 0 ? (
           <VirtualizedVisaList
             visas={[]}
             hasNextPage={true}
             isNextPageLoading={true}
             loadNextPage={() => {}}
           />
        ) : visas.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No visas found"
            description="Try adjusting your search or filter criteria."
          />
        ) : (
          <VirtualizedVisaList
            visas={visas}
            hasNextPage={hasMore}
            isNextPageLoading={isNextPageLoading}
            loadNextPage={loadNextPage}
          />
        )}
      </div>
    </div>
  );
}
