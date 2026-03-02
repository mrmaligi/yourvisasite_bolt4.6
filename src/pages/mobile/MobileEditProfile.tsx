import { MobileLayout } from '../../components/mobile/MobileLayout';
import { MobileCard } from '../../components/mobile/MobileCard';
import { MobileButton } from '../../components/mobile/MobileButton';

export default function MobileEditProfile() {
  return (
    <MobileLayout title="Edit Profile" showBack={true}>
      <div className="space-y-4">
        <MobileCard title="Edit Profile">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This is the mobile optimized view for Edit Profile.
          </p>
          <MobileButton>Action</MobileButton>
        </MobileCard>
      </div>
    </MobileLayout>
  );
}
