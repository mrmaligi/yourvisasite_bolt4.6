import { Link } from 'react-router-dom';
import { ArrowRight, Search, FileText, CheckCircle, BarChart3, BookOpen, Sparkles, Shield, Clock, Users, PlayCircle, Star } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { YouTubeFeed } from '../../components/YouTubeFeed';

export function Landing() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-400/20 blur-[120px] mix-blend-multiply dark:mix-blend-lighten animate-pulse-slow" />
          <div className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-accent-400/20 blur-[120px] mix-blend-multiply dark:mix-blend-lighten animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-8 border border-primary-100 dark:border-primary-800/50 shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>The modern way to migrate to Australia</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-neutral-900 dark:text-white mb-8 tracking-tight leading-[1.1]">
              Navigate Australian Visas <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500 dark:from-primary-400 dark:to-accent-400">
                With Confidence
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Join thousands of applicants using our data-driven tools, transparent processing times, and expert-verified premium guides to secure their future.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/quiz" className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-14 text-lg px-8 shadow-glow-primary hover:scale-105 transition-transform duration-300">
                  Find Your Visa Match
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/tracker" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full h-14 text-lg px-8 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 hover:bg-white dark:hover:bg-neutral-800">
                  Check Real Processing Times
                </Button>
              </Link>
            </div>

            <div className="mt-16 pt-8 border-t border-neutral-200/60 dark:border-neutral-800/60 max-w-4xl mx-auto">
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-6 uppercase tracking-wider">Trusted by applicants worldwide</p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                 {/* Mock logos for visual weight */}
                 <div className="text-xl font-bold flex items-center gap-2"><Shield className="w-6 h-6"/> VerifiedData</div>
                 <div className="text-xl font-bold flex items-center gap-2"><Users className="w-6 h-6"/> CommunityLed</div>
                 <div className="text-xl font-bold flex items-center gap-2"><Clock className="w-6 h-6"/> RealTime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-24 bg-white dark:bg-neutral-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6 tracking-tight">Everything you need to succeed</h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400">
              We combine community data, technology, and legal expertise to simplify your migration journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="h-full border-0 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-white dark:hover:bg-neutral-800 transition-all duration-300 hover:shadow-elevated group overflow-hidden">
              <CardBody className="p-10 space-y-6 relative">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                  <Search className="w-32 h-32" />
                </div>
                <div className="w-14 h-14 bg-white dark:bg-neutral-900 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-sm">
                  <Search className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">Visa Search Engine</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
                    Instantly find the right visa for your situation. Search by name, subclass, or category with our comprehensive database of 78+ Australian visas.
                  </p>
                </div>
                <div className="pt-4">
                  <Link to="/visas" className="text-primary-600 dark:text-primary-400 font-semibold text-lg hover:text-primary-700 dark:hover:text-primary-300 inline-flex items-center group-hover:gap-3 transition-all">
                    Start Searching <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </CardBody>
            </Card>

            <Card className="h-full border-0 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-white dark:hover:bg-neutral-800 transition-all duration-300 hover:shadow-elevated group overflow-hidden">
              <CardBody className="p-10 space-y-6 relative">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                  <BarChart3 className="w-32 h-32" />
                </div>
                <div className="w-14 h-14 bg-white dark:bg-neutral-900 rounded-2xl flex items-center justify-center text-accent-600 dark:text-accent-400 shadow-sm">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">Processing Tracker</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
                    Stop guessing. Access real-world processing times crowdsourced from thousands of actual applicants and verified by lawyers.
                  </p>
                </div>
                <div className="pt-4">
                  <Link to="/tracker" className="text-accent-600 dark:text-accent-400 font-semibold text-lg hover:text-accent-700 dark:hover:text-accent-300 inline-flex items-center group-hover:gap-3 transition-all">
                    View Live Data <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </CardBody>
            </Card>

            <Card className="h-full border-0 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-white dark:hover:bg-neutral-800 transition-all duration-300 hover:shadow-elevated group overflow-hidden ring-1 ring-primary-500/20">
              <CardBody className="p-10 space-y-6 relative">
                 <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                  <BookOpen className="w-32 h-32" />
                </div>
                <div className="w-14 h-14 bg-primary-600 dark:bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-glow-primary">
                  <BookOpen className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">Premium Guides</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
                    Unlock step-by-step application guides, document checklists, and expert tips. Save thousands on legal fees.
                  </p>
                </div>
                <div className="pt-4">
                  <span className="text-primary-600 dark:text-primary-400 font-semibold text-lg inline-flex items-center">
                    Available on Visa Pages <ArrowRight className="w-5 h-5 ml-2 opacity-50" />
                  </span>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className="py-24 bg-neutral-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">Your journey to residency</h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-light">
              We've mapped out the exact steps you need to take to succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative max-w-5xl mx-auto">
            <div className="absolute top-12 left-[16.6%] right-[16.6%] h-0.5 bg-neutral-800 hidden md:block" />

            {[
              { title: "Find", desc: "Use our search engine to find the exact subclass for your situation.", icon: Search },
              { title: "Prepare", desc: "Unlock premium guides and gather the exact documents required.", icon: FileText },
              { title: "Apply", desc: "Lodge your application and track real-time processing data.", icon: CheckCircle },
            ].map((step, i) => (
              <div key={i} className="relative z-10 text-center group">
                <div className="w-24 h-24 bg-neutral-900 rounded-2xl border border-neutral-800 mx-auto flex items-center justify-center mb-8 transform group-hover:-translate-y-2 transition-transform duration-300 shadow-xl">
                  <step.icon className="w-10 h-10 text-primary-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{step.title}</h3>
                <p className="text-neutral-400 text-lg px-4">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">Loved by applicants</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">Join over 10,000 successful immigrants.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "The processing time tracker gave me incredible peace of mind when my 189 visa was taking longer than expected.",
                author: "Sarah J.",
                role: "Software Engineer from UK"
              },
              {
                quote: "The premium guide for the Partner Visa was worth every cent. The document checklist was an absolute lifesaver.",
                author: "Michael & Chen",
                role: "Applicants from China"
              },
              {
                quote: "Finally a site that explains visa requirements in plain English instead of legal jargon. Highly recommended!",
                author: "Priya R.",
                role: "Student from India"
              }
            ].map((t, i) => (
              <div key={i} className="bg-white dark:bg-neutral-800 p-8 rounded-3xl border border-neutral-200/60 dark:border-neutral-700/60 shadow-soft hover:shadow-elevated transition-all duration-300">
                <div className="flex gap-1 text-accent-500 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-neutral-700 dark:text-neutral-300 mb-8 text-lg leading-relaxed font-medium">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-lg">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900 dark:text-white">{t.author}</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <YouTubeFeed />

      {/* Bottom CTA */}
      <section className="relative py-32 bg-primary-600 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">
            Ready to start your application?
          </h2>
          <p className="text-primary-100 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Join thousands of others who have successfully navigated the Australian immigration system with VisaBuild.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/visas">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-neutral-50 hover:scale-105 transition-all w-full sm:w-auto h-16 px-10 text-lg shadow-xl">
                Find My Visa
              </Button>
            </Link>
            <Link to="/tracker">
              <Button size="lg" variant="outline" className="bg-primary-700/50 text-white border-primary-400 hover:bg-primary-700 backdrop-blur-sm w-full sm:w-auto h-16 px-10 text-lg transition-all">
                Check Processing Times
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
