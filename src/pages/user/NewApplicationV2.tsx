import { FileText, Plus, FileUp, HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function NewApplicationV2() {
  const visaTypes = [
    { id: '820', name: 'Partner Visa', subclass: '820/801', description: 'For partners of Australian citizens or permanent residents', popular: true },
    { id: '189', name: 'Skilled Independent', subclass: '189', description: 'For skilled workers not sponsored by an employer', popular: true },
    { id: '190', name: 'Skilled Nominated', subclass: '190', description: 'For skilled workers nominated by a state or territory', popular: false },
    { id: '500', name: 'Student Visa', subclass: '500', description: 'For international students studying in Australia', popular: false },
    { id: '485', name: 'Temporary Graduate', subclass: '485', description: 'For recent graduates from Australian institutions', popular: false },
    { id: '600', name: 'Visitor Visa', subclass: '600', description: 'For tourists visiting Australia', popular: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Start New Application</h1>
          <p className="text-slate-600">Select the visa type you want to apply for</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {visaTypes.map((visa) => (
            <div key={visa.id} className="bg-white border border-slate-200 p-6 hover:border-blue-400 cursor-pointer transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-slate-900">{visa.name}</p>
                    {visa.popular && <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700">Popular</span>}
                  </div>
                  <p className="text-sm text-blue-600 mb-2">Subclass {visa.subclass}</p>
                  <p className="text-sm text-slate-600">{visa.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 p-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Not sure which visa?</p>
              <p className="text-sm text-blue-700">Take our visa eligibility quiz or book a free consultation with our experts.</p>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm">Take Quiz</Button>
                <Button variant="primary" size="sm">Book Consultation</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
