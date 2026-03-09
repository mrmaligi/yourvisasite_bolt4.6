import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Upload, FileJson, CheckCircle, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function VisaImportV2() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setResults(['Partner Visa (820) - Created', 'Skilled Independent (189) - Updated']);
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Import Visas | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-slate-900">Import Visas</h1>
            <p className="text-slate-600">Bulk import visa data from JSON files</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Upload File</h2>
              
              <div className="border-2 border-dashed border-slate-300 p-8 text-center mb-4">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-2">Drag and drop JSON file here</p>
                <p className="text-sm text-slate-500">or click to browse</p>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </div>

              {file && (
                <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 mb-4">
                  <FileJson className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-700">{file.name}</span>
                </div>
              )}

              <Button
                variant="primary"
                className="w-full"
                onClick={handleImport}
                disabled={!file || importing}
              >
                {importing ? 'Importing...' : 'Import Visas'}
              </Button>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Template</h2>
              
              <p className="text-slate-600 mb-4">Download a sample JSON template to get started.</p>

              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>

              <div className="mt-6 p-4 bg-slate-50 border border-slate-200">
                <h3 className="font-medium text-slate-900 mb-2">Supported Fields</h3>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Visa subclass and name</li>
                  <li>• Category and summary</li>
                  <li>• Processing time and cost</li>
                  <li>• Requirements and documents</li>
                </ul>
              </div>
            </div>
          </div>

          {results.length > 0 && (
            <div className="mt-6 bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Import Results</h2>
              
              <div className="space-y-2">
                {results.map((result, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-green-50 border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800">{result}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
