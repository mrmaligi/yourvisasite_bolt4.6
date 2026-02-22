import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, User, Shield, ArrowRight, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

type LoginType = 'user' | 'lawyer' | 'admin';

export function UnifiedLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { signIn, signInWithGoogle, resetPassword } = useAuth();
  
  const [loginType, setLoginType] = useState<LoginType>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);

  const stateFrom = (location.state as any)?.from?.pathname;
  // Default to dashboard if no previous location or if previous location was home
  const from = (stateFrom && stateFrom !== '/') ? stateFrom : '/dashboard';

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
      // Attempt sign in
      const { error } = await signIn(email, password);
      
      if (error) throw error;

      // Get current user to get the ID
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('User not found after login');

      // Get user role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_active, lawyer_profiles(verification_status)')
        .eq('id', user.id)
        .single();

      if (!profile?.is_active) {
        toast('error', 'Account disabled');
        return;
      }

      // Validate role matches selected login type
      if (loginType === 'admin' && profile.role !== 'admin') {
        toast('error', 'You do not have admin access');
        return;
      }

      if (loginType === 'lawyer' && profile.role !== 'lawyer') {
        toast('error', 'You do not have lawyer access');
        return;
      }

      if (loginType === 'user' && profile.role === 'lawyer') {
        // Lawyers can also access user features
        toast('success', 'Welcome back!');
        navigate('/dashboard');
        return;
      }

      // Redirect based on role
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
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            {isResetMode ? 'Reset Password' : 'Welcome Back'}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            {isResetMode ? 'Enter your email to receive a reset link' : 'Sign in to your VisaBuild account'}
          </p>
        </div>

        {/* Login Type Selection - Hide in reset mode */}
        {!isResetMode && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {loginOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = loginType === option.type;

              return (
                <button
                  key={option.type}
                  onClick={() => setLoginType(option.type)}
                  aria-pressed={isSelected}
                  className={`p-4 rounded-xl border-2 text-center transition-all focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-primary-300'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${isSelected ? 'text-primary-600' : 'text-neutral-400'}`} />
                  <h3 className={`font-semibold ${isSelected ? 'text-primary-700' : 'text-neutral-700 dark:text-neutral-300'}`}>
                    {option.label}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">{option.desc}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* Login Form */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              {isResetMode && (
                  <button onClick={() => setIsResetMode(false)} className="text-neutral-500 hover:text-neutral-700">
                      <ArrowLeft className="w-5 h-5" />
                  </button>
              )}
              {isResetMode
                ? 'Forgot Password'
                : (
                  <>
                    {loginType === 'user' && 'Applicant Login'}
                    {loginType === 'lawyer' && 'Lawyer Login'}
                    {loginType === 'admin' && 'Admin Login'}
                  </>
                )
              }
            </h2>
          </CardHeader>
          <CardBody>
            <Button
              type="button"
              variant="secondary"
              onClick={signInWithGoogle}
              className="w-full mb-4 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-neutral-300 dark:border-neutral-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-neutral-800 px-2 text-neutral-500">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                // Highlighting email field if there is a general error, assuming it might be credentials related
                error={undefined}
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
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-8 text-neutral-400 hover:text-neutral-600 focus-visible:outline-none focus-visible:text-neutral-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              )}

              {!isResetMode && (
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => setIsResetMode(true)}
                    className="text-primary-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (isResetMode ? 'Sending...' : 'Signing in...') : (
                  <>
                    {isResetMode ? 'Send Reset Link' : 'Sign In'}
                    {!isResetMode && <ArrowRight className="w-4 h-4 ml-2" />}
                  </>
                )}
              </Button>
            </form>

            {!isResetMode && loginType === 'user' && (
              <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-4">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 hover:underline">
                  Sign up
                </Link>
              </p>
            )}

            {!isResetMode && loginType === 'lawyer' && (
              <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-4">
                Want to join as a lawyer?{' '}
                <Link to="/register/lawyer" className="text-primary-600 hover:underline">
                  Apply here
                </Link>
              </p>
            )}

            {!isResetMode && (
              <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <p className="text-xs text-neutral-500 text-center">
                  Test Account: admin@visabuild.local / admin123
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Role Info Cards */}
        {!isResetMode && (
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <Card className="bg-white/50 dark:bg-neutral-800/50">
              <CardBody className="text-center">
                <User className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <h4 className="font-medium text-neutral-900 dark:text-white">Applicants</h4>
                <p className="text-xs text-neutral-500 mt-1">
                  Search visas, track applications, book consultations
                </p>
              </CardBody>
            </Card>

            <Card className="bg-white/50 dark:bg-neutral-800/50">
              <CardBody className="text-center">
                <Briefcase className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <h4 className="font-medium text-neutral-900 dark:text-white">Lawyers</h4>
                <p className="text-xs text-neutral-500 mt-1">
                  Manage clients, set availability, offer services
                </p>
              </CardBody>
            </Card>

            <Card className="bg-white/50 dark:bg-neutral-800/50">
              <CardBody className="text-center">
                <Shield className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <h4 className="font-medium text-neutral-900 dark:text-white">Admins</h4>
                <p className="text-xs text-neutral-500 mt-1">
                  Platform management, user verification, analytics
                </p>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
