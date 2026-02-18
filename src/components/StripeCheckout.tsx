import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/Button';
import { Loader2 } from 'lucide-react';
import { getStripePromise } from '../stripe-config';

interface StripeCheckoutProps {
  type: 'premium' | 'consultation';
  visaId?: string;
  lawyerId?: string;
  slotId?: string; // Required for consultation
  notes?: string; // Optional for consultation
  amount: number; // For premium, this is 4900 (cents). For consultation, it might be an estimate or calculated by backend.
  redirectPath?: string; // Optional path to redirect to on success (e.g. "/dashboard/premium?visa_id=...")
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function StripeCheckout({
  type,
  visaId,
  lawyerId,
  slotId,
  notes,
  amount,
  redirectPath,
  onSuccess,
  onCancel,
  className,
  children
}: StripeCheckoutProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Please sign in to continue');
      }

      const functionName = 'stripe-checkout';
      const body: any = {
        type,
        redirect_path: redirectPath,
      };

      if (type === 'premium') {
        body.visa_id = visaId;
        // amount is ignored by backend for premium as it uses server-side constant
      } else if (type === 'consultation') {
        if (!lawyerId || !slotId) {
          throw new Error('Missing required details for consultation booking');
        }
        body.lawyer_id = lawyerId;
        body.slot_id = slotId;
        body.notes = notes;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${functionName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { sessionId, url } = await response.json();
      
      if (onSuccess) {
        onSuccess();
      }

      if (url) {
        window.location.href = url;
        return;
      }

      // Fallback to redirectToCheckout if only sessionId is returned
      const stripe = await getStripePromise();
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Checkout failed');
      if (onCancel) {
        onCancel();
      }
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(cents / 100);
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        children || `Pay ${formatPrice(amount)}`
      )}
    </Button>
  );
}
