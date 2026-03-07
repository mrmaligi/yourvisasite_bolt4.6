import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ExternalLink,
  Clock,
  BookOpen,
  ChevronRight,
  ArrowLeft,
  Printer,
  CheckCircle,
  FileText,
  Video,
  Download,
  Lock,
  Menu,
  X,
  DollarSign,
  Calendar,
  List,
  Lightbulb,
  Shield,
  ChevronDown,
  ChevronUp,
  Upload,
  CheckSquare,
  AlertCircle,
  Star,
  Crown,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { VisaDetailSkeleton } from '../../components/ui/Skeleton';
import { ShareButton } from '../../components/ShareButton';
import type { Visa, TrackerStats, TrackerEntry } from '../../types/database';
import { extractSubclassFromSlug } from '../../lib/url-utils';

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

interface DocumentItem {
  id?: string;
  name: string;
  description?: string;
  is_mandatory: boolean;
  document_type: string;
  status?: 'pending' | 'uploaded' | 'verified' | 'rejected';
  fileUrl?: string;
}

export function VisaDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // Extract subclass from slug (handles both old format "820/801" and new format "partner-visa-820-801")
  const subclass = slug ? extractSubclassFromSlug(slug) : null;

  const [visa, setVisa] = useState<Visa | null>(null);
  const [stats, setStats] = useState<TrackerStats | null>(null);
  const [relatedVisas, setRelatedVisas] = useState<Visa[]>([]);
  const [premiumContent, setPremiumContent] = useState<VisaPremiumContentItem[]>([]);
  const [recentEntries, setRecentEntries] = useState<TrackerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);

  // Check if content is unlocked from query param or localStorage - REQUIRES AUTH
  useEffect(() => {
    if (!subclass) return;
    
    // Only check unlock status if user is logged in
    if (!user) {
      setIsUnlocked(false);
      return;
    }
    
    // Check query param (from checkout redirect)
    const unlockedParam = searchParams.get('unlocked');
    if (unlockedParam === 'true') {
      // Verify user is authenticated before unlocking
      if (user) {
        setIsUnlocked(true);
        localStorage.setItem(`visa_${subclass}_${user.id}_unlocked`, 'true');
        // Remove param from URL without refreshing
        navigate(`/visas/${subclass}`, { replace: true });
      }
    } else {
      // Check localStorage - must be user-specific
      const stored = localStorage.getItem(`visa_${subclass}_${user.id}_unlocked`);
      if (stored === 'true') {
        setIsUnlocked(true);
      }
    }
  }, [subclass, searchParams, navigate, user]);

  useEffect(() => {
    if (!subclass) return;

    const fetchData = async () => {
      setLoading(true);

      // Fetch Visa
      const { data: visaData } = await supabase
        .from('visas')
        .select('*')
        .eq('subclass', subclass)
        .single();

      if (visaData) {
        setVisa(visaData);
        const visaId = visaData.id;

        // Fetch related
        const { data: relatedData } = await supabase
          .from('visas')
          .select('*')
          .eq('category', visaData.category)
          .neq('id', visaId)
          .limit(3);
        setRelatedVisas(relatedData || []);

        // Parse key_requirements into documents
        if (visaData.key_requirements) {
          const docItems = visaData.key_requirements
            .split('\n')
            .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'))
            .map((line, idx) => ({
              name: line.replace(/^[•-]\s*/, '').trim(),
              is_mandatory: true,
              document_type: 'requirement',
              status: 'pending' as const
            }));
          setDocuments(docItems);
        }

        // Fetch Premium Content
        const { data: contentData } = await supabase
          .from('visa_premium_content')
          .select('*')
          .eq('visa_id', visaId)
          .eq('is_published', true)
          .order('section_number', { ascending: true });
        
        const sortedContent = contentData || [];
        setPremiumContent(sortedContent);
        
        // Expand first section by default
        if (sortedContent.length > 0) {
          setExpandedSections(new Set([sortedContent[0].id]));
          setActiveSection(sortedContent[0].id);
        }

        // Fetch Stats
        const { data: statsData } = await supabase
          .from('tracker_stats')
          .select('*')
          .eq('visa_id', visaId)
          .maybeSingle();
        setStats(statsData);

        // Fetch Recent Entries
        const { data: entriesData } = await supabase
          .from('tracker_entries')
          .select('*')
          .eq('visa_id', visaId)
          .order('created_at', { ascending: false })
          .limit(5);
        setRecentEntries(entriesData || []);
      }

      setLoading(false);
    };

    fetchData();
  }, [subclass]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
    setActiveSection(sectionId);
  };

  const formatContent = (content: string) => {
    if (!content) return '';
    
    // First, escape HTML to prevent XSS
    let formatted = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Convert markdown to HTML
    formatted = formatted
      // Headers (must be at start of line)
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-neutral-900 mt-8 mb-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-neutral-900 mt-10 mb-5">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-neutral-900 mt-10 mb-6">$1</h1>')
      
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-neutral-900">$1</strong>')
      
      // Italic text
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      
      // Checkboxes
      .replace(/- \[ \] (.*)/g, '<div class="flex items-start gap-3 mb-3"><div class="w-5 h-5 border-2 border-neutral-300 rounded flex-shrink-0 mt-0.5"></div><span class="text-neutral-700">$1</span></div>')
      .replace(/- \[x\] (.*)/g, '<div class="flex items-start gap-3 mb-3"><div class="w-5 h-5 bg-green-500 border-2 border-green-500 rounded flex-shrink-0 mt-0.5 flex items-center justify-center"><svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></div><span class="text-neutral-500 line-through">$1</span></div>')
      
      // Bullet lists
      .replace(/^- (.*)/gm, '<li class="flex items-start gap-3 mb-2"><span class="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span><span class="text-neutral-700">$1</span></li>')
      
      // Numbered lists (1. item)
      .replace(/^\d+\. (.*)/gm, '<li class="flex items-start gap-3 mb-2"><span class="font-semibold text-primary-600 min-w-[1.5rem]">$&</span></li>')
      
      // Tables (simple two-column)
      .replace(/\|([^|]+)\|([^|]+)\|/g, '<tr><td class="border border-neutral-200 px-4 py-2 font-medium bg-neutral-50">$1</td><td class="border border-neutral-200 px-4 py-2">$2</td></tr>')
      
      // Line breaks - preserve paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed text-neutral-700">')
      .replace(/\n/g, '<br/>');
    
    // Wrap in paragraph if not already wrapped
    if (!formatted.startsWith('<h') && !formatted.startsWith('<div') && !formatted.startsWith('<li') && !formatted.startsWith('<tr')) {
      formatted = '<p class="mb-4 leading-relaxed text-neutral-700">' + formatted + '</p>';
    }
    
    // Wrap lists in ul
    formatted = formatted.replace(/(<li.*<\/li>)+/g, '<ul class="mb-6 space-y-1">$&</ul>');
    
    // Wrap tables
    formatted = formatted.replace(/(<tr>.*<\/tr>)+/g, '<table class="w-full border-collapse mb-6">$&</table>');
    
    return formatted;
  };

  if (loading) return <VisaDetailSkeleton />;
  if (!visa) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold text-neutral-900 mb-2">Visa not found</h2>
      <Link to="/visas"><Button variant="secondary">Back to search</Button></Link>
    </div>
  );

  const freeContent = isUnlocked ? premiumContent : premiumContent.slice(0, 2);
  const lockedContent = isUnlocked ? [] : premiumContent.slice(2);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/visas" className="flex items-center text-neutral-600 hover:text-neutral-900">
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="h-6 w-px bg-neutral-300 hidden sm:block" />
              <Badge className="text-sm">{visa.subclass}</Badge>
              <span className="font-semibold text-neutral-900 hidden sm:inline">{visa.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <ShareButton title={`Visa Guide: ${visa.name}`} />
              <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-0">Subclass {visa.subclass}</Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-0 capitalize">{visa.category}</Badge>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">{visa.name}</h1>
          
          {/* Summary with proper formatting */}
          {visa.summary && (
            <div className="max-w-3xl">
              {/* Split summary into key-value pairs */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {visa.summary.split('**').filter((_, i) => i % 2 === 1).map((item, idx) => {
                  const parts = item.split(':**');
                  if (parts.length === 2) {
                    return (
                      <div key={idx} className="bg-white/10 backdrop-blur rounded-lg p-4">
                        <p className="text-sm text-primary-200 mb-1">{parts[0]}</p>
                        <p className="font-semibold text-lg">{parts[1]}</p>
                      </div>
                    );
                  }
                  return null;
                }).filter(Boolean)}
              </div>
              
              {/* Description paragraph */}
              <p className="text-lg text-primary-100 leading-relaxed">
                {visa.summary.split('###')[0]?.replace(/\*\*/g, '').split('.')[0]}.
              </p>
            </div>
          )}
          
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
              <a href={visa.official_url || '#'} target="_blank" rel="noopener noreferrer" className="font-semibold text-lg hover:underline flex items-center gap-1">
                DHA <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Premium CTA Banner - Hide when unlocked */}
      {!isUnlocked && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8" />
                <div>
                  <p className="font-bold text-lg">Unlock Premium Guide</p>
                  <p className="text-amber-100 text-sm">Get {lockedContent.length} more sections + document checklist + expert tips</p>
                </div>
              </div>
              <Button 
                variant="secondary" 
                className="bg-white text-orange-600 hover:bg-amber-50"
                onClick={() => navigate(`/checkout?visa=${visa?.subclass}&plan=premium`)}
              >
                <Lock className="w-4 h-4 mr-2" />
                Unlock Now
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-xl transform transition-transform lg:translate-x-0 lg:static lg:shadow-none lg:bg-transparent lg:w-64 lg:block lg:h-fit lg:sticky lg:top-24 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="h-full overflow-y-auto p-4 lg:p-0">
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">Guide Contents</h3>
              <div className="w-full bg-neutral-200 rounded-full h-2 mb-2">
                <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${(expandedSections.size / premiumContent.length) * 100}%` }} />
              </div>
              <p className="text-xs text-neutral-500 mb-4">{expandedSections.size} of {premiumContent.length} sections viewed</p>
              
              <nav className="space-y-1">
                {freeContent.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${activeSection === item.id ? 'bg-primary-50 text-primary-700 font-medium' : 'text-neutral-600 hover:bg-neutral-100'}`}
                  >
                    <BookOpen className={`w-4 h-4 ${activeSection === item.id ? 'text-primary-600' : 'text-neutral-400'}`} />
                    <span className="flex-1 truncate">{item.title}</span>
                    {expandedSections.has(item.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                ))}
                
                {/* Locked Premium Sections */}
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <div className="flex items-center gap-2 px-3 mb-2">
                    <Lock className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-amber-700">Premium Content</span>
                  </div>
                  {lockedContent.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setShowPremiumModal(true)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm text-neutral-400 hover:bg-amber-50 transition-all"
                    >
                      <Lock className="w-4 h-4" />
                      <span className="flex-1 truncate">{item.title}</span>
                    </button>
                  ))}
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0" ref={contentRef}>
            {/* Key Requirements */}
            {visa.key_requirements && (
              <section className="mb-8">
                <Card className="border-l-4 border-l-primary-500">
                  <CardHeader className="pb-3">
                    <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                      <Shield className="w-6 h-6 text-primary-600" />
                      Key Requirements
                    </h2>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-3">
                      {visa.key_requirements.split('\n').filter(line => line.trim()).map((line, idx) => {
                        const cleanLine = line.replace(/^[•-]\s*/, '').trim();
                        const isBold = cleanLine.startsWith('**') && cleanLine.endsWith('**');
                        const displayText = cleanLine.replace(/\*\*/g, '');
                        
                        return (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-semibold text-primary-600">{idx + 1}</span>
                            </div>
                            <p className={`text-neutral-700 leading-relaxed ${isBold ? 'font-semibold text-neutral-900' : ''}`}>
                              {displayText}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </CardBody>
                </Card>
              </section>
            )}

            {/* Document Upload Section - PREMIUM ONLY */}
            <section className="mb-8">
              {isUnlocked ? (
                /* UNLOCKED: Show actual document checklist */
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                        <CheckSquare className="w-6 h-6 text-primary-600" />
                        Document Checklist & Upload
                        <Badge variant="success" className="ml-2">UNLOCKED</Badge>
                      </h2>
                      <Badge variant="secondary">
                        {documents.filter(d => d.status === 'uploaded').length} / {documents.length} Uploaded
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-3">
                      {documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${doc.status === 'uploaded' ? 'bg-green-100' : 'bg-neutral-200'}`}>
                            {doc.status === 'uploaded' ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <FileText className="w-5 h-5 text-neutral-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-neutral-900">{doc.name}</p>
                            {doc.description && <p className="text-sm text-neutral-500">{doc.description}</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            {doc.status === 'uploaded' ? (
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            ) : (
                              <Button variant="secondary" size="sm">
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Upload Zone */}
                    <div className="mt-6 p-8 border-2 border-dashed border-neutral-300 rounded-lg text-center hover:border-primary-400 hover:bg-primary-50 transition-all cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
                      <p className="text-neutral-600 font-medium">Drag and drop files here</p>
                      <p className="text-sm text-neutral-400 mt-1">or click to browse</p>
                      <input type="file" className="hidden" multiple />
                    </div>
                  </CardBody>
                </Card>
              ) : (
                /* LOCKED: Show upgrade CTA */
                <Card className="border-2 border-dashed border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                        <Lock className="w-6 h-6 text-amber-600" />
                        Document Checklist & Upload
                        <Badge variant="warning" className="ml-2">PREMIUM</Badge>
                      </h2>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-amber-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">Document Checklist Locked</h3>
                      <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                        Get the complete document checklist with upload functionality. Track your progress and ensure you have all required documents.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button 
                          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                          onClick={() => setShowPremiumModal(true)}
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Unlock Document Checklist
                        </Button>
                      </div>
                      <ul className="mt-6 text-sm text-neutral-500 space-y-2">
                        <li className="flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Complete document checklist
                        </li>
                        <li className="flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Upload and track documents
                        </li>
                        <li className="flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Lawyer review ready
                        </li>
                      </ul>
                    </div>
                  </CardBody>
                </Card>
              )}
            </section>

            {/* Free Content Sections */}
            <div className="space-y-6">
              {freeContent.map((item) => (
                <section key={item.id} id={`section-${item.id}`} className="scroll-mt-24">
                  <Card className={`overflow-hidden transition-all duration-300 ${expandedSections.has(item.id) ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`}>
                    <button
                      onClick={() => toggleSection(item.id)}
                      className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-neutral-50 to-white border-b hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <BookOpen className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="text-left">
                          <h2 className="text-lg font-bold text-neutral-900">{item.title}</h2>
                          <p className="text-sm text-neutral-500">Section {item.section_number}</p>
                        </div>
                      </div>
                      {expandedSections.has(item.id) ? (
                        <ChevronUp className="w-5 h-5 text-neutral-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-400" />
                      )}
                    </button>
                    
                    {expandedSections.has(item.id) && (
                      <CardBody className="p-6">
                        <div 
                          className="prose prose-neutral max-w-none"
                          dangerouslySetInnerHTML={{ __html: formatContent(item.content || '') }}
                        />
                        
                        {item.tips && (
                          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-amber-800">{item.tips}</p>
                            </div>
                          </div>
                        )}
                      </CardBody>
                    )}
                  </Card>
                </section>
              ))}
            </div>

            {/* Premium Lock Section */}
            {lockedContent.length > 0 && (
              <section className="mt-8">
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                  <CardBody className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                      {lockedContent.length} Premium Sections Locked
                    </h2>
                    <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                      Get access to document checklists, processing timelines, expert tips, and detailed guides to boost your application success.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-6 text-left">
                      {lockedContent.slice(0, 4).map((item) => (
                        <div key={item.id} className="flex items-center gap-2 text-sm text-neutral-600">
                          <Lock className="w-4 h-4 text-amber-500" />
                          <span>{item.title}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                      onClick={() => setShowPremiumModal(true)}
                    >
                      <Lock className="w-5 h-5 mr-2" />
                      Unlock Premium Guide
                    </Button>
                    
                    <p className="text-xs text-neutral-500 mt-4">One-time payment • Lifetime access • Money-back guarantee</p>
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
                      to={`/visas/${related.subclass}`}
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

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-amber-500" />
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">Unlock Premium</h2>
                  <p className="text-sm text-neutral-500">Complete visa guide access</p>
                </div>
              </div>
              <button onClick={() => setShowPremiumModal(false)} className="p-2 hover:bg-neutral-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardBody>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-neutral-900">{lockedContent.length} Premium Sections</p>
                    <p className="text-sm text-neutral-500">Detailed guides and expert tips</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-neutral-900">Document Upload System</p>
                    <p className="text-sm text-neutral-500">Track and manage all required documents</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-neutral-900">Real Timeline Data</p>
                    <p className="text-sm text-neutral-500">See actual processing times from applicants</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-neutral-900">Lawyer Dashboard Access</p>
                    <p className="text-sm text-neutral-500">Share with your immigration lawyer</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-neutral-50 rounded-lg p-4 mb-6">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm text-neutral-500">Price</span>
                  <span className="text-3xl font-bold text-neutral-900">$49</span>
                </div>
                <p className="text-xs text-neutral-400">One-time payment • Lifetime access • 30-day money-back guarantee</p>
              </div>
              
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                onClick={() => {
                  // Redirect to Stripe checkout or payment page
                  window.location.href = `/checkout?visa=${visa?.id}&plan=premium`;
                }}
              >
                <Lock className="w-5 h-5 mr-2" />
                Unlock Now - $49
              </Button>
              
              <button 
                onClick={() => setShowPremiumModal(false)}
                className="w-full mt-3 text-sm text-neutral-500 hover:text-neutral-700"
              >
                Maybe later
              </button>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
