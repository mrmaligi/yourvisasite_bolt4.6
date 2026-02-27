import { useEffect, useState } from 'react';
import { Plus, Trash2, Tag, ToggleLeft, ToggleRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import type { PromoCode } from '../../types/database';

export function PromoCodeManagement() {
  const { toast } = useToast();
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ code: '', discount_percent: 10, expires_at: '' });

  const fetchCodes = async () => {
    const { data } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false });
    setCodes(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCodes(); }, []);

  const handleCreate = async () => {
    if (!form.code.trim()) {
      toast('error', 'Code is required');
      return;
    }

    const { error } = await supabase.from('promo_codes').insert({
      code: form.code.trim().toUpperCase(),
      discount_percent: form.discount_percent,
      is_active: true,
      expires_at: form.expires_at || null,
    });

    if (error) {
      toast('error', error.message.includes('unique') ? 'Code already exists' : error.message);
      return;
    }

    toast('success', 'Promo code created');
    setShowCreate(false);
    setForm({ code: '', discount_percent: 10, expires_at: '' });
    fetchCodes();
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    await supabase.from('promo_codes').update({ is_active: !currentActive }).eq('id', id);
    toast('success', `Code ${currentActive ? 'deactivated' : 'activated'}`);
    fetchCodes();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('promo_codes').delete().eq('id', id);
    toast('success', 'Promo code deleted');
    fetchCodes();
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Promo Codes</h1>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" />
          Create Code
        </Button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-neutral-200 rounded-xl" />)}
        </div>
      ) : codes.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="No promo codes"
          description="Create your first promo code to offer discounts on premium guides."
          action={{ label: 'Create Code', onClick: () => setShowCreate(true) }}
        />
      ) : (
        <div className="space-y-3">
          {codes.map((code) => {
            const expired = isExpired(code.expires_at);
            return (
              <Card key={code.id}>
                <CardContent className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
                      <Tag className="w-5 h-5 text-accent-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-neutral-900 text-lg tracking-wider">
                          {code.code}
                        </span>
                        {!code.is_active || expired ? (
                          <Badge variant={expired ? 'danger' : 'default'}>
                            {expired ? 'Expired' : 'Inactive'}
                          </Badge>
                        ) : (
                          <Badge variant="success">Active</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
                        <span>{code.discount_percent}% off</span>
                        {code.expires_at && (
                          <span>
                            Expires {new Date(code.expires_at).toLocaleDateString()}
                          </span>
                        )}
                        <span>
                          Created {new Date(code.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(code.id, code.is_active)}
                      className="p-2 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-neutral-700"
                      title={code.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {code.is_active ? (
                        <ToggleRight className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(code.id)}
                      className="p-2 rounded-xl hover:bg-red-50 transition-colors text-neutral-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Promo Code"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            placeholder="e.g. WELCOME20"
          />
          <Input
            label="Discount %"
            type="number"
            min={1}
            max={100}
            value={form.discount_percent}
            onChange={(e) => setForm({ ...form, discount_percent: Number(e.target.value) })}
          />
          <Input
            label="Expiration Date (optional)"
            type="date"
            value={form.expires_at}
            onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
}
