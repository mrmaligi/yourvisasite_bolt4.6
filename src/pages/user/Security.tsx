import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Key, Smartphone, History, CheckCircle, AlertCircle } from 'lucide-react';
import { UserDashboardLayout } from '@/components/layout/UserDashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';

// Mock data for login history
const LOGIN_HISTORY = [
  { id: '1', date: '2024-03-20 10:30 AM', device: 'Chrome on Windows', location: 'Sydney, Australia', status: 'success' },
  { id: '2', date: '2024-03-19 02:15 PM', device: 'Safari on iPhone', location: 'Melbourne, Australia', status: 'success' },
  { id: '3', date: '2024-03-15 09:45 AM', device: 'Firefox on Mac', location: 'Sydney, Australia', status: 'failed' },
];

export function Security() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const columns = [
    { key: 'date', header: 'Date & Time', render: (row: any) => row.date },
    { key: 'device', header: 'Device', render: (row: any) => row.device },
    { key: 'location', header: 'Location', render: (row: any) => row.location },
    {
      key: 'status',
      header: 'Status',
      render: (row: any) => (
        <Badge variant={row.status === 'success' ? 'success' : 'danger'}>
          {row.status === 'success' ? 'Success' : 'Failed'}
        </Badge>
      )
    },
  ];

  return (
    <UserDashboardLayout>
      <Helmet>
        <title>Security Settings | VisaBuild</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Security Settings</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage your account security and authentication methods.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Password Change */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-neutral-500" />
                Change Password
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input label="Current Password" type="password" placeholder="••••••••" />
              <Input label="New Password" type="password" placeholder="••••••••" />
              <Input label="Confirm New Password" type="password" placeholder="••••••••" />
              <div className="pt-2">
                <Button>Update Password</Button>
              </div>
            </CardBody>
          </Card>

          {/* 2FA */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-neutral-500" />
                Two-Factor Authentication
              </h2>
            </CardHeader>
            <CardBody>
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <Smartphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-white">Authenticator App</h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    Secure your account with TOTP (Time-based One-Time Password) using apps like Google Authenticator or Authy.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-100 dark:border-neutral-700">
                <div className="flex items-center gap-2">
                  {twoFactorEnabled ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-neutral-400" />
                  )}
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <Button
                  variant={twoFactorEnabled ? 'danger' : 'primary'}
                  size="sm"
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                >
                  {twoFactorEnabled ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Login History */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5 text-neutral-500" />
              Recent Login Activity
            </h2>
          </CardHeader>
          <CardBody>
            <DataTable
              columns={columns}
              data={LOGIN_HISTORY}
              keyExtractor={(row) => row.id}
              searchable={false}
            />
          </CardBody>
        </Card>
      </div>
    </UserDashboardLayout>
  );
}
