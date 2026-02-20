import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FileText, Check, ChevronDown, ChevronUp, Upload } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const categories = [
  {
    id: 'identity',
    title: 'Identity Documents',
    items: [
      { id: 'passport', label: 'Valid Passport', required: true, status: 'uploaded' },
      { id: 'birth_cert', label: 'Birth Certificate', required: true, status: 'pending' },
      { id: 'national_id', label: 'National ID Card', required: false, status: 'pending' }
    ]
  },
  {
    id: 'character',
    title: 'Character Documents',
    items: [
      { id: 'police_check', label: 'Police Clearance Certificate', required: true, status: 'pending' },
      { id: 'form_80', label: 'Form 80 - Personal Particulars', required: true, status: 'uploaded' }
    ]
  },
  {
    id: 'evidence',
    title: 'Relationship Evidence',
    items: [
      { id: 'joint_bank', label: 'Joint Bank Account Statement', required: true, status: 'pending' },
      { id: 'lease', label: 'Lease Agreement', required: true, status: 'pending' },
      { id: 'photos', label: 'Photos of Relationship', required: false, status: 'pending' }
    ]
  }
];

export function DocumentChecklist() {
  const [expanded, setExpanded] = useState<string[]>(['identity']);

  const toggleExpand = (id: string) => {
    setExpanded(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Helmet>
        <title>Document Checklist | VisaBuild</title>
      </Helmet>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Document Checklist</h1>
          <p className="text-neutral-500 mt-1">Manage and track your required documents.</p>
        </div>
        <Button variant="secondary" onClick={() => window.location.href = '/dashboard/documents'}>
          Go to Uploads
        </Button>
      </div>

      <div className="space-y-4">
        {categories.map((category) => {
          const isExpanded = expanded.includes(category.id);
          const completedCount = category.items.filter(i => i.status === 'uploaded').length;
          const totalCount = category.items.length;
          const allCompleted = completedCount === totalCount;

          return (
            <Card key={category.id} className="overflow-hidden">
              <div
                className="p-4 flex items-center justify-between cursor-pointer bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                onClick={() => toggleExpand(category.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${allCompleted ? 'bg-green-100 text-green-600' : 'bg-primary-100 text-primary-600'}`}>
                    {allCompleted ? <Check className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">{category.title}</h3>
                    <p className="text-sm text-neutral-500">{completedCount}/{totalCount} items uploaded</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   {/* Progress bar */}
                   <div className="w-24 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden hidden sm:block">
                     <div
                       className="h-full bg-green-500 transition-all duration-500"
                       style={{ width: `${(completedCount / totalCount) * 100}%` }}
                     />
                   </div>
                   {isExpanded ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                </div>
              </div>

              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-neutral-200 dark:border-neutral-700"
                >
                  <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
                    {category.items.map((item) => (
                      <div key={item.id} className="p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 w-2 h-2 rounded-full ${item.status === 'uploaded' ? 'bg-green-500' : 'bg-neutral-300'}`} />
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                              {item.label}
                              {item.required && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Required</Badge>}
                            </p>
                            <p className="text-xs text-neutral-500 mt-0.5 capitalize">Status: {item.status}</p>
                          </div>
                        </div>

                        {item.status === 'pending' ? (
                           <Button size="sm" variant="secondary" className="h-8 text-xs gap-2">
                             <Upload className="w-3 h-3" /> Upload
                           </Button>
                        ) : (
                          <span className="text-xs font-medium text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                            <Check className="w-3 h-3" /> Uploaded
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
