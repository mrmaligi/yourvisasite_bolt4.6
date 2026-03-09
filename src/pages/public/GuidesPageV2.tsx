import { FileText, CheckCircle, Download, ArrowRight, Lock } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicGuidesPageV2() {
  const guides = [
    { id: 1, title: 'Complete Partner Visa Guide', type: 'PDF', pages: 45, downloads: 3400 },
    { id: 2, title: 'Skilled Migration Handbook', type: 'PDF', pages: 32, downloads: 2800 },
    { id: 3, title: 'Student Visa Essentials', type: 'PDF', pages: 28, downloads: 2100 },
    { id: 4, title: 'Business Visa Roadmap', type: 'PDF', pages: 38, downloads: 1900 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Free Guides</h1>
          <p className="text-xl text-slate-300">Comprehensive resources for your visa journey</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {guides.map((guide) => (
            <div key={guide.id} className="bg-white border border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-20 bg-blue-100 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 text-lg">{guide.title}</h3>
                  <p className="text-slate-500">{guide.pages} pages • {guide.downloads} downloads</p>
                  
                  <Button variant="outline" size="sm" className="mt-4">
                    <Download className="w-4 h-4 mr-1" />
                    Download Free
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 p-6 text-center">
          <Lock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-semibold text-blue-900 mb-2">Premium Content</h3>
          <p className="text-blue-700 mb-4">Get access to exclusive guides and templates with a Premium subscription.</p>
          <Button variant="primary">View Premium Plans</Button>
        </div>
      </div>
    </div>
  );
}
