import { MobileLayout } from '../../components/mobile/MobileLayout';
import { MobileCard } from '../../components/mobile/MobileCard';
import { MobileButton } from '../../components/mobile/MobileButton';

export default function MobileVerifyEmail() {
  return (
    <MobileLayout title="Verify Email" showBack={true}>
      <div className="space-y-4">
        <MobileCard title="Verify Email">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This is the mobile optimized view for Verify Email.
          </p>
          <MobileButton>Action</MobileButton>
        </MobileCard>
      </div>
    </MobileLayout>
  );
}
