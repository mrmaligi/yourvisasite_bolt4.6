import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Globe, Search, Save } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input, Textarea } from '../../../components/ui/Input';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/Toast';

interface SEOSettingsData {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  slug: string;
}

const fetchSEO = async (): Promise<SEOSettingsData> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    metaTitle: 'Jane Doe - Immigration Lawyer Sydney',
    metaDescription: 'Expert legal advice for Australian visas. Specializing in skilled migration and partner visas.',
    keywords: 'immigration lawyer, visa agent, sydney migration',
    slug: 'jane-doe-sydney',
  };
};

export const SEOSettings = () => {
  const { addToast } = useToast();
  const { data: seo, isLoading } = useQuery({
    queryKey: ['lawyer-seo'],
    queryFn: fetchSEO,
  });

  const mutation = useMutation({
    mutationFn: async (data: SEOSettingsData) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      addToast('SEO settings updated', 'success');
    },
    onError: () => {
      addToast('Failed to update SEO settings', 'error');
    }
  });

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">SEO Settings</h1>
          <p className="text-neutral-500 mt-1">Optimize your profile for search engines</p>
        </div>
        <Button onClick={() => mutation.mutate(seo!)} disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold">Search Engine Appearance</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input label="Meta Title" defaultValue={seo?.metaTitle} />
            <Textarea label="Meta Description" defaultValue={seo?.metaDescription} />
            <Input label="Keywords (comma separated)" defaultValue={seo?.keywords} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold">URL Settings</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Profile URL Slug"
              defaultValue={seo?.slug}
              helperText="Your profile will be available at: /lawyers/your-slug"
            />
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg text-sm text-neutral-600 dark:text-neutral-400">
              <p className="font-medium mb-1">Preview:</p>
              <p className="text-primary-600 hover:underline cursor-pointer">
                https://visabuild.com/lawyers/{seo?.slug}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </motion.div>
  );
};
