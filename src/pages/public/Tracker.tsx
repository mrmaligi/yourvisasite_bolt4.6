import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Clock, ArrowUpRight } from 'lucide-react';
import { useTrackerStats } from '../../hooks/useVisas';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/Badge';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { TRACKER_THRESHOLDS } from '../../lib/constants';
import { TrackerSubmitForm } from './TrackerSubmitForm';

function getSpeedBadge(days: number) {
  if (days <= TRACKER_THRESHOLDS.FAST_MAX_DAYS) return { label: 'Fast', variant: 'success' as const };
  if (days <= TRACKER_THRESHOLDS.MODERATE_MAX_DAYS) return { label: 'Moderate', variant: 'warning' as const };
  return { label: 'Slow', variant: 'danger' as const };
}

export function Tracker() {
  const { stats, loading } = useTrackerStats();
  const [search, setSearch] = useState('');
  const [showSubmit, setShowSubmit] = useState(false);

  const filtered = stats.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.subclass_number.toLowerCase().includes(search.toLowerCase())
  );

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
          <CardContent>
            <TrackerSubmitForm onSuccess={() => setShowSubmit(false)} />
          </CardContent>
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
          title="No tracker data yet"
          description="Be the first to submit your processing time and help others in the community."
          action={{ label: 'Submit Processing Time', onClick: () => setShowSubmit(true) }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((v) => {
            const avgDays = Math.round(v.tracker_stats.weighted_avg_days ?? 0);
            const badge = getSpeedBadge(avgDays);
            return (
              <Link key={v.id} to={`/visas/${v.id}`}>
                <Card hover className="h-full">
                  <CardContent className="space-y-4">
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
                        <p className="text-lg font-bold text-neutral-900">{avgDays}d</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400">Trend</p>
                        <p className="text-lg font-bold text-neutral-900">
                          {Math.round(v.tracker_stats.ewma_days || 0)}d
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400">Reports</p>
                        <p className="text-lg font-bold text-neutral-900">{v.tracker_stats.total_entries}</p>
                      </div>
                    </div>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
