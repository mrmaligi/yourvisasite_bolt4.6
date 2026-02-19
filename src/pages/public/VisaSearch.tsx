import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, ArrowUpRight, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Checkbox } from '../../components/ui/Checkbox';
import { VisaCardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import type { Visa } from '../../types/database';

const CATEGORIES = [
  { value: 'work', label: 'Work' },
  { value: 'family', label: 'Family' },
  { value: 'student', label: 'Student' },
  { value: 'visitor', label: 'Visitor' },
  { value: 'humanitarian', label: 'Humanitarian' },
  { value: 'business', label: 'Business' },
  { value: 'other', label: 'Other' },
];

const COST_RANGES = [
  { value: 'free', label: 'Free' },
  { value: 'low', label: 'Under $500' },
  { value: 'medium', label: '$500 - $2,000' },
  { value: 'high', label: '$2,000 - $5,000' },
  { value: 'premium', label: '$5,000+' },
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCostRanges, setSelectedCostRanges] = useState<string[]>([]);
  const [selectedTimeRanges, setSelectedTimeRanges] = useState<string[]>([]);
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

  const availableTimeRanges = useMemo(() => {
    const ranges = new Set<string>();
    visas.forEach((visa) => {
      if (visa.processing_time_range) {
        ranges.add(visa.processing_time_range);
      }
    });
    return Array.from(ranges).sort();
  }, [visas]);

  const checkCost = (cost: number | null, range: string) => {
    if (cost === null) return false;
    switch (range) {
      case 'free': return cost === 0;
      case 'low': return cost > 0 && cost < 500;
      case 'medium': return cost >= 500 && cost < 2000;
      case 'high': return cost >= 2000 && cost < 5000;
      case 'premium': return cost >= 5000;
      default: return false;
    }
  };

  const filteredVisas = visas
    .filter((visa) => {
      const matchesSearch =
        visa.name.toLowerCase().includes(search.toLowerCase()) ||
        visa.subclass.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(visa.category);

      const matchesCost =
        selectedCostRanges.length === 0 ||
        selectedCostRanges.some((range) => checkCost(visa.base_cost_aud, range));

      const matchesTime =
        selectedTimeRanges.length === 0 ||
        (visa.processing_time_range && selectedTimeRanges.includes(visa.processing_time_range));

      return matchesSearch && matchesCategory && matchesCost && matchesTime;
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

  const toggleFilter = (
    value: string,
    current: string[],
    setter: (val: string[]) => void
  ) => {
    if (current.includes(value)) {
      setter(current.filter((v) => v !== value));
    } else {
      setter([...current, value]);
    }
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedCostRanges([]);
    setSelectedTimeRanges([]);
    setSearch('');
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedCostRanges.length > 0 ||
    selectedTimeRanges.length > 0 ||
    search.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Visa Search</h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Find detailed information, processing times, and expert guides for Australian visas.
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
            <Input
              placeholder="Search by name or subclass..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
             <Button
                variant="secondary"
                className="flex-1 md:flex-none"
                onClick={() => setShowFilters(!showFilters)}
            >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {(selectedCategories.length + selectedCostRanges.length + selectedTimeRanges.length) > 0 && (
                    <span className="ml-1 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 px-1.5 py-0.5 rounded-full text-xs font-medium">
                        {selectedCategories.length + selectedCostRanges.length + selectedTimeRanges.length}
                    </span>
                )}
                {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </Button>

            <div className="w-[180px]">
                <Select
                    options={SORTS}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                />
            </div>
          </div>
        </div>

        {/* Collapsible Filters Panel */}
        {showFilters && (
            <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-neutral-900 dark:text-white">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                        Reset all
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Categories */}
                    <div>
                        <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-3">Category</h4>
                        <div className="space-y-2">
                            {CATEGORIES.map((cat) => (
                                <Checkbox
                                    key={cat.value}
                                    label={cat.label}
                                    checked={selectedCategories.includes(cat.value)}
                                    onChange={() => toggleFilter(cat.value, selectedCategories, setSelectedCategories)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Cost Range */}
                    <div>
                        <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-3">Cost</h4>
                        <div className="space-y-2">
                            {COST_RANGES.map((range) => (
                                <Checkbox
                                    key={range.value}
                                    label={range.label}
                                    checked={selectedCostRanges.includes(range.value)}
                                    onChange={() => toggleFilter(range.value, selectedCostRanges, setSelectedCostRanges)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Processing Time */}
                    <div>
                        <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-3">Processing Time</h4>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {availableTimeRanges.length > 0 ? availableTimeRanges.map((time) => (
                                <Checkbox
                                    key={time}
                                    label={time}
                                    checked={selectedTimeRanges.includes(time)}
                                    onChange={() => toggleFilter(time, selectedTimeRanges, setSelectedTimeRanges)}
                                />
                            )) : (
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">No processing times available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Active Filters Chips */}
        {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
                {selectedCategories.map(cat => (
                    <Badge key={cat} variant="primary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                        {CATEGORIES.find(c => c.value === cat)?.label || cat}
                        <button onClick={() => toggleFilter(cat, selectedCategories, setSelectedCategories)} className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5 transition-colors">
                            <X className="w-3 h-3" />
                        </button>
                    </Badge>
                ))}
                {selectedCostRanges.map(range => (
                    <Badge key={range} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                        {COST_RANGES.find(r => r.value === range)?.label || range}
                        <button onClick={() => toggleFilter(range, selectedCostRanges, setSelectedCostRanges)} className="hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full p-0.5 transition-colors">
                            <X className="w-3 h-3" />
                        </button>
                    </Badge>
                ))}
                {selectedTimeRanges.map(time => (
                    <Badge key={time} variant="info" className="pl-2 pr-1 py-1 flex items-center gap-1">
                        {time}
                        <button onClick={() => toggleFilter(time, selectedTimeRanges, setSelectedTimeRanges)} className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors">
                            <X className="w-3 h-3" />
                        </button>
                    </Badge>
                ))}
                 {search && (
                    <Badge variant="warning" className="pl-2 pr-1 py-1 flex items-center gap-1">
                        Search: "{search}"
                        <button onClick={() => setSearch('')} className="hover:bg-yellow-200 dark:hover:bg-yellow-800 rounded-full p-0.5 transition-colors">
                            <X className="w-3 h-3" />
                        </button>
                    </Badge>
                )}
                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs h-auto py-1 px-2">
                        Clear all
                    </Button>
                )}
            </div>
        )}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <VisaCardSkeleton key={i} />)}  
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
