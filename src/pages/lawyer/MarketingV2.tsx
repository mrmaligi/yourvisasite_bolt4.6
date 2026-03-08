import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Megaphone, Eye, TrendingUp, Users, Star } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function MarketingV2() {
  const [stats] = useState({
    profileViews: 1248,
    inquiries: 34,
    conversionRate: 4.2,
    featured: true,
  });

  const marketingTips = [
    {
      title: 'Complete Your Profile',
      description: 'Profiles with photos get 3x more views',
      completed: true,
    },
    {
      title: 'Add Specialties',
      description: 'List all visa types you handle',
      completed: true,
    },
    {
      title: 'Collect Reviews',
      description: 'Ask satisfied clients for reviews',
      completed: false,
    },
    {
      title: 'Set Availability',
      description: 'Keep your calendar up to date',
      completed: true,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Marketing | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Marketing</h1>
                <p className="text-slate-600">Promote your services and track performance</p>
              </div>
              <Button variant="primary">
                <Megaphone className="w-4 h-4 mr-2" />
                Boost Profile
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats - SQUARE */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Profile Views', value: stats.profileViews.toLocaleString(), icon: Eye, change: '+12%', trend: 'up' },
              { label: 'Inquiries', value: stats.inquiries, icon: Users, change: '+5%', trend: 'up' },
              { label: 'Conversion Rate', value: `${stats.conversionRate}%`, icon: TrendingUp, change: '+0.5%', trend: 'up' },
              { label: 'Featured', value: stats.featured ? 'Yes' : 'No', icon: Star, change: '', trend: 'neutral' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-5 h-5 text-slate-400" />
                  {stat.change && (
                    <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-slate-500'}`}>
                      {stat.change}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Marketing Checklist - SQUARE */}
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Marketing Checklist</h2>
              
              <div className="space-y-4">
                {marketingTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200">
                    <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 ${tip.completed ? 'bg-green-600' : 'bg-slate-300'}`}>
                      {tip.completed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <div>
                      <p className={`font-medium ${tip.completed ? 'text-slate-900' : 'text-slate-600'}`}>{tip.title}</p>
                      <p className="text-sm text-slate-500">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promotion Options - SQUARE */}
            <div className="space-y-6">
              <div className="bg-blue-600 text-white p-6">
                <h2 className="text-lg font-semibold mb-2">Get Featured</h2>
                <p className="text-blue-100 mb-4">Appear at the top of lawyer search results</p>
                <ul className="space-y-2 text-sm text-blue-100 mb-4">
                  <li>• Priority placement in search</li>
                  <li>• Featured badge on profile</li>
                  <li>• 3x more visibility</li>
                </ul>
                <Button variant="secondary" className="w-full bg-white text-blue-600 hover:bg-blue-50">
                  Upgrade to Featured
                </Button>
              </div>

              <div className="bg-white border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Share Your Profile</h2>
                <p className="text-slate-600 text-sm mb-4">Share your VisaBuild profile on social media</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">Copy Link</Button>
                  <Button variant="outline" className="flex-1">Share</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
