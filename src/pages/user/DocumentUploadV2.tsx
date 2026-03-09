import { FileText, Upload, X, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useState } from 'react';

export function DocumentUploadV2() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Upload Documents</h1>
          <p className="text-slate-400">Submit required documents for your application</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-8">
          <div className="border-2 border-dashed border-slate-300 p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 mx-auto mb-4 flex items-center justify-center">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            
            <p className="text-lg font-medium text-slate-900 mb-2">Drop files here or click to upload</p>
            <p className="text-sm text-slate-500 mb-4">Support PDF, JPG, PNG up to 10MB each</p>
            
            <label className="inline-block">
              <input 
                type="file" 
                multiple 
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <Button variant="outline">Select Files</Button>
            </label>
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-slate-900 mb-3">Selected Files</h3>
              
              <div className="space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-700">{file.name}</span>
                      <span className="text-sm text-slate-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    
                    <button 
                      onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                      className="p-1 text-slate-400 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <Button variant="primary" disabled={files.length === 0}>
              <Upload className="w-4 h-4 mr-2" />
              Upload {files.length > 0 && `(${files.length})`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
