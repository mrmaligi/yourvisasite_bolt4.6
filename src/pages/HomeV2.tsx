import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Shield, 
  Users, 
  FileCheck, 
  Clock,
  Star,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export function HomeV2() {
  const features = [
    {
      icon: FileCheck,
      title: 'Complete Visa Guides',
      description: 'Step-by-step instructions for all Australian visa types.',
    },
    {
      icon: Users,
      title: 'Expert Lawyers',
      description: 'Connect with verified migration lawyers.',
    },
    {
      icon: Clock,
      title: 'Real-time Tracking',
      description: 'Track your application progress.',
    },
    {
      icon: Shield,
      title: 'Secure & Trusted',
      description: 'Bank-level encryption protection.',
    }
  ];

  return (
    <>
      <Helmet>
        <title>VisaBuild - Australian Visa Made Simple</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Hero - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Australian Visa Made Simple
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                Step-by-step guides, expert lawyers, and real-time tracking for your visa journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/visas">
                  <Button variant="primary" size="lg">
                    Explore Visas
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/lawyers">
                  <Button variant="outline" size="lg">
                    Find a Lawyer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats - SQUARE */}
        <div className="bg-blue-600">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '50+', label: 'Visa Types' },
                { value: '200+', label: 'Expert Lawyers' },
                { value: '10K+', label: 'Happy Clients' },
                { value: '95%', label: 'Success Rate' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl md:text-4xl font-bold text-white">{stat.value}</p>
                  <p className="text-blue-100 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features - SQUARE */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Why Choose VisaBuild?</h2>
            <p className="text-slate-600 mt-2">Everything you need for your visa application</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white border border-slate-200 p-6">
                <div className="w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA - SQUARE */}
        <div className="bg-slate-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Visa Journey?</h2>
              <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                Join thousands of successful applicants who trusted VisaBuild.
              </p>
              <Link to="/register">
                <Button variant="primary" size="lg">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
