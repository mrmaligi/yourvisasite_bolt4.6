import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Megaphone, Image, DollarSign, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function MarketingV2() {
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    bio: 'Specializing in skilled migration and family visas with over 10 years of experience.',
    hourlyRate: '250',
    practiceAreas: 'Skilled Visas, Family Visas, Appeals',
    isFeatured: true,
  });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <>
      <Helmet>
        <title>Marketing | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Marketing Profile</h1>
                <p className="text-slate-600">Optimize your visibility to attract more clients</p>
              </div>
              <Button variant="primary" onClick={handleSave} disabled={saving}>
                <CheckCircle className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-green-50 border border-green-200 p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Profile Status: Featured</p>
              <p className="text-sm text-green-600">Your profile is visible in search results</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Image className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Profile Photo</h2>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-slate-200 flex items-center justify-center">
                  <span className="text-slate-400">No Image</span>
                </div>
                <Button variant="outline">Upload Photo</Button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Megaphone className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Bio</h2>
              </div>

              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-slate-200"
              />
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Pricing</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hourly Rate ($)</label>
                  <input
                    type="number"
                    value={profile.hourlyRate}
                    onChange={(e) => setProfile({...profile, hourlyRate: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Practice Areas</label>
                  <input
                    type="text"
                    value={profile.practiceAreas}
                    onChange={(e) => setProfile({...profile, practiceAreas: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Featured Profile</h2>
                  <p className="text-slate-600">Appear at the top of search results</p>
                </div>
                
                <button
                  onClick={() => setProfile({...profile, isFeatured: !profile.isFeatured})}
                  className={`w-12 h-6 transition-colors ${
                    profile.isFeatured ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white mt-0.5 transition-all ${
                    profile.isFeatured ? 'ml-6' : 'ml-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
