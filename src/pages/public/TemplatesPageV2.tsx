import { FileText, Download, FileSpreadsheet, FileImage, FileArchive } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicTemplatesV2() {
  const templates = [
    { name: 'Resume Template', format: 'DOCX', downloads: 5200, icon: FileText },
    { name: 'Sponsorship Letter', format: 'DOCX', downloads: 4100, icon: FileText },
    { name: 'Statutory Declaration', format: 'PDF', downloads: 3800, icon: FileText },
    { name: 'Relationship Statement', format: 'DOCX', downloads: 3500, icon: FileText },
    { name: 'Employment Reference', format: 'DOCX', downloads: 2900, icon: FileText },
    { name: 'Document Checklist', format: 'XLSX', downloads: 4600, icon: FileSpreadsheet },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Document Templates</h1>
          <p className="text-xl text-slate-300">Free professionally crafted templates</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.name} className="bg-white border border-slate-200 p-6">
              <div className="w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
                <template.icon className="w-6 h-6 text-blue-600" />
              </div>
              
              <h3 className="font-semibold text-slate-900">{template.name}</h3>
              <div className="flex items-center gap-2 my-2">
                <span className="px-2 py-1 bg-slate-100 text-xs">{template.format}</span>
                <span className="text-sm text-slate-500">{template.downloads} downloads</span>
              </div>
              
              <Button variant="outline" className="w-full mt-2">
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
