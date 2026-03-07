import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Globe,
  Heart,
  Briefcase,
  GraduationCap,
  Users,
  ArrowRight,
  Clock,
  DollarSign,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import type { Visa } from '../../types/database';
import { createVisaSlug } from '../../lib/url-utils';

// Simple container components
const ContentContainer = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const PageHeader = ({ title, description }: { title: string; description?: string }) => (
  <div className="text-center mb-12">
    <h1 className="text-4xl font-bold text-slate-900 mb-4">{title}</h1>
    {description && <p className="text-lg text-slate-600 max-w-2xl mx-auto">{description}</p>}
  </div>
);

const categories = [
  { id: 'all', name: 'All Visas', icon: Globe },
  { id: 'partner', name: 'Partner', icon: Heart, count: 4 },
  { id: 'skilled', name: 'Skilled', icon: Briefcase, count: 6 },
  { id: 'student', name: 'Student', icon: GraduationCap, count: 3 },
  { id: 'family', name: 'Family', icon: Users, count: 8 },
  { id: 'business', name: 'Business', icon: Briefcase, count: 4 },
];

export function VisaSearchModern() {
  const [visas, setVisas] = useState<Visa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchVisas();
  }, []);

  const fetchVisas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('visas')
      .select('*')
      .eq('is_active', true)
      .eq('country', 'Australia');

    if (!error && data) {
      setVisas(data);
    }
    setLoading(false);
  };

  const filteredVisas = useMemo(() => {
    return visas.filter(visa => {
      const matchesSearch = 
        visa.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visa.subclass.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = 
        selectedCategory === 'all' || visa.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [visas, searchQuery, selectedCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <PageHeader
        title="Find Your Australian Visa"
        subtitle="Explore 86+ visa options with detailed guides and processing times"
      >
        <div className="max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by visa name or subclass..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-slate-200 focus:border-blue-500"
            />
          </div>
        </div>
      </PageHeader>

      <ContentContainer>
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.name}
                {cat.count && (
                  <span className="ml-1 text-xs opacity-80">({cat.count})</span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-slate-600">
            Showing <span className="font-semibold text-slate-900">{filteredVisas.length}</span> visas
          </p>
        </div>

        {/* Visa Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredVisas.map((visa) => (
                <motion.div key={visa.id} variants={itemVariants}>
                  <Link to={`/visas/${createVisaSlug(visa.name, visa.subclass)}`}>
                    <ModernCard className="h-full group cursor-pointer">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                            visa.category === 'partner' ? 'bg-rose-500' :
                            visa.category === 'skilled' ? 'bg-blue-500' :
                            visa.category === 'student' ? 'bg-green-500' :
                            visa.category === 'business' ? 'bg-amber-500' :
                            'bg-purple-500'
                          }`}>
                            {visa.subclass.split('/')[0].slice(0, 3)}
                          </div>
                          
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Bookmark className="w-5 h-5 text-slate-400 hover:text-blue-600" />
                          </button>
                        </div>

                        <div className="mb-4">
                          <Badge className="mb-2">{visa.subclass}</Badge>
                          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {visa.name}
                          </h3>
                          <p className="text-slate-600 text-sm line-clamp-2">
                            {visa.summary}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <div className="flex gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {visa.processing_time || 'Varies'}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {visa.cost_aud || 'Free'}
                            </span>
                          </div>
                          
                          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </ModernCard>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredVisas.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No visas found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        )}
      </ContentContainer>
    </div>
  );
}

export default VisaSearchModern;
