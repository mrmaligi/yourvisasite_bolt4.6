import { Check, Clock, FileText, Gavel } from 'lucide-react';
import type { TrackerOutcome } from '../../types/database';

interface TrackerTimelineProps {
  stage?: 'received' | 'processing' | 'assessment' | 'decision';
  outcome?: TrackerOutcome;
  applicationDate?: string;
  decisionDate?: string;
  className?: string;
}

export function TrackerTimeline({
  stage = 'received',
  outcome,
  applicationDate,
  decisionDate,
  className = ''
}: TrackerTimelineProps) {
  const stages = [
    { id: 'received', label: 'Received', icon: FileText },
    { id: 'processing', label: 'Processing', icon: Clock },
    { id: 'assessment', label: 'Assessment', icon: Gavel },
    { id: 'decision', label: 'Decision', icon: Check },
  ];

  // If outcome is final (not pending), we are at the end
  const isFinal = outcome && outcome !== 'pending';

  // Calculate current step index
  let currentIndex = stages.findIndex(s => s.id === stage);

  // If final, force to last step
  if (isFinal) {
    currentIndex = stages.length - 1;
  }

  // Fallback if stage not found
  if (currentIndex === -1) currentIndex = 0;

  return (
    <div className={`w-full ${className}`}>
      {/* Mobile view: Vertical */}
      <div className="md:hidden space-y-0">
        {stages.map((s, i) => {
          const isActive = i === currentIndex;
          const isPast = i < currentIndex || isFinal;
          const Icon = s.icon;

          return (
            <div key={s.id} className="flex gap-4 min-h-[80px]">
               <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-colors duration-300
                    ${isPast || isActive ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-neutral-300 text-neutral-300'}
                  `}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {i !== stages.length - 1 && (
                    <div className={`w-0.5 flex-1 my-1 ${isPast ? 'bg-primary-600' : 'bg-neutral-200'}`} />
                  )}
               </div>
               <div className="pb-8 pt-1">
                  <p className={`font-medium ${isPast || isActive ? 'text-neutral-900' : 'text-neutral-500'}`}>{s.label}</p>

                  {isActive && !isFinal && (
                    <p className="text-sm text-primary-600 animate-pulse mt-1">In Progress</p>
                  )}

                  {s.id === 'received' && applicationDate && (
                    <p className="text-xs text-neutral-500 mt-1">Applied: {new Date(applicationDate).toLocaleDateString()}</p>
                  )}

                  {s.id === 'decision' && isFinal && outcome && (
                    <p className={`text-sm font-medium mt-1 capitalize ${
                      outcome === 'approved' ? 'text-green-600' :
                      outcome === 'refused' ? 'text-red-600' : 'text-orange-600'
                    }`}>
                      {outcome}
                      {decisionDate && <span className="text-xs text-neutral-500 block font-normal">{new Date(decisionDate).toLocaleDateString()}</span>}
                    </p>
                  )}
               </div>
            </div>
          );
        })}
      </div>

      {/* Desktop view: Horizontal */}
      <div className="hidden md:block relative pb-10">
         {/* Line Background */}
         <div className="absolute top-4 left-0 right-0 h-0.5 bg-neutral-200 -z-10 mx-4" />

         {/* Line Progress */}
         <div
           className="absolute top-4 left-0 h-0.5 bg-primary-600 -z-10 transition-all duration-500 mx-4"
           style={{ width: `calc(${Math.min((currentIndex / (stages.length - 1)) * 100, 100)}% - 2rem)` }}
         />

         <div className="flex justify-between">
           {stages.map((s, i) => {
             const isActive = i === currentIndex;
             const isPast = i < currentIndex || isFinal;
             const Icon = s.icon;

             return (
               <div key={s.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-white
                    ${isPast || isActive ? 'bg-primary-600 border-primary-600 text-white' : 'border-neutral-300 text-neutral-300'}
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-center mt-3">
                    <p className={`font-medium text-sm ${isPast || isActive ? 'text-neutral-900' : 'text-neutral-500'}`}>{s.label}</p>

                    {s.id === 'received' && applicationDate && (
                      <p className="text-xs text-neutral-500 mt-1">{new Date(applicationDate).toLocaleDateString()}</p>
                    )}

                    {s.id === 'decision' && isFinal && outcome && (
                       <div className="mt-1">
                          <p className={`text-xs font-bold uppercase ${
                            outcome === 'approved' ? 'text-green-600' :
                            outcome === 'refused' ? 'text-red-600' : 'text-orange-600'
                          }`}>{outcome}</p>
                          {decisionDate && <p className="text-xs text-neutral-500">{new Date(decisionDate).toLocaleDateString()}</p>}
                       </div>
                    )}
                  </div>
               </div>
             );
           })}
         </div>
      </div>
    </div>
  );
}
