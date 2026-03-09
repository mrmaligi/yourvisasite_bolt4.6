import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Megaphone, TrendingUp, Plus, DollarSign, Eye, MousePointer } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface Ad {
  id: string;
  title: string;
  status: 'active' | 'ended';
  impressions: number;
  clicks: number;
  cost: number;
}

const MOCK_ADS: Ad[] = [
  { id: '1', title: 'Sponsored Listing - Sydney', status: 'active', impressions: 5000, clicks: 120, cost: 500 },
  { id: '2', title: 'Featured Lawyer - Partner Visas', status: 'ended', impressions: 12000, clicks: 350, cost: 1200 },
];

export function AdvertisingV2() {
  const [ads] = useState<Ad[]>(MOCK_ADS);

  const stats = {
    totalAds: ads.length,
    activeAds: ads.filter(a => a.status === 'active').length,
    totalImpressions: ads.reduce((sum, a) => sum + a.impressions, 0),
    totalClicks: ads.reduce((sum, a) => sum + a.clicks, 0),
    totalSpent: ads.reduce((sum, a) => sum + a.cost, 0),
  };

  return (
    <>
      <Helmet>
        <title>Advertising | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Advertising</h1>
                <p className="text-slate-600">Promote your profile to get more clients</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Ad
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              { label: 'Total Ads', value: stats.totalAds, icon: Megaphone },
              { label: 'Active', value: stats.activeAds, icon: TrendingUp, color: 'text-green-600' },
              { label: 'Impressions', value: stats.totalImpressions.toLocaleString(), icon: Eye },
              { label: 'Clicks', value: stats.totalClicks.toLocaleString(), icon: MousePointer },
              { label: 'Spent', value: `$${stats.totalSpent}`, icon: DollarSign, color: 'text-blue-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color || 'text-slate-600'}`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {ads.map((ad) => (
              <div key={ad.id} className="bg-white border border-slate-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 flex items-center justify-center">
                      <Megaphone className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{ad.title}</h3>
                      <Badge variant={ad.status === 'active' ? 'success' : 'secondary'} className="mt-1">
                        {ad.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">${ad.cost}</p>
                    <p className="text-sm text-slate-500">Total spent</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
                  <div>
                    <p className="text-sm text-slate-500">Impressions</p>
                    <p className="text-lg font-semibold text-slate-900">{ad.impressions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Clicks</p>
                    <p className="text-lg font-semibold text-slate-900">{ad.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">CTR</p>
                    <p className="text-lg font-semibold text-slate-900">{((ad.clicks / ad.impressions) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
