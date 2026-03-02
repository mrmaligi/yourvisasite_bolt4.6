import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { FileUpload } from '../../../components/ui/FileUpload';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/Toast';

interface ProfileForm {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  website: string;
}

const fetchProfile = async (): Promise<ProfileForm> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    fullName: 'Jane Doe',
    email: 'jane@law.com',
    phone: '+61 400 000 000',
    bio: 'Experienced immigration lawyer.',
    website: 'https://janedoe.law',
  };
};

export const EditProfile = () => {
  const { addToast } = useToast();
  const { data: profile, isLoading } = useQuery({
    queryKey: ['lawyer-profile-edit'],
    queryFn: fetchProfile,
  });

  const mutation = useMutation({
    mutationFn: async (data: ProfileForm) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      addToast('success', 'Profile updated successfully');
    },
    onError: () => {
      addToast('error', 'Failed to update profile');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, gather form data here
    mutation.mutate(profile!);
  };

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Edit Profile</h1>
          <p className="text-neutral-500 mt-1">Update your professional details</p>
        </div>
        <Button onClick={handleSubmit} disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Basic Information</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Full Name" defaultValue={profile?.fullName} />
                <Input label="Email" type="email" defaultValue={profile?.email} disabled />
              </div>
              <Input label="Phone Number" defaultValue={profile?.phone} />
              <Input label="Website" defaultValue={profile?.website} />
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Bio
                </label>
                <textarea
                  className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 p-3 h-32 bg-transparent"
                  defaultValue={profile?.bio}
                />
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Profile Photo</h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-full bg-neutral-100 dark:bg-neutral-800" />
                <div className="w-full">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 text-center">
                    Upload Photo
                  </label>
                  <FileUpload onFileSelect={() => {}} accept="image/*" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
