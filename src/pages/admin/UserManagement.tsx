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

const ROLE_OPTIONS = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
  // Lawyer role is managed separately via Lawyer profile creation
];

export function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<Profile[]>([]);
  const [filtered, setFiltered] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('user');
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    setUsers(data || []);
    setFiltered(data || []);
    setLoading(false);
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
    setEditingUser(user);
    setNewRole(user.role);
  };

  const handleSaveRole = async () => {
    if (!editingUser) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', editingUser.id);

    setSaving(false);
    if (error) {
      toast('error', 'Failed to update role: ' + error.message);
    } else {
      toast('success', 'User role updated');
      setEditingUser(null);
      fetchUsers();
    }
  };

  const handleToggleStatus = async (user: Profile) => {
    const action = user.is_active ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    const { error } = await supabase
      .from('profiles')
      .update({ is_active: !user.is_active })
      .eq('id', user.id);

    if (error) {
      toast('error', `Failed to ${action} user: ` + error.message);
    } else {
      toast('success', `User ${action}d`);
      fetchUsers();
    }
  };

  const columns: Column<Profile>[] = [
    { key: 'name', header: 'Name', render: (r) => r.full_name || 'Unnamed', sortable: true },
    { key: 'role', header: 'Role', render: (r) => <Badge variant={roleVariant[r.role]}>{r.role}</Badge>, sortable: true },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={r.is_active ? 'success' : 'default'}>{r.is_active ? 'Active' : 'Inactive'}</Badge> },
    { key: 'joined', header: 'Joined', render: (r) => new Date(r.created_at).toLocaleDateString(), sortable: true },
    { key: 'actions', header: 'Actions', render: (r) => (
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={() => openEdit(r)}>Edit Role</Button>
        <Button
          size="sm"
          variant={r.is_active ? 'danger' : 'secondary'}
          className={!r.is_active ? 'bg-emerald-600 text-white hover:bg-emerald-700' : ''}
          onClick={() => handleToggleStatus(r)}
        >
          {r.is_active ? 'Ban' : 'Unban'}
        </Button>
      </div>
    )},
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
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit User Role"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditingUser(null)}>Cancel</Button>
            <Button loading={saving} onClick={handleSaveRole}>Save Changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            Changing the role for <strong>{editingUser?.full_name}</strong>.
          </p>
          <Select
            label="Role"
            value={newRole}
            options={ROLE_OPTIONS}
            onChange={(e) => setNewRole(e.target.value as UserRole)}
          />
          {newRole === 'lawyer' && (
            <p className="text-xs text-amber-600">
              Note: Setting role to 'lawyer' does not automatically create a lawyer profile. This should typically be done via the lawyer registration flow.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
