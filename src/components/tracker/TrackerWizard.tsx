import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TrackerProgress } from './TrackerProgress';
import { TrackerTimeline } from './TrackerTimeline';
import type { Visa, TrackerOutcome, TrackerEntry } from '../../types/database';

interface TrackerWizardProps {
  onSuccess: () => void;
  initialEntry?: TrackerEntry;
}

export function TrackerWizard({ onSuccess, initialEntry }: TrackerWizardProps) {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [visas, setVisas] = useState<Pick<Visa, 'id' | 'name' | 'subclass'>[]>([]);
  const [visaSearch, setVisaSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State
  const [visaId, setVisaId] = useState(initialEntry?.visa_id || '');
  const [applicationDate, setApplicationDate] = useState(initialEntry?.application_date || '');

  // Initialize stage. If existing entry has no stage, infer from status/outcome
  const getInitialStage = () => {
    if (initialEntry?.stage) return initialEntry.stage;
    if (initialEntry?.outcome && initialEntry.outcome !== 'pending') return 'decision';
    return 'processing';
  };

  const [stage, setStage] = useState<'received' | 'processing' | 'assessment' | 'decision'>(getInitialStage());
  const [outcome, setOutcome] = useState<TrackerOutcome>(initialEntry?.outcome || 'pending');
  const [decisionDate, setDecisionDate] = useState(initialEntry?.decision_date || '');

  useEffect(() => {
    supabase
      .from('visas')
      .select('id, name, subclass')
      .eq('is_active', true)
      .order('subclass')
      .then(({ data }) => setVisas(data || []));
  }, []);

  const handleNext = () => {
    if (step === 1 && !visaId) {
      toast('error', 'Please select a visa');
      return;
    }
    if (step === 2 && !applicationDate) {
      toast('error', 'Please enter application date');
      return;
    }
    if (step === 3 && stage === 'decision' && (!outcome || outcome === 'pending')) {
        toast('error', 'Please select an outcome');
        return;
    }
    if (step === 3 && stage === 'decision' && !decisionDate) {
        toast('error', 'Please enter decision date');
        return;
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      visa_id: visaId,
      submitted_by: initialEntry?.submitted_by || user?.id || null,
      submitter_role: role || null,
      application_date: applicationDate,
      decision_date: stage === 'decision' ? decisionDate : null,
      outcome: stage === 'decision' ? outcome : 'pending',
      status: stage === 'decision' ? 'completed' : 'pending',
      stage: stage,
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

      toast('success', initialEntry ? 'Entry updated successfully.' : 'Processing time submitted!');
      setLoading(false);
      onSuccess();
    }
  };

  const filteredVisas = visas.filter(v =>
    v.name.toLowerCase().includes(visaSearch.toLowerCase()) ||
    v.subclass.includes(visaSearch)
  );

  const totalSteps = 4;

  return (
    <div className="space-y-6">
      <TrackerProgress value={(step / totalSteps) * 100} className="mb-6" />

      {/* Step 1: Visa Selection */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-900">Which visa did you apply for?</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by subclass or name..."
              value={visaSearch}
              onChange={(e) => setVisaSearch(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
          <div className="max-h-60 overflow-y-auto border border-neutral-200 rounded-lg divide-y divide-neutral-100">
             {filteredVisas.length === 0 ? (
               <div className="p-4 text-center text-neutral-500">No visas found</div>
             ) : (
               filteredVisas.map(v => (
                 <div
                   key={v.id}
                   className={`p-3 cursor-pointer hover:bg-primary-50 transition-colors flex items-center justify-between ${visaId === v.id ? 'bg-primary-50 border-l-4 border-l-primary-600' : ''}`}
                   onClick={() => setVisaId(v.id)}
                 >
                   <div>
                     <span className="font-bold text-neutral-900 mr-2">{v.subclass}</span>
                     <span className="text-neutral-600 text-sm">{v.name}</span>
                   </div>
                   {visaId === v.id && <Check className="w-4 h-4 text-primary-600" />}
                 </div>
               ))
             )}
          </div>
        </div>
      )}

      {/* Step 2: Application Date */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-900">When did you submit your application?</h2>
          <Input
             label="Application Date"
             type="date"
             value={applicationDate}
             onChange={(e) => setApplicationDate(e.target.value)}
             max={new Date().toISOString().split('T')[0]}
          />
        </div>
      )}

      {/* Step 3: Current Status */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-neutral-900">What is the current status?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {(['received', 'processing', 'assessment', 'decision'] as const).map((s) => (
               <div
                 key={s}
                 className={`p-4 border rounded-xl cursor-pointer transition-all ${stage === s ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-200' : 'border-neutral-200 hover:border-primary-300'}`}
                 onClick={() => setStage(s)}
               >
                 <div className="font-semibold text-lg capitalize mb-1">{s}</div>
                 <div className="text-sm text-neutral-500">
                    {s === 'received' && 'Application just submitted'}
                    {s === 'processing' && 'Awaiting initial assessment'}
                    {s === 'assessment' && 'Under review / RFI requested'}
                    {s === 'decision' && 'Final outcome received'}
                 </div>
               </div>
             ))}
          </div>

          {stage === 'decision' && (
            <div className="mt-6 pt-6 border-t border-neutral-100 space-y-4 animate-in fade-in slide-in-from-top-4">
               <h3 className="font-medium text-neutral-900">Decision Details</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['approved', 'refused', 'withdrawn'] as const).map((o) => (
                    <div
                      key={o}
                      className={`p-3 text-center border rounded-lg cursor-pointer capitalize ${outcome === o ? 'bg-neutral-900 text-white border-neutral-900' : 'border-neutral-200 hover:bg-neutral-50'}`}
                      onClick={() => setOutcome(o)}
                    >
                      {o}
                    </div>
                  ))}
               </div>

               <Input
                 label="Decision Date"
                 type="date"
                 value={decisionDate}
                 onChange={(e) => setDecisionDate(e.target.value)}
                 min={applicationDate}
                 max={new Date().toISOString().split('T')[0]}
               />
            </div>
          )}
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-neutral-900">Review Summary</h2>

          <div className="bg-neutral-50 rounded-xl p-6 space-y-4">
             <div>
               <p className="text-xs text-neutral-500 uppercase tracking-wide">Visa</p>
               <p className="font-medium text-lg">
                 {visas.find(v => v.id === visaId)?.subclass} - {visas.find(v => v.id === visaId)?.name}
               </p>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div>
                 <p className="text-xs text-neutral-500 uppercase tracking-wide">Applied On</p>
                 <p className="font-medium">{new Date(applicationDate).toLocaleDateString()}</p>
               </div>
               {stage === 'decision' && (
                 <div>
                   <p className="text-xs text-neutral-500 uppercase tracking-wide">Decided On</p>
                   <p className="font-medium">{new Date(decisionDate).toLocaleDateString()}</p>
                 </div>
               )}
             </div>

             <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wide mb-2">Visual Timeline</p>
                <TrackerTimeline
                   stage={stage}
                   outcome={outcome}
                   applicationDate={applicationDate}
                   decisionDate={decisionDate}
                />
             </div>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-6 border-t border-neutral-100 mt-6">
         {step > 1 ? (
           <Button variant="secondary" onClick={handleBack}>
             <ChevronLeft className="w-4 h-4 mr-2" /> Back
           </Button>
         ) : <div />}

         {step < totalSteps ? (
           <Button onClick={handleNext}>
             Next <ChevronRight className="w-4 h-4 ml-2" />
           </Button>
         ) : (
           <Button onClick={handleSubmit} loading={loading}>
             {initialEntry ? 'Update Entry' : 'Submit Entry'}
           </Button>
         )}
      </div>
    </div>
  );
}
