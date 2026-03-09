import { Helmet } from 'react-helmet-async';
import { ArrowRight, CheckCircle, FileText, Users, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

const STEPS = [
  { icon: FileText, title: 'Complete Your Profile', description: 'Add your personal information and preferences' },
  { icon: Compass, title: 'Explore Visas', description: 'Find the right visa for your situation' },
  { icon: Users, title: 'Connect with Lawyers', description: 'Book consultations with immigration experts' },
];

export function WelcomeV2() {
  return (
    <>
      <Helmet>
        <title>Welcome | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-slate-900 py-16 px-4 text-center text-white">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to VisaBuild!</h1>
            <p className="text-lg text-slate-300 mb-8">
              Your journey to Australian residency starts here. Let's get you set up.
            </p>
            <Link to="/user/dashboard">
              <Button variant="primary" className="bg-white text-slate-900 hover:bg-slate-100">
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">Get Started in 3 Easy Steps</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, index) => (
              <div key={step.title} className="bg-white border border-slate-200 p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center mx-auto mb-4 font-bold">
                  {index + 1}
                </div>
                
                <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-16 border-t border-slate-200">
          <div className="bg-blue-50 border border-blue-200 p-8 text-center">
            <CheckCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-blue-900 mb-2">Ready to Begin?</h2>
            <p className="text-blue-700 mb-6">Start your visa application journey today.</p>
            <Link to="/visas">
              <Button variant="primary">
                Explore Visas
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
