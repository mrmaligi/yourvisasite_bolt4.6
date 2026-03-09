import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Store, ShoppingCart, Clock, Star, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'service' | 'product';
  lawyerName: string;
  rating: number;
  reviewCount: number;
  category: string;
}

const MOCK_LISTINGS: Listing[] = [
  { id: '1', title: 'Visa Consultation', description: '30-minute consultation with experienced lawyer', price: 15000, type: 'service', lawyerName: 'Jane Doe', rating: 4.9, reviewCount: 45, category: 'Consultation' },
  { id: '2', title: 'Document Review', description: 'Complete document review and feedback', price: 25000, type: 'service', lawyerName: 'John Smith', rating: 4.8, reviewCount: 32, category: 'Services' },
  { id: '3', title: 'Visa Guide eBook', description: 'Comprehensive guide to partner visas', price: 4900, type: 'product', lawyerName: 'VisaBuild', rating: 4.7, reviewCount: 128, category: 'Products' },
];

const CATEGORIES = ['All', 'Consultation', 'Services', 'Products'];

export function MarketplaceV2() {
  const [listings] = useState<Listing[]>(MOCK_LISTINGS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredListings = listings.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || l.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>Marketplace | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Marketplace</h1>
                <p className="text-slate-600">Find services and products from verified lawyers</p>
              </div>
              <Button variant="outline">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border border-slate-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200"
                />
              </div>
              
              <div className="flex gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="bg-white border border-slate-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant={listing.type === 'service' ? 'primary' : 'secondary'}>
                      {listing.type}
                    </Badge>
                    
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-slate-600">{listing.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{listing.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{listing.description}</p>

                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                    <Store className="w-4 h-4" />
                    {listing.lawyerName}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div>
                      <p className="text-2xl font-bold text-slate-900">${(listing.price / 100).toFixed(0)}</p>
                      <p className="text-sm text-slate-500">{listing.reviewCount} reviews</p>
                    </div>
                    
                    <Button variant="primary" size="sm">
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
