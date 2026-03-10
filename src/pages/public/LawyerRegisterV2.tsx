import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Shield, Eye, EyeOff, Briefcase, GraduationCap, Award, MapPin, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export function LawyerRegisterV2() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    lawSocietyNumber: '',
    yearsExperience: '',
    specializations: [] as string[],
    bio: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const specializations = [
    'Skilled Migration (189/190/491)',
    'Employer Sponsorship (482/186)',
    'Partner/Family Visas (820/801)',
    'Student Visas (500)',
    'Business/Investor Visas',
    'Review Tribunal (AAT)',
    'Citizenship'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      
      // 1. Create auth user with lawyer role in metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: fullName,
            role: 'lawyer'
          },
        },
      });
      
      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      // 2. Wait a moment for trigger to create profile, then update it
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 3. Update profile to lawyer role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          role: 'lawyer',
          phone: formData.phone,
          location: formData.location
        })
        .eq('id', authData.user.id);
      
      if (profileError) {
        console.error('Profile update error:', profileError);
        // Don't throw, continue anyway
      }

      // 4. Create lawyer profile
      const { error: lawyerError } = await supabase
        .from('lawyer_profiles')
        .insert({
          user_id: authData.user.id,
          law_society_number: formData.lawSocietyNumber,
          years_experience: parseInt(formData.yearsExperience) || 0,
          specializations: formData.specializations,
          bio: formData.bio,
          verification_status: 'pending',
          created_at: new Date().toISOString()
        });
      
      if (lawyerError) {
        console.error('Lawyer profile error:', lawyerError);
        // Don't throw, continue anyway
      }

      // 5. Sign in immediately to get fresh session with lawyer role
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
      }

      // Navigate to lawyer dashboard
      navigate('/lawyer/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSpecialization = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-slate-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Register as a Migration Lawyer</h1>
            <p className="text-slate-600">Join our platform to help visa applicants</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-8 h-8 flex items-center justify-center font-bold ${
                  step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {s}
                </div>
                {s < 3 && <div className={`flex-1 h-1 ${step > s ? 'bg-indigo-600' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Account */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900">Account Information</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                    placeholder="Smith"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  placeholder="john@lawfirm.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button variant="primary" onClick={() => setStep(2)}>Continue</Button>
              </div>
            </div>
          )}

          {/* Step 2: Professional */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900">Professional Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Law Society Registration Number</label>
                <input
                  type="text"
                  value={formData.lawSocietyNumber}
                  onChange={(e) => setFormData({...formData, lawSocietyNumber: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  placeholder="e.g. 12345_VIC"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Years of Experience</label>
                <input
                  type="number"
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData({...formData, yearsExperience: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  placeholder="5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  placeholder="+61 400 000 000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  required
                >
                  <option value="">Select your state</option>
                  <option value="NSW">New South Wales</option>
                  <option value="VIC">Victoria</option>
                  <option value="QLD">Queensland</option>
                  <option value="WA">Western Australia</option>
                  <option value="SA">South Australia</option>
                  <option value="TAS">Tasmania</option>
                  <option value="ACT">Australian Capital Territory</option>
                  <option value="NT">Northern Territory</option>
                </select>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button variant="primary" onClick={() => setStep(3)}>Continue</Button>
              </div>
            </div>
          )}

          {/* Step 3: Specializations */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900">Areas of Expertise</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Select your specializations</label>
                <div className="space-y-2">
                  {specializations.map((spec) => (
                    <label key={spec} className="flex items-center gap-3 p-3 border border-slate-200 cursor-pointer hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={formData.specializations.includes(spec)}
                        onChange={() => toggleSpecialization(spec)}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <span className="text-sm">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Professional Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none h-32"
                  placeholder="Tell us about your experience with migration law..."
                />
              </div>

              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 w-4 h-4" required />
                <span className="text-sm text-slate-600">
                  I confirm I am a registered migration agent or lawyer in Australia and my details are accurate.
                </span>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)} type="button">Back</Button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="py-3 px-6 bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                >
                  {isLoading ? 'Creating account...' : 'Complete Registration'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-slate-600">
              Already registered?{' '}
              <Link to="/lawyer/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Sign in
              </Link>
            </p>
            <p className="mt-2 text-sm text-slate-500">
              <Link to="/register" className="hover:underline">Register as an applicant instead</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Button component for the form
function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  type = 'button',
  disabled = false
}: { 
  children: React.ReactNode; 
  variant?: 'primary' | 'outline'; 
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}) {
  const baseClasses = "py-3 px-6 font-medium disabled:opacity-50";
  const variantClasses = variant === 'primary' 
    ? "bg-indigo-600 text-white hover:bg-indigo-700"
    : "border border-slate-300 text-slate-700 hover:bg-slate-50";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses}`}
    >
      {children}
    </button>
  );
}

export default LawyerRegisterV2;
