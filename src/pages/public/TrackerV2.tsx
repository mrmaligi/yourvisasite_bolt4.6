import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { TrendingUp, Search, Clock, BarChart3, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

interface TrackerStat {
  visa_id: string;
  visa_name: string;
  visa_subclass: string;
  category: string;
  avg_days: number;
  total_entries: number;
  last_updated: string;
}

export function TrackerV2() {
  const [stats, setStats] = useState<TrackerStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Get tracker stats with visa info
      const { data, error } = await supabase
        .from('tracker_stats')
        .select(`
          visa_id,
          avg_days,
          total_entries,
          last_updated,
          visas:visa_id(name, subclass, category)
        `)
        .order('avg_days', { ascending: true });

      if (error) throw error;

      const formatted: TrackerStat[] = (data || []).map((item: any) => ({
        visa_id: item.visa_id,
        visa_name: item.visas?.name || 'Unknown Visa',
        visa_subclass: item.visas?.subclass || '',
        category: item.visas?.category || 'Other',
        avg_days: item.avg_days || 0,
        total_entries: item.total_entries || 0,
        last_updated: item.last_updated
      }));

      setStats(formatted);
    } catch (err) {
      console.error('Error fetching tracker stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(stats.map(s => s.category)))];

  const filteredStats = stats.filter(stat => {
    const matchesSearch = !search || 
      stat.visa_name.toLowerCase().includes(search.toLowerCase()) ||
      stat.visa_subclass.includes(search);
    
    const matchesCategory = category === 'all' || stat.category === category;
    
    return matchesSearch && matchesCategory;
  });

  const getSpeedLabel = (days: number) => {
    if (days <= 90) return { label: 'Fast', color: 'bg-green-100 text-green-700 border-green-300' };
    if (days <= 180) return { label: 'Moderate', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' };
    return { label: 'Slow', color: 'bg-red-100 text-red-700 border-red-300' };
  };

  return (
    <>
      <Helmet>
        <title>Processing Time Tracker | VisaBuild</title>
        <meta name="description" content="Track real visa processing times from actual applicants." />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <Badge variant="primary" className="bg-blue-600">Community Data</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Processing Time Tracker</h1>
            <p className="text-lg text-slate-300 max-w-2xl">
              Real processing times from actual visa applicants. Updated daily by our community.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview - SQUARE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-slate-600">Average Time</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">
                {stats.length > 0 
                  ? Math.round(stats.reduce((acc, s) => acc + s.avg_days, 0) / stats.length)
                  : 0} days
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span className="text-slate-600">Total Entries</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">
                {stats.reduce((acc, s) => acc + s.total_entries, 0).toLocaleString()}
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-slate-600">Visas Tracked</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.length}</div>
            </div>
          </div>

          {/* Filters - SQUARE */}
          <div className="bg-white border border-slate-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by visa name or subclass..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 border border-slate-300 bg-white text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.filter(c => c !== 'all').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="text-center py-12">Loading tracker data...</div>
          ) : filteredStats.length === 0 ? (
            <div className="text-center py-12 bg-white border border-slate-200">
              <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No tracking data found.</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 bg-slate-100 border-b border-slate-200 text-sm font-medium text-slate-700">
                <div className="col-span-5">Visa Type</div>
                <div className="col-span-2 text-center">Subclass</div>
                <div className="col-span-2 text-center">Avg. Days</div>
                <div className="col-span-2 text-center">Speed</div>
                <div className="col-span-1"></div>
              </div>

              <div className="divide-y divide-slate-200">
                {filteredStats.map((stat) => {
                  const speed = getSpeedLabel(stat.avg_days);
                  return (
                    <Link
                      key={stat.visa_id}
                      to={`/tracker/${stat.visa_subclass}`}
                      className="grid grid-cols-12 gap-4 p-4 hover:bg-slate-50 transition-colors items-center group"
                    >
                      <div className="col-span-5">
                        <div className="font-medium text-slate-900">{stat.visa_name}</div>
                        <div className="text-sm text-slate-500">{stat.total_entries} entries</div>
                      </div>

                      <div className="col-span-2 text-center">
                        <Badge variant="secondary">{stat.visa_subclass}</Badge>
                      </div>

                      <div className="col-span-2 text-center">
                        <div className="font-semibold text-slate-900">{stat.avg_days} days</div>
                      </div>

                      <div className="col-span-2 text-center">
                        <span className={`inline-block px-2 py-1 text-xs font-medium border ${speed.color}`}>
                          {speed.label}
                        </span>
                      </div>

                      <div className="col-span-1 flex justify-end">
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submit CTA - SQUARE */}
          <div className="mt-8 bg-blue-600 text-white p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold mb-1">Have a visa application? Contribute your timeline!</h3>
                <p className="text-blue-100 text-sm">Help others by sharing your processing time experience.</p>
              </div>
              <Button 
                variant="secondary" 
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Submit Your Timeline
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
