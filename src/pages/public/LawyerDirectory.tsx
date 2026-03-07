import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Briefcase, Clock, Scale, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LawyerCardSkeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';

interface LawyerListItem {
  id: string;
  user_id: string;
  jurisdiction: string;
  practice_areas: string[];
  years_experience: number;
  bio: string | null;
  hourly_rate_cents: number | null;
  full_name: string | null;
  avatar_url: string | null;
  slot_count: number;
}

export function LawyerDirectory() {
  const [searchParams] = useSearchParams();
  const [lawyers, setLawyers] = useState<LawyerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [jurisdictionFilter, setJurisdictionFilter] = useState('');
  const filter = searchParams.get('filter');

  useEffect(() => {
    async function fetchLawyers() {
      try {
        const { data: lawyerRows, error: lawyerError } = await supabase
          .from('lawyer_profiles')
          .select('id, user_id, jurisdiction, practice_areas, years_experience, bio, hourly_rate_cents')
          .eq('is_verified', true)
          .eq('verification_status', 'approved');

        if (lawyerError) {
          console.error('Error fetching lawyers:', lawyerError);
          setLoading(false);
          return;
        }

        if (!lawyerRows || lawyerRows.length === 0) {
          setLawyers([]);
          setLoading(false);
          return;
        }

        const profileIds = lawyerRows.map((l) => l.user_id);
        const { data: profileRows, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', profileIds);

        if (profileError) {
          console.error('Error fetching profiles:', profileError);
        }

        // consultation_slots removed, slots count is 0

        const profileMap = new Map(profileRows?.map((p) => [p.id, p]) || []);

        const merged: LawyerListItem[] = lawyerRows.map((l) => {
          const p = profileMap.get(l.user_id);
          return {
            ...l,
            full_name: p?.full_name || null,
            avatar_url: p?.avatar_url || null,
            slot_count: 0,
          };
        });

        setLawyers(merged);
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLawyers();
  }, []);

  const jurisdictions = [...new Set(lawyers.map((l) => l.jurisdiction))].sort();

  const filtered = lawyers.filter((l) => {
    const matchSearch =
      !search ||
      (l.full_name?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (l.practice_areas || []).some((a) => a.toLowerCase().includes(search.toLowerCase())) ||
      l.jurisdiction.toLowerCase().includes(search.toLowerCase());
    const matchJurisdiction = !jurisdictionFilter || l.jurisdiction === jurisdictionFilter;
    const matchAvailability = filter === 'available' ? l.slot_count > 0 : true;
    return matchSearch && matchJurisdiction && matchAvailability;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-50/50 via-transparent to-transparent dark:from-teal-900/20 rounded-3xl blur-2xl"></div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-full text-xs font-semibold mb-4 border border-teal-100 dark:border-teal-800">
          <Scale className="w-3.5 h-3.5" />
          Verified Professionals
        </div>
        <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-3">Immigration Lawyers</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          Find top-rated immigration lawyers to help with your visa application. Browse by specialization, reviews, and availability.
        </p>
        {filter === 'available' && (
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm border border-emerald-100 dark:border-emerald-800/50 shadow-sm">
            <Clock className="w-4 h-4" />
            Showing lawyers available for immediate consultation
            <Link to="/lawyers" className="ml-2 text-emerald-900 dark:text-emerald-200 hover:underline font-medium">Clear filter</Link>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-10 bg-white dark:bg-neutral-800/50 p-2 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 backdrop-blur-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
          <input
            type="text"
            placeholder="Search by name, specialty, or jurisdiction..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-transparent border-none focus:ring-0 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 outline-none"
          />
        </div>
        <div className="hidden sm:block w-px h-8 bg-neutral-200 dark:bg-neutral-700 self-center"></div>
        {jurisdictions.length > 0 && (
          <select
            value={jurisdictionFilter}
            onChange={(e) => setJurisdictionFilter(e.target.value)}
            className="h-12 px-4 bg-transparent border-none focus:ring-0 text-neutral-900 dark:text-white outline-none w-full sm:w-64 cursor-pointer"
          >
            <option value="" className="dark:bg-neutral-800">All Jurisdictions</option>
            {jurisdictions.map((j) => (
              <option key={j} value={j} className="dark:bg-neutral-800">{j}</option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <LawyerCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-5">
            <Users className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No lawyers available yet</h3>
          <p className="text-sm text-neutral-500 max-w-sm mx-auto mb-6">
            {lawyers.length === 0
              ? 'Are you an immigration lawyer? Join our directory to connect with clients.'
              : 'No lawyers match your search. Try adjusting your filters.'}
          </p>
          {lawyers.length === 0 && (
            <Link to="/register/lawyer">
              <Button>Register as a Lawyer</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((lawyer) => (
            <Link key={lawyer.id} to={`/lawyers/${lawyer.id}`} className="group block h-full">
              <div className="h-full bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-100/50 to-transparent dark:from-teal-900/20 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-110"></div>
                <div className="p-6 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      {lawyer.avatar_url ? (
                        <img
                          src={lawyer.avatar_url}
                          alt=""
                          className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white dark:ring-neutral-800 shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0 ring-4 ring-white dark:ring-neutral-800 shadow-sm">
                          <Scale className="w-7 h-7 text-white" />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-neutral-800 rounded-full"></div>
                    </div>
                    <div className="min-w-0 flex-1 pt-1">
                      <h3 className="font-bold text-lg text-neutral-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {lawyer.full_name || 'Immigration Lawyer'}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        <MapPin className="w-4 h-4 flex-shrink-0 text-neutral-400 dark:text-neutral-500" />
                        <span className="truncate">{lawyer.jurisdiction}</span>
                      </div>
                    </div>
                  </div>

                  {lawyer.bio && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                      {lawyer.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {lawyer.practice_areas.slice(0, 3).map((area) => (
                      <span key={area} className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-700/50 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-medium border border-neutral-200/50 dark:border-neutral-600/50">
                        {area}
                      </span>
                    ))}
                    {lawyer.practice_areas.length > 3 && (
                      <span className="px-2.5 py-1 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-lg text-xs font-medium border border-neutral-200/50 dark:border-neutral-700/50">
                        +{lawyer.practice_areas.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-neutral-100 dark:border-neutral-700/50 mt-auto">
                    <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Briefcase className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        {lawyer.years_experience} Yrs
                      </span>
                    </div>
                    {lawyer.hourly_rate_cents && (
                      <div className="text-right">
                        <span className="text-xs text-neutral-400 dark:text-neutral-500 block mb-0.5">Consultation</span>
                        <span className="text-base font-bold text-neutral-900 dark:text-white">
                          ${(lawyer.hourly_rate_cents / 100).toFixed(0)}<span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">/hr</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
