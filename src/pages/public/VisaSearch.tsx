import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, FileText, ArrowUpRight, Filter, X, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Checkbox } from '../../components/ui/Checkbox';
import { VisaCardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import type { Visa } from '../../types/database';
import { createVisaSlug } from '../../lib/url-utils';

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

const parseCost = (costStr: string | null): number => {
  if (!costStr) return 0;
  if (costStr.toLowerCase().includes('free')) return 0;
  const num = parseInt(costStr.replace(/[^0-9]/g, ''));
  return isNaN(num) ? 0 : num;
};

const formatCost = (visa: Visa) => {
  return visa.cost_aud || 'Free / Varies';
};

export function VisaSearch() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [visas, setVisas] = useState<Visa[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCostRanges, setSelectedCostRanges] = useState<string[]>([]);
  const [selectedTimeRanges, setSelectedTimeRanges] = useState<string[]>([]);
  const [selectedVisas, setSelectedVisas] = useState<string[]>([]);
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

  const checkCost = (costStr: string | null, range: string) => {
    const cost = parseCost(costStr);
    if (!costStr) return false;

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
        selectedCostRanges.some((range) => checkCost(visa.cost_aud, range));

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
        const costA = parseCost(a.cost_aud);
        const costB = parseCost(b.cost_aud);
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

  const toggleVisaSelection = (visaId: string) => {
    if (selectedVisas.includes(visaId)) {
        setSelectedVisas(selectedVisas.filter(id => id !== visaId));
    } else {
        if (selectedVisas.length >= 3) {
            toast('error', 'Limit reached: You can compare up to 3 visas at a time.');
            return;
        }
        setSelectedVisas([...selectedVisas, visaId]);
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
      <div className="mb-12 relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-50/50 via-transparent to-transparent dark:from-emerald-900/20 rounded-3xl blur-2xl"></div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-semibold mb-4 border border-emerald-100 dark:border-emerald-800">
          <FileText className="w-3.5 h-3.5" />
          Comprehensive Database
        </div>
        <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-4">Visa Search</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          Find detailed information, processing times, and expert guides for Australian visas tailored to your unique journey.
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-10">
        <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-neutral-800/50 p-2 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 backdrop-blur-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Search by name or subclass..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-transparent border-none focus:ring-0 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 outline-none"
            />
          </div>

          <div className="hidden md:block w-px h-8 bg-neutral-200 dark:bg-neutral-700 self-center mx-2"></div>

          <div className="flex gap-2 w-full md:w-auto px-2">
             <Button
                variant="ghost"
                className="flex-1 md:flex-none text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                onClick={() => setShowFilters(!showFilters)}
            >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {(selectedCategories.length + selectedCostRanges.length + selectedTimeRanges.length) > 0 && (
                    <span className="ml-1.5 bg-emerald-600 text-white dark:bg-emerald-500 px-2 py-0.5 rounded-full text-xs font-bold">
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
                    className="border-none bg-neutral-50 dark:bg-neutral-800/80 shadow-none focus:ring-1 focus:ring-emerald-500"
                />
            </div>
          </div>
        </div>

        {showFilters && (
            <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-neutral-900 dark:text-white">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                        Reset all
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

        {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
                {selectedCategories.map(cat => (
                    <Badge key={cat} variant="primary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                        {CATEGORIES.find(c => c.value === cat)?.label || cat}
                        <button onClick={() => toggleFilter(cat, selectedCategories, setSelectedCategories)} className="hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-full p-0.5 transition-colors">
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
            <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Showing <span className="text-neutral-900 dark:text-white">{filteredVisas.length}</span> of {visas.length} visas
                </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {filteredVisas.map((visa) => (
                <div key={visa.id} className="relative group block h-full">
                    <div className="absolute top-4 right-4 z-20" onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}>
                         <div className="bg-white/95 dark:bg-neutral-800/95 backdrop-blur-md rounded-lg shadow-md p-1.5 border border-neutral-200/80 dark:border-neutral-700/80 hover:scale-105 transition-transform">
                            <Checkbox
                                checked={selectedVisas.includes(visa.id)}
                                onChange={() => toggleVisaSelection(visa.id)}
                                aria-label="Select for comparison"
                            />
                         </div>
                    </div>
                    <Link to={`/visas/${createVisaSlug(visa.name, visa.subclass)}`} className="block h-full">
                        <div className="h-full bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100/50 to-transparent dark:from-emerald-900/20 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-110"></div>
                            <div className="p-6 space-y-5 h-full flex flex-col">
                                <div className="flex items-start justify-between">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-bold border border-neutral-200 dark:border-neutral-600">
                                            {visa.subclass}
                                        </span>
                                        <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-semibold border border-emerald-100 dark:border-emerald-800/50">
                                            {visa.category}
                                        </span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                </div>

                                <div className="pr-4 flex-grow">
                                    <h3 className="font-bold text-xl text-neutral-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        {visa.name}
                                    </h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                                        {visa.summary}
                                    </p>
                                </div>

                                <div className="pt-5 border-t border-neutral-100 dark:border-neutral-700/50 flex flex-col gap-2 mt-auto">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-neutral-500 dark:text-neutral-500 text-xs uppercase tracking-wider font-medium">Cost</span>
                                        <span className="text-neutral-900 dark:text-white font-bold">
                                            {formatCost(visa)}
                                        </span>
                                    </div>
                                    {visa.processing_time_range && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-neutral-500 dark:text-neutral-500 text-xs uppercase tracking-wider font-medium">Processing Time</span>
                                            <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                                                {visa.processing_time_range}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
            </div>
        </>
      )}

      {selectedVisas.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-sm font-medium">
                        {selectedVisas.length} selected
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 hidden sm:block">
                        Select up to 3 visas to compare
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedVisas([])}>
                        Clear
                    </Button>
                    <Button
                        disabled={selectedVisas.length < 2}
                        onClick={() => navigate(`/visas/compare?ids=${selectedVisas.join(',')}`)}
                    >
                        Compare Visas
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
