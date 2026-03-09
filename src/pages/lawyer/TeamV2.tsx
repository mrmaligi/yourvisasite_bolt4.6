import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, UserPlus, Trash2, Mail } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'lawyer' | 'paralegal';
  status: 'active' | 'invited';
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
                Add Member
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Member</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Role</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Joined</th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 flex items-center justify-center font-medium text-slate-600">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{member.name}</p>
                            <p className="text-sm text-slate-500">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getRoleBadge(member.role)}</td>
                      <td className="px-6 py-4">
                        <Badge variant={member.status === 'active' ? 'success' : 'warning'}>
                          {member.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{member.joinedAt}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {[
              { label: 'Total Members', value: members.length, icon: Users },
              { label: 'Active', value: members.filter(m => m.status === 'active').length, icon: Users, color: 'text-green-600' },
              { label: 'Invited', value: members.filter(m => m.status === 'invited').length, icon: Mail, color: 'text-yellow-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <stat.icon className={`w-5 h-5 ${stat.color || 'text-slate-600'}`} />
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
