import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Scale, FileCheck, BookOpen, ArrowRight, Globe, Shield, Clock, Users, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import type { NewsArticle } from '../../types/database';

export function Landing() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [counts, setCounts] = useState({ entries: 0, lawyers: 0, visas: 0 });

  useEffect(() => {
    supabase
      .from('news_articles')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(3)
      .then(({ data }) => setNews(data || []));

    Promise.all([
      supabase.from('tracker_entries').select('id', { count: 'exact', head: true }),
      supabase.from('visas').select('id', { count: 'exact', head: true }).eq('is_active', true),
    ]).then(([entries, visas]) => {
      setCounts({
        entries: entries.count || 0,
        lawyers: 0,
        visas: visas.count || 0,
      });
    });
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-neutral-950">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary-500/5 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 md:pt-28 md:pb-36">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.06] border border-white/10 rounded-full text-primary-300 text-sm font-medium mb-8 backdrop-blur-sm">
              <Globe className="w-4 h-4" />
              <span>Global Mobility Platform</span>
              <ChevronRight className="w-3.5 h-3.5 text-primary-400/60" />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.08] text-white mb-6 tracking-tight">
              Navigate visa processing
              <br />
              with <span className="text-gradient">transparency</span>
            </h1>

            <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl leading-relaxed">
              Real processing times from real applicants. Expert guides and verified
              lawyers to help you through every step of your immigration journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/tracker">
                <Button size="lg" className="w-full sm:w-auto shadow-glow-primary">
                  Check Processing Times
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/visas">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-white/[0.06] border-white/10 text-white hover:bg-white/10 hover:border-white/20">
                  Browse Visas
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-16 md:mt-20 grid grid-cols-3 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06] max-w-xl animate-fade-in-up stagger-2" style={{ animationFillMode: 'both', opacity: 0 }}>
            {[
              { value: counts.entries.toLocaleString(), label: 'Data Points' },
              { value: counts.visas.toString(), label: 'Visa Types' },
              { value: counts.lawyers.toString(), label: 'Verified Lawyers' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.03] backdrop-blur-sm px-6 py-5 text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-neutral-500 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary-600 tracking-wide uppercase mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Three steps to clarity</h2>
            <p className="text-neutral-500 max-w-lg mx-auto text-lg">Get from uncertainty to action in minutes, not weeks.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { icon: BarChart3, title: 'Track processing times', desc: 'Browse real data from applicants worldwide or submit your own processing experience.', step: '01' },
              { icon: BookOpen, title: 'Unlock expert guides', desc: 'Access step-by-step premium guides with document checklists tailored to your visa type.', step: '02' },
              { icon: Scale, title: 'Connect with lawyers', desc: 'Book consultations with verified immigration lawyers who specialize in your visa.', step: '03' },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center group-hover:bg-primary-100 transition-colors duration-300">
                    <item.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <span className="text-5xl font-extrabold text-neutral-100 leading-none select-none">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary-600 tracking-wide uppercase mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Everything you need</h2>
            <p className="text-neutral-500 max-w-lg mx-auto text-lg">Comprehensive tools for navigating the visa process with confidence.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BarChart3, title: 'Processing Tracker', desc: 'Crowdsourced, weighted processing times updated in real time.', color: 'bg-sky-50 text-sky-600' },
              { icon: Scale, title: 'Verified Lawyers', desc: 'Vetted immigration professionals ready to help.', color: 'bg-emerald-50 text-emerald-600' },
              { icon: FileCheck, title: 'Document Helper', desc: 'Upload and organize your documents with guided checklists.', color: 'bg-amber-50 text-amber-600' },
              { icon: BookOpen, title: 'Premium Guides', desc: 'Expert visa guides with step-by-step instructions.', color: 'bg-primary-50 text-primary-600' },
            ].map((feature, i) => (
              <Card key={i} hover className="p-6 group">
                <CardBody className="p-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${feature.color} transition-transform duration-300 group-hover:scale-110`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{feature.desc}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Data you can trust', desc: 'Every data point is weighted by source reliability. Lawyers, verified users, and anonymous submissions all contribute differently.' },
              { icon: Clock, title: 'Always up to date', desc: 'Our EWMA algorithm prioritizes recent data, so you always see the most relevant processing trends.' },
              { icon: Users, title: 'Community driven', desc: 'Join thousands of applicants sharing their real experiences to build transparency in immigration.' },
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl bg-neutral-50 border border-neutral-100 hover:border-neutral-200 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center mb-5 shadow-sm">
                  <item.icon className="w-5 h-5 text-neutral-700" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {news.length > 0 && (
        <section className="py-24 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-sm font-semibold text-primary-600 tracking-wide uppercase mb-3">Updates</p>
                <h2 className="text-3xl font-bold text-neutral-900">Latest news</h2>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {news.map((article) => (
                <Card key={article.id} hover className="overflow-hidden group">
                  {article.image_url && (
                    <div className="overflow-hidden">
                      <img
                        src={article.image_url}
                        alt=""
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <CardBody>
                    <p className="text-xs text-neutral-400 mb-2.5 font-medium">
                      {article.published_at && new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">{article.title}</h3>
                    <p className="text-sm text-neutral-500 line-clamp-3">{article.body}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-700 py-24">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start your visa journey today</h2>
            <p className="text-primary-100 mb-10 text-lg max-w-xl mx-auto">
              Join thousands of applicants who trust VisaBuild for transparent, reliable immigration data.
            </p>
            <Link to="/tracker">
              <Button size="lg" className="bg-white text-primary-700 hover:bg-neutral-100 shadow-elevated">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
