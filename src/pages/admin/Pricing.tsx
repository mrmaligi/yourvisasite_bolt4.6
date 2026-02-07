import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { useToast } from '../../components/ui/Toast';
import type { Product } from '../../types/database';

export function Pricing() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({ defaultPrice: '49', minRate: '50', maxRate: '500', alpha: '0.3' });
  const [products, setProducts] = useState<(Product & { visa_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('platform_settings').select('*').then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((d) => { map[d.key] = JSON.parse(JSON.stringify(d.value)).value?.toString() || ''; });
        setSettings({
          defaultPrice: map['default_visa_price_cents'] ? String(parseInt(map['default_visa_price_cents']) / 100) : '49',
          minRate: map['min_hourly_rate_cents'] ? String(parseInt(map['min_hourly_rate_cents']) / 100) : '50',
          maxRate: map['max_hourly_rate_cents'] ? String(parseInt(map['max_hourly_rate_cents']) / 100) : '500',
          alpha: map['tracker_alpha'] || '0.3',
        });
      }
    });

    supabase.from('products').select('*, visas(name)').order('updated_at', { ascending: false })
      .then(({ data }) => {
        setProducts((data || []).map((p: Record<string, unknown>) => ({
          ...p,
          visa_name: (p.visas as { name: string } | null)?.name || 'Unknown',
        })) as (Product & { visa_name?: string })[]);
        setLoading(false);
      });
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    const updates = [
      { key: 'default_visa_price_cents', value: { value: Math.round(parseFloat(settings.defaultPrice) * 100) } },
      { key: 'min_hourly_rate_cents', value: { value: Math.round(parseFloat(settings.minRate) * 100) } },
      { key: 'max_hourly_rate_cents', value: { value: Math.round(parseFloat(settings.maxRate) * 100) } },
      { key: 'tracker_alpha', value: { value: parseFloat(settings.alpha) } },
    ];
    for (const u of updates) {
      await supabase.from('platform_settings').update({ value: u.value }).eq('key', u.key);
    }
    toast('success', 'Settings saved');
    setSaving(false);
  };

  const columns: Column<Product & { visa_name?: string }>[] = [
    { key: 'visa', header: 'Visa', render: (r) => r.visa_name || '' },
    { key: 'price', header: 'Price', render: (r) => `$${(r.price_cents / 100).toFixed(0)}` },
    { key: 'active', header: 'Active', render: (r) => r.is_active ? 'Yes' : 'No' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Pricing & Settings</h1>

      <Card>
        <CardHeader><h2 className="font-semibold text-neutral-900">Global Settings</h2></CardHeader>
        <CardBody className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Default Visa Price ($)" value={settings.defaultPrice} onChange={(e) => setSettings({ ...settings, defaultPrice: e.target.value })} />
            <Input label="EWMA Alpha" value={settings.alpha} onChange={(e) => setSettings({ ...settings, alpha: e.target.value })} helperText="0.0-1.0, higher = more responsive" />
            <Input label="Min Hourly Rate ($)" value={settings.minRate} onChange={(e) => setSettings({ ...settings, minRate: e.target.value })} />
            <Input label="Max Hourly Rate ($)" value={settings.maxRate} onChange={(e) => setSettings({ ...settings, maxRate: e.target.value })} />
          </div>
          <div className="flex justify-end">
            <Button loading={saving} onClick={handleSaveSettings}>Save Settings</Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><h2 className="font-semibold text-neutral-900">Per-Visa Pricing</h2></CardHeader>
        <CardBody>
          <DataTable columns={columns} data={products} keyExtractor={(r) => r.id} loading={loading} />
        </CardBody>
      </Card>
    </div>
  );
}
