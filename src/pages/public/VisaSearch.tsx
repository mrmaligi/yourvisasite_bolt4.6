import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, ArrowUpRight, Filter, X, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Checkbox } from '../../components/ui/Checkbox';
import { VisaCardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorBoundary } from '../../components/ui/ErrorBoundary';
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
        visa.subclass_number.toLowerCase().includes(search.toLowerCase());

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
        return a.subclass_number.localeCompare(b.subclass_number);
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
    <ErrorBoundary>
      <div className="bg-neutral-50 min-h-screen pb-12">
        {/* Breadcrumb Header */}
        <div className="bg-white border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm text-neutral-500">
              <Link to="/" className="hover:text-navy-600">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-navy-700 font-medium">Visa Search</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-navy-700 mb-2">Visa Search</h1>
            <p className="text-neutral-600">
              Find detailed information, processing times, and expert guides for Australian visas.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardBody className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-navy-700">Filters</h3>
                    {hasActiveFilters && (
                      <button 
                        onClick={resetFilters}
                        className="text-sm text-neutral-500 hover:text-navy-600"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* Categories */}
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-700 mb-3">Category</h4>
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

                  <div className="border-t border-neutral-200 pt-4">
                    <h4 className="text-sm font-semibold text-neutral-700 mb-3">Cost Range</h4>
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

                  {availableTimeRanges.length > 0 && (
                    <div className="border-t border-neutral-200 pt-4">
                      <h4 className="text-sm font-semibold text-neutral-700 mb-3">Processing Time</h4>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {availableTimeRanges.map((time) => (
                          <Checkbox
                            key={time}
                            label={time}
                            checked={selectedTimeRanges.includes(time)}
                            onChange={() => toggleFilter(time, selectedTimeRanges, setSelectedTimeRanges)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search & Sort Bar */}
              <div className="bg-white border border-neutral-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <Input
                      placeholder="Search by name or subclass..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-12"
                    />
                  </div>

                  <div className="w-full md:w-48">
                    <Select
                      options={SORTS}
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    />
                  </div>
                </div>

                {/* Active Filter Chips */}
                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-neutral-200">
                    {selectedCategories.map(cat => (
                      <Badge key={cat} variant="navy" className="flex items-center gap-1">
                        {CATEGORIES.find(c => c.value === cat)?.label || cat}
                        <button onClick={() => toggleFilter(cat, selectedCategories, setSelectedCategories)} className="hover:opacity-70">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                    {selectedCostRanges.map(range => (
                      <Badge key={range} variant="gold" className="flex items-center gap-1">
                        {COST_RANGES.find(r => r.value === range)?.label || range}
                        <button onClick={() => toggleFilter(range, selectedCostRanges, setSelectedCostRanges)} className="hover:opacity-70">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                    {selectedTimeRanges.map(time => (
                      <Badge key={time} variant="info" className="flex items-center gap-1">
                        {time}
                        <button onClick={() => toggleFilter(time, selectedTimeRanges, setSelectedTimeRanges)} className="hover:opacity-70">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                    {search && (
                      <Badge variant="default" className="flex items-center gap-1">
                        Search: "{search}"
                        <button onClick={() => setSearch('')} className="hover:opacity-70">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Results Count */}
              <p className="text-sm text-neutral-500 mb-4">
                Showing <span className="font-semibold text-navy-700">{filteredVisas.length}</span> of {<span className="font-semibold text-navy-700">{visas.length}</span>} visas
              </p>

              {/* Results Grid */}
              {loading ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => <VisaCardSkeleton key={i} />)}  
                </div>
              ) : filteredVisas.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No visas found"
                  description="Try adjusting your search or filter criteria."
                />
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredVisas.map((visa) => (
                    <Link key={visa.id} to={`/visas/${visa.id}`}>
                      <Card hover accent="left" className="h-full group">
                        <CardBody className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="navy">{visa.subclass_number}</Badge>
                              <Badge variant="default">{visa.category}</Badge>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-navy-600 transition-colors" />
                          </div>

                          <div>
                            <h3 className="font-semibold text-navy-700 group-hover:text-navy-800 transition-colors">
                              {visa.name}
                            </h3>
                            <p className="text-sm text-neutral-600 line-clamp-2 mt-1">
                              {visa.summary}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-sm">
                            <span className="font-semibold text-navy-700">
                              {visa.cost_aud ? visa.cost_aud : 'Free / Varies'}
                            </span>
                            {visa.processing_time_range && (
                              <span className="text-neutral-500">
                                {visa.processing_time_range}
                              </span>
                            )}
                          </div>
                        </CardBody>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination Placeholder */}
              {!loading && filteredVisas.length > 0 && (
                <div className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-6">
                  <Button variant="ghost" disabled>
                    Previous
                  </Button>
                  <span className="text-sm text-neutral-500">
                    Page 1 of 1
                  </span>
                  <Button variant="ghost" disabled>
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
