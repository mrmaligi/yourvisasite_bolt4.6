import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle } from 'lucide-react';

import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FileUpload } from '@/components/ui/FileUpload';
import { useToast } from '@/components/ui/Toast';

export function ReportIssue() {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast('error', 'Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast('success', 'Issue reported successfully. We will investigate.');
    setSubmitting(false);
    setTitle('');
    setDescription('');
    setFile(null);
  };

  return (
    <>
      <Helmet>
        <title>Report an Issue | VisaBuild</title>
      </Helmet>

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Report an Issue</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Found a bug? Let us know so we can fix it.
          </p>
        </div>

        <Card>
          <CardHeader>
             <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-neutral-500" />
                Issue Details
              </h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Issue Title"
                placeholder="e.g., Cannot upload document"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe what happened..."
                  rows={5}
                  className="w-full rounded-lg border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Screenshot (Optional)
                </label>
                <FileUpload
                  onFileSelect={(f) => setFile(f)}
                  compact
                />
                {file && (
                    <p className="mt-2 text-sm text-neutral-600">Selected: {file.name}</p>
                )}
              </div>

              <div className="pt-2">
                <Button type="submit" loading={submitting}>
                  Submit Report
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
