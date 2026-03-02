import { useEffect, useState } from 'react';
import { Save, RefreshCw, ToggleLeft, ToggleRight, Globe, DollarSign, Settings2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';

interface PlatformSettings {
  site_name: string;
  site_tagline: string;
  default_currency: string;
  premium_price_cents: number;
  consultation_commission_pct: number;
  tracker_min_entries: number;
  support_email: string;
  countries_enabled: string[];
  features: {
    tracker_enabled: boolean;
    marketplace_enabled: boolean;
    consultations_enabled: boolean;
    news_enabled: boolean;
    premium_enabled: boolean;
  };
}

const DEFAULT_SETTINGS: PlatformSettings = {
  site_name: 'VisaBuild',
  site_tagline: 'Your trusted visa application companion',
  default_currency: 'AUD',
  premium_price_cents: 4900,
  consultation_commission_pct: 15,
  tracker_min_entries: 5,
  support_email: 'support@visabuild.com.au',
  countries_enabled: ['Australia', 'Canada', 'United Kingdom'],
  features: {
    tracker_enabled: true,
    marketplace_enabled: true,
    consultations_enabled: true,
    news_enabled: true,
    premium_enabled: true,
  },
};

const AVAILABLE_COUNTRIES = [
  'Australia',
  'Canada',
  'United Kingdom',
  'United States',
  'New Zealand',
  'Germany',
  'Ireland',
];

export function AdminSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('platform_settings')
      .select('key, value');

    if (data) {
      const mapped: Record<string, unknown> = {};
      data.forEach((row) => {
        mapped[row.key] = row.value;
      });
      setSettings({
        site_name: (mapped.site_name as string) || DEFAULT_SETTINGS.site_name,
        site_tagline: (mapped.site_tagline as string) || DEFAULT_SETTINGS.site_tagline,
        default_currency: (mapped.default_currency as string) || DEFAULT_SETTINGS.default_currency,
        premium_price_cents: (mapped.premium_price_cents as number) || DEFAULT_SETTINGS.premium_price_cents,
        consultation_commission_pct:
          (mapped.consultation_commission_pct as number) || DEFAULT_SETTINGS.consultation_commission_pct,
        tracker_min_entries: (mapped.tracker_min_entries as number) || DEFAULT_SETTINGS.tracker_min_entries,
        support_email: (mapped.support_email as string) || DEFAULT_SETTINGS.support_email,
        countries_enabled: (mapped.countries_enabled as string[]) || DEFAULT_SETTINGS.countries_enabled,
        features: (mapped.features as PlatformSettings['features']) || DEFAULT_SETTINGS.features,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const entries = [
      { key: 'site_name', value: JSON.stringify(settings.site_name) },
      { key: 'site_tagline', value: JSON.stringify(settings.site_tagline) },
      { key: 'default_currency', value: JSON.stringify(settings.default_currency) },
      { key: 'premium_price_cents', value: String(settings.premium_price_cents) },
      { key: 'consultation_commission_pct', value: String(settings.consultation_commission_pct) },
      { key: 'tracker_min_entries', value: String(settings.tracker_min_entries) },
      { key: 'support_email', value: JSON.stringify(settings.support_email) },
      { key: 'countries_enabled', value: JSON.stringify(settings.countries_enabled) },
      { key: 'features', value: JSON.stringify(settings.features) },
    ];

    let hasError = false;
    for (const entry of entries) {
      const { error } = await supabase
        .from('platform_settings')
        .upsert(
          { key: entry.key, value: JSON.parse(entry.value), updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        );
      if (error) {
        hasError = true;
        console.error(`Failed to save ${entry.key}:`, error);
      }
    }

    setSaving(false);
    if (hasError) {
      toast('error', 'Some settings failed to save. Check console for details.');
    } else {
      toast('success', 'Platform settings saved successfully.');
    }
  };

  const toggleFeature = (feature: keyof PlatformSettings['features']) => {
    setSettings((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature],
      },
    }));
  };

  const toggleCountry = (country: string) => {
    setSettings((prev) => {
      const enabled = prev.countries_enabled.includes(country)
        ? prev.countries_enabled.filter((c) => c !== country)
        : [...prev.countries_enabled, country];
      return { ...prev, countries_enabled: enabled };
    });
  };

  const featureLabels: Record<keyof PlatformSettings['features'], { label: string; description: string }> = {
    tracker_enabled: {
      label: 'Processing Time Tracker',
      description: 'Allow users to submit and view community processing times',
    },
    marketplace_enabled: {
      label: 'Lawyer Marketplace',
      description: 'Enable marketplace for lawyers to offer services',
    },
    consultations_enabled: {
      label: 'Consultations',
      description: 'Allow users to book consultations with verified lawyers',
    },
    news_enabled: {
      label: 'Immigration News',
      description: 'Show immigration news articles and updates',
    },
    premium_enabled: {
      label: 'Premium Content',
      description: 'Enable paid visa guide access for users',
    },
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900">Platform Settings</h1>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 bg-neutral-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Platform Settings</h1>
          <p className="text-neutral-500 mt-1">Configure your VisaBuild platform.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={fetchSettings}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload
          </Button>
          <Button loading={saving} onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save All
          </Button>
        </div>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-neutral-900">General</h2>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Site Name"
              value={settings.site_name}
              onChange={(e) => setSettings((s) => ({ ...s, site_name: e.target.value }))}
            />
            <Input
              label="Support Email"
              type="email"
              value={settings.support_email}
              onChange={(e) => setSettings((s) => ({ ...s, support_email: e.target.value }))}
            />
          </div>
          <Input
            label="Site Tagline"
            value={settings.site_tagline}
            onChange={(e) => setSettings((s) => ({ ...s, site_tagline: e.target.value }))}
          />
        </CardBody>
      </Card>

      {/* Pricing & Financial */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h2 className="font-semibold text-neutral-900">Pricing & Financial</h2>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <Input
              label="Default Currency"
              value={settings.default_currency}
              onChange={(e) => setSettings((s) => ({ ...s, default_currency: e.target.value }))}
              placeholder="AUD"
            />
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Premium Guide Price
              </label>
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 text-sm">$</span>
                <input
                  type="number"
                  value={settings.premium_price_cents / 100}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      premium_price_cents: Math.round(parseFloat(e.target.value || '0') * 100),
                    }))
                  }
                  className="input-field"
                  step="1"
                  min="0"
                />
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Stored as {settings.premium_price_cents} cents
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Consultation Commission
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.consultation_commission_pct}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      consultation_commission_pct: parseInt(e.target.value || '0', 10),
                    }))
                  }
                  className="input-field"
                  min="0"
                  max="100"
                />
                <span className="text-neutral-400 text-sm">%</span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Platform takes {settings.consultation_commission_pct}% of each booking
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Countries */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-neutral-900">Enabled Countries</h2>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            Select which countries appear in the visa search. Only visas from enabled countries will be shown.
          </p>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_COUNTRIES.map((country) => {
              const isEnabled = settings.countries_enabled.includes(country);
              return (
                <button
                  key={country}
                  onClick={() => toggleCountry(country)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    isEnabled
                      ? 'bg-primary-50 border-primary-200 text-primary-700'
                      : 'bg-white border-neutral-200 text-neutral-400 hover:border-neutral-300'
                  }`}
                >
                  {country}
                  {isEnabled && <Badge variant="success" className="ml-2 text-xs">ON</Badge>}
                </button>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-neutral-900">Feature Toggles</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Enable or disable platform features. Changes take effect after saving.
          </p>
        </CardHeader>
        <CardBody className="divide-y divide-neutral-100">
          {(Object.keys(featureLabels) as Array<keyof PlatformSettings['features']>).map((key) => (
            <div key={key} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <p className="font-medium text-neutral-900">{featureLabels[key].label}</p>
                <p className="text-sm text-neutral-500">{featureLabels[key].description}</p>
              </div>
              <button
                onClick={() => toggleFeature(key)}
                className="flex-shrink-0 ml-4"
                aria-label={`Toggle ${featureLabels[key].label}`}
              >
                {settings.features[key] ? (
                  <ToggleRight className="w-10 h-10 text-primary-600" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-neutral-300" />
                )}
              </button>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Tracker Settings */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-neutral-900">Tracker Configuration</h2>
        </CardHeader>
        <CardBody>
          <div className="max-w-xs">
            <Input
              label="Minimum Entries Before Showing Stats"
              type="number"
              value={String(settings.tracker_min_entries)}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  tracker_min_entries: parseInt(e.target.value || '5', 10),
                }))
              }
              min={1}
            />
            <p className="text-xs text-neutral-400 mt-1">
              Visa processing time stats won't show until at least this many entries exist.
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Sticky Save Bar */}
      <div className="sticky bottom-4 flex justify-end">
        <Button loading={saving} onClick={handleSave} className="shadow-lg">
          <Save className="w-4 h-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
