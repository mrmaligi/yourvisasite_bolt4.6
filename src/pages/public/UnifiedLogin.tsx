import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, User, Shield, ArrowRight, Eye, EyeOff } from 'lucide-react';
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
  const { signIn } = useAuth();
  
  const [loginType, setLoginType] = useState<LoginType>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Attempt sign in
      const { error } = await signIn(email, password);
      
      if (error) throw error;

      // Get user from session to ensure we have the ID
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('No user found');

      // Get user role using ID for RLS compliance
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_active, lawyer_profiles(verification_status)')
        .eq('id', user.id)
        .single();

      if (!profile) {
        // Fallback if profile missing
        navigate('/dashboard');
        return;
      }

      if (!profile.is_active) {
        toast('error', 'Account disabled');
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
          navigate(from || '/dashboard');
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            Sign in to your VisaBuild account
          </p>
        </div>

        {/* Login Type Selection */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {loginOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = loginType === option.type;
            
            return (
              <button
                key={option.type}
                onClick={() => setLoginType(option.type)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
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

        {/* Login Form */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              {loginType === 'user' && 'Applicant Login'}
              {loginType === 'lawyer' && 'Lawyer Login'}
              {loginType === 'admin' && 'Admin Login'}
            </h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

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

              <div className="flex items-center justify-between text-sm">
                <Link to="/forgot-password" className="text-primary-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Signing in...' : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {loginType === 'user' && (
              <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-4">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 hover:underline">
                  Sign up
                </Link>
              </p>
            )}

            {loginType === 'lawyer' && (
              <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-4">
                Want to join as a lawyer?{' '}
                <Link to="/register/lawyer" className="text-primary-600 hover:underline">
                  Apply here
                </Link>
              </p>
            )}

            <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <p className="text-xs text-neutral-500 text-center">
                Test Account: admin@visabuild.local / admin123
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Role Info Cards */}
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
      </div>
    </div>
  );
}
