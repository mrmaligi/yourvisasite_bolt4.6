import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Bookmark, ArrowUpRight, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import type { Visa } from '../../types/database';

interface SavedVisaWithDetails {
  id: string;
  visa_id: string;
  created_at: string;
  visa: Visa;
}

export function SavedVisasV2() {
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

  const handleRemove = async (savedId: string) => {
    try {
      await supabase.from('saved_visas').delete().eq('id', savedId);
      setSavedVisas((prev) => prev.filter((sv) => sv.id !== savedId));
    } catch (err) {
      console.error('Error removing saved visa:', err);
    }
  };

  return (
    <>
      <Helmet>
        <title>Saved Visas | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-3">
              <Bookmark className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Saved Visas</h1>
                <p className="text-slate-600">Your bookmarked visa options</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="text-center py-12 text-slate-600">Loading saved visas...</div>
          ) : savedVisas.length === 0 ? (
            <div className="bg-white border border-slate-200 p-12 text-center">
              <Bookmark className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No saved visas yet</h3>
              <p className="text-slate-600 mb-6">Bookmark visas you're interested in to compare them later.</p>
              <Link to="/visas">
                <Button variant="primary">Browse Visas</Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedVisas.map((saved) => (
                <div key={saved.id} className="bg-white border border-slate-200 p-6 hover:border-blue-400 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="secondary">{saved.visa.subclass}</Badge>
                    <button
                      onClick={() => handleRemove(saved.id)}
                      className="p-2 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-2">{saved.visa.name}</h3>
                  
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {saved.visa.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Saved {new Date(saved.created_at).toLocaleDateString()}
                    </span>
                    
                    <Link to={`/visas/${saved.visa.slug}`}>
                      <Button variant="outline" size="sm">
                        View
                        <ArrowUpRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
