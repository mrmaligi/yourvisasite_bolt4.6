import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Shield, 
  Users, 
  FileCheck, 
  Clock, 
  Star,
  ChevronRight,
  Heart,
  Briefcase,
  GraduationCap,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileCheck,
      title: 'Complete Visa Guides',
      description: 'Step-by-step instructions for all Australian visa types with document checklists and templates.',
      color: 'blue'
    },
    {
      icon: Users,
      title: 'Expert Lawyers',
      description: 'Connect with verified migration lawyers for consultations and professional advice.',
      color: 'green'
    },
    {
      icon: Clock,
      title: 'Real-time Tracking',
      description: 'Track your application progress and get updates on processing times and requirements.',
      color: 'purple'
    },
    {
      icon: Shield,
      title: 'Secure & Trusted',
      description: 'Your data is protected with bank-level encryption. Trusted by 10,000+ applicants.',
      color: 'amber'
    }
  ];

  const visaCategories = [
    { 
      name: 'Partner Visas', 
      icon: Heart, 
      count: '4 visa types',
      description: 'Reunite with your loved ones',
      color: 'bg-rose-50 text-rose-600',
      path: '/visas/partner'
    },
    { 
      name: 'Skilled Visas', 
      icon: Briefcase, 
      count: '6 visa types',
      description: 'Work in Australia',
      color: 'bg-blue-50 text-blue-600',
      path: '/visas/skilled'
    },
    { 
      name: 'Student Visas', 
      icon: GraduationCap, 
      count: '3 visa types',
      description: 'Study at top universities',
      color: 'bg-green-50 text-green-600',
      path: '/visas/student'
    },
    { 
      name: 'Visitor Visas', 
      icon: Globe, 
      count: '5 visa types',
      description: 'Visit Australia',
      color: 'bg-purple-50 text-purple-600',
      path: '/visas/visitor'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Happy Customers' },
    { value: '500+', label: 'Verified Lawyers' },
    { value: '98%', label: 'Success Rate' },
    { value: '4.9/5', label: 'Average Rating' }
  ];

  const testimonials = [
    {
      name: 'Sarah & Michael',
      role: 'Partner Visa Granted',
      content: 'VisaBuild made the complex partner visa process so simple. The step-by-step guide and document checklists were invaluable.',
      rating: 5
    },
    {
      name: 'James Chen',
      role: 'Skilled Visa Granted',
      content: 'Found an amazing lawyer through VisaBuild who helped me secure my 189 visa. The platform is incredibly user-friendly.',
      rating: 5
    },
    {
      name: 'Priya Sharma',
      role: 'Student to PR pathway',
      content: 'From student visa to permanent residency, VisaBuild guided me through every step. Highly recommend the premium guides!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                🎉 Over 10,000 successful visa applications
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your Journey to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                  Australia Starts Here
                </span>
              </h1>
              
              <p className="text-xl text-blue-100 max-w-xl">
                Complete visa guides, expert lawyers, and powerful tools to help you 
                navigate the Australian immigration system with confidence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/visas')}
                  className="bg-white text-blue-900 hover:bg-blue-50 font-semibold px-8"
                >
                  Find Your Visa
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/lawyers')}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Find a Lawyer
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 border-2 border-blue-900 flex items-center justify-center text-sm font-bold"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-blue-200 text-sm">
                  <span className="font-bold text-white">500+ lawyers</span> ready to help
                </p>
              </div>
            </div>

            {/* Hero Image/Graphic */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Visa Application Ready</p>
                      <p className="text-sm text-blue-200">All documents verified</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {['Application submitted', 'Documents verified', 'Biometrics completed', 'Visa granted'].map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          i < 3 ? 'bg-green-500' : 'bg-white/20'
                        }`}>
                          <i < 3 ? <FileCheck className="w-4 h-4 text-white" /> : <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span className={i < 3 ? '' : 'text-blue-200'}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-gray-900">4.9/5</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Based on 2,000+ reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#f9fafb"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-blue-900">{stat.value}</p>
                <p className="text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visa Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 mb-4">
              Find Your Path
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Visa Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the right visa for your situation with our comprehensive guides
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visaCategories.map((category) => (
              <Card
                key={category.name}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
                onClick={() => navigate(category.path)}
              >
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-2xl ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <category.icon className="w-7 h-7" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{category.count}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => navigate('/visas')}
              variant="outline"
              className="border-2"
            >
              View All 42 Visa Types
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-700 mb-4">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've built the most comprehensive Australian visa platform to help you at every step
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-100 flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-600`} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 md:p-12 text-white text-center">
            <Badge className="bg-white/20 text-white border-0 mb-4">
              Save $3,000+ on Agent Fees
            </Badge>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Our Premium Visa Guides
            </h2>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Complete DIY guides with step-by-step instructions, document checklists, 
              templates, and expert tips. 100% refund if unsuccessful.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/premium')}
                className="bg-white text-amber-600 hover:bg-gray-100 font-semibold px-8"
              >
                Explore Premium Guides
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 text-sm">
              <span className="flex items-center">
                <FileCheck className="w-4 h-4 mr-1" />
                40+ Page Guides
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Lifetime Updates
              </span>
              <span className="flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                100% Guarantee
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-700 mb-4">
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 mb-6 italic">"{testimonial.content}""</p>
                  
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { q: 'How long does a partner visa take?', a: 'Processing times vary. 90% of onshore (820) visas are processed within 14 months, while offshore (309) visas take around 21 months.' },
                { q: 'Do I need a migration agent?', a: 'Not required. Many people successfully apply on their own using our guides. However, complex cases may benefit from professional advice.' },
                { q: 'Can I work while waiting?', a: 'Yes. Once your temporary partner visa is granted, you have full work rights in Australia.' },
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/faq" className="text-blue-600 hover:underline font-medium">
                View All FAQs →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-blue-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          
          <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-8">
            Join thousands of successful applicants who've made Australia their home 
            with VisaBuild's help.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-white text-blue-900 hover:bg-gray-100 font-semibold px-8"
            >
              Create Free Account
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/visas')}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Browse Visas
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
