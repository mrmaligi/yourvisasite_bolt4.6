import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Facebook, Share2 } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Skeleton } from '../../../components/ui/Skeleton';

export const SocialMedia = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Social Media</h1>
          <p className="text-neutral-500 mt-1">Connect your profiles</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Connected Accounts</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center gap-4 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
              <Linkedin className="w-6 h-6 text-blue-700" />
              <div className="flex-1">
                <h3 className="font-medium">LinkedIn</h3>
                <p className="text-xs text-neutral-500">Connected as Jane Doe</p>
              </div>
              <Button variant="secondary" size="sm">Disconnect</Button>
            </div>
            <div className="flex items-center gap-4 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg opacity-60">
              <Twitter className="w-6 h-6 text-sky-500" />
              <div className="flex-1">
                <h3 className="font-medium">Twitter / X</h3>
                <p className="text-xs text-neutral-500">Not connected</p>
              </div>
              <Button variant="ghost" size="sm">Connect</Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Auto-Post Settings</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Automatically share your new blog posts and achievements to LinkedIn.
            </p>
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">Share New Content</span>
              <div className="w-10 h-6 bg-primary-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </motion.div>
  );
};
