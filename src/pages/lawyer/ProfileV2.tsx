import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { User, MapPin, Mail, Phone, Camera, Star, Edit, Save } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function ProfileV2() {
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
    <>
      <Helmet>
        <title>My Profile | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
                <p className="text-slate-600">Manage your public profile and visibility</p>
              </div>
              <Button 
                variant={isEditing ? "outline" : "primary"} 
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <>Cancel</>
                ) : (
                  <><Edit className="w-4 h-4 mr-2" />Edit Profile</>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-slate-200 mx-auto flex items-center justify-center">
                    <User className="w-16 h-16 text-slate-400" />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <h2 className="text-xl font-bold text-slate-900 mt-4">{profile.name}</h2>
                <p className="text-slate-500">{profile.title}</p>

                <div className="flex justify-center items-center gap-1 mt-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium text-slate-900">{profile.rating}</span>
                  <span className="text-slate-500">({profile.reviews} reviews)</span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">About</h3>
                
                {isEditing ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    className="w-full p-3 border border-slate-200 h-32"
                  />
                ) : (
                  <p className="text-slate-700">{profile.bio}</p>
                )}
              </div>

              <div className="bg-white border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.specialties.map((s) => (
                    <Badge key={s} variant="secondary">{s}</Badge>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-400" />
                    {isEditing ? (
                      <input 
                        type="email" 
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="flex-1 px-3 py-2 border border-slate-200"
                      />
                    ) : (
                      <span className="text-slate-700">{profile.email}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-slate-400" />
                    {isEditing ? (
                      <input 
                        type="tel" 
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        className="flex-1 px-3 py-2 border border-slate-200"
                      />
                    ) : (
                      <span className="text-slate-700">{profile.phone}</span>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <Button variant="primary">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
