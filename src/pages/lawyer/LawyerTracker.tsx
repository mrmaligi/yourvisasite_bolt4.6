import { useEffect, useState } from 'react';
import { TrendingUp, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/input';
import { useToast } from '../../components/ui/Toast';
import { EmptyState } from '../../components/ui/EmptyState';

interface TrackerEntry {
  id: string;
  visa_id: string;
  visa_name: string | null;
  outcome: 'approved' | 'denied' | 'pending';
  processing_days: number;
  submission_date: string;
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
    submission_date: '',
    decision_date: '',
  });

  useEffect(() => {
    fetchData();
  }, [profile]);

  const fetchData = async () => {
    if (!profile) return;

    const { data: lawyerProfile } = await supabase
      .schema('lawyer')
      .from('profiles')
      .select('id')
      .eq('profile_id', profile.id)
      .maybeSingle();

    if (!lawyerProfile) {
      setLoading(false);
      return;
    }

    const [trackerRes, visasRes] = await Promise.all([
      supabase
        .from('tracker_entries')
        .select('id, visa_id, outcome, processing_days, submission_date, decision_date, created_at')
        .eq('submitter_id', lawyerProfile.id)
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

      setEntries(enriched);
    }

    setVisas(visasRes.data || []);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!profile || !formData.visa_id || !formData.processing_days || !formData.submission_date) {
      toast('error', 'Please fill all required fields');
      return;
    }

    const { data: lawyerProfile } = await supabase
      .schema('lawyer')
      .from('profiles')
      .select('id')
      .eq('profile_id', profile.id)
      .maybeSingle();

    if (!lawyerProfile) return;

    const { error } = await supabase.from('tracker_entries').insert({
      visa_id: formData.visa_id,
      submitter_id: lawyerProfile.id,
      submitter_type: 'lawyer',
      outcome: formData.outcome,
      processing_days: parseInt(formData.processing_days),
      submission_date: formData.submission_date,
      decision_date: formData.decision_date || null,
    });

    if (error) {
      toast('error', 'Failed to submit entry');
      return;
    }

    toast('success', 'Entry submitted successfully');
    setShowModal(false);
    setFormData({
      visa_id: '',
      outcome: 'approved',
      processing_days: '',
      submission_date: '',
      decision_date: '',
    });
    fetchData();
  };

  const outcomeVariant = {
    approved: 'success' as const,
    denied: 'error' as const,
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
                <CardContent className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{entry.visa_name}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-neutral-500">
                        <span>{entry.processing_days} days</span>
                        <span>Submitted: {new Date(entry.submission_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={outcomeVariant[entry.outcome]}>{entry.outcome}</Badge>
                </CardContent>
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

          <Input
            label="Processing Days *"
            type="number"
            value={formData.processing_days}
            onChange={(e) => setFormData({ ...formData, processing_days: e.target.value })}
            placeholder="e.g., 90"
          />

          <Input
            label="Submission Date *"
            type="date"
            value={formData.submission_date}
            onChange={(e) => setFormData({ ...formData, submission_date: e.target.value })}
          />

          <Input
            label="Decision Date (optional)"
            type="date"
            value={formData.decision_date}
            onChange={(e) => setFormData({ ...formData, decision_date: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
}
