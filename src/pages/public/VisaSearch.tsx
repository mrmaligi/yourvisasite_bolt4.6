import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, ArrowUpRight } from 'lucide-react';
import { useVisas } from '../../hooks/useVisas';
import { useSavedVisas } from '../../hooks/useSavedVisas';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { SaveVisaButton } from '../../components/ui/SaveVisaButton';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';

const COUNTRIES = [
  { value: '', label: '🌍 All Countries' },
  { value: 'Australia', label: '🇦🇺 Australia' },
  { value: 'Canada', label: '🇨🇦 Canada' },
  { value: 'United Kingdom', label: '🇬🇧 United Kingdom' },
];

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'work', label: 'Work' },
  { value: 'family', label: 'Family' },
  { value: 'student', label: 'Student' },
  { value: 'visitor', label: 'Visitor' },
  { value: 'humanitarian', label: 'Humanitarian' },
  { value: 'business', label: 'Business' },
  { value: 'other', label: 'Other' },
];

export function VisaSearch() {
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('');
  const { visas, loading } = useVisas(search, country || undefined, category || undefined);
  const { isSaved, toggleSave } = useSavedVisas();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Visa Search</h1>
        <p className="text-neutral-500">
          Find detailed information, processing times, and expert guides for visa types worldwide.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or subclass number..."
              className="input-field pl-12 py-3"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {COUNTRIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCountry(c.value)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                country === c.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {c.label}
            </button>
          ))}
          <div className="w-px bg-neutral-200 mx-1" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                category === cat.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : visas.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No visas found"
          description="Try adjusting your search or filter criteria."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visas.map((visa) => (
            <Link key={visa.id} to={`/visas/${visa.id}`}>
              <Card hover className="h-full">
                <CardBody className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Badge>{visa.subclass_number}</Badge>
                      <Badge variant="primary">{visa.category}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <SaveVisaButton visaId={visa.id} isSaved={isSaved(visa.id)} onToggle={toggleSave} />
                      <ArrowUpRight className="w-4 h-4 text-neutral-400" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-neutral-900">{visa.name}</h3>
                  <p className="text-sm text-neutral-500">{visa.country}</p>
                  {visa.summary && (
                    <p className="text-sm text-neutral-500 line-clamp-2">{visa.summary}</p>
                  )}
                  {visa.tracker_stats && (
                    <div className="flex items-center gap-4 pt-2 border-t border-neutral-100 text-xs text-neutral-400">
                      <span>Avg: {Math.round(visa.tracker_stats.weighted_avg_days ?? 0)}d</span>
                      <span>{visa.tracker_stats.total_entries} reports</span>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
