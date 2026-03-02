import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { User, MapPin, Globe, Mail, Phone, Camera } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function Profile() {
  const { user, profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: 'Software Engineer hoping to move to Australia.',
    location: 'London, UK',
    website: 'https://github.com/jules',
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Helmet>
        <title>My Profile | VisaBuild</title>
      </Helmet>

      <div className="relative h-48 bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="px-6 relative">
        <div className="flex flex-col md:flex-row items-end -mt-16 mb-6 gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-neutral-900 bg-neutral-100 flex items-center justify-center overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-neutral-400" />
              )}
            </div>
            <button className="absolute bottom-2 right-2 p-2 bg-white dark:bg-neutral-800 rounded-full shadow-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 hover:text-primary-600 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 pb-2">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{profile?.full_name || 'User'}</h1>
            <p className="text-neutral-500">Applicant • Member since 2023</p>
          </div>

          <div className="pb-2">
            <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? 'secondary' : 'primary'}>
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">About Me</h2>
            </CardHeader>
            <CardBody>
              {isEditing ? (
                <textarea
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[100px]"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
              ) : (
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {formData.bio}
                </p>
              )}
            </CardBody>
          </Card>

          <Card>
             <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Contact Information</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-neutral-400" />
                <span className="text-neutral-900 dark:text-white">{user?.email || 'user@example.com'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-neutral-400" />
                <span className="text-neutral-900 dark:text-white">+44 7700 900000</span>
              </div>
               <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-neutral-400" />
                {isEditing ? (
                  <input
                    type="text"
                    className="flex-1 p-2 border border-neutral-300 rounded-md"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                ) : (
                  <span className="text-neutral-900 dark:text-white">{formData.location}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-neutral-400" />
                 {isEditing ? (
                  <input
                    type="text"
                    className="flex-1 p-2 border border-neutral-300 rounded-md"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                  />
                ) : (
                  <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                    {formData.website}
                  </a>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Profile Strength</h2>
            </CardHeader>
            <CardBody>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">Intermediate</span>
                <span className="text-neutral-500">65%</span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-xs text-neutral-500 mt-4">
                Add more details to improve your chances of finding the right visa match.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

       {isEditing && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button size="lg" className="shadow-xl" onClick={() => setIsEditing(false)}>
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}
