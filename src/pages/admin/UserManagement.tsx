import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { useToast } from '../../components/ui/Toast';
import type { Profile, UserRole } from '../../types/database';

export function UserManagement() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [filtered, setFiltered] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data || []);
      setFiltered(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast('error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

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

  const updateRole = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast('success', 'User role updated successfully');

      const updateState = (prev: Profile[]) =>
        prev.map(u => u.id === userId ? { ...u, role: newRole } : u);

      setUsers(updateState);
      setFiltered(updateState);

    } catch (error) {
      console.error('Error updating role:', error);
      toast('error', 'Failed to update user role');
    }
  };

  const toggleStatus = async (user: Profile) => {
    const newStatus = !user.is_active;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: newStatus })
        .eq('id', user.id);

      if (error) throw error;

      toast('success', `User ${newStatus ? 'activated' : 'deactivated'} successfully`);

      const updateState = (prev: Profile[]) =>
        prev.map(u => u.id === user.id ? { ...u, is_active: newStatus } : u);

      setUsers(updateState);
      setFiltered(updateState);
    } catch (error) {
      console.error('Error updating status:', error);
      toast('error', 'Failed to update user status');
    }
  };

  const columns: Column<Profile>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (r) => (
        <div>
          <div className="font-medium text-neutral-900">{r.full_name || 'Unnamed'}</div>
          <div className="text-xs text-neutral-500">{r.id.slice(0, 8)}...</div>
        </div>
      ),
      sortable: true
    },
    {
      key: 'role',
      header: 'Role',
      render: (r) => (
        <select
          value={r.role}
          onChange={(e) => updateRole(r.id, e.target.value as UserRole)}
          className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 py-1 pl-2 pr-8 bg-white"
        >
          <option value="user">User</option>
          <option value="lawyer">Lawyer</option>
          <option value="admin">Admin</option>
        </select>
      ),
      sortable: true
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <button
          onClick={() => toggleStatus(r)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            r.is_active
              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          }`}
        >
          {r.is_active ? 'Active' : 'Inactive'}
        </button>
      )
    },
    {
      key: 'joined',
      header: 'Joined',
      render: (r) => new Date(r.created_at).toLocaleDateString(),
      sortable: true
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
