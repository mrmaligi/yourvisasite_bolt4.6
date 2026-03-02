import { describe, it, expect } from 'bun:test';
import { calculateTrackerStep, getStatusBadgeVariant } from './trackerHelpers';
import type { TrackerEntry } from '../types/database';

describe('trackerHelpers', () => {
  describe('calculateTrackerStep', () => {
    it('should return 3 (Decision) if decision_date is present', () => {
      const entry = { decision_date: '2023-01-01', status: 'completed' } as TrackerEntry;
      expect(calculateTrackerStep(entry)).toBe(3);
    });

    it('should return 3 (Decision) if outcome is approved', () => {
      const entry = { outcome: 'approved', status: 'completed' } as TrackerEntry;
      expect(calculateTrackerStep(entry)).toBe(3);
    });

    it('should return 0 (Received) if status is pending and elapsed < 7 days', () => {
      const appDate = new Date(); // now
      const entry = {
        application_date: appDate.toISOString(),
        status: 'pending',
        outcome: 'pending'
      } as TrackerEntry;
      expect(calculateTrackerStep(entry)).toBe(0);
    });

    it('should return 1 (Processing) if status is pending and elapsed > 7 days', () => {
      const appDate = new Date();
      appDate.setDate(appDate.getDate() - 10); // 10 days ago
      const entry = {
        application_date: appDate.toISOString(),
        status: 'pending',
        outcome: 'pending'
      } as TrackerEntry;
      expect(calculateTrackerStep(entry)).toBe(1);
    });

    it('should return 2 (Assessment) if elapsed > 80% of avgDays', () => {
      const avgDays = 100;
      const appDate = new Date();
      appDate.setDate(appDate.getDate() - 90); // 90 days ago (90%)
      const entry = {
        application_date: appDate.toISOString(),
        status: 'pending',
        outcome: 'pending'
      } as TrackerEntry;
      expect(calculateTrackerStep(entry, avgDays)).toBe(2);
    });
  });

  describe('getStatusBadgeVariant', () => {
    it('should return warning for pending status', () => {
      expect(getStatusBadgeVariant('pending', 'pending')).toBe('warning');
    });

    it('should return success for approved outcome', () => {
      expect(getStatusBadgeVariant('approved', 'completed')).toBe('success');
    });

    it('should return danger for refused outcome', () => {
      expect(getStatusBadgeVariant('refused', 'completed')).toBe('danger');
    });
  });
});
