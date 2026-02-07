import React from 'react';
import { Check } from 'lucide-react';
import { StripeCheckout } from './StripeCheckout';
import type { StripeProduct } from '../stripe-config';

interface PricingCardProps {
  product: StripeProduct;
  featured?: boolean;
}

export function PricingCard({ product, featured = false }: PricingCardProps) {
  return (
    <div className={`relative rounded-2xl border p-8 ${
      featured 
        ? 'border-indigo-500 bg-indigo-50 shadow-lg' 
        : 'border-gray-200 bg-white'
    }`}>
      {featured && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 mb-6">
          {product.description}
        </p>
        
        <div className="mb-8">
          <span className="text-4xl font-bold text-gray-900">
            {product.currencySymbol}{product.price}
          </span>
          <span className="text-gray-600 ml-2">one-time</span>
        </div>
        
        <StripeCheckout 
          product={product}
          className={`w-full ${
            featured 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
              : 'bg-gray-900 hover:bg-gray-800 text-white'
          }`}
        >
          Get Started
        </StripeCheckout>
      </div>
      
      <ul className="mt-8 space-y-4">
        {product.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}