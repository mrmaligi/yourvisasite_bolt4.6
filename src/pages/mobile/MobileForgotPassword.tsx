import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '../../components/mobile/MobileLayout';
import { MobileCard } from '../../components/mobile/MobileCard';
import { MobileButton } from '../../components/mobile/MobileButton';
import { MobileInput } from '../../components/mobile/MobileInput';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../lib/supabase';

export default function MobileForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast('error', 'Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setSent(true);
      toast('success', 'Reset instructions sent!');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast('error', error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <MobileLayout title="Check Email" showBack={true}>
        <div className="p-4">
          <MobileCard>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Check Your Email</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
              <MobileButton onClick={() => navigate('/mobile/login')} className="w-full">
                Back to Login
              </MobileButton>
            </div>
          </MobileCard>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Forgot Password" showBack={true}>
      <div className="p-4">
        <MobileCard>
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold mb-1">Reset Password</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter your email to receive reset instructions
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <MobileInput
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <MobileButton type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </MobileButton>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/mobile/login')}
              className="text-sm text-blue-600 dark:text-blue-400"
            >
              Remember your password? Sign in
            </button>
          </div>
        </MobileCard>
      </div>
    </MobileLayout>
  );
}
