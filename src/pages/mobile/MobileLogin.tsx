import React, { useState } from 'react';
import { MobileLayout } from '../../components/mobile/MobileLayout';
import { MobileButton } from '../../components/mobile/MobileButton';
import { MobileInput } from '../../components/mobile/MobileInput';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, User } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

export default function MobileLogin() {
  const navigate = useNavigate();
  const { signInWithEmail: signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;

      toast('success', 'Welcome back!');
      navigate('/mobile/dashboard');
    } catch (error: any) {
      toast('error', error.message || 'Check your credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout title="Sign In" showNav={false} showBack={true}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="mb-8 text-center">
           <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
             <User className="w-8 h-8 text-white" />
           </div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
           <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to continue to your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <MobileInput
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-5 h-5" />}
            required
          />

          <MobileInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-end mb-6">
            <button
              type="button"
              onClick={() => navigate('/mobile/forgot-password')}
              className="text-sm text-blue-600 font-medium"
            >
              Forgot Password?
            </button>
          </div>

          <MobileButton type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </MobileButton>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/mobile/register')}
              className="text-blue-600 font-semibold"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}
