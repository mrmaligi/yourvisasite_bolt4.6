import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  ArrowRight, 
  Users, 
  Clock, 
  Star,
  CheckCircle,
  Globe,
  Briefcase,
  Heart,
  GraduationCap
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { supabase } from '../../lib/supabase';

// Layout container component - updated for deployment
const ContentContainer = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const visaCategories = [
  { name: 'Partner Visas', icon: Heart, count: 4, color: 'bg-rose-500', path: '/visas?category=partner' },
  { name: 'Skilled Visas', icon: Briefcase, count: 6, color: 'bg-blue-500', path: '/visas?category=skilled' },
  { name: 'Student Visas', icon: GraduationCap, count: 3, color: 'bg-green-500', path: '/visas?category=student' },
  { name: 'Visitor Visas', icon: Globe, count: 5, color: 'bg-purple-500', path: '/visas?category=visitor' },
];

const stats = [
  { value: '86+', label: 'Visa Types', icon: Globe },
  { value: '500+', label: 'Verified Lawyers', icon: Users },
  { value: '98%', label: 'Success Rate', icon: CheckCircle },
  { value: '24/7', label: 'Support', icon: Clock },
];

const testimonials = [
  {
    name: 'Sarah & Michael',
    role: 'Partner Visa Granted',
    content: 'VisaBuild made the complex partner visa process so simple. Highly recommend!',
    rating: 5
  },
  {
    name: 'James Chen',
    role: 'Skilled Visa Granted',
    content: 'Found an amazing lawyer through VisaBuild. The platform is incredibly user-friendly.',
    rating: 5
  },
  {
    name: 'Priya Sharma',
    role: 'Student to PR pathway',
    content: 'From student visa to permanent residency, VisaBuild guided me through every step.',
    rating: 5
  }
];

export function HomeV2() {
  const navigate = useNavigate();
  const [visaCount, setVisaCount] = useState(86);

  useEffect(() => {
    supabase.from('visas').select('id', { count: 'exact', head: true })
      .eq('is_active', true)
      .then(({ count }) => {
        if (count) setVisaCount(count);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl" />
        </div>

        <ContentContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8">
              <Star className="w-4 h-4" />
              <span>The modern way to migrate to Australia</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">
              Navigate Australian Visas
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-amber-500">
                With Confidence
              </span>
            </h1>

            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
              Join thousands of applicants using our data-driven tools, transparent processing times, 
              and expert-verified premium guides to secure their future.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/visas')}
                className="shadow-xl shadow-blue-600/20"
              >
                Find Your Visa
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/lawyers')}
              >
                Find a Lawyer
              </Button>
            </div>
          </motion.div>
        </ContentContainer>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-y border-slate-100">
        <ContentContainer>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </ContentContainer>
      </section>

      {/* Visa Categories */}
      <section className="py-24">
        <ContentContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Explore Visa Categories
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Find the right visa for your situation with our comprehensive guides
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visaCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={category.path}>
                  <ModernCard className="h-full group cursor-pointer p-6">
                    <div className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                      <category.icon className="w-7 h-7" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{category.name}</h3>
                    <p className="text-slate-600 mb-4">{category.count} visa types</p>
                    
                    <div className="flex items-center text-blue-600 font-medium">
                      Explore
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </ModernCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </ContentContainer>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <ContentContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-slate-600">See what our customers say about their experience</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ModernCard className="p-6 h-full">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  
                  <p className="text-slate-700 mb-6 italic">"{testimonial.content}""</p>
                  
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </ModernCard>
              </motion.div>
            ))}
          </div>
        </ContentContainer>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-700">
        <ContentContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of successful applicants who made Australia their home with VisaBuild.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => navigate('/register')}
              >
                Get Started Free
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10"
                onClick={() => navigate('/visas')}
              >
                Browse Visas
              </Button>
            </div>
          </motion.div>
        </ContentContainer>
      </section>
    </div>
  );
}

export default HomeV2;
