import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Store, Plus, Edit, Trash2, Eye, DollarSign, Package } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Listing {
  id: string;
  title: string;
  shortDescription: string;
  price: number;
  listingType: 'service' | 'product';
  isActive: boolean;
  category: string;
}

const MOCK_LISTINGS: Listing[] = [
  { id: '1', title: 'Visa Consultation', shortDescription: '30-minute consultation', price: 15000, listingType: 'service', isActive: true, category: 'Consultation' },
  { id: '2', title: 'Document Review', shortDescription: 'Complete document review', price: 25000, listingType: 'service', isActive: true, category: 'Services' },
  { id: '3', title: 'Visa Guide', shortDescription: 'PDF guide for applicants', price: 4900, listingType: 'product', isActive: false, category: 'Products' },
];

export function MarketplaceV2() {
  const [listings] = useState<Listing[]>(MOCK_LISTINGS);

  const stats = {
    total: listings.length,
    active: listings.filter(l => l.isActive).length,
    services: listings.filter(l => l.listingType === 'service').length,
    products: listings.filter(l => l.listingType === 'product').length,
  };

  return (
    <>
      <Helmet>
        <title>Marketplace | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Marketplace</h1>
                <p className="text-slate-600">Manage your services and products</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Listing
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Listings', value: stats.total, icon: Store },
              { label: 'Active', value: stats.active, icon: Eye, color: 'text-green-600' },
              { label: 'Services', value: stats.services, icon: Package, color: 'text-blue-600' },
              { label: 'Products', value: stats.products, icon: Package, color: 'text-purple-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <stat.icon className={`w-5 h-5 ${stat.color || 'text-slate-600'}`} />
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Listing</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Type</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Price</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {listings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{listing.title}</p>
                          <p className="text-sm text-slate-500">{listing.shortDescription}</p>
                          <p className="text-xs text-slate-400">{listing.category}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={listing.listingType === 'service' ? 'primary' : 'secondary'}>
                          {listing.listingType}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-900">${(listing.price / 100).toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={listing.isActive ? 'success' : 'secondary'}>
                          {listing.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
