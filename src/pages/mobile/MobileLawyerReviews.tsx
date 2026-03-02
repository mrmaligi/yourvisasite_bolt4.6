import { MobileLayout } from '../../components/mobile/MobileLayout';
import { MobileCard } from '../../components/mobile/MobileCard';
import { MobileButton } from '../../components/mobile/MobileButton';

export default function MobileLawyerReviews() {
  return (
    <MobileLayout title="Lawyer Reviews" showBack={true}>
      <div className="space-y-4">
        <MobileCard title="Lawyer Reviews">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This is the mobile optimized view for Lawyer Reviews.
          </p>
          <MobileButton>Action</MobileButton>
        </MobileCard>
      </div>
    </MobileLayout>
  );
}
