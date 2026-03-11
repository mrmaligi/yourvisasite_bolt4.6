import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Clock,
  FileText,
  DollarSign,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Shield,
  BookOpen,
  Download,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import type { Visa } from '../../types/database';
import { extractSubclassFromSlug } from '../../lib/url-utils';

export function VisaDetailV2() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [visa, setVisa] = useState<Visa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetchVisa();
  }, [slug]);

  const fetchVisa = async () => {
    try {
      setLoading(true);
      const subclass = extractSubclassFromSlug(slug || "");
      
      const { data, error } = await supabase
        .from('visas')
        .select('*')
        .eq('is_active', true)
        .or(`subclass.eq.${subclass},slug.eq.${slug}`)
        .single();

      if (error) throw error;
      setVisa(data);
    } catch (err) {
      setError('Visa not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (error || !visa) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Visa Not Found</h1>
          <p className="text-slate-600 mb-4">The visa you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/visas')}>Browse All Visas</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{visa.name} | VisaBuild</title>
        <meta name="description" content={visa.description || `Learn about ${visa.name} requirements and application process`} />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link to="/visas" className="text-slate-600 hover:text-slate-900 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Visa Search
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card - SQUARE */}
              <div className="bg-white border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{visa.name}</h1>
                    <p className="text-slate-600">{visa.category} Visa</p>
                  </div>
                  <Badge variant="primary" className="text-lg px-4 py-2">{visa.subclass}</Badge>
                </div>
                
                <p className="text-slate-700 leading-relaxed">{visa.description}</p>
              </div>

              {/* Requirements Section - SQUARE */}
              <div className="bg-white border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {(visa.requirements || visa.key_requirements?.split("\n"))?.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-600 mt-2 flex-shrink-0" />
                      {req}
                    </li>
                  )) || (
                    <li className="text-slate-500">Requirements information loading...</li>
                  )}
                </ul>
              </div>

              {/* Documents Section - SQUARE */}
              <div className="bg-white border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Required Documents
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {visa.required_documents?.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200">
                      <div className="w-2 h-2 bg-amber-500 flex-shrink-0" />
                      <span className="text-slate-700 text-sm">{doc}</span>
                    </div>
                  )) || (
                    <p className="text-slate-500 col-span-2">Document list loading...</p>
                  )}
                </div>
              </div>

              {/* Process Steps - SQUARE */}
              <div className="bg-white border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Application Process
                </h2>
                <div className="space-y-4">
                  {visa.process_steps?.map((step, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-slate-50 border border-slate-200">
                      <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-slate-900 font-medium">{step}</p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-slate-500">Process steps loading...</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info - SQUARE */}
              <div className="bg-white border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <span className="text-slate-600 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Processing Time
                    </span>
                    <span className="font-medium text-slate-900">{visa.processing_time || 'Varies'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <span className="text-slate-600 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Cost (from)
                    </span>
                    <span className="font-medium text-slate-900">
                      ${visa.cost_aud ? (visa.cost_aud / 100).toLocaleString() : 'Check DHA'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-slate-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Validity
                    </span>
                    <span className="font-medium text-slate-900">{visa.validity || 'Permanent'}</span>
                  </div>
                </div>
              </div>

              {/* CTA - SQUARE */}
              <div className="bg-blue-600 text-white p-6">
                <Shield className="w-8 h-8 mb-3" />
                <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Book a consultation with a verified immigration lawyer.
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full bg-white text-blue-600 hover:bg-blue-50"
                  onClick={() => navigate('/lawyers')}
                >
                  Find a Lawyer
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Premium - SQUARE */}
              {user && (
                <div className="bg-slate-900 text-white p-6">
                  <h3 className="text-lg font-semibold mb-2">Premium Guide</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Get detailed step-by-step instructions and document templates.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full border-slate-600 text-white hover:bg-slate-800"
                    onClick={() => navigate(`/visas/${slug}/premium`)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    View Premium Content
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
