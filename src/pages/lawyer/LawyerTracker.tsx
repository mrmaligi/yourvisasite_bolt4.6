import { useEffect, useState } from 'react';
import { TrendingUp, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { TrackerStatusBadge } from '../../components/tracker/TrackerStatusBadge';
import { TrackerWizard } from '../../components/tracker/TrackerWizard';

interface TrackerEntry {
  id: string;
  visa_id: string;
  visa_name: string | null;
  outcome: 'approved' | 'refused' | 'withdrawn' | 'pending';
  processing_days: number | null;
  application_date: string;
  decision_date: string | null;
  created_at: string;
}

export function LawyerTracker() {
  const { profile } = useAuth();
  const [entries, setEntries] = useState<TrackerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [profile]);

  const fetchData = async () => {
    if (!profile) return;

    // Use profile.id directly as submitted_by references public.profiles
    const [trackerRes] = await Promise.all([
      supabase
        .from('tracker_entries')
        .select('id, visa_id, outcome, processing_days, application_date, decision_date, created_at')
        .eq('submitted_by', profile.id)
        .order('created_at', { ascending: false }),
      supabase.from('visas').select('id, name').order('name'),
    ]);

    if (trackerRes.data) {
      const visaMap = new Map(visasRes.data?.map(v => [v.id, v.name]) || []);

      const enriched = trackerRes.data.map(e => ({
        ...e,
        visa_name: visaMap.get(e.visa_id) || null,
      }));

      setEntries(enriched as TrackerEntry[]);
    }

    setLoading(false);
  };

  const outcomeIcon = {
    approved: CheckCircle,
    refused: XCircle,
    withdrawn: XCircle,
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
                  <TrackerStatusBadge status={entry.outcome} />
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
        size="lg"
      >
        <TrackerWizard
          onSuccess={() => {
            setShowModal(false);
            fetchData();
          }}
        />
      </Modal>
    </div>
  );
}
