import { Briefcase, Building2, MapPin, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function JobApplicationV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <span>Careers</span>
            <span>/</span>
            <span>Senior Migration Lawyer</span>
            <span>/</span>
            <span className="text-white">Apply</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Job Application</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-8">
          <div className="mb-8 p-4 bg-slate-50">
            <h2 className="font-semibold text-slate-900 mb-2">Senior Migration Lawyer</h2>
            <div className="flex flex-wrap gap-3 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> VisaBuild Legal</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Sydney</span>
              <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> $120k - $150k</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Full-time</span>
            </div>
          </div>

          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-200" required />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-200" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
              <input type="email" className="w-full px-3 py-2 border border-slate-200" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
              <input type="tel" className="w-full px-3 py-2 border border-slate-200" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Resume/CV *</label>
              <div className="border-2 border-dashed border-slate-300 p-6 text-center">
                <p className="text-slate-500">Drop your file here or click to browse</p>
                <p className="text-sm text-slate-400">PDF, DOCX up to 10MB</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cover Letter</label>
              <textarea className="w-full px-3 py-2 border border-slate-200 h-32" />
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 w-4 h-4" required />
              <span className="text-sm text-slate-600">
                I confirm that the information provided is accurate and complete.
              </span>
            </div>

            <div className="flex gap-4">
              <Button variant="outline">Save Draft</Button>
              <Button variant="primary">Submit Application</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
