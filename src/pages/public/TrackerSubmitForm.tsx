import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { Visa, TrackerOutcome } from '../../types/database';

interface Props {
  onSuccess: () => void;
  preselectedVisaId?: string;
}

export function TrackerSubmitForm({ onSuccess, preselectedVisaId }: Props) {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [visas, setVisas] = useState<Pick<Visa, 'id' | 'name' | 'subclass'>[]>([]);
  const [visaId, setVisaId] = useState(preselectedVisaId || '');
  const [applicationDate, setApplicationDate] = useState('');
  const [decisionDate, setDecisionDate] = useState('');
  const [outcome, setOutcome] = useState<TrackerOutcome>('approved');
  const [notes, setNotes] = useState('');
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
    if (!visaId || !applicationDate || !decisionDate) {
      toast('error', 'Please fill in all required fields');
      return;
    }

    const appDate = new Date(applicationDate);
    const decDate = new Date(decisionDate);

    if (decDate < appDate) {
        toast('error', 'Decision date cannot be before application date');
        return;
    }

    // Calculate processing days
    const diffTime = Math.abs(decDate.getTime() - appDate.getTime());
    const processingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setLoading(true);

    // Determine weight
    const weight = role === 'lawyer' ? 1.5 : 1.0;

    const { error } = await supabase.from('tracker_entries').insert({
      visa_id: visaId,
      submitted_by: user?.id || null,
      submitter_role: role || null,
      application_date: applicationDate,
      decision_date: decisionDate,
      processing_days: processingDays,
      outcome,
      weight,
      // Note: 'notes' field is collected in UI but excluded from DB insert
      // as it is not present in the current database schema for tracker_entries.
    });

    if (error) {
      toast('error', error.message);
      setLoading(false);
    } else {
      // Attempt to refresh stats via RPC
      const { error: rpcError } = await supabase.rpc('refresh_tracker_stats');
      if (rpcError) {
          console.warn('Failed to refresh stats:', rpcError);
          // We don't block success on this, it might be a background job in some setups
      }

      toast('success', 'Processing time submitted. Thank you for contributing!');
      setLoading(false);
      onSuccess();
    }
  };

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
          <Input
            label="Decision Date"
            type="date"
            value={decisionDate}
            onChange={(e) => setDecisionDate(e.target.value)}
            required
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-neutral-700 mb-1.5">Outcome</label>
           <div className="flex gap-4">
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

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="input-field w-full py-2"
            placeholder="Any details about your case (e.g., complexity, requests for info)..."
          />
          <p className="text-xs text-neutral-400 mt-1">
            (Note: Currently notes are not stored in the database but may be used for future analysis)
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={loading} className="w-full sm:w-auto">
          Submit Report
        </Button>
      </div>
    </form>
  );
}
