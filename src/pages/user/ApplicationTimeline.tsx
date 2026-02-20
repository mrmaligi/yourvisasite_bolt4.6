import { Helmet } from 'react-helmet-async';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { TrackerTimeline } from '../../components/tracker/TrackerTimeline';

export function ApplicationTimeline() {
  const applicationSteps = [
    { id: '1', label: 'Application Received', status: 'completed' as const, date: 'Oct 15, 2023', description: 'Your application was successfully submitted.' },
    { id: '2', label: 'Assessment Started', status: 'completed' as const, date: 'Oct 20, 2023', description: 'A case officer has been assigned.' },
    { id: '3', label: 'Document Request', status: 'current' as const, description: 'Please provide additional evidence of relationship.' },
    { id: '4', label: 'Final Decision', status: 'upcoming' as const, description: 'Expected by Dec 2023' }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Helmet>
        <title>Application Timeline | VisaBuild</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Application Timeline</h1>
        <p className="text-neutral-500 mt-1">Track the progress of your active application.</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Visa Subclass 820</h2>
          <p className="text-sm text-neutral-500">Partner Visa (Temporary)</p>
        </CardHeader>
        <CardBody className="py-10">
           <TrackerTimeline steps={applicationSteps} />

           <div className="mt-12 space-y-6 max-w-2xl mx-auto">
             <h3 className="font-semibold text-neutral-900 dark:text-white">Detailed Activity Log</h3>
             <div className="border-l-2 border-neutral-200 dark:border-neutral-700 ml-3 pl-6 space-y-8">
               <div className="relative">
                 <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-primary-500 ring-4 ring-white dark:ring-neutral-800" />
                 <p className="text-sm text-neutral-500 mb-1">Today</p>
                 <p className="font-medium text-neutral-900 dark:text-white">Request for Information</p>
                 <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
                   Department requested updated Form 80. Action required within 28 days.
                 </p>
               </div>

               <div className="relative">
                 <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-neutral-300 ring-4 ring-white dark:ring-neutral-800" />
                 <p className="text-sm text-neutral-500 mb-1">Oct 20, 2023</p>
                 <p className="font-medium text-neutral-900 dark:text-white">Status Changed to 'Assessment'</p>
               </div>

               <div className="relative">
                 <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-neutral-300 ring-4 ring-white dark:ring-neutral-800" />
                 <p className="text-sm text-neutral-500 mb-1">Oct 15, 2023</p>
                 <p className="font-medium text-neutral-900 dark:text-white">Application Lodged</p>
                 <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
                   Submitted via ImmiAccount. Receipt #99887766.
                 </p>
               </div>
             </div>
           </div>
        </CardBody>
      </Card>
    </div>
  );
}
