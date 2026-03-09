import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Scale, CheckCircle, Upload } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function LawyerRegisterV2() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep(3); // Success step
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Register as Lawyer | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header - SQUARE */}
          <div className="bg-white border border-slate-200 p-8 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Scale className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Register as a Lawyer</h1>
              <p className="text-slate-600 mt-2">Join our network of immigration lawyers</p>
            </div>
          </div>

          {/* Progress - SQUARE */}
          <div className="bg-white border border-slate-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              {['Personal Info', 'Credentials', 'Review'].map((label, i) => (
                <div key={label} className="flex items-center">
                  <div className={`w-8 h-8 flex items-center justify-center ${
                    step > i + 1 ? 'bg-green-600 text-white' :
                    step === i + 1 ? 'bg-blue-600 text-white' :
                    'bg-slate-200 text-slate-600'
                  }`}>
                    {step > i + 1 ? <CheckCircle className="w-5 h-5" /> : i + 1}
                  </div>
                  <span className="ml-2 text-sm font-medium text-slate-700 hidden sm:block">{label}</span>
                  {i < 2 && <div className="w-12 h-px bg-slate-300 mx-4" />}
                </div>
              ))}
            </div>
          </div>

          {/* Form - SQUARE */}
          <div className="bg-white border border-slate-200 p-8">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                    <input type="text" className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                    <input type="text" className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input type="tel" className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none" />
                </div>

                <Button variant="primary" className="w-full" onClick={() => setStep(2)}>Continue</Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-900">Professional Credentials</h2>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bar Number</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jurisdiction</label>
                  <select className="w-full px-3 py-2 border border-slate-200 bg-white focus:border-blue-500 outline-none">
                    <option>Select jurisdiction...</option>
                    <option>New South Wales</option>
                    <option>Victoria</option>
                    <option>Queensland</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience</label>
                  <input type="number" className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Practice Areas</label>
                  <input type="text" placeholder="e.g. Partner Visas, Skilled Migration" className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none" />
                </div>

                <div className="border-2 border-dashed border-slate-300 p-6 text-center">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600">Upload verification documents</p>
                  <p className="text-sm text-slate-500">PDF, JPG, PNG up to 10MB</p>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                  <Button variant="primary" className="flex-1" onClick={() => setStep(3)}>Continue</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Application Submitted!</h2>
                <p className="text-slate-600 mb-6">Your application is under review. We will notify you within 2-3 business days.</p>
                
                <Button variant="primary" onClick={() => navigate('/lawyer/dashboard')}>Go to Dashboard</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
