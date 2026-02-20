import React from 'react';
import { MobileLayout } from '../../components/mobile/MobileLayout';
import { MobileCard } from '../../components/mobile/MobileCard';
import { MobileButton } from '../../components/mobile/MobileButton';

export default function MobileRegister() {
  return (
    <MobileLayout title="Register" showBack={true}>
      <div className="space-y-4">
        <MobileCard title="Register">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This is the mobile optimized view for Register.
          </p>
          <MobileButton>Action</MobileButton>
        </MobileCard>
      </div>
    </MobileLayout>
  );
}
