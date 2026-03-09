import { useParams } from 'react-router-dom';
import { 
  Clock, DollarSign, FileCheck, Users, CheckCircle,
  ArrowRight, Star, Download, Heart, Briefcase
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const VISA_DATA: Record<string, any> = {
  '820': {
    subclass: '820/801',
    name: 'Partner Visa',
    description: 'For partners of Australian citizens or permanent residents.',
    processingTime: '14-21 months',
    cost: '$4,550',
    requirements: [
      'Be in a genuine relationship with an Australian citizen or permanent resident',
      'Meet health and character requirements',
      'Have a sponsor who is an Australian citizen or permanent resident'
    ]
  },
  '189': {
    subclass: '189',
    name: 'Skilled Independent Visa',
    description: 'For skilled workers who are not sponsored by an employer or family member.',
    processingTime: '8-12 months',
    cost: '$4,240',
    requirements: [
      'Have an occupation on the relevant skilled occupation list',
      'Have a suitable skills assessment',
      'Be invited to apply through SkillSelect'
    ]
  }
};

export function VisaDetailV2() {
  const { subclass } = useParams<{ subclass: string }>();
  const visa = VISA_DATA[subclass || ''] || VISA_DATA['820'];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-slate-900 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 text-slate-400 mb-4">
            <span>Visas</span>
            <span>/</span>
            <span className="text-white">{visa.name}</span>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="primary">Subclass {visa.subclass}</Badge>
                <button className="text-slate-400 hover:text-red-400">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">{visa.name}</h1>
              <p className="text-slate-300 max-w-2xl">{visa.description}</p>
            </div>
            
            <div className="hidden md:block text-right">
              <p className="text-3xl font-bold text-white">{visa.cost}</p>
              <p className="text-slate-400">Starting from</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 p-4">
                <Clock className="w-5 h-5 text-blue-600 mb-2" />
                <p className="text-sm text-slate-600">Processing</p>
                <p className="font-semibold text-slate-900">{visa.processingTime}</p>
              </div>
              <div className="bg-white border border-slate-200 p-4">
                <DollarSign className="w-5 h-5 text-green-600 mb-2" />
                <p className="text-sm text-slate-600">Cost</p>
                <p className="font-semibold text-slate-900">{visa.cost}</p>
              </div>
              <div className="bg-white border border-slate-200 p-4">
                <Users className="w-5 h-5 text-purple-600 mb-2" />
                <p className="text-sm text-slate-600">Applicants</p>
                <p className="font-semibold text-slate-900">2,500+</p>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                Requirements
              </h2>
              <ul className="space-y-3">
                {visa.requirements.map((req: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Premium Guide</span>
              </div>
              <p className="text-sm text-blue-700 mb-4">Get step-by-step guidance and document templates.</p>
              <Button variant="primary" className="w-full">
                Unlock Premium
              </Button>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Need Help?</h3>
              <p className="text-sm text-slate-600 mb-4">Book a consultation with our migration experts.</p>
              <Button variant="outline" className="w-full">
                <Briefcase className="w-4 h-4 mr-2" />
                Book Consultation
              </Button>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Resources</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 p-2 text-left hover:bg-slate-50">
                  <Download className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700">Checklist PDF</span>
                </button>
                <button className="w-full flex items-center gap-2 p-2 text-left hover:bg-slate-50">
                  <Download className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700">Document Guide</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
