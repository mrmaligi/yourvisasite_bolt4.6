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
    await supabase.schema('lawyer').from('profiles').update({
      is_verified: true,
      verification_status: 'approved',
      verified_at: new Date().toISOString(),
      verified_by: user?.id,
    }).eq('id', lawyer.id);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-lawyer`;
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ lawyer_profile_id: lawyer.profile_id, action: 'approve' }),
      });
    } catch {}

    toast('success', 'Lawyer approved');
    fetchLawyers();
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    await supabase.schema('lawyer').from('profiles').update({
      verification_status: 'rejected',
      rejection_reason: rejectReason,
    }).eq('id', rejectTarget.id);
    toast('success', 'Lawyer rejected');
    setRejectTarget(null);
    setRejectReason('');
    fetchLawyers();
  };

  const viewDocument = async (lawyer: LawyerProfile) => {
    if (!lawyer.verification_document_url) {
      toast('error', 'No verification document available');
      return;
    }

    const { data } = await supabase.storage
      .from('lawyer-verification')
      .createSignedUrl(lawyer.verification_document_url, 300);

    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank');
    } else {
      toast('error', 'Failed to load document');
    }
  };

  const columns: Column<LawyerProfile>[] = [
    { key: 'bar', header: 'Bar Number', render: (r) => r.bar_number },
    { key: 'jurisdiction', header: 'Jurisdiction', render: (r) => r.jurisdiction },
    { key: 'experience', header: 'Experience', render: (r) => `${r.years_experience} years` },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <div className="flex flex-col gap-1">
            <Badge variant={statusVariant[r.verification_status]}>{r.verification_status}</Badge>
            {r.verification_status === 'rejected' && r.rejection_reason && (
                <span className="text-xs text-red-600 max-w-[200px] truncate" title={r.rejection_reason}>
                    {r.rejection_reason}
                </span>
            )}
        </div>
      )
    },
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
