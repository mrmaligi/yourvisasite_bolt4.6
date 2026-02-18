import { ArrowRight, Shield, Clock, Users, CheckCircle, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { PricingCard } from '../components/PricingCard';
import { STRIPE_PRODUCTS } from '../stripe-config';

export function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-20 lg:py-28 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 tracking-tight mb-6">
              Simplify Your Australian <span className="text-primary-600">Visa Journey</span>
            </h1>
            <p className="text-xl text-neutral-500 mb-10">
              Navigate the complex immigration process with confidence. Get step-by-step guides, real-time tracking, and expert support.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/visas">
                <Button size="lg" className="w-full sm:w-auto flex items-center gap-2">
                  Browse Visas <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/tracker">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto flex items-center gap-2">
                  Check Processing Times <Clock className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Reliable Information</h3>
              <p className="text-neutral-500">
                Up-to-date visa requirements, checklists, and guides sourced directly from official regulations.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center text-accent-600 mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Real-time Tracker</h3>
              <p className="text-neutral-500">
                See real processing times from thousands of other applicants to better plan your move.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Expert Network</h3>
              <p className="text-neutral-500">
                Connect with verified migration lawyers and agents for complex cases and advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Get Premium Access
            </h2>
            <p className="text-xl text-neutral-500 max-w-3xl mx-auto">
              Unlock expert guidance, premium resources, and priority support for your visa journey.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <PricingCard
              product={STRIPE_PRODUCTS.visasite}
              featured={true}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to start your journey?</h2>
          <p className="text-primary-100 text-lg mb-8">
            Join thousands of others who have successfully navigated their Australian visa application with VisaBuild.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-primary-900 hover:bg-primary-50 border-0">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
