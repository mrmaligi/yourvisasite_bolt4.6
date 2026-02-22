import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Layout, Palette, Image as ImageIcon, ExternalLink, Save } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input, Textarea } from '../../../components/ui/Input';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/Toast';

export const WebsiteBuilder = () => {
  const { addToast } = useToast();
  const [siteName, setSiteName] = useState('Jane Doe Law');
  const [primaryColor, setPrimaryColor] = useState('#4F46E5');

  const handleSave = () => {
    addToast('success', 'Website settings saved');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Website Builder</h1>
          <p className="text-neutral-500 mt-1">Customize your personal lawyer page</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <ExternalLink className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Publish Changes
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">General Settings</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Site Name / Heading"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />
              <Textarea
                label="Welcome Message"
                placeholder="Brief introduction displayed on your homepage..."
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Appearance</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded border border-neutral-200" style={{ backgroundColor: primaryColor }} />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Primary Brand Color
                  </label>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-full rounded cursor-pointer"
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Sections</h2>
            </CardHeader>
            <CardBody className="space-y-2">
              {['Hero Banner', 'About Me', 'Services', 'Testimonials', 'Contact Form'].map((section) => (
                <div key={section} className="flex items-center justify-between p-3 border border-neutral-100 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800">
                  <span className="text-sm font-medium">{section}</span>
                  <div className="w-10 h-6 bg-primary-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
