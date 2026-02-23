import React from 'react';
import { MobileLayout } from '../../components/mobile/MobileLayout';
import { MobileCard } from '../../components/mobile/MobileCard';
import { MobileButton } from '../../components/mobile/MobileButton';

export default function MobileTrackerHome() {
  return (
    <MobileLayout title="Tracker Home" showBack={true}>
      <div className="space-y-4">
        <MobileCard title="Tracker Home">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This is the mobile optimized view for Tracker Home.
          </p>
          <MobileButton>Action</MobileButton>
        </MobileCard>
      </div>
    </MobileLayout>
  );
}
