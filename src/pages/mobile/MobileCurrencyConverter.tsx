import React from 'react';
import { MobileLayout } from '../../components/mobile/MobileLayout';
import { MobileCard } from '../../components/mobile/MobileCard';
import { MobileButton } from '../../components/mobile/MobileButton';

export default function MobileCurrencyConverter() {
  return (
    <MobileLayout title="Currency Converter" showBack={true}>
      <div className="space-y-4">
        <MobileCard title="Currency Converter">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This is the mobile optimized view for Currency Converter.
          </p>
          <MobileButton>Action</MobileButton>
        </MobileCard>
      </div>
    </MobileLayout>
  );
}
