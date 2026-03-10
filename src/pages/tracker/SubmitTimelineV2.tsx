import { useState } from 'react';
import { Calendar, Briefcase, MapPin, Star, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

export function SubmitTimelineV2() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [processingDays, setProcessingDays] = useState(0);
  
  const [formData, setFormData] = useState({
    visaSubclass: '',
    anzscoCode: '',
    location: '',
    points: '',
    dateLodged: '',
    dateGranted: '',
    hadMedicals: false,
    hadS56: false,
    notes: '',
  });

  const visaOptions = [
    { value: '189', label: 'Skilled Independent (189)' },
    { value: '190', label: 'Skilled Nominated (190)' },
    { value: '820', label: 'Partner Visa (820/801)' },
    { value: '500', label: 'Student Visa (500)' },
    { value: '600', label: 'Visitor Visa (600)' },
  ];

  const locationOptions = [
    { value: 'onshore', label: 'Onshore (In Australia)' },
    { value: 'offshore', label: 'Offshore (Outside Australia)' },
  ];

  const calculateDays = () => {
    if (formData.dateLodged && formData.dateGranted) {
      const lodged = new Date(formData.dateLodged);
      const granted = new Date(formData.dateGranted);
      const diff = Math.round((granted.getTime() - lodged.getTime()) / (1000 * 60 * 60 * 24));
      setProcessingDays(diff);
      return diff;
    }
    return 0;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    
    const days = calculateDays();
    
    try {
      // Anonymous submission - no auth required
      const { error } = await supabase
        .from('visa_timelines')
        .insert({
          visa_subclass: formData.visaSubclass,
          anzsco_code: formData.anzscoCode || 'N/A',
          location: formData.location as 'onshore' | 'offshore',
          date_lodged: formData.dateLodged,
          date_granted: formData.dateGranted,
          processing_days: days,
          had_medicals: formData.hadMedicals,
          had_s56: formData.hadS56,
          points: formData.points ? parseInt(formData.points) : null,
          notes: formData.notes || null,
          source: 'anonymous_user',
          verified: false, // Requires admin verification
          submitted_at: new Date().toISOString(),
        });
      
      if (error) {
        throw error;
      }
      
      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedStep1 = formData.visaSubclass && formData.location;
  const canProceedStep2 = formData.dateLodged && formData.dateGranted;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-indigo-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Submit Your Timeline</h1>
          <p className="text-indigo-200">Help others by sharing your visa journey</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        {/* Progress Steps */}
        <div className="flex items-center mb-8">
          {[1, 2, 3].map((s) => (
            <>
              <div 
                key={s}
                className={`w-10 h-10 flex items-center justify-center font-bold ${
                  step >= s ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-1 ${step > s ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
            </>
          ))}
        </div>

        <div className="bg-white border border-slate-200 p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Visa Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Visa Subclass *</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-200"
                  value={formData.visaSubclass}
                  onChange={(e) => setFormData({...formData, visaSubclass: e.target.value})}
                >
                  <option value="">Select visa type</option>
                  {visaOptions.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
                <div className="grid grid-cols-2 gap-4">
                  {locationOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData({...formData, location: opt.value})}
                      className={`p-4 border text-left ${
                        formData.location === opt.value 
                          ? 'border-emerald-500 bg-emerald-50' 
                          : 'border-slate-200'
                      }`}
                    >
                      <MapPin className="w-5 h-5 mb-2 text-slate-400" />
                      <p className="font-medium">{opt.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ANZSCO Code (Profession)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 261312 (Developer Programmer)"
                  className="w-full px-3 py-2 border border-slate-200"
                  value={formData.anzscoCode}
                  onChange={(e) => setFormData({...formData, anzscoCode: e.target.value})}
                />
                <p className="text-sm text-slate-500 mt-1">This helps others with the same profession compare timelines</p>
              </div>

              <div className="flex justify-end">
                <Button 
                  variant="primary" 
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Important Dates</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date Lodged *</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-slate-200"
                    value={formData.dateLodged}
                    onChange={(e) => setFormData({...formData, dateLodged: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date Granted *</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-slate-200"
                    value={formData.dateGranted}
                    onChange={(e) => setFormData({...formData, dateGranted: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Points Claimed (if applicable)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 85"
                  className="w-full px-3 py-2 border border-slate-200"
                  value={formData.points}
                  onChange={(e) => setFormData({...formData, points: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox"
                    className="w-4 h-4"
                    checked={formData.hadMedicals}
                    onChange={(e) => setFormData({...formData, hadMedicals: e.target.checked})}
                  />
                  <span>Requested to complete medical examinations</span>
                </label>

                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox"
                    className="w-4 h-4"
                    checked={formData.hadS56}
                    onChange={(e) => setFormData({...formData, hadS56: e.target.checked})}
                  />
                  <span>Received s56 Request for More Information</span>
                </label>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button 
                  variant="primary" 
                  onClick={() => {
                    calculateDays();
                    setStep(3);
                  }}
                  disabled={!canProceedStep2}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && !submitSuccess && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Review & Submit</h2>
              
              <div className="bg-slate-50 p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Visa:</span>
                  <span className="font-medium">{visaOptions.find(v => v.value === formData.visaSubclass)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Location:</span>
                  <span className="font-medium capitalize">{formData.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Processing Time:</span>
                  <span className="font-bold text-emerald-600">{processingDays} days</span>
                </div>
                {formData.anzscoCode && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Profession:</span>
                    <span className="font-medium">{formData.anzscoCode}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Additional Notes (Optional)</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-200 h-24"
                  placeholder="Any extra details about your visa journey..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
                  {submitError}
                </div>
              )}

              <div className="bg-indigo-50 border border-indigo-200 p-4">
                <p className="text-sm text-indigo-800">
                  <strong>Anonymous Submission:</strong> Your data helps the community. 
                  No personal information is collected or stored.
                </p>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button 
                  variant="primary" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Timeline'
                  )}
                </Button>
              </div>
            </div>
          )}

          {submitSuccess && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h2>
              <p className="text-slate-600 mb-6">Your timeline has been submitted and will help others in the community.</p>
              
              <div className="bg-slate-50 p-4 mb-6">
                <p className="text-sm text-slate-500">Processing time recorded:</p>
                <p className="text-xl font-bold text-slate-900">{processingDays} days</p>
              </div>
              
              <div className="space-y-3">
                <Button variant="primary" onClick={() => window.location.href = '/tracker'}>
                  View Community Data
                </Button>
                <div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSubmitSuccess(false);
                      setStep(1);
                      setFormData({
                        visaSubclass: '',
                        anzscoCode: '',
                        location: '',
                        points: '',
                        dateLodged: '',
                        dateGranted: '',
                        hadMedicals: false,
                        hadS56: false,
                        notes: '',
                      });
                    }}
                  >
                    Submit Another Timeline
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
