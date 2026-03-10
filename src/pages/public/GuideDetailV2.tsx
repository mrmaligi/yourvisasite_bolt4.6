import { BookOpen, FileText, Video, Download, ChevronRight } from 'lucide-react';

export function GuideDetailV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <span>Guides</span>
            <span>/</span>
            <span className="text-white">Partner Visa Guide</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Complete Partner Visa Guide</h1>
          <p className="text-slate-400 mt-2">Step-by-step guide to applying for a partner visa</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="bg-white border border-slate-200 p-8">
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Introduction</h2>
            <p className="text-slate-600 mb-6">
              The Partner Visa (subclass 820/801) allows the spouse or de facto partner of an Australian citizen, 
              permanent resident, or eligible New Zealand citizen to live in Australia. This guide will walk you 
              through the entire application process.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 mb-4">Step 1: Check Eligibility</h2>
            <p className="text-slate-600 mb-6">
              Before applying, ensure you meet the basic requirements. You must be in a genuine relationship, 
              meet health and character requirements, and have a sponsor who is an Australian citizen or permanent resident.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 mb-4">Step 2: Gather Documents</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-600 mb-6">
              <li>Identity documents (passport, birth certificate)</li>
              <li>Relationship evidence (photos, joint accounts, leases)</li>
              <li>Character documents (police checks)</li>
              <li>Health examination results</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-900 mb-4">Step 3: Submit Application</h2>
            <p className="text-slate-600 mb-6">
              Apply online through your ImmiAccount. Pay the application fee and upload all required documents. 
              Ensure all information is accurate before submitting.
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Related Resources</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <a href="#" className="flex items-center gap-3 p-4 border border-slate-200 hover:border-blue-600">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-slate-700">Document Checklist</span>
              </a>
              
              <a href="#" className="flex items-center gap-3 p-4 border border-slate-200 hover:border-blue-600">
                <Video className="w-5 h-5 text-blue-600" />
                <span className="text-slate-700">Video Tutorial</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
