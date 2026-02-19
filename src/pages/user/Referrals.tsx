import { ReferralDashboard, SubmitSuccessStory } from '../../components/growth';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Gift, Star } from 'lucide-react';

export function Referrals() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Referrals & Rewards
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Invite friends and share your success story
        </p>
      </div>

      <Tabs defaultValue="referrals">
        <TabsList>
          <TabsTrigger value="referrals" className="flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Refer Friends
          </TabsTrigger>
          <TabsTrigger value="story" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Share Your Story
          </TabsTrigger>
        </TabsList>

        <TabsContent value="referrals" className="mt-6">
          <ReferralDashboard />
        </TabsContent>

        <TabsContent value="story" className="mt-6">
          <SubmitSuccessStory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
