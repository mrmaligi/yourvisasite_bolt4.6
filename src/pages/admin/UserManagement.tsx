import { useEffect, useState } from 'react';
import { Search, Download, Shield, Ban, CheckCircle, MoreHorizontal, Edit, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Loading } from '../../components/ui/Loading';
import { useToast } from '../../components/ui/Toast';
import type { Profile, UserRole } from '../../types/database';

export function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  // Edit Role Modal State
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('user');
  const [showRoleConfirm, setShowRoleConfirm] = useState(false);

  // Disable/Enable Modal State
  const [togglingUser, setTogglingUser] = useState<Profile | null>(null);

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
    } catch (error) {
      console.error('Error fetching users:', error);
      toast('error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (user.role || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleExport = () => {
    const headers = ['ID', 'Name', 'Role', 'Status', 'Joined Date'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(u => [
        u.id,
        `"${u.full_name || ''}"`,
        u.role,
        u.is_active ? 'Active' : 'Disabled',
        new Date(u.created_at).toISOString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleUpdateRole = async () => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', editingUser.id);

      if (error) throw error;

      setUsers(users.map(u => u.id === editingUser.id ? { ...u, role: newRole } : u));
      toast('success', `Role updated to ${newRole}`);
      setEditingUser(null);
      setShowRoleConfirm(false);
    } catch (error) {
      console.error('Error updating role:', error);
      toast('error', 'Failed to update role');
    }
  };

  const handleToggleStatus = async () => {
    if (!togglingUser) return;

    const newStatus = !togglingUser.is_active;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: newStatus })
        .eq('id', togglingUser.id);

      if (error) throw error;

      setUsers(users.map(u => u.id === togglingUser.id ? { ...u, is_active: newStatus } : u));
      toast('success', `User ${newStatus ? 'enabled' : 'disabled'}`);
      setTogglingUser(null);
    } catch (error) {
      console.error('Error toggling status:', error);
      toast('error', 'Failed to update status');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-neutral-900">User Management</h1>
        <Button variant="secondary" onClick={handleExport} className="flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name or role..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value as any); setPage(1); }}
          className="px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="lawyer">Lawyer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-neutral-200 shadow-sm bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-neutral-600">Name</th>
              <th className="px-6 py-4 font-semibold text-neutral-600">Email</th>
              <th className="px-6 py-4 font-semibold text-neutral-600">Role</th>
              <th className="px-6 py-4 font-semibold text-neutral-600">Status</th>
              <th className="px-6 py-4 font-semibold text-neutral-600">Joined</th>
              <th className="px-6 py-4 font-semibold text-neutral-600">Last Sign In</th>
              <th className="px-6 py-4 font-semibold text-neutral-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-neutral-500">
                  No users found matching your filters.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs uppercase">
                        {user.full_name ? user.full_name[0] : 'U'}
                      </div>
                      {user.full_name || 'Unnamed User'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-500 italic">Hidden</td>
                  <td className="px-6 py-4">
                    <Badge variant={user.role === 'admin' ? 'danger' : user.role === 'lawyer' ? 'warning' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.is_active ? 'success' : 'neutral'}>
                      {user.is_active ? 'Active' : 'Disabled'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-neutral-500 italic">N/A</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { setEditingUser(user); setNewRole(user.role); }}
                        title="Edit Role"
                      >
                        <Edit className="w-4 h-4 text-neutral-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setTogglingUser(user)}
                        title={user.is_active ? 'Disable Account' : 'Enable Account'}
                      >
                        {user.is_active ? (
                          <Ban className="w-4 h-4 text-red-600" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-neutral-600 px-2">
          <span>Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => { setEditingUser(null); setShowRoleConfirm(false); }}
        title="Edit User Role"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setEditingUser(null); setShowRoleConfirm(false); }}>Cancel</Button>
            <Button onClick={() => {
              if (newRole === 'admin' && !showRoleConfirm) {
                setShowRoleConfirm(true);
              } else {
                handleUpdateRole();
              }
            }}>
              {showRoleConfirm ? 'Confirm Promotion' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-neutral-600">
            Changing role for <span className="font-semibold">{editingUser?.full_name}</span>.
          </p>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Select Role</label>
            <select
              value={newRole}
              onChange={(e) => { setNewRole(e.target.value as UserRole); setShowRoleConfirm(false); }}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="user">User</option>
              <option value="lawyer">Lawyer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {showRoleConfirm && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg text-amber-800 border border-amber-200 mt-4">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold">Warning: Admin Privileges</p>
                <p>You are about to promote this user to an Admin. They will have full access to the system. Are you sure?</p>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Toggle Status Modal */}
      <Modal
        isOpen={!!togglingUser}
        onClose={() => setTogglingUser(null)}
        title={togglingUser?.is_active ? 'Disable User Account' : 'Enable User Account'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setTogglingUser(null)}>Cancel</Button>
            <Button
              variant={togglingUser?.is_active ? 'danger' : 'primary'} // Use 'danger' for disable, 'primary' for enable
              onClick={handleToggleStatus}
            >
              {togglingUser?.is_active ? 'Disable Account' : 'Enable Account'}
            </Button>
          </>
        }
      >
        <p className="text-neutral-600">
          Are you sure you want to {togglingUser?.is_active ? 'disable' : 'enable'} the account for <span className="font-semibold">{togglingUser?.full_name}</span>?
          {togglingUser?.is_active && " They will no longer be able to sign in."}
        </p>
      </Modal>
    </div>
  );
}
