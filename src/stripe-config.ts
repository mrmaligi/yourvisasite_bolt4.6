import { loadStripe } from '@stripe/stripe-js';

export const STRIPE_CONFIG = {
  publishableKey: 'pk_test_REPLACE_ME',
} as const;

export const PREMIUM_VISA_UNLOCK = {
  priceId: 'price_test_visa_premium',
  amount: 4900,
  currency: 'aud',
  name: 'Premium Visa Guide',
};

export const CONSULTATION = {
  priceId: 'variable',
  amount: 0, // Variable amount based on lawyer rate and duration
  currency: 'aud',
  name: 'Lawyer Consultation',
};

// Legacy support for existing components
export const STRIPE_PRODUCTS = {
  visasite: {
    id: 'prod_TvtgXVqJ7konq7',
    priceId: PREMIUM_VISA_UNLOCK.priceId,
    name: PREMIUM_VISA_UNLOCK.name,
    description: 'Access premium visa guides, expert consultations, and priority support',
    price: 49.00,
    currency: 'AUD',
    currencySymbol: 'A$',
    mode: 'payment' as const,
    features: [
      'Premium visa application guides',
      'Expert lawyer consultations',
      'Priority customer support',
      'Document review services',
      'Processing time insights'
    ]
  }
} as const;

export type StripeProduct = typeof STRIPE_PRODUCTS[keyof typeof STRIPE_PRODUCTS];

let stripePromise: ReturnType<typeof loadStripe>;

export const getStripePromise = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);
  }
  return stripePromise;
};
