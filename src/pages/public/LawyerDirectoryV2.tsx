import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, MapPin, Briefcase, Star, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

interface Lawyer {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  jurisdiction: string;
  practice_areas: string[];
  years_experience: number;
  bio: string | null;
  hourly_rate_cents: number | null;
  is_verified: boolean;
}

export function LawyerDirectoryV2() {
  const [searchParams] = useSearchParams();
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(searchParams.get('filter') || '');

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      setLoading(true);
      
      const { data: lawyerData, error } = await supabase
        .from('lawyer_profiles')
        .select(`
          id,
          user_id,
          jurisdiction,
          practice_areas,
          years_experience,
          bio,
          hourly_rate_cents,
          is_verified,
          profiles:profiles(full_name, avatar_url)
        `)
        .eq('is_verified', true)
        .eq('verification_status', 'approved');

      if (error) throw error;

      const formatted: Lawyer[] = (lawyerData || []).map((l: any) => ({
        id: l.id,
        full_name: l.profiles?.full_name || 'Unknown',
        avatar_url: l.profiles?.avatar_url,
        jurisdiction: l.jurisdiction,
        practice_areas: l.practice_areas || [],
        years_experience: l.years_experience,
        bio: l.bio,
        hourly_rate_cents: l.hourly_rate_cents,
        is_verified: l.is_verified
      }));

      setLawyers(formatted);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = !search || 
      lawyer.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      lawyer.jurisdiction?.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = !filter || 
      lawyer.practice_areas?.some(area => 
        area.toLowerCase().includes(filter.toLowerCase())
      );
    
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Helmet>
        <title>Find an Immigration Lawyer | VisaBuild</title>
        <meta name="description" content="Connect with verified immigration lawyers for your Australian visa application." />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Find an Immigration Lawyer</h1>
            <p className="text-slate-600">Connect with verified professionals for your visa journey</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters - SQUARE */}
          <div className="bg-white border border-slate-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by name or location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 bg-white text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Practice Areas</option>
                <option value="partner">Partner Visas</option>
                <option value="skilled">Skilled Visas</option>
                <option value="student">Student Visas</option>
                <option value="business">Business Visas</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 text-slate-600">
            {loading ? 'Loading...' : `${filteredLawyers.length} lawyer${filteredLawyers.length !== 1 ? 's' : ''} found`}
          </div>

          {/* Lawyer Grid */}
          {loading ? (
            <div className="text-center py-12">Loading lawyers...</div>
          ) : filteredLawyers.length === 0 ? (
            <div className="text-center py-12 bg-white border border-slate-200">
              <p className="text-slate-600">No lawyers found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLawyers.map((lawyer) => (
                <Link
                  key={lawyer.id}
                  to={`/lawyers/${lawyer.id}`}
                  className="bg-white border border-slate-200 p-6 hover:border-blue-400 transition-colors group"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar - SQUARE */}
                    <div className="w-16 h-16 bg-slate-200 flex-shrink-0 overflow-hidden">
                      {lawyer.avatar_url ? (
                        <img 
                          src={lawyer.avatar_url} 
                          alt={lawyer.full_name || ''}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-xl">
                            {(lawyer.full_name?.[0] || 'L').toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 truncate">{lawyer.full_name}</h3>
                        {lawyer.is_verified && (
                          <Badge variant="success" className="text-xs px-1.5 py-0.5">Verified</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 text-slate-600 text-sm mb-2">
                        <MapPin className="w-3 h-3" />
                        {lawyer.jurisdiction}
                      </div>

                      <div className="flex items-center gap-1 text-slate-600 text-sm mb-3">
                        <Briefcase className="w-3 h-3" />
                        {lawyer.years_experience} years experience
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {lawyer.practice_areas?.slice(0, 3).map((area, idx) => (
                          <span 
                            key={idx}
                            className="text-xs px-2 py-1 bg-slate-100 text-slate-600 border border-slate-200"
                          >
                            {area}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-900 font-medium">
                          {lawyer.hourly_rate_cents 
                            ? `$${(lawyer.hourly_rate_cents / 100).toFixed(0)}/hr`
                            : 'Contact for rates'
                          }
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
