import React from 'react';
import { MobileLayout } from '../../components/mobile/MobileLayout';
import { MobileCard } from '../../components/mobile/MobileCard';
import { MobileButton } from '../../components/mobile/MobileButton';

export default function MobileOnboardingStep2() {
  return (
    <MobileLayout title="Onboarding Step2" showBack={true}>
      <div className="space-y-4">
        <MobileCard title="Onboarding Step2">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This is the mobile optimized view for Onboarding Step2.
          </p>
          <MobileButton>Action</MobileButton>
        </MobileCard>
      </div>
    </MobileLayout>
  );
}
