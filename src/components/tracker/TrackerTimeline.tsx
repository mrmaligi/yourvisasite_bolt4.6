import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export interface TimelineStep {
  id: string;
  label: string;
  date?: string;
  status: 'completed' | 'current' | 'upcoming';
  description?: string;
}

interface Props {
  steps: TimelineStep[];
  className?: string;
}

export function TrackerTimeline({ steps, className = '' }: Props) {
  const currentStepIndex = steps.findIndex(s => s.status === 'current');
  // If no step is current (e.g. all completed), progress is 100%
  const progressIndex = currentStepIndex === -1 && steps.every(s => s.status === 'completed')
    ? steps.length - 1
    : currentStepIndex === -1 ? 0 : currentStepIndex;

  return (
    <div className={`w-full overflow-x-auto pb-4 ${className}`}>
      <div className="min-w-[600px] flex items-start justify-between relative px-10 pt-2">
        {/* Connecting Line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-neutral-100 -z-10 mx-10">
          <div
            className="h-full bg-primary-200 transition-all duration-500"
            style={{
              width: `${(progressIndex / (steps.length - 1)) * 100}%`
            }}
          />
        </div>

        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';

          return (
            <div key={step.id} className="flex flex-col items-center text-center w-32 relative group">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`w-9 h-9 rounded-full flex items-center justify-center border-4 z-10 transition-colors duration-300 ${
                  isCompleted
                    ? 'bg-primary-600 border-primary-100 text-white'
                    : isCurrent
                      ? 'bg-white border-primary-600 text-primary-600 shadow-lg shadow-primary-200'
                      : 'bg-white border-neutral-200 text-neutral-300'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
              </motion.div>

              <div className="mt-3">
                <p className={`text-sm font-semibold transition-colors ${
                  isCurrent ? 'text-primary-700' : isCompleted ? 'text-neutral-900' : 'text-neutral-400'
                }`}>
                  {step.label}
                </p>
                {step.date && <p className="text-xs text-neutral-500 mt-0.5">{step.date}</p>}
                {step.description && (
                  <div className="hidden group-hover:block absolute top-full left-1/2 -translate-x-1/2 bg-white border border-neutral-200 p-2 rounded shadow-lg z-20 w-48 mt-2 text-xs text-neutral-600 text-left">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-white"></div>
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
