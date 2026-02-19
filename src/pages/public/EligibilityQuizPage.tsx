import { EligibilityQuiz } from '../../components/growth';

export function EligibilityQuizPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Find Your Perfect Visa
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            Answer a few questions and get personalized visa recommendations
          </p>
        </div>
        <EligibilityQuiz />
      </div>
    </div>
  );
}
