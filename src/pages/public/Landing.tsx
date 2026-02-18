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
  Phone
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { QuickCallBanner } from '../../components/QuickCallBanner';
import { YouTubeFeed } from '../../components/YouTubeFeed';

export function Landing() {
  const [stats, setStats] = useState({
    visas: 0,
    entries: 0,
    lawyers: 0
  });

  useEffect(() => {
    // Fetch real stats
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
    <div className="bg-white dark:bg-neutral-900 transition-colors duration-300">
      <QuickCallBanner />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-neutral-900 py-24 sm:py-32">
        <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 to-neutral-800" />
            <div className="h-full w-full bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
            Navigate Australian Immigration <br className="hidden sm:block" />
            <span className="text-primary-400">with Confidence</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto mb-10">
            {stats.visas}+ visa subclasses. Expert guides. Real processing times.
            The most transparent platform for your Australian visa journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/visas">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                Search Visas
                <Search className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/lawyers?filter=available">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 bg-emerald-600 hover:bg-emerald-700 text-white border-transparent">
                Quick Call
                <Phone className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/tracker">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-lg px-8 bg-white/10 text-white border-white/20 hover:bg-white/20">
                Track Processing Times
                <Clock className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary-50 dark:bg-primary-900/10 border-y border-primary-100 dark:border-primary-900/20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-primary-200/50 dark:divide-primary-800/50">
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary-700 dark:text-primary-400">{stats.visas}+</p>
              <p className="text-sm font-medium text-primary-600 dark:text-primary-300">Visa Subclasses</p>
            </div>
            <div className="space-y-1 pl-4">
              <p className="text-3xl font-bold text-primary-700 dark:text-primary-400">19</p>
              <p className="text-sm font-medium text-primary-600 dark:text-primary-300">Document Categories</p>
            </div>
            <div className="space-y-1 pl-4">
              <p className="text-3xl font-bold text-primary-700 dark:text-primary-400">Real</p>
              <p className="text-sm font-medium text-primary-600 dark:text-primary-300">Processing Data</p>
            </div>
            <div className="space-y-1 pl-4">
              <p className="text-3xl font-bold text-primary-700 dark:text-primary-400">Expert</p>
              <p className="text-sm font-medium text-primary-600 dark:text-primary-300">Lawyers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-24 bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Everything you need to succeed</h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
              We combine data, technology, and legal expertise to simplify your migration journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 dark:bg-neutral-800 dark:border-neutral-700">
              <CardBody className="p-8 space-y-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Visa Search Engine</h3>
                <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Instantly find the right visa for your situation. Search by name, subclass, or category with our comprehensive database of 78+ Australian visas.
                </p>
                <div className="pt-4">
                  <Link to="/visas" className="text-blue-600 font-medium hover:underline inline-flex items-center">
                    Start Searching <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </CardBody>
            </Card>

            <Card className="h-full hover:shadow-lg transition-shadow duration-300 dark:bg-neutral-800 dark:border-neutral-700">
              <CardBody className="p-8 space-y-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Processing Time Tracker</h3>
                <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Stop guessing. Access real-world processing times crowdsourced from thousands of actual applicants and verified by lawyers.
                </p>
                <div className="pt-4">
                  <Link to="/tracker" className="text-purple-600 font-medium hover:underline inline-flex items-center">
                    View Data <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </CardBody>
            </Card>

            <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-primary-200 dark:border-primary-900/50 dark:bg-neutral-800">
              <CardBody className="p-8 space-y-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Premium Guides</h3>
                <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Unlock step-by-step application guides, document checklists, and expert tips for just $49. Save thousands on legal fees.
                </p>
                <div className="pt-4">
                  <span className="text-primary-600 font-medium inline-flex items-center">
                    Available on Visa Pages <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      <YouTubeFeed />

      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-neutral-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-neutral-900 dark:text-neutral-100 mb-16">Trusted by applicants</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "The processing time tracker gave me peace of mind when my 189 visa was taking longer than expected.",
                author: "Sarah J.",
                role: "Software Engineer from UK"
              },
              {
                quote: "The premium guide for the Partner Visa was worth every cent. The document checklist was a lifesaver.",
                author: "Michael & Chen",
                role: "Applicants from China"
              },
              {
                quote: "Finally a site that explains visa requirements in plain English. Highly recommended!",
                author: "Priya R.",
                role: "Student from India"
              }
            ].map((t, i) => (
              <div key={i} className="bg-neutral-50 dark:bg-neutral-800 p-8 rounded-2xl border border-neutral-100 dark:border-neutral-700 transition-colors duration-300">
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 mb-6 italic">"{t.quote}"</p>
                <div>
                  <p className="font-bold text-neutral-900 dark:text-neutral-100">{t.author}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Your path to Australian permanent residency starts here.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="absolute top-12 left-0 w-full h-0.5 bg-neutral-800 hidden md:block" />

            {[
              { title: "Search", desc: "Find your visa subclass", icon: Search },
              { title: "Unlock", desc: "Get the premium guide", icon: FileText },
              { title: "Apply", desc: "Submit with confidence", icon: CheckCircle },
            ].map((step, i) => (
              <div key={i} className="relative z-10 text-center">
                <div className="w-24 h-24 bg-neutral-800 rounded-full border-4 border-neutral-900 mx-auto flex items-center justify-center mb-6">
                  <step.icon className="w-10 h-10 text-primary-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-neutral-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-primary-600 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to start your application?
          </h2>
          <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of others who have successfully navigated the Australian immigration system with VisaBuild.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/visas">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-neutral-100 w-full sm:w-auto">
                Find My Visa
              </Button>
            </Link>
            <Link to="/tracker">
              <Button size="lg" variant="secondary" className="bg-primary-700 text-white border-primary-500 hover:bg-primary-800 w-full sm:w-auto">
                Check Processing Times
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
