import { Users, Plus, Search, Mail, Shield } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserManagementV2() {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', joined: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'active', joined: '2024-02-20' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'User', status: 'inactive', joined: '2024-03-05' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'active', joined: '2024-03-10' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
            <p className="text-slate-600">Manage system users and permissions</p>
          </div>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Users', value: '1,240' },
            { label: 'Active', value: '1,180' },
            { label: 'Inactive', value: '60' },
            { label: 'Admins', value: '12' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 p-4">
              <p className="text-sm text-slate-600">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200"
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">User</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Role</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Joined</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                          <span className="font-medium text-blue-600">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{user.name}</p>
                          <div className="flex items-center gap-1 text-sm text-slate-500">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{user.joined}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
