import { useEffect, useState } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import type { TrackerEntry } from '../../types/database';

export function TrackerManagement() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<TrackerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEntries = async () => {
    const { data } = await supabase
      .from('tracker_entries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    setEntries(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchEntries(); }, []);

  const handleDelete = async (id: string) => {
    await supabase.from('tracker_entries').delete().eq('id', id);
    toast('success', 'Entry deleted');
    fetchEntries();
  };

  const handleRefreshAll = async () => {
    setRefreshing(true);
    try {
      const baseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
      const apiUrl = `${baseUrl}/functions/v1/refresh-tracker`;
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
      });
      toast('success', 'Tracker stats refreshed');
    } catch {
      toast('error', 'Refresh failed');
    }
    setRefreshing(false);
  };

  const roleVariant = { user: 'primary' as const, lawyer: 'info' as const, admin: 'danger' as const };

  const columns: Column<TrackerEntry>[] = [
    { key: 'days', header: 'Days', render: (r) => <span className="font-mono font-medium">{r.processing_days}</span>, sortable: true },
    { key: 'outcome', header: 'Outcome', render: (r) => <Badge variant={r.outcome === 'approved' ? 'success' : r.outcome === 'refused' ? 'danger' : 'warning'}>{r.outcome}</Badge> },
    { key: 'role', header: 'Source', render: (r) => r.submitter_role ? <Badge variant={roleVariant[r.submitter_role]}>{r.submitter_role}</Badge> : <Badge>Anonymous</Badge> },
    { key: 'weight', header: 'Weight', render: (r) => r.weight.toString() },
    { key: 'date', header: 'Submitted', render: (r) => new Date(r.created_at).toLocaleDateString(), sortable: true },
    { key: 'actions', header: '', render: (r) => (
      <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500">
        <Trash2 className="w-4 h-4" />
      </button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Tracker Management</h1>
        <Button size="sm" variant="secondary" loading={refreshing} onClick={handleRefreshAll}>
          <RefreshCw className="w-4 h-4" /> Refresh All Stats
        </Button>
      </div>
      <DataTable columns={columns} data={entries} keyExtractor={(r) => r.id} loading={loading} />
    </div>
  );
}
