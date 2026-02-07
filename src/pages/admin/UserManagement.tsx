import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import type { Profile } from '../../types/database';

const roleVariant = {
  user: 'primary' as const,
  lawyer: 'info' as const,
  admin: 'danger' as const,
};

export function UserManagement() {
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

  const columns: Column<Profile>[] = [
    { key: 'name', header: 'Name', render: (r) => r.full_name || 'Unnamed', sortable: true },
    { key: 'role', header: 'Role', render: (r) => <Badge variant={roleVariant[r.role]}>{r.role}</Badge>, sortable: true },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={r.is_active ? 'success' : 'default'}>{r.is_active ? 'Active' : 'Inactive'}</Badge> },
    { key: 'joined', header: 'Joined', render: (r) => new Date(r.created_at).toLocaleDateString(), sortable: true },
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
