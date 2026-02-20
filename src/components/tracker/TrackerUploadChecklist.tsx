import { useState } from 'react';
import { Check, Circle, FileText } from 'lucide-react';

interface Props {
  className?: string;
}

const defaultDocs = [
  'Identity Documents (Passport)',
  'Character Documents (Police Check)',
  'Health Assessment',
  'Evidence of Relationship',
  'Form 80',
  'Form 1221',
  'Biometrics',
  'English Language Test'
];

export function TrackerUploadChecklist({ className = '' }: Props) {
  const [checked, setChecked] = useState<string[]>([]);

  const toggle = (doc: string) => {
    setChecked(prev =>
      prev.includes(doc) ? prev.filter(d => d !== doc) : [...prev, doc]
    );
  };

  return (
    <div className={`border border-neutral-200 rounded-xl p-4 bg-white ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-4 h-4 text-primary-600" />
        <h3 className="text-sm font-medium text-neutral-900">Document Checklist</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {defaultDocs.map(doc => {
          const isChecked = checked.includes(doc);
          return (
            <button
              key={doc}
              type="button"
              onClick={() => toggle(doc)}
              className={`flex items-center gap-2 p-2 rounded-lg border text-left text-sm transition-all ${
                isChecked
                  ? 'bg-primary-50 border-primary-200 text-primary-800'
                  : 'bg-white border-neutral-100 text-neutral-500 hover:border-primary-100'
              }`}
            >
              {isChecked ? <Check className="w-4 h-4 shrink-0" /> : <Circle className="w-4 h-4 shrink-0 opacity-50" />}
              <span className="truncate">{doc}</span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-neutral-400 mt-3 text-center">
        Use this checklist to track your own progress.
      </p>
    </div>
  );
}
