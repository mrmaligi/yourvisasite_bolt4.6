import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { UserPlus, Trash2 } from 'lucide-react';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Card, CardBody } from '../../components/ui/Card';

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

export function Team() {
  const [members, setMembers] = useState<TeamMember[]>(MOCK_TEAM);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'paralegal' });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const columns: Column<TeamMember>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-medium text-neutral-600 dark:text-neutral-400">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-neutral-900 dark:text-white">{row.name}</p>
            <p className="text-xs text-neutral-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (row) => (
        <Badge variant="secondary" className="capitalize">
            {row.role}
        </Badge>
      ),
    },
    {
        key: 'status',
        header: 'Status',
        render: (row) => (
            <Badge variant={row.status === 'active' ? 'success' : row.status === 'invited' ? 'warning' : 'default'}>
                {row.status}
            </Badge>
        )
    },
    {
        key: 'joinedAt',
        header: 'Joined',
        render: (row) => <span className="text-neutral-500">{new Date(row.joinedAt).toLocaleDateString()}</span>
    },
    {
        key: 'actions',
        header: '',
        render: () => (
            <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        )
    }
  ];

  const handleAddMember = () => {
      // Mock add
      setMembers([...members, {
          id: Date.now().toString(),
          name: newMember.name,
          email: newMember.email,
          role: newMember.role as any,
          status: 'invited',
          joinedAt: new Date().toISOString()
      }]);
      setIsModalOpen(false);
      setNewMember({ name: '', email: '', role: 'paralegal' });
  };

  return (
    <LawyerDashboardLayout>
      <Helmet>
        <title>Team Management | VisaBuild</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Team Management</h1>
            <p className="text-neutral-600 dark:text-neutral-300">Manage your firm's team members and permissions.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </div>

        <Card>
            <CardBody>
                <DataTable
                    columns={columns}
                    data={members}
                    keyExtractor={(row) => row.id}
                    searchable
                    searchPlaceholder="Search team..."
                    loading={loading}
                />
            </CardBody>
        </Card>

        <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Invite Team Member"
            footer={
                <>
                    <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddMember}>Send Invitation</Button>
                </>
            }
        >
            <div className="space-y-4">
                <Input
                    label="Full Name"
                    placeholder="e.g. John Doe"
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                />
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@firm.com"
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                />
                <Select
                    label="Role"
                    value={newMember.role}
                    onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                    options={[
                        { value: 'admin', label: 'Admin (Full Access)' },
                        { value: 'lawyer', label: 'Lawyer (Case Access)' },
                        { value: 'paralegal', label: 'Paralegal (Limited Access)' },
                    ]}
                />
            </div>
        </Modal>
      </div>
    </LawyerDashboardLayout>
  );
}
