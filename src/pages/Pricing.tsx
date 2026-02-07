import React from 'react';
import { PricingCard } from '../components/PricingCard';
import { STRIPE_PRODUCTS } from '../stripe-config';

export function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get access to premium visa guides, expert consultations, and priority support
            to make your immigration journey smoother.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <PricingCard 
            product={STRIPE_PRODUCTS.visasite}
            featured={true}
          />
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Need help choosing the right plan?
          </p>
          <a 
            href="mailto:support@visabuild.com" 
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </div>
  );
}