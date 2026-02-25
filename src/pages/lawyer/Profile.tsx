import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { User, MapPin, Mail, Phone, Camera, Star } from 'lucide-react';
import { LawyerDashboardLayout } from '@/components/layout/LawyerDashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function LawyerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Sarah Wilson',
    title: 'Senior Immigration Lawyer',
    location: 'Sydney, NSW',
    email: 'sarah.wilson@example.com',
    phone: '+61 400 000 000',
    bio: 'Specializing in skilled migration and family visas with over 10 years of experience.',
    specialties: ['Skilled Visas', 'Family Visas', 'Appeals'],
    rating: 4.9,
    reviews: 124
  });

  return (
    <LawyerDashboardLayout>
      <Helmet>
        <title>My Profile | VisaBuild</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
             <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">My Profile</h1>
             <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage your public profile and visibility.</p>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "secondary" : "primary"}>
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column: Avatar & Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardBody className="text-center">
                <div className="relative inline-block">
                   <div className="w-32 h-32 bg-neutral-200 dark:bg-neutral-700 rounded-full mx-auto flex items-center justify-center overflow-hidden">
                      <User className="w-16 h-16 text-neutral-400" />
                   </div>
                   {isEditing && (
                     <button className="absolute bottom-0 right-0 p-2 bg-primary-600 rounded-full text-white hover:bg-primary-700 transition-colors shadow-lg">
                       <Camera className="w-4 h-4" />
                     </button>
                   )}
                </div>

                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mt-4">{profile.name}</h2>
                <p className="text-neutral-500 dark:text-neutral-400">{profile.title}</p>

                <div className="flex justify-center items-center gap-1 mt-2 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-neutral-900 dark:text-white">{profile.rating}</span>
                  <span className="text-neutral-400 text-sm">({profile.reviews} reviews)</span>
                </div>
              </CardBody>
            </Card>

            <Card>
               <CardBody>
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Contact Info</h3>
                  <div className="space-y-3 text-sm">
                     <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-600 dark:text-neutral-300">{profile.email}</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-600 dark:text-neutral-300">{profile.phone}</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-600 dark:text-neutral-300">{profile.location}</span>
                     </div>
                  </div>
               </CardBody>
            </Card>
          </div>

          {/* Right Column: Details */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">About Me</h2>
              </CardHeader>
              <CardBody>
                {isEditing ? (
                  <textarea
                    className="w-full rounded-lg border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-primary-500 focus:border-primary-500"
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  />
                ) : (
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {profile.bio}
                  </p>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Specialties</h2>
              </CardHeader>
              <CardBody>
                <div className="flex flex-wrap gap-2">
                  {profile.specialties.map((spec, i) => (
                    <Badge key={i} variant="default" className="text-sm py-1 px-3">
                      {spec}
                    </Badge>
                  ))}
                  {isEditing && (
                     <Button size="sm" variant="secondary" className="h-7 text-xs rounded-full">
                       + Add Specialty
                     </Button>
                  )}
                </div>
              </CardBody>
            </Card>

            {isEditing && (
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </LawyerDashboardLayout>
  );
}
