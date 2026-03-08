import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../lib/auth';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { supabase } from '../lib/supabase';

export function ProductsV2() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const products = [
    {
      id: 'premium-guide',
      name: 'Premium Visa Guide',
      description: 'Complete step-by-step guide for your visa application',
      price: '$99',
      features: ['Document Checklists', 'Timeline Templates', 'Expert Tips', 'Priority Support'],
    },
    {
      id: 'consultation',
      name: 'Lawyer Consultation',
      description: '30-minute consultation with a migration lawyer',
      price: '$150',
      features: ['1-on-1 Video Call', 'Document Review', 'Personalized Advice', 'Follow-up Email'],
    },
    {
      id: 'full-service',
      name: 'Full Application Service',
      description: 'Complete application preparation and submission',
      price: '$1,500',
      features: ['Full Document Prep', 'Application Review', 'Submission Support', 'Ongoing Updates'],
    },
  ];

  const handlePurchase = async (productId: string) => {
    if (!user) {
      setError('Please sign in to make a purchase');
      return;
    }

    setLoading(productId);
    setError('');

    // Mock purchase for now
    setTimeout(() => {
      setLoading(null);
      alert('Redirecting to checkout...');
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>Products | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Our Products</h1>
              <p className="text-slate-600">Choose the service that fits your needs</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6">{error}</div>
          )}

          {/* Products Grid - SQUARE */}
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white border border-slate-200 p-6 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{product.name}</h3>
                  <p className="text-slate-600 text-sm">{product.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-slate-900">{product.price}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-slate-600 text-sm">
                      <span className="w-1.5 h-1.5 bg-blue-600"></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => handlePurchase(product.id)}
                  disabled={loading === product.id}
                >
                  {loading === product.id ? 'Processing...' : 'Purchase'}
                </Button>
              </div>
            ))}
          </div>

          {/* Info Box - SQUARE */}
          <div className="mt-12 bg-blue-50 border border-blue-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-2">Need Help Choosing?</h3>
            <p className="text-slate-600 text-sm mb-4">
              Not sure which product is right for you? Book a free consultation with our team.
            </p>
            <Button variant="outline">Book Free Consultation</Button>
          </div>
        </div>
      </div>
    </>
  );
}
