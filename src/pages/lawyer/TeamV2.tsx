import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { UserPlus, Trash2, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'lawyer' | 'paralegal';
  status: 'active' | 'invited' | 'disabled';
  joinedAt: string;
}

const MOCK_TEAM: TeamMember[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@lawyer.com', role: 'admin', status: 'active', joinedAt: '2023-01-15' },
  { id: '2', name: 'Michael Chen', email: 'michael@lawyer.com', role: 'lawyer', status: 'active', joinedAt: '2023-03-20' },
  { id: '3', name: 'Jessica Davis', email: 'jessica@lawyer.com', role: 'paralegal', status: 'invited', joinedAt: '2024-02-10' },
];

export function TeamV2() {
  const [members] = useState<TeamMember[]>(MOCK_TEAM);
  const [showModal, setShowModal] = useState(false);

  const stats = {
    total: members.length,
    active: members.filter(m => m.status === 'active').length,
    invited: members.filter(m => m.status === 'invited').length,
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-700',
      lawyer: 'bg-blue-100 text-blue-700',
      paralegal: 'bg-green-100 text-green-700',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium ${colors[role] || 'bg-slate-100 text-slate-700'}`}>
        {role}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'secondary'> = {
      active: 'success',
      invited: 'warning',
      disabled: 'secondary',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <>
      <Helmet>
        <title>Team | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Team</h1>
                <p className="text-slate-600">Manage your team members</p>
              </div>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Members', value: stats.total, icon: Users },
              { label: 'Active', value: stats.active, icon: Users, color: 'text-green-600' },
              { label: 'Invited', value: stats.invited, icon: Users, color: 'text-yellow-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color || 'text-slate-600'}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showModal && (
            <div className="bg-white border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Invite Team Member</h2>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="Name" className="px-3 py-2 border border-slate-200" />
                <input type="email" placeholder="Email" className="px-3 py-2 border border-slate-200" />
              </div>
              <select className="w-full px-3 py-2 border border-slate-200 mb-4">
                <option value="paralegal">Paralegal</option>
                <option value="lawyer">Lawyer</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex gap-2">
                <Button variant="primary">Send Invite</Button>
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Member</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Role</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Joined</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-200 flex items-center justify-center font-medium text-slate-600">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{member.name}</p>
                            <p className="text-xs text-slate-500">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getRoleBadge(member.role)}</td>
                      <td className="px-6 py-4">{getStatusBadge(member.status)}</td>
                      <td className="px-6 py-4 text-slate-600">{member.joinedAt}</td>
                      <td className="px-6 py-4">
                        <Button variant="danger" size="sm">
                          <Trash2 className="w-4 h-4" />
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
    </>
  );
}
