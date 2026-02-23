import { MobileLayout } from '../../components/mobile/MobileLayout';
import { MobileCard } from '../../components/mobile/MobileCard';
import { MobileButton } from '../../components/mobile/MobileButton';

export default function MobileForgotPassword() {
  return (
    <MobileLayout title="Forgot Password" showBack={true}>
      <div className="space-y-4">
        <MobileCard title="Forgot Password">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This is the mobile optimized view for Forgot Password.
          </p>
          <MobileButton>Action</MobileButton>
        </MobileCard>
      </div>
    </MobileLayout>
  );
}
