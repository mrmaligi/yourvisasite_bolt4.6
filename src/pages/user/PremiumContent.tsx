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
  Square,
  Info,
  ChevronDown,
  ChevronUp
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

    // Fetch all visas that have premium content (indicated by premium_guide_url or implied)
    // We'll use the same criteria as before: premium_guide_url is not null
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
  const [showExample, setShowExample] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset example view on step change
  useEffect(() => {
    setShowExample(false);
  }, [currentStepIndex]);

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


  // Unlocked View
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
                                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : step.step_number}
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${isActive ? 'text-primary-900' : 'text-neutral-700'}`}>
                                        {step.title}
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
                                    Step {currentStep.step_number}
                                </span>
                                <h2 className="text-2xl font-bold text-neutral-900">{currentStep.title}</h2>
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
                        {currentStep.document_category && (
                            <div className="mb-8 p-4 bg-amber-50 rounded-lg border border-amber-100 flex gap-4">
                                <FileText className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-amber-900 mb-1">
                                        Required Documents
                                    </h3>
                                    <Badge variant="warning">{currentStep.document_category}</Badge>
                                    {currentStep.document_explanation && (
                                        <p className="text-sm text-amber-800 mt-2">{currentStep.document_explanation}</p>
                                    )}
                                     {currentStep.document_example_url && (
                                        <a href={currentStep.document_example_url} target="_blank" rel="noopener noreferrer" className="text-sm text-amber-900 underline mt-2 block hover:text-amber-700">
                                            View Example
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Content Body */}
                        <div
                            className="prose prose-neutral max-w-none mb-12"
                            dangerouslySetInnerHTML={{ __html: currentStep.body || '' }}
                        />

                        {/* Example Application */}
                        {currentStep.application_example_json && currentStep.application_example_json.length > 0 && (
                            <div className="mb-12 border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                                <button
                                    onClick={() => setShowExample(!showExample)}
                                    className="w-full flex items-center justify-between p-6 bg-neutral-50 hover:bg-neutral-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-neutral-900">Example Application Form</h3>
                                            <p className="text-sm text-neutral-500">See how to fill out this section with mock data</p>
                                        </div>
                                    </div>
                                    {showExample ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                                </button>

                                {showExample && (
                                    <div className="p-6 bg-white border-t border-neutral-200 space-y-4">
                                        {currentStep.application_example_json.map((field, i) => (
                                            <div key={i} className="p-4 rounded-lg border border-neutral-100 bg-neutral-50 hover:border-neutral-200 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <label className="font-semibold text-sm text-neutral-800">{field.field_name}</label>
                                                    {field.tip && (
                                                        <div className="group relative ml-2">
                                                            <Info className="w-4 h-4 text-blue-500 cursor-help" />
                                                            <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-neutral-900 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                                                                <div className="absolute bottom-[-6px] right-1 w-3 h-3 bg-neutral-900 transform rotate-45"></div>
                                                                <span className="relative z-10 font-medium">{field.tip}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="font-mono text-sm text-neutral-600 bg-white border border-neutral-200 rounded px-3 py-2 mb-2 shadow-sm">
                                                    {field.example_value}
                                                </div>
                                                <p className="text-xs text-neutral-500">{field.field_description}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
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

      <div className="print-only p-8">
        <h1 className="text-3xl font-bold mb-2">{visa.name}</h1>
        <p className="text-xl text-neutral-600 mb-8">Premium Application Guide</p>

        <div className="space-y-12">
            {content.map((step) => (
                <div key={step.id} className="break-inside-avoid">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm mr-3">
                            {step.step_number}
                        </span>
                        {step.title}
                    </h2>

                    {step.document_category && (
                        <div className="mb-6 p-4 border border-neutral-300 rounded-lg">
                             <p className="font-bold mb-1">Required Document: {step.document_category}</p>
                             {step.document_explanation && <p className="text-sm">{step.document_explanation}</p>}
                        </div>
                    )}

                    <div
                        className="prose prose-neutral max-w-none"
                        dangerouslySetInnerHTML={{ __html: step.body || '' }}
                    />

                    {step.application_example_json && step.application_example_json.length > 0 && (
                        <div className="mt-6 border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                            <h3 className="font-bold mb-3">Example Application Data</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {step.application_example_json.map((field, i) => (
                                    <div key={i} className="text-sm">
                                        <p className="font-semibold">{field.field_name}</p>
                                        <p className="font-mono bg-white border px-2 py-1 mt-1">{field.example_value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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
