import { useEffect, useState } from 'react';
import { Store, ShoppingCart, Clock, Calendar, Check, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Review {
  rating: number;
  title: string;
  comment: string | null;
  user_name: string | null;
  created_at: string;
}

interface Listing {
  id: string;
  lawyer_id: string;
  title: string;
  description: string;
  short_description: string | null;
  category_id: string | null;
  category_name: string | null;
  price_cents: number;
  listing_type: 'service' | 'product';
  duration_minutes: number | null;
  delivery_days: number | null;
  features: string[];
  lawyer_name: string | null;
  lawyer_jurisdiction: string | null;
  average_rating: number | null;
  review_count: number;
  reviews: Review[];
}

export function Marketplace() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedType]);

  const fetchData = async () => {
    let query = supabase
      .schema('lawyer')
      .from('marketplace_listings')
      .select('id, lawyer_id, title, description, short_description, category_id, price_cents, listing_type, duration_minutes, delivery_days, features')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (selectedCategory !== 'all') {
      query = query.eq('category_id', selectedCategory);
    }

    if (selectedType !== 'all') {
      query = query.eq('listing_type', selectedType);
    }

    const { data: listingsData } = await query;

    if (listingsData && listingsData.length > 0) {
      const lawyerIds = [...new Set(listingsData.map((l) => l.lawyer_id))];
      const categoryIds = [...new Set(listingsData.map((l) => l.category_id).filter(Boolean))];
      const listingIds = listingsData.map((l) => l.id);

      const [lawyersRes, categoriesRes, reviewsRes] = await Promise.all([
        supabase
          .schema('lawyer')
          .from('profiles')
          .select('id, profile_id')
          .in('id', lawyerIds),
        categoryIds.length > 0
          ? supabase.from('marketplace_categories').select('id, name').in('id', categoryIds)
          : { data: [] },
        supabase
          .from('marketplace_reviews')
          .select('listing_id, rating, title, comment, user_id, created_at')
          .in('listing_id', listingIds)
          .order('created_at', { ascending: false }),
      ]);

      if (lawyersRes.data) {
        const profileIds = lawyersRes.data.map((l) => l.profile_id);
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', profileIds);

        const profileMap = new Map(profilesData?.map((p) => [p.id, p.full_name]) || []);
        const lawyerProfileMap = new Map(lawyersRes.data.map((l) => [l.id, profileMap.get(l.profile_id) || 'Unknown']));

        const { data: lawyerDetailsData } = await supabase
          .schema('lawyer')
          .from('profiles')
          .select('id, jurisdiction')
          .in('id', lawyerIds);

        const lawyerDetailsMap = new Map(lawyerDetailsData?.map((l) => [l.id, l.jurisdiction]) || []);
        const categoryMap = new Map(categoriesRes.data?.map((c) => [c.id, c.name]) || []);

        const reviewUserIds = [...new Set(reviewsRes.data?.map((r) => r.user_id).filter(Boolean) || [])];
        const { data: reviewUsers } = reviewUserIds.length > 0
          ? await supabase.from('profiles').select('id, full_name').in('id', reviewUserIds)
          : { data: [] };
        const reviewUserMap = new Map(reviewUsers?.map((u) => [u.id, u.full_name]) || []);

        const reviewsByListing = new Map<string, Review[]>();
        reviewsRes.data?.forEach((r) => {
          if (!reviewsByListing.has(r.listing_id)) {
            reviewsByListing.set(r.listing_id, []);
          }
          reviewsByListing.get(r.listing_id)!.push({
            rating: r.rating,
            title: r.title,
            comment: r.comment,
            user_name: r.user_id ? reviewUserMap.get(r.user_id) || 'Anonymous' : 'Anonymous',
            created_at: r.created_at,
          });
        });

        const enriched = listingsData.map((l) => {
          const reviews = reviewsByListing.get(l.id) || [];
          const average_rating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : null;

          return {
            ...l,
            features: Array.isArray(l.features) ? l.features : [],
            lawyer_name: lawyerProfileMap.get(l.lawyer_id) || null,
            lawyer_jurisdiction: lawyerDetailsMap.get(l.lawyer_id) || null,
            category_name: l.category_id ? categoryMap.get(l.category_id) || null : null,
            average_rating,
            review_count: reviews.length,
            reviews: reviews.slice(0, 3),
          };
        });

        setListings(enriched);
      }
    } else {
      setListings([]);
    }

    const { data: categoriesData } = await supabase
      .from('marketplace_categories')
      .select('id, name, icon')
      .order('name');

    setCategories(categoriesData || []);
    setLoading(false);
  };

  const handlePurchase = async (listingId: string, price: number) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const listing = listings.find((l) => l.id === listingId);
      if (!listing) throw new Error('Listing not found');

      const { error } = await supabase
        .from('marketplace_purchases')
        .insert({
          user_id: user.id,
          listing_id: listingId,
          lawyer_id: listing.lawyer_id,
          amount_cents: price,
          status: 'completed',
          stripe_payment_id: `demo_${Date.now()}`,
          purchased_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        });

      if (error) throw error;

      alert('Success! Added to your dashboard.');
      navigate('/dashboard/marketplace');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-neutral-200 rounded-2xl" />
            <div className="grid md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-neutral-200 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 mb-6">
            <Store className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Immigration Services Marketplace</h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Browse professional immigration services and products from verified lawyers worldwide.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Button
            variant={selectedCategory === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All Categories
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        <div className="flex gap-2 justify-center mb-8">
          <Button
            variant={selectedType === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedType('all')}
          >
            All Types
          </Button>
          <Button
            variant={selectedType === 'service' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedType('service')}
          >
            Services
          </Button>
          <Button
            variant={selectedType === 'product' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedType('product')}
          >
            Products
          </Button>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-16">
            <Store className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">No listings found</h3>
            <p className="text-neutral-500">Try adjusting your filters to see more results.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-xl transition-shadow flex flex-col">
                <CardBody className="flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="default" className="capitalize text-xs">
                        {listing.listing_type}
                      </Badge>
                      {listing.category_name && (
                        <Badge variant="default" className="text-xs">
                          {listing.category_name}
                        </Badge>
                      )}
                    </div>
                    <span className="text-2xl font-bold text-primary-600">
                      Free
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">{listing.title}</h3>

                  {listing.average_rating !== null && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(listing.average_rating!)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-neutral-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-neutral-700">
                        {listing.average_rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-neutral-500">
                        ({listing.review_count} {listing.review_count === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  )}

                  <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                    {listing.short_description || listing.description}
                  </p>

                  {listing.features && listing.features.length > 0 && (
                    <ul className="space-y-2 mb-4 flex-1">
                      {listing.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-neutral-700">
                          <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {listing.reviews.length > 0 && (
                    <div className="border-t border-neutral-100 pt-3 mb-3">
                      <h4 className="text-xs font-semibold text-neutral-700 mb-2">Recent Reviews</h4>
                      <div className="space-y-2">
                        {listing.reviews.slice(0, 2).map((review, idx) => (
                          <div key={idx} className="bg-neutral-50 rounded-lg p-2">
                            <div className="flex items-center gap-1 mb-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.rating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-neutral-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-xs font-medium text-neutral-800 mb-1">{review.title}</p>
                            {review.comment && (
                              <p className="text-xs text-neutral-600 line-clamp-2">{review.comment}</p>
                            )}
                            <p className="text-xs text-neutral-500 mt-1">- {review.user_name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-neutral-100 pt-4 mt-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xs text-neutral-500">
                        <p className="font-medium text-neutral-700">{listing.lawyer_name}</p>
                        {listing.lawyer_jurisdiction && <p>{listing.lawyer_jurisdiction}</p>}
                      </div>
                      {listing.listing_type === 'service' && listing.duration_minutes && (
                        <div className="flex items-center gap-1 text-xs text-neutral-500">
                          <Clock className="w-3.5 h-3.5" />
                          {listing.duration_minutes} min
                        </div>
                      )}
                      {listing.listing_type === 'product' && listing.delivery_days && (
                        <div className="flex items-center gap-1 text-xs text-neutral-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {listing.delivery_days} days
                        </div>
                      )}
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handlePurchase(listing.id, listing.price_cents)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Get Now
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
