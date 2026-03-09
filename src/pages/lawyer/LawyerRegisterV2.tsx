import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Scale, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function LawyerRegisterV2() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    barNumber: '',
    jurisdiction: '',
    practiceAreas: '',
    yearsExperience: '',
    hourlyRate: '',
    bio: '',
  });

  const handleSubmit = async () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      navigate('/lawyer/pending');
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Register as Lawyer | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Scale className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Register as a Lawyer</h1>
            <p className="text-slate-600 mt-2">Join our platform and connect with clients</p>
          </div>

          <div className="bg-white border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-8">
              {['Professional Info', 'Practice Details', 'Verification'].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 flex items-center justify-center text-sm font-medium ${
                    step > i + 1 ? 'bg-green-600 text-white' : 
                    step === i + 1 ? 'bg-blue-600 text-white' : 
                    'bg-slate-200 text-slate-600'
                  }`}>
                    {step > i + 1 ? <CheckCircle className="w-5 h-5" /> : i + 1}
                  </div>
                  <span className="ml-2 text-sm hidden sm:block">{s}</span>
                  {i < 2 && <ArrowRight className="w-4 h-4 mx-4 text-slate-400" />}
                </div>
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900">Professional Information</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bar Number</label>
                    <input
                      type="text"
                      value={formData.barNumber}
                      onChange={(e) => setFormData({...formData, barNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Jurisdiction</label>
                    <select
                      value={formData.jurisdiction}
                      onChange={(e) => setFormData({...formData, jurisdiction: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200"
                    >
                      <option value="">Select...</option>
                      <option value="NSW">NSW</option>
                      <option value="VIC">VIC</option>
                      <option value="QLD">QLD</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="primary" onClick={() => setStep(2)}>Next</Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900">Practice Details</h2>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Practice Areas</label>
                  <input
                    type="text"
                    value={formData.practiceAreas}
                    onChange={(e) => setFormData({...formData, practiceAreas: e.target.value})}
                    placeholder="e.g., Skilled Migration, Family Visas"
                    className="w-full px-3 py-2 border border-slate-200"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience</label>
                    <input
                      type="number"
                      value={formData.yearsExperience}
                      onChange={(e) => setFormData({...formData, yearsExperience: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Hourly Rate ($)</label>
                    <input
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-200"
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button variant="primary" onClick={() => setStep(3)}>Next</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900">Verification</h2>
                
                <div className="bg-slate-50 border border-slate-200 p-6 text-center">
                  <p className="text-slate-600 mb-4">Upload your practicing certificate or bar admission document</p>
                  <Button variant="outline">Choose File</Button>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                  <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
