import { useState, useRef } from 'react';
import { Upload, FileJson, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';

interface VisaImportData {
  version: string;
  visa: {
    subclass: string;
    name: string;
    category: string;
    summary: string;
    description?: string;
    duration?: string;
    cost_aud?: string;
    processing_time_range?: string;
    official_url?: string;
    key_requirements?: string;
  };
  premium_content?: Array<{
    section_number: number;
    title: string;
    content_type: string;
    content: string;
    is_published?: boolean;
  }>;
  documents?: {
    required?: Array<{
      name: string;
      description?: string;
      is_mandatory: boolean;
      document_type: string;
    }>;
    folders?: Array<{
      name: string;
      description?: string;
      order: number;
    }>;
  };
  timeline_tracker?: {
    entries?: Array<{
      application_date: string;
      decision_date?: string;
      status: string;
      country?: string;
      notes?: string;
      is_public?: boolean;
    }>;
  };
}

export function VisaImport() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<VisaImportData | null>(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile && selectedFile.type === 'application/json') {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          setPreview(data);
          toast('success', 'JSON file loaded successfully');
        } catch (error) {
          toast('error', 'Invalid JSON file');
          setFile(null);
        }
      };
      reader.readAsText(selectedFile);
    } else {
      toast('error', 'Please select a valid JSON file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const downloadTemplate = () => {
    const template = {
      version: "1.0",
      visa: {
        subclass: "417",
        name: "Working Holiday",
        category: "visitor",
        summary: "Brief summary here...",
        description: "Full description...",
        duration: "12 months",
        cost_aud: "AUD $635",
        processing_time_range: "18-35 days",
        official_url: "https://...",
        key_requirements: "Requirement 1\nRequirement 2"
      },
      premium_content: [
        {
          section_number: 1,
          title: "Executive Overview",
          content_type: "guide",
          content: "Detailed content...",
          is_published: true
        }
      ],
      documents: {
        required: [
          {
            name: "Valid Passport",
            description: "6+ months validity",
            is_mandatory: true,
            document_type: "identity"
          }
        ],
        folders: [
          {
            name: "Identity Documents",
            description: "Passport, photos",
            order: 1
          }
        ]
      },
      timeline_tracker: {
        entries: [
          {
            application_date: "2025-01-27",
            decision_date: "2025-02-15",
            days: 19,
            status: "granted",
            country: "UK",
            is_public: true
          }
        ]
      }
    };

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'visa-import-template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importVisa = async () => {
    if (!preview) return;
    
    setImporting(true);
    setResults([]);
    const newResults: string[] = [];

    try {
      // Use Edge Function for import (bypasses RLS)
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/import-visa`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(preview),
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Import failed');
      }

      newResults.push(`✅ ${result.message}`);
      if (result.results.premiumContent > 0) {
        newResults.push(`✅ Imported ${result.results.premiumContent} premium content sections`);
      }
      if (result.results.documents > 0) {
        newResults.push(`✅ Imported ${result.results.documents} document requirements`);
      }
      if (result.results.timelineEntries > 0) {
        newResults.push(`✅ Imported ${result.results.timelineEntries} timeline entries`);
      }

      toast('success', 'Visa import completed successfully!');
    } catch (error: any) {
      newResults.push(`❌ Error: ${error.message}`);
      toast('error', 'Import failed: ' + error.message);
    }

    setResults(newResults);
    setImporting(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Import Visa Data</h1>
        <p className="text-neutral-500 mt-1">
          Upload a JSON file to import complete visa information.
        </p>
      </div>

      <div className="mb-6">
        <Button variant="secondary" onClick={downloadTemplate}>
          <Download className="w-4 h-4 mr-2" />
          Download Template
        </Button>
      </div>

      {!preview ? (
        <Card>
          <CardBody>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-300 rounded-lg p-12 text-center cursor-pointer hover:border-neutral-400"
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".json,application/json"
                onChange={handleChange}
                className="hidden"
              />
              <FileJson className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
              <p className="text-neutral-600 font-medium mb-1">
                Drag and drop a JSON file here, or click to browse
              </p>
              <p className="text-sm text-neutral-400">
                Supports visa import files (.json)
              </p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-semibold">Preview: {preview.visa.name} (Subclass {preview.visa.subclass})</h2>
            </CardHeader>
            <CardBody>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-500">Category</p>
                  <p className="font-medium capitalize">{preview.visa.category}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-500">Cost</p>
                  <p className="font-medium">{preview.visa.cost_aud || 'N/A'}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-500">Processing Time</p>
                  <p className="font-medium">{preview.visa.processing_time_range || 'N/A'}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-500">Duration</p>
                  <p className="font-medium">{preview.visa.duration || 'N/A'}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Premium Content Sections</span>
                  <span className="font-medium">{preview.premium_content?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Required Documents</span>
                  <span className="font-medium">{preview.documents?.required?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Timeline Entries</span>
                  <span className="font-medium">{preview.timeline_tracker?.entries?.length || 0}</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => { setFile(null); setPreview(null); setResults([]); }}
              disabled={importing}
            >
              Cancel
            </Button>
            <Button
              onClick={importVisa}
              loading={importing}
              disabled={importing}
            >
              <Upload className="w-4 h-4 mr-2" />
              {importing ? 'Importing...' : 'Import Visa Data'}
            </Button>
          </div>
        </>
      )}

      {results.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Import Results</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="font-medium text-green-800">{result}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
