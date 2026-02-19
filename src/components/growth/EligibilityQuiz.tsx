import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, CheckCircle, FileText, Briefcase, GraduationCap, Users, Globe } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardBody } from '../ui/Card';
import { Input } from '../ui/Input';
import { supabase } from '../../lib/supabase';
import { useToast } from '../ui/Toast';

interface QuizStep {
  id: number;
  question: string;
  description?: string;
  type: 'single' | 'multiple' | 'text' | 'email';
  options?: { value: string; label: string; icon?: React.ElementType }[];
  field: string;
}

const quizSteps: QuizStep[] = [
  {
    id: 1,
    question: "What's your email?",
    description: "We'll send your personalized visa recommendations to this email.",
    type: 'email',
    field: 'email',
  },
  {
    id: 2,
    question: "Where are you currently located?",
    type: 'text',
    field: 'current_country',
  },
  {
    id: 3,
    question: "What's your main purpose for coming to Australia?",
    type: 'multiple',
    field: 'visa_purpose',
    options: [
      { value: 'work', label: 'Work', icon: Briefcase },
      { value: 'study', label: 'Study', icon: GraduationCap },
      { value: 'family', label: 'Join Family', icon: Users },
      { value: 'business', label: 'Business/Investment', icon: Globe },
      { value: 'tourist', label: 'Tourism/Visit', icon: FileText },
    ],
  },
  {
    id: 4,
    question: "Do you have a job offer from an Australian employer?",
    type: 'single',
    field: 'has_job_offer',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ],
  },
  {
    id: 5,
    question: "Do you have family members who are Australian citizens or permanent residents?",
    type: 'single',
    field: 'has_family_sponsor',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ],
  },
  {
    id: 6,
    question: "What's your English proficiency level?",
    type: 'single',
    field: 'english_level',
    options: [
      { value: 'native', label: 'Native / Fluent' },
      { value: 'proficient', label: 'Proficient (IELTS 7+)' },
      { value: 'competent', label: 'Competent (IELTS 6+)' },
      { value: 'vocational', label: 'Vocational (IELTS 5+)' },
      { value: 'functional', label: 'Functional (IELTS 4.5+)' },
      { value: 'none', label: 'No English test' },
    ],
  },
  {
    id: 7,
    question: "What's your highest level of education?",
    type: 'single',
    field: 'education_level',
    options: [
      { value: 'phd', label: 'PhD / Doctorate' },
      { value: 'masters', label: 'Masters Degree' },
      { value: 'bachelors', label: 'Bachelor Degree' },
      { value: 'diploma', label: 'Diploma / Trade Certificate' },
      { value: 'high_school', label: 'High School' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 8,
    question: "How many years of work experience do you have?",
    type: 'single',
    field: 'work_experience_years',
    options: [
      { value: '0', label: 'Less than 1 year' },
      { value: '1', label: '1-2 years' },
      { value: '3', label: '3-5 years' },
      { value: '5', label: '5-8 years' },
      { value: '8', label: '8+ years' },
    ],
  },
  {
    id: 9,
    question: "What's your age range?",
    type: 'single',
    field: 'age_range',
    options: [
      { value: '18-24', label: '18-24' },
      { value: '25-32', label: '25-32' },
      { value: '33-39', label: '33-39' },
      { value: '40-44', label: '40-44' },
      { value: '45+', label: '45+' },
    ],
  },
];

interface QuizAnswers {
  email: string;
  current_country: string;
  visa_purpose: string[];
  has_job_offer: boolean;
  has_family_sponsor: boolean;
  english_level: string;
  education_level: string;
  work_experience_years: number;
  age_range: string;
}

export function EligibilityQuiz() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const step = quizSteps[currentStep];
  const progress = ((currentStep + 1) / quizSteps.length) * 100;

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({ ...prev, [step.field]: value }));
  };

  const handleNext = () => {
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitQuiz();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    try {
      // Save quiz results
      const { data: quizResult, error } = await supabase
        .from('quiz_results')
        .insert({
          email: answers.email,
          current_country: answers.current_country,
          destination_country: 'Australia',
          visa_purpose: answers.visa_purpose,
          has_job_offer: answers.has_job_offer,
          has_family_sponsor: answers.has_family_sponsor,
          english_level: answers.english_level,
          education_level: answers.education_level,
          work_experience_years: parseInt(answers.work_experience_years as any),
          age_range: answers.age_range,
          recommended_visas: [], // Will be populated by edge function
        })
        .select()
        .single();

      if (error) throw error;

      // Generate recommendations based on answers
      const recommendations = generateRecommendations(answers as QuizAnswers);
      
      // Update with recommendations
      await supabase
        .from('quiz_results')
        .update({ recommended_visas: recommendations })
        .eq('id', quizResult.id);

      setResults(recommendations);
      
      toast('success', 'Quiz completed! Check your email for detailed results.');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast('error', 'Failed to submit quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = (answers: QuizAnswers) => {
    const recommendations = [];

    // Work visa recommendations
    if (answers.visa_purpose.includes('work')) {
      if (answers.has_job_offer) {
        recommendations.push({
          visa_id: '482',
          visa_name: 'Temporary Skill Shortage (TSS) visa (Subclass 482)',
          eligibility_score: 95,
          reasons: ['You have a job offer', 'This is the primary employer-sponsored visa'],
        });
      }
      
      if (answers.work_experience_years >= 3 && answers.english_level !== 'none') {
        recommendations.push({
          visa_id: '189',
          visa_name: 'Skilled Independent visa (Subclass 189)',
          eligibility_score: answers.has_job_offer ? 70 : 85,
          reasons: [
            `${answers.work_experience_years}+ years work experience`,
            'Points-based visa, no sponsor required',
          ],
        });
      }

      if (answers.education_level === 'phd' || answers.education_level === 'masters') {
        recommendations.push({
          visa_id: '485',
          visa_name: 'Temporary Graduate visa (Subclass 485)',
          eligibility_score: 90,
          reasons: ['High education level qualifies for graduate visa', 'Pathway to permanent residency'],
        });
      }
    }

    // Family visa recommendations
    if (answers.visa_purpose.includes('family') && answers.has_family_sponsor) {
      recommendations.push({
        visa_id: '820',
        visa_name: 'Partner visa (Subclass 820/801)',
        eligibility_score: 95,
        reasons: ['You have an eligible family sponsor', 'Direct pathway to permanent residency'],
      });
    }

    // Student visa
    if (answers.visa_purpose.includes('study')) {
      recommendations.push({
        visa_id: '500',
        visa_name: 'Student visa (Subclass 500)',
        eligibility_score: 90,
        reasons: ['Straightforward pathway for students', 'Work rights included'],
      });
    }

    // Working Holiday (young applicants)
    if (answers.age_range === '18-24' || answers.age_range === '25-32') {
      if (!answers.visa_purpose.includes('family')) {
        recommendations.push({
          visa_id: '417',
          visa_name: 'Working Holiday visa (Subclass 417)',
          eligibility_score: 95,
          reasons: ['Age eligible', 'Great for short-term work and travel'],
        });
      }
    }

    // Sort by eligibility score
    return recommendations.sort((a, b) => b.eligibility_score - a.eligibility_score);
  };

  const canProceed = () => {
    const value = answers[step.field as keyof QuizAnswers];
    if (!value) return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  };

  // Show results
  if (results) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardBody className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              Your Visa Recommendations
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300">
              Based on your answers, here are your best options:
            </p>
          </div>

          <div className="space-y-4">
            {results.map((visa: any, index: number) => (
              <div 
                key={visa.visa_id}
                className="p-4 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-primary-600">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-neutral-900 dark:text-white">
                        {visa.visa_name}
                      </h3>
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                        {visa.eligibility_score}% Match
                      </span>
                    </div>
                    <ul className="text-sm text-neutral-600 dark:text-neutral-300 space-y-1">
                      {visa.reasons.map((reason: string, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={() => navigate('/visas')}
            >
              Browse All Visas
            </Button>
            <Button 
              className="flex-1"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </div>

          <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
            Detailed results have been sent to {answers.email}
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardBody className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-neutral-500 dark:text-neutral-400">
            <span>Question {currentStep + 1} of {quizSteps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            {step.question}
          </h2>
          {step.description && (
            <p className="text-neutral-600 dark:text-neutral-300">
              {step.description}
            </p>
          )}
        </div>

        {/* Answer Input */}
        <div className="space-y-3">
          {step.type === 'email' && (
            <Input
              type="email"
              placeholder="your@email.com"
              value={(answers[step.field as keyof QuizAnswers] as string) || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              className="w-full"
            />
          )}

          {step.type === 'text' && (
            <Input
              type="text"
              placeholder="Enter your answer"
              value={(answers[step.field as keyof QuizAnswers] as string) || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              className="w-full"
            />
          )}

          {step.type === 'single' && step.options && (
            <div className="grid grid-cols-1 gap-2">
              {step.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(
                    step.field === 'has_job_offer' || step.field === 'has_family_sponsor'
                      ? option.value === 'true'
                      : option.value
                  )}
                  className={`p-4 text-left rounded-xl border transition-all ${
                    answers[step.field as keyof QuizAnswers] === option.value ||
                    answers[step.field as keyof QuizAnswers] === (option.value === 'true')
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                  }`}
                >
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {step.type === 'multiple' && step.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {step.options.map((option) => {
                const Icon = option.icon;
                const isSelected = (answers[step.field as keyof QuizAnswers] as string[])?.includes(option.value);
                
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      const current = (answers[step.field as keyof QuizAnswers] as string[]) || [];
                      const updated = isSelected
                        ? current.filter(v => v !== option.value)
                        : [...current, option.value];
                      handleAnswer(updated);
                    }}
                    className={`p-4 rounded-xl border transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                    }`}
                  >
                    {Icon && <Icon className="w-5 h-5 text-neutral-500" />}
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed() || loading}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {loading ? (
              'Processing...'
            ) : currentStep === quizSteps.length - 1 ? (
              'Get Results'
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}