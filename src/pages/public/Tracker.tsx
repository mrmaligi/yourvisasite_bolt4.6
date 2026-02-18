import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Clock, ArrowUpRight } from 'lucide-react';
import { useTrackerStats } from '../../hooks/useVisas';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { TRACKER_THRESHOLDS } from '../../lib/constants';
import { TrackerSubmitForm } from './TrackerSubmitForm';
import type { Visa, TrackerStats } from '../../types/database';

function getSpeedBadge(days: number) {
  if (days <= TRACKER_THRESHOLDS.FAST_MAX_DAYS) return { label: 'Fast', variant: 'success' as const };
  if (days <= TRACKER_THRESHOLDS.MODERATE_MAX_DAYS) return { label: 'Moderate', variant: 'warning' as const };
  return { label: 'Slow', variant: 'danger' as const };
}

const CATEGORY_MAP: Record<string, string> = {
  work: 'Skilled Visas',
  family: 'Family Visas',
  student: 'Student Visas',
  visitor: 'Visitor Visas',
  humanitarian: 'Other Visas',
  business: 'Other Visas',
  other: 'Other Visas',
};

const CATEGORY_ORDER = ['Skilled Visas', 'Family Visas', 'Student Visas', 'Visitor Visas', 'Other Visas'];

export function Tracker() {
  const { stats, loading } = useTrackerStats();
  const [search, setSearch] = useState('');
  const [showSubmit, setShowSubmit] = useState(false);

  const filtered = useMemo(() => {
    return stats.filter(
      (v) =>
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.subclass_number.toLowerCase().includes(search.toLowerCase())
    );
  }, [stats, search]);

  const grouped = useMemo(() => {
    const groups: Record<string, (Visa & { tracker_stats: TrackerStats })[]> = {};
    filtered.forEach((v) => {
      const label = CATEGORY_MAP[v.category] || 'Other Visas';
      if (!groups[label]) groups[label] = [];
      groups[label].push(v);
    });
    return groups;
  }, [filtered]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Visa Processing Tracker</h1>
          <p className="text-neutral-500">
            Real processing times from real applicants, weighted by source reliability.
          </p>
        </div>
        <button
          onClick={() => setShowSubmit(!showSubmit)}
          className="btn-primary whitespace-nowrap"
        >
          <TrendingUp className="w-4 h-4" />
          Submit Your Time
        </button>
      </div>

      {showSubmit && (
        <Card className="mb-8">
          <CardBody>
            <TrackerSubmitForm onSuccess={() => setShowSubmit(false)} />
          </CardBody>
        </Card>
      )}

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by visa name or subclass number..."
          className="input-field pl-12 py-3 text-base"
        />
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No tracker data found"
          description="Try adjusting your search terms or check back later."
          action={{ label: 'Clear Search', onClick: () => setSearch('') }}
        />
      ) : (
        <div className="space-y-10">
          {CATEGORY_ORDER.map((category) => {
            const visas = grouped[category];
            if (!visas || visas.length === 0) return null;

            return (
              <div key={category}>
                <h2 className="text-xl font-bold text-neutral-900 mb-4">{category}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visas.map((v) => {
                    const avgDays = Math.round(v.tracker_stats.weighted_avg_days ?? 0);
                    const badge = getSpeedBadge(avgDays);
                    return (
                      <Link key={v.id} to={`/visas/${v.id}`}>
                        <Card hover className="h-full">
                          <CardBody className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <Badge variant="default">{v.subclass_number}</Badge>
                                <h3 className="font-semibold text-neutral-900 mt-2">{v.name}</h3>
                                <p className="text-sm text-neutral-500">{v.country}</p>
                              </div>
                              <ArrowUpRight className="w-4 h-4 text-neutral-400" />
                            </div>
                            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-neutral-100">
                              <div>
                                <p className="text-xs text-neutral-400">Avg</p>
                                <p className="text-lg font-bold text-neutral-900">{avgDays > 0 ? `${avgDays}d` : '-'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-neutral-400">Median</p>
                                <p className="text-lg font-bold text-neutral-900">
                                  {v.tracker_stats.median_days ? `${Math.round(v.tracker_stats.median_days)}d` : '-'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-neutral-400">Reports</p>
                                <p className="text-lg font-bold text-neutral-900">{v.tracker_stats.total_entries}</p>
                              </div>
                            </div>
                            <Badge variant={avgDays > 0 ? badge.variant : 'neutral'}>{avgDays > 0 ? badge.label : 'No Data'}</Badge>

                            {avgDays > 0 && (
                              <div className="pt-4 mt-2 border-t border-neutral-100">
                                <div className="text-xs text-neutral-500 mb-2 flex justify-between">
                                  <span>Typical range</span>
                                  <span className="font-medium text-neutral-900">
                                    {Math.round(v.tracker_stats.p25_days || 0)}d - {Math.round(v.tracker_stats.p75_days || 0)}d
                                  </span>
                                </div>
                                <div className="relative h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                  {/* Range Bar */}
                                  <div
                                    className="absolute h-full bg-neutral-300 rounded-full opacity-50"
                                    style={{
                                      left: `${Math.min(100, ((v.tracker_stats.p25_days || 0) / 365) * 100)}%`,
                                      width: `${Math.min(100, (((v.tracker_stats.p75_days || 0) - (v.tracker_stats.p25_days || 0)) / 365) * 100)}%`,
                                    }}
                                  />
                                  {/* Median Marker */}
                                  <div
                                    className="absolute h-full w-1 bg-neutral-900 rounded-full"
                                    style={{
                                      left: `${Math.min(100, ((v.tracker_stats.median_days || 0) / 365) * 100)}%`,
                                    }}
                                  />
                                </div>
                                <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                                  <span>0d</span>
                                  <span>1 Year+</span>
                                </div>
                              </div>
                            )}
                          </CardBody>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
