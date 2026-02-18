import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import type { Visa, TrackerOutcome } from '../../types/database';

interface Props {
  onSuccess: () => void;
  preselectedVisaId?: string;
}

export function TrackerSubmitForm({ onSuccess, preselectedVisaId }: Props) {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [visas, setVisas] = useState<Visa[]>([]);
  const [visaId, setVisaId] = useState(preselectedVisaId || '');
  const [applicationDate, setApplicationDate] = useState('');
  const [decisionDate, setDecisionDate] = useState('');
  const [outcome, setOutcome] = useState<TrackerOutcome>('approved');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase
      .from('visas')
      .select('id, name, subclass_number')
      .eq('is_active', true)
      .order('name')
      .then(({ data }) => setVisas(data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visaId || !applicationDate) {
      toast('error', 'Please fill in the visa type and application date');
      return;
    }

    if (outcome !== 'pending' && !decisionDate) {
      toast('error', 'Please enter a decision date for completed applications');
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('tracker_entries').insert({
      visa_id: visaId,
      submitted_by: user?.id || null,
      submitter_role: role || null,
      application_date: applicationDate,
      decision_date: decisionDate || null,
      outcome,
    });

    setLoading(false);
    if (error) {
      toast('error', error.message);
    } else {
      toast('success', 'Processing time submitted. Thank you for contributing!');
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-lg font-semibold text-neutral-900">Submit Your Processing Time</h3>
      <p className="text-sm text-neutral-500">
        Help the community by sharing your visa processing experience.
        {!user && ' No account needed -- submit anonymously.'}
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <Select
          label="Visa Type"
          value={visaId}
          onChange={(e) => setVisaId((e.target as HTMLSelectElement).value)}
          options={[
            { value: '', label: 'Select a visa...' },
            ...visas.map((v) => ({ value: v.id, label: `${v.subclass_number} - ${v.name}` })),
          ]}
        />
        <Select
          label="Outcome"
          value={outcome}
          onChange={(e) => {
            const val = (e.target as HTMLSelectElement).value as TrackerOutcome;
            setOutcome(val);
            if (val === 'pending') setDecisionDate('');
          }}
          options={[
            { value: 'approved', label: 'Approved' },
            { value: 'refused', label: 'Refused' },
            { value: 'withdrawn', label: 'Withdrawn' },
            { value: 'pending', label: 'Still Waiting (Pending)' },
          ]}
        />
        <Input
          label="Application Date"
          type="date"
          value={applicationDate}
          onChange={(e) => setApplicationDate(e.target.value)}
        />
        <Input
          label="Decision Date"
          type="date"
          value={decisionDate}
          onChange={(e) => {
            setDecisionDate(e.target.value);
            if (e.target.value && outcome === 'pending') setOutcome('approved');
          }}
          disabled={outcome === 'pending'}
          className={outcome === 'pending' ? 'bg-neutral-50 text-neutral-400' : ''}
        />
      </div>
      <div className="flex justify-end gap-3">
        <Button type="submit" loading={loading}>
          Submit
        </Button>
      </div>
    </form>
  );
}
