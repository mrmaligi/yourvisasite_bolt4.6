import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Lock, Shield, Clock, FileText, Star, CreditCard, ArrowLeft, User } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const visaSubClass = searchParams.get('visa');
  const plan = searchParams.get('plan');
  
  const [loading, setLoading] = useState(false);
  const [visaName, setVisaName] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    if (!checkingAuth) {
      if (!user) {
        // Redirect to login with return URL
        toast('error', 'Please sign in to purchase premium content');
        navigate(`/login?redirect=/checkout?visa=${visaSubClass}&plan=${plan}`);
        return;
      }
      
      if (visaSubClass) {
        fetchVisaName();
      }
    }
  }, [user, checkingAuth, visaSubClass, plan, navigate, toast]);

  useEffect(() => {
    // Small delay to allow auth context to load
    const timer = setTimeout(() => setCheckingAuth(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const fetchVisaName = async () => {
    const { data } = await supabase
      .from('visas')
      .select('name')
      .eq('subclass', visaSubClass)
      .single();
    
    if (data) {
      setVisaName(data.name);
    }
  };

  const handlePayment = async () => {
    if (!user) {
      toast('error', 'Please sign in first');
      navigate('/login');
      return;
    }
    
    setLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Store purchase in database (in real app, this would be done via webhook)
    const { error } = await supabase
      .from('user_purchases')
      .upsert({
        user_id: user.id,
        visa_subclass: visaSubClass,
        plan: plan,
        purchased_at: new Date().toISOString(),
        status: 'active'
      }, {
        onConflict: 'user_id,visa_subclass'
      });
    
    if (error) {
      console.error('Purchase storage error:', error);
    }
    
    // Also store in localStorage for quick access
    localStorage.setItem(`visa_${visaSubClass}_${user.id}_unlocked`, 'true');
    
    toast('success', 'Payment successful! Content unlocked.');

    // Redirect back to visa page with unlocked flag
    if (visaSubClass) {
      navigate(`/visas/${visaSubClass}?unlocked=true`);
    } else {
      navigate('/visas');
    }
    
    setLoading(false);
  };

  const features = [
    { icon: FileText, text: 'Complete document checklist with upload system' },
    { icon: Clock, text: 'Real timeline data from applicants' },
    { icon: Star, text: 'Expert tips and common mistakes guide' },
    { icon: Shield, text: 'Step-by-step application process' },
    { icon: Lock, text: 'Lifetime access to all updates' },
    { icon: CheckCircle, text: '30-day money-back guarantee' },
  ];

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardBody className="text-center py-12">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Sign In Required</h2>
            <p className="text-neutral-600 mb-6">Please sign in or create an account to purchase premium content.</p>
            <div className="space-y-3">
              <Button 
                className="w-full"
                onClick={() => navigate(`/login?redirect=/checkout?visa=${visaSubClass}&plan=${plan}`)}
              >
                Sign In
              </Button>
              <Button 
                variant="secondary"
                className="w-full"
                onClick={() => navigate(`/register?redirect=/checkout?visa=${visaSubClass}&plan=${plan}`)}
              >
                Create Account
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Unlock Premium Guide</h1>
          {visaName && (
            <p className="text-neutral-600">for {visaName}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left - Features */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-neutral-900">What You Get</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-neutral-700">{feature.text}</p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Right - Payment */}
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardHeader>
              <h2 className="text-xl font-bold text-neutral-900">Payment</h2>
            </CardHeader>
            <CardBody>
              <div className="text-center mb-6">
                <p className="text-sm text-neutral-500 mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-neutral-900">$49.00</p>
                <p className="text-xs text-neutral-400">One-time payment • Lifetime access • 30-day money-back guarantee</p>
              </div>

              <div className="bg-amber-100 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-amber-800">
                  <User className="w-4 h-4" />
                  <span>Purchasing as: {user.email}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-neutral-200">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="w-5 h-5 text-neutral-400" />
                    <span className="font-medium text-neutral-900">Credit Card</span>
                  </div>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Card number"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                  onClick={handlePayment}
                  loading={loading}
                >
                  <Lock className="w-5 h-5 mr-2" />
                  {loading ? 'Processing...' : 'Pay $49.00'}
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
                  <Shield className="w-4 h-4" />
                  Secure payment by Stripe
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-500">
            <Shield className="w-4 h-4 inline mr-1" />
            30-day money-back guarantee • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
