import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Lock,
  CheckCircle,
  Calendar,
  ArrowLeft,
  Printer,
  ChevronRight,
  ChevronLeft,
  FileText,
  CheckSquare,
  Square
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { usePremiumContent } from '../../hooks/usePremiumContent';
import { StripeCheckout } from '../../components/StripeCheckout';

interface PurchasedGuide {
  id: string;
  visa_id: string;
  visa_name: string;
  purchased_at: string;
  amount_cents: number;
  content_url: string | null;
}

interface AvailableGuide {
  id: string;
  name: string;
  description: string | null;
  premium_guide_url: string | null;
  country: string | null;
}

function PremiumContentList() {
  const { user } = useAuth();
  const [purchased, setPurchased] = useState<PurchasedGuide[]>([]);
  const [available, setAvailable] = useState<AvailableGuide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchContent();
  }, [user]);

  const fetchContent = async () => {
    if (!user) return;

    const { data: purchases } = await supabase
      .from('user_visa_purchases')
      .select('id, visa_id, purchased_at, amount_cents')
      .eq('user_id', user.id)
      .order('purchased_at', { ascending: false });

    if (purchases && purchases.length > 0) {
      const visaIds = purchases.map((p) => p.visa_id);
      const { data: visas } = await supabase
        .from('visas')
        .select('id, name, premium_guide_url')
        .in('id', visaIds);

      const visaMap = new Map(visas?.map((v) => [v.id, v]) || []);

      const enriched = purchases.map((p) => {
        const visa = visaMap.get(p.visa_id);
        return {
          id: p.id,
          visa_id: p.visa_id,
          visa_name: visa?.name || 'Unknown Visa',
          purchased_at: p.purchased_at,
          amount_cents: p.amount_cents,
          content_url: visa?.premium_guide_url || null,
        };
      });

      setPurchased(enriched);
    }

    const { data: allVisas } = await supabase
      .from('visas')
      .select('id, name, description, premium_guide_url, country')
      .not('premium_guide_url', 'is', null)
      .order('name');

    const purchasedIds = new Set(purchases?.map((p) => p.visa_id) || []);
    const availableGuides = (allVisas || []).filter((v) => !purchasedIds.has(v.id));

    setAvailable(availableGuides);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900">Premium Content</h1>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-neutral-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Premium Content</h1>
        <p className="text-neutral-500 mt-1">
          Access your purchased visa guides and explore new premium content.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">My Purchased Guides</h2>
        {purchased.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No purchased guides"
            description="Purchase premium visa guides from visa detail pages to access comprehensive application instructions."
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {purchased.map((guide) => (
              <Card key={guide.id}>
                <CardBody>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900">{guide.visa_name}</h3>
                        <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          Purchased {new Date(guide.purchased_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="success">Owned</Badge>
                  </div>
                  <p className="text-sm text-neutral-600 mb-4">
                    Comprehensive step-by-step guide with all requirements, forms, and timeline information.
                  </p>

                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => window.location.href = `/dashboard/premium?visa_id=${guide.visa_id}`}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Guide
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {available.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Available Premium Guides</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {available.slice(0, 6).map((guide) => (
              <Card key={guide.id} className="hover:shadow-lg transition-shadow">
                <CardBody>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900">{guide.name}</h3>
                        {guide.country && (
                          <p className="text-xs text-neutral-500 mt-0.5">{guide.country}</p>
                        )}
                      </div>
                    </div>
                    <Badge variant="warning">$49</Badge>
                  </div>
                  <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                    {guide.description || 'Comprehensive visa application guide with detailed requirements.'}
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => (window.location.href = `/visas/${guide.id}`)}
                  >
                    View Details
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PremiumGuideViewer({ visaId }: { visaId: string }) {
  const { user } = useAuth();
  const { visa, content, isPurchased, loading, error, refresh } = usePremiumContent(visaId);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);

  // Check for session_id to verify purchase
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      // Refresh to check if purchase is recorded
      refresh();
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname + `?visa_id=${visaId}`);
    }
  }, [searchParams, refresh, visaId]);

  // Load progress from localStorage
  useEffect(() => {
    if (user && visaId) {
        const saved = localStorage.getItem(`visa_progress_${user.id}_${visaId}`);
        if (saved) {
            try {
                setCompletedSteps(new Set(JSON.parse(saved)));
            } catch (e) {
                console.error("Failed to parse progress", e);
            }
        }
    }
  }, [user, visaId]);

  // Save progress
  const toggleStep = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
        newCompleted.delete(stepId);
    } else {
        newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
    if (user) {
        localStorage.setItem(`visa_progress_${user.id}_${visaId}`, JSON.stringify(Array.from(newCompleted)));
    }
  };

  const currentStep = content[currentStepIndex];
  const progress = content.length > 0 ? Math.round((completedSteps.size / content.length) * 100) : 0;


  if (loading) {
     return (
        <div className="space-y-6">
            <div className="h-8 w-1/3 bg-neutral-200 rounded animate-pulse" />
            <div className="grid md:grid-cols-4 gap-6">
                <div className="h-64 bg-neutral-200 rounded animate-pulse md:col-span-1" />
                <div className="h-96 bg-neutral-200 rounded animate-pulse md:col-span-3" />
            </div>
        </div>
     );
  }

  if (error || !visa) {
    return (
        <div className="text-center py-12">
            <h2 className="text-xl font-bold text-neutral-900">Failed to load content</h2>
            <Button onClick={() => navigate('/dashboard/premium')} className="mt-4">
                Return to Dashboard
            </Button>
        </div>
    );
  }

  if (!isPurchased) {
    const features = [
      'Comprehensive step-by-step instructions',
      'Detailed document checklists & explanations',
      'Example declarations and templates',
      'Expert tips to avoid common mistakes',
      'Application timeline and process overview'
    ];

    // Locked View
    return (
        <div className="space-y-6">
            <Button onClick={() => navigate('/dashboard/premium')} variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>

            <Card className="overflow-hidden">
                <div className="grid md:grid-cols-2">
                    <div className="p-8 bg-neutral-900 text-white flex flex-col justify-center">
                        <div className="mb-6">
                            <Badge variant="warning" className="mb-4">Premium Guide</Badge>
                            <h1 className="text-3xl font-bold mb-4">Unlock the complete {visa.name} Application Guide</h1>
                            <p className="text-neutral-300 text-lg">
                                Stop guessing. Get the exact roadmap you need to lodge a successful application.
                            </p>
                        </div>

                        <div className="space-y-4 mb-8">
                            {features.map((feature, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-neutral-200">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <StripeCheckout
                                type="premium"
                                visaId={visaId}
                                amount={4900}
                                redirectPath={`/dashboard/premium?visa_id=${visaId}`}
                                className="w-full sm:w-auto px-8 py-3 text-lg"
                            >
                                Unlock Now — $49
                            </StripeCheckout>
                            <p className="text-sm text-neutral-400">One-time payment. Lifetime access.</p>
                        </div>
                    </div>

                    <div className="bg-neutral-100 p-8 flex items-center justify-center min-h-[400px]">
                        {/* Preview Graphic */}
                        <div className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 border border-neutral-200 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                             <div className="h-4 w-1/3 bg-neutral-200 rounded mb-6" />
                             <div className="space-y-3 mb-8">
                                <div className="h-2 w-full bg-neutral-100 rounded" />
                                <div className="h-2 w-5/6 bg-neutral-100 rounded" />
                                <div className="h-2 w-4/6 bg-neutral-100 rounded" />
                             </div>

                             <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg border border-primary-100">
                                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xs">1</div>
                                    <div className="h-2 w-20 bg-primary-200 rounded" />
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-neutral-100 opacity-50">
                                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 font-bold text-xs">2</div>
                                    <div className="h-2 w-20 bg-neutral-200 rounded" />
                                </div>
                                 <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-neutral-100 opacity-50">
                                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 font-bold text-xs">3</div>
                                    <div className="h-2 w-20 bg-neutral-200 rounded" />
                                </div>
                             </div>

                             <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg border border-neutral-100">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-neutral-200 border-2 border-white" />
                                        ))}
                                    </div>
                                    <div className="text-xs font-medium text-neutral-600">
                                        Trusted by 500+ users
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
  }

  // Unlocked View
  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <Button onClick={() => navigate('/dashboard/premium')} variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <h1 className="text-xl font-bold text-neutral-900">{visa.name} Guide</h1>
            </div>
            <Button variant="secondary" size="sm" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" />
                Print Guide
            </Button>
        </div>

        <div className="flex flex-1 gap-6 overflow-hidden pb-6">
             {/* Sidebar */}
             <div className="w-72 flex-shrink-0 bg-white border border-neutral-200 rounded-xl overflow-y-auto hidden md:flex flex-col">
                 <div className="p-4 border-b border-neutral-100 bg-neutral-50 sticky top-0 z-10">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-neutral-600">Your Progress</span>
                        <span className="text-sm font-bold text-primary-600">{progress}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                 </div>

                 <div className="py-2">
                    {content.map((step, index) => {
                        const isCompleted = completedSteps.has(step.id);
                        const isActive = index === currentStepIndex;

                        return (
                            <button
                                key={step.id}
                                onClick={() => setCurrentStepIndex(index)}
                                className={`w-full text-left p-4 hover:bg-neutral-50 border-l-4 transition-colors flex gap-3 ${
                                    isActive
                                    ? 'bg-primary-50 border-primary-600'
                                    : 'border-transparent'
                                }`}
                            >
                                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    isCompleted
                                    ? 'bg-green-100 text-green-700'
                                    : isActive
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'bg-neutral-100 text-neutral-500'
                                }`}>
                                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : step.section_number}
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${isActive ? 'text-primary-900' : 'text-neutral-700'}`}>
                                        {step.section_title}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                 </div>
             </div>

             {/* Main Content */}
             <div
                ref={contentRef}
                className="flex-1 bg-white border border-neutral-200 rounded-xl overflow-y-auto p-8 relative shadow-sm"
             >
                 {currentStep ? (
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-neutral-100">
                             <div>
                                <span className="text-xs font-bold tracking-wider text-primary-600 uppercase mb-1 block">
                                    Step {currentStep.section_number}
                                </span>
                                <h2 className="text-2xl font-bold text-neutral-900">{currentStep.section_title}</h2>
                             </div>
                             <button
                                onClick={() => toggleStep(currentStep.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    completedSteps.has(currentStep.id)
                                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                }`}
                             >
                                {completedSteps.has(currentStep.id) ? (
                                    <>
                                        <CheckSquare className="w-5 h-5" />
                                        <span className="font-medium">Completed</span>
                                    </>
                                ) : (
                                    <>
                                        <Square className="w-5 h-5" />
                                        <span className="font-medium">Mark Complete</span>
                                    </>
                                )}
                             </button>
                        </div>

                        {/* Document Requirement */}
                        {currentStep.required_documents && currentStep.required_documents.length > 0 && (
                            <div className="mb-8 p-4 bg-amber-50 rounded-lg border border-amber-100 flex gap-4">
                                <FileText className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-amber-900 mb-1">
                                        Required Documents
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {currentStep.required_documents.map(doc => (
                                            <Badge key={doc} variant="warning">{doc}</Badge>
                                        ))}
                                    </div>
                                    {currentStep.tips && (
                                        <p className="text-sm text-amber-800 mt-2">{currentStep.tips}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Content Body */}
                        <div
                            className="prose prose-neutral max-w-none mb-12"
                            dangerouslySetInnerHTML={{ __html: currentStep.content }}
                        />

                        {/* Footer Navigation */}
                        <div className="flex items-center justify-between pt-8 border-t border-neutral-100">
                            <Button
                                variant="secondary"
                                disabled={currentStepIndex === 0}
                                onClick={() => {
                                    setCurrentStepIndex(i => i - 1);
                                    contentRef.current?.scrollTo(0,0);
                                }}
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Previous Step
                            </Button>

                            <Button
                                variant="primary"
                                disabled={currentStepIndex === content.length - 1}
                                onClick={() => {
                                    setCurrentStepIndex(i => i + 1);
                                    contentRef.current?.scrollTo(0,0);
                                }}
                            >
                                Next Step
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                 ) : (
                     <div className="text-center py-12 text-neutral-500">
                         Select a step to begin.
                     </div>
                 )}
             </div>
        </div>
    </div>
  );
}

export function PremiumContent() {
  const [searchParams] = useSearchParams();
  const visaId = searchParams.get('visa_id');

  if (visaId) {
    return <PremiumGuideViewer visaId={visaId} />;
  }

  return <PremiumContentList />;
}
