import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { User, MapPin, Mail, Phone, Star, Edit } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function ProfileV2() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile] = useState({
    name: 'Sarah Wilson',
    title: 'Senior Immigration Lawyer',
    location: 'Sydney, NSW',
    email: 'sarah.wilson@example.com',
    phone: '+61 400 000 000',
    bio: 'Specializing in skilled migration and family visas with over 10 years of experience.',
    specialties: ['Skilled Visas', 'Family Visas', 'Appeals'],
    rating: 4.9,
    reviews: 124,
    verified: true,
  });

  return (
    <>
      <Helmet>
        <title>My Profile | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
                <p className="text-slate-600">Manage your public profile</p>
              </div>
              <Button
                variant={isEditing ? 'secondary' : 'primary'}
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Avatar & Stats */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 p-6">
                <div className="text-center">
                  <div className="w-32 h-32 bg-slate-200 mx-auto flex items-center justify-center">
                    <User className="w-16 h-16 text-slate-400" />
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 mt-4">{profile.name}</h2>
                  <p className="text-slate-600">{profile.title}</p>

                  {profile.verified && (
                    <Badge variant="success" className="mt-2">Verified</Badge>
                  )}

                  <div className="flex justify-center items-center gap-1 mt-3">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-slate-900">{profile.rating}</span>
                    <span className="text-slate-500">({profile.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary">{specialty}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="text-slate-900">{profile.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="text-slate-900">{profile.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Location</p>
                      <p className="text-slate-900">{profile.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">About</h3>
                <p className="text-slate-600">{profile.bio}</p>
              </div>

              <div className="bg-blue-600 text-white p-6">
                <h3 className="font-semibold mb-2">Profile Completion</h3>
                <div className="w-full bg-blue-800 h-2 mb-2">
                  <div className="bg-white h-2 w-3/4"></div>
                </div>
                <p className="text-blue-100 text-sm">75% complete - Add more details to improve visibility</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
