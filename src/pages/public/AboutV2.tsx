import { Helmet } from 'react-helmet-async';
import { Users, Shield, Globe, Target, Heart, Award, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const stats = [
  { value: '100+', label: 'Visa Types Covered' },
  { value: '500+', label: 'Verified Lawyers' },
  { value: '50K+', label: 'Users Helped' },
  { value: '98%', label: 'Success Rate' }
];

const values = [
  {
    icon: Target,
    title: 'Transparency',
    description: 'Clear, honest information about every visa pathway. No hidden fees, no surprises.'
  },
  {
    icon: Heart,
    title: 'Accessibility',
    description: 'Immigration help should be available to everyone, not just those who can afford expensive lawyers.'
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We partner only with verified professionals and update our content based on official sources.'
  }
];

const team = [
  {
    name: 'Sarah Chen',
    role: 'Founder & CEO',
    bio: 'Former immigration lawyer with 10+ years experience'
  },
  {
    name: 'Michael Torres',
    role: 'Head of Product',
    bio: 'Built products at Atlassian and Canva'
  },
  {
    name: 'Priya Sharma',
    role: 'Legal Director',
    bio: 'MARA-registered agent, former DHA officer'
  },
  {
    name: 'James Wilson',
    role: 'Engineering Lead',
    bio: 'Full-stack developer, visa applicant himself'
  }
];

export function AboutV2() {
  return (
    <>
      <Helmet>
        <title>About Us | VisaBuild</title>
        <meta name="description" content="Learn about VisaBuild's mission to make Australian immigration transparent and accessible." />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Hero - SQUARE */}
        <div className="bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <Badge variant="primary" className="mb-4 bg-blue-600">Our Story</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Making Immigration Simple</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              We believe everyone deserves clear, affordable access to Australian visa information.
            </p>
          </div>
        </div>

        {/* Stats - SQUARE */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-slate-200 p-6 text-center"
              >
                <div className="text-3xl font-bold text-blue-600 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Mission - SQUARE */}
          <div className="bg-white border border-slate-200 p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Why We Built VisaBuild</h2>
                <p className="text-slate-700 mb-4 leading-relaxed">
                  Every year, millions of people dream of moving to Australia — for work, 
                  study, family, or a fresh start. But the immigration process is 
                  notoriously complex, expensive, and opaque.
                </p>
                <p className="text-slate-700 mb-4 leading-relaxed">
                  We started VisaBuild after watching friends and family struggle through 
                  the visa application process, spending thousands on lawyers and waiting 
                  months for basic information.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  We thought: There has to be a better way. So we built it.
                </p>
              </div>
              
              <div className="bg-slate-100 border border-slate-200 p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center flex-shrink-0">1</div>
                    <p className="text-slate-700">Search all 100+ Australian visa types</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center flex-shrink-0">2</div>
                    <p className="text-slate-700">See real processing times from actual applicants</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center flex-shrink-0">3</div>
                    <p className="text-slate-700">Access step-by-step guides and checklists</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center flex-shrink-0">4</div>
                    <p className="text-slate-700">Connect with verified lawyers when needed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values - SQUARE */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Our Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {values.map((value, idx) => (
                <div 
                  key={idx}
                  className="bg-white border border-slate-200 p-6"
                >
                  <div className="w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team - SQUARE */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Meet the Team</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {team.map((member, idx) => (
                <div 
                  key={idx}
                  className="bg-white border border-slate-200 p-4 text-center"
                >
                  <div className="w-16 h-16 bg-slate-200 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl font-bold text-slate-500">{member.name[0]}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900">{member.name}</h3>
                  <p className="text-blue-600 text-sm mb-2">{member.role}</p>
                  <p className="text-slate-600 text-xs">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA - SQUARE */}
          <div className="bg-blue-600 text-white p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              Join thousands of people who've used VisaBuild to navigate their Australian visa application.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => window.location.href = '/visas'}
              >
                Explore Visas
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-blue-700"
                onClick={() => window.location.href = '/contact'}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
