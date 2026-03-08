import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { User, MapPin, Globe, Mail, Phone, Camera, Edit, FileText, Calendar, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function ProfileV2() {
  const { user, profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const stats = [
    { label: 'Visas Saved', value: '12', icon: FileText },
    { label: 'Consultations', value: '3', icon: Calendar },
    { label: 'Documents', value: '8', icon: FileText },
    { label: 'Points', value: '1,250', icon: Award },
  ];

  return (
    <>
      <Helmet>
        <title>My Profile | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header Banner - SQUARE */}
        <div className="h-48 bg-blue-600"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header - SQUARE */}
          <div className="relative -mt-24 mb-8">
            <div className="bg-white border border-slate-200 p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 bg-slate-200 border-4 border-white flex items-center justify-center overflow-hidden">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-slate-400" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white border-2 border-white">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-slate-900">{profile?.full_name || 'User'}</h1>
                  <p className="text-slate-600">Visa Applicant • Member since 2023</p>
                  
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      London, UK
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {user?.email}
                    </span>
                  </div>
                </div>

                {/* Edit Button */}
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Stats - SQUARE */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Overview</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center p-4 bg-slate-50 border border-slate-200">
                      <stat.icon className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      <p className="text-xs text-slate-600">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-600 text-white p-6">
                <h3 className="font-semibold mb-2">Complete Your Profile</h3>
                <p className="text-blue-100 text-sm mb-4">Add more details to get personalized visa recommendations.</p>
                
                <div className="space-y-2">
                  {[
                    { label: 'Basic Info', done: true },
                    { label: 'Contact Details', done: true },
                    { label: 'Work Experience', done: false },
                    { label: 'Education', done: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-sm">
                      <div className={`w-4 h-4 ${item.done ? 'bg-white' : 'border-2 border-white'}`} />
                      <span className={item.done ? '' : 'text-blue-200'}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* About Section - SQUARE */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-900">About Me</h2>
                </div>
                
                <div className="p-6">
                  <p className="text-slate-700 leading-relaxed">
                    Software Engineer with 5 years of experience looking to relocate to Australia. 
                    Interested in skilled migration pathways and employer sponsorship opportunities. 
                    Currently researching visa options and preparing documentation.
                  </p>

                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-3">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {['JavaScript', 'React', 'Node.js', 'Python', 'Cloud Computing', 'Agile'].map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-3">Visa Journey</h3>
                    
                    <div className="space-y-4">
                      {[
                        { step: 'Profile Created', date: 'Jan 2024', status: 'completed' },
                        { step: 'Skills Assessment', date: 'Feb 2024', status: 'completed' },
                        { step: 'EOI Submitted', date: 'In Progress', status: 'pending' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className={`w-3 h-3 ${item.status === 'completed' ? 'bg-green-500' : 'bg-blue-600'}`} />
                          <div className="flex-1">
                            <p className="font-medium text-slate-900">{item.step}</p>
                            <p className="text-sm text-slate-600">{item.date}</p>
                          </div>
                          <Badge variant={item.status === 'completed' ? 'success' : 'primary'}>
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
