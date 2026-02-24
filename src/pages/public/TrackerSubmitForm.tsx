import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { Visa, TrackerOutcome, TrackerEntry } from '../../types/database';

interface Props {
  onSuccess: () => void;
  preselectedVisaId?: string;
  initialEntry?: TrackerEntry;
}

export function TrackerSubmitForm({ onSuccess, preselectedVisaId, initialEntry }: Props) {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [visas, setVisas] = useState<Pick<Visa, 'id' | 'name' | 'subclass'>[]>([]);
  const [visaId, setVisaId] = useState(initialEntry?.visa_id || preselectedVisaId || '');
  const [applicationDate, setApplicationDate] = useState(initialEntry?.application_date || '');
  const [decisionDate, setDecisionDate] = useState(initialEntry?.decision_date || '');
  const [outcome, setOutcome] = useState<TrackerOutcome>(initialEntry?.outcome || 'approved');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase
      .from('visas')
      .select('id, name, subclass')
      .eq('is_active', true)
      .order('name')
      .then(({ data }) => setVisas(data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isPending = outcome === 'pending';

    if (!visaId || !applicationDate || (!isPending && !decisionDate)) {
      toast('error', 'Please fill in all required fields');
      return;
    }

    const appDate = new Date(applicationDate);

    if (!isPending && decisionDate) {
      const decDate = new Date(decisionDate);
      if (decDate < appDate) {
          toast('error', 'Decision date cannot be before application date');
          return;
      }
    }

    setLoading(true);

    const payload = {
      visa_id: visaId,
      submitted_by: initialEntry?.submitted_by || user?.id || null,
      application_date: applicationDate,
      decision_date: isPending ? null : decisionDate,
      outcome: isPending ? 'pending' as TrackerOutcome : outcome,
    };

    let error;
    if (initialEntry) {
      const { error: updateError } = await supabase
        .from('tracker_entries')
        .update(payload)
        .eq('id', initialEntry.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('tracker_entries')
        .insert(payload);
      error = insertError;
    }

    if (error) {
      toast('error', error.message);
      setLoading(false);
    } else {
      // Attempt to refresh stats via RPC
      const { error: rpcError } = await supabase.rpc('refresh_tracker_stats');
      if (rpcError) {
          console.warn('Failed to refresh stats:', rpcError);
      }

      toast('success', initialEntry ? 'Entry updated successfully.' : 'Processing time submitted. Thank you for contributing!');
      setLoading(false);
      onSuccess();
    }
  };

  const isPending = outcome === 'pending';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <p className="text-sm text-neutral-500">
          Help the community by sharing your visa processing experience.
          {!user && ' No account needed -- submit anonymously.'}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Visa Type</label>
          <select
            value={visaId}
            onChange={(e) => setVisaId(e.target.value)}
            className="input-field w-full appearance-none bg-white"
            required
            disabled={!!initialEntry}
          >
            <option value="">Select a visa...</option>
            {visas.map((v) => (
              <option key={v.id} value={v.id}>
                {v.subclass} - {v.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Application Date"
            type="date"
            value={applicationDate}
            onChange={(e) => setApplicationDate(e.target.value)}
            required
            max={new Date().toISOString().split('T')[0]}
          />
          {!isPending && (
            <Input
              label="Decision Date"
              type="date"
              value={decisionDate}
              onChange={(e) => setDecisionDate(e.target.value)}
              required={!isPending}
              max={new Date().toISOString().split('T')[0]}
            />
          )}
        </div>

        <div>
           <label className="block text-sm font-medium text-neutral-700 mb-1.5">Outcome</label>
           <div className="flex flex-wrap gap-4">
             <label className="flex items-center gap-2 cursor-pointer">
               <input
                 type="radio"
                 name="outcome"
                 value="pending"
                 checked={outcome === 'pending'}
                 onChange={() => setOutcome('pending')}
                 className="text-primary-600 focus:ring-primary-500"
               />
               <span className="text-sm text-neutral-700">Pending</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer">
               <input
                 type="radio"
                 name="outcome"
                 value="approved"
                 checked={outcome === 'approved'}
                 onChange={() => setOutcome('approved')}
                 className="text-primary-600 focus:ring-primary-500"
               />
               <span className="text-sm text-neutral-700">Approved</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer">
               <input
                 type="radio"
                 name="outcome"
                 value="refused"
                 checked={outcome === 'refused'}
                 onChange={() => setOutcome('refused')}
                 className="text-primary-600 focus:ring-primary-500"
               />
               <span className="text-sm text-neutral-700">Refused</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer">
               <input
                 type="radio"
                 name="outcome"
                 value="withdrawn"
                 checked={outcome === 'withdrawn'}
                 onChange={() => setOutcome('withdrawn')}
                 className="text-primary-600 focus:ring-primary-500"
               />
               <span className="text-sm text-neutral-700">Withdrawn</span>
             </label>
           </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={loading} className="w-full sm:w-auto">
          {initialEntry ? 'Update Entry' : 'Submit Report'}
        </Button>
      </div>
    </form>
  );
}
