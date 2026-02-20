import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, FileText, ArrowLeft, Type, AlignLeft } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input, Textarea } from '../../../components/ui/Input';
import { Link } from 'react-router-dom';
import { useToast } from '../../../components/ui/Toast';

export const ContractEditor = () => {
  const { addToast } = useToast();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Untitled Contract');

  const handleSave = () => {
    // Simulate save
    setTimeout(() => {
      addToast('Contract saved to drafts', 'success');
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/lawyer/contracts">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Edit Contract</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Preview</Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="min-h-[600px] flex flex-col">
            <CardHeader className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 p-2 flex gap-2">
              <button className="p-2 hover:bg-white dark:hover:bg-neutral-700 rounded transition-colors" title="Bold">
                <span className="font-bold">B</span>
              </button>
              <button className="p-2 hover:bg-white dark:hover:bg-neutral-700 rounded transition-colors" title="Italic">
                <span className="italic">I</span>
              </button>
              <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-2" />
              <button className="p-2 hover:bg-white dark:hover:bg-neutral-700 rounded transition-colors" title="Align Left">
                <AlignLeft className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardBody className="flex-1 p-0">
              <textarea
                className="w-full h-full p-8 resize-none focus:outline-none bg-transparent"
                placeholder="Start typing your contract terms here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Contract Details</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Contract Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Client
                </label>
                <select className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 p-2.5 bg-transparent">
                  <option>Select Client...</option>
                  <option>Alice Smith</option>
                  <option>Bob Jones</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Template
                </label>
                <select className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 p-2.5 bg-transparent">
                  <option>None (Blank)</option>
                  <option>Standard Retainer</option>
                  <option>Consultation Agreement</option>
                </select>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Variables</h2>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-neutral-500 mb-4">
                Drag and drop placeholders into the document.
              </p>
              <div className="flex flex-wrap gap-2">
                {['{{client_name}}', '{{date}}', '{{fee_amount}}', '{{service_list}}'].map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-move">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
