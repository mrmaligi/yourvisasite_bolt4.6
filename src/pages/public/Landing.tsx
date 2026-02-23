import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Clock,
  FileText,
  ArrowRight,
  CheckCircle,
  BarChart3,
  BookOpen,
  Phone,
  Shield,
  FileCheck,
  Globe,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export function Landing() {
  const [stats, setStats] = useState({
    visas: 0,
    entries: 0,
    lawyers: 0
  });

  useEffect(() => {
    Promise.all([
      supabase.from('visas').select('id', { count: 'exact', head: true }).eq('is_active', true).eq('country', 'Australia'),
      supabase.from('tracker_entries').select('id', { count: 'exact', head: true }),
      supabase.schema('lawyer').from('profiles').select('id', { count: 'exact', head: true }).eq('is_verified', true)
    ]).then(([visas, entries, lawyers]) => {
      setStats({
        visas: visas.count || 78,
        entries: entries.count || 0,
        lawyers: lawyers.count || 0
      });
    });
  }, []);

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-neutral-500">
            <span className="text-navy-600 font-medium">Home</span>
          </nav>
        </div>
      </div>

      {/* Hero Section - Two Column */}
      <section className="bg-navy-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-gold-500 text-white px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-6">
                <Shield className="w-4 h-4" />
                Official Immigration Resource
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-heading font-bold text-white mb-6 leading-tight">
                Navigate Australian Immigration with Confidence
              </h1>

              <p className="text-lg text-navy-100 mb-8 leading-relaxed">
                Access accurate visa information, real processing times, and expert guidance. 
                Your trusted resource for Australian immigration services.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/visas">
                  <Button size="lg" variant="accent">
                    Search Visas
                    <Search className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/tracker">
                  <Button size="lg" variant="secondary" className="text-navy-700 border-white/20 hover:bg-white/10 hover:text-white"
>
                    Track Processing Times
                    <Clock className="w-5 h-5" />
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 mt-8 pt-8 border-t border-navy-500">
                <div className="flex items-center gap-2 text-sm text-navy-200">
                  <CheckCircle className="w-4 h-4 text-gold-500" />
                  Government Sources
                </div>
                <div className="flex items-center gap-2 text-sm text-navy-200">
                  <CheckCircle className="w-4 h-4 text-gold-500" />
                  Updated Daily
                </div>
                <div className="flex items-center gap-2 text-sm text-navy-200">
                  <CheckCircle className="w-4 h-4 text-gold-500" />
                  Expert Verified
                </div>
              </div>
            </div>

            {/* Right: Document Preview Card */}
            <div className="hidden lg:block">
              <Card className="bg-white shadow-2xl border-0">
                <CardBody className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-navy-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-navy-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy-700">Visa Subclass 189</p>
                      <p className="text-sm text-neutral-500">Skilled Independent</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-neutral-100">
                      <span className="text-neutral-600">Processing Time</span>
                      <span className="font-semibold text-navy-700">6-12 months</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-neutral-100">
                      <span className="text-neutral-600">Visa Cost</span>
                      <span className="font-semibold text-navy-700">From AUD $4,115</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-neutral-600">Validity</span>
                      <span className="font-semibold text-navy-700">Permanent</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-navy-50 border-l-4 border-navy-500">
                    <p className="text-sm text-navy-700">
                      <strong>Did you know?</strong> 189 visas have a 94% grant rate when applications are properly prepared.
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-navy-700 border-b border-navy-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-navy-600">
            {[
              { value: `${stats.visas}+`, label: 'Visa Subclasses' },
              { value: '100+', label: 'Processing Reports' },
              { value: '50+', label: 'Verified Lawyers' },
              { value: '10,000+', label: 'Users Helped' },
            ].map((stat, index) => (
              <div key={index} className="py-8 text-center">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-navy-200 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-heading font-bold text-navy-700 mb-2">Find Your Visa</h2>
            <p className="text-neutral-600">Search by name, subclass, or category</p>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-neutral-400" />
            </div>
            <Link to="/visas">
              <input
                type="text"
                placeholder="e.g., Skilled Independent, Subclass 189, Partner Visa..."
                className="w-full pl-12 pr-32 py-4 bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 rounded cursor-pointer"
                readOnly
              />
            </Link>
            <div className="absolute inset-y-2 right-2">
              <Link to="/visas">
                <Button size="sm">
                  Search
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {['Work', 'Family', 'Student', 'Visitor', 'Business'].map((tag) => (
              <Link
                key={tag}
                to={`/visas?category=${tag.toLowerCase()}`}
                className="px-3 py-1 bg-white border border-neutral-200 text-sm text-neutral-600 hover:border-navy-300 hover:text-navy-700 transition-colors rounded"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards - 3 Column */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-navy-700 mb-4">Everything You Need</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Comprehensive tools and resources to guide you through your Australian visa journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: 'Visa Search Engine',
                description: 'Find the right visa for your situation. Search by name, subclass, or category with our comprehensive database.',
                link: '/visas',
                linkText: 'Start Searching',
                accent: 'navy'
              },
              {
                icon: BarChart3,
                title: 'Processing Time Tracker',
                description: 'Access real-world processing times crowdsourced from actual applicants and verified by migration experts.',
                link: '/tracker',
                linkText: 'View Data',
                accent: 'gold'
              },
              {
                icon: BookOpen,
                title: 'Premium Guides',
                description: 'Unlock step-by-step application guides, document checklists, and expert tips for just $49.',
                link: '/visas',
                linkText: 'Browse Guides',
                accent: 'navy'
              },
            ].map((feature, index) => (
              <Card key={index} hover accent="left" className="h-full">
                <CardBody className="space-y-4">
                  <div className={`w-12 h-12 flex items-center justify-center ${
                    feature.accent === 'gold' ? 'bg-gold-50' : 'bg-navy-50'
                  }`}>
                    <feature.icon className={`w-6 h-6 ${
                      feature.accent === 'gold' ? 'text-gold-600' : 'text-navy-600'
                    }`} />
                  </div>
                  
                  <h3 className="text-xl font-heading font-bold text-navy-700">{feature.title}</h3>
                  
                  <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
                  
                  <div className="pt-4">
                    <Link 
                      to={feature.link} 
                      className="inline-flex items-center text-navy-600 font-semibold hover:text-navy-700"
                    >
                      {feature.linkText}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="gold" className="mb-4">Why Choose VisaBuild</Badge>
              <h2 className="text-3xl font-heading font-bold text-navy-700 mb-6">
                Trusted by Thousands of Applicants
              </h2>
              
              <div className="space-y-4">
                {[
                  { icon: Shield, title: 'Official Information', desc: 'Sourced directly from Australian Government databases' },
                  { icon: FileCheck, title: 'Expert Verification', desc: 'All content reviewed by registered migration agents' },
                  { icon: Globe, title: 'Global Access', desc: 'Available 24/7 from anywhere in the world' },
                  { icon: Phone, title: 'Professional Support', desc: 'Connect with verified migration lawyers' },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-10 h-10 bg-white border border-navy-200 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-navy-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-navy-700">{item.title}</h4>
                      <p className="text-sm text-neutral-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 border-l-4 border-gold-500">
              <blockquote className="text-lg text-neutral-700 italic mb-6">
                "The processing time tracker gave me peace of mind when my visa application was taking longer than expected. 
                Knowing the median wait time helped me stay patient during the process."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-navy-100 flex items-center justify-center">
                  <span className="font-bold text-navy-600">SJ</span>
                </div>
                <div>
                  <p className="font-semibold text-navy-700">Sarah Johnson</p>
                  <p className="text-sm text-neutral-500">Software Engineer, UK → Australia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-navy-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          
          <p className="text-lg text-navy-100 mb-8">
            Join thousands of successful applicants who navigated the Australian immigration system with VisaBuild.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/visas">
              <Button size="lg" variant="accent">
                Find Your Visa
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/quiz">
              <Button size="lg" variant="secondary" className="text-navy-700">
                Take Eligibility Quiz
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
