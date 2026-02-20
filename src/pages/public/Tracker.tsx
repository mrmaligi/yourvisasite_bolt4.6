import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Search, TrendingUp, Filter, BarChart3, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { TrackerCardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { TrackerWizard } from '../../components/tracker/TrackerWizard';
import { TrackerStatsCard } from '../../components/tracker/TrackerStatsCard';
import { TrackerEntryCard } from '../../components/tracker/TrackerEntryCard';
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
              <TrackerEntryCard
                key={entry.id}
                entry={entry}
                onClick={() => {
                  setEditingEntry(entry);
                  setShowSubmitModal(true);
                }}
                // Pass average days if available?
                // We'd need to find the stats for this visa.
                avgDays={stats.find(s => s.visa_id === entry.visa_id)?.weighted_avg_days || undefined}
              />
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
          {filteredStats.map((stat) => (
             <TrackerStatsCard key={stat.visa_id} data={stat} />
          ))}
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
        <TrackerWizard
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
