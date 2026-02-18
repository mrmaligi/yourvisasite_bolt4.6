import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ArrowUpRight, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/Skeleton';
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
  const [removing, setRemoving] = useState<string | null>(null);

  const fetchSaved = async () => {
    if (!user) return;
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
    setLoading(false);
  };

  useEffect(() => {
    fetchSaved();
  }, [user]);

  const handleRemove = async (savedVisaId: string, visaId: string) => {
    setRemoving(savedVisaId);
    await supabase
      .from('saved_visas')
      .delete()
      .eq('user_id', user!.id)
      .eq('visa_id', visaId);
    setSavedVisas((prev) => prev.filter((sv) => sv.id !== savedVisaId));
    setRemoving(null);
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
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
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
        <div className="grid sm:grid-cols-2 gap-4">
          {savedVisas.map((sv) => (
            <Card key={sv.id} hover className="relative group">
              <Link to={`/visas/${sv.visa.id}`}>
                <CardBody className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge>{sv.visa.subclass}</Badge>
                    <Badge variant="info">{sv.visa.country}</Badge>
                  </div>
                  <h3 className="font-semibold text-neutral-900 pr-8">
                    {sv.visa.name}
                  </h3>
                  <p className="text-sm text-neutral-500 line-clamp-2">
                    {sv.visa.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-100">
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
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemove(sv.id, sv.visa_id);
                }}
                disabled={removing === sv.id}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove from saved"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
