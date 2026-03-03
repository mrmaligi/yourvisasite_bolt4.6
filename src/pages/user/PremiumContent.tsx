import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ArrowLeft,
  Printer,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  CheckSquare,
  Square
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { usePremiumContent } from '../../hooks/usePremiumContent';

interface Guide {
  id: string;
  name: string;
  description: string | null;
  premium_guide_url: string | null;
  country: string | null;
}

function PremiumContentList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchContent();
  }, [user]);

  const fetchContent = async () => {
    if (!user) return;

    const { data: allVisas } = await supabase
      .from('visas')
      .select('id, name, description, premium_guide_url, country')
      .not('premium_guide_url', 'is', null)
      .eq('country', 'Australia')
      .order('name');

    setGuides(allVisas || []);
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
          Comprehensive application guides for Australian visas.
        </p>
      </div>

      {guides.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {guides.map((guide) => (
            <Card key={guide.id} className="hover:shadow-lg transition-shadow">
              <CardBody>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">{guide.name}</h3>
                      <Badge variant="success" className="mt-1">Available Free</Badge>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                  {guide.description || 'Comprehensive visa application guide with detailed requirements.'}
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`/dashboard/premium?visa_id=${guide.id}`)}
                >
                  View Guide
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
          <div className="text-center py-12 text-neutral-500">
             No guides found.
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
      refresh();
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
        try {
            localStorage.setItem(`visa_progress_${user.id}_${visaId}`, JSON.stringify(Array.from(newCompleted)));
        } catch (e) {
            console.warn('Failed to save progress:', e);
        }
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

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-100px)] no-print">
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
                                    Section {currentStep.section_number}
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

                        {/* Content Body */}
                        <div
                            className="prose prose-neutral max-w-none mb-12"
                            dangerouslySetInnerHTML={{ __html: currentStep.content || '' }}
                        />

                        {/* Tips */}
                        {currentStep.tips && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
                            <h3 className="font-semibold text-amber-900 mb-2">Tips</h3>
                            <p className="text-amber-800 text-sm whitespace-pre-line">{currentStep.tips}</p>
                          </div>
                        )}

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
                                Previous Section
                            </Button>

                            <Button
                                variant="primary"
                                disabled={currentStepIndex === content.length - 1}
                                onClick={() => {
                                    setCurrentStepIndex(i => i + 1);
                                    contentRef.current?.scrollTo(0,0);
                                }}
                            >
                                Next Section
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                 ) : (
                     <div className="text-center py-12 text-neutral-500">
                         Select a section to begin.
                     </div>
                 )}
             </div>
        </div>
      </div>

      <div className="print-only p-8">
        <h1 className="text-3xl font-bold mb-2">{visa.name}</h1>
        <p className="text-xl text-neutral-600 mb-8">Premium Application Guide</p>

        <div className="space-y-12">
            {content.map((step) => (
                <div key={step.id} className="break-inside-avoid">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm mr-3">
                            {step.section_number}
                        </span>
                        {step.section_title}
                    </h2>

                    <div
                        className="prose prose-neutral max-w-none"
                        dangerouslySetInnerHTML={{ __html: step.content || '' }}
                    />
                </div>
            ))}
        </div>
      </div>
    </>
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
