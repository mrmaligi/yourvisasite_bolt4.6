import { CheckCircle, XCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useState } from 'react';

export function EligibilityCheckerV2() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const questions = [
    { id: 1, question: 'Are you currently in Australia?', options: ['Yes', 'No'] },
    { id: 2, question: 'Is your partner an Australian citizen or permanent resident?', options: ['Yes', 'No'] },
    { id: 3, question: 'How long have you been in a relationship?', options: ['Less than 1 year', '1-2 years', 'More than 2 years'] },
  ];

  const currentQuestion = questions[step - 1];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Visa Eligibility Checker</h1>
          <p className="text-slate-400">Find out which visa you might be eligible for</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-12">
        <div className="bg-white border border-slate-200 p-8">
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">Question {step} of {questions.length}</span>
              <span className="text-slate-600">{Math.round((step / questions.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-slate-100">
              <div className="h-full bg-blue-600" style={{ width: `${(step / questions.length) * 100}%` }} />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-slate-900 mb-6">{currentQuestion.question}</h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => setAnswers({ ...answers, [currentQuestion.id]: option })}
                className={`w-full p-4 border text-left ${
                  answers[currentQuestion.id] === option 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-slate-200 hover:border-blue-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-4 py-2 border border-slate-200 disabled:opacity-50"
            >
              Back
            </button>
            
            <button
              onClick={() => setStep(Math.min(questions.length, step + 1))}
              disabled={!answers[currentQuestion.id]}
              className="px-4 py-2 bg-blue-600 text-white disabled:opacity-50"
            >
              {step === questions.length ? 'See Results' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
