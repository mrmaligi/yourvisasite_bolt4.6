import React from 'react';
import { STRIPE_PRODUCTS } from '../stripe-config';
import { PricingCard } from '../components/PricingCard';

export function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get access to premium visa guides, expert consultation, and priority support
            to make your immigration journey smoother and more successful.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 gap-8 max-w-md">
            {STRIPE_PRODUCTS.map((product, index) => (
              <PricingCard
                key={product.id}
                product={product}
                featured={index === 0}
              />
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Why Choose VisaBuild?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Expert Guidance</h3>
                <p className="text-gray-600">Get advice from experienced immigration lawyers and consultants</p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Comprehensive Guides</h3>
                <p className="text-gray-600">Step-by-step instructions for every visa type and requirement</p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Fast Processing</h3>
                <p className="text-gray-600">Streamlined process to help you submit applications faster</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}