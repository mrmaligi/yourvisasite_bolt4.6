import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Share2, Users, Gift, Copy } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/Toast';

export const ReferralProgram = () => {
  const { addToast } = useToast();
  const referralLink = 'https://visabuild.com/r/jane-doe';

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    addToast('success', 'Referral link copied');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Referral Program</h1>
          <p className="text-neutral-500 mt-1">Invite colleagues and earn rewards</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Your Referral Link</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Share this link with other lawyers. You'll both get 1 month of premium free when they verify their account.
            </p>
            <div className="flex gap-2">
              <Input value={referralLink} readOnly className="flex-1 bg-neutral-50 dark:bg-neutral-800" />
              <Button onClick={copyLink} variant="secondary">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <Button variant="ghost" size="sm"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Your Stats</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">3</p>
                <p className="text-xs text-neutral-500">Signups</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <Gift className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">3 mo</p>
                <p className="text-xs text-neutral-500">Earned</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </motion.div>
  );
};
