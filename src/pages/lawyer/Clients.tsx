import { useEffect, useState } from 'react';
import { Users, Calendar, Phone, Briefcase, FileText, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { ChatInterface } from '../../components/chat/ChatInterface';

interface ClientInfo {
  user_id: string;
  full_name: string | null;
  phone: string | null;
  total_bookings: number;
  last_booking_date: string;
  total_spent_cents: number;
  visa_types: string[];
  shared_documents: {
    id: string;
    file_name: string;
    uploaded_at: string;
  }[];
  bookings: {
    id: string;
    created_at: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  }[];
}

interface SharedDoc {
  id: string;
  file_name: string;
  uploaded_at: string;
  user_id: string;
}

const statusVariant = {
  pending: 'warning' as const,
  confirmed: 'info' as const,
  completed: 'success' as const,
  cancelled: 'default' as const,
};

export function Clients() {
  const { profile } = useAuth();
  const [clients, setClients] = useState<ClientInfo[]>([]);
  const [recentBookings, setRecentBookings] = useState<{
    id: string;
    user_id: string;
    full_name: string | null;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    created_at: string;
    amount_cents: number;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [lawyerProfileId, setLawyerProfileId] = useState<string | null>(null);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [activeChatBookingId, setActiveChatBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;

    const fetchLawyerProfile = async () => {
      const { data } = await supabase
        .schema('lawyer')
        .from('profiles')
        .select('id')
        .eq('user_id', profile.id)
        .maybeSingle();

      if (data) {
        setLawyerProfileId(data.id);
      }
    };

    fetchLawyerProfile();
  }, [profile]);

  useEffect(() => {
    if (!lawyerProfileId) return;

    const fetchClients = async () => {
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id, user_id, amount_cents, status, created_at')
        .eq('lawyer_id', lawyerProfileId);

      if (!bookings || bookings.length === 0) {
        setLoading(false);
        return;
      }

      const userIds = [...new Set(bookings.map(b => b.user_id))];

      // Fetch Profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, phone')
        .in('id', userIds);

      // Fetch Visa Purchases
      const { data: visaPurchases } = await supabase
        .from('user_visa_purchases')
        .select('user_id, visa:visas(name)')
        .in('user_id', userIds);

      // Fetch Shared Documents
      // Note: We need to filter by lawyer_id, then get the document details
      // Since supabase-js types can be tricky with deep joins, we'll cast or be careful
      const { data: sharedDocsRaw } = await supabase
        .from('document_shares')
        .select('document:user_documents(id, file_name, uploaded_at, user_id)')
        .eq('lawyer_id', lawyerProfileId);

      // Filter out any where document might be null and ensure type safety
      const sharedDocs: SharedDoc[] = (sharedDocsRaw || [])
        .flatMap((s: any) => {
             const doc = s.document;
             if (Array.isArray(doc)) return doc;
             return doc ? [doc] : [];
        })
        .filter((d: any): d is SharedDoc =>
            d &&
            typeof d === 'object' &&
            'user_id' in d &&
            userIds.includes(d.user_id)
        );

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      // Group Visas by User
      const visaMap = new Map<string, Set<string>>();
      if (visaPurchases) {
        visaPurchases.forEach((p: any) => {
          if (!visaMap.has(p.user_id)) {
            visaMap.set(p.user_id, new Set());
          }
          if (p.visa?.name) {
            visaMap.get(p.user_id)?.add(p.visa.name);
          }
        });
      }

      // Group Documents by User
      const docMap = new Map<string, SharedDoc[]>();
      sharedDocs.forEach((d) => {
         if (!docMap.has(d.user_id)) {
            docMap.set(d.user_id, []);
         }
         docMap.get(d.user_id)?.push(d);
      });


      const clientMap = new Map<string, ClientInfo>();
      bookings.forEach(b => {
        const existing = clientMap.get(b.user_id);
        const prof = profileMap.get(b.user_id);
        const bookingInfo = { id: b.id, created_at: b.created_at, status: b.status as any };

        if (existing) {
          existing.total_bookings += 1;
          existing.total_spent_cents += b.amount_cents;
          if (b.created_at > existing.last_booking_date) {
            existing.last_booking_date = b.created_at;
          }
          existing.bookings.push(bookingInfo);
        } else {
          clientMap.set(b.user_id, {
            user_id: b.user_id,
            full_name: prof?.full_name || null,
            phone: prof?.phone || null,
            total_bookings: 1,
            last_booking_date: b.created_at,
            total_spent_cents: b.amount_cents,
            visa_types: Array.from(visaMap.get(b.user_id) || []),
            shared_documents: docMap.get(b.user_id) || [],
            bookings: [bookingInfo]
          });
        }
      });

      // Sort bookings inside client
       Array.from(clientMap.values()).forEach(client => {
          client.bookings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
       });

      setClients(Array.from(clientMap.values()).sort((a, b) =>
        new Date(b.last_booking_date).getTime() - new Date(a.last_booking_date).getTime()
      ));

      const { data: recent } = await supabase
        .from('bookings')
        .select('id, user_id, status, created_at, amount_cents')
        .eq('lawyer_id', lawyerProfileId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recent) {
        const recentWithNames = recent.map(r => ({
          ...r,
          full_name: profileMap.get(r.user_id)?.full_name || null,
        }));
        setRecentBookings(recentWithNames as typeof recentBookings);
      }

      setLoading(false);
    };

    fetchClients();
  }, [lawyerProfileId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900">My Clients</h1>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-neutral-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">My Clients</h1>
        <p className="text-neutral-500 mt-1">View and manage your client relationships.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-neutral-800">Client List</h2>
          {clients.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No clients yet"
              description="Your clients will appear here once they book consultations with you."
            />
          ) : (
            <div className="space-y-3">
              {clients.map((client) => (
                <Card key={client.user_id}>
                  <CardBody>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-lg font-semibold text-primary-700">
                            {client.full_name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">
                            {client.full_name || 'Anonymous Client'}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-neutral-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {client.total_bookings} session{client.total_bookings !== 1 ? 's' : ''}
                            </span>
                            {client.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5" />
                                {client.phone}
                              </span>
                            )}
                            {client.visa_types.length > 0 && (
                                <span className="flex items-center gap-1 text-primary-700 font-medium bg-primary-50 px-2 py-0.5 rounded-full text-xs">
                                  <Briefcase className="w-3 h-3" />
                                  {client.visa_types[0]}
                                  {client.visa_types.length > 1 && ` +${client.visa_types.length - 1}`}
                                </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-neutral-900">
                          ${(client.total_spent_cents / 100).toFixed(0)}
                        </p>
                        <p className="text-xs text-neutral-400">
                          Last: {new Date(client.last_booking_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Expandable Section */}
                    {(client.shared_documents.length > 0 || client.bookings.length > 0) && (
                        <div className="mt-4 pt-4 border-t border-neutral-100">
                             <button
                                onClick={() => setExpandedClient(expandedClient === client.user_id ? null : client.user_id)}
                                className="flex items-center gap-2 text-sm text-neutral-600 hover:text-primary-600 transition-colors w-full"
                             >
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <FileText className="w-4 h-4" />
                                        <span className="font-medium">{client.shared_documents.length} Document{client.shared_documents.length !== 1 ? 's' : ''}</span>
                                    </span>
                                </div>
                                {expandedClient === client.user_id ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
                             </button>

                             {expandedClient === client.user_id && (
                                 <div className="mt-3 space-y-4 pl-6 animate-in slide-in-from-top-2">
                                    {/* Bookings List */}
                                    <div>
                                        <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Consultations</h4>
                                        <div className="space-y-2">
                                            {client.bookings.map(booking => (
                                                <div key={booking.id} className="bg-neutral-50 rounded-lg p-3 border border-neutral-100">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-neutral-900">
                                                                {new Date(booking.created_at).toLocaleDateString()}
                                                            </span>
                                                            <Badge variant={statusVariant[booking.status]} className="text-[10px] px-1.5 py-0">
                                                                {booking.status}
                                                            </Badge>
                                                        </div>
                                                        <Button
                                        size="sm"
                                        className="text-xs px-2 py-1 h-auto"
                                                            variant={activeChatBookingId === booking.id ? "primary" : "secondary"}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveChatBookingId(activeChatBookingId === booking.id ? null : booking.id);
                                                            }}
                                                        >
                                                            <MessageSquare className="w-3 h-3 mr-1" />
                                                            {activeChatBookingId === booking.id ? 'Close' : 'Chat'}
                                                        </Button>
                                                    </div>
                                                    {activeChatBookingId === booking.id && (
                                                         <div className="mt-2 bg-white rounded border border-neutral-200">
                                                             <ChatInterface bookingId={booking.id} />
                                                         </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Documents List */}
                                    {client.shared_documents.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Shared Documents</h4>
                                             {client.shared_documents.map(doc => (
                                                 <div key={doc.id} className="flex items-center justify-between text-sm p-2 bg-neutral-50 rounded-lg mb-2">
                                                     <span className="text-neutral-700 truncate">{doc.file_name}</span>
                                                     <span className="text-xs text-neutral-400 whitespace-nowrap">{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                                                 </div>
                                             ))}
                                        </div>
                                    )}
                                 </div>
                             )}
                        </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-800">Recent Bookings</h2>
          {recentBookings.length === 0 ? (
            <Card>
              <CardBody>
                <p className="text-sm text-neutral-500 text-center py-4">
                  No recent bookings
                </p>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardBody className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-neutral-900 text-sm">
                        {booking.full_name || 'Anonymous'}
                      </p>
                      <Badge variant={statusVariant[booking.status]} className="text-xs">
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-neutral-400 mt-2">
                      <div className="flex gap-4">
                          <span>{new Date(booking.created_at).toLocaleDateString()}</span>
                          <span>${(booking.amount_cents / 100).toFixed(0)}</span>
                      </div>
                      <Button
                        size="sm"
                        variant={activeChatBookingId === booking.id ? "primary" : "ghost"}
                        className={activeChatBookingId === booking.id ? "" : "text-primary-600 hover:text-primary-700 p-0 h-auto"}
                        onClick={() => setActiveChatBookingId(activeChatBookingId === booking.id ? null : booking.id)}
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Chat
                      </Button>
                    </div>
                    {activeChatBookingId === booking.id && (
                        <div className="mt-3 border-t border-neutral-100 pt-3">
                            <ChatInterface bookingId={booking.id} />
                        </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
