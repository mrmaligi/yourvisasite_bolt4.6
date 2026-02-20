import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Code, Copy, LayoutTemplate, ExternalLink } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/Toast';

export const LeadCapture = () => {
  const { addToast } = useToast();

  const embedCode = `<script src="https://visabuild.com/embed/lead-form.js" data-lawyer-id="123"></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    addToast('Embed code copied', 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Lead Capture</h1>
          <p className="text-neutral-500 mt-1">Tools to capture client information</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Contact Form Embed</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-neutral-600 dark:text-neutral-300 text-sm">
              Add a professional inquiry form to your personal website. Leads will automatically appear in your dashboard.
            </p>
            <div className="bg-neutral-900 text-neutral-100 p-4 rounded-lg font-mono text-xs overflow-x-auto relative">
              {embedCode}
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-1.5 hover:bg-white/10 rounded transition-colors text-neutral-400 hover:text-white"
                title="Copy"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <Button variant="secondary" className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              Preview Form
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Landing Page Templates</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 flex items-center gap-4 hover:border-primary-300 transition-colors cursor-pointer">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <LayoutTemplate className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 dark:text-white">Visa Assessment</h3>
                <p className="text-xs text-neutral-500">High conversion quiz style</p>
              </div>
            </div>
            <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 flex items-center gap-4 hover:border-primary-300 transition-colors cursor-pointer">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <LayoutTemplate className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 dark:text-white">General Inquiry</h3>
                <p className="text-xs text-neutral-500">Simple contact form</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </motion.div>
  );
};
