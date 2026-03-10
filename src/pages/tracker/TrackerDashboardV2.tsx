import { useState, useMemo } from 'react';
import { TrendingUp, Users, Filter, CheckCircle, AlertTriangle, Clock, Search, Briefcase, MapPin, Star } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { 
  generatePrediction, 
  detectOutliersIQR, 
  getANZSCOStats,
  type TimelineEntry 
} from '../../lib/tracker-stats';

// Mock data - in production this would come from Supabase
const mockData: TimelineEntry[] = [
  { id: '1', visaSubclass: '189', anzscoCode: '261312', location: 'offshore', points: 85, dateLodged: new Date('2023-06-15'), dateGranted: new Date('2024-01-20'), processingDays: 219, hadMedicals: true, hadS56: false, submittedAt: new Date('2024-01-25') },
  { id: '2', visaSubclass: '189', anzscoCode: '261312', location: 'offshore', points: 90, dateLodged: new Date('2023-07-10'), dateGranted: new Date('2024-02-05'), processingDays: 210, hadMedicals: true, hadS56: true, submittedAt: new Date('2024-02-10') },
  { id: '3', visaSubclass: '189', anzscoCode: '261312', location: 'onshore', points: 80, dateLodged: new Date('2023-08-01'), dateGranted: new Date('2024-02-15'), processingDays: 198, hadMedicals: false, hadS56: false, submittedAt: new Date('2024-02-20') },
  { id: '4', visaSubclass: '190', anzscoCode: '233512', location: 'onshore', points: 75, dateLodged: new Date('2023-05-20'), dateGranted: new Date('2023-12-10'), processingDays: 204, hadMedicals: true, hadS56: false, submittedAt: new Date('2023-12-15') },
  { id: '5', visaSubclass: '190', anzscoCode: '233512', location: 'offshore', points: 80, dateLodged: new Date('2023-09-01'), dateGranted: new Date('2024-03-15'), processingDays: 196, hadMedicals: true, hadS56: true, submittedAt: new Date('2024-03-20') },
  { id: '6', visaSubclass: '820', anzscoCode: 'N/A', location: 'onshore', points: 0, dateLodged: new Date('2022-12-01'), dateGranted: new Date('2024-01-10'), processingDays: 406, hadMedicals: true, hadS56: false, submittedAt: new Date('2024-01-15') },
  { id: '7', visaSubclass: '820', anzscoCode: 'N/A', location: 'onshore', points: 0, dateLodged: new Date('2023-03-15'), dateGranted: new Date('2024-02-28'), processingDays: 350, hadMedicals: true, hadS56: true, submittedAt: new Date('2024-03-05') },
  { id: '8', visaSubclass: '500', anzscoCode: 'N/A', location: 'offshore', points: 0, dateLodged: new Date('2024-01-05'), dateGranted: new Date('2024-02-01'), processingDays: 27, hadMedicals: true, hadS56: false, submittedAt: new Date('2024-02-05') },
  { id: '9', visaSubclass: '189', anzscoCode: '261312', location: 'offshore', points: 95, dateLodged: new Date('2023-10-01'), dateGranted: new Date('2024-04-01'), processingDays: 183, hadMedicals: false, hadS56: false, submittedAt: new Date('2024-04-05') },
  { id: '10', visaSubclass: '189', anzscoCode: '261111', location: 'onshore', points: 85, dateLodged: new Date('2023-11-15'), dateGranted: new Date('2024-05-01'), processingDays: 168, hadMedicals: true, hadS56: false, submittedAt: new Date('2024-05-05') },
];

const visaTypes = [
  { code: '189', name: 'Skilled Independent (189)', official: '8-12 months' },
  { code: '190', name: 'Skilled Nominated (190)', official: '8-12 months' },
  { code: '820', name: 'Partner Visa (820/801)', official: '18-24 months' },
  { code: '500', name: 'Student Visa (500)', official: '1-3 months' },
];

const anzscoProfessions: Record<string, string> = {
  '261312': 'Developer Programmer',
  '233512': 'Mechanical Engineer',
  '261111': 'ICT Business Analyst',
  'N/A': 'Not Applicable',
};

export function TrackerDashboardV2() {
  const [selectedVisa, setSelectedVisa] = useState<string | null>(null);
  const [selectedANZSCO, setSelectedANZSCO] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<'onshore' | 'offshore' | null>(null);

  // Calculate stats
  const stats = useMemo(() => {
    const { cleaned, outliers } = detectOutliersIQR(mockData);
    return {
      totalEntries: mockData.length,
      validEntries: cleaned.length,
      outliers: outliers.length,
      avgProcessingTime: Math.round(cleaned.reduce((a, b) => a + b.processingDays, 0) / cleaned.length),
    };
  }, []);

  // Get ANZSCO stats
  const anzscoStats = useMemo(() => getANZSCOStats(mockData), []);

  // Generate prediction
  const prediction = useMemo(() => {
    return generatePrediction(mockData, {
      visaSubclass: selectedVisa || undefined,
      anzscoCode: selectedANZSCO || undefined,
      location: selectedLocation || undefined,
    });
  }, [selectedVisa, selectedANZSCO, selectedLocation]);

  // Filter data for display
  const filteredData = useMemo(() => {
    let filtered = mockData;
    if (selectedVisa) filtered = filtered.filter(d => d.visaSubclass === selectedVisa);
    if (selectedANZSCO) filtered = filtered.filter(d => d.anzscoCode === selectedANZSCO);
    if (selectedLocation) filtered = filtered.filter(d => d.location === selectedLocation);
    return filtered;
  }, [selectedVisa, selectedANZSCO, selectedLocation]);

  const formatDays = (days: number) => {
    if (days < 30) return `${days} days`;
    const months = Math.round(days / 30);
    return `${months} months`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-indigo-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">AusVisa Community Tracker</h1>
              <p className="text-indigo-200">AI-powered processing predictions from {stats.totalEntries} applicants</p>
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
            <p className="text-2xl font-bold text-slate-900">{stats.totalEntries}</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6">
            <CheckCircle className="w-6 h-6 text-emerald-600 mb-2" />
            <p className="text-sm text-slate-500">Valid Data Points</p>
            <p className="text-2xl font-bold text-slate-900">{stats.validEntries}</p>
            <p className="text-xs text-slate-400">{stats.outliers} outliers removed (IQR)</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6">
            <Clock className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-sm text-slate-500">Avg Processing (EMA)</p>
            <p className="text-2xl font-bold text-slate-900">{formatDays(prediction.estimate)}</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6">
            <Star className="w-6 h-6 text-amber-600 mb-2" />
            <p className="text-sm text-slate-500">Prediction Confidence</p>
            <p className="text-2xl font-bold text-slate-900">{prediction.confidence}%</p>
            <p className="text-xs text-slate-400">Based on {prediction.sampleSize} samples</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-600" />
            <h2 className="font-semibold text-slate-900">Filter by Your Profile</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {/* Visa Type Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Visa Type</label>
              <select 
                className="w-full px-3 py-2 border border-slate-200"
                value={selectedVisa || ''}
                onChange={(e) => setSelectedVisa(e.target.value || null)}
              >
                <option value="">All Visa Types</option>
                {visaTypes.map(v => (
                  <option key={v.code} value={v.code}>{v.name}</option>
                ))}
              </select>
            </div>

            {/* ANZSCO Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Profession (ANZSCO)</label>
              <select 
                className="w-full px-3 py-2 border border-slate-200"
                value={selectedANZSCO || ''}
                onChange={(e) => setSelectedANZSCO(e.target.value || null)}
              >
                <option value="">All Professions</option>
                {anzscoStats.map(stat => (
                  <option key={stat.code} value={stat.code}>
                    {anzscoProfessions[stat.code] || stat.code} ({stat.count} entries)
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedLocation(selectedLocation === 'onshore' ? null : 'onshore')}
                  className={`flex-1 px-4 py-2 border ${selectedLocation === 'onshore' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'border-slate-200'}`}
                >
                  <MapPin className="w-4 h-4 inline mr-1" /> Onshore
                </button>
                <button
                  onClick={() => setSelectedLocation(selectedLocation === 'offshore' ? null : 'offshore')}
                  className={`flex-1 px-4 py-2 border ${selectedLocation === 'offshore' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'border-slate-200'}`}
                >
                  <MapPin className="w-4 h-4 inline mr-1" /> Offshore
                </button>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedVisa || selectedANZSCO || selectedLocation) && (
            <button
              onClick={() => { setSelectedVisa(null); setSelectedANZSCO(null); setSelectedLocation(null); }}
              className="mt-4 text-sm text-indigo-600 hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Prediction Card */}
        {prediction.sampleSize > 0 && (
          <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 p-8 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">AI Prediction for Your Profile</h2>
                <p className="text-indigo-200 mb-4">Based on {prediction.sampleSize} similar applications (EMA weighted to recent 60 days)</p>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{formatDays(prediction.estimate)}</span>
                  <span className="text-indigo-300">(range: {formatDays(prediction.range.min)} - {formatDays(prediction.range.max)})</span>
                </div>
                
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span>{prediction.confidence}% confidence</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>IQR outliers removed</span>
                  </div>
                </div>
              </div>
              
              <Button className="bg-emerald-500 hover:bg-emerald-600">
                Submit Your Timeline
              </Button>
            </div>
          </div>
        )}

        {/* Reality Check Section */}
        <div className="bg-white border border-slate-200 mb-8">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Reality Check</h2>
            <p className="text-slate-500">Official DHA estimates vs. AI-powered community predictions</p>
          </div>
          
          <div className="divide-y divide-slate-200">
            {visaTypes.map((visa) => {
              const visaPrediction = generatePrediction(mockData, { visaSubclass: visa.code });
              const isSelected = selectedVisa === visa.code;
              
              return (
                <div 
                  key={visa.code} 
                  className={`p-6 flex items-center cursor-pointer hover:bg-slate-50 ${isSelected ? 'bg-indigo-50' : ''}`}
                  onClick={() => setSelectedVisa(isSelected ? null : visa.code)}
                >
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
                      <p className="text-xs text-slate-500">Community AI</p>
                      <p className="text-lg font-bold text-emerald-600">{visaPrediction.sampleSize > 0 ? formatDays(visaPrediction.estimate) : 'N/A'}</p>
                    </div>
                    
                    <div className="text-center w-20">
                      <p className="text-xs text-slate-500">Confidence</p>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="font-medium">{visaPrediction.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ANZSCO Breakdown */}
        {selectedVisa && (
          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-slate-600" />
              <h2 className="font-semibold text-slate-900">Processing Times by Profession ({selectedVisa})</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {anzscoStats
                .filter(stat => mockData.some(d => d.anzscoCode === stat.code && d.visaSubclass === selectedVisa))
                .map(stat => {
                  const professionPrediction = generatePrediction(mockData, { 
                    visaSubclass: selectedVisa, 
                    anzscoCode: stat.code 
                  });
                  
                  return (
                    <div 
                      key={stat.code}
                      className={`p-4 border cursor-pointer ${selectedANZSCO === stat.code ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'}`}
                      onClick={() => setSelectedANZSCO(selectedANZSCO === stat.code ? null : stat.code)}
                    >
                      <p className="text-sm font-medium text-slate-900 truncate">{anzscoProfessions[stat.code] || stat.code}</p>
                      <p className="text-xs text-slate-500">{stat.count} entries</p>
                      <p className="text-lg font-bold text-emerald-600 mt-1">{formatDays(professionPrediction.estimate)}</p>
                    </div>
                  );
                })
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
