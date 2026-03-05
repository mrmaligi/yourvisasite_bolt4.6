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
      const visaData = preview.visa;
      
      // Check if visa exists
      const { data: existingVisa } = await supabase
        .from('visas')
        .select('id')
        .eq('subclass', visaData.subclass)
        .maybeSingle();

      let visaId: string;

      if (existingVisa) {
        const { error: updateError } = await supabase
          .from('visas')
          .update({
            name: visaData.name,
            category: visaData.category,
            summary: visaData.summary,
            description: visaData.description,
            duration: visaData.duration,
            cost_aud: visaData.cost_aud,
            processing_time_range: visaData.processing_time_range,
            official_url: visaData.official_url,
            key_requirements: visaData.key_requirements,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingVisa.id);

        if (updateError) throw updateError;
        visaId = existingVisa.id;
        newResults.push(`Updated visa ${visaData.subclass} - ${visaData.name}`);
      } else {
        const { data: newVisa, error: insertError } = await supabase
          .from('visas')
          .insert({
            subclass: visaData.subclass,
            name: visaData.name,
            category: visaData.category,
            country: 'Australia',
            summary: visaData.summary,
            description: visaData.description,
            duration: visaData.duration,
            cost_aud: visaData.cost_aud,
            processing_time_range: visaData.processing_time_range,
            official_url: visaData.official_url,
            key_requirements: visaData.key_requirements,
            is_active: true
          })
          .select('id')
          .single();

        if (insertError) throw insertError;
        visaId = newVisa.id;
        newResults.push(`Created new visa ${visaData.subclass} - ${visaData.name}`);
      }

      // Import premium content
      if (preview.premium_content && preview.premium_content.length > 0) {
        let premiumCount = 0;
        for (const content of preview.premium_content) {
          const { error: contentError } = await supabase
            .from('visa_premium_content')
            .upsert({
              visa_id: visaId,
              section_number: content.section_number,
              title: content.title,
              section_title: content.title,
              content_type: content.content_type,
              content: content.content,
              is_published: content.is_published ?? true,
              description: content.title,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'visa_id,section_number'
            });

          if (!contentError) premiumCount++;
        }
        newResults.push(`Imported ${premiumCount} premium content sections`);
      }

      // Import documents
      if (preview.documents?.required) {
        let docCount = 0;
        for (const doc of preview.documents.required) {
          const { error: docError } = await supabase
            .from('visa_documents')
            .upsert({
              visa_id: visaId,
              name: doc.name,
              description: doc.description,
              is_mandatory: doc.is_mandatory,
              document_type: doc.document_type
            }, {
              onConflict: 'visa_id,name'
            });

          if (!docError) docCount++;
        }
        newResults.push(`Imported ${docCount} document requirements`);
      }

      // Import timeline entries
      if (preview.timeline_tracker?.entries) {
        let entryCount = 0;
        for (const entry of preview.timeline_tracker.entries) {
          const { error: entryError } = await supabase
            .from('tracker_entries')
            .insert({
              visa_id: visaId,
              application_date: entry.application_date,
              decision_date: entry.decision_date,
              status: entry.status,
              country: entry.country,
              notes: entry.notes,
              is_public: entry.is_public ?? true,
              created_at: new Date().toISOString()
            });

          if (!entryError) entryCount++;
        }
        newResults.push(`Imported ${entryCount} timeline tracker entries`);
      }

      toast('success', 'Visa import completed successfully!');
    } catch (error: any) {
      newResults.push(`Error: ${error.message}`);
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
