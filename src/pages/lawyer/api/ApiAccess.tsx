import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Key, Copy, Eye, EyeOff, RotateCw, Plus } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/Toast';

export const ApiAccess = () => {
  const { addToast } = useToast();
  const [showKey, setShowKey] = useState(false);

  const apiKey = "sk_test_51Mz...";

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    addToast('API Key copied', 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">API Access</h1>
          <p className="text-neutral-500 mt-1">Manage API keys for custom integrations</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Generate New Key
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Your API Keys</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Live Secret Key
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  value={showKey ? "sk_test_51Mz928374923847923847" : "sk_test_..................."}
                  readOnly
                  className="font-mono bg-neutral-50 dark:bg-neutral-800"
                />
              </div>
              <Button variant="secondary" onClick={() => setShowKey(!showKey)}>
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button variant="secondary" onClick={copyKey}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="danger" title="Roll Key">
                <RotateCw className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-neutral-500">
              Created on Nov 15, 2023. Last used today.
            </p>
          </div>

          <div className="pt-6 border-t border-neutral-100 dark:border-neutral-700">
            <h3 className="font-medium text-neutral-900 dark:text-white mb-2">Documentation</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
              Read our full API documentation to learn how to integrate programmatically.
            </p>
            <Button variant="secondary" onClick={() => window.open('https://docs.visabuild.com', '_blank')}>
              View Documentation
            </Button>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};
