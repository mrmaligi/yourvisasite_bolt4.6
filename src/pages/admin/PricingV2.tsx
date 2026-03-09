import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { DollarSign, Save, Package } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Product {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
  category: string;
}

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Partner Visa Guide', price: 49, isActive: true, category: 'Guide' },
  { id: '2', name: 'Document Checklist Bundle', price: 29, isActive: true, category: 'Checklist' },
  { id: '3', name: 'Premium Consultation', price: 199, isActive: true, category: 'Service' },
];

export function PricingV2() {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [settings, setSettings] = useState({
    defaultPrice: '49',
    minRate: '50',
    maxRate: '500',
    platformFee: '15',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <>
      <Helmet>
        <title>Pricing | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Pricing</h1>
                <p className="text-slate-600">Manage products and platform pricing</p>
              </div>
              <Button variant="primary" onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Platform Settings */}
            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-5 h-5 text-slate-400" />
                <h2 className="text-lg font-semibold text-slate-900">Platform Settings</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Default Visa Price ($)</label>
                  <input
                    type="number"
                    value={settings.defaultPrice}
                    onChange={(e) => setSettings({ ...settings, defaultPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Min Hourly Rate ($)</label>
                    <input
                      type="number"
                      value={settings.minRate}
                      onChange={(e) => setSettings({ ...settings, minRate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Max Hourly Rate ($)</label>
                    <input
                      type="number"
                      value={settings.maxRate}
                      onChange={(e) => setSettings({ ...settings, maxRate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Platform Fee (%)</label>
                  <input
                    type="number"
                    value={settings.platformFee}
                    onChange={(e) => setSettings({ ...settings, platformFee: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-slate-400" />
                <h2 className="text-lg font-semibold text-slate-900">Products</h2>
              </div>

              <div className="space-y-3">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200">
                    <div>
                      <p className="font-medium text-slate-900">{product.name}</p>
                      <p className="text-sm text-slate-500">{product.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900">${product.price}</span>
                      <Badge variant={product.isActive ? 'success' : 'secondary'}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4">Add Product</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
