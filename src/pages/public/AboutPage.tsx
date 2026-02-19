import { Link } from 'react-router-dom';
import { Target, Users, Shield, Heart, Globe, Award } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Our Mission
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            To make Australian immigration transparent, affordable, and accessible 
            for everyone. We believe visa information should be clear, not confusing.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
            Why We Built VisaBuild
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-4">
              Every year, millions of people dream of moving to Australia — for work, 
              study, family, or a fresh start. But the immigration process is 
              notoriously complex, expensive, and opaque.
            </p>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-4">
              We started VisaBuild after watching friends and family struggle through 
              the visa application process. They spent thousands on lawyers, waited 
              months for basic information, and were often left in the dark about 
              their application status.
            </p>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-4">
              We thought: There has to be a better way.
            </p>
            <p className="text-lg text-neutral-600 dark:text-neutral-300">
              So we built it. A platform where you can search all 100+ Australian 
              visa subclasses, see real processing times from actual applicants, 
              access step-by-step guides, and connect with verified lawyers when 
              you need help — all in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-neutral-50 dark:bg-neutral-800/50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white text-center mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardBody className="text-center p-8">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                  Transparency
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Real processing times. Clear pricing. No hidden fees. No surprises.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center p-8">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                  Community
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Powered by people helping people. Share your journey, learn from others.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center p-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                  Trust
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  All lawyers verified. All data sourced from official channels.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary-600 mb-2">100+</p>
              <p className="text-neutral-600 dark:text-neutral-400">Visa Subclasses</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary-600 mb-2">50K+</p>
              <p className="text-neutral-600 dark:text-neutral-400">Tracker Entries</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary-600 mb-2">500+</p>
              <p className="text-neutral-600 dark:text-neutral-400">Verified Lawyers</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary-600 mb-2">$2M+</p>
              <p className="text-neutral-600 dark:text-neutral-400">Saved in Legal Fees</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-neutral-50 dark:bg-neutral-800/50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
            Join Us
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8 max-w-2xl mx-auto">
            We're a small team with a big mission. If you believe immigration 
            should be simpler, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to="/careers"
              className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 rounded-xl font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            >
              View Careers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
