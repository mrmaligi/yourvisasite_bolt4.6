export const STRIPE_PRODUCTS = {
  visasite: {
    id: 'prod_TvtgXVqJ7konq7',
    priceId: 'price_1Sy1sf2VsXf5RwsJGOHR2fzk',
    name: 'VisaBuild Premium',
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