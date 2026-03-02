# Jules API Prompts for VisaBuild 50 Pages Implementation

## Batch 1: User Experience Pages (Pages 1-10)

### Page 1: Welcome.tsx
Create `/src/pages/user/Welcome.tsx` - Post-login welcome with user onboarding

```typescript
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle, User, FileText, Calendar, Compass } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { Helmet } from 'react-helmet-async';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  action: string;
  link: string;
  completed: boolean;
}

export function Welcome() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [steps, setSteps] = useState<OnboardingStep[]>([
    { id: 'profile', title: 'Complete Your Profile', description: 'Add your details to personalize your experience', icon: User, action: 'Setup Profile', link: '/dashboard/settings', completed: false },
    { id: 'documents', title: 'Upload Documents', description: 'Start building your document library', icon: FileText, action: 'Upload Docs', link: '/dashboard/documents', completed: false },
    { id: 'explore', title: 'Explore Visa Options', description: 'Find the perfect visa for your situation', icon: Compass, action: 'Explore Visas', link: '/visas', completed: false },
    { id: 'consultation', title: 'Book a Consultation', description: 'Get expert advice from immigration lawyers', icon: Calendar, action: 'Find Lawyers', link: '/lawyers', completed: false },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboardingProgress();
  }, [user]);

  const checkOnboardingProgress = async () => {
    try {
      // Check which steps are completed
      const updatedSteps = steps.map(step => ({
        ...step,
        completed: false // Will be updated based on actual data
      }));
      setSteps(updatedSteps);
    } finally {
      setIsLoading(false);
    }
  };

  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <>
      <Helmet>
        <title>Welcome to VisaBuild | Your Immigration Journey Starts Here</title>
        <meta name="description" content="Welcome to VisaBuild. Complete your profile and start your visa application journey." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 dark:from-neutral-900 dark:to-neutral-800">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 rounded-full mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Welcome to VisaBuild, {user?.email?.split('@')[0] || 'there'}! 
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              Let's get you set up for your visa journey. Complete these simple steps to get started.
            </p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            className="bg-white dark:bg-neutral-800 rounded-2xl p-6 mb-8 shadow-lg"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                Getting Started Progress
              </span>
              <span className="text-primary-600 font-bold">{completedCount} of {steps.length} completed</span>
            </div>
            <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-primary-500 to-blue-500 rounded-full"
              />
            </div>
          </motion.div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`h-full ${step.completed ? 'border-green-500 dark:border-green-600' : ''}`}>
                    <CardBody className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        step.completed 
                          ? 'bg-green-100 dark:bg-green-900/30' 
                          : 'bg-primary-100 dark:bg-primary-900/30'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <Icon className="w-6 h-6 text-primary-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                          {step.title}
                        </h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                          {step.description}
                        </p>
                        <Button
                          variant={step.completed ? 'secondary' : 'primary'}
                          size="sm"
                          as={Link}
                          to={step.link}
                          className="inline-flex items-center gap-2"
                        >
                          {step.completed ? 'Completed' : step.action}
                          {!step.completed && <ArrowRight className="w-4 h-4" />}
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Start CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <p className="text-neutral-500 dark:text-neutral-400 mb-4">
              Want to skip the setup and explore?
            </p>
            <Button variant="secondary" size="lg" as={Link} to="/dashboard">
              Go to Dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  );
}
```

### Page 2: Tour.tsx
Create `/src/pages/user/Tour.tsx` - Interactive product tour with steps

```typescript
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, FileCheck, Users, Calendar, TrendingUp, 
  ChevronRight, ChevronLeft, X, CheckCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface TourStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  image?: string;
}

const tourSteps: TourStep[] = [
  {
    id: 1,
    title: 'Find Your Perfect Visa',
    description: 'Search through 78+ Australian visa options with smart filters and eligibility quizzes.',
    icon: Search,
    features: ['Advanced search filters', 'Eligibility quiz', 'Visa comparison tool', 'Save favorites'],
  },
  {
    id: 2,
    title: 'Track Applications',
    description: 'Monitor your visa application progress with real-time updates and processing time estimates.',
    icon: TrendingUp,
    features: ['Real-time status updates', 'Processing time estimates', 'Document checklist', 'Deadline reminders'],
  },
  {
    id: 3,
    title: 'Organize Documents',
    description: 'Keep all your immigration documents organized and accessible in one secure location.',
    icon: FileCheck,
    features: ['Secure cloud storage', 'Document categorization', 'Expiry date tracking', 'Easy sharing'],
  },
  {
    id: 4,
    title: 'Connect with Lawyers',
    description: 'Book consultations with verified immigration lawyers and manage all communications.',
    icon: Users,
    features: ['Verified lawyer directory', 'Easy booking system', 'Video consultations', 'Secure messaging'],
  },
  {
    id: 5,
    title: 'Consultation Management',
    description: 'Schedule and manage consultations with immigration experts at your convenience.',
    icon: Calendar,
    features: ['Calendar integration', 'Appointment reminders', 'Video call links', 'Consultation history'],
  },
];

export function Tour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeTour();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeTour = () => {
    localStorage.setItem('tourCompleted', 'true');
    navigate('/dashboard');
  };

  const skipTour = () => {
    completeTour();
  };

  const step = tourSteps[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <>
      <Helmet>
        <title>Product Tour | VisaBuild</title>
        <meta name="description" content="Take a tour of VisaBuild features and learn how to maximize your visa application experience." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-xl text-neutral-900 dark:text-white">VisaBuild</span>
          </div>
          <button
            onClick={skipTour}
            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Skip Tour
          </button>
        </header>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-2 gap-12 items-center min-h-[60vh]"
            >
              {/* Left: Content */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-6">
                  <Icon className="w-5 h-5 text-primary-600" />
                  <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                    Step {currentStep + 1} of {tourSteps.length}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
                  {step.title}
                </h1>

                <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-8">
                  {step.description}
                </p>

                <div className="space-y-3">
                  {step.features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-neutral-700 dark:text-neutral-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right: Visual */}
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Icon className="w-32 h-32 text-white/90" />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-400 rounded-full opacity-20 blur-xl" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-12">
            {/* Progress Bar */}
            <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden mb-8">
              <motion.div
                className="h-full bg-primary-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex gap-2">
                {tourSteps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      idx === currentStep
                        ? 'bg-primary-500'
                        : 'bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400'
                    }`}
                    aria-label={`Go to step ${idx + 1}`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                {currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
```

### Page 3: GettingStarted.tsx
Create `/src/pages/user/GettingStarted.tsx` - Step-by-step setup guide

```typescript
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, Circle, ChevronRight, User, Upload, Search, 
  Calendar, Shield, Sparkles, ArrowRight
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { Skeleton } from '@/components/ui/Skeleton';
import { Helmet } from 'react-helmet-async';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  action: string;
  link: string;
  completed: boolean;
  optional?: boolean;
}

export function GettingStarted() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [steps, setSteps] = useState<SetupStep[]>([
    { id: 'profile', title: 'Complete Your Profile', description: 'Add your personal information and preferences', icon: User, action: 'Complete', link: '/dashboard/settings', completed: false },
    { id: 'documents', title: 'Upload Key Documents', description: 'Upload passport, ID, and other essential documents', icon: Upload, action: 'Upload', link: '/dashboard/documents', completed: false },
    { id: 'visa-search', title: 'Search for Visas', description: 'Explore visa options that match your profile', icon: Search, action: 'Explore', link: '/visas', completed: false, optional: true },
    { id: 'consultation', title: 'Book a Consultation', description: 'Get expert advice from immigration lawyers', icon: Calendar, action: 'Book Now', link: '/lawyers', completed: false, optional: true },
    { id: 'security', title: 'Secure Your Account', description: 'Enable 2FA for enhanced security', icon: Shield, action: 'Enable', link: '/dashboard/settings', completed: false, optional: true },
  ]);

  useEffect(() => {
    loadSetupProgress();
  }, [user]);

  const loadSetupProgress = async () => {
    try {
      setIsLoading(true);
      // Check actual completion status from backend
      // For now, simulate loading
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mark profile as completed if user has name
      if (user?.user_metadata?.full_name) {
        setSteps(prev => prev.map(s => s.id === 'profile' ? { ...s, completed: true } : s));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const completedCount = steps.filter(s => s.completed).length;
  const requiredCount = steps.filter(s => !s.optional).length;
  const requiredCompleted = steps.filter(s => !s.optional && s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-96 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Getting Started | VisaBuild</title>
        <meta name="description" content="Complete your VisaBuild setup with our step-by-step guide." />
      </Helmet>

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Getting Started
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                  Complete these steps to get the most out of VisaBuild
                </p>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="flex items-center gap-4 mt-6">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    {completedCount} of {steps.length} completed
                  </span>
                  <span className="text-primary-600 font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-primary-500 rounded-full"
                  />
                </div>
              </div>
              <Button variant="secondary" size="sm" as={Link} to="/dashboard">
                Skip for Now
              </Button>
            </div>
          </div>
        </div>

        {/* Steps List */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isNext = !step.completed && steps.slice(0, index).every(s => s.completed || s.optional);

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`${isNext ? 'ring-2 ring-primary-500' : ''} ${step.completed ? 'opacity-75' : ''}`}>
                    <CardBody className="flex items-center gap-6">
                      {/* Status Icon */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.completed
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : isNext
                          ? 'bg-primary-100 dark:bg-primary-900/30'
                          : 'bg-neutral-100 dark:bg-neutral-700'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <Icon className={`w-6 h-6 ${isNext ? 'text-primary-600' : 'text-neutral-400'}`} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-neutral-900 dark:text-white">
                            {step.title}
                          </h3>
                          {step.optional && (
                            <span className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-500 rounded-full">
                              Optional
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {step.description}
                        </p>
                      </div>

                      {/* Action */}
                      <Button
                        variant={step.completed ? 'secondary' : 'primary'}
                        size="sm"
                        as={Link}
                        to={step.link}
                        className="flex items-center gap-2"
                      >
                        {step.completed ? 'Edit' : step.action}
                        {!step.completed && <ChevronRight className="w-4 h-4" />}
                      </Button>
                    </CardBody>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Complete Message */}
          {completedCount === steps.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 text-center p-8 bg-green-50 dark:bg-green-900/20 rounded-2xl"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">
                You're All Set!
              </h2>
              <p className="text-green-700 dark:text-green-400 mb-4">
                You've completed all the setup steps. Ready to explore?
              </p>
              <Button as={Link} to="/dashboard" className="inline-flex items-center gap-2">
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
```

[Continue with pages 4-10 following the same pattern...]

## Implementation Notes:
1. All pages must use @/components/ui components
2. Use Framer Motion for animations
3. Implement proper loading states with Skeleton components
4. Include SEO meta tags with react-helmet-async
5. Follow mobile-first responsive design
6. Include proper TypeScript interfaces
7. Use Zustand or React Query for state management where needed
8. Implement error boundaries and toast notifications

## Routes to add to App.tsx:
- /welcome -> Welcome
- /tour -> Tour  
- /getting-started -> GettingStarted
- /visa-roadmap -> VisaRoadmap
- /document-checklist -> DocumentChecklist
- /application-timeline -> ApplicationTimeline
- /deadline-alerts -> DeadlineAlerts
- /profile -> Profile
- /notifications -> Notifications
- /billing -> Billing
