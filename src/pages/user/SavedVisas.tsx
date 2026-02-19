import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { FavoriteButton } from '../../components/FavoriteButton';
import type { Visa } from '../../types/database';

interface SavedVisaWithDetails {
  id: string;
  visa_id: string;
  created_at: string;
  visa: Visa;
}

export function SavedVisas() {
  const { user } = useAuth();
  const [savedVisas, setSavedVisas] = useState<SavedVisaWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('saved_visas')
        .select('id, visa_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!data || data.length === 0) {
        setSavedVisas([]);
        setLoading(false);
        return;
      }

      const visaIds = data.map((d) => d.visa_id);
      const { data: visas } = await supabase
        .from('visas')
        .select('*')
        .in('id', visaIds);

      const visaMap = new Map(visas?.map((v) => [v.id, v]) || []);

      const enriched = data
        .filter((d) => visaMap.has(d.visa_id))
        .map((d) => ({
          ...d,
          visa: visaMap.get(d.visa_id)!,
        }));

      setSavedVisas(enriched);
    } catch (err) {
      console.error('Error fetching saved visas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, [user]);

  const handleRemove = async (savedVisaId: string, visaId: string) => {
    await supabase
      .from('saved_visas')
      .delete()
      .eq('user_id', user!.id)
      .eq('visa_id', visaId);
    setSavedVisas((prev) => prev.filter((sv) => sv.id !== savedVisaId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Saved Visas</h1>
          <p className="text-neutral-500 mt-1">
            Visas you've bookmarked for quick access.
          </p>
        </div>
        <Badge variant="info">{savedVisas.length} saved</Badge>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : savedVisas.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved visas"
          description="Browse visas and tap the bookmark icon to save them here for quick reference."
          action={{
            label: 'Browse Visas',
            onClick: () => (window.location.href = '/visas'),
          }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedVisas.map((sv) => (
            <Card key={sv.id} hover className="group flex flex-col h-full relative">
               <div className="absolute top-4 right-4 z-10">
                  <FavoriteButton
                    isSaved={true}
                    onToggle={() => handleRemove(sv.id, sv.visa_id)}
                    className="bg-white/80 backdrop-blur-sm shadow-sm border border-neutral-100 hover:bg-red-50"
                  />
                </div>
              <Link to={`/visas/${sv.visa.id}`} className="flex-1 flex flex-col">
                <CardBody className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 pr-8">
                       <div className="flex items-center gap-2 mb-2">
                        <Badge>{sv.visa.subclass}</Badge>
                      </div>
                      <h3 className="text-lg font-bold text-neutral-900 line-clamp-1" title={sv.visa.name}>
                        {sv.visa.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-500 line-clamp-2">
                    {sv.visa.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-neutral-400 pt-4 border-t border-neutral-100 mt-auto">
                    <span>
                      Saved{' '}
                      {new Date(sv.created_at).toLocaleDateString('en-AU', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </CardBody>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
