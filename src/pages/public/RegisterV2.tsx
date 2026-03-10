import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Shield, Eye, EyeOff, Briefcase } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function RegisterV2() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [userType, setUserType] = useState<'user' | 'lawyer'>('user');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
      const { error } = await signUp(formData.email, formData.password, fullName);
      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        <div className="bg-white border border-slate-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Create your account</h1>
            <p className="text-slate-600">Start your Australian visa journey today</p>
          </div>

          {/* User Type Toggle */}
          <div className="flex gap-2 p-1 bg-slate-100 mb-6">
            <button
              type="button"
              onClick={() => setUserType('user')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 font-medium transition-all ${
                userType === 'user'
                  ? 'bg-white text-blue-600 border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" /> Applicant
            </button>
            <button
              type="button"
              onClick={() => setUserType('lawyer')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 font-medium transition-all ${
                userType === 'lawyer'
                  ? 'bg-white text-blue-600 border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4" /> Lawyer
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
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
                  className="w-full px-4 py-3 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-12 py-3 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 w-4 h-4 border-slate-300 text-blue-600" required />
              <span className="text-sm text-slate-600">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterV2;
