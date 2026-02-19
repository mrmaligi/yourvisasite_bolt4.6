import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Search, TrendingUp, Filter, BarChart3, AlertCircle, Pencil } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { TrackerCardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { TrackerSubmitForm } from './TrackerSubmitForm';
import { TRACKER_THRESHOLDS } from '../../lib/constants';
import type { TrackerStats, VisaCategory, TrackerEntry } from '../../types/database';

interface VisaInfo {
  subclass: string;
  name: string;
  category: VisaCategory;
}

interface TrackerData extends TrackerStats {
  visas: VisaInfo;
}

interface PendingEntry extends TrackerEntry {
  visas: Pick<VisaInfo, 'subclass' | 'name'>;
}

function getSpeedBadge(days: number) {
  if (days <= TRACKER_THRESHOLDS.FAST_MAX_DAYS) return { label: 'Fast', variant: 'success' as const };
  if (days <= TRACKER_THRESHOLDS.MODERATE_MAX_DAYS) return { label: 'Moderate', variant: 'warning' as const };
  return { label: 'Slow', variant: 'danger' as const };
}

function VisualBar({ p25, median, p75, avg }: { p25: number; median: number; p75: number; avg: number }) {
  // Determine scale. A reasonable max is 1.5x the p75 or 2x the average, ensuring it fits.
  // We'll use a local max for each bar to show distribution shape clearly, or a fixed max?
  // Fixed max is better for comparison but hard with varying scales (10 days vs 500 days).
  // Let's use a "relative" bar where the width represents 0 to Max(p75 * 1.2, avg * 1.2).
  const maxVal = Math.max(p75 * 1.2, avg * 1.2, 1); // Avoid div by 0

  const getPct = (val: number) => Math.min((val / maxVal) * 100, 100);

  const left = getPct(p25);
  const width = getPct(p75) - left;
  const medianPos = getPct(median);

  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-neutral-400 mb-1">
        <span>0d</span>
        <span>{Math.round(maxVal)}d+</span>
      </div>
      <div className="relative h-6 bg-neutral-100 rounded-full overflow-hidden w-full">
        {/* Range Bar (p25 to p75) */}
        <div
          className="absolute h-full bg-primary-200/50 border-x border-primary-300"
          style={{ left: `${left}%`, width: `${width}%` }}
          title={`Typical range: ${Math.round(p25)} - ${Math.round(p75)} days`}
        />

        {/* Median Marker */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-primary-600 z-10"
          style={{ left: `${medianPos}%` }}
          title={`Median: ${Math.round(median)} days`}
        />

        {/* Labels for p25 and p75 if space permits (optional, maybe too cluttered) */}
      </div>
      <div className="flex justify-between text-xs text-neutral-500 mt-1">
         <span style={{ paddingLeft: `${Math.max(0, left - 5)}%` }}>{Math.round(p25)}</span>
         <span style={{ paddingLeft: `${Math.max(0, medianPos - left - 5)}%`, fontWeight: 'bold' }}>{Math.round(median)}</span>
         <span style={{ paddingRight: `${Math.max(0, 100 - (left + width) - 5)}%` }}>{Math.round(p75)}</span>
      </div>
    </div>
  );
}

export function Tracker() {
  const { user } = useAuth();
  const [stats, setStats] = useState<TrackerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'avg' | 'entries'>('name');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [pendingEntries, setPendingEntries] = useState<PendingEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<TrackerEntry | undefined>(undefined);

  // Categories derived from data
  const categories = Array.from(new Set(stats.map(s => s.visas.category))).sort();

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (user) {
      fetchPendingEntries();
    } else {
      setPendingEntries([]);
    }
  }, [user]);

  const fetchStats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tracker_stats')
      .select('*, visas!inner(subclass, name, category)');

    if (error) {
      console.error('Error fetching tracker stats:', error);
    } else {
      setStats(data as unknown as TrackerData[]);
    }
    setLoading(false);
  };

  const fetchPendingEntries = async () => {
    const { data, error } = await supabase
      .from('tracker_entries')
      .select('*, visas(subclass, name)')
      .eq('submitted_by', user!.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending entries:', error);
    } else {
      setPendingEntries(data as unknown as PendingEntry[]);
    }
  };

  const filteredStats = stats
    .filter((s) => {
      const matchesSearch =
        s.visas.name.toLowerCase().includes(search.toLowerCase()) ||
        s.visas.subclass.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category ? s.visas.category === category : true;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.visas.name.localeCompare(b.visas.name);
      if (sortBy === 'avg') return (a.weighted_avg_days || 0) - (b.weighted_avg_days || 0);
      if (sortBy === 'entries') return b.total_entries - a.total_entries;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Visa Processing Time Tracker</h1>
          <p className="text-neutral-500 text-lg">
            Real processing times from actual applicants
          </p>
        </div>
        <button
          onClick={() => {
              setEditingEntry(undefined);
              setShowSubmitModal(true);
          }}
          className="btn-primary whitespace-nowrap flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Submit Your Processing Time
        </button>
      </div>

      {user && pendingEntries.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary-600 rounded-full"></div>
            <h2 className="text-xl font-bold text-neutral-900">My Pending Applications</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pendingEntries.map((entry) => (
              <Card key={entry.id} className="border-l-4 border-l-primary-500">
                <CardBody>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="default">{entry.visas.subclass}</Badge>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                  <h3 className="font-bold text-neutral-900 mb-4">{entry.visas.name}</h3>
                  <div className="space-y-1 mb-4">
                    <p className="text-sm text-neutral-500">Applied: {new Date(entry.application_date).toLocaleDateString()}</p>
                    <p className="text-xs text-neutral-400">Waiting for {Math.floor((Date.now() - new Date(entry.application_date).getTime()) / (1000 * 60 * 60 * 24))} days</p>
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full justify-center"
                    onClick={() => {
                        setEditingEntry(entry);
                        setShowSubmitModal(true);
                    }}
                  >
                    <Pencil className="w-3 h-3 mr-2" />
                    Update Status
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by visa name or subclass..."
            className="input-field pl-12"
          />
        </div>
        <div className="w-full sm:w-48 relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field pl-10 appearance-none bg-white"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-48 relative">
          <BarChart3 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="input-field pl-10 appearance-none bg-white"
          >
            <option value="name">Name (A-Z)</option>
            <option value="avg">Processing Time</option>
            <option value="entries">Total Entries</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <TrackerCardSkeleton key={i} />)}
        </div>
      ) : filteredStats.length === 0 ? (
        <EmptyState
          icon={AlertCircle}
          title="No data found"
          description={stats.length === 0 ? "No tracker data available yet." : "Try adjusting your search filters."}
          action={stats.length === 0 ? { label: 'Submit First Entry', onClick: () => setShowSubmitModal(true) } : undefined}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStats.map((stat) => {
            const avgDays = Math.round(stat.weighted_avg_days || 0);
            const badge = getSpeedBadge(avgDays);
            return (
              <Card key={stat.visa_id} hover className="h-full flex flex-col">
                <CardBody className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Badge variant="default" className="mb-2">{stat.visas.subclass}</Badge>
                      <h3 className="font-bold text-neutral-900 leading-tight">{stat.visas.name}</h3>
                      <p className="text-sm text-neutral-500 mt-1 capitalize">{stat.visas.category}</p>
                    </div>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-neutral-100 mb-4">
                    <div>
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Average</p>
                      <p className="text-2xl font-bold text-neutral-900">{avgDays}d</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Reports</p>
                      <p className="text-2xl font-bold text-neutral-900">{stat.total_entries}</p>
                    </div>
                  </div>

                  <div className="space-y-1 mb-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Median</span>
                      <span className="font-semibold">{Math.round(stat.median_days || 0)} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Range (25-75%)</span>
                      <span className="font-semibold">{Math.round(stat.p25_days || 0)} - {Math.round(stat.p75_days || 0)} days</span>
                    </div>
                  </div>

                  <div className="flex-1 min-h-[60px] flex items-end">
                     <VisualBar
                       p25={stat.p25_days || 0}
                       median={stat.median_days || 0}
                       p75={stat.p75_days || 0}
                       avg={stat.weighted_avg_days || 0}
                     />
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-12 p-4 bg-neutral-50 rounded-xl text-sm text-neutral-500 text-center">
        <p>Disclaimer: Processing times are based on community-reported data and may not reflect current Department of Home Affairs processing times.</p>
      </div>

      <Modal
        isOpen={showSubmitModal}
        onClose={() => {
            setShowSubmitModal(false);
            setEditingEntry(undefined);
        }}
        title={editingEntry ? "Update Application" : "Submit Processing Time"}
        size="lg"
      >
        <TrackerSubmitForm
          onSuccess={() => {
            setShowSubmitModal(false);
            setEditingEntry(undefined);
            fetchStats();
            if (user) fetchPendingEntries();
          }}
          initialEntry={editingEntry}
        />
      </Modal>
    </div>
  );
}
