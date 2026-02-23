import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, FileText, Briefcase, StickyNote } from 'lucide-react';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Skeleton } from '../../components/ui/Skeleton';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface ClientProfile {
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    created_at: string;
    // Add other profile fields if needed
}

export function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<ClientProfile | null>(null);

  useEffect(() => {
    if (id) {
        fetchClient();
    }
  }, [id]);

  const fetchClient = async () => {
      try {
          // If using mock auth and mock ID, we might need to rely on the interceptor
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          setClient(data);
      } catch (error) {
          console.error('Error fetching client:', error);
      } finally {
          setLoading(false);
      }
  };

  if (loading) {
    return (
        <LawyerDashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-16 h-16 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="w-48 h-8" />
                            <Skeleton className="w-32 h-4" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="w-24 h-10 rounded-lg" />
                        <Skeleton className="w-24 h-10 rounded-lg" />
                    </div>
                </div>
                <div className="space-y-4">
                    <Skeleton className="w-full h-12 rounded-xl" />
                    <Skeleton className="w-full h-64 rounded-xl" />
                </div>
            </div>
        </LawyerDashboardLayout>
    );
  }

  if (!client) {
      return (
          <LawyerDashboardLayout>
              <div className="text-center py-12">
                  <h2 className="text-xl font-bold">Client not found</h2>
              </div>
          </LawyerDashboardLayout>
      );
  }

  return (
    <LawyerDashboardLayout>
      <Helmet>
        <title>{client.full_name} | VisaBuild</title>
      </Helmet>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-2xl font-bold text-primary-700 dark:text-primary-300">
              {client.full_name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{client.full_name}</h1>
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <span>Client ID: {client.id}</span>
                <span>•</span>
                <Badge variant="success">Active</Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">Message</Button>
            <Button>Edit Profile</Button>
          </div>
        </div>

        <Tabs defaultValue="overview">
            <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="cases">Cases</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Contact Information</h2>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                    <Mail className="w-5 h-5 text-neutral-400" />
                                    <div>
                                        <p className="text-xs text-neutral-500">Email</p>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-white">{client.email || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                    <Phone className="w-5 h-5 text-neutral-400" />
                                    <div>
                                        <p className="text-xs text-neutral-500">Phone</p>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-white">{client.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg sm:col-span-2">
                                    <MapPin className="w-5 h-5 text-neutral-400" />
                                    <div>
                                        <p className="text-xs text-neutral-500">Address</p>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-white">N/A</p>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Quick Stats</h2>
                        </CardHeader>
                        <CardBody className="space-y-4">
                             <div className="flex justify-between items-center">
                                <span className="text-neutral-600 dark:text-neutral-400">Total Cases</span>
                                <span className="font-bold text-neutral-900 dark:text-white">--</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <span className="text-neutral-600 dark:text-neutral-400">Open Cases</span>
                                <span className="font-bold text-neutral-900 dark:text-white">--</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <span className="text-neutral-600 dark:text-neutral-400">Documents</span>
                                <span className="font-bold text-neutral-900 dark:text-white">--</span>
                             </div>
                             <div className="pt-4 border-t border-neutral-100 dark:border-neutral-700">
                                <p className="text-xs text-neutral-500">Client since {new Date(client.created_at).toLocaleDateString()}</p>
                             </div>
                        </CardBody>
                    </Card>
                </div>
            </TabsContent>

            <TabsContent value="cases" className="mt-6">
                <Card>
                    <CardBody className="p-8 text-center text-neutral-500">
                        <Briefcase className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
                        <p>No active cases found for this client.</p>
                        <Button variant="secondary" className="mt-4">Create New Case</Button>
                    </CardBody>
                </Card>
            </TabsContent>

             <TabsContent value="documents" className="mt-6">
                <Card>
                    <CardBody className="p-8 text-center text-neutral-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
                        <p>No documents shared yet.</p>
                        <Button variant="secondary" className="mt-4">Upload Document</Button>
                    </CardBody>
                </Card>
            </TabsContent>

             <TabsContent value="notes" className="mt-6">
                <Card>
                    <CardBody className="p-8 text-center text-neutral-500">
                        <StickyNote className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
                        <p>No notes added yet.</p>
                        <Button variant="secondary" className="mt-4">Add Note</Button>
                    </CardBody>
                </Card>
            </TabsContent>
        </Tabs>
      </div>
    </LawyerDashboardLayout>
  );
}
