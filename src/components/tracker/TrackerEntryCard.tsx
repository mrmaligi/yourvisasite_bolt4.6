import { Card, CardBody } from '../ui/Card';
import { StatusBadge } from './StatusBadge';
import { TrackerTimeline } from './TrackerTimeline';
import { calculateTrackerStep } from '../../lib/trackerHelpers';
import { Clock, Calendar } from 'lucide-react';
import type { TrackerEntry, Visa } from '../../types/database';

interface Props {
  entry: TrackerEntry & {
      visas?: Pick<Visa, 'name' | 'subclass'> | null,
      visa_name?: string | null // Handle both structures (User dashboard vs Lawyer dashboard)
  };
  onClick?: () => void;
  avgDays?: number; // Optional average for timeline calculation
}

export function TrackerEntryCard({ entry, onClick, avgDays }: Props) {
  const currentStep = calculateTrackerStep(entry, avgDays);
  const visaName = entry.visas?.name || entry.visa_name || 'Unknown Visa';
  const visaSubclass = entry.visas?.subclass || '';

  const timelineSteps = [
    { id: '0', label: 'Received', status: currentStep === 0 ? 'current' : currentStep > 0 ? 'completed' : 'upcoming' },
    { id: '1', label: 'Processing', status: currentStep === 1 ? 'current' : currentStep > 1 ? 'completed' : 'upcoming' },
    { id: '2', label: 'Assessment', status: currentStep === 2 ? 'current' : currentStep > 2 ? 'completed' : 'upcoming' },
    { id: '3', label: 'Decision', status: currentStep === 3 ? 'current' : currentStep > 3 ? 'completed' : 'upcoming' }
  ] as any;

  return (
    <Card hover className="cursor-pointer transition-all hover:shadow-md mb-4" onClick={onClick}>
      <CardBody className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {visaSubclass && (
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-neutral-100 text-neutral-600">
                  {visaSubclass}
                </span>
              )}
              <StatusBadge outcome={entry.outcome} status={entry.status} />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white leading-tight">
              {visaName}
            </h3>
          </div>

          <div className="flex flex-col sm:items-end gap-1 text-sm text-neutral-500">
             <div className="flex items-center gap-1.5">
               <Calendar className="w-4 h-4" />
               <span>Applied: {new Date(entry.application_date).toLocaleDateString()}</span>
             </div>
             {entry.status === 'pending' && (
               <div className="flex items-center gap-1.5 text-orange-600 font-medium">
                 <Clock className="w-4 h-4" />
                 <span>
                    Waiting {Math.floor((Date.now() - new Date(entry.application_date).getTime()) / (1000 * 60 * 60 * 24))} days
                 </span>
               </div>
             )}
          </div>
        </div>

        <div className="pt-2 pb-2">
          <TrackerTimeline steps={timelineSteps} />
        </div>
      </CardBody>
    </Card>
  );
}
