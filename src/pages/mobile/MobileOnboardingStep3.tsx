import { MobileLayout } from '../../components/mobile/MobileLayout';
import { MobileCard } from '../../components/mobile/MobileCard';
import { MobileButton } from '../../components/mobile/MobileButton';

export default function MobileOnboardingStep3() {
  return (
    <MobileLayout title="Onboarding Step3" showBack={true}>
      <div className="space-y-4">
        <MobileCard title="Onboarding Step3">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This is the mobile optimized view for Onboarding Step3.
          </p>
          <MobileButton>Action</MobileButton>
        </MobileCard>
      </div>
    </MobileLayout>
  );
}
