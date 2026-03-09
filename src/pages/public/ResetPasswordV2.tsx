import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export function ResetPasswordV2() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  if (success) {
    return (
      <>
        <Helmet>
          <title>Password Reset Success | VisaBuild</title>
        </Helmet>
        
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Password Reset!</h1>
            <p className="text-slate-600 mb-6">Your password has been successfully reset.</p>
            
            <Link to="/login">
              <Button variant="primary" className="w-full">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Reset Password | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white border border-slate-200 p-8">
            <Link to="/login" className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </Link>

            <div className="w-12 h-12 bg-blue-100 flex items-center justify-center mb-6">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">Reset Password</h1>
            <p className="text-slate-600 mb-6">Enter your new password below.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-slate-200"
                    required
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-slate-200"
                    required
                  />
                </div>
              </div>

              <Button 
                variant="primary" 
                className="w-full"
                disabled={loading || password !== confirmPassword}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
