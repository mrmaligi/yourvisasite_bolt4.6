import { FileText, CheckCircle, Clock, AlertCircle, Download, Share2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function DocumentPreviewV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-4 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-white font-medium">Passport_John_Doe.pdf</p>
              <p className="text-slate-400 text-sm">2.4 MB • Uploaded Mar 20, 2024</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-white"><Download className="w-5 h-5" /></button>
            <button className="p-2 text-slate-400 hover:text-white"><Share2 className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 h-[800px] flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">PDF preview would appear here</p>
            <Button variant="outline" className="mt-4">
              <Download className="w-4 h-4 mr-2" />
              Download to View
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
