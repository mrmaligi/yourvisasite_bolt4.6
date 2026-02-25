import { Badge } from '../ui/Badge';
import { getStatusBadgeVariant, getStatusLabel } from '../../lib/trackerHelpers';
import type { TrackerOutcome } from '../../types/database';

interface Props {
  outcome: TrackerOutcome;
  status: 'pending' | 'completed';
  className?: string;
}

export function StatusBadge({ outcome, status, className }: Props) {
  const variant = getStatusBadgeVariant(outcome, status);
  const label = getStatusLabel(outcome, status);

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
