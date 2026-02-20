import React from 'react';
import { MobileLayout } from '../../components/mobile/MobileLayout';
import { MobileCard } from '../../components/mobile/MobileCard';
import { MobileButton } from '../../components/mobile/MobileButton';

export default function MobileTrackerMessages() {
  return (
    <MobileLayout title="Tracker Messages" showBack={true}>
      <div className="space-y-4">
        <MobileCard title="Tracker Messages">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This is the mobile optimized view for Tracker Messages.
          </p>
          <MobileButton>Action</MobileButton>
        </MobileCard>
      </div>
    </MobileLayout>
  );
}
