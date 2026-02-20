import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { User, MapPin, Award, Star } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';

interface ProfileData {
  id: string;
  fullName: string;
  title: string;
  bio: string;
  location: string;
  experience: number;
  rating: number;
  specializations: string[];
}

const fetchProfile = async (): Promise<ProfileData> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    id: '1',
    fullName: 'Jane Doe',
    title: 'Senior Immigration Lawyer',
    bio: 'Specializing in corporate immigration and family visas with over 15 years of experience.',
    location: 'Sydney, NSW',
    experience: 15,
    rating: 4.9,
    specializations: ['Skilled Migration', 'Partner Visas', 'Employer Sponsored'],
  };
};

export const EnhancedProfile = () => {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['lawyer-profile'],
    queryFn: fetchProfile,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Card>
          <CardBody className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error) {
    throw error; // Let ErrorBoundary handle it
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Public Profile</h1>
          <p className="text-neutral-500 mt-1">Manage how you appear to potential clients</p>
        </div>
        <Button>Edit Profile</Button>
      </div>

      <Card>
        <CardBody className="flex flex-col md:flex-row gap-6">
          <div className="w-32 h-32 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
            <User className="w-16 h-16 text-neutral-400" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{profile?.fullName}</h2>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium">{profile?.rating}</span>
                </div>
              </div>
              <p className="text-primary-600 font-medium">{profile?.title}</p>
            </div>

            <div className="flex items-center gap-4 text-sm text-neutral-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {profile?.location}
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                {profile?.experience} Years Experience
              </div>
            </div>

            <p className="text-neutral-600 dark:text-neutral-300">
              {profile?.bio}
            </p>

            <div className="flex flex-wrap gap-2">
              {profile?.specializations.map((spec) => (
                <Badge key={spec} variant="secondary">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};
