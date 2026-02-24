import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TrackerUploadChecklist } from './TrackerUploadChecklist';
import { ChevronRight, ChevronLeft, Check, AlertCircle } from 'lucide-react';
import type { Visa, TrackerOutcome, TrackerEntry } from '../../types/database';

interface Props {
  onSuccess: () => void;
  preselectedVisaId?: string;
  initialEntry?: TrackerEntry;
}

export function TrackerWizard({ onSuccess, preselectedVisaId, initialEntry }: Props) {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [visas, setVisas] = useState<Pick<Visa, 'id' | 'name' | 'subclass'>[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [visaId, setVisaId] = useState(initialEntry?.visa_id || preselectedVisaId || '');
  const [applicationDate, setApplicationDate] = useState(initialEntry?.application_date || '');
  const [decisionDate, setDecisionDate] = useState(initialEntry?.decision_date || '');
  const [outcome, setOutcome] = useState<TrackerOutcome>(initialEntry?.outcome || 'approved');
  const [notes, setNotes] = useState(''); // Not stored currently

  useEffect(() => {
    supabase
      .from('visas')
      .select('id, name, subclass')
      .eq('is_active', true)
      .order('name')
      .then(({ data }) => setVisas(data || []));
  }, []);

  const totalSteps = 4;

  const handleNext = () => {
    if (step === 1 && !visaId) return toast('error', 'Please select a visa');
    if (step === 2) {
      if (!applicationDate) return toast('error', 'Application date is required');
      if (outcome !== 'pending' && !decisionDate) return toast('error', 'Decision date is required for completed applications');
      if (decisionDate && new Date(decisionDate) < new Date(applicationDate)) return toast('error', 'Decision cannot be before application');
    }
    setStep(s => Math.min(s + 1, totalSteps));
  };

  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    const isPending = outcome === 'pending';

    const payload = {
      visa_id: visaId,
      submitted_by: initialEntry?.submitted_by || user?.id || null,
      submitter_role: role || null,
      application_date: applicationDate,
      decision_date: isPending ? null : decisionDate,
      outcome: isPending ? 'pending' as TrackerOutcome : outcome,
      status: isPending ? 'pending' : 'completed',
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
      await supabase.rpc('refresh_tracker_stats');
      toast('success', initialEntry ? 'Entry updated successfully.' : 'Processing time submitted!');
      setLoading(false);
      onSuccess();
    }
  };

  const selectedVisa = visas.find(v => v.id === visaId);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-neutral-100 -z-10" />
        {Array.from({ length: totalSteps }).map((_, i) => {
          const s = i + 1;
          const isActive = s <= step;
          return (
            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              isActive ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-400'
            }`}>
              {isActive && s < step ? <Check className="w-4 h-4" /> : s}
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl p-1">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-neutral-900">Select Visa</h2>
            <p className="text-neutral-500">Which visa are you applying for?</p>
            <div className="grid gap-3 max-h-96 overflow-y-auto pr-2">
              {visas.map(v => (
                <button
                  key={v.id}
                  onClick={() => setVisaId(v.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                    visaId === v.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-neutral-100 hover:border-primary-200'
                  }`}
                >
                  <div>
                    <span className="font-bold text-neutral-900 block">{v.subclass}</span>
                    <span className="text-sm text-neutral-500">{v.name}</span>
                  </div>
                  {visaId === v.id && <Check className="w-5 h-5 text-primary-600" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-neutral-900">Application Details</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <Input
                label="Application Date"
                type="date"
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value)}
                required
                max={new Date().toISOString().split('T')[0]}
              />
              <Input
                label="Decision Date (Optional)"
                type="date"
                value={decisionDate}
                onChange={(e) => setDecisionDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                helperText="Leave blank if still pending"
              />
            </div>

            <TrackerUploadChecklist />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-neutral-900">Outcome</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {['pending', 'approved', 'refused', 'withdrawn'].map((o) => (
                <button
                  key={o}
                  onClick={() => setOutcome(o as TrackerOutcome)}
                  className={`p-4 rounded-xl border-2 capitalize text-center font-medium transition-all ${
                    outcome === o
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-neutral-100 hover:border-primary-200 text-neutral-600'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-field w-full h-24 py-2"
                placeholder="Share any details about your experience..."
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-neutral-900">Review & Submit</h2>
            <div className="bg-neutral-50 rounded-xl p-6 space-y-4">
              <div className="flex justify-between border-b border-neutral-200 pb-3">
                <span className="text-neutral-500">Visa</span>
                <span className="font-medium">{selectedVisa?.subclass} - {selectedVisa?.name}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-3">
                <span className="text-neutral-500">Applied</span>
                <span className="font-medium">{new Date(applicationDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-3">
                <span className="text-neutral-500">Status</span>
                <span className="font-medium capitalize">{outcome}</span>
              </div>
              {decisionDate && (
                <div className="flex justify-between border-b border-neutral-200 pb-3">
                  <span className="text-neutral-500">Decision</span>
                  <span className="font-medium">{new Date(decisionDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>By submitting, you confirm that this information is accurate to the best of your knowledge. Your contribution helps others estimate their processing times.</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8 pt-4 border-t border-neutral-100">
        <Button
          variant="secondary"
          onClick={handleBack}
          disabled={step === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        {step < totalSteps ? (
          <Button onClick={handleNext}>
            Next <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} loading={loading}>
            Submit Entry <Check className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
