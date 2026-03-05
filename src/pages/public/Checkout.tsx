import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Lock, Shield, Clock, FileText, Star, CreditCard, ArrowLeft } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../lib/supabase';

export function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const visaId = searchParams.get('visa');
  const plan = searchParams.get('plan');
  
  const [loading, setLoading] = useState(false);
  const [visaName, setVisaName] = useState('');

  useEffect(() => {
    if (visaId) {
      fetchVisaName();
    }
  }, [visaId]);

  const fetchVisaName = async () => {
    const { data } = await supabase
      .from('visas')
      .select('name')
      .eq('id', visaId)
      .single();
    
    if (data) {
      setVisaName(data.name);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In real implementation, you would:
    // 1. Create Stripe checkout session
    // 2. Redirect to Stripe
    // 3. Handle webhook callback
    // 4. Unlock content for user
    
    toast('success', 'Payment successful! Content unlocked.');
    
    // Redirect back to visa page with unlocked content
    if (visaId) {
      navigate(`/visas/${visaId}?unlocked=true`);
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
                <p className="text-4xl font-bold text-neutral-900">$49.00</p>
                <p className="text-sm text-neutral-500 mt-1">One-time payment • Lifetime access</p>
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
