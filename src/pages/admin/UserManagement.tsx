import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import type { Profile } from '../../types/database';

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

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setUsers(data || []);
        setFiltered(data || []);
        setLoading(false);
      });
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

  const handleToggleStatus = async (user: Profile) => {
    const newStatus = !user.is_active;
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: newStatus })
      .eq('id', user.id);

    if (error) {
      toast('error', 'Failed to update user status');
      return;
    }

    toast('success', `User ${newStatus ? 'activated' : 'deactivated'}`);

    const updatedUsers = users.map(u => u.id === user.id ? { ...u, is_active: newStatus } : u);
    setUsers(updatedUsers);

    // Also update filtered list if necessary, preserving the filter logic is complex,
    // but re-applying filter on full list is safer or just map over filtered too
    setFiltered(filtered.map(u => u.id === user.id ? { ...u, is_active: newStatus } : u));
  };

  const columns: Column<Profile>[] = [
    { key: 'name', header: 'Name', render: (r) => r.full_name || 'Unnamed', sortable: true },
    { key: 'role', header: 'Role', render: (r) => <Badge variant={roleVariant[r.role]}>{r.role}</Badge>, sortable: true },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={r.is_active ? 'success' : 'default'}>{r.is_active ? 'Active' : 'Inactive'}</Badge> },
    { key: 'joined', header: 'Joined', render: (r) => new Date(r.created_at).toLocaleDateString(), sortable: true },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <Button
          size="sm"
          variant={r.is_active ? 'danger' : 'secondary'}
          onClick={() => handleToggleStatus(r)}
        >
          {r.is_active ? 'Deactivate' : 'Activate'}
        </Button>
      )
    },
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
    </div>
  );
}
