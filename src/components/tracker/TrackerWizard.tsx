import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import type { Visa, TrackerOutcome } from '../../types/database';

interface Props {
  onSuccess: () => void;
  preselectedVisaId?: string;
  initialEntry?: any; // Avoiding deep type matching for now, just for update mode
}

const STEPS = [
  { id: 1, title: 'Select Visa' },
  { id: 2, title: 'Application Date' },
  { id: 3, title: 'Outcome' },
  { id: 4, title: 'Review' },
];

export function TrackerWizard({ onSuccess, preselectedVisaId, initialEntry }: Props) {
  const { user, role } = useAuth();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [visas, setVisas] = useState<Pick<Visa, 'id' | 'name' | 'subclass'>[]>([]);

  // Form State
  const [visaId, setVisaId] = useState(initialEntry?.visa_id || preselectedVisaId || '');
  const [applicationDate, setApplicationDate] = useState(initialEntry?.application_date || '');
  const [decisionDate, setDecisionDate] = useState(initialEntry?.decision_date || '');
  const [outcome, setOutcome] = useState<TrackerOutcome>(initialEntry?.outcome || 'pending');
  const [notes, setNotes] = useState(''); // Not stored currently, but kept for future

  useEffect(() => {
    supabase
      .from('visas')
      .select('id, name, subclass')
      .eq('is_active', true)
      .order('name')
      .then(({ data }) => setVisas(data || []));
  }, []);

  const handleNext = () => {
    if (currentStep === 1 && !visaId) {
      toast('error', 'Please select a visa');
      return;
    }
    if (currentStep === 2 && !applicationDate) {
      toast('error', 'Please select application date');
      return;
    }
    if (currentStep === 3) {
      if (outcome !== 'pending' && !decisionDate) {
        toast('error', 'Please select decision date for completed applications');
        return;
      }
      if (decisionDate && new Date(decisionDate) < new Date(applicationDate)) {
        toast('error', 'Decision date cannot be before application date');
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

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
      // Refresh stats
      await supabase.rpc('refresh_tracker_stats');
      toast('success', initialEntry ? 'Entry updated' : 'Processing time submitted');
      setLoading(false);
      onSuccess();
    }
  };

  const selectedVisa = visas.find(v => v.id === visaId);

  return (
    <div className="flex flex-col h-full min-h-[400px]">
      {/* Steps Indicator */}
      <div className="flex justify-between mb-8 px-2">
        {STEPS.map((step, index) => {
           const isActive = step.id === currentStep;
           const isCompleted = step.id < currentStep;

           return (
             <div key={step.id} className="flex flex-col items-center flex-1">
               <div
                 className={`
                   w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mb-2 transition-colors
                   ${isActive ? 'bg-primary-600 text-white' : isCompleted ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-400'}
                 `}
               >
                 {isCompleted ? <CheckCircle className="w-5 h-5" /> : step.id}
               </div>
               <span className={`text-xs text-center hidden sm:block ${isActive ? 'text-primary-700 font-medium' : 'text-neutral-500'}`}>
                 {step.title}
               </span>
             </div>
           );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-1">
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold text-neutral-900">Which visa did you apply for?</h3>
            <div className="space-y-2">
              <label className="text-sm text-neutral-600">Search or select visa type</label>
              <select
                value={visaId}
                onChange={(e) => setVisaId(e.target.value)}
                className="input-field w-full"
                size={10} // Show list
              >
                {visas.map((v) => (
                  <option key={v.id} value={v.id} className="py-2 px-2 hover:bg-neutral-50 cursor-pointer">
                    {v.subclass} - {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold text-neutral-900">When did you submit your application?</h3>
            <Input
              type="date"
              label="Application Date"
              value={applicationDate}
              onChange={(e) => setApplicationDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              autoFocus
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold text-neutral-900">What is the current status?</h3>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'pending', label: 'Still Waiting', icon: '⏳' },
                { value: 'approved', label: 'Approved', icon: '✅' },
                { value: 'refused', label: 'Refused', icon: '❌' },
                { value: 'withdrawn', label: 'Withdrawn', icon: '🚫' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setOutcome(opt.value as TrackerOutcome)}
                  className={`
                    p-4 rounded-xl border-2 text-left transition-all
                    ${outcome === opt.value
                      ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600'
                      : 'border-neutral-200 hover:border-primary-300 bg-white'
                    }
                  `}
                >
                  <span className="text-2xl mb-2 block">{opt.icon}</span>
                  <span className={`font-medium ${outcome === opt.value ? 'text-primary-900' : 'text-neutral-700'}`}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>

            {outcome !== 'pending' && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <Input
                  type="date"
                  label="Decision Date"
                  value={decisionDate}
                  onChange={(e) => setDecisionDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold text-neutral-900">Review your submission</h3>

            <div className="bg-neutral-50 rounded-xl p-6 space-y-4 border border-neutral-200">
              <div>
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Visa</span>
                <p className="font-medium text-neutral-900">{selectedVisa?.subclass} - {selectedVisa?.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Applied</span>
                   <p className="font-medium text-neutral-900">{new Date(applicationDate).toLocaleDateString()}</p>
                </div>
                <div>
                   <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</span>
                   <p className="font-medium text-neutral-900 capitalize">{outcome}</p>
                </div>
              </div>

              {outcome !== 'pending' && (
                 <div>
                   <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Decision Date</span>
                   <p className="font-medium text-neutral-900">{new Date(decisionDate).toLocaleDateString()}</p>
                 </div>
              )}
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
               <div className="mt-0.5">ℹ️</div>
               <p>Your submission helps thousands of other applicants estimate their waiting times. Thank you!</p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-between pt-4 border-t border-neutral-200">
        <Button
          variant="secondary"
          onClick={handleBack}
          disabled={currentStep === 1 || loading}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {currentStep < 4 ? (
          <Button onClick={handleNext}>
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} loading={loading}>
            Submit Report
          </Button>
        )}
      </div>
    </div>
  );
}
