import { useEffect, useState } from 'react';
import { TrendingUp, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { EmptyState } from '../../components/ui/EmptyState';
import { TrackerEntryCard } from '../../components/tracker/TrackerEntryCard';
import type { TrackerEntry, TrackerOutcome } from '../../types/database';

// Extend TrackerEntry to include visa_name which we enrich manually
interface ExtendedEntry extends TrackerEntry {
  visa_name?: string | null;
}

export function LawyerTracker() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<ExtendedEntry[]>([]);
  const [visas, setVisas] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    visa_id: '',
    outcome: 'approved' as TrackerOutcome,
    application_date: '',
    decision_date: '',
  });

  useEffect(() => {
    fetchData();
  }, [profile]);

  const fetchData = async () => {
    if (!profile) return;

    // Fetch entries with status
    const [trackerRes, visasRes] = await Promise.all([
      supabase
        .from('tracker_entries')
        .select('*') // Select all including status
        .eq('submitted_by', profile.id)
        .order('created_at', { ascending: false }),
      supabase.from('visas').select('id, name').order('name'),
    ]);

    if (trackerRes.data) {
      const visaIds = [...new Set(trackerRes.data.map(e => e.visa_id))];
      const { data: visaDetails } = await supabase
        .from('visas')
        .select('id, name')
        .in('id', visaIds);

      const visaMap = new Map(visaDetails?.map(v => [v.id, v.name]) || []);

      const enriched = trackerRes.data.map(e => ({
        ...e,
        visa_name: visaMap.get(e.visa_id) || null,
      }));

      setEntries(enriched as ExtendedEntry[]);
    }

    setVisas(visasRes.data || []);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!profile || !formData.visa_id || !formData.application_date) {
      toast('error', 'Please fill all required fields');
      return;
    }

    if (formData.outcome !== 'pending' && !formData.decision_date) {
       toast('error', 'Decision date is required for completed applications');
       return;
    }

    const isPending = formData.outcome === 'pending';

    const { error } = await supabase.from('tracker_entries').insert({
      visa_id: formData.visa_id,
      submitted_by: profile.id,
      submitter_role: 'lawyer',
      outcome: formData.outcome,
      status: isPending ? 'pending' : 'completed',
      application_date: formData.application_date,
      decision_date: isPending ? null : formData.decision_date,
    });

    if (error) {
      console.error(error);
      toast('error', 'Failed to submit entry');
      return;
    }

    // Refresh stats
    await supabase.rpc('refresh_tracker_stats');

    toast('success', 'Entry submitted successfully');
    setShowModal(false);
    setFormData({
      visa_id: '',
      outcome: 'approved',
      application_date: '',
      decision_date: '',
    });
    fetchData();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900">Visa Tracker</h1>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-neutral-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Visa Tracker</h1>
          <p className="text-neutral-500 mt-1">
            Submit client outcomes to improve processing time data.
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Entry
        </Button>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No tracker entries"
          description="Submit your first client outcome to contribute to processing time analytics."
        />
      ) : (
        <div className="grid gap-4">
          {entries.map((entry) => (
             <TrackerEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Tracker Entry"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit Entry</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Visa Type *
            </label>
            <select
              value={formData.visa_id}
              onChange={(e) => setFormData({ ...formData, visa_id: e.target.value })}
              className="input-field w-full"
            >
              <option value="">Select a visa</option>
              {visas.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Outcome *
            </label>
            <select
              value={formData.outcome}
              onChange={(e) =>
                setFormData({ ...formData, outcome: e.target.value as TrackerOutcome })
              }
              className="input-field w-full"
            >
              <option value="approved">Approved</option>
              <option value="refused">Refused</option>
              <option value="withdrawn">Withdrawn</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <Input
            label="Application Date *"
            type="date"
            value={formData.application_date}
            onChange={(e) => setFormData({ ...formData, application_date: e.target.value })}
            max={new Date().toISOString().split('T')[0]}
          />

          <Input
            label="Decision Date"
            type="date"
            value={formData.decision_date}
            onChange={(e) => setFormData({ ...formData, decision_date: e.target.value })}
            helperText={formData.outcome === 'pending' ? 'Optional for pending applications' : 'Required for completed applications'}
            disabled={formData.outcome === 'pending'}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </Modal>
    </div>
  );
}
