import { Badge } from '../../components/ui/Badge';
import { HelpCircle } from 'lucide-react';
import type { TrackerOutcome } from '../../types/database';

interface Props {
  status: TrackerOutcome | 'pending';
  className?: string;
}

const statusConfig: Record<string, { label: string; variant: 'warning' | 'success' | 'danger' | 'default'; tooltip: string }> = {
  pending: { label: 'Pending', variant: 'warning', tooltip: 'Application is under review' },
  approved: { label: 'Approved', variant: 'success', tooltip: 'Application has been granted' },
  refused: { label: 'Refused', variant: 'danger', tooltip: 'Application has been refused' },
  withdrawn: { label: 'Withdrawn', variant: 'default', tooltip: 'Application was withdrawn by applicant' },
};

export function TrackerStatusBadge({ status, className = '' }: Props) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className={`group relative inline-flex items-center ${className}`}>
      <Badge variant={config.variant} className="cursor-help pr-1">
        {config.label}
        <HelpCircle className="ml-1 w-3 h-3 inline-block opacity-50" />
      </Badge>
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
        {config.tooltip}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900"></div>
      </div>
    </div>
  );
}
