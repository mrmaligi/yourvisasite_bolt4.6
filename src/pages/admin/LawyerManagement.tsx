import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { BUCKETS } from '../../lib/storage';
import { useAuth } from '../../contexts/AuthContext';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import type { LawyerProfile } from '../../types/database';

const statusVariant = {
  pending: 'warning' as const,
  approved: 'success' as const,
  rejected: 'danger' as const,
};

type LawyerWithProfile = LawyerProfile & { full_name?: string };

export function LawyerManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [lawyers, setLawyers] = useState<LawyerWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectTarget, setRejectTarget] = useState<LawyerWithProfile | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchLawyers = async () => {
    const { data: lawyerData } = await supabase
      .from('lawyer_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!lawyerData) {
      setLawyers([]);
      setLoading(false);
      return;
    }

    const userIds = lawyerData.map((l) => l.user_id);
    const { data: userData } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', userIds);

    const userMap = new Map(userData?.map((u) => [u.id, u]) || []);

    const merged = lawyerData.map((l) => ({
      ...l,
      full_name: userMap.get(l.user_id)?.full_name || 'Unknown',
    }));

    setLawyers(merged);
    setLoading(false);
  };

  useEffect(() => { fetchLawyers(); }, []);

  const handleApprove = async (lawyer: LawyerWithProfile) => {
    try {
      // Update lawyer_profiles
      const { error: lawyerError } = await supabase.from('lawyer_profiles').update({
        is_verified: true,
        verification_status: 'approved',
      }).eq('id', lawyer.id);
      
      if (lawyerError) {
        console.error('Error updating lawyer_profiles:', lawyerError);
        toast('error', `Failed to approve lawyer: ${lawyerError.message}`);
        return;
      }
      
      // Also update profiles to mark as verified lawyer
      const { error: profileError } = await supabase.from('profiles').update({
        is_verified: true,
        verification_status: 'approved',
        role: 'lawyer',
      }).eq('id', lawyer.user_id);
      
      if (profileError) {
        console.error('Error updating profiles:', profileError);
        toast('error', `Failed to update profile: ${profileError.message}`);
        return;
      }
      
      // Notify lawyer
      const { error: notifError } = await supabase.from('notifications').insert({
        user_id: lawyer.user_id,
        title: 'Registration Approved',
        body: 'Your lawyer registration has been approved. You can now access your dashboard.',
        type: 'lawyer_approved',
        link: '/lawyer/dashboard',
      });
      
      if (notifError) {
        console.warn('Could not send notification:', notifError);
      }

      try {
        const { error } = await supabase.functions.invoke('verify-lawyer', {
          body: { lawyer_profile_id: lawyer.id, action: 'approve' },
        });
        if (error) throw error;
      } catch (err) {
        console.error('Failed to invoke verify-lawyer:', err);
      }

      toast('success', `Lawyer ${lawyer.full_name || 'approved'} successfully!`);
      fetchLawyers();
    } catch (err: any) {
      console.error('Approval error:', err);
      toast('error', err?.message || 'Failed to approve lawyer');
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    
    await supabase.from('lawyer_profiles').update({
      verification_status: 'rejected',
    }).eq('id', rejectTarget.id);
    
    // Also update profiles
    await supabase.from('profiles').update({
      verification_status: 'rejected',
    }).eq('id', rejectTarget.user_id);
    
    // Notify lawyer
    await supabase.from('notifications').insert({
      user_id: rejectTarget.user_id,
      title: 'Registration Not Approved',
      body: rejectReason || 'Your lawyer registration was not approved. Please contact support for more information.',
      type: 'lawyer_rejected',
      link: '/dashboard',
    });
    
    toast('success', 'Lawyer rejected');
    setRejectTarget(null);
    setRejectReason('');
    fetchLawyers();
  };

  const viewDocument = async (lawyer: LawyerWithProfile) => {
    if (!lawyer.credentials_url) {
      toast('error', 'No verification document available');
      return;
    }

    const { data } = await supabase.storage
      .from(BUCKETS.LAWYER_CREDENTIALS)
      .createSignedUrl(lawyer.credentials_url, 300);

    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast('error', 'Failed to load document');
    }
  };

  const columns: Column<LawyerWithProfile>[] = [
    { key: 'full_name', header: 'Name', render: (r) => r.full_name, sortable: true },
    { key: 'bar_number', header: 'Bar Number', render: (r) => r.bar_number },
    { key: 'jurisdiction', header: 'Jurisdiction', render: (r) => r.jurisdiction },
    { key: 'years_experience', header: 'Experience', render: (r) => `${r.years_experience} years` },
    {
      key: 'verification_status',
      header: 'Status',
      render: (r) => <Badge variant={statusVariant[r.verification_status]}>{r.verification_status}</Badge>
    },
    { key: 'hourly_rate_cents', header: 'Rate', render: (r) => r.hourly_rate_cents ? `$${r.hourly_rate_cents / 100}/hr` : 'Not set' },
    {
      key: 'id',
      header: 'Actions', render: (r) => (
        <div className="flex gap-2">
          {r.credentials_url && (
            <Button size="sm" variant="secondary" onClick={() => viewDocument(r)}>
              View Document
            </Button>
          )}
          {r.verification_status === 'pending' && (
            <>
              <Button size="sm" variant="secondary" onClick={() => handleApprove(r)}>
                Approve
              </Button>
              <Button size="sm" variant="danger" onClick={() => setRejectTarget(r)}>
                Reject
              </Button>
            </>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Lawyer Management</h1>
      <DataTable<LawyerWithProfile> columns={columns} data={lawyers} loading={loading} keyExtractor={(row) => row.id} />
      
      <Modal isOpen={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject Lawyer Registration">
        <div className="space-y-4">
          <p className="text-sm text-neutral-500">Provide a reason for rejection (optional):</p>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Reason for rejection..."
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setRejectTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReject}>
              Reject
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
