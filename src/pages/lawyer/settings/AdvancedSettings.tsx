import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Bell, Lock, Database, Globe, Save } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/Toast';

export const AdvancedSettings = () => {
  const { addToast } = useToast();

  const handleSave = () => {
    addToast('Settings saved', 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Advanced Settings</h1>
          <p className="text-neutral-500 mt-1">Configure security and system preferences</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold">Notifications</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox id="notif-email" />
              <div>
                <label htmlFor="notif-email" className="text-sm font-medium text-neutral-900 dark:text-white">Email Notifications</label>
                <p className="text-xs text-neutral-500">Receive daily summaries and urgent alerts.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox id="notif-push" />
              <div>
                <label htmlFor="notif-push" className="text-sm font-medium text-neutral-900 dark:text-white">Push Notifications</label>
                <p className="text-xs text-neutral-500">Browser alerts for new messages.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox id="notif-sms" />
              <div>
                <label htmlFor="notif-sms" className="text-sm font-medium text-neutral-900 dark:text-white">SMS Alerts</label>
                <p className="text-xs text-neutral-500">For urgent appointment reminders only.</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold">Security & Login</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox id="2fa" defaultChecked />
              <div>
                <label htmlFor="2fa" className="text-sm font-medium text-neutral-900 dark:text-white">Two-Factor Authentication</label>
                <p className="text-xs text-neutral-500">Require 2FA for all team members.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox id="session" />
              <div>
                <label htmlFor="session" className="text-sm font-medium text-neutral-900 dark:text-white">Short Session Timeout</label>
                <p className="text-xs text-neutral-500">Auto-logout after 15 minutes of inactivity.</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="mt-2">Change Password</Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold">Data & Privacy</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <Button variant="secondary" className="w-full justify-start">Download Your Data Archive</Button>
            <Button variant="secondary" className="w-full justify-start">Manage Cookie Preferences</Button>
            <Button variant="danger" className="w-full justify-start">Delete Account</Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold">Localization</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Timezone</label>
              <select className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 p-2.5 bg-transparent">
                <option>Sydney (GMT+11)</option>
                <option>Melbourne (GMT+11)</option>
                <option>Perth (GMT+8)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Currency</label>
              <select className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 p-2.5 bg-transparent">
                <option>AUD ($)</option>
                <option>USD ($)</option>
              </select>
            </div>
          </CardBody>
        </Card>
      </div>
    </motion.div>
  );
};
