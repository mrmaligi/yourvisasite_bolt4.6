export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  {
    priceId: 'price_1Sy1sf2VsXf5RwsJGOHR2fzk',
    name: 'VisaSite Premium',
    description: 'Access to premium visa guides and resources',
    mode: 'payment',
  },
];