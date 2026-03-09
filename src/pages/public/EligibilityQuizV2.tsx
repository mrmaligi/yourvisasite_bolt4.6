import { HelpCircle, ArrowRight, Lightbulb, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicEligibilityQuizV2() {
  const questions = [
    { id: 1, question: 'What is your relationship status?', options: ['Single', 'Married', 'De facto', 'Engaged'] },
    { id: 2, question: 'Is your partner an Australian citizen or permanent resident?', options: ['Yes', 'No', 'Not sure'] },
    { id: 3, question: 'How long have you been together?', options: ['Less than 1 year', '1-2 years', '2-3 years', 'More than 3 years'] },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-blue-100 mx-auto mb-4 flex items-center justify-center">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white">Visa Eligibility Quiz</h1>
          <p className="text-slate-300 mt-2">Find out which visa might be right for you</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-12">
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600">Question 1 of 3</span>
            <span className="text-slate-600">33%</span>
          </div>
          <div className="h-2 bg-slate-200">
            <div className="h-2 bg-blue-600 w-1/3" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">{questions[0].question}</h2>
          
          <div className="space-y-3">
            {questions[0].options.map((option) => (
              <button key={option} className="w-full p-4 border border-slate-200 text-left hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <span className="text-slate-700">{option}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="outline" disabled>Previous</Button>
            <Button variant="primary">
              Next
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
          <p className="text-sm text-blue-700">This quiz provides general guidance only. For personalized advice, book a consultation with our experts.</p>
        </div>
      </div>
    </div>
  );
}
