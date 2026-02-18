import { useState, type FormEvent } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Mail, Eye, EyeOff, Scale, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { Logo } from '../../components/ui/Logo';

function getRoleDashboard(role: string | null) {
  if (role === 'admin') return '/admin';
  if (role === 'lawyer') return '/lawyer';
  return '/dashboard';
}

export function Login() {
  const { user, role, isLoading, signInWithGoogle, signInWithEmail } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [becomingAdmin, setBecomingAdmin] = useState(false);

  if (!isLoading && user) {
    return <Navigate to={getRoleDashboard(role)} replace />;
  }

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    const { error } = await signInWithEmail(email, password);
    if (error) {
      toast('error', error.message);
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) {
      toast('error', error.message);
    } else {
      toast('success', 'Password reset email sent. Check your inbox.');
      setShowReset(false);
      setResetEmail('');
    }
    setResetSubmitting(false);
  };

  const handleBecomeAdmin = async () => {
    if (!user) {
      toast('error', 'Please sign in first to become an admin');
      return;
    }

    setBecomingAdmin(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/seed-admin`;
      const session = await supabase.auth.getSession();

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.data.session?.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to become admin');
      }

      toast('success', data.message);
      setTimeout(() => {
        window.location.href = '/admin';
      }, 1500);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to become admin';
      toast('error', message);
    } finally {
      setBecomingAdmin(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px] animate-fade-in-up">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Welcome back</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">Sign in to access your dashboard and manage your visas.</p>
        </div>

        <div className="card p-6 sm:p-8 dark:bg-neutral-800 dark:border-neutral-700">
          <form onSubmit={handleEmailLogin} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="dark:bg-neutral-900"
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="dark:bg-neutral-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => { setShowReset(true); setResetEmail(email); }}
                className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <Button type="submit" size="lg" className="w-full" loading={submitting}>
              <Mail className="w-4 h-4" />
              Sign in
            </Button>
          </form>

          {showReset && (
            <form onSubmit={handleResetPassword} className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl space-y-3 border border-neutral-200/60 dark:border-neutral-700">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">Reset your password</p>
              <Input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                autoComplete="email"
                className="dark:bg-neutral-900"
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" loading={resetSubmitting}>Send reset link</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowReset(false)}>Cancel</Button>
              </div>
            </form>
          )}

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
            <span className="text-xs text-neutral-400 uppercase tracking-wide font-medium">or</span>
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
          </div>

          <Button variant="secondary" size="lg" className="w-full dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-700 dark:text-white" onClick={signInWithGoogle}>
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Sign in with Google
          </Button>
        </div>

        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold transition-colors">
            Create one
          </Link>
        </p>

        <div className="mt-8 space-y-3">
          <Link
            to="/register/lawyer"
            className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-neutral-200/80 hover:border-teal-300 hover:bg-teal-50/50 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-teal-900/10 transition-all duration-200 group bg-white shadow-soft"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center group-hover:bg-teal-200 dark:group-hover:bg-teal-900/50 transition-colors">
              <Scale className="w-5 h-5 text-teal-700 dark:text-teal-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">Lawyer Portal</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Register as an immigration lawyer</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleBecomeAdmin}
            disabled={!user || becomingAdmin}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl border border-neutral-200/80 hover:border-primary-300 hover:bg-primary-50/50 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-primary-900/10 transition-all duration-200 group bg-white shadow-soft disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-neutral-200 disabled:hover:bg-white dark:disabled:hover:bg-neutral-800"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
              <ShieldCheck className="w-5 h-5 text-primary-700 dark:text-primary-400" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                {becomingAdmin ? 'Setting up admin...' : 'Admin Access'}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {user ? 'Click to become admin (first-time setup)' : 'Sign in first to access admin panel'}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
