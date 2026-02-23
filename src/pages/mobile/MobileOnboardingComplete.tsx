import React from 'react';
import { MobileLayout } from '../../components/mobile/MobileLayout';
import { MobileCard } from '../../components/mobile/MobileCard';
import { MobileButton } from '../../components/mobile/MobileButton';

export default function MobileOnboardingComplete() {
  return (
    <MobileLayout title="Onboarding Complete" showBack={true}>
      <div className="space-y-4">
        <MobileCard title="Onboarding Complete">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This is the mobile optimized view for Onboarding Complete.
          </p>
          <MobileButton>Action</MobileButton>
        </MobileCard>
      </div>
    </MobileLayout>
  );
}
