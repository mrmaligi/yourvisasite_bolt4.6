import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, ChevronLeft, Check, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';

// Tour steps
const steps = [
  {
    title: 'Welcome to Your Dashboard',
    description: 'This is your central hub for managing your visa application. Track progress, upload documents, and connect with experts.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Track Your Application',
    description: 'Monitor your visa status in real-time. Our tracker updates you on every stage from submission to decision.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Manage Documents',
    description: 'Securely upload and organize all your required documents. We\'ll tell you exactly what you need for your visa type.',
    image: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Get Expert Help',
    description: 'Need assistance? Book a consultation with verified immigration lawyers directly through the platform.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800'
  }
];

export function Tour() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Finish tour
      window.location.href = '/dashboard';
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-neutral-50 dark:bg-neutral-900 p-4">
      <Helmet>
        <title>Product Tour | VisaBuild</title>
      </Helmet>

      <div className="max-w-4xl w-full bg-white dark:bg-neutral-800 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Image Side */}
        <div className="md:w-1/2 bg-neutral-100 dark:bg-neutral-700 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentStep}
              src={steps[currentStep].image}
              alt={steps[currentStep].title}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8 md:hidden">
            <h2 className="text-2xl font-bold text-white">{steps[currentStep].title}</h2>
          </div>
        </div>

        {/* Content Side */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <div className="flex space-x-2 mb-8">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentStep ? 'w-8 bg-primary-600' : 'w-2 bg-neutral-200 dark:bg-neutral-600'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white hidden md:block">
                {steps[currentStep].title}
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {steps[currentStep].description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-12 pt-6 border-t border-neutral-100 dark:border-neutral-700">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center text-sm font-medium transition-colors ${
                currentStep === 0
                  ? 'text-neutral-300 cursor-not-allowed'
                  : 'text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400'
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </button>

            <Button onClick={nextStep} className="px-8">
              {currentStep === steps.length - 1 ? (
                <>Get Started <Check className="w-4 h-4 ml-2" /></>
              ) : (
                <>Next <ChevronRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
