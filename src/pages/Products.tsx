import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { stripeProducts } from '../stripe-config';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { supabase } from '../lib/supabase';

export function Products() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handlePurchase = async (priceId: string, mode: 'payment' | 'subscription') => {
    if (!user) {
      setError('Please sign in to make a purchase');
      return;
    }

    setLoading(priceId);
    setError('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Authentication required');
        return;
      }

      // Simulate success immediately
      window.location.href = `${window.location.origin}/success`;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Premium Products</h1>
          <p className="text-xl text-gray-600">
            Unlock premium features and content with our products
          </p>
        </div>

        {error && (
          <div className="mb-8">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {stripeProducts.map((product) => (
            <Card key={product.priceId} className="relative">
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-gray-900">Free</span>
                  </div>
                  
                  <Button
                    onClick={() => handlePurchase(product.priceId, product.mode)}
                    disabled={loading === product.priceId}
                    className="w-full"
                  >
                    {loading === product.priceId ? 'Processing...' : 'Get Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!user && (
          <div className="mt-12 text-center">
            <Alert>
              <AlertDescription>
                Please <a href="/login" className="text-blue-600 hover:underline">sign in</a> to purchase products.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}