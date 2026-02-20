import sys

with open('src/pages/lawyer/LawyerTracker.tsx', 'r') as f:
    content = f.read()

# Hunk 1
search_1 = """import { useEffect, useState } from 'react';
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
  }, [profile]);"""

replace_1 = """import { useEffect, useState } from 'react';
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
  outcome: 'approved' | 'denied' | 'pending';
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
  }, [profile]);"""

if search_1 in content:
    content = content.replace(search_1, replace_1)
else:
    print("Hunk 1 not found")

# Hunk 2
search_2 = """    setVisas(visasRes.data || []);
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
  };"""

replace_2 = """    setLoading(false);
  };"""

if search_2 in content:
    content = content.replace(search_2, replace_2)
else:
    print("Hunk 2 not found")

# Hunk 3
search_3 = """                  <Badge variant={outcomeVariant[entry.outcome]}>{entry.outcome}</Badge>
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
      </Modal>"""

replace_3 = """                  <TrackerStatusBadge status={entry.outcome} />
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
      </Modal>"""

if search_3 in content:
    content = content.replace(search_3, replace_3)
else:
    print("Hunk 3 not found")

with open('src/pages/lawyer/LawyerTracker.tsx', 'w') as f:
    f.write(content)
