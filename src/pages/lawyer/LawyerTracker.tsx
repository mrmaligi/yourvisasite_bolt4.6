import { useEffect, useState } from 'react';
import { TrendingUp, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { EmptyState } from '../../components/ui/EmptyState';

interface TrackerEntry {
  id: string;
  visa_id: string;
  visa_name: string | null;
  outcome: 'approved' | 'denied' | 'pending';
  processing_days: number | null;
  application_date: string;
  decision_date: string | null;
  created_at: string;
}

export function LawyerTracker() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<TrackerEntry[]>([]);
  const [visas, setVisas] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    visa_id: '',
    outcome: 'approved' as 'approved' | 'denied' | 'pending',
    processing_days: '',
    application_date: '',
    decision_date: '',
  });

  useEffect(() => {
    fetchData();
  }, [profile]);

  const fetchData = async () => {
    if (!profile) return;

    // Use profile.id directly as submitted_by references public.profiles
    const [trackerRes, visasRes] = await Promise.all([
      supabase
        .from('tracker_entries')
        .select('id, visa_id, outcome, processing_days, application_date, decision_date, created_at')
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

      setEntries(enriched as TrackerEntry[]);
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

    const { error } = await supabase.from('tracker_entries').insert({
      visa_id: formData.visa_id,
      submitted_by: profile.id,
      submitter_role: 'lawyer',
      outcome: formData.outcome,
      // processing_days is calculated by trigger, but we can pass null or omit it
      // actually the form has processing_days input, but it's redundant if we have dates.
      // let's omit it and let the trigger handle it.
      application_date: formData.application_date,
      decision_date: formData.decision_date || null,
    });

    if (error) {
      console.error(error);
      toast('error', 'Failed to submit entry');
      return;
    }

    toast('success', 'Entry submitted successfully');
    setShowModal(false);
    setFormData({
      visa_id: '',
      outcome: 'approved',
      processing_days: '',
      application_date: '',
      decision_date: '',
    });
    fetchData();
  };

  const outcomeVariant = {
    approved: 'success' as const,
    denied: 'danger' as const,
    pending: 'warning' as const,
  };

  const outcomeIcon = {
    approved: CheckCircle,
    denied: XCircle,
    pending: Clock,
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
        <div className="space-y-3">
          {entries.map((entry) => {
            const Icon = outcomeIcon[entry.outcome];
            return (
              <Card key={entry.id}>
                <CardBody className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{entry.visa_name}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-neutral-500">
                        {entry.processing_days !== null && (
                          <span>{entry.processing_days} days</span>
                        )}
                        <span>Applied: {new Date(entry.application_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={outcomeVariant[entry.outcome]}>{entry.outcome}</Badge>
                </CardBody>
              </Card>
            );
          })}
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
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                setFormData({ ...formData, outcome: e.target.value as 'approved' | 'denied' | 'pending' })
              }
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="approved">Approved</option>
              <option value="denied">Denied</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Processing Days is calculated automatically, so we remove the input */}

          <Input
            label="Application Date *"
            type="date"
            value={formData.application_date}
            onChange={(e) => setFormData({ ...formData, application_date: e.target.value })}
          />

          <Input
            label="Decision Date"
            type="date"
            value={formData.decision_date}
            onChange={(e) => setFormData({ ...formData, decision_date: e.target.value })}
            helperText={formData.outcome === 'pending' ? 'Optional for pending applications' : 'Required for completed applications'}
          />
        </div>
      </Modal>
    </div>
  );
}
