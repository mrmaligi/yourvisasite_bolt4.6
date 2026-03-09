import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const QUESTIONS = [
  {
    id: 1,
    question: 'What is your primary purpose for coming to Australia?',
    options: ['Work', 'Study', 'Join family/partner', 'Visit/Tourism', 'Business'],
  },
  {
    id: 2,
    question: 'Do you have a job offer or skills assessment?',
    options: ['Yes, I have a job offer', 'Yes, I have skills assessment', 'No, but I have qualifications', 'No'],
  },
  {
    id: 3,
    question: 'What is your English proficiency level?',
    options: ['Native/Fluent', 'Competent (IELTS 6+)', 'Vocational (IELTS 5+)', 'Basic'],
  },
];

const RESULTS = [
  { visa: 'Skilled Independent (189)', match: 95, description: 'Based on your skills and qualifications' },
  { visa: 'Employer Nomination (186)', match: 80, description: 'If you can secure employer sponsorship' },
  { visa: 'Temporary Skill Shortage (482)', match: 70, description: 'Short-term work visa option' },
];

export function EligibilityQuizV2() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [QUESTIONS[currentQuestion].id]: answer });
    
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  return (
    <>
      <Helmet>
        <title>Visa Eligibility Quiz | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Find Your Perfect Visa</h1>
            <p className="text-slate-600">Answer a few questions and get personalized recommendations</p>
          </div>

          {!showResults ? (
            <div className="bg-white border border-slate-200 p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-500">
                    Question {currentQuestion + 1} of {QUESTIONS.length}
                  </span>
                  
                  <div className="w-32 h-2 bg-slate-100">
                    <div 
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-slate-900">
                  {QUESTIONS[currentQuestion].question}
                </h2>
              </div>

              <div className="space-y-3">
                {QUESTIONS[currentQuestion].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className="w-full p-4 text-left border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">{option}</span>
                      <ArrowRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-900 mb-2">Your Results Are Ready!</h2>
                <p className="text-green-700">Based on your answers, here are your best visa options:</p>
              </div>

              {RESULTS.map((result, i) => (
                <div key={i} className="bg-white border border-slate-200 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{result.visa}</h3>
                        <Badge variant="primary">{result.match}% Match</Badge>
                      </div>
                      <p className="text-slate-600">{result.description}</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="mt-4">
                    Learn More
                  </Button>
                </div>
              ))}

              <Button variant="outline" onClick={handleRestart} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Start Over
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
