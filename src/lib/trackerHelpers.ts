import type { TrackerEntry, TrackerOutcome } from '../types/database';

export const TRACKER_STEPS = [
  { id: 0, label: 'Received' },
  { id: 1, label: 'Processing' },
  { id: 2, label: 'Assessment' },
  { id: 3, label: 'Decision' },
] as const;

/**
 * Calculates the current step index (0-3) for a tracker entry.
 * Steps:
 * 0: Received (Application Submitted - First 7 days)
 * 1: Processing (Standard Processing)
 * 2: Assessment (Longer than 80% of average processing time)
 * 3: Decision (Finalized)
 *
 * @param entry The tracker entry
 * @param avgDays Optional average processing days for this visa type
 */
export function calculateTrackerStep(entry: TrackerEntry, avgDays?: number | null): number {
  // If there's a decision date or status is completed, it's the final step
  if (entry.decision_date || entry.status === 'completed' || isOutcomeFinal(entry.outcome)) {
    return 3;
  }

  // If status is pending
  if (entry.status === 'pending') {
    const appDate = new Date(entry.application_date);
    const daysElapsed = (Date.now() - appDate.getTime()) / (1000 * 60 * 60 * 24);

    // If application is very fresh (< 7 days), show as "Received"
    if (daysElapsed < 7) {
      return 0;
    }

    // If we have an average days benchmark, use it to simulate "Assessment" phase
    if (avgDays && avgDays > 0) {
      // If elapsed time is > 80% of average, move to "Assessment"
      if (daysElapsed > avgDays * 0.8) {
        return 2;
      }
    }

    // Otherwise default to "Processing"
    return 1;
  }

  // Default fallback
  return 0;
}

/**
 * Checks if the outcome represents a final state.
 */
function isOutcomeFinal(outcome: TrackerOutcome): boolean {
  return ['approved', 'refused', 'withdrawn'].includes(outcome);
}

/**
 * Returns a variant string for badges based on status/outcome.
 */
export function getStatusBadgeVariant(outcome: TrackerOutcome, status: 'pending' | 'completed'): 'success' | 'danger' | 'warning' | 'default' {
  if (status === 'pending') return 'warning';

  switch (outcome) {
    case 'approved': return 'success';
    case 'refused': return 'danger';
    case 'withdrawn': return 'default';
    default: return 'default';
  }
}

/**
 * Returns a human-readable label for the status.
 */
export function getStatusLabel(outcome: TrackerOutcome, status: 'pending' | 'completed'): string {
  if (status === 'pending') return 'Pending';
  return outcome.charAt(0).toUpperCase() + outcome.slice(1);
}
