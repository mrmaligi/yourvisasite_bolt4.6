import { FileText, Download, CheckCircle, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicTemplatesV2() {
  const templates = [
    { id: 1, name: 'Partner Visa Cover Letter', format: 'DOCX', downloads: 3400, category: 'Family' },
    { id: 2, name: 'Relationship Statement', format: 'DOCX', downloads: 2800, category: 'Family' },
    { id: 3, name: 'Employment Reference Letter', format: 'DOCX', downloads: 2100, category: 'Work' },
    { id: 4, name: 'Sponsorship Declaration', format: 'PDF', downloads: 1900, category: 'Family' },
    { id: 5, name: 'Statutory Declaration', format: 'DOCX', downloads: 1600, category: 'General' },
    { id: 6, name: 'Resume Template', format: 'DOCX', downloads: 2200, category: 'General' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Free Document Templates</h1>
          <p className="text-xl text-slate-300">Download professionally crafted templates for your visa application</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white border border-slate-200 p-6">
              <div className="w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              
              <span className="text-xs font-medium text-blue-600 uppercase">{template.category}</span>
              <h3 className="font-semibold text-slate-900 mt-1 mb-2">{template.name}</h3>
              
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <span className="px-2 py-1 bg-slate-100">{template.format}</span>
                <span>{template.downloads} downloads</span>
              </div>
              
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
