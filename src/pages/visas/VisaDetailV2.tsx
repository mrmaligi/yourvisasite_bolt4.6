import { Globe, Clock, DollarSign, CheckCircle, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function VisaDetailV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <span>Visas</span>
            <span>/</span>
            <span className="text-white">Partner Visa</span>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">Partner Visa (820/801)</h1>
          <p className="text-slate-400">For partners of Australian citizens, permanent residents, or eligible New Zealand citizens</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-slate-200 p-4">
            <Clock className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-sm text-slate-600">Processing Time</p>
            <p className="text-xl font-bold text-slate-900">12-18 months</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-4">
            <DollarSign className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-sm text-slate-600">Cost</p>
            <p className="text-xl font-bold text-slate-900">From $7,850</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-4">
            <Globe className="w-6 h-6 text-amber-600 mb-2" />
            <p className="text-sm text-slate-600">Location</p>
            <p className="text-xl font-bold text-slate-900">Onshore</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Eligibility Requirements</h2>
          
          <ul className="space-y-3">
            {[
              'Be in a genuine relationship with an Australian citizen or permanent resident',
              'Meet health and character requirements',
              'Have a sponsor who meets the eligibility criteria',
              'Be in Australia when applying (onshore)',
            ].map((req, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <span className="text-slate-700">{req}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-4">
          <Button variant="primary">Start Application</Button>
          <Button variant="outline"><FileText className="w-4 h-4 mr-2" />View Checklist</Button>
        </div>
      </div>
    </div>
  );
}
