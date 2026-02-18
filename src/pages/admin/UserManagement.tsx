import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import type { Profile, UserRole } from '../../types/database';

const roleVariant = {
  user: 'primary' as const,
  lawyer: 'info' as const,
  admin: 'danger' as const,
};

export function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<Profile[]>([]);
  const [filtered, setFiltered] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [form, setForm] = useState<{ role: UserRole; is_active: string }>({ role: 'user', is_active: 'true' });
  const [saving, setSaving] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setUsers(data || []);
        setFiltered(data || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (q: string) => {
    if (!q) {
      setFiltered(users);
      return;
    }
    const lower = q.toLowerCase();
    setFiltered(users.filter((u) =>
      (u.full_name || '').toLowerCase().includes(lower) || u.role.includes(lower)
    ));
  };

  const openEdit = (user: Profile) => {
    setEditing(user);
    setForm({ role: user.role, is_active: user.is_active ? 'true' : 'false' });
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);

    const { error } = await supabase.from('profiles').update({
      role: form.role,
      is_active: form.is_active === 'true',
    }).eq('id', editing.id);

    if (error) {
      toast('error', error.message);
    } else {
      toast('success', 'User updated');
      fetchUsers();
      setEditing(null);
    }
    setSaving(false);
  };

  const columns: Column<Profile>[] = [
    { key: 'name', header: 'Name', render: (r) => r.full_name || 'Unnamed', sortable: true },
    { key: 'role', header: 'Role', render: (r) => <Badge variant={roleVariant[r.role]}>{r.role}</Badge>, sortable: true },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={r.is_active ? 'success' : 'default'}>{r.is_active ? 'Active' : 'Inactive'}</Badge> },
    { key: 'joined', header: 'Joined', render: (r) => new Date(r.created_at).toLocaleDateString(), sortable: true },
    { key: 'actions', header: '', render: (r) => <Button size="sm" variant="ghost" onClick={() => openEdit(r)}>Edit</Button> },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">User Management</h1>
      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(r) => r.id}
        loading={loading}
        searchable
        searchPlaceholder="Search users..."
        onSearch={handleSearch}
      />

      <Modal
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        title={`Edit User: ${editing?.full_name || 'Unnamed'}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
            <Button loading={saving} onClick={handleSave}>Save Changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: (e.target as HTMLSelectElement).value as UserRole })}
            options={[
              { value: 'user', label: 'User' },
              { value: 'lawyer', label: 'Lawyer' },
              { value: 'admin', label: 'Admin' },
            ]}
          />
          <Select
            label="Status"
            value={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: (e.target as HTMLSelectElement).value })}
            options={[
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Inactive' },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}
