import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
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

export function LawyerManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [lawyers, setLawyers] = useState<LawyerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectTarget, setRejectTarget] = useState<LawyerProfile | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchLawyers = async () => {
    const { data } = await supabase
      .schema('lawyer')
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    setLawyers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchLawyers(); }, []);

  const handleApprove = async (lawyer: LawyerProfile) => {
    // 1. Update Database
    const { error } = await supabase.schema('lawyer').from('profiles').update({
      is_verified: true,
      verification_status: 'approved',
      verified_at: new Date().toISOString(),
      verified_by: user?.id,
    }).eq('id', lawyer.id);

    if (error) {
      toast('error', 'Failed to update database: ' + error.message);
      return;
    }

    // 2. Call Edge Function
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-lawyer`;
      const session = await supabase.auth.getSession();

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.data.session?.access_token}`,
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ lawyer_profile_id: lawyer.profile_id, action: 'approve' }),
      });

      if (!response.ok) {
        throw new Error(`Edge function failed: ${response.statusText}`);
      }

      toast('success', 'Lawyer approved and notified');
    } catch (err) {
      console.error('Edge function error:', err);
      // We still consider it a success since the DB was updated, but we warn the admin
      toast('warning', 'Lawyer approved, but notification failed.');
    }

    fetchLawyers();
  };

  const handleReject = async () => {
    if (!rejectTarget) return;

    // 1. Update Database
    const { error } = await supabase.schema('lawyer').from('profiles').update({
      verification_status: 'rejected',
      rejection_reason: rejectReason,
      is_verified: false,
    }).eq('id', rejectTarget.id);

    if (error) {
      toast('error', 'Failed to reject: ' + error.message);
      return;
    }

    // 2. Call Edge Function (Optional for rejection, but good practice if needed)
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-lawyer`;
      const session = await supabase.auth.getSession();
       await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.data.session?.access_token}`,
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ lawyer_profile_id: rejectTarget.profile_id, action: 'reject', reason: rejectReason }),
      });
    } catch (err) {
       console.error('Edge function error:', err);
    }

    toast('success', 'Lawyer rejected');
    setRejectTarget(null);
    setRejectReason('');
    fetchLawyers();
  };

  const handleSuspend = async (lawyer: LawyerProfile) => {
    if (!window.confirm(`Are you sure you want to suspend verification for this lawyer? They will lose access to lawyer features.`)) return;

    const { error } = await supabase.schema('lawyer').from('profiles').update({
      is_verified: false,
      verification_status: 'pending', // Reset to pending so they can be reviewed again? Or 'rejected'? Let's say 'pending' or keep 'approved' but is_verified=false?
      // Safest is to set is_verified false. Status can stay approved or move to a 'suspended' state if enum allowed.
      // The type definition has 'pending' | 'approved' | 'rejected'.
      // If we suspend, maybe we should set it to 'rejected' with a reason "Suspended by admin".
    }).eq('id', lawyer.id);

    // Actually, simply setting is_verified = false might be enough depending on RLS, but let's be consistent with status
    await supabase.schema('lawyer').from('profiles').update({
        is_verified: false,
        verification_status: 'rejected',
        rejection_reason: 'Suspended by administrator',
    }).eq('id', lawyer.id);

    if (error) {
      toast('error', 'Failed to suspend lawyer: ' + error.message);
    } else {
      toast('success', 'Lawyer suspended');
      fetchLawyers();
    }
  }

  const viewDocument = async (lawyer: LawyerProfile) => {
    if (!lawyer.verification_document_url) {
      toast('error', 'No verification document available');
      return;
    }

    const { data } = await supabase.storage
      .from('lawyer-verification')
      .createSignedUrl(lawyer.verification_document_url, 300);

    if (data?.signedUrl) {
      // Use window.open and check if it was blocked
      const newWindow = window.open(data.signedUrl, '_blank');
      if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
         toast('warning', 'Popup blocked. Please allow popups for this site.');
      }
    } else {
      toast('error', 'Failed to load document');
    }
  };

  const columns: Column<LawyerProfile>[] = [
    { key: 'bar', header: 'Bar Number', render: (r) => r.bar_number },
    { key: 'jurisdiction', header: 'Jurisdiction', render: (r) => r.jurisdiction },
    { key: 'experience', header: 'Experience', render: (r) => `${r.years_experience} years` },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={statusVariant[r.verification_status]}>{r.verification_status}</Badge> },
    { key: 'rate', header: 'Rate', render: (r) => r.hourly_rate_cents ? `$${r.hourly_rate_cents / 100}/hr` : 'Not set' },
    {
      key: 'actions', header: 'Actions', render: (r) => (
        <div className="flex gap-2">
          {r.verification_document_url && (
            <Button size="sm" variant="ghost" onClick={() => viewDocument(r)}>View Doc</Button>
          )}
          {r.verification_status === 'pending' && (
            <>
              <Button size="sm" onClick={() => handleApprove(r)}>Approve</Button>
              <Button size="sm" variant="danger" onClick={() => setRejectTarget(r)}>Reject</Button>
            </>
          )}
          {r.verification_status === 'approved' && (
             <Button size="sm" variant="danger" onClick={() => handleSuspend(r)}>Suspend</Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Lawyer Management</h1>
      <DataTable columns={columns} data={lawyers} keyExtractor={(r) => r.id} loading={loading} />
      <Modal
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        title="Reject Lawyer"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRejectTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleReject} disabled={!rejectReason}>Confirm Rejection</Button>
          </>
        }
      >
        <Textarea
          label="Rejection Reason"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Provide a reason for rejection..."
        />
      </Modal>
    </div>
  );
}
