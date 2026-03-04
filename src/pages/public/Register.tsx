import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, Scale, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { Logo } from '../../components/ui/Logo';

type UserRole = 'user' | 'lawyer' | 'admin';

export function Register() {
  const { user, isLoading, signUpWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') as UserRole | null;
  
  const [selectedRole, setSelectedRole] = useState<UserRole>(roleParam || 'user');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Lawyer-specific fields
  const [barNumber, setBarNumber] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [showLawyerFields, setShowLawyerFields] = useState(roleParam === 'lawyer');

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    // Redirect based on role
    if (selectedRole === 'lawyer') return <Navigate to="/lawyer/dashboard" replace />;
    if (selectedRole === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setShowLawyerFields(role === 'lawyer');
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast('error', 'Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast('error', 'Password must be at least 6 characters.');
      return;
    }
    
    // Validate lawyer fields
    if (selectedRole === 'lawyer') {
      if (!barNumber || !jurisdiction) {
        toast('error', 'Please enter your Bar Number and Jurisdiction');
        return;
      }
    }
    
    setSubmitting(true);
    try {
      // Sign up with metadata including role
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: selectedRole,
          },
        },
      });
      
      if (error) {
        toast('error', error.message);
        setSubmitting(false);
        return;
      }

      if (data.user) {
        // Update profile with role and additional data
        const updateData: any = {
          full_name: fullName,
          role: selectedRole,
        };
        
        if (selectedRole === 'lawyer') {
          updateData.bar_number = barNumber;
          updateData.jurisdiction = jurisdiction;
          updateData.verification_status = 'pending';
          
          // Create lawyer profile
          await supabase.from('lawyer_profiles').insert({
            user_id: data.user.id,
            bar_number: barNumber,
            jurisdiction: jurisdiction,
            verification_status: 'pending',
            is_verified: false,
            is_available: true,
          });
        }
        
        await supabase.from('profiles').update(updateData).eq('id', data.user.id);
        
        toast('success', selectedRole === 'lawyer' 
          ? 'Lawyer account created! Pending verification.' 
          : 'Account created successfully!');
        
        // Redirect based on role
        setTimeout(() => {
          if (selectedRole === 'lawyer') navigate('/lawyer/pending');
          else if (selectedRole === 'admin') navigate('/admin');
          else navigate('/dashboard');
        }, 1500);
      }
    } catch (err) {
      toast('error', 'An unexpected error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'lawyer': return <Scale className="w-4 h-4" />;
      case 'admin': return <ShieldCheck className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'lawyer': return 'Lawyer';
      case 'admin': return 'Admin';
      default: return 'Applicant';
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'lawyer': return 'Provide immigration consultations';
      case 'admin': return 'Manage the platform';
      default: return 'Track visas and book consultations';
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px] animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Create your account</h1>
          <p className="text-neutral-500 mt-2">Join VisaBuild to start your journey.</p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3">I am a...</p>
          <div className="grid grid-cols-3 gap-2">
            {(['user', 'lawyer', 'admin'] as UserRole[]).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleChange(role)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                  selectedRole === role
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                }`}
              >
                {getRoleIcon(role)}
                <span className="text-xs font-semibold">{getRoleLabel(role)}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-neutral-500 mt-2 text-center">
            {getRoleDescription(selectedRole)}
          </p>
        </div>

        <div className="card p-6 sm:p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Lawyer-specific fields */}
            {showLawyerFields && (
              <div className="space-y-4 pt-2 border-t border-neutral-200">
                <p className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-teal-600" />
                  Lawyer Verification
                </p>
                <Input
                  label="Bar Number *"
                  type="text"
                  placeholder="e.g., NSW-12345"
                  value={barNumber}
                  onChange={(e) => setBarNumber(e.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Jurisdiction *
                  </label>
                  <select
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="">Select jurisdiction...</option>
                    <option value="New South Wales">New South Wales</option>
                    <option value="Victoria">Victoria</option>
                    <option value="Queensland">Queensland</option>
                    <option value="Western Australia">Western Australia</option>
                    <option value="South Australia">South Australia</option>
                    <option value="Tasmania">Tasmania</option>
                    <option value="Australian Capital Territory">ACT</option>
                    <option value="Northern Territory">Northern Territory</option>
                    <option value="Federal">Federal</option>
                  </select>
                </div>
                <p className="text-xs text-neutral-500">
                  Your account will be pending verification before you can start accepting clients.
                </p>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" loading={submitting}>
              <UserPlus className="w-4 h-4" />
              Create {selectedRole === 'user' ? 'Account' : getRoleLabel(selectedRole) + ' Account'}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs text-neutral-400 uppercase tracking-wide font-medium">or</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          <Button variant="secondary" size="lg" className="w-full bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50 dark:bg-white dark:text-neutral-700 dark:hover:bg-neutral-50 font-medium" onClick={signInWithGoogle}>
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Sign up with Google
          </Button>
        </div>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
