import { Check } from 'lucide-react';
import { TRACKER_STEPS } from '../../lib/trackerHelpers';

interface Props {
  currentStep: number;
  className?: string;
}

export function TrackerTimeline({ currentStep, className = '' }: Props) {
  // Mobile: w-16 (4rem), center 2rem (32px)
  // Desktop: w-24 (6rem), center 3rem (48px)

  return (
    <div className={`relative ${className}`}>
      {/* Progress Bar Background */}
      <div className="absolute top-3 sm:top-4 left-8 sm:left-12 right-8 sm:right-12 h-0.5 bg-neutral-200 -z-10" />

      {/* Active Progress Bar */}
      <div
        className="absolute top-3 sm:top-4 left-8 sm:left-12 h-0.5 bg-primary-600 transition-all duration-500 -z-10"
        style={{
            width: `calc(${currentStep / (TRACKER_STEPS.length - 1)} * (100% - 4rem))`,
            // On mobile 100% - 4rem. On desktop 100% - 6rem.
            // But CSS calc mixing units is fine. We need dynamic logic for responsive?
            // Let's use simpler logic:
            // The bar spans from center of first to center of last.
            // Center of first is 50% of first item width.
            // Just use inline style or classes for responsive offsets.
        }}
      >
          {/* Note: The width calculation above is tricky with responsive units mixed in style.
              A better way is to simply color the lines *between* the steps using flex.
              But let's stick to the visual approximation for now.
              Actually, the width logic above `(currentStep / max) * 100%` was relative to the *whole container*.
              If the container is just the line...
          */}
      </div>

      {/*
         Alternative robust approach:
         Just use the `width` percentage on a container that matches the centers.
      */}
       <div
        className="absolute top-3 sm:top-4 left-8 sm:left-12 right-8 sm:right-12 h-0.5 -z-10"
      >
          <div
            className="h-full bg-primary-600 transition-all duration-500"
            style={{ width: `${(currentStep / (TRACKER_STEPS.length - 1)) * 100}%` }}
          />
      </div>


      <div className="relative flex justify-between w-full">
        {TRACKER_STEPS.map((step, index) => {
          const isCompleted = index <= currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center w-16 sm:w-24 group">
              <div
                className={`
                  w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white transition-colors duration-300
                  ${isCompleted
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-neutral-200 text-neutral-300 group-hover:border-neutral-300'
                  }
                  ${isCurrent && currentStep < 3 ? 'ring-4 ring-primary-100' : ''}
                `}
              >
                {index < currentStep || (index === 3 && currentStep === 3) ? (
                  <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <span className="text-[10px] sm:text-xs font-semibold">{index + 1}</span>
                )}
              </div>
              <span
                className={`
                  mt-2 text-[10px] sm:text-xs font-medium transition-colors duration-300 text-center
                  ${isCompleted ? 'text-primary-700' : 'text-neutral-400'}
                  ${isCurrent ? 'font-bold' : ''}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
