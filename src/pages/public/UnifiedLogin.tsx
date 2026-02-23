import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, User, Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Logo } from '../../components/ui/Logo';

type LoginType = 'user' | 'lawyer' | 'admin';

export function UnifiedLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { signInWithEmail: signIn, signInWithGoogle, resetPassword } = useAuth();
  
  const [loginType, setLoginType] = useState<LoginType>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isResetMode) {
      try {
        const { error } = await resetPassword(email);
        if (error) throw error;
        toast('success', 'Password reset email sent. Please check your inbox.');
        setIsResetMode(false);
      } catch (error: any) {
        toast('error', error.message || 'Failed to send reset email');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('User not found after login');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, is_active, lawyer_profiles(verification_status)')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        toast('error', 'Profile not found. Please contact support.');
        return;
      }

      if (profile.is_active === false) {
        toast('error', 'Account disabled');
        return;
      }

      if (loginType === 'admin' && profile.role !== 'admin') {
        toast('error', 'You do not have admin access');
        return;
      }

      if (loginType === 'lawyer' && profile.role !== 'lawyer') {
        toast('error', 'You do not have lawyer access');
        return;
      }

      toast('success', 'Welcome back!');
      
      switch (profile.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'lawyer': {
          const lawyerProfile = profile.lawyer_profiles?.[0];
          if (lawyerProfile?.verification_status === 'approved') {
            navigate('/lawyer/dashboard');
          } else {
            navigate('/lawyer/pending');
          }
          break;
        }
        default:
          navigate(from);
      }
    } catch (error: any) {
      toast('error', error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const loginOptions = [
    { type: 'user' as LoginType, icon: User, label: 'Applicant', desc: 'Visa applicants & users' },
    { type: 'lawyer' as LoginType, icon: Briefcase, label: 'Lawyer', desc: 'Migration agents & lawyers' },
    { type: 'admin' as LoginType, icon: Shield, label: 'Admin', desc: 'Platform administrators' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-navy-600 border-b border-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link to="/">
            <Logo variant="light" size="sm" />
          </Link>
        </div>
      </header>

      <div className="flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-heading font-bold text-navy-700 mb-2">
              {isResetMode ? 'Reset Password' : 'Sign In'}
            </h1>
            <p className="text-neutral-600">
              {isResetMode ? 'Enter your email to receive a reset link' : 'Access your VisaBuild account'}
            </p>
          </div>

          {/* Login Type Selection */}
          {!isResetMode && (
            <div className="grid grid-cols-3 gap-2 mb-6">
              {loginOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = loginType === option.type;

                return (
                  <button
                    key={option.type}
                    onClick={() => setLoginType(option.type)}
                    className={`p-3 border text-center transition-all ${
                      isSelected
                        ? 'border-navy-600 bg-navy-50'
                        : 'border-neutral-200 bg-white hover:border-navy-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? 'text-navy-600' : 'text-neutral-400'}`} />
                    <p className={`text-xs font-semibold ${isSelected ? 'text-navy-700' : 'text-neutral-600'}`}>
                      {option.label}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {/* Login Form */}
          <Card>
            <CardHeader className="bg-navy-50 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                {isResetMode && (
                  <button 
                    onClick={() => setIsResetMode(false)} 
                    className="text-neutral-500 hover:text-navy-700"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <h2 className="text-lg font-semibold text-navy-700">
                  {isResetMode ? 'Forgot Password' : `${loginOptions.find(o => o.type === loginType)?.label} Login`}
                </h2>
              </div>
            </CardHeader>
            
            <CardBody className="space-y-4">
              {/* Google Sign In */}
              {!isResetMode && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={signInWithGoogle}
                    className="w-full"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Sign in with Google
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-neutral-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-neutral-500">Or continue with email</span>
                    </div>
                  </div>
                </>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                {!isResetMode && (
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-8 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                )}

                {!isResetMode && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsResetMode(true)}
                      className="text-sm text-navy-600 hover:text-navy-700"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    isResetMode ? 'Sending...' : 'Signing in...'
                  ) : (
                    isResetMode ? 'Send Reset Link' : 'Sign In'
                  )}
                </Button>
              </form>

              {!isResetMode && loginType === 'user' && (
                <p className="text-center text-sm text-neutral-600">
                  Don\'t have an account?{' '}
                  <Link to="/register" className="text-navy-600 hover:text-navy-700 font-semibold">
                    Register
                  </Link>
                </p>
              )}

              {!isResetMode && loginType === 'lawyer' && (
                <p className="text-center text-sm text-neutral-600">
                  Want to join as a lawyer?{' '}
                  <Link to="/register/lawyer" className="text-navy-600 hover:text-navy-700 font-semibold">
                    Apply here
                  </Link>
                </p>
              )}
            </CardBody>
          </Card>

          {/* Security Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-neutral-500">
              🔒 Your connection is secure. We never store your password in plain text.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
