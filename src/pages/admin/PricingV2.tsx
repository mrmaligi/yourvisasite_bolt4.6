import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { DollarSign, Save, Tag } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Product {
  id: string;
  visaName: string;
  price: number;
  isActive: boolean;
}

const MOCK_PRODUCTS: Product[] = [
  { id: '1', visaName: 'Partner Visa (820)', price: 4999, isActive: true },
  { id: '2', visaName: 'Skilled Independent (189)', price: 3999, isActive: true },
  { id: '3', visaName: 'Student Visa (500)', price: 1499, isActive: false },
];

export function PricingV2() {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [settings, setSettings] = useState({
    defaultPrice: '49',
    minRate: '50',
    maxRate: '500',
  });

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
                <p className="text-slate-600">Manage pricing and rates</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Platform Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Default Visa Price ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="number"
                      value={settings.defaultPrice}
                      onChange={(e) => setSettings({...settings, defaultPrice: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 border border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Min Hourly Rate ($)</label>
                    <input
                      type="number"
                      value={settings.minRate}
                      onChange={(e) => setSettings({...settings, minRate: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Max Hourly Rate ($)</label>
                    <input
                      type="number"
                      value={settings.maxRate}
                      onChange={(e) => setSettings({...settings, maxRate: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200"
                    />
                  </div>
                </div>

                <Button variant="primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </div>

            <div className="bg-white border border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Product Pricing</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Visa</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Price</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">{product.visaName}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Tag className="w-4 h-4 text-slate-400" />
                            ${product.price}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={product.isActive ? 'success' : 'secondary'}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
