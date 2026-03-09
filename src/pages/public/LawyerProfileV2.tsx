import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { MapPin, Briefcase, Clock, Star, Shield, Calendar, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface LawyerData {
  id: string;
  name: string;
  jurisdiction: string;
  specializations: string[];
  yearsExperience: number;
  bio: string;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  location: string;
}

const MOCK_LAWYER: LawyerData = {
  id: '1',
  name: 'Jane Doe',
  jurisdiction: 'NSW',
  specializations: ['Partner Visa', 'Skilled Migration', 'Student Visa'],
  yearsExperience: 10,
  bio: 'Experienced immigration lawyer with over 10 years of practice. Specialized in family and skilled migration visas.',
  hourlyRate: 250,
  rating: 4.9,
  reviewCount: 128,
  location: 'Sydney, NSW',
};

export function LawyerProfileV2() {
  const { id } = useParams<{ id: string }>();
  const [lawyer] = useState<LawyerData>(MOCK_LAWYER);
  const [activeTab, setActiveTab] = useState('about');

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'availability', label: 'Availability' },
  ];

  return (
    <>
      <Helmet>
        <title>{lawyer.name} | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-24 h-24 bg-slate-200 flex items-center justify-center">
                <span className="text-3xl font-bold text-slate-400">{lawyer.name.charAt(0)}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-slate-900">{lawyer.name}</h1>
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                
                <div className="flex items-center gap-4 text-slate-600 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {lawyer.location}
                  </span>
                  
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {lawyer.yearsExperience} years exp
                  </span>
                  
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {lawyer.rating} ({lawyer.reviewCount} reviews)
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {lawyer.specializations.map((spec) => (
                    <Badge key={spec} variant="secondary">{spec}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-3xl font-bold text-slate-900">${lawyer.hourlyRate}</p>
                <p className="text-slate-600">per hour</p>
                <Button variant="primary" className="mt-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-1 mb-6 bg-slate-100 p-1 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'about' && (
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">About</h2>
              <p className="text-slate-600">{lawyer.bio}</p>
              
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200">
                  <p className="text-sm text-slate-500">Jurisdiction</p>
                  <p className="font-medium text-slate-900">{lawyer.jurisdiction}</p>
                </div>
                
                <div className="p-4 bg-slate-50 border border-slate-200">
                  <p className="text-sm text-slate-500">Languages</p>
                  <p className="font-medium text-slate-900">English, Mandarin</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {[
                { name: 'Sarah J.', rating: 5, text: 'Excellent service, very professional!', date: '2024-03-15' },
                { name: 'Michael C.', rating: 5, text: 'Helped me with my partner visa. Highly recommended.', date: '2024-03-10' },
              ].map((review, i) => (
                <div key={i} className="bg-white border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">{review.name}</span>
                    <span className="text-sm text-slate-500">{review.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-slate-600">{review.text}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'availability' && (
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Available Slots</h2>
              
              <div className="grid grid-cols-3 gap-3">
                {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'].map((time) => (
                  <button
                    key={time}
                    className="p-3 border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <Clock className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                    <span className="text-sm">{time}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
