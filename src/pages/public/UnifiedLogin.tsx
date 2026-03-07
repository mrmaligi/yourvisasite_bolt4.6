import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, Briefcase, Shield, Eye, EyeOff, ArrowRight, Lock } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/ui/Toast';

type LoginType = 'user' | 'lawyer' | 'admin';

export function UnifiedLogin() {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [loginType, setLoginType] = useState<LoginType>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errorMsg) setErrorMsg(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      // Attempt sign in
      const { data: authData, error } = await signIn(email, password);

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          const msg = 'Please check your email to confirm your account.';
          toast('info', msg);
          setErrorMsg(msg);
          return;
        }
        throw error;
      }

      if (!authData.user) throw new Error('No user found');

      // Get user role using ID for RLS compliance
      // Retry logic to handle race condition with profile creation trigger
      let profile = null;
      let attempts = 0;
      while (attempts < 3 && !profile) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role, is_active, lawyer_profiles(verification_status)')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (profileData) {
          profile = profileData;
        } else {
          attempts++;
          if (attempts < 3) await new Promise(r => setTimeout(r, 1000));
        }
      }

      if (!profile) {
        // Fallback if profile missing
        console.warn('Profile not found during login redirect');
        navigate('/dashboard');
        return;
      }

      if (!profile.is_active) {
        const msg = 'Account disabled';
        toast('error', msg);
        setErrorMsg(msg);
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
          // Check verification safely
          if (lawyerProfile?.verification_status === 'approved') {
            navigate('/lawyer/dashboard');
          } else {
            navigate('/lawyer/pending');
          }
          break;
        }
        default:
          navigate(from || '/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const msg = error.message || 'Invalid credentials';
      toast('error', msg);
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const loginOptions = [
    { type: 'user' as LoginType, icon: User, label: 'Applicant' },
    { type: 'lawyer' as LoginType, icon: Briefcase, label: 'Lawyer' },
    { type: 'admin' as LoginType, icon: Shield, label: 'Admin' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-400/20 blur-[120px] mix-blend-multiply dark:mix-blend-lighten pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-400/20 blur-[120px] mix-blend-multiply dark:mix-blend-lighten pointer-events-none" />

      <div className="w-full flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-lg animate-fade-in-up">

          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-3 tracking-tight">
              Welcome back
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 font-light">
              Sign in to your VisaBuild account
            </p>
          </div>

          <Card className="border-0 shadow-elevated bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl ring-1 ring-neutral-200/50 dark:ring-neutral-800/50">
            <CardBody className="p-8 md:p-10">

              {/* Modern Segmented Control for Login Type */}
              <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl mb-8 border border-neutral-200/50 dark:border-neutral-700/50 relative">
                {loginOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = loginType === option.type;

                  return (
                    <button
                      key={option.type}
                      onClick={() => setLoginType(option.type)}
                      type="button"
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 text-sm font-semibold rounded-xl transition-all duration-300 relative z-10 ${
                        isSelected
                          ? 'text-primary-600 dark:text-primary-400 shadow-sm bg-white dark:bg-neutral-900'
                          : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                      }`}
                      aria-pressed={isSelected}
                    >
                      <Icon className="w-4 h-4" />
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="p-4 bg-red-50/50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-200/50 dark:border-red-800/50 backdrop-blur-sm flex gap-3 items-start animate-fade-in">
                    <Shield className="w-5 h-5 shrink-0" />
                    <p>{errorMsg}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={handleEmailChange}
                      required
                      disabled={loading}
                      className="h-12 bg-neutral-50/50 dark:bg-neutral-800/50 focus:bg-white dark:focus:bg-neutral-900 transition-colors"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Password
                      </label>
                      <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        disabled={loading}
                        className="h-12 bg-neutral-50/50 dark:bg-neutral-800/50 focus:bg-white dark:focus:bg-neutral-900 pr-12 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? 'Signing in...' : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Footer Links */}
              <div className="mt-8 pt-6 border-t border-neutral-200/50 dark:border-neutral-800/50">
                {loginType === 'user' && (
                  <p className="text-center text-neutral-600 dark:text-neutral-400 font-medium">
                    New to VisaBuild?{' '}
                    <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors">
                      Create an account
                    </Link>
                  </p>
                )}

                {loginType === 'lawyer' && (
                  <p className="text-center text-neutral-600 dark:text-neutral-400 font-medium">
                    Want to offer your services?{' '}
                    <Link to="/register/lawyer" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors">
                      Apply as a Lawyer
                    </Link>
                  </p>
                )}

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
                  <Lock className="w-3 h-3" />
                  <p>Secure login provided by Supabase Auth</p>
                </div>
              </div>

            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
