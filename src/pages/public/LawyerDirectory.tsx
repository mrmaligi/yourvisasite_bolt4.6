import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Clock, Scale, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';

interface LawyerListItem {
  id: string;
  profile_id: string;
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
  const [lawyers, setLawyers] = useState<LawyerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [jurisdictionFilter, setJurisdictionFilter] = useState('');

  useEffect(() => {
    async function fetchLawyers() {
      const { data: lawyerRows } = await supabase
        .schema('lawyer')
        .from('profiles')
        .select('id, profile_id, jurisdiction, practice_areas, years_experience, bio, hourly_rate_cents')
        .eq('is_verified', true)
        .eq('verification_status', 'approved');

      if (!lawyerRows || lawyerRows.length === 0) {
        setLoading(false);
        return;
      }

      const profileIds = lawyerRows.map((l) => l.profile_id);
      const { data: profileRows } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', profileIds);

      const lawyerIds = lawyerRows.map((l) => l.id);
      const now = new Date().toISOString();
      const { data: slotRows } = await supabase
        .schema('lawyer')
        .from('consultation_slots')
        .select('lawyer_id')
        .in('lawyer_id', lawyerIds)
        .eq('is_booked', false)
        .gte('start_time', now);

      const slotCounts: Record<string, number> = {};
      slotRows?.forEach((s) => {
        slotCounts[s.lawyer_id] = (slotCounts[s.lawyer_id] || 0) + 1;
      });

      const profileMap = new Map(profileRows?.map((p) => [p.id, p]) || []);

      const merged: LawyerListItem[] = lawyerRows.map((l) => {
        const p = profileMap.get(l.profile_id);
        return {
          ...l,
          full_name: p?.full_name || null,
          avatar_url: p?.avatar_url || null,
          slot_count: slotCounts[l.id] || 0,
        };
      });

      setLawyers(merged);
      setLoading(false);
    }

    fetchLawyers();
  }, []);

  const jurisdictions = [...new Set(lawyers.map((l) => l.jurisdiction))].sort();

  const filtered = lawyers.filter((l) => {
    const matchSearch =
      !search ||
      l.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      l.practice_areas.some((a) => a.toLowerCase().includes(search.toLowerCase())) ||
      l.jurisdiction.toLowerCase().includes(search.toLowerCase());
    const matchJurisdiction = !jurisdictionFilter || l.jurisdiction === jurisdictionFilter;
    return matchSearch && matchJurisdiction;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-xs font-semibold mb-4">
          <Scale className="w-3.5 h-3.5" />
          Verified Professionals
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Find an Immigration Lawyer</h1>
        <p className="text-neutral-500 max-w-2xl">
          Browse verified immigration lawyers ready to assist with your visa application. Every lawyer on VisaBuild has been credential-checked.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, specialty, or jurisdiction..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        {jurisdictions.length > 1 && (
          <select
            value={jurisdictionFilter}
            onChange={(e) => setJurisdictionFilter(e.target.value)}
            className="input-field w-full sm:w-52"
          >
            <option value="">All Jurisdictions</option>
            {jurisdictions.map((j) => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-6 space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-14 h-14 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-16 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No lawyers found"
          description={lawyers.length === 0
            ? 'No verified lawyers are currently available. Check back soon.'
            : 'No lawyers match your search. Try adjusting your filters.'}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((lawyer) => (
            <Link key={lawyer.id} to={`/lawyers/${lawyer.id}`}>
              <Card hover className="h-full group">
                <CardBody className="space-y-4">
                  <div className="flex items-center gap-4">
                    {lawyer.avatar_url ? (
                      <img
                        src={lawyer.avatar_url}
                        alt=""
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-neutral-100"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                        <Scale className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-semibold text-neutral-900 truncate group-hover:text-primary-700 transition-colors">
                        {lawyer.full_name || 'Immigration Lawyer'}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm text-neutral-500 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{lawyer.jurisdiction}</span>
                      </div>
                    </div>
                  </div>

                  {lawyer.bio && (
                    <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">{lawyer.bio}</p>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    {lawyer.practice_areas.slice(0, 3).map((area) => (
                      <Badge key={area} variant="primary">{area}</Badge>
                    ))}
                    {lawyer.practice_areas.length > 3 && (
                      <Badge>+{lawyer.practice_areas.length - 3}</Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                    <div className="flex items-center gap-4 text-xs text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        {lawyer.years_experience}yr exp
                      </span>
                      {lawyer.slot_count > 0 && (
                        <span className="flex items-center gap-1 text-emerald-600">
                          <Clock className="w-3.5 h-3.5" />
                          {lawyer.slot_count} slot{lawyer.slot_count !== 1 ? 's' : ''} open
                        </span>
                      )}
                    </div>
                    {lawyer.hourly_rate_cents && (
                      <span className="text-sm font-semibold text-neutral-900">
                        ${(lawyer.hourly_rate_cents / 100).toFixed(0)}/hr
                      </span>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
