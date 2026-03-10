import { useState, useEffect } from 'react';
import { TrendingUp, Users, Clock, Shield, CheckCircle, AlertTriangle, BarChart3 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function TrackerDashboardV2() {
  const [stats, setStats] = useState({
    totalEntries: 1247,
    avgProcessingTime: 142,
    lastUpdated: '2 hours ago',
    accuracy: 94,
  });

  const visaTypes = [
    { name: 'Partner Visa (820/801)', official: '18-24 months', community: '14.2 months', confidence: 92 },
    { name: 'Skilled Independent (189)', official: '8-12 months', community: '6.8 months', confidence: 89 },
    { name: 'Student Visa (500)', official: '1-3 months', community: '5.2 weeks', confidence: 95 },
    { name: 'Visitor Visa (600)', official: '20-30 days', community: '18 days', confidence: 88 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-indigo-900 py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">AusVisa Community Tracker</h1>
              <p className="text-indigo-200">Real-time processing predictions from 1,200+ applicants</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200 p-6">
            <Users className="w-6 h-6 text-indigo-600 mb-2" />
            <p className="text-sm text-slate-500">Community Entries</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalEntries.toLocaleString()}</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6">
            <Clock className="w-6 h-6 text-emerald-600 mb-2" />
            <p className="text-sm text-slate-500">Avg Processing Time</p>
            <p className="text-2xl font-bold text-slate-900">{stats.avgProcessingTime} days</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6">
            <Shield className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-sm text-slate-500">Data Accuracy</p>
            <p className="text-2xl font-bold text-slate-900">{stats.accuracy}%</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6">
            <BarChart3 className="w-6 h-6 text-amber-600 mb-2" />
            <p className="text-sm text-slate-500">Last Updated</p>
            <p className="text-2xl font-bold text-slate-900">{stats.lastUpdated}</p>
          </div>
        </div>

        {/* Reality Check Section */}
        <div className="bg-white border border-slate-200 mb-8">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Reality Check</h2>
            <p className="text-slate-500">Official DHA estimates vs. actual community data</p>
          </div>
          
          <div className="divide-y divide-slate-200">
            {visaTypes.map((visa) => (
              <div key={visa.name} className="p-6 flex items-center">
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{visa.name}</p>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Official DHA</p>
                    <p className="text-lg font-medium text-slate-600">{visa.official}</p>
                  </div>
                  
                  <div className="text-2xl text-slate-300">→</div>
                  
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Community</p>
                    <p className="text-lg font-bold text-emerald-600">{visa.community}</p>
                  </div>
                  
                  <div className="text-center w-20">
                    <p className="text-xs text-slate-500">Confidence</p>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="font-medium">{visa.confidence}%</span>
                    </div>
                  </div>
                </div>              
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-indigo-900 p-8 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Have you received a visa grant?</h3>
            <p className="text-indigo-200">Help the community by sharing your timeline</p>
          </div>
          <Button variant="primary" className="bg-emerald-500 hover:bg-emerald-600">
            Submit Your Timeline
          </Button>
        </div>
      </div>
    </div>
  );
}
