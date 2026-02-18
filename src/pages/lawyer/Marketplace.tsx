import { useEffect, useState } from 'react';
import { Store, Plus, Edit, Trash2, Eye, EyeOff, DollarSign, Package } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { EmptyState } from '../../components/ui/EmptyState';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Listing {
  id: string;
  title: string;
  short_description: string;
  price_cents: number;
  listing_type: 'service' | 'product';
  is_active: boolean;
  category_name: string | null;
  created_at: string;
}

export function Marketplace() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    category_id: '',
    price: '',
    listing_type: 'service' as 'service' | 'product',
    duration_minutes: '',
    delivery_days: '',
    is_active: true,
    features: '',
  });

  useEffect(() => {
    if (profile) {
      fetchData();
    }
  }, [profile]);

  const fetchData = async () => {
    if (!profile) return;

    const { data: lawyerProfile } = await supabase
      .schema('lawyer')
      .from('profiles')
      .select('id')
      .eq('profile_id', profile.id)
      .maybeSingle();

    if (!lawyerProfile) {
      setLoading(false);
      return;
    }

    const [listingsRes, categoriesRes] = await Promise.all([
      supabase
        .schema('lawyer')
        .from('marketplace_listings')
        .select('id, title, short_description, price_cents, listing_type, is_active, category_id, created_at')
        .eq('lawyer_id', lawyerProfile.id)
        .order('created_at', { ascending: false }),
      supabase.from('marketplace_categories').select('id, name, icon').order('name'),
    ]);

    if (listingsRes.data) {
      const categoryIds = [...new Set(listingsRes.data.map((l) => l.category_id).filter(Boolean))];
      const { data: categoryDetails } = await supabase
        .from('marketplace_categories')
        .select('id, name')
        .in('id', categoryIds);

      const categoryMap = new Map(categoryDetails?.map((c) => [c.id, c.name]) || []);

      const enriched = listingsRes.data.map((l) => ({
        ...l,
        category_name: l.category_id ? categoryMap.get(l.category_id) || null : null,
      }));

      setListings(enriched);
    }

    setCategories(categoriesRes.data || []);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!profile || !formData.title || !formData.description || !formData.price) {
      toast('error', 'Please fill all required fields');
      return;
    }

    const { data: lawyerProfile } = await supabase
      .schema('lawyer')
      .from('profiles')
      .select('id')
      .eq('profile_id', profile.id)
      .maybeSingle();

    if (!lawyerProfile) return;

    const features = formData.features
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const payload = {
      lawyer_id: lawyerProfile.id,
      title: formData.title,
      description: formData.description,
      short_description: formData.short_description || formData.description.slice(0, 150),
      category_id: formData.category_id || null,
      price_cents: Math.round(parseFloat(formData.price) * 100),
      listing_type: formData.listing_type,
      duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
      delivery_days: formData.delivery_days ? parseInt(formData.delivery_days) : null,
      is_active: formData.is_active,
      features: JSON.stringify(features),
    };

    if (editingId) {
      const { error } = await supabase
        .schema('lawyer')
        .from('marketplace_listings')
        .update(payload)
        .eq('id', editingId);

      if (error) {
        toast('error', 'Failed to update listing');
        return;
      }

      toast('success', 'Listing updated successfully');
    } else {
      const { error } = await supabase.schema('lawyer').from('marketplace_listings').insert(payload);

      if (error) {
        toast('error', 'Failed to create listing');
        return;
      }

      toast('success', 'Listing created successfully');
    }

    setShowModal(false);
    resetForm();
    fetchData();
  };

  const handleEdit = async (id: string) => {
    const { data } = await supabase
      .schema('lawyer')
      .from('marketplace_listings')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (data) {
      setEditingId(id);
      setFormData({
        title: data.title,
        description: data.description,
        short_description: data.short_description || '',
        category_id: data.category_id || '',
        price: (data.price_cents / 100).toString(),
        listing_type: data.listing_type,
        duration_minutes: data.duration_minutes?.toString() || '',
        delivery_days: data.delivery_days?.toString() || '',
        is_active: data.is_active,
        features: Array.isArray(data.features) ? data.features.join('\n') : '',
      });
      setShowModal(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    const { error } = await supabase.schema('lawyer').from('marketplace_listings').delete().eq('id', id);

    if (error) {
      toast('error', 'Failed to delete listing');
      return;
    }

    toast('success', 'Listing deleted');
    fetchData();
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .schema('lawyer')
      .from('marketplace_listings')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      toast('error', 'Failed to update status');
      return;
    }

    toast('success', `Listing ${!currentStatus ? 'activated' : 'deactivated'}`);
    fetchData();
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      short_description: '',
      category_id: '',
      price: '',
      listing_type: 'service',
      duration_minutes: '',
      delivery_days: '',
      is_active: true,
      features: '',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900">Marketplace</h1>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-neutral-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My Marketplace</h1>
          <p className="text-neutral-500 mt-1">Manage your services and products.</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Listing
        </Button>
      </div>

      {listings.length === 0 ? (
        <EmptyState
          icon={Store}
          title="No marketplace listings"
          description="Create your first listing to start offering services or products."
        />
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <CardBody className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-neutral-900">{listing.title}</h3>
                      <Badge variant={listing.is_active ? 'success' : 'default'}>
                        {listing.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      {listing.category_name && (
                        <Badge variant="default" className="text-xs">
                          {listing.category_name}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 line-clamp-1">{listing.short_description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        ${(listing.price_cents / 100).toFixed(2)}
                      </span>
                      <span className="capitalize">{listing.listing_type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleActive(listing.id, listing.is_active)}
                  >
                    {listing.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => handleEdit(listing.id)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => handleDelete(listing.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingId ? 'Edit Listing' : 'Create Listing'}
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{editingId ? 'Update' : 'Create'} Listing</Button>
          </div>
        }
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <Input
            label="Title *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., 60-Minute Visa Consultation"
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of your service or product..."
              rows={4}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <Input
            label="Short Description"
            value={formData.short_description}
            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            placeholder="Brief summary for listing cards"
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (USD) *"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="99.00"
            />

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Type</label>
              <select
                value={formData.listing_type}
                onChange={(e) => setFormData({ ...formData, listing_type: e.target.value as 'service' | 'product' })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="service">Service</option>
                <option value="product">Product</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {formData.listing_type === 'service' && (
              <Input
                label="Duration (minutes)"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                placeholder="60"
              />
            )}
            {formData.listing_type === 'product' && (
              <Input
                label="Delivery Time (days)"
                type="number"
                value={formData.delivery_days}
                onChange={(e) => setFormData({ ...formData, delivery_days: e.target.value })}
                placeholder="3"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Features (one per line)</label>
            <textarea
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="Comprehensive visa assessment&#10;Document checklist&#10;Follow-up email support"
              rows={5}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="is_active" className="text-sm text-neutral-700">
              Publish immediately
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
