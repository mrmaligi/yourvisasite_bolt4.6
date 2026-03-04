import { useEffect, useState } from 'react';
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
  Image,
  Video,
  Download,
  Lock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { VisaDetailSkeleton } from '../../components/ui/Skeleton';
import { ShareButton } from '../../components/ShareButton';
import type { Visa, TrackerStats, TrackerEntry, NewsArticle } from '../../types/database';

// Updated interface matching actual database schema
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

export function VisaDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [visa, setVisa] = useState<Visa | null>(null);
  const [stats, setStats] = useState<TrackerStats | null>(null);
  const [relatedVisas, setRelatedVisas] = useState<Visa[]>([]);
  const [premiumContent, setPremiumContent] = useState<VisaPremiumContentItem[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [recentEntries, setRecentEntries] = useState<TrackerEntry[]>([]);
  const [visaNews, setVisaNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);

      // 1. Fetch Visa
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

      // 2. Fetch Stats
      const { data: statsData } = await supabase
        .from('tracker_stats')
        .select('*')
        .eq('visa_id', id)
        .maybeSingle();
      setStats(statsData);

      // 3. Fetch Related Visas
      if (visaData) {
        const { data: relatedData } = await supabase
          .from('visas')
          .select('*')
          .eq('category', visaData.category)
          .neq('id', id)
          .limit(3);
        setRelatedVisas(relatedData || []);
      }

      // 4. Fetch Premium Content (now free)
      const { data: contentData } = await supabase
        .from('visa_premium_content')
        .select('*')
        .eq('visa_id', id)
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      setPremiumContent(contentData || []);

      // 5. Fetch Recent Entries
      const { data: entriesData } = await supabase
        .from('tracker_entries')
        .select('*')
        .eq('visa_id', id)
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentEntries(entriesData || []);

      // 7. Fetch Visa-Specific News
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

  const currentStep = premiumContent[currentStepIndex];

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'document_examples': return Image;
      case 'file': return Download;
      default: return FileText;
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'guide': return 'Guide';
      case 'checklist': return 'Checklist';
      case 'template': return 'Template';
      case 'document_examples': return 'Document Examples';
      case 'example_application': return 'Example Application';
      case 'video': return 'Video';
      case 'file': return 'File';
      default: return 'Document';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs & Back */}
      <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6 no-print">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/visas" className="hover:text-primary-600">Visas</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-neutral-900 font-medium truncate">{visa.name}</span>
      </div>

      <div className="flex items-center justify-between mb-8 no-print">
        <Link to="/visas" className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Search
        </Link>
        <Button variant="secondary" size="sm" onClick={() => window.print()}>
          <Printer className="w-4 h-4 mr-2" />
          Print Guide
        </Button>
      </div>

      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="text-sm px-3 py-1">{visa.subclass}</Badge>
            <Badge variant="primary" className="text-sm px-3 py-1">{visa.category}</Badge>
        </div>
        <div className="flex justify-between items-start gap-4 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">{visa.name}</h1>
            <ShareButton title={`Check out this visa guide: ${visa.name}`} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
            <div>
                <p className="text-sm text-neutral-500 mb-1">Cost</p>
                <p className="font-semibold text-neutral-900">
                  {visa.cost_aud || 'Varies'}
                </p>
            </div>
            <div>
                <p className="text-sm text-neutral-500 mb-1">Processing Time</p>
                <p className="font-semibold text-neutral-900">{visa.processing_time_range || 'Unknown'}</p>
            </div>
            <div>
                <p className="text-sm text-neutral-500 mb-1">Duration</p>
                <p className="font-semibold text-neutral-900">{visa.duration || 'Permanent'}</p>
            </div>
            <div className="no-print">
                 <a
                    href={visa.official_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center w-full h-full text-sm font-medium rounded-lg transition-colors ${visa.official_url ? 'text-primary-600 bg-white border border-primary-200 hover:bg-primary-50' : 'text-neutral-400 bg-neutral-100 cursor-not-allowed'}`}
                 >
                    Official Site <ExternalLink className="w-4 h-4 ml-2" />
                 </a>
            </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            {/* Summary */}
            <section>
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Overview</h2>
                <div className="prose prose-neutral max-w-none text-neutral-600">
                    <p>{visa.summary || visa.description || "No summary available."}</p>
                </div>
            </section>

            {/* Requirements */}
            {visa.key_requirements && (
                <section>
                    <h2 className="text-xl font-bold text-neutral-900 mb-4">Key Requirements</h2>
                    <Card>
                        <CardBody className="pt-6">
                            <div className="prose prose-sm max-w-none text-neutral-600 whitespace-pre-line">
                                {visa.key_requirements}
                            </div>
                        </CardBody>
                    </Card>
                </section>
            )}

            {/* Premium Content / Resources */}
            <section id="premium-guide">
                 <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary-600" />
                      Premium Resources
                      <Badge variant="success" className="ml-2">FREE</Badge>
                    </h2>
                    {premiumContent.length > 0 && (
                      <Badge variant="secondary">{premiumContent.length} resources</Badge>
                    )}
                 </div>

                 {premiumContent.length > 0 ? (
                    <div className="space-y-4">
                      {premiumContent.map((item, idx) => {
                        const Icon = getContentTypeIcon(item.content_type);
                        return (
                          <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardBody className="p-5">
                              <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary-50 rounded-lg">
                                  <Icon className="w-6 h-6 text-primary-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-neutral-900">{item.title}</h3>
                                    <Badge variant="secondary" className="text-xs">
                                      {getContentTypeLabel(item.content_type)}
                                    </Badge>
                                  </div>
                                  
                                  {item.description && (
                                    <p className="text-sm text-neutral-600 mb-3">{item.description}</p>
                                  )}
                                  
                                  {item.content && (
                                    <div className="prose prose-sm max-w-none text-neutral-600 bg-neutral-50 rounded-lg p-4 mb-3">
                                      <div dangerouslySetInnerHTML={{ __html: item.content.replace(/\n/g, '<br/>') }} />
                                    </div>
                                  )}
                                  
                                  {item.tips && (
                                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-800 mb-3">
                                      <strong>💡 Tip:</strong> {item.tips}
                                    </div>
                                  )}
                                  
                                  {/* File URLs */}
                                  {item.file_urls && item.file_urls.length > 0 && (
                                    <div className="space-y-2">
                                      {item.file_urls.map((url, fileIdx) => (
                                        <a
                                          key={fileIdx}
                                          href={url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-2 rounded-lg hover:bg-primary-100 transition-colors"
                                        >
                                          <Download className="w-4 h-4" />
                                          Download {url.split('/').pop() || `File ${fileIdx + 1}`}
                                          <ExternalLink className="w-3 h-3" />
                                        </a>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        );
                      })}
                    </div>
                 ) : (
                    <Card>
                      <CardBody className="py-12 text-center text-neutral-500">
                        <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-neutral-900 mb-2">Resources Coming Soon</h3>
                        <p className="text-neutral-500 max-w-md mx-auto">
                          Premium guides, checklists, and document examples for this visa are being prepared by our team.
                        </p>
                        <p className="text-sm text-neutral-400 mt-4">
                          Check back soon for free downloadable resources!
                        </p>
                      </CardBody>
                    </Card>
                 )}
            </section>
        </div>

        <div className="space-y-8">
            {/* Processing Stats */}
            <Card>
                <CardHeader>
                    <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary-600" />
                        Real Processing Times
                    </h3>
                </CardHeader>
                <CardBody>
                    {stats ? (
                        <div className="space-y-6">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-neutral-900">
                                    {Math.round(stats.median_days || 0)} days
                                </p>
                                <p className="text-sm text-neutral-500">Median waiting time</p>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-neutral-100">
                                <div className="relative pt-6 pb-2">
                                    {/* Visual Distribution Bar */}
                                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden flex">
                                        <div className="w-1/4 bg-primary-200" />
                                        <div className="w-2/4 bg-primary-400" />
                                        <div className="w-1/4 bg-primary-600" />
                                    </div>

                                    {/* Markers */}
                                    <div className="absolute top-0 left-[25%] -translate-x-1/2 flex flex-col items-center">
                                        <span className="text-xs font-medium text-neutral-700">{Math.round(stats.p25_days || 0)}d</span>
                                        <div className="h-2 w-px bg-neutral-300 mt-1" />
                                    </div>
                                    <div className="absolute top-0 left-[50%] -translate-x-1/2 flex flex-col items-center">
                                        <span className="text-xs font-bold text-primary-700">{Math.round(stats.median_days || 0)}d</span>
                                        <div className="h-2 w-px bg-primary-500 mt-1" />
                                    </div>
                                    <div className="absolute top-0 left-[75%] -translate-x-1/2 flex flex-col items-center">
                                        <span className="text-xs font-medium text-neutral-700">{Math.round(stats.p75_days || 0)}d</span>
                                        <div className="h-2 w-px bg-neutral-300 mt-1" />
                                    </div>

                                    <div className="flex justify-between text-xs text-neutral-400 mt-2">
                                        <span>Fast (25%)</span>
                                        <span>Slow (75%)</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                     <p className="text-xs text-neutral-400 mt-2">Based on {stats.total_entries} user reports</p>
                                     <Link to="/tracker" className="text-xs text-primary-600 hover:underline">View full tracker stats</Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                            <p className="text-neutral-500 text-sm">No sufficient data yet.</p>
                            <Link to="/tracker" className="text-xs text-primary-600 hover:underline mt-2 block">
                                Check global stats
                            </Link>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Recent Reports */}
            {recentEntries.length > 0 && (
              <Card className="no-print">
                <CardHeader>
                  <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                    Recent Reports
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    {recentEntries.slice(0, 3).map((entry) => (
                      <div key={entry.id} className="flex items-center gap-3 text-sm">
                        {entry.outcome === 'approved' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : entry.outcome === 'refused' ? (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-500" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-neutral-900">
                            {entry.processing_days ? `${entry.processing_days} days` : 'Pending'}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {entry.outcome === 'approved' ? 'Approved' : entry.outcome === 'refused' ? 'Refused' : 'Processing'}
                          </p>
                        </div>
                        <span className="text-xs text-neutral-400">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Link to="/tracker" className="text-xs text-primary-600 hover:underline mt-4 block text-center">
                    View all reports
                  </Link>
                </CardBody>
              </Card>
            )}

            {/* Related Visas */}
            {relatedVisas.length > 0 && (
              <Card className="no-print">
                <CardHeader>
                  <h3 className="font-bold text-neutral-900">Related Visas</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    {relatedVisas.map((related) => (
                      <Link
                        key={related.id}
                        to={`/visas/${related.id}`}
                        className="block p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-neutral-900">{related.name}</p>
                            <p className="text-sm text-neutral-500">Subclass {related.subclass}</p>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-neutral-400" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* News */}
            {visaNews.length > 0 && (
              <Card className="no-print">
                <CardHeader>
                  <h3 className="font-bold text-neutral-900">Latest News</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {visaNews.map((article) => (
                      <a
                        key={article.id}
                        href={article.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group"
                      >
                        <h4 className="font-medium text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-xs text-neutral-500 mt-1">
                          {article.published_at && new Date(article.published_at).toLocaleDateString()}
                        </p>
                      </a>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
        </div>
      </div>
    </div>
  );
}
