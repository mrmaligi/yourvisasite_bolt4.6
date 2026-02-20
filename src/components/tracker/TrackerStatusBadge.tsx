import { Badge } from '../ui/Badge';
import type { TrackerOutcome } from '../../types/database';

interface TrackerStatusBadgeProps {
  stage?: 'received' | 'processing' | 'assessment' | 'decision';
  outcome?: TrackerOutcome;
  className?: string;
}

export function TrackerStatusBadge({ stage, outcome, className }: TrackerStatusBadgeProps) {
  if (outcome === 'approved') {
    return <Badge variant="success" className={className}>Approved</Badge>;
  }
  if (outcome === 'refused') {
    return <Badge variant="danger" className={className}>Refused</Badge>;
  }
  if (outcome === 'withdrawn') {
    return <Badge variant="warning" className={className}>Withdrawn</Badge>;
  }

  // If outcome is pending or null, use stage
  switch (stage) {
    case 'received':
      return <Badge variant="info" className={className}>Received</Badge>;
    case 'processing':
      return <Badge variant="primary" className={className}>Processing</Badge>;
    case 'assessment':
      return <Badge variant="warning" className={className}>Assessment</Badge>;
    case 'decision':
      // Should have been handled by outcome check above, but if outcome is pending:
      return <Badge variant="default" className={className}>Decision Pending</Badge>;
    default:
      return <Badge variant="default" className={className}>Pending</Badge>;
  }
}
