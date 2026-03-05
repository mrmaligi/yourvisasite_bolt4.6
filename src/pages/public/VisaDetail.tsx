import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ExternalLink,
  Clock,
  BookOpen,
  ArrowUpRight,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  AlertCircle,
  TrendingUp,
  Printer,
  CheckCircle,
  FileText,
  Video,
  Download,
  Lock,
  Menu,
  X,
  CheckSquare,
  DollarSign,
  Calendar,
  List,
  Lightbulb,
  Globe
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { VisaDetailSkeleton } from '../../components/ui/Skeleton';
import { ShareButton } from '../../components/ShareButton';
import type { Visa, TrackerStats, TrackerEntry, NewsArticle } from '../../types/database';

interface VisaPremiumContentItem {
  id: string;
  visa_id: string;
  title: string;
  description: string | null;
  content_type: 'guide' | 'checklist' | 'template' | 'document_examples' | 'example_application' | 'video' | 'file';
  content: string | null;
  file_urls: string[] | null;
  is_published: boolean;
  section_number: number | null;
  section_title: string | null;
  tips: string | null;
  created_at: string;
  updated_at: string;
}

const sectionIcons: Record<string, React.ElementType> = {
  'Executive Overview': BookOpen,
  'Eligibility': CheckCircle,
  'Eligibility Requirements': CheckCircle,
  'Application Process': List,
  'Step-by-Step': List,
  'Documents': FileText,
  'Document Checklist': CheckSquare,
  'Costs': DollarSign,
  'Processing': Clock,
  'Processing Times': Clock,
  'Tips': Lightbulb,
  'Mistakes': AlertCircle,
  'Timeline': TrendingUp,
  'Resources': Globe,
};

export function VisaDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [visa, setVisa] = useState<Visa | null>(null);
  const [stats, setStats] = useState<TrackerStats | null>(null);
  const [relatedVisas, setRelatedVisas] = useState<Visa[]>([]);
  const [premiumContent, setPremiumContent] = useState<VisaPremiumContentItem[]>([]);
  const [recentEntries, setRecentEntries] = useState<TrackerEntry[]>([]);
  const [visaNews, setVisaNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);

      // Fetch Visa
      const { data: visaData, error: visaError } = await supabase
        .from('visas')
        .select('*')
        .eq('id', id)
        .single();

      if (visaError) {
        console.error('Error fetching visa:', visaError);
        setLoading(false);
        return;
      }

      setVisa(visaData);

      // Fetch Stats
      const { data: statsData } = await supabase
        .from('tracker_stats')
        .select('*')
        .eq('visa_id', id)
        .maybeSingle();
      setStats(statsData);

      // Fetch Related Visas
      if (visaData) {
        const { data: relatedData } = await supabase
          .from('visas')
          .select('*')
          .eq('category', visaData.category)
          .neq('id', id)
          .limit(3);
        setRelatedVisas(relatedData || []);
      }

      // Fetch Premium Content - ORDERED by section_number
      const { data: contentData } = await supabase
        .from('visa_premium_content')
        .select('*')
        .eq('visa_id', id)
        .eq('is_published', true)
        .order('section_number', { ascending: true });
      
      const sortedContent = contentData || [];
      setPremiumContent(sortedContent);
      
      // Set first section as active
      if (sortedContent.length > 0) {
        setActiveSection(sortedContent[0].id);
      }

      // Fetch Recent Entries
      const { data: entriesData } = await supabase
        .from('tracker_entries')
        .select('*')
        .eq('visa_id', id)
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentEntries(entriesData || []);

      // Fetch Visa-Specific News
      const { data: newsData } = await supabase
        .from('news_articles')
        .select('*')
        .contains('visa_ids', [id])
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(3);
      setVisaNews(newsData || []);

      setLoading(false);
    };

    fetchData();
  }, [id, user]);

  // Handle scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = premiumContent.map(item => document.getElementById(`section-${item.id}`));
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(premiumContent[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [premiumContent]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
      setMobileMenuOpen(false);
    }
  };

  if (loading) {
    return <VisaDetailSkeleton />;
  }

  if (!visa) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Visa not found</h2>
        <Link to="/visas">
            <Button variant="secondary">Back to search</Button>
        </Link>
      </div>
    );
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'document_examples': return FileText;
      case 'file': return Download;
      case 'checklist': return CheckSquare;
      default: return BookOpen;
    }
  };

  const getSectionIcon = (title: string) => {
    for (const [key, Icon] of Object.entries(sectionIcons)) {
      if (title.toLowerCase().includes(key.toLowerCase())) {
        return Icon;
      }
    }
    return FileText;
  };

  // Group content by type for sidebar
  const groupedContent = {
    overview: premiumContent.filter(c => c.section_number === 1),
    eligibility: premiumContent.filter(c => c.section_number === 2),
    process: premiumContent.filter(c => c.section_number === 3 || c.section_number === 4),
    details: premiumContent.filter(c => c.section_number === 5 || c.section_number === 6),
    tips: premiumContent.filter(c => c.section_number === 7 || c.section_number === 8),
    timeline: premiumContent.filter(c => c.section_number === 10),
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/visas" className="flex items-center text-neutral-600 hover:text-neutral-900">
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Back to Visas</span>
              </Link>
              <div className="h-6 w-px bg-neutral-300 hidden sm:block" />
              <div className="flex items-center gap-2">
                <Badge className="text-sm">{visa.subclass}</Badge>
                <span className="font-semibold text-neutral-900 hidden sm:inline">{visa.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <ShareButton title={`Visa Guide: ${visa.name}`} />
              <button
                className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-wrap gap-3 mb-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              Subclass {visa.subclass}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-0 capitalize">
              {visa.category}
            </Badge>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold mb-4">{visa.name}</h1>
          <p className="text-lg lg:text-xl text-primary-100 max-w-3xl">
            {visa.summary}
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <DollarSign className="w-5 h-5 mb-2 text-primary-200" />
              <p className="text-sm text-primary-200">Cost</p>
              <p className="font-semibold text-lg">{visa.cost_aud || 'Varies'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <Clock className="w-5 h-5 mb-2 text-primary-200" />
              <p className="text-sm text-primary-200">Processing</p>
              <p className="font-semibold text-lg">{visa.processing_time_range || 'N/A'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <Calendar className="w-5 h-5 mb-2 text-primary-200" />
              <p className="text-sm text-primary-200">Duration</p>
              <p className="font-semibold text-lg">{visa.duration || 'Permanent'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <ExternalLink className="w-5 h-5 mb-2 text-primary-200" />
              <p className="text-sm text-primary-200">Official</p>
              <a 
                href={visa.official_url || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-lg hover:underline flex items-center gap-1"
              >
                DHA <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className={`
            fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-xl transform transition-transform lg:translate-x-0 lg:static lg:shadow-none lg:bg-transparent lg:w-64 lg:block lg:h-fit lg:sticky lg:top-24
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="h-full overflow-y-auto lg:overflow-visible p-4 lg:p-0">
              {/* Progress */}
              <div className="mb-6 lg:mb-8">
                <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                  Guide Sections
                </h3>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((premiumContent.findIndex(c => c.id === activeSection) + 1) / premiumContent.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  {premiumContent.findIndex(c => c.id === activeSection) + 1} of {premiumContent.length} sections
                </p>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1">
                {groupedContent.overview.map((item) => (
                  <NavItem 
                    key={item.id}
                    item={item}
                    isActive={activeSection === item.id}
                    onClick={() => scrollToSection(item.id)}
                    icon={getSectionIcon(item.title)}
                  />
                ))}
                
                {groupedContent.eligibility.length > 0 && (
                  <NavGroup title="Eligibility">
                    {groupedContent.eligibility.map((item) => (
                      <NavItem 
                        key={item.id}
                        item={item}
                        isActive={activeSection === item.id}
                        onClick={() => scrollToSection(item.id)}
                        icon={getSectionIcon(item.title)}
                      />
                    ))}
                  </NavGroup>
                )}

                {groupedContent.process.length > 0 && (
                  <NavGroup title="Application Process">
                    {groupedContent.process.map((item) => (
                      <NavItem 
                        key={item.id}
                        item={item}
                        isActive={activeSection === item.id}
                        onClick={() => scrollToSection(item.id)}
                        icon={getSectionIcon(item.title)}
                      />
                    ))}
                  </NavGroup>
                )}

                {groupedContent.details.length > 0 && (
                  <NavGroup title="Details">
                    {groupedContent.details.map((item) => (
                      <NavItem 
                        key={item.id}
                        item={item}
                        isActive={activeSection === item.id}
                        onClick={() => scrollToSection(item.id)}
                        icon={getSectionIcon(item.title)}
                      />
                    ))}
                  </NavGroup>
                )}

                {groupedContent.tips.length > 0 && (
                  <NavGroup title="Tips & Resources">
                    {groupedContent.tips.map((item) => (
                      <NavItem 
                        key={item.id}
                        item={item}
                        isActive={activeSection === item.id}
                        onClick={() => scrollToSection(item.id)}
                        icon={getSectionIcon(item.title)}
                      />
                    ))}
                  </NavGroup>
                )}

                {groupedContent.timeline.length > 0 && (
                  <NavGroup title="Timeline Data">
                    {groupedContent.timeline.map((item) => (
                      <NavItem 
                        key={item.id}
                        item={item}
                        isActive={activeSection === item.id}
                        onClick={() => scrollToSection(item.id)}
                        icon={TrendingUp}
                      />
                    ))}
                  </NavGroup>
                )}
              </nav>

              {/* Key Requirements Quick Link */}
              {visa.key_requirements && (
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <button
                    onClick={() => {
                      const el = document.getElementById('key-requirements');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="flex items-center gap-2 text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Key Requirements
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0" ref={contentRef}>
            {/* Key Requirements Card */}
            {visa.key_requirements && (
              <section id="key-requirements" className="mb-8">
                <Card className="border-l-4 border-l-primary-500">
                  <CardHeader className="pb-3">
                    <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-primary-600" />
                      Key Requirements
                    </h2>
                  </CardHeader>
                  <CardBody>
                    <div className="prose prose-neutral max-w-none whitespace-pre-line text-neutral-700">
                      {visa.key_requirements}
                    </div>
                  </CardBody>
                </Card>
              </section>
            )}

            {/* Premium Content Sections */}
            <div className="space-y-8">
              {premiumContent.map((item, index) => {
                const Icon = getContentTypeIcon(item.content_type);
                return (
                  <section
                    key={item.id}
                    id={`section-${item.id}`}
                    className="scroll-mt-24"
                  >
                    <Card className={`overflow-hidden transition-all duration-300 ${activeSection === item.id ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`}>
                      <CardHeader className="bg-gradient-to-r from-neutral-50 to-white border-b">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary-100 rounded-xl">
                            <Icon className="w-6 h-6 text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h2 className="text-xl font-bold text-neutral-900">{item.title}</h2>
                              <Badge variant="secondary" className="text-xs capitalize">
                                {item.content_type}
                              </Badge>
                            </div>
                            {item.section_number && (
                              <p className="text-sm text-neutral-500 mt-1">
                                Section {item.section_number} of {premiumContent.length}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardBody className="p-6">
                        {item.content && (
                          <div className="prose prose-neutral max-w-none">
                            <div 
                              className="text-neutral-700 leading-relaxed"
                              dangerouslySetInnerHTML={{ 
                                __html: item.content
                                  .replace(/\n\n/g, '</p><p>')
                                  .replace(/\n/g, '<br/>')
                                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                  .replace(/^/g, '<p>')
                                  .replace(/$/g, '</p>')
                              }} 
                            />
                          </div>
                        )}
                        
                        {item.tips && (
                          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-amber-800">{item.tips}</p>
                            </div>
                          </div>
                        )}

                        {item.file_urls && item.file_urls.length > 0 && (
                          <div className="mt-6 space-y-2">
                            <h4 className="font-semibold text-neutral-900">Attached Files</h4>
                            {item.file_urls.map((url, idx) => (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                              >
                                <Download className="w-4 h-4 text-neutral-500" />
                                <span className="text-sm text-neutral-700">Download File {idx + 1}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </CardBody>
                    </Card>

                    {/* Navigation between sections */}
                    <div className="flex justify-between mt-4 px-2">
                      {index > 0 && (
                        <button
                          onClick={() => scrollToSection(premiumContent[index - 1].id)}
                          className="flex items-center gap-1 text-sm text-neutral-500 hover:text-primary-600 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Previous: {premiumContent[index - 1].title}
                        </button>
                      )}
                      {index < premiumContent.length - 1 && (
                        <button
                          onClick={() => scrollToSection(premiumContent[index + 1].id)}
                          className="flex items-center gap-1 text-sm text-neutral-500 hover:text-primary-600 transition-colors ml-auto"
                        >
                          Next: {premiumContent[index + 1].title}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>

            {/* Timeline Stats */}
            {stats && (
              <section className="mt-12">
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-primary-600" />
                      Processing Timeline
                    </h2>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-neutral-50 rounded-lg">
                        <p className="text-2xl font-bold text-primary-600">{stats.percentile_25 || 'N/A'}</p>
                        <p className="text-sm text-neutral-500">25% Processed</p>
                      </div>
                      <div className="text-center p-4 bg-neutral-50 rounded-lg">
                        <p className="text-2xl font-bold text-primary-600">{stats.percentile_50 || 'N/A'}</p>
                        <p className="text-sm text-neutral-500">50% Processed</p>
                      </div>
                      <div className="text-center p-4 bg-neutral-50 rounded-lg">
                        <p className="text-2xl font-bold text-primary-600">{stats.percentile_75 || 'N/A'}</p>
                        <p className="text-sm text-neutral-500">75% Processed</p>
                      </div>
                      <div className="text-center p-4 bg-neutral-50 rounded-lg">
                        <p className="text-2xl font-bold text-primary-600">{stats.percentile_90 || 'N/A'}</p>
                        <p className="text-sm text-neutral-500">90% Processed</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </section>
            )}

            {/* Related Visas */}
            {relatedVisas.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Related Visas</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {relatedVisas.map((related) => (
                    <Link
                      key={related.id}
                      to={`/visas/${related.id}`}
                      className="block p-4 bg-white border border-neutral-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
                    >
                      <Badge className="mb-2">{related.subclass}</Badge>
                      <h3 className="font-semibold text-neutral-900">{related.name}</h3>
                      <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{related.summary}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Navigation Components
function NavItem({ item, isActive, onClick, icon: Icon }: { 
  item: VisaPremiumContentItem; 
  isActive: boolean; 
  onClick: () => void;
  icon: React.ElementType;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all
        ${isActive 
          ? 'bg-primary-50 text-primary-700 font-medium' 
          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
        }
      `}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary-600' : 'text-neutral-400'}`} />
      <span className="truncate">{item.title}</span>
      {isActive && <ChevronRight className="w-4 h-4 ml-auto text-primary-600" />}
    </button>
  );
}

function NavGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <h4 className="px-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
        {title}
      </h4>
      <div className="space-y-0.5">
        {children}
      </div>
    </div>
  );
}
