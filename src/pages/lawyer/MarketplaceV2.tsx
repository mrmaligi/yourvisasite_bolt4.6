import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Store, Plus, DollarSign, Package } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Listing {
  id: string;
  title: string;
  price: number;
  type: 'service' | 'product';
  isActive: boolean;
  orders: number;
}

const MOCK_LISTINGS: Listing[] = [
  { id: '1', title: 'Initial Consultation', price: 150, type: 'service', isActive: true, orders: 45 },
  { id: '2', title: 'Document Review Package', price: 299, type: 'service', isActive: true, orders: 23 },
  { id: '3', title: 'Visa Application Guide', price: 49, type: 'product', isActive: false, orders: 0 },
];

export function MarketplaceV2() {
  const [listings] = useState<Listing[]>(MOCK_LISTINGS);

  const stats = {
    total: listings.length,
    active: listings.filter(l => l.isActive).length,
    totalOrders: listings.reduce((sum, l) => sum + l.orders, 0),
    revenue: listings.reduce((sum, l) => sum + (l.price * l.orders), 0),
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
                New Listing
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Listings', value: stats.total, icon: Store },
              { label: 'Active', value: stats.active, icon: Package },
              { label: 'Orders', value: stats.totalOrders, icon: DollarSign },
              { label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant={listing.type === 'service' ? 'primary' : 'secondary'}>
                    {listing.type}
                  </Badge>
                  <Badge variant={listing.isActive ? 'success' : 'secondary'}>
                    {listing.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-2">{listing.title}</h3>
                <p className="text-2xl font-bold text-blue-600 mb-4">${listing.price}</p>

                <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                  <span>{listing.orders} orders</span>
                  <span>Revenue: ${(listing.price * listing.orders).toLocaleString()}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                  <Button variant="outline" size="sm" className="flex-1">Preview</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
