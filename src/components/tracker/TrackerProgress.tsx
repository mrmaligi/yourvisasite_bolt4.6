import { motion } from 'framer-motion';

interface Props {
  percentage: number;
  label?: string;
  sublabel?: string;
  variant?: 'linear' | 'circular';
  color?: string; // Tailwind class
}

export function TrackerProgress({ percentage, label, sublabel, variant = 'linear', color = 'bg-primary-600' }: Props) {
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  if (variant === 'circular') {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (safePercentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="6"
              className="text-neutral-100"
            />
            <motion.circle
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: "easeOut" }}
              cx="40"
              cy="40"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeLinecap="round"
              className={color.replace('bg-', 'text-')}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-neutral-900">{Math.round(safePercentage)}%</span>
          </div>
        </div>
        {(label || sublabel) && (
          <div className="mt-2 text-center">
            {label && <p className="text-sm font-medium text-neutral-900">{label}</p>}
            {sublabel && <p className="text-xs text-neutral-500">{sublabel}</p>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1">
        {label && <span className="font-medium text-sm text-neutral-900">{label}</span>}
        <span className="text-xs font-semibold text-neutral-500">{Math.round(safePercentage)}%</span>
      </div>
      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${safePercentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      {sublabel && <p className="text-xs text-neutral-500 mt-1">{sublabel}</p>}
    </div>
  );
}
